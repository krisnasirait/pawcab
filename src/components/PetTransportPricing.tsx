"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { PiArrowsLeftRight, PiInfo, PiMapPin, PiNavigationArrow, PiNotePencil, PiWhatsappLogo } from "react-icons/pi";
import {
  formatRupiah,
  quoteZoneFare,
  zoneForPoint,
  FIXED_TIER_MAX_KM,
  QUOTED_BEYOND_KM,
  ZONE_RATES,
} from "@/data/fareCalculatorData";
import {
  fetchDrivingRoute,
  getCurrentPosition,
  geolocationErrorMessage,
  reverseGeocodeBali,
  osmToGoogleMaps,
  googleMapsDirections,
  type OsmPlace,
} from "@/lib/routing";
import contentData from "@/lib/content";
import { trackEvent } from "@/lib/firebase";
import type { MapEndpoint } from "./BaliCoverageMap";
import AddressSearchInput from "./AddressSearchInput";
import type { MapTarget } from "./MapPickerModal";

const MapPickerModal = dynamic(() => import("./MapPickerModal"), {
  ssr: false,
});

type RouteStatus = "idle" | "loading" | "ready" | "error";

const EstimatorMap = dynamic(() => import("./BaliCoverageMap"), {
  ssr: false,
  loading: () => (
    <p role="status" className="flex h-full items-center justify-center text-sm text-ink">
      Loading coverage map…
    </p>
  ),
});

// Display-only in this context: polygon clicks do nothing, hover still
// names the zone. Stable reference so the map instance is never rebuilt.
const noopZoneSelection = () => {};

/**
 * Reuses the shared PawCab zone map instead of a generic OSM embed.
 * Below-fold, so the Leaflet chunk only loads near the viewport.
 * Highlights the trip's outer zone and pins pickup/drop-off once chosen.
 */
