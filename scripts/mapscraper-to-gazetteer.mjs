#!/usr/bin/env node
/**
 * mapscraper-to-gazetteer.mjs
 *
 * Converts christivn/mapScraper CSV output into PawCab gazetteer entries
 * (src/data/bali-places.json), which the fare estimator searches when
 * OpenStreetMap Nominatim returns nothing.
 *
 * WHY THIS EXISTS:
 * The scraper is a batch CLI tool, not a live API. The workflow is:
 * scrape once -> curate here -> the app searches the static list
 * instantly, offline, on any host.
 *
 * WORKFLOW:
 *   1. Install and run the scraper (needs Python 3.10+):
 *
 *      git clone https://github.com/christivn/mapScraper.git
 *      cd mapScraper
 *      pip install -r requirements.txt
 *      python mapScraperX.py "Atlas Beach Club Bali" \
 *        --lang en --country id --limit 25 \
 *        --output-file data/bali.csv
 *
 *      (One query per run, or use --queries-file queries.txt with one
 *      Google Maps query per line for a batch.)
 *
 *   2. Convert and merge (dry run prints, --write saves):
 *
 *      node scripts/mapscraper-to-gazetteer.mjs data/bali.csv
 *      node scripts/mapscraper-to-gazetteer.mjs data/bali.csv --write
 *
 * RULES APPLIED:
 * - Only rows with parseable "lat,lng" in the `coor` column inside the
 *   Bali service bbox (lat -8.95..-7.95, lon 114.25..115.80) are kept.
 * - Duplicates (same rounded coords or same name, case-insensitive) are
 *   skipped so re-runs are idempotent.
 * - New entries get source "gmaps" to distinguish them from "osm" seeds.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const BALI_BBOX = { minLat: -8.95, maxLat: -7.95, minLon: 114.25, maxLon: 115.8 };

const [, , inputPath, flag] = process.argv;
if (!inputPath) {
  console.error(
    "Usage: node scripts/mapscraper-to-gazetteer.mjs <output.csv> [--write]",
  );
  process.exit(1);
}

const GAZETTEER_PATH = resolve("src/data/bali-places.json");

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function inBali(lat, lon) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= BALI_BBOX.minLat &&
    lat <= BALI_BBOX.maxLat &&
    lon >= BALI_BBOX.minLon &&
    lon <= BALI_BBOX.maxLon
  );
}

/** Minimal CSV parser handling quoted fields with commas and newlines. */
function parseCsv(text) {
  const rows = [];
  let row = [];
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
      // skip, handled with \n
    } else {
      field += c;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  const [header, ...body] = rows;
  return body
    .filter((r) => r.some((cell) => cell.trim() !== ""))
    .map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? "").trim()])));
}

function parseCoords(coor) {
  const m = String(coor ?? "").match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
  if (!m) return null;
  const lat = Number(m[1]);
  const lon = Number(m[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return { lat, lon };
}

const csv = readFileSync(resolve(inputPath), "utf8");
const rows = parseCsv(csv);
const gazetteer = JSON.parse(readFileSync(GAZETTEER_PATH, "utf8"));
const existing = gazetteer.places ?? [];

const seenCoords = new Set(
  existing.map((p) => `${p.lat.toFixed(4)},${p.lon.toFixed(4)}`),
);
const seenNames = new Set(existing.map((p) => p.name.toLowerCase()));

let added = 0;
let skippedNoCoords = 0;
let skippedOutsideBali = 0;
let skippedDuplicate = 0;

for (const row of rows) {
  const name = String(row.title ?? "").trim();
  const coords = parseCoords(row.coor);
  if (!name || !coords) {
    skippedNoCoords += 1;
    continue;
  }
  if (!inBali(coords.lat, coords.lon)) {
    skippedOutsideBali += 1;
    continue;
  }
  const key = `${coords.lat.toFixed(4)},${coords.lon.toFixed(4)}`;
  if (seenCoords.has(key) || seenNames.has(name.toLowerCase())) {
    skippedDuplicate += 1;
    continue;
  }
  const address = String(row.address ?? "").trim() || name;
  existing.push({
    id: slugify(name) || `place-${added}`,
    name,
    address,
    lat: coords.lat,
    lon: coords.lon,
    source: "gmaps",
  });
  seenCoords.add(key);
  seenNames.add(name.toLowerCase());
  added += 1;
}

console.log(`rows read: ${rows.length}`);
console.log(`added: ${added}`);
console.log(`skipped (no coords/name): ${skippedNoCoords}`);
console.log(`skipped (outside Bali): ${skippedOutsideBali}`);
console.log(`skipped (duplicate): ${skippedDuplicate}`);

if (flag === "--write") {
  gazetteer.places = existing;
  writeFileSync(GAZETTEER_PATH, JSON.stringify(gazetteer, null, 2) + "\n");
  console.log(`wrote ${GAZETTEER_PATH} (${existing.length} places)`);
} else {
  console.log("dry run: pass --write to save");
}
