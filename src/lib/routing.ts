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

export interface GeoCoords {
  lat: number;
  lon: number;
}

/** One-shot browser geolocation with a sane timeout. */
export function getCurrentPosition(timeoutMs = 12000): Promise<GeoCoords> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("unsupported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 60000 },
    );
  });
}

export function geolocationErrorMessage(err: unknown): string {
  if (err instanceof GeolocationPositionError) {
    if (err.code === err.PERMISSION_DENIED)
      return "Location permission was denied. Allow access in your browser, or search the address instead.";
    if (err.code === err.TIMEOUT)
      return "Getting your location timed out. Try again, or search the address instead.";
    return "Your location is unavailable right now. Search the address instead.";
  }
  if (err instanceof Error && err.message === "unsupported")
    return "This browser does not support location. Search the address instead.";
  return "Could not get your location. Search the address instead.";
}

/**
 * Reverse-geocode a point. Returns the place when it falls inside Bali,
 * null when the point is outside the service area (thrown errors mean
 * the lookup itself failed).
 */
export async function reverseGeocodeBali(
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<OsmPlace | null> {
  const params = new URLSearchParams({
    format: "jsonv2",
    lat: String(lat),
    lon: String(lon),
  });
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
    { signal, headers: { Accept: "application/json" } },
  );
  if (!res.ok) {
    throw new Error(`Reverse lookup failed (${res.status})`);
  }
  const data = (await res.json()) as {
    display_name?: string;
    address?: { state?: string; country_code?: string };
  };
  if (!data.display_name) {
    throw new Error("No address found for that point");
  }
  const state = data.address?.state ?? "";
  const country = data.address?.country_code ?? "";
  if (country !== "id" || !/bali/i.test(state)) {
    return null;
  }
  return {
    lat,
    lon,
    name: data.display_name,
    short: shortenDisplayName(data.display_name),
  };
}
