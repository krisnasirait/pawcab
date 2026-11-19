import { NextRequest, NextResponse } from "next/server";
import { readdir, readFile, appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import gazetteer from "@/data/bali-places.json";
import { liveScrapeAvailable, liveScrapePlaces } from "@/lib/liveScrape";
import { tokenMatches } from "@/lib/routing";

export interface ApiPlace {
  lat: number;
  lon: number;
  name: string;
  short: string;
  source: "osm" | "local";
}

const BALI_BBOX = {
  minLat: -8.95,
  maxLat: -7.95,
  minLon: 114.25,
  maxLon: 115.8,
};

// Committed scraper dumps live here. Drop any mapScraper `data/*.csv`
// output in this folder (commit + push) and it becomes searchable
// with no code changes and no rebuild of the search logic.
const SCRAPED_DIR = join(process.cwd(), "data", "scraped");

/** Minimal CSV parser handling quoted fields with commas. */
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

function parseCoords(coor: string): { lat: number; lon: number } | null {
  const m = String(coor ?? "").match(
    /(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/,
  );
  if (!m) return null;
  const lat = Number(m[1]);
  const lon = Number(m[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return { lat, lon };
}

function inBali(lat: number, lon: number): boolean {
  return (
    lat >= BALI_BBOX.minLat &&
    lat <= BALI_BBOX.maxLat &&
    lon >= BALI_BBOX.minLon &&
    lon <= BALI_BBOX.maxLon
  );
}

function shorten(name: string): string {
  return name.split(",").slice(0, 3).join(",").trim();
}

function tokenMatch(
  query: string,
  places: Array<{ name: string; address: string }>,
): number[] {
  const hits: number[] = [];
  places.forEach((p, i) => {
    if (tokenMatches(query, p.name, p.address)) hits.push(i);
  });
  return hits.slice(0, 6);
}

async function readScrapedCsvPlaces(): Promise<
  Array<ApiPlace & { sourceQuery: string }>
> {
  try {
    const files = (await readdir(SCRAPED_DIR)).filter((f) =>
      f.endsWith(".csv"),
    );
    const out: Array<ApiPlace & { sourceQuery: string }> = [];
    for (const file of files) {
      const rows = parseCsv(await readFile(join(SCRAPED_DIR, file), "utf8"));
      for (const row of rows) {
        const name = (row.title ?? "").trim();
        const coords = parseCoords(row.coor ?? "");
        if (!name || !coords || !inBali(coords.lat, coords.lon)) continue;
        const address = (row.address ?? "").trim() || name;
        out.push({
          lat: coords.lat,
          lon: coords.lon,
          name: address,
          short: name,
          source: "local",
          sourceQuery: (row.source_query ?? "").trim().toLowerCase(),
        });
      }
    }
    return out;
  } catch {
    return [];
  }
}

async function searchNominatim(query: string): Promise<ApiPlace[]> {
  const params = new URLSearchParams({
    format: "jsonv2",
    addressdetails: "0",
    limit: "6",
    countrycodes: "id",
    viewbox: "114.30,-8.00,115.80,-8.90",
    bounded: "1",
    q: query,
  });
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params.toString()}`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "PawCabFareEstimator/1.0 (hello@thepawcab.com)",
      },
    },
  );
  if (!res.ok) return [];
  const data = (await res.json()) as Array<{
    lat: string;
    lon: string;
    display_name: string;
  }>;
  return data.map((item) => ({
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon),
    name: item.display_name,
    short: shorten(item.display_name),
    source: "osm" as const,
  }));
}

async function persistScrapedPlaces(
  query: string,
  places: Array<{ lat: number; lon: number; name: string; short: string }>,
): Promise<void> {
  // Best-effort self-populating cache: works on long-lived hosts, silently
  // skips on read-only filesystems (e.g. serverless) where the committed
  // CSVs remain the source of truth.
  try {
    await mkdir(SCRAPED_DIR, { recursive: true });
    const file = join(SCRAPED_DIR, "auto.csv");
    let existing = "";
    try {
      existing = await readFile(file, "utf8");
    } catch {
      // No cache file yet; one will be created below with a header.
    }
    const seenCoords = new Set<string>();
    for (const m of existing.matchAll(
      /(-?\d+\.\d+),\s*(-?\d+\.\d+)/g,
    )) {
      seenCoords.add(
        `${Number(m[1]).toFixed(4)},${Number(m[2]).toFixed(4)}`,
      );
    }
    const csvCell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
    let out = existing === "" ? "title,address,coor,source_query\n" : "";
    let added = 0;
    for (const p of places) {
      const key = `${p.lat.toFixed(4)},${p.lon.toFixed(4)}`;
      if (seenCoords.has(key)) continue;
      seenCoords.add(key);
      out += [csvCell(p.short), csvCell(p.name), csvCell(`${p.lat},${p.lon}`), csvCell(query)].join(",") + "\n";
      added += 1;
    }
    if (added > 0) await appendFile(file, out, "utf8");
  } catch {
    // Persistence is a bonus; the live results were already returned.
  }
}

export async function GET(req: NextRequest) {
  const query = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (query.length < 3) {
    return NextResponse.json({ results: [] });
  }

  const [liveSettled, scrapedSettled] = await Promise.allSettled([
    searchNominatim(query),
    readScrapedCsvPlaces(),
  ]);
  const live = liveSettled.status === "fulfilled" ? liveSettled.value : [];
  const scraped =
    scrapedSettled.status === "fulfilled" ? scrapedSettled.value : [];

  const curated = (
    (gazetteer as { places?: Array<{ name: string; address: string; lat: number; lon: number }> })
      .places ?? []
  ).map((p) => ({
    lat: p.lat,
    lon: p.lon,
    name: p.address || p.name,
    short: p.name,
    source: "local" as const,
  }));

  // OSM stays primary; curated + scraped entries fill the gaps.
  // A repeat of a previously scraped query matches instantly on the
  // stored source_query, before fuzzy token matching even runs.
  const normalizedQuery = query.toLowerCase().replace(/\s+/g, " ");
  const local = [...curated, ...scraped];
  const repeatHits = local.filter(
    (p) =>
      "sourceQuery" in p &&
      (p as { sourceQuery: string }).sourceQuery === normalizedQuery,
  );
  const localHits = [
    ...repeatHits,
    ...tokenMatch(
      query,
      local.map((p) => ({ name: p.short, address: p.name })),
    ).map((i) => local[i]),
  ];

  const seen = new Set<string>();
  const results: ApiPlace[] = [];
  const push = (place: ApiPlace) => {
    const key = `${place.lat.toFixed(4)},${place.lon.toFixed(4)}`;
    if (seen.has(key)) return;
    seen.add(key);
    results.push(place);
  };
  for (const place of [...live, ...localHits]) {
    push(place);
    if (results.length >= 8) break;
  }

  // Nothing anywhere: scrape Google live, show what comes back, and save
  // the new rows so the next identical search is instant and offline.
  if (results.length === 0 && liveScrapeAvailable()) {
    const fresh = await liveScrapePlaces(query);
    for (const place of fresh.slice(0, 8)) {
      push({ ...place, source: "local" });
    }
    if (fresh.length > 0) {
      persistScrapedPlaces(query, fresh).catch(() => {});
    }
  }

  return NextResponse.json({ results });
}
