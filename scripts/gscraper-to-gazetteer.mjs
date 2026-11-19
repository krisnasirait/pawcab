#!/usr/bin/env node
/**
 * gscraper-to-gazetteer.mjs
 *
 * Converts gosom/google-maps-scraper JSON output into PawCab gazetteer
 * entries (src/data/bali-places.json), which the fare estimator searches
 * when OpenStreetMap Nominatim returns nothing.
 *
 * WHY THIS EXISTS:
 * The scraper is a batch tool (headless browser, minutes per query, needs
 * Docker, gets blocked without proxies). It cannot answer live keystroke
 * autocomplete. So the workflow is: scrape once -> curate here -> the app
 * searches the static list instantly, offline, on any host.
 *
 * WORKFLOW:
 *   1. Run the scraper (needs Docker). Example for Bali beach clubs:
 *
 *      mkdir -p gmaps-output
 *      docker run \
 *        -v gmaps-playwright-cache:/opt \
 *        -v "$PWD/queries.txt:/queries.txt:ro" \
 *        -v "$PWD/gmaps-output:/out" \
 *        gosom/google-maps-scraper \
 *        -input /queries.txt \
 *        -json -results /out/results.json \
 *        -depth 1
 *
 *      where queries.txt holds one Google Maps query per line, e.g.
 *      "Atlas Beach Club Bali", "Finns Beach Club Bali", ...
 *
 *   2. Convert and merge (dry run prints, --write saves):
 *
 *      node scripts/gscraper-to-gazetteer.mjs gmaps-output/results.json
 *      node scripts/gscraper-to-gazetteer.mjs gmaps-output/results.json --write
 *
 * RULES APPLIED:
 * - Only entries with numeric latitude/longitude inside the Bali service
 *   bbox (lat -8.95..-7.95, lon 114.25..115.80) are kept.
 * - Duplicates (same rounded coords or same name, case-insensitive) are
 *   skipped so re-runs are idempotent.
 * - New entries get source "gmaps" to distinguish them from "osm" seeds.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const BALI_BBOX = { minLat: -8.95, maxLat: -7.95, minLon: 114.25, maxLon: 115.8 };

const [, , inputPath, flag] = process.argv;
if (!inputPath) {
  console.error("Usage: node scripts/gscraper-to-gazetteer.mjs <results.json> [--write]");
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

const raw = JSON.parse(readFileSync(resolve(inputPath), "utf8"));
const rows = Array.isArray(raw) ? raw : [raw];
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
  const lat = Number(row.latitude);
  const lon = Number(row.longitude);
  const name = String(row.title ?? row.name ?? "").trim();
  if (!name || !Number.isFinite(lat) || !Number.isFinite(lon)) {
    skippedNoCoords += 1;
    continue;
  }
  if (!inBali(lat, lon)) {
    skippedOutsideBali += 1;
    continue;
  }
  const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
  if (seenCoords.has(key) || seenNames.has(row.title?.toLowerCase?.() ?? name.toLowerCase())) {
    skippedDuplicate += 1;
    continue;
  }
  const address = String(row.complete_address ?? row.address ?? name).trim();
  existing.push({
    id: slugify(name) || `place-${added}`,
    name,
    address,
    lat,
    lon,
    source: "gmaps",
  });
  seenCoords.add(key);
  seenNames.add(name.toLowerCase());
  added += 1;
}

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
