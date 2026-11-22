// ============================================================================
// PAWCAB FARE CALCULATOR DATA (CMS-READY CONFIGURATION)
// Seluruh data di file ini dibuat terstruktur agar nantinya dapat dihubungkan
// langsung ke headless CMS (Sanity / Strapi / Supabase / JSON API).
// ============================================================================

import contentData from "@/lib/content";
import coverageAreas from "@/data/coverage-areas.json";

export interface ZoneDefinition {
  id: number;
  name: string; // e.g. "Zone 1"
  areasHeadline: string; // e.g. "KOTA DENPASAR - SANUR - SEMINYAK - LEGIAN - KUTA"
  description: string;
}

export interface AreaLocation {
  id: string;
  name: string;
  zoneId: number;
  popular?: boolean;
}

// 1. DAFTAR ZONA RESMI PAWCAB (Sync with content.json with fallback)
export const PAWCAB_ZONES: ZoneDefinition[] =
  (contentData?.servicesPages?.petTransport?.pricingConfig?.zones as ZoneDefinition[]) || [
  {
    id: 1,
    name: "Zone 1",
    areasHeadline: "KOTA DENPASAR - SANUR - SEMINYAK - LEGIAN - KUTA",
    description: "Pusat kota, area pesisir selatan-tengah, dan sentra wisata utama.",
  },
  {
    id: 2,
    name: "Zone 2",
    areasHeadline: "KUTA UTARA - SEMPIDI - DARMASABA - BATU BULAN",
    description: "Area Kuta Utara, Canggu, Kerobokan, dan koridor barat-tengah.",
  },
  {
    id: 3,
    name: "Zone 3",
    areasHeadline: "KUTA SELATAN - NUSA DUA",
    description: "Semenanjung bukit selatan, Jimbaran, Nusa Dua, dan Benoa.",
  },
  {
    id: 4,
    name: "Zone 4",
    areasHeadline:
      "TANAH LOT - SESEH - TABANAN (KEDIRI, KERAMBITAN) - MENGWI - ABIANSEMAL - SUKAWATI - PECATU",
    description: "Wilayah barat Tabanan, Mengwi, Gianyar barat (Sukawati), dan Pecatu.",
  },
];

// 2. DAFTAR DAERAH PER ZONA (Sync with content.json with fallback)
export const PAWCAB_AREAS: AreaLocation[] =
  (contentData?.servicesPages?.petTransport?.pricingConfig?.areas as AreaLocation[]) || [
  // Zone 1
  { id: "seminyak", name: "Seminyak", zoneId: 1, popular: true },
  { id: "kuta", name: "Kuta", zoneId: 1, popular: true },
  { id: "legian", name: "Legian", zoneId: 1 },
  { id: "sanur", name: "Sanur", zoneId: 1, popular: true },
  { id: "denpasar-kota", name: "Denpasar City", zoneId: 1 },
  { id: "renon", name: "Renon", zoneId: 1 },
  { id: "peguyangan", name: "Peguyangan", zoneId: 1 },

  // Zone 2
  { id: "canggu", name: "Canggu", zoneId: 2, popular: true },
  { id: "kerobokan", name: "Kerobokan", zoneId: 2, popular: true },
  { id: "berawa", name: "Berawa Beach", zoneId: 2 },
  { id: "pererenan", name: "Pererenan", zoneId: 2 },
  { id: "dalung", name: "Dalung", zoneId: 2 },
  { id: "sempidi", name: "Sempidi", zoneId: 2 },
  { id: "darmasaba", name: "Darmasaba", zoneId: 2 },
  { id: "batubulan", name: "Batu Bulan", zoneId: 2 },

  // Zone 3
  { id: "jimbaran", name: "Jimbaran", zoneId: 3, popular: true },
  { id: "nusa-dua", name: "Nusa Dua", zoneId: 3, popular: true },
  { id: "tanjung-benoa", name: "Tanjung Benoa", zoneId: 3 },
  { id: "kuta-selatan", name: "South Kuta", zoneId: 3 },
  { id: "ungasan", name: "Ungasan", zoneId: 3 },

  // Zone 4
  { id: "tanah-lot", name: "Tanah Lot", zoneId: 4, popular: true },
  { id: "seseh", name: "Seseh", zoneId: 4 },
  { id: "tabanan-kediri", name: "Tabanan (Kediri)", zoneId: 4 },
  { id: "tabanan-kerambitan", name: "Tabanan (Kerambitan)", zoneId: 4 },
  { id: "mengwi", name: "Mengwi", zoneId: 4 },
  { id: "abiansemal", name: "Abiansemal", zoneId: 4 },
  { id: "sukawati", name: "Sukawati", zoneId: 4, popular: true },
  { id: "ubud", name: "Ubud", zoneId: 4, popular: true },
  { id: "gianyar", name: "Gianyar", zoneId: 4 },
  { id: "pecatu-uluwatu", name: "Pecatu / Uluwatu", zoneId: 4, popular: true },
  { id: "seseh-beach", name: "Seseh Beach", zoneId: 4 },
  { id: "pecatu-south", name: "South Pecatu", zoneId: 4 },
  { id: "abiansemal-south", name: "South Abiansemal", zoneId: 4 },
];

