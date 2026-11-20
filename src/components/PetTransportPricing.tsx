"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  BsArrowRight,
  BsInfoCircle,
  BsArrowLeftRight,
  BsWhatsapp,
} from "react-icons/bs";
import {
  PiMapPin,
  PiNavigationArrow,
  PiCalculator,
  PiNotePencil,
} from "react-icons/pi";
import { formatRupiah } from "@/data/fareCalculatorData";
import {
  fetchDrivingRoute,
  calculateFlatFare,
  getCurrentPosition,
  geolocationErrorMessage,
  reverseGeocodeBali,
  osmLinkFor,
  type OsmPlace,
} from "@/lib/routing";
import contentData from "@/lib/content";
import AddressSearchInput from "./AddressSearchInput";
import type { MapTarget } from "./MapPickerModal";

const MapPickerModal = dynamic(() => import("./MapPickerModal"), {
  ssr: false,
});

type RouteStatus = "idle" | "loading" | "ready" | "error";

/* ============================================================================
   MAIN PET TRANSPORT PRICING COMPONENT
   Pickup and drop-off are searched live via OpenStreetMap Nominatim
   (restricted to Bali), the driving distance comes from OSRM, and the fare
   is one flat rate per kilometer. No zone tables, no static estimates.
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

  const minimumFare =
    contentData?.servicesPages?.petTransport?.pricingConfig?.minimumFare ??
    65000;

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

  const fare = useMemo(
    () => calculateFlatFare(distanceKm, minimumFare),
    [distanceKm, minimumFare],
  );

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
      msg += `PICKUP: ${fromPlace.name}\nMaps: ${osmLinkFor(fromPlace.lat, fromPlace.lon)}\n\n`;
    }
    if (toPlace) {
      msg += `DROP-OFF: ${toPlace.name}\nMaps: ${osmLinkFor(toPlace.lat, toPlace.lon)}\n\n`;
    }
    msg += `ESTIMATE: ~${distanceKm.toFixed(1)} km (~${Math.round(durationMin)} min drive) at ${formatRupiah(fare.ratePerKm)}/km\n`;
    msg += `TOTAL FARE: ${formatRupiah(fare.finalFare)}\n`;

    if (tripNote.trim()) {
      msg += `\nNOTE / PET DETAILS:\n${tripNote.trim()}\n`;
    }

    msg += `\nPlease confirm driver availability. Thank you!`;
    return msg;
  }, [fromPlace, toPlace, distanceKm, durationMin, fare, tripNote]);

  return (
    <section
      id="fare"
      className="relative py-16 md:py-24 px-5 md:px-8 bg-[#FFFEFA] border-y border-[#D8C9AE]/60 scroll-mt-20"
    >
      <span id="pricing" aria-hidden="true" className="absolute -top-20" />
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-10 md:mb-12">
          <p className="flex items-center gap-3 text-[14px] font-medium text-[#0E6B5E] mb-4">
            <span aria-hidden="true" className="inline-block h-px w-10 bg-[#0E6B5E]" />
            Price your ride
          </p>
          <h2 className="text-4xl md:text-[52px] leading-[1.05] font-semibold text-[#0E2A21]" style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}>
            One flat rate. Measured live.
          </h2>
          <p className="text-[#3F382E] text-[16px] leading-relaxed mt-4">
            Type any two Bali addresses. We measure the real driving distance
            and charge Rp 10.000 per km. The booking message writes itself.
          </p>
        </div>

        {/* ========================================================
            INTERACTIVE CALCULATOR WIDGET (LUXURY CARD)
            ======================================================== */}
        <div className="max-w-4xl mx-auto mb-10 bg-white rounded-2xl p-6 sm:p-8 md:p-9 border border-[#D8C9AE] shadow-[0_10px_30px_rgba(14,42,33,0.08)] relative overflow-visible">
          <div className="relative z-10">
            {/* Widget Title & Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-dashed border-[#D8C9AE] mb-7">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0E2A21]" style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}>
                  Trip fare estimator
                </h3>
                <p className="text-[13.5px] text-[#3F382E] mt-1">
                  Live driving distance, flat rate, WhatsApp ready
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#0E2A21] text-[#FFFEFA] text-[13px] font-bold">
                Rp 10.000 / km
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
                      className="text-pawcab-gold text-base shrink-0"
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
                  <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">
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
                  className="w-12 h-12 rounded-full bg-white hover:bg-pawcab-gold text-deep-midnight border border-sand-beige/70 flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 group disabled:opacity-40 disabled:hover:bg-white disabled:hover:scale-100"
                >
                  <BsArrowLeftRight
                    aria-hidden="true"
                    className="text-base group-hover:rotate-180 transition-transform duration-300"
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
                  <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">
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
                className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-full border border-deep-midnight/25 text-deep-midnight text-xs font-bold uppercase tracking-wider hover:bg-deep-midnight hover:text-soft-white transition-colors"
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
                  className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-warm-taupe font-bold"
                >
                  <PiNotePencil
                    aria-hidden="true"
                    className="text-pawcab-navy text-base shrink-0"
                  />
                  Trip Notes & Pet Details
                </label>
                <span className="text-[10px] uppercase font-semibold text-warm-taupe bg-sand-beige/30 px-2.5 py-0.5 rounded-full">
                  Optional
                </span>
              </div>
              <textarea
                id="trip-note"
                value={tripNote}
                onChange={(e) => setTripNote(e.target.value)}
                rows={2}
                placeholder="e.g. 2 large dogs (Golden Retriever), owner will ride along, crate required, pick up at 10:00 AM..."
                className="w-full bg-white border border-warm-taupe rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-deep-midnight placeholder:text-warm-taupe focus:outline-none focus:border-pawcab-navy transition-all resize-none shadow-2xs"
              />
            </div>

            {/* ============ RESULT AREA: empty / loading / error / fare ============ */}
            {!bothSelected && (
              <div className="rounded-2xl border border-dashed border-sand-beige bg-warm-ivory/40 p-8 text-center">
                <p className="text-sm sm:text-base text-warm-taupe font-medium">
                  Search a pickup and a drop-off above. Your live driving
                  distance and flat-rate fare appear here.
                </p>
              </div>
            )}

            {bothSelected && routeStatus === "loading" && (
              <div
                className="rounded-3xl bg-deep-midnight p-6 sm:p-8"
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
              <div className="rounded-3xl bg-deep-midnight p-6 sm:p-8 text-center">
                <p className="text-sm sm:text-base text-soft-white font-medium mb-2">
                  We could not measure that route right now.
                </p>
                <p className="text-xs text-soft-white/70 mb-5">
                  Check your connection, or try two different addresses.
                </p>
                <button
                  type="button"
                  onClick={() => setRouteAttempt((n) => n + 1)}
                  className="inline-flex items-center justify-center px-6 py-3 min-h-[44px] rounded-full bg-pawcab-gold text-deep-midnight text-xs font-bold uppercase tracking-wider hover:bg-yellow-400 transition-colors"
                >
                  Retry Route
                </button>
              </div>
            )}

            {bothSelected && routeStatus === "ready" && (
              <div className="rounded-2xl bg-[#0E2A21] text-[#FFFEFA] p-6 sm:p-8 shadow-xl border border-white/10 relative overflow-hidden">

                <p className="text-[11px] uppercase tracking-widest text-soft-white/60 font-semibold mb-3">
                  {fromPlace?.short} to {toPlace?.short}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center md:text-left py-2">
                  {/* Driving Distance */}
                  <div className="border-b md:border-b-0 md:border-r border-soft-white/15 pb-4 md:pb-0 md:pr-4">
                    <span className="text-[11px] uppercase tracking-widest text-soft-white/60 font-semibold block mb-1">
                      Driving Distance
                    </span>
                    <div className="flex items-baseline justify-center md:justify-start gap-1.5">
                      <span className="font-playfair text-3xl sm:text-4xl font-bold text-white">
                        {distanceKm.toFixed(1)}
                      </span>
                      <span className="text-xs font-bold text-pawcab-gold uppercase tracking-wider">
                        KM
                      </span>
                    </div>
                    <p className="text-[11px] text-soft-white/60 mt-1">
                      About {Math.round(durationMin)} min by car
                    </p>
                  </div>

                  {/* Flat Rate */}
                  <div className="border-b md:border-b-0 md:border-r border-soft-white/15 pb-4 md:pb-0 md:pr-4">
                    <span className="text-[11px] uppercase tracking-widest text-soft-white/60 font-semibold block mb-1">
                      Flat Rate
                    </span>
                    <div className="flex items-baseline justify-center md:justify-start gap-1">
                      <span className="font-playfair text-2xl sm:text-3xl font-bold text-white">
                        {formatRupiah(fare.ratePerKm)}
                      </span>
                      <span className="text-xs text-soft-white/70">/ KM</span>
                    </div>
                    <p className="text-[11px] text-soft-white/60 mt-1">
                      Same rate for every trip
                    </p>
                  </div>

                  {/* Total Fare */}
                  <div>
                    <span className="text-[11px] uppercase tracking-widest text-pawcab-gold font-bold block mb-1">
                      Total Estimated Fare
                    </span>
                    <p className="font-playfair text-3xl sm:text-4xl md:text-5xl font-extrabold text-pawcab-gold tracking-tight">
                      {formatRupiah(fare.finalFare)}
                    </p>
                    <p className="text-[11px] text-soft-white/70 mt-1">
                      {distanceKm.toFixed(1)} km x{" "}
                      {formatRupiah(fare.ratePerKm)}/km
                      {fare.isMinimumApplied &&
                        ` (minimum fare ${formatRupiah(minimumFare)} applies)`}
                    </p>
                  </div>
                </div>

                {/* Direct Booking CTA */}
                <div className="mt-6 pt-5 border-t border-soft-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-soft-white/70">
                    <span className="font-semibold text-soft-white">
                      Private Vehicle:
                    </span>{" "}
                    Fully air-conditioned, sanitized cabin, no shared pets.
                  </div>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(waMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-pawcab-gold hover:bg-yellow-400 text-deep-midnight font-bold px-7 py-3.5 min-h-[44px] rounded-full text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <BsWhatsapp aria-hidden="true" className="text-base" />
                    Book This Ride
                    <BsArrowRight aria-hidden="true" className="text-xs" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-10 p-5 rounded-xl bg-[#FBF8F1] border border-[#D8C9AE]/70 flex items-start sm:items-center gap-3 text-[13px] leading-relaxed text-[#3F382E]">
          <BsInfoCircle
            aria-hidden="true"
            className="text-base text-warm-taupe shrink-0 mt-0.5 sm:mt-0"
          />
          <p>
            Fares use the live driving distance (OpenStreetMap routing) at a
            flat Rp 10.000/km, with a minimum fare of{" "}
            {formatRupiah(minimumFare)}. All rides are private, fully
            air-conditioned, and sanitized for your pet&apos;s safety and
            comfort. For multi-stop itineraries, contact our support team for a
            personalized quotation.
          </p>
        </div>

        {/* Interactive OpenStreetMap Coverage Map */}
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
            <div>
              <p className="text-xs uppercase tracking-widest text-warm-taupe font-semibold mb-1">
                Interactive Zone Map
              </p>
              <h3 className="font-playfair text-xl sm:text-2xl font-bold text-deep-midnight">
                The Coverage Map
              </h3>
            </div>
            <p className="text-xs text-deep-midnight/70 font-normal max-w-sm sm:text-right">
              Zoom to explore our Bali service coverage. Every searchable
              address above is routed live.
            </p>
          </div>

          <div className="w-full rounded-xl overflow-hidden border border-[#D8C9AE] bg-white">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=114.2500%2C-8.9500%2C115.8000%2C-7.9500&layer=mapnik"
              width="100%"
              height="380"
              className="w-full h-[300px] sm:h-[350px] md:h-[380px] border-0"
              loading="lazy"
              title="PawCab Bali service coverage map"
            />
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
