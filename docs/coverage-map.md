# Custom PawCab coverage map

The homepage coverage panel is a custom Leaflet map, not a Google Maps iframe. It uses the project's existing Leaflet dependency directly. Roads/place labels are standard OpenStreetMap tiles with visible attribution; no Google API key or new map dependency is required.

## Source and geometry

- User-provided reference: https://www.google.com/maps/d/viewer?mid=1ebzNOKwkJKVQrDPvSP931djaAh4fG50&ll=-8.63899590593672%2C115.22763533002811&z=11
- Public export: https://www.google.com/maps/d/kml?mid=1ebzNOKwkJKVQrDPvSP931djaAh4fG50&forcekml=1
- Retrieved 2026-11-21. Document title: THE PAWCAB SERVICE ZONE.
- Imported into `src/data/coverage-zone-boundaries.json`: 10 polygons, 11 rings, 1,509 coordinate pairs. Sempidi has an inner ring, retained as a hole. Zone polygon counts: 2 / 4 / 1 / 3.
- Coordinates remain longitude/latitude in the source snapshot, converted to latitude/longitude only for Leaflet. No smoothing or invented boundaries. Source URL/date/KML SHA-256 recorded in the JSON.
- User-supplied map shapes were reused, not Google's basemap imagery or branded interface. Shape updates require re-export/re-import; this is not a live sync.

## Files and behavior

- `BaliZoneMap.tsx`: public shell, keyboard-accessible filter buttons, counts, selected area list, expandable full directory, fare link and original map link.
- `BaliCoverageMap.tsx`: client-only, dynamically imported Leaflet renderer, OSM tiles, polygon/point tooltips, zone click selection, zoom/pan. Wheel zoom disabled so page scrolling stays predictable. Zone changes use immediate fitBounds (no reduced-motion exception needed). The map and its layers are created in one effect setup and removed in that effect's cleanup; reconnected effects create a fresh instance. Optional `endpoints` pins (pickup/drop-off) and `heightClass` let the fare estimator reuse the same map: pins refit the view, otherwise zone framing applies. SSR and first client render both start with the lazy placeholder (`useState(false)` + effect upgrade) so hydration matches; the `react-hooks/set-state-in-effect` disables are one-time, render-guarded enhancements.
- `coverage-areas.json`: existing 29 point locations, unchanged. Counts remain 6 / 8 / 5 / 10. Ubud and Gianyar remain listed and plotted.
- Tile failures show a status message. Local polygons, markers and directory remain usable without basemap tiles. No-JavaScript visitors retain the expandable area directory and links.

## Important separation from fares

The reference polygons and existing area directory are independent datasets. The reference's named outer-zone polygon is Mengwi/Abiansemal/Sukawati Gianyar; it does not establish that every listed outer-area point, notably Ubud/Gianyar, lies inside a shaded region. We do not invent polygon extensions to make them agree.

These polygons are display-only. `zoneForPoint`, nearest-coordinate lookup, route calculation, quote policy, pricing data and CMS schema are unchanged. Do not imply that the fare estimator performs polygon containment. Aligning the directory, map and authoritative fare boundaries requires a separate owner decision.

## Verification

Fresh production build at localhost:3104. Browser checked at 320/390/768/1440: all 10 polygon paths and 29 point paths render; no horizontal overflow; OSM tiles load. All four zone buttons select and refit, All zones resets; polygon clicks and real keyboard Enter selection work; directory still includes Ubud/Gianyar. No Google iframe. A blocked-tile fixture shows the fallback status while all 39 overlay paths remain. No observed runtime exceptions during this probe.

TypeScript, component ESLint, color-token script, diff checks and production build pass. This is not a full screen-reader or external-map accuracy certification.

### Estimator reuse

The fare estimator's "Coverage Map" panel reuses this map instead of a generic OSM iframe (`CoverageEmbed` in `PetTransportPricing.tsx`, also IO-gated). It passes the trip's outer zone as `activeZone` and memoised pickup/drop-off pins; polygon clicks are a stable no-op there (hover still names zones). Verified with address fixtures: 39 overlay paths with no addresses, 41 with both pins, no OSM iframe anywhere, no overflow, no runtime errors. The `mapEndpoints` memo keeps typing notes or toggling round-trip from rebuilding pins or yanking the view.

### Cached-navigation lifecycle regression

Reproduced the reported `TileLayer`/`appendChild` error by navigating home → Dog Walking → home in development. With `cacheComponents: true`, Next.js uses React Activity to preserve page state while disconnecting/reconnecting effects. React-Leaflet 5's MapContainer removed its Leaflet map in cleanup but retained the removed instance in refs/context. Reconnecting layer effects then tried to add tiles to destroyed panes.

The coverage renderer now manages the existing Leaflet library directly inside an effect, creating a fresh map/layer set on every setup. Cleanup removes that exact instance and clears its ref. Tile-error callbacks are stable, so ordinary status changes do not reconstruct the map. No global caching/Strict Mode settings, dependencies, map coordinates or fare rules changed.

Run `node scripts/check-map-navigation.mjs http://localhost:3000` with Node 22+ and an open Chrome tab using `--remote-debugging-port=9333`. This navigates home → walking → home three times, asserting one map, 39 overlay paths, working zone filters and no runtime exceptions. Passed on both next dev (:3000) and a fresh production build (:3106). Responsive, shape-click, keyboard and blocked-tile checks were also rerun successfully against :3106. Earlier initial-load-only map checks did not cover this lifecycle.