// 3. TARIF PER KM ANTAR-ZONA (Sync with content.json with fallback)
export const ZONE_RATES_PER_KM: Record<string, number> =
  (contentData?.servicesPages?.petTransport?.pricingConfig?.ratesPerKm as Record<string, number>) || {
  // Asal Zona 1
  "1-1": 8000, // Dalam Zona 1: 8 rb / km
  "1-2": 10000, // Zona 1 -> Zona 2: 10 rb / km
  "1-3": 9000, // Zona 1 -> Zona 3: 9 rb / km
  "1-4": 12000, // Zona 1 -> Zona 4: 12 rb / km

  // Asal Zona 2
  "2-1": 10000, // Zona 2 -> Zona 1: 10 rb / km
  "2-2": 9000, // Dalam Zona 2: 9 rb / km
  "2-3": 11000, // Zona 2 -> Zona 3: 11 rb / km
  "2-4": 10000, // Zona 2 -> Zona 4: 10 rb / km

  // Asal Zona 3
  "3-1": 9000, // Zona 3 -> Zona 1: 9 rb / km
  "3-2": 11000, // Zona 3 -> Zona 2: 11 rb / km
  "3-3": 9000, // Dalam Zona 3: 9 rb / km
  "3-4": 13000, // Zona 3 -> Zona 4: 13 rb / km

  // Asal Zona 4
  "4-1": 12000, // Zona 4 -> Zona 1: 12 rb / km
  "4-2": 10000, // Zona 4 -> Zona 2: 10 rb / km
  "4-3": 13000, // Zona 4 -> Zona 3: 13 rb / km
  "4-4": 11000, // Dalam Zona 4: 11 rb / km
};

// Minimal tarif order agar driver & operasional tetap tercover (Sync with content.json)
export const MINIMUM_FARE =
  contentData?.servicesPages?.petTransport?.pricingConfig?.minimumFare ?? 66000;

