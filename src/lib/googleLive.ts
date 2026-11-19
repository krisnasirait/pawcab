/**
 * Server-only live Google fallback, ported from christivn/mapScraper's
 * placesCrawlerV2 (Python/aiohttp) to dependency-free TypeScript so it runs
 * inside a Vercel serverless function: no Python, no subprocess, no disk.
 *
 * Same two steps as the original:
 *   1. GET /maps/search/{query} and pull the canonical tbm=map URL out of
 *      the <link> tag in the Maps SPA page.
 *   2. GET that URL, strip Google's )]}' XSSI prefix, parse the JSON, and
 *      read per-place lists at data[64] (offsets documented below).
 *
 * Ported offsets (mirrors _extract_place in the Python source):
 *   [4][7]          average star rating        [11]   place name
 *   [7][0]/[7][1]   website URL / domain       [13][0] primary category
 *   [9][2]/[9][3]   latitude / longitude       [37][1] review count
 *   [39]            full address               [78]   ChIJ place ID
 *
 * Notes: first results page only (plenty for an autocomplete fallback),
 * Bali bbox filter applied here, warm-instance in-memory cache so repeats
 * don't re-hit Google. Google may change this undocumented structure or
 * challenge datacenter IPs; both degrade to [] and the UI shows its
 * regular error state with retry.
 */

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

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

const FETCH_TIMEOUT_MS = 10000;
const CACHE_TTL_MS = 3600_000;
const CACHE_MAX = 200;

const cache = new Map<string, { at: number; val: ScrapedPlace[] }>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function safeGet(obj: any, ...indices: Array<string | number>): any {
  try {
    for (const idx of indices) obj = obj[idx];
    return obj;
  } catch {
    return undefined;
  }
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: HEADERS,
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Google responded HTTP ${res.status}`);
  return res.text();
}

function extractPlace(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: any,
): ScrapedPlace | null {
  if (!Array.isArray(result)) return null;
  const lat = safeGet(result, 9, 2);
  const lon = safeGet(result, 9, 3);
  const title = String(safeGet(result, 11) ?? "");
  if (
    typeof lat !== "number" ||
    typeof lon !== "number" ||
    !title ||
    lat < BALI_BBOX.minLat ||
    lat > BALI_BBOX.maxLat ||
    lon < BALI_BBOX.minLon ||
    lon > BALI_BBOX.maxLon
  ) {
    return null;
  }
  const address = String(safeGet(result, 39) ?? "") || title;
  return { lat, lon, name: address, short: title };
}

export async function liveGooglePlaces(
  query: string,
  lang = "en",
  country = "id",
): Promise<ScrapedPlace[]> {
  const clean = query.trim().slice(0, 100);
  if (clean.length < 3) return [];

  const key = `${lang}:${country}:${clean.toLowerCase()}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.val;
  if (cache.size >= CACHE_MAX) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }

  const places: ScrapedPlace[] = [];
  try {
    const mapsUrl =
      `https://www.google.com/maps/search/${encodeURIComponent(clean)}` +
      `?hl=${lang}&gl=${country}`;
    const html = await fetchText(mapsUrl);
    const match = html.match(/href="(\/search\?tbm=map[^"]+)"/);
    if (!match) return [];
    const searchUrl =
      "https://www.google.com" + match[1].replace(/&amp;/g, "&");

    let raw = await fetchText(searchUrl);
    if (raw.startsWith(")]}'")) raw = raw.slice(4).trim();
    else return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = JSON.parse(raw);
    const arr = safeGet(data, 64);
    if (Array.isArray(arr)) {
      for (const entry of arr) {
        if (!Array.isArray(entry) || entry.length < 2) continue;
        const place = extractPlace(entry[1]);
        if (place) {
          places.push(place);
          if (places.length >= 8) break;
        }
      }
    } else {
      const single = safeGet(data, 0, 1, 0, 14);
      if (Array.isArray(single)) {
        const place = extractPlace(single);
        if (place) places.push(place);
      }
    }
  } catch {
    return cached?.val ?? [];
  }

  cache.set(key, { at: Date.now(), val: places });
  return places;
}
