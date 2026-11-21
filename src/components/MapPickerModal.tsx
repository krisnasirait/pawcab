"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  ZoomControl,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PiCrosshair, PiMapPin, PiNavigationArrow, PiX } from "react-icons/pi";
import {
  reverseGeocodeBali,
  getCurrentPosition,
  geolocationErrorMessage,
  type OsmPlace,
} from "@/lib/routing";

export type MapTarget = "pickup" | "dropoff";

interface MapPickerModalProps {
  target: MapTarget;
  onTargetChange: (target: MapTarget) => void;
  onConfirm: (place: OsmPlace, target: MapTarget) => void;
  onClose: () => void;
  pickup: OsmPlace | null;
  dropoff: OsmPlace | null;
}

const BALI_CENTER: [number, number] = [-8.65, 115.22];

function pin(color: string, border: string, label: string) {
  return L.divIcon({
    className: "pawcab-map-pin",
    html:
      `<div title="${label}" style="width:30px;height:30px;border-radius:50% 50% 50% 4px;` +
      `transform:rotate(-45deg);background:${color};border:3px solid ${border};` +
      `box-shadow:0 2px 8px rgba(0,0,0,.45)"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 27],
  });
}

const PICKUP_PIN = () => pin("var(--color-accent)", "var(--color-forest)", "Pickup");
const DROPOFF_PIN = () => pin("var(--color-forest)", "var(--color-surface)", "Drop-off");
const CANDIDATE_PIN = () => pin("var(--color-deepgreen)", "var(--color-accent)", "Chosen point");

function ClickToPick({
  onPick,
}: {
  onPick: (lat: number, lon: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FlyTo({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (!center) return;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    map.flyTo(center, 14, { duration: reduceMotion ? 0 : 0.8 });
  }, [center, map]);
  return null;
}

/**
 * Tap-to-pick map modal (OpenStreetMap tiles). The user toggles which leg
 * they are setting, taps anywhere in Bali, and confirms the reverse-geocoded
 * address. Escape, backdrop tap, and a labelled close all dismiss it, and
 * focus returns to the button that opened it.
 */
export default function MapPickerModal({
  target,
  onTargetChange,
  onConfirm,
  onClose,
  pickup,
  dropoff,
}: MapPickerModalProps) {
  const [candidate, setCandidate] = useState<{ lat: number; lon: number } | null>(
    null,
  );
  const [candidatePlace, setCandidatePlace] = useState<OsmPlace | null>(null);
  const [resolving, setResolving] = useState(false);
  const [outsideArea, setOutsideArea] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<Element | null>(null);

  // Focus the dialog on open; hand focus back when it unmounts.
  useEffect(() => {
    openerRef.current = document.activeElement;
    closeRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const items = Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.getClientRects().length > 0);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      (openerRef.current as HTMLElement | null)?.focus?.();
    };
  }, [onClose]);

  // Reverse-geocode the tapped point (debounced, stale lookups aborted).
  // The effect only subscribes; the resolving state starts in pickPoint.
  useEffect(() => {
    if (!candidate) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const place = await reverseGeocodeBali(
          candidate.lat,
          candidate.lon,
          controller.signal,
        );
        if (controller.signal.aborted) return;
        if (!place) {
          setOutsideArea(true);
        } else {
          setCandidatePlace(place);
        }
      } catch {
        if (!controller.signal.aborted) setOutsideArea(true);
      } finally {
        if (!controller.signal.aborted) setResolving(false);
      }
    }, 400);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [candidate]);

  const pickPoint = (lat: number, lon: number) => {
    setGeoError(null);
    setResolving(true);
    setOutsideArea(false);
    setCandidatePlace(null);
    setCandidate({ lat, lon });
  };

  const handleLocate = async () => {
    setLocating(true);
    setGeoError(null);
    try {
      const pos = await getCurrentPosition();
      setFlyTo([pos.lat, pos.lon]);
      pickPoint(pos.lat, pos.lon);
    } catch (err) {
      setGeoError(geolocationErrorMessage(err));
    } finally {
      setLocating(false);
    }
  };

  const focusPlace = target === "pickup" ? pickup : dropoff;
  const initialCenter: [number, number] = focusPlace
    ? [focusPlace.lat, focusPlace.lon]
    : BALI_CENTER;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Choose location on map"
      ref={dialogRef}
      className="fixed inset-0 z-[60] bg-deep-midnight/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div
        className="bg-soft-white rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 p-5 sm:p-6 pb-4">
          <div>
            <h3 className="font-playfair text-xl sm:text-2xl font-medium text-deep-midnight">
              Choose on Map
            </h3>
            <p className="text-xs sm:text-sm text-warm-taupe mt-1">
              Tap anywhere in Bali, then set it as your {target}.
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close map picker"
            className="w-11 h-11 shrink-0 rounded-full bg-deep-midnight/5 hover:bg-deep-midnight/10 text-deep-midnight flex items-center justify-center transition-colors"
          >
            <PiX aria-hidden="true" className="text-2xl" />
          </button>
        </div>

        {/* Target toggle */}
        <div className="px-5 sm:px-6 pb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-warm-taupe mr-1">
            Setting:
          </span>
          {(
            [
              { id: "pickup", label: "Pickup", icon: <PiMapPin aria-hidden="true" /> },
              { id: "dropoff", label: "Drop-off", icon: <PiNavigationArrow aria-hidden="true" /> },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTargetChange(t.id)}
              aria-pressed={target === t.id}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-full text-xs font-medium transition-colors ${
                target === t.id
                  ? "bg-forest text-white"
                  : "bg-deep-midnight/5 text-deep-midnight hover:bg-deep-midnight/10"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
          <span
            aria-hidden="true"
            className="ml-auto hidden sm:flex items-center gap-3 text-[11px] text-warm-taupe font-medium"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-pawcab-gold border border-deep-midnight inline-block" />
              Pickup
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-deep-midnight border border-white inline-block" />
              Drop-off
            </span>
          </span>
        </div>

        {/* Map */}
        <div className="px-5 sm:px-6">
          <div className="rounded-2xl overflow-hidden border border-sand-beige/60">
            <MapContainer
              center={initialCenter}
              zoom={focusPlace ? 14 : 10}
              scrollWheelZoom={false}
              zoomControl={false}
              style={{ height: "52vh", minHeight: 300, width: "100%" }}
            >
              <ZoomControl position="topright" />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ClickToPick onPick={pickPoint} />
              <FlyTo center={flyTo} />
              {pickup && (
                <Marker
                  position={[pickup.lat, pickup.lon]}
                  icon={PICKUP_PIN()}
                  title={`Pickup: ${pickup.short}`}
                />
              )}
              {dropoff && (
                <Marker
                  position={[dropoff.lat, dropoff.lon]}
                  icon={DROPOFF_PIN()}
                  title={`Drop-off: ${dropoff.short}`}
                />
              )}
              {candidate && (
                <Marker
                  position={[candidate.lat, candidate.lon]}
                  icon={CANDIDATE_PIN()}
                  title="Chosen point"
                />
              )}
            </MapContainer>
          </div>
        </div>

        {/* Status + actions */}
        <div className="p-5 sm:p-6 pt-4">
          {geoError && (
            <p role="alert" className="text-xs sm:text-sm text-warm-taupe font-medium mb-3">
              {geoError}
            </p>
          )}

          {resolving && (
            <p role="status" className="text-xs sm:text-sm text-warm-taupe font-medium mb-3">
              Finding the address for that point...
            </p>
          )}

          {outsideArea && !resolving && (
            <p role="alert" className="text-xs sm:text-sm text-warm-taupe font-medium mb-3">
              That point is outside our Bali service area. Try a spot on the
              island.
            </p>
          )}

          {candidatePlace && !resolving && (
            <div className="rounded-2xl bg-warm-ivory border border-sand-beige/50 p-4 mb-4">
              <p className="text-sm font-bold text-deep-midnight">
                {candidatePlace.short}
              </p>
              <p className="text-xs text-warm-taupe mt-0.5">
                {candidatePlace.name}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleLocate}
              disabled={locating}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-full border border-deep-midnight/25 text-deep-midnight text-xs font-medium hover:bg-deep-midnight hover:text-soft-white transition-colors disabled:opacity-60"
            >
              {locating ? (
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-sand-beige border-t-pawcab-navy"
                />
              ) : (
                <PiCrosshair aria-hidden="true" className="text-base" />
              )}
              {locating ? "Locating..." : "Use My Location"}
            </button>
            <button
              type="button"
              disabled={!candidatePlace || resolving}
              onClick={() => candidatePlace && onConfirm(candidatePlace, target)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[48px] rounded-full bg-accent text-forest text-sm font-medium border-2 border-line hover:bg-accent-hover transition-colors disabled:opacity-40"
            >
              Set as {target === "pickup" ? "Pickup" : "Drop-off"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