// 4. MATRIKS JARAK REALISTIS ANTAR DAERAH (Sync with content.json with fallback)
// Format key: `${fromAreaId}_${toAreaId}` (dua arah/bidirectional)
export const AREA_DISTANCES: Record<string, number> =
  (contentData?.servicesPages?.petTransport?.pricingConfig as { areaDistances?: Record<string, number> })?.areaDistances || {
  // Seminyak routes
  seminyak_canggu: 9.5,
  seminyak_kuta: 5.5,
  seminyak_legian: 3.5,
  seminyak_sanur: 14.5,
  seminyak_denpasar_kota: 9.0,
  seminyak_renon: 11.0,
  seminyak_jimbaran: 13.5,
  seminyak_nusa_dua: 22.0,
  seminyak_tanah_lot: 19.5,
  seminyak_sukawati: 27.0,
  seminyak_pecatu_uluwatu: 28.5,
  seminyak_kerobokan: 4.2,
  seminyak_berawa: 6.8,
  seminyak_pererenan: 12.0,
  seminyak_tanjung_benoa: 23.5,
  seminyak_ungasan: 25.0,

  // Canggu routes
  canggu_kuta: 14.0,
  canggu_legian: 12.0,
  canggu_sanur: 21.0,
  canggu_denpasar_kota: 15.0,
  canggu_renon: 17.5,
  canggu_jimbaran: 23.0,
  canggu_nusa_dua: 31.0,
  canggu_tanah_lot: 12.0,
  canggu_seseh: 6.5,
  canggu_pererenan: 3.5,
  canggu_berawa: 3.0,
  canggu_kerobokan: 5.5,
  canggu_dalung: 7.0,
  canggu_sempidi: 12.0,
  canggu_sukawati: 26.5,
  canggu_pecatu_uluwatu: 35.0,
  canggu_mengwi: 14.5,
  canggu_tabanan_kediri: 16.0,

  // Sanur routes
  sanur_kuta: 13.5,
  sanur_legian: 12.5,
  sanur_denpasar_kota: 7.5,
  sanur_renon: 4.5,
  sanur_jimbaran: 18.0,
  sanur_nusa_dua: 20.5,
  sanur_tanjung_benoa: 21.0,
  sanur_sukawati: 18.0,
  sanur_batubulan: 11.5,
  sanur_tanah_lot: 29.0,
  sanur_pecatu_uluwatu: 32.0,

  // Kuta routes
  kuta_legian: 2.5,
  kuta_denpasar_kota: 10.0,
  kuta_renon: 11.5,
  kuta_jimbaran: 9.5,
  kuta_nusa_dua: 16.5,
  kuta_tanjung_benoa: 17.0,
  kuta_kuta_selatan: 12.0,
  kuta_ungasan: 17.5,
  kuta_tanah_lot: 23.5,
  kuta_pecatu_uluwatu: 24.0,
  kuta_kerobokan: 9.0,

  // Jimbaran & Nusa Dua routes
  jimbaran_nusa_dua: 11.0,
  jimbaran_tanjung_benoa: 12.5,
  jimbaran_kuta_selatan: 4.5,
  jimbaran_ungasan: 7.0,
  jimbaran_pecatu_uluwatu: 15.0,
  jimbaran_denpasar_kota: 16.5,

  nusa_dua_tanjung_benoa: 4.5,
  nusa_dua_ungasan: 13.0,
  nusa_dua_pecatu_uluwatu: 21.0,

  // Tanah Lot & Tabanan routes
  tanah_lot_tabanan_kediri: 11.5,
  tanah_lot_tabanan_kerambitan: 18.0,
  tanah_lot_mengwi: 16.0,
  tanah_lot_sukawati: 33.0,
  tanah_lot_seseh: 7.5,
  tanah_lot_pererenan: 9.5,

  mengwi_abiansemal: 8.5,
  mengwi_tabanan_kediri: 10.5,
  sukawati_batubulan: 6.5,
  sukawati_denpasar_kota: 13.0,
  sukawati_abiansemal: 15.0,
};

// Default jarak rata-rata antar zona (Sync with content.json with fallback)
const DEFAULT_ZONE_DISTANCES: Record<string, number> =
  (contentData?.servicesPages?.petTransport?.pricingConfig?.distancesKm as Record<string, number>) || {
  "1-1": 6.5,
  "1-2": 11.5,
  "1-3": 17.5,
  "1-4": 26.0,

  "2-1": 11.5,
  "2-2": 7.0,
  "2-3": 24.5,
  "2-4": 19.0,

  "3-1": 17.5,
  "3-2": 24.5,
  "3-3": 8.0,
  "3-4": 32.0,

  "4-1": 26.0,
  "4-2": 19.0,
  "4-3": 32.0,
  "4-4": 10.5,
};

// 5. HELPER FUNCTIONS
export function getRatePerKm(fromZone: number, toZone: number): number {
  const key = `${fromZone}-${toZone}`;
  return ZONE_RATES_PER_KM[key] ?? 10000;
}

export function getEstimatedDistance(
  fromAreaId: string,
  toAreaId: string,
  customDistances?: Record<string, number>
): number {
  if (fromAreaId === toAreaId) {
    return 3.0; // Perjalanan lokal dalam satu kelurahan/desa
  }

  const distances = customDistances || AREA_DISTANCES;

  // Cek key arah A -> B (dengan normalisasi - menjadi _)
  const cleanFrom = fromAreaId.replace(/-/g, "_").toLowerCase();
  const cleanTo = toAreaId.replace(/-/g, "_").toLowerCase();

  const keyA = `${cleanFrom}_${cleanTo}`;
  if (distances[keyA] !== undefined) {
    return distances[keyA];
  }

  // Cek key arah B -> A
  const keyB = `${cleanTo}_${cleanFrom}`;
  if (distances[keyB] !== undefined) {
    return distances[keyB];
  }

  // Fallback berdasarkan zona
  const fromArea = PAWCAB_AREAS.find((a) => a.id === fromAreaId);
  const toArea = PAWCAB_AREAS.find((a) => a.id === toAreaId);

  const fromZone = fromArea ? fromArea.zoneId : 1;
  const toZone = toArea ? toArea.zoneId : 1;

  const zoneKey = `${fromZone}-${toZone}`;
  return DEFAULT_ZONE_DISTANCES[zoneKey] ?? 12.0;
}

