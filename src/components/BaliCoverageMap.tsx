"use client";

import { useEffect, useRef } from "react";
import L, { type LatLngTuple } from "leaflet";
import boundaries from "@/data/coverage-zone-boundaries.json";
import coverage from "@/data/coverage-areas.json";
import "leaflet/dist/leaflet.css";

const colors: Record<number, string> = {
  1: "var(--color-map-zone-1)",
  2: "var(--color-map-zone-2)",
  3: "var(--color-map-zone-3)",
  4: "var(--color-map-zone-4)",
};

const regions = boundaries.regions.map((region) => ({
  ...region,
  positions: region.rings.map((ring) => ring.map(([lon, lat]): LatLngTuple => [lat, lon])),
}));

function tooltipText(text: string) {
  const label = document.createElement("span");
  label.textContent = text;
  return label;
}

type MapInstance = {
  map: L.Map;
  polygons: { zoneId: number; layer: L.Polygon }[];
  markers: { zoneId: number; layer: L.CircleMarker }[];
  pins: L.CircleMarker[];
};

export interface MapEndpoint {
  lat: number;
  lon: number;
  label: string;
}

export default function BaliCoverageMap({ activeZone, onSelectZone, onTileError, endpoints, heightClass }: {
  activeZone: number | null;
  onSelectZone: (zone: number) => void;
  onTileError: () => void;
  /** Optional pins (e.g. estimator pickup/drop-off) drawn over the zones. */
  endpoints?: MapEndpoint[];
  heightClass?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<MapInstance | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    // Cached routes disconnect/reconnect effects without resetting refs or state.
    // Create the map inside setup so a removed instance is never reused on return.
    const map = L.map(containerRef.current, {
      minZoom: 8,
      maxZoom: 17,
      scrollWheelZoom: false,
      zoomControl: false,
    }).setView([-8.68, 115.2], 11);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).on("tileerror", onTileError).addTo(map);
    L.control.zoom({ position: "topright" }).addTo(map);

    const polygons = regions.map((region) => ({
      zoneId: region.zoneId,
      layer: L.polygon(region.positions, {
        color: "var(--color-forest)",
        fillColor: colors[region.zoneId],
        fillRule: "evenodd",
      })
        .bindTooltip(tooltipText(`Zone ${region.zoneId}: ${region.name}`), { sticky: true })
        .on("click", () => onSelectZone(region.zoneId))
        .addTo(map),
    }));
    const markers = coverage.areas.map((area) => ({
      zoneId: area.zoneId,
      layer: L.circleMarker([area.lat, area.lon], {
        color: "var(--color-forest)",
        weight: 1.5,
        fillColor: colors[area.zoneId],
      })
        .bindTooltip(tooltipText(`${area.name}, Zone ${area.zoneId}`))
        .on("click", () => onSelectZone(area.zoneId))
        .addTo(map),
    }));
    instanceRef.current = { map, polygons, markers, pins: [] };
    return () => {
      instanceRef.current = null;
      map.remove();
    };
  }, [onSelectZone, onTileError]);

  useEffect(() => {
    const instance = instanceRef.current;
    if (!instance) return;
    const { map, polygons, markers } = instance;
    for (const pin of instance.pins) pin.remove();
    instance.pins = (endpoints ?? []).map((point) =>
      L.circleMarker([point.lat, point.lon], {
        radius: 8,
        color: "var(--color-surface)",
        weight: 2.5,
        fillColor: "var(--color-forest)",
        fillOpacity: 1,
      })
        .bindTooltip(tooltipText(point.label))
        .addTo(map),
    );
    for (const { zoneId, layer } of polygons) {
      const visible = activeZone === null || activeZone === zoneId;
      layer.setStyle({ weight: activeZone === zoneId ? 2.5 : 1.25, opacity: visible ? 0.8 : 0.25, fillOpacity: visible ? 0.55 : 0.1 });
    }
    for (const { zoneId, layer } of markers) {
      const visible = activeZone === null || activeZone === zoneId;
      layer.setRadius(activeZone === zoneId ? 5 : 3.5);
      layer.setStyle({ opacity: visible ? 1 : 0.25, fillOpacity: visible ? 1 : 0.25 });
    }
    const pinPoints = (endpoints ?? []).map((p): LatLngTuple => [p.lat, p.lon]);
    if (pinPoints.length > 0) {
      map.fitBounds(L.latLngBounds(pinPoints), { padding: [48, 48], animate: false, maxZoom: 13 });
    } else {
      const points = regions.filter((r) => activeZone === null || r.zoneId === activeZone).flatMap((r) => r.positions[0]);
      coverage.areas.filter((a) => activeZone === null || a.zoneId === activeZone).forEach((a) => points.push([a.lat, a.lon]));
      map.fitBounds(L.latLngBounds(points), { padding: [24, 24], animate: false, maxZoom: 12 });
    }
  }, [activeZone, endpoints, onSelectZone, onTileError]);

  return (
    <div
      ref={containerRef}
      className={heightClass ?? "h-[420px] sm:h-[520px] w-full"}
      style={{ fontFamily: "var(--font-public-sans), system-ui, sans-serif" }}
    />
  );
}
