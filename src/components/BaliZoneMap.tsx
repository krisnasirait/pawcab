"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { PiArrowSquareOut } from "react-icons/pi";
import coverage from "@/data/coverage-areas.json";
import { PAWCAB_ZONES } from "@/data/fareCalculatorData";

const Map = dynamic(() => import("./BaliCoverageMap"), {
  ssr: false,
  loading: () => <div role="status" className="h-[420px] sm:h-[520px] flex items-center justify-center bg-sagewash text-sm text-forest">Loading service map…</div>,
});

const ZONE_FILL: Record<number, string> = {
  1: "var(--color-map-zone-1)",
  2: "var(--color-map-zone-2)",
  3: "var(--color-map-zone-3)",
  4: "var(--color-map-zone-4)",
};

const REFERENCE_URL = "https://www.google.com/maps/d/viewer?mid=1ebzNOKwkJKVQrDPvSP931djaAh4fG50&ll=-8.63899590593672%2C115.22763533002811&z=11";

export default function BaliZoneMap() {
  const [activeZone, setActiveZone] = useState<number | null>(null);
  const [tilesUnavailable, setTilesUnavailable] = useState(false);
  // Always start false so server HTML matches the first client render.
  const [mapVisible, setMapVisible] = useState(false);
  const mapAnchorRef = useRef<HTMLDivElement>(null);
  const handleTileError = useCallback(() => setTilesUnavailable(true), []);
  useEffect(() => {
    const el = mapAnchorRef.current;
    if (!el || mapVisible) return;
    if (typeof IntersectionObserver === "undefined") {
      // One-time progressive enhancement, not a render loop: guarded above.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMapVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMapVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mapVisible]);
  const areas = coverage.areas.filter((a) => activeZone === null || a.zoneId === activeZone);

  return (
    <div data-surface="light" className="rounded-[28px] border border-forest/20 bg-surface text-forest">
      <div role="group" aria-label="Filter by zone" className="flex flex-wrap gap-2 p-4 sm:p-5">
        <button
          type="button"
          aria-pressed={activeZone === null}
          onClick={() => setActiveZone(null)}
          className={`inline-flex items-center min-h-11 px-4 rounded-full text-sm font-medium border transition-colors duration-200 ${activeZone === null ? "bg-forest text-white border-forest" : "bg-surface text-forest border-forest/40 hover:border-forest"}`}
        >
          All zones
        </button>
        {PAWCAB_ZONES.map((zone) => (
          <button
            key={zone.id}
            type="button"
            aria-pressed={activeZone === zone.id}
            onClick={() => setActiveZone(activeZone === zone.id ? null : zone.id)}
            className={`inline-flex items-center gap-2 min-h-11 px-4 rounded-full text-sm font-medium border transition-colors duration-200 ${activeZone === zone.id ? "bg-forest text-white border-forest" : "bg-surface text-forest border-forest/40 hover:border-forest"}`}
          >
            <span aria-hidden="true" className="size-2.5 rounded-full border border-forest/40" style={{ backgroundColor: ZONE_FILL[zone.id] }} />
            Zone {zone.id} · {coverage.areas.filter((a) => a.zoneId === zone.id).length}
          </button>
        ))}
      </div>

      <div ref={mapAnchorRef} role="region" aria-label="Interactive PawCab service zone map" className="relative z-0 border-y border-forest/15">
        {mapVisible ? (
          <Map activeZone={activeZone} onSelectZone={setActiveZone} onTileError={handleTileError} />
        ) : (
          <div role="status" className="h-[420px] sm:h-[520px] flex items-center justify-center bg-sagewash text-sm text-forest">Loading service map…</div>
        )}
        <noscript><p className="p-4 text-sm text-ink">The interactive map needs JavaScript. The full service-area directory and original map link are available below.</p></noscript>
      </div>

      <div className="p-4 sm:p-5">
        <p className="text-xs leading-relaxed text-ink mb-3">
          Shaded areas show mapped zones; dots mark service locations. Confirm your fare in the estimator.
        </p>
        {tilesUnavailable && (
          <p role="status" className="text-sm leading-relaxed text-ink mb-4">
            Some map tiles could not load. Zone boundaries and the area directory are still available.
          </p>
        )}
        <div aria-live="polite" aria-atomic="true" className="text-sm leading-relaxed text-ink">
          {activeZone === null ? (
            <p>{coverage.areas.length} areas across {PAWCAB_ZONES.length} zones. Choose a zone to explore its boundaries and areas.</p>
          ) : (
            <p><strong className="font-semibold text-forest">Zone {activeZone}</strong>: {areas.map((a) => a.name).join(", ")}</p>
          )}
        </div>
        <details className="mt-3 text-sm text-ink">
          <summary className="min-h-11 py-3 font-medium text-forest underline underline-offset-4">View all service areas</summary>
          <ul role="list" className="space-y-3 pb-3 leading-relaxed">
            {PAWCAB_ZONES.map((zone) => (
              <li key={zone.id}><strong className="font-semibold text-forest">Zone {zone.id}</strong>: {coverage.areas.filter((a) => a.zoneId === zone.id).map((a) => a.name).join(", ")}</li>
            ))}
          </ul>
        </details>
        <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 mt-3 pt-4 border-t border-forest/15">
          <a href="#fare" className="inline-flex items-center justify-center min-h-12 rounded-full bg-forest text-white font-medium text-sm px-5 hover:bg-deepgreen transition-colors duration-200">
            {activeZone ? `Price a ride in Zone ${activeZone}` : "Price a ride"}
          </a>
          <a href={REFERENCE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 min-h-11 text-sm text-forest underline underline-offset-4">
            View original map <PiArrowSquareOut aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