export function calculateFare(
  fromAreaId: string,
  toAreaId: string,
  options?: {
    customDistances?: Record<string, number>;
    customRates?: Record<string, number>;
    customMinimumFare?: number;
  }
): {
  distanceKm: number;
  fromZone: number;
  toZone: number;
  ratePerKm: number;
  subtotal: number;
  finalFare: number;
  isMinimumApplied: boolean;
} {
  const fromArea = PAWCAB_AREAS.find((a) => a.id === fromAreaId) || PAWCAB_AREAS[0];
  const toArea = PAWCAB_AREAS.find((a) => a.id === toAreaId) || PAWCAB_AREAS[6]; // default Canggu

  const distanceKm = getEstimatedDistance(fromArea.id, toArea.id, options?.customDistances);
  const zoneKey = `${fromArea.zoneId}-${toArea.zoneId}`;
  const ratePerKm = options?.customRates?.[zoneKey] ?? getRatePerKm(fromArea.zoneId, toArea.zoneId);
  const minFare = options?.customMinimumFare ?? MINIMUM_FARE;

  const rawFare = distanceKm * ratePerKm;
  // Dibulatkan ke ribuan terdekat
  const subtotal = Math.round(rawFare / 1000) * 1000;
  const finalFare = Math.max(subtotal, minFare);
  const isMinimumApplied = subtotal < minFare;

  return {
    distanceKm,
    fromZone: fromArea.zoneId,
    toZone: toArea.zoneId,
    ratePerKm,
    subtotal,
    finalFare,
    isMinimumApplied,
  };
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}


// ============================================================================
// 5. ZONE RATE CARD
// Source: the printed SERVICES & RATES card (2026-11). A ride of 5 km or less
// is a fixed zone fare; 5.1 to 15 km is the zone rate per kilometre; anything
// longer, outside the four zones, or a full-day booking is quoted by hand.
// The zone used is the outer of the two endpoints, so a cross-zone trip is
// never under-quoted.
// ============================================================================
export interface ZoneRate {
  fixedUpTo5km: number;
  perKm: number;
}

const DEFAULT_ZONE_RATES: Record<number, ZoneRate> = {
  1: { fixedUpTo5km: 51000, perKm: 13000 },
  2: { fixedUpTo5km: 66000, perKm: 14000 },
  3: { fixedUpTo5km: 71000, perKm: 15000 },
  4: { fixedUpTo5km: 76000, perKm: 16000 },
};

const rateConfig = contentData?.servicesPages?.petTransport?.pricingConfig as
  | {
      zoneRates?: Record<string, ZoneRate>;
      fixedTierMaxKm?: number;
      quotedBeyondKm?: number;
      waitingFeePerHour?: number;
    }
  | undefined;

export const ZONE_RATES: Record<number, ZoneRate> = rateConfig?.zoneRates
  ? Object.fromEntries(
      Object.entries(rateConfig.zoneRates).map(([k, v]) => [Number(k), v]),
    )
  : DEFAULT_ZONE_RATES;

export const FIXED_TIER_MAX_KM = rateConfig?.fixedTierMaxKm ?? 5;
export const QUOTED_BEYOND_KM = rateConfig?.quotedBeyondKm ?? 15;
export const WAITING_FEE_PER_HOUR = rateConfig?.waitingFeePerHour ?? 15000;

/** Coordinates per service area, for locating an arbitrary address. */
const AREA_COORDS: Record<string, { lat: number; lon: number }> = Object.fromEntries(
  (coverageAreas.areas as { id: string; lat: number; lon: number }[])
    .filter((a) => typeof a.lat === "number" && typeof a.lon === "number")
    .map((a) => [a.id, { lat: a.lat, lon: a.lon }]),
);

