/**
 * Server-only live Google fallback.
 *
 * When Nominatim, the gazetteer, and committed CSV dumps all come back
 * empty, this runs christivn/mapScraper (Python, HTTP-based, seconds per
 * query) as a child process and returns its Bali-filtered rows in the same
 * place shape. No shell is used (argv only), the query is length-capped,
 * every run is time-boxed and killed on timeout, and temp files are
 * removed afterwards.
 *
 * Requires on the host: Python 3.10+ with the scraper deps installed,
 * a local clone of https://github.com/christivn/mapScraper, and
 * MAPSCRAPER_DIR pointing at it. Absent that, this module disables
 * itself and the search simply returns what the static sources have.
 */

import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

export interface ScrapedPlace {
  lat: number;
  lon: number;
  name: string;
  short: string;
}

const BALI_BBOX = {
  minLat: -8.95,
  maxLat: -7.95,
  minLon: 114.25,
  maxLon: 115.8,
};

const SCRAPE_TIMEOUT_MS = 25000;
const MAX_CONCURRENT_SCRAPES = 2;

let runningScrapes = 0;

function scraperDir(): string | null {
  const dir = process.env.MAPSCRAPER_DIR?.trim();
  return dir ? dir : null;
}

export function liveScrapeAvailable(): boolean {
  return scraperDir() !== null;
}

function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c === "\r") {
      // handled with \n
    } else {
      field += c;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  const [header, ...body] = rows;
  if (!header) return [];
  return body
    .filter((r) => r.some((cell) => cell.trim() !== ""))
    .map((r) =>
      Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? "").trim()])),
    );
}

function runScraper(
  query: string,
  outputFile: string,
  signal: AbortSignal,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const dir = scraperDir();
    if (!dir) {
      reject(new Error("MapScraper not configured"));
      return;
    }
    const python = process.env.MAPSCRAPER_PYTHON?.trim() || "python3";
    const child = spawn(
      python,
      [
        "main.py",
        "--mode",
        "scrape",
        query,
        "--limit",
        "10",
        "--output-file",
        outputFile,
      ],
      { cwd: dir, stdio: "ignore" },
    );
    const onAbort = () => {
      child.kill("SIGKILL");
      reject(new Error("Scrape aborted"));
    };
    if (signal.aborted) {
      onAbort();
      return;
    }
    signal.addEventListener("abort", onAbort, { once: true });
    child.on("error", (err) => {
      signal.removeEventListener("abort", onAbort);
      reject(err);
    });
    child.on("close", (code) => {
      signal.removeEventListener("abort", onAbort);
      // Exit 0 with "No data to save" still counts as a completed run.
      if (code === 0) resolve();
      else reject(new Error(`Scraper exited with code ${code}`));
    });
  });
}

/**
 * Scrape Google Maps for `query` right now. Returns Bali-filtered places,
 * or [] when nothing matches, the host is not configured, the run times
 * out, or too many scrapes are already in flight (those callers just get
 * the static results instead of queueing).
 */
export async function liveScrapePlaces(query: string): Promise<ScrapedPlace[]> {
  const clean = query.trim().slice(0, 100);
  if (clean.length < 3) return [];
  if (!liveScrapeAvailable()) return [];
  if (runningScrapes >= MAX_CONCURRENT_SCRAPES) return [];

  runningScrapes += 1;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SCRAPE_TIMEOUT_MS);
  const workdir = await mkdtemp(join(tmpdir(), "pawcab-scrape-"));
  const outputFile = join(workdir, "results.csv");

  try {
    await runScraper(clean, outputFile, controller.signal);
    let text = "";
    try {
      text = await readFile(outputFile, "utf8");
    } catch {
      return [];
    }
    const places: ScrapedPlace[] = [];
    for (const row of parseCsv(text)) {
      const name = (row.title ?? "").trim();
      const m = (row.coor ?? "").match(
        /(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/,
      );
      if (!name || !m) continue;
      const lat = Number(m[1]);
      const lon = Number(m[2]);
      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lon) ||
        lat < BALI_BBOX.minLat ||
        lat > BALI_BBOX.maxLat ||
        lon < BALI_BBOX.minLon ||
        lon > BALI_BBOX.maxLon
      ) {
        continue;
      }
      const address = (row.address ?? "").trim() || name;
      places.push({
        lat,
        lon,
        name: address,
        short: name,
      });
    }
    return places;
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
    runningScrapes = Math.max(0, runningScrapes - 1);
    await rm(workdir, { recursive: true, force: true });
  }
}