function CoverageEmbed({ outerZone, endpoints }: {
  outerZone: number | null;
  endpoints: MapEndpoint[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Always start false so the server HTML matches the first client render.
  const [visible, setVisible] = useState(false);
  const [tilesDown, setTilesDown] = useState(false);
  const handleTileError = useCallback(() => setTilesDown(true), []);
  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;
    if (typeof IntersectionObserver === "undefined") {
      // One-time progressive enhancement, not a render loop: guarded above.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);
  return (
    <div ref={ref}>
      {/* relative z-0 traps Leaflet's high internal z-indexes below the sticky header (z-30). */}
      <div role="region" aria-label="Trip zones on the PawCab service map" className="relative z-0 w-full h-[300px] sm:h-[350px] md:h-[380px] bg-surface/40">
        {visible ? (
          <EstimatorMap
            activeZone={outerZone}
            onSelectZone={noopZoneSelection}
            onTileError={handleTileError}
            endpoints={endpoints}
            heightClass="h-[300px] sm:h-[350px] md:h-[380px] w-full"
          />
        ) : (
          <p role="status" className="flex h-full items-center justify-center text-sm text-ink">
            Loading coverage map…
          </p>
        )}
      </div>
      {tilesDown && (
        <p role="status" className="mt-2 text-[13px] text-ink">
          Map tiles could not load, but your fare below is unaffected.
        </p>
      )}
    </div>
  );
}

/* ============================================================================
   MAIN PET TRANSPORT PRICING COMPONENT
   Pickup and drop-off are searched live via OpenStreetMap Nominatim
   (restricted to Bali), the driving distance comes from OSRM, and the fare
   follows the zone rate card: a fixed fare to 5 km, the zone rate per km to
   15 km, a hand quote beyond that. Cross-zone trips use the outer zone.
   ============================================================================ */
export default function PetTransportPricing() {
  const [fromPlace, setFromPlace] = useState<OsmPlace | null>(null);
  const [toPlace, setToPlace] = useState<OsmPlace | null>(null);

  // One-tap device location, per leg.
  const [locating, setLocating] = useState<MapTarget | null>(null);
  const [locateError, setLocateError] = useState<{
    which: MapTarget;
    message: string;
  } | null>(null);

  // Map picker modal.
  const [mapOpen, setMapOpen] = useState(false);
  const [mapTarget, setMapTarget] = useState<MapTarget>("pickup");

  // Optional trip notes / pet details
  const [tripNote, setTripNote] = useState<string>("");

  // Round trip: the driver waits on site and the total doubles.
  const [roundTrip, setRoundTrip] = useState(false);

  // Live driving route between the two searched addresses. The effect only
  // subscribes to OSRM; the visible status is derived below, so selecting
  // or clearing an address never cascades renders through the effect.
  const [routeData, setRouteData] = useState<{
    distanceKm: number;
    durationMin: number;
  } | null>(null);
  const [routeFailed, setRouteFailed] = useState(false);
  const [routeAttempt, setRouteAttempt] = useState(0);
  const [loadedKey, setLoadedKey] = useState("");

  const bothSelected = fromPlace !== null && toPlace !== null;
  const samePoint =
    bothSelected &&
    fromPlace.lat === toPlace.lat &&
    fromPlace.lon === toPlace.lon;
  const routeKey = bothSelected
    ? `${fromPlace.lat},${fromPlace.lon}>${toPlace.lat},${toPlace.lon}#${routeAttempt}`
    : "";

  useEffect(() => {
    if (!routeKey || loadedKey === routeKey) return;
    const controller = new AbortController();
    const from = fromPlace;
    const to = toPlace;
    if (!from || !to) return;
    fetchDrivingRoute(from, to, controller.signal)
      .then((route) => {
        if (controller.signal.aborted) return;
        setRouteData({
          distanceKm: route.distanceKm,
          durationMin: route.durationMin,
        });
        setRouteFailed(false);
        setLoadedKey(routeKey);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setRouteFailed(true);
      });
    return () => controller.abort();
  }, [routeKey, loadedKey, fromPlace, toPlace]);

  // Derived display state: idle before both addresses, ready immediately
  // for the same address twice (a zero-length ride, not an error).
  const routeStatus: RouteStatus = !bothSelected
    ? "idle"
    : samePoint
      ? "ready"
      : routeFailed
        ? "error"
        : loadedKey === routeKey && routeData
          ? "ready"
          : "loading";
  const distanceKm = samePoint ? 0 : (routeData?.distanceKm ?? 0);
  const durationMin = samePoint ? 0 : (routeData?.durationMin ?? 0);

  // Zone of each endpoint: nearest listed service area, so an arbitrary
  // OSM address still resolves. The outer zone sets the rate.
  const pickupZone = useMemo(
    () => (fromPlace ? zoneForPoint(fromPlace.lat, fromPlace.lon) : null),
    [fromPlace],
  );
  const dropoffZone = useMemo(
    () => (toPlace ? zoneForPoint(toPlace.lat, toPlace.lon) : null),
    [toPlace],
  );

  const fare = useMemo(
    () =>
      quoteZoneFare({
        distanceKm,
        pickupZone,
        dropoffZone,
        waitingHours: roundTrip ? 1 : 0,
      }),
    [distanceKm, pickupZone, dropoffZone, roundTrip],
  );

  // Funnel tracking: one fare_calculated per loaded route (keyed by the
  // loaded route so typing notes or toggling round-trip never refires).
  const lastTrackedRoute = useRef("");
  useEffect(() => {
    if (routeStatus !== "ready" || !loadedKey || loadedKey === lastTrackedRoute.current) return;
    lastTrackedRoute.current = loadedKey;
    if (fare.tier === "quote") return;
    trackEvent("fare_calculated", {
      zone: fare.zone ?? 0,
      distance_km: Number(distanceKm.toFixed(1)),
      value: fare.total,
      currency: "IDR",
      round_trip: roundTrip,
    });
  }, [routeStatus, loadedKey, fare, distanceKm, roundTrip]);

  // Pins for the shared zone map. Memoised so typing notes or toggling
  // round-trip never rebuilds the pins or yanks the map view.
  const mapEndpoints = useMemo<MapEndpoint[]>(() => {
    const points: MapEndpoint[] = [];
    if (fromPlace) points.push({ lat: fromPlace.lat, lon: fromPlace.lon, label: `Pickup: ${fromPlace.short}` });
    if (toPlace) points.push({ lat: toPlace.lat, lon: toPlace.lon, label: `Drop-off: ${toPlace.short}` });
    return points;
  }, [fromPlace, toPlace]);

  // Swap origin and destination; notes belong to the trip, not the leg.
  const handleSwap = () => {
    setFromPlace(toPlace);
    setToPlace(fromPlace);
    setLocateError(null);
  };

  const locateFor = async (which: MapTarget) => {
    setLocating(which);
    setLocateError(null);
    try {
      const pos = await getCurrentPosition();
      const place = await reverseGeocodeBali(pos.lat, pos.lon);
      if (!place) {
        setLocateError({
          which,
          message:
            "Your location looks outside our Bali service area. Search or pick on the map instead.",
        });
        return;
      }
      if (which === "pickup") setFromPlace(place);
      else setToPlace(place);
    } catch (err) {
      setLocateError({ which, message: geolocationErrorMessage(err) });
    } finally {
      setLocating(null);
    }
  };

  const openMapFor = (which: MapTarget) => {
    setMapTarget(which);
    setMapOpen(true);
  };

  // Automated WhatsApp booking message with live route details.
  const waMessage = useMemo(() => {
    let msg = `Hi PawCab, I would like to book a Pet Transport:\n\n`;
    if (fromPlace) {
      msg += `PICKUP: ${fromPlace.name}\nMaps: ${osmToGoogleMaps(fromPlace.lat, fromPlace.lon)}\n\n`;
    }
    if (toPlace) {
      msg += `DROP-OFF: ${toPlace.name}\nMaps: ${osmToGoogleMaps(toPlace.lat, toPlace.lon)}\n\n`;
    }
    if (fromPlace && toPlace) {
      msg += `ROUTE: ${googleMapsDirections(fromPlace, toPlace)}\n\n`;
    }
    msg += `DISTANCE: ~${distanceKm.toFixed(1)} km (~${Math.round(durationMin)} min drive)\n`;
    if (pickupZone !== null) msg += `PICKUP ZONE: ${pickupZone}\n`;
    if (dropoffZone !== null) msg += `DROP-OFF ZONE: ${dropoffZone}\n`;
    if (fare.zone) msg += `ZONE: ${fare.zone} (higher endpoint zone)${fare.tier === "fixed" ? ` — fixed fare to ${FIXED_TIER_MAX_KM} km` : ""}\n`;
    if (fare.tier === "quote") {
      msg += `FARE: to be quoted (${fare.reason === "outside_zone" ? "outside the four zones" : `beyond ${QUOTED_BEYOND_KM} km`})\n`;
    } else {
      msg += `FARE: ${formatRupiah(fare.base)}\n`;
      if (fare.waitingFee > 0) msg += `ROUND TRIP: driver waits on site, return included (2 x one-way fare)\n`;
      msg += `TOTAL ESTIMATE: ${formatRupiah(fare.total)}\n`;
    }
    if (roundTrip) msg += `ROUND TRIP: yes\n`;

    if (tripNote.trim()) {
      msg += `\nNOTE / PET DETAILS:\n${tripNote.trim()}\n`;
    }

    msg += `\nPlease confirm driver availability. Thank you!`;
    return msg;
  }, [fromPlace, toPlace, pickupZone, dropoffZone, distanceKm, durationMin, fare, tripNote, roundTrip]);

  return (
    <section
      id="fare"
      className="relative py-16 md:py-24 px-5 md:px-8 bg-surface border-y border-sand/60 scroll-mt-20"
    >
      <span id="pricing" aria-hidden="true" className="absolute -top-20" />
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-10 md:mb-12">
          <p className="flex items-center gap-3 text-[14px] font-medium text-midnight mb-4">
            <span aria-hidden="true" className="inline-block h-px w-10 bg-midnight" />
            Price your ride
          </p>
          <h2 className="text-4xl md:text-[52px] leading-[1.05] font-normal text-navy" style={{ fontFamily: "var(--font-display), Georgia, serif" }}>
            Zone rates, measured live.
          </h2>
          <p className="text-ink text-[16px] leading-relaxed mt-4">
            Type any two Bali addresses. The map measures the real driving
            distance, then the fare follows the zone rate card: a fixed fare up
            to {FIXED_TIER_MAX_KM} km, then the zone rate multiplied by the full
            driving distance up to {QUOTED_BEYOND_KM} km. Cross-zone trips use
            the higher of the pickup and drop-off zones.
          </p>
        </div>

        {/* ========================================================
            INTERACTIVE CALCULATOR WIDGET (LUXURY CARD)
            ======================================================== */}
        <div className="max-w-4xl mx-auto mb-10 bg-white rounded-[24px] p-6 sm:p-8 md:p-9 border border-navy/20 relative overflow-visible">
          <div className="relative z-10">
            {/* Widget Title & Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-dashed border-sand mb-7">
              <div>
                <h3 className="text-xl sm:text-2xl font-normal text-navy" style={{ fontFamily: "var(--font-display), Georgia, serif" }}>
                  Trip fare estimator
                </h3>
                <p className="text-[13.5px] text-ink mt-1">
                  Live driving distance, zone rate card, WhatsApp ready
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy text-surface text-[13px] font-medium">
                From {formatRupiah(ZONE_RATES[1].fixedUpTo5km)}
              </span>
            </div>

            {/* Address Search: Pickup, Swap, Drop-off */}
            <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-start mb-6">
              <div className="lg:col-span-5">
                <AddressSearchInput
                  label="Pickup Location"
                  icon={
                    <PiMapPin
                      aria-hidden="true"
                      className="text-navy text-base shrink-0"
                    />
                  }
                  placeholder="Search pickup (e.g. Seminyak, Ubud, Sanur)..."
                  inputId="pickup-search"
                  value={fromPlace}
                  onSelect={setFromPlace}
                  onClear={() => setFromPlace(null)}
                  onLocate={() => locateFor("pickup")}
                  locating={locating === "pickup"}
                  onPickOnMap={() => openMapFor("pickup")}
                />
                {locateError?.which === "pickup" && (
                  <p role="alert" className="mt-1.5 text-xs font-medium text-error">
                    {locateError.message}
                  </p>
                )}
              </div>

              {/* Swap Button Column */}
              <div className="lg:col-span-1 flex justify-center py-2 lg:py-0 self-center">
                <button
                  type="button"
                  onClick={handleSwap}
                  disabled={!fromPlace && !toPlace}
                  title="Swap pickup and drop-off"
                  aria-label="Swap pickup and drop-off"
                  className="w-12 h-12 rounded-full bg-white hover:bg-accent text-navy border-2 border-navy/40 hover:border-navy flex items-center justify-center transition-colors duration-200 group disabled:opacity-40 disabled:hover:bg-white"
                >
                  <PiArrowsLeftRight
                    aria-hidden="true"
                    className="text-base transition-transform duration-200 group-hover:rotate-180 motion-reduce:transition-none motion-reduce:group-hover:rotate-0"
                  />
                </button>
              </div>

              <div className="lg:col-span-5">
                <AddressSearchInput
                  label="Drop-off Location"
                  icon={
                    <PiNavigationArrow
                      aria-hidden="true"
                      className="text-pawcab-navy text-base shrink-0"
                    />
                  }
                  placeholder="Search drop-off (e.g. Canggu, Nusa Dua, Uluwatu)..."
                  inputId="dropoff-search"
                  value={toPlace}
                  onSelect={setToPlace}
                  onClear={() => setToPlace(null)}
                  onLocate={() => locateFor("dropoff")}
                  locating={locating === "dropoff"}
                  onPickOnMap={() => openMapFor("dropoff")}
                />
                {locateError?.which === "dropoff" && (
                  <p role="alert" className="mt-1.5 text-xs font-medium text-error">
                    {locateError.message}
                  </p>
                )}
              </div>
            </div>

            {/* Map shortcut: pick either leg by tapping the map. */}
            <div className="flex justify-center mb-6">
              <button
                type="button"
                onClick={() =>
                  openMapFor(fromPlace && !toPlace ? "dropoff" : "pickup")
                }
                className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-full border border-midnight/25 text-midnight text-xs font-medium hover:bg-midnight hover:text-soft-white transition-colors"
              >
                <PiMapPin aria-hidden="true" className="text-base" />
                Choose on Map
              </button>
            </div>

            {/* Note Section (Optional) */}
            <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-warm-ivory/40 border border-sand-beige/60">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="trip-note"
                  className="flex items-center gap-1.5 text-xs text-ink font-medium"
                >
                  <PiNotePencil
                    aria-hidden="true"
                    className="text-pawcab-navy text-base shrink-0"
                  />
                  Trip Notes & Pet Details
                </label>
                <span className="text-[10px] font-semibold text-ink bg-sand-beige/30 px-2.5 py-0.5 rounded-full">
                  Optional
                </span>
              </div>
              <textarea
                id="trip-note"
                value={tripNote}
                onChange={(e) => setTripNote(e.target.value)}
                rows={2}
                placeholder="e.g. 2 large dogs (Golden Retriever), owner will ride along, crate required, pick up at 10:00 AM..."
                className="w-full bg-white border border-line rounded-xl px-3.5 py-2.5 text-sm font-medium text-midnight placeholder:text-ink focus:border-pawcab-navy transition-colors duration-200 resize-none"
              />
            </div>

            {/* ============ RESULT AREA: empty / loading / error / fare ============ */}
            {!bothSelected && (
              <div className="rounded-2xl border border-dashed border-sand-beige bg-warm-ivory/40 p-8 text-center">
                <p className="text-sm sm:text-base text-ink font-medium">
                  Search a pickup and a drop-off above. Your live driving
                  distance and flat-rate fare appear here.
                </p>
              </div>
            )}

            {bothSelected && routeStatus === "loading" && (
              <div
                data-surface="navy" className="rounded-[32px] bg-midnight p-6 sm:p-8"
                role="status"
                aria-busy="true"
                aria-label="Calculating route"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="space-y-3">
                      <div className="h-3 w-24 rounded bg-soft-white/15 animate-pulse" />
                      <div className="h-9 w-32 rounded bg-soft-white/15 animate-pulse" />
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-xs text-soft-white/70">
                  Measuring the driving route with OpenStreetMap...
                </p>
              </div>
            )}

            {bothSelected && routeStatus === "error" && (
              <div data-surface="navy" className="rounded-[32px] bg-midnight p-6 sm:p-8 text-center">
                <p className="text-sm sm:text-base text-soft-white font-medium mb-2">
                  We could not measure that route right now.
                </p>
                <p className="text-xs text-soft-white/70 mb-5">
                  Check your connection, or try two different addresses.
                </p>
                <button
                  type="button"
                  onClick={() => setRouteAttempt((n) => n + 1)}
                  className="inline-flex items-center justify-center px-6 py-3 min-h-[44px] rounded-full bg-accent text-navy text-sm font-medium border-2 border-line hover:bg-accent-hover transition-colors"
                >
                  Retry Route
                </button>
              </div>
            )}

            {bothSelected && routeStatus === "ready" && (
              <div data-surface="navy" className="rounded-2xl bg-navy text-on-dark p-6 sm:p-8 border border-white/10 relative overflow-hidden">

                <p className="text-xs text-soft-white/60 font-semibold mb-3 break-words">
                  {fromPlace?.short} to {toPlace?.short}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center text-center lg:text-left py-2">
                  {/* Driving Distance */}
                  <div className="min-w-0 border-b lg:border-b-0 lg:border-r border-soft-white/15 pb-4 lg:pb-0 lg:pr-4">
                    <span className="text-xs text-soft-white/60 font-semibold block mb-1">
                      Driving Distance
                    </span>
                    <div className="flex items-baseline justify-center lg:justify-start gap-1.5">
                      <span className="text-3xl sm:text-4xl font-semibold tabular-nums text-white">
                        {distanceKm.toFixed(1)}
                      </span>
                      <span className="text-xs font-medium text-accent tracking-wider">
                        KM
                      </span>
                    </div>
                    <p className="text-[11px] text-soft-white/60 mt-1">
                      About {Math.round(durationMin)} min by car
                    </p>
                  </div>

                  {/* Zone + rate applied */}
                  <div className="min-w-0 border-b lg:border-b-0 lg:border-r border-soft-white/15 pb-4 lg:pb-0 lg:pr-4">
                    <span className="text-xs text-soft-white/60 font-medium block mb-1">
                      {fare.zone ? `Zone ${fare.zone} rate` : "Zone"}
                    </span>
                    <div className="flex items-baseline justify-center lg:justify-start gap-1">
                      {fare.tier === "fixed" && fare.rate ? (
                        <>
                          <span className="text-2xl sm:text-3xl font-semibold tabular-nums text-white">
                            {formatRupiah(fare.rate.fixedUpTo5km)}
                          </span>
                          <span className="text-xs text-soft-white/70">fixed</span>
                        </>
                      ) : fare.rate ? (
                        <>
                          <span className="text-2xl sm:text-3xl font-semibold tabular-nums text-white">
                            {formatRupiah(fare.rate.perKm)}
                          </span>
                          <span className="text-xs text-soft-white/70">/ km</span>
                        </>
                      ) : (
                        <span className="text-2xl sm:text-3xl font-semibold tabular-nums text-white">
                          On request
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-soft-white/60 mt-1">
                      {fare.tier === "fixed"
                        ? `Up to ${FIXED_TIER_MAX_KM} km, fixed Zone ${fare.zone} fare`
                        : fare.tier === "per_km"
                          ? `Above ${FIXED_TIER_MAX_KM} km, this zone's rate`
                          : fare.reason === "beyond_range"
                            ? `This zone's rate, but over ${QUOTED_BEYOND_KM} km`
                            : "One or both addresses are outside the zones"}
                    </p>
                    {pickupZone !== null && dropoffZone !== null && fare.zone !== null && (
                      <p className="text-xs text-soft-white/80 mt-2">
                        Pickup Zone {pickupZone} · Drop-off Zone {dropoffZone}.
                        {pickupZone !== dropoffZone && ` Higher Zone ${fare.zone} rate applies in either direction.`}
                      </p>
                    )}
                  </div>

                  {/* Total Fare, or a hand quote when the card runs out */}
                  <div className="min-w-0">
                    {fare.tier === "quote" ? (
                      <>
                        <span className="text-xs text-soft-white/80 font-medium block mb-1">
                          Quoted by hand
                        </span>
                        <p className="text-2xl sm:text-3xl font-semibold tabular-nums text-white leading-tight">
                          {fare.reason === "beyond_range"
                            ? `Over ${QUOTED_BEYOND_KM} km`
                            : "Outside the zones"}
                        </p>
                        <p className="text-[11px] text-soft-white/70 mt-1">
                          Send the route and we reply with a fare.
                        </p>
                      </>
                    ) : (
                      <>
                        <span className="text-xs text-soft-white/80 font-medium block mb-1">
                          Total Estimated Fare
                        </span>
                        <p className="text-3xl sm:text-4xl font-semibold tabular-nums text-white tracking-tight break-words">
                          {formatRupiah(fare.total)}
                        </p>
                        <p className="text-[11px] text-soft-white/70 mt-1">
                          {fare.tier === "fixed"
                            ? `${distanceKm.toFixed(1)} km, fixed Zone ${fare.zone} fare`
                            : `${distanceKm.toFixed(1)} km x ${formatRupiah(fare.rate?.perKm ?? 0)}/km`}
                          {fare.waitingFee > 0 &&
                            ` × 2 round trip (driver waits on site)`}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Round trip: the driver waits on site and the total doubles */}
                <div className="mt-5 pt-5 border-t border-soft-white/15 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-soft-white/75">
                  <label className="inline-flex items-center gap-2.5 min-h-[44px] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={roundTrip}
                      onChange={(e) => setRoundTrip(e.target.checked)}
                      className="h-4 w-4 accent-accent"
                    />
                    Round trip, with waiting
                  </label>
                  {roundTrip && (
                    <span className="text-soft-white/60">
                      Driver waits on site · total is twice the one-way fare
                    </span>
                  )}
                </div>

                {/* Direct Booking CTA */}
                <div className="mt-5 pt-5 border-t border-soft-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-soft-white/70">
                    <span className="font-semibold text-soft-white">
                      Private Vehicle:
                    </span>{" "}
                    Fully air-conditioned, sanitized cabin, no shared pets.
                  </div>

                  <a
                    href={`https://wa.me/${contentData.site?.whatsapp || "6285857883906"}?text=${encodeURIComponent(waMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-analytics-zone={fare.zone ?? ""}
                    data-analytics-total={fare.tier === "quote" ? 0 : fare.total}
                    data-analytics-distance={distanceKm.toFixed(1)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 whitespace-nowrap bg-accent hover:bg-accent-hover text-navy font-medium px-7 py-3.5 min-h-[48px] rounded-full text-[15px] border-2 border-line transition-colors duration-200"
                  >
                    <PiWhatsappLogo aria-hidden="true" className="text-base" />
                    Book This Ride
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-10 p-5 rounded-xl bg-surface border border-sand/70 flex items-start sm:items-center gap-3 text-[13px] leading-relaxed text-ink">
          <PiInfo
            aria-hidden="true"
            className="text-base text-ink shrink-0 mt-0.5 sm:mt-0"
          />
          <p>
            A ride of {FIXED_TIER_MAX_KM} km or less is a fixed zone fare: Zone
            1 {formatRupiah(ZONE_RATES[1].fixedUpTo5km)}, Zone 2{" "}
            {formatRupiah(ZONE_RATES[2].fixedUpTo5km)}, Zone 3{" "}
            {formatRupiah(ZONE_RATES[3].fixedUpTo5km)}, Zone 4{" "}
            {formatRupiah(ZONE_RATES[4].fixedUpTo5km)}. From{" "}
            {FIXED_TIER_MAX_KM + 0.1} to {QUOTED_BEYOND_KM} km the fare is the
            zone rate per kilometre ({formatRupiah(ZONE_RATES[1].perKm)} to{" "}
            {formatRupiah(ZONE_RATES[4].perKm)}), and a cross-zone trip uses the
            higher of the pickup and drop-off zones, in either direction.
            The per-km tier uses the full driving distance, not a fixed fare
            plus extra kilometres. A round trip doubles the one-way fare; the driver waits on site. Beyond{" "}
            {QUOTED_BEYOND_KM} km, outside the four zones, or a full-day
            booking, send the route and we quote by hand. All rides are private,
            fully air-conditioned, and sanitized for your pet&apos;s safety and
            comfort.
          </p>
        </div>

        {/* PawCab zone map, shared with the coverage section */}
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
            <div>
              <p className="text-xs text-ink font-semibold mb-1">
                Interactive Zone Map
              </p>
              <h3 className="font-display text-xl sm:text-2xl font-normal text-midnight">
                The Coverage Map
              </h3>
            </div>
            <p className="text-xs text-midnight/70 font-normal max-w-sm sm:text-right">
              Your pickup and drop-off appear as pins on our zone map. Hover
              any shaded area to see its zone.
            </p>
          </div>

          <div className="w-full rounded-xl overflow-hidden border border-sand bg-white">
            <CoverageEmbed outerZone={fare.zone} endpoints={mapEndpoints} />
          </div>
        </div>
      </div>

      {mapOpen && (
        <MapPickerModal
          target={mapTarget}
          onTargetChange={setMapTarget}
          pickup={fromPlace}
          dropoff={toPlace}
          onClose={() => setMapOpen(false)}
          onConfirm={(place, which) => {
            if (which === "pickup") setFromPlace(place);
            else setToPlace(place);
            setLocateError(null);
            setMapOpen(false);
          }}
        />
      )}
    </section>
  );
}