/** A point further than this from every listed area is treated as outside the zones. */
const MAX_ZONE_DISTANCE_KM = 25;

export function haversineKm(aLat: number, aLon: number, bLat: number, bLon: number) {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLon = ((bLon - aLon) * Math.PI) / 180;
  const la1 = (aLat * Math.PI) / 180;
  const la2 = (bLat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Fare distance from an OSRM road distance. OSRM optimises for free-flow
 * time, so in Bali it can prefer long bypass loops (Sanur Kauh to
 * Peguyangan: 15.0 km vs ~13.7 km on Google). When the route looks
 * pathological next to the straight line, fare on calibrated circuity
 * instead of the loop. Normal routes pass through untouched.
 */
export const MAX_FARE_CIRCUITY = 1.5;
export const FALLBACK_CIRCUITY = 1.4;

export function resolveFareDistance(
  osrmKm: number,
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number,
): { distanceKm: number; capped: boolean } {
  const straightKm = haversineKm(fromLat, fromLon, toLat, toLon);
  if (straightKm > 0 && osrmKm > straightKm * MAX_FARE_CIRCUITY) {
    return { distanceKm: straightKm * FALLBACK_CIRCUITY, capped: true };
  }
  return { distanceKm: osrmKm, capped: false };
}

/** Zone of a coordinate: nearest listed service area, or null when it is outside Bali's zones. */
export function zoneForPoint(lat: number, lon: number): number | null {
  let bestZone: number | null = null;
  let bestDistance = Infinity;
  for (const area of PAWCAB_AREAS) {
    const coords = AREA_COORDS[area.id];
    if (!coords) continue;
    const d = haversineKm(lat, lon, coords.lat, coords.lon);
    if (d < bestDistance) {
      bestDistance = d;
      bestZone = area.zoneId;
    }
  }
  return bestDistance <= MAX_ZONE_DISTANCE_KM ? bestZone : null;
}

export type FareTier = "fixed" | "per_km" | "quote";
export type QuoteReason = "outside_zone" | "beyond_range" | null;

export interface ZoneFare {
  tier: FareTier;
  reason: QuoteReason;
  /** Outer zone of the two endpoints, when known. */
  zone: number | null;
  rate: ZoneRate | null;
  base: number;
  waitingHours: number;
  waitingFee: number;
  total: number;
}

/**
 * Quote a ride from two endpoint zones. Any `waitingHours` above zero marks
a round trip: the driver waits on site and the total is twice the one-way
 * base, instead of an hourly waiting fee.
 */
export function quoteZoneFare({
  distanceKm,
  pickupZone,
  dropoffZone,
  waitingHours = 0,
}: {
  distanceKm: number;
  pickupZone: number | null;
  dropoffZone: number | null;
  waitingHours?: number;
}): ZoneFare {
  // Both endpoints must be known; dropping an unknown endpoint can underquote a trip.
  const zone = pickupZone !== null && dropoffZone !== null &&
    ZONE_RATES[pickupZone] && ZONE_RATES[dropoffZone]
    ? Math.max(pickupZone, dropoffZone)
    : null;
  const rate = zone ? (ZONE_RATES[zone] ?? null) : null;
  const roundTrip = Math.max(0, waitingHours) > 0;

  if (!rate) {
    return { tier: "quote", reason: "outside_zone", zone: null, rate: null, base: 0, waitingHours: Math.max(0, waitingHours), waitingFee: 0, total: 0 };
  }
  if (distanceKm > QUOTED_BEYOND_KM) {
    return { tier: "quote", reason: "beyond_range", zone, rate, base: 0, waitingHours: Math.max(0, waitingHours), waitingFee: 0, total: 0 };
  }

  const fixed = distanceKm <= FIXED_TIER_MAX_KM;
  const base = fixed
    ? rate.fixedUpTo5km
    : Math.round((distanceKm * rate.perKm) / 1000) * 1000;
  const waitingFee = roundTrip ? base : 0;

  return {
    tier: fixed ? "fixed" : "per_km",
    reason: null,
    zone,
    rate,
    base,
    waitingHours: Math.max(0, waitingHours),
    waitingFee,
    total: base + waitingFee,
  };
}
