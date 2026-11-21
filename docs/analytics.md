# Analytics (Firebase / GA4)

## Events

| Event | When | Params |
|---|---|---|
| `page_view` (auto) | Initial load, via the Analytics SDK | standard |
| `page_view` (manual) | Every client-side navigation (`RouteTracker`; first render skipped to avoid double counting) | `source_page`, `page_title` |
| `fare_calculated` | Estimator returns a priced fare, once per route | `zone`, `distance_km`, `value` (IDR total), `currency: "IDR"`, `round_trip` |
| `generate_lead` | Any `wa.me` CTA click, via one delegated document listener — no per-button code | `method: "whatsapp"`, `link_text`, `source_page`, plus `zone` / `distance_km` / `value` + `currency` when the button carries `data-analytics-*` |

`source_page` (not `page_path`): GA4 drops a custom `page_path` param, so the explicit source page travels under this name. Register `source_page`, `zone`, `link_text` as custom dimensions to slice by them in reports.

Rich-data buttons: “Book This Ride” (`data-analytics-zone/total/distance`), “Book Zone N” (`data-analytics-zone`). To instrument a future CTA, add a `data-analytics-*` attribute — no JS changes needed.

## Files

- `src/lib/firebase.ts` — browser-only app singleton, dynamic `firebase/analytics` import (never in the initial bundle), prod-only sending, `trackEvent()` safe to call anywhere including server code.
- `src/components/FirebaseAnalytics.tsx` — mounted once in the root layout; renders nothing. Owns init, route tracking (inside `Suspense` for `useSearchParams`), and the lead-click listener.
- `src/components/PetTransportPricing.tsx` — `fare_calculated` effect + data attributes.

## Verifying

- Append `?analytics_debug=1` to any URL: every event logs to the console as `[analytics] name params` (works in dev; dev never sends to the property).
- In production, check GA4 **Realtime** — events arrive within seconds. Mark `generate_lead` as a conversion in GA4 Admin > Events.
- CI (`scripts/check-lcp.mjs` + Lighthouse workflow) is unaffected: the SDK loads post-hydration and the listener is passive-cost.
