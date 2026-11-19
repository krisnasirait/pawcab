export interface OsmPlace {
  lat: number;
  lon: number;
  /** Full display name from Nominatim (used in booking messages). */
  name: string;
  /** Shortened name shown in the input after selection. */
  short: string;
}

export interface DrivingRoute {
  distanceKm: number;
  durationMin: number;
}

export const FLAT_RATE_PER_KM = 10000;

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
// Bali bounding box: minLon, maxLat, maxLon, minLat.
const BALI_VIEWBOX = "114.30,-8.00,115.80,-8.90";

export function shortenDisplayName(displayName: string): string {
  return displayName.split(",").slice(0, 3).join(",").trim();
}

export async function searchPlacesBali(
  query: string,
  signal?: AbortSignal,
): Promise<OsmPlace[]> {
  const params = new URLSearchParams({
    format: "jsonv2",
    addressdetails: "1",
    limit: "6",
    countrycodes: "id",
    viewbox: BALI_VIEWBOX,
    bounded: "1",
    q: query,
  });
  const res = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Place search failed (${res.status})`);
  }
  const data = (await res.json()) as Array<{
    lat: string;
    lon: string;
    display_name: string;
  }>;
  return data.map((item) => ({
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon),
    name: item.display_name,
    short: shortenDisplayName(item.display_name),
  }));
}

export async function fetchDrivingRoute(
  from: { lat: number; lon: number },
  to: { lat: number; lon: number },
  signal?: AbortSignal,
): Promise<DrivingRoute> {
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${from.lon},${from.lat};${to.lon},${to.lat}?overview=false`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Route calculation failed (${res.status})`);
  }
  const data = (await res.json()) as {
    routes?: Array<{ distance: number; duration: number }>;
  };
  const route = data.routes?.[0];
  if (!route) {
    throw new Error("No driving route found");
  }
  return {
    distanceKm: route.distance / 1000,
    durationMin: route.duration / 60,
  };
}

export function calculateFlatFare(distanceKm: number, minimumFare = 65000): {
  ratePerKm: number;
  subtotal: number;
  finalFare: number;
  isMinimumApplied: boolean;
} {
  const rawFare = distanceKm * FLAT_RATE_PER_KM;
  // Rounded to the nearest thousand, with a floor so short rides stay viable.
  const subtotal = Math.round(rawFare / 1000) * 1000;
  const finalFare = Math.max(subtotal, minimumFare);
  return {
    ratePerKm: FLAT_RATE_PER_KM,
    subtotal,
    finalFare,
    isMinimumApplied: subtotal < minimumFare,
  };
}

export function osmLinkFor(lat: number, lon: number): string {
  return `https://www.openstreetmap.org/?mlat=${lat.toFixed(5)}&mlon=${lon.toFixed(5)}#map=16/${lat.toFixed(5)}/${lon.toFixed(5)}`;
}
