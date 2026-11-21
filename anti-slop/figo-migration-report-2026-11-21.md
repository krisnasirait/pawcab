# Figo-adoption implementation report — 2026-11-21 (session, DURING mode)

Plan: `docs/figo-adoption-plan.md`. Scope kept: 5 public routes, shared public components, estimator/map presentation. No pricing-logic, CMS, copy, SEO, or admin changes. No new dependencies, fonts, illustrations, or tracking.

## What changed, by phase

**P0 baseline** (`/tmp/pawcab-p0/`): worktree snapshot (49 entries incl. pre-existing unrelated changes, left untouched), route/component content ledgers, 8 fare-engine boundary outputs, 7 baseline screenshots, tsc clean, eslint 0 err / 9 warn.
**P1 foundation + slice**: `--color-canvas #FBF6F1` token; `main[data-ui="public"]` scope (body 400/1.55, headings Cormorant 400); DESIGN.md dials MOTION 1, flat elevation, 80–96/52–64 type scale; flat `Button` variants (primary amber, secondary forest pill, no lifts); light sticky header (stable 72/80px, forest plate logo, amber CTA, Escape+focus-return menu); hero canvas/type/flat actions/ledger; estimator shell flattened; `data-ui="public"` on all 5 page roots; fixed-header top padding removed on all 5 routes.
**P2 homepage**: FeaturesRow flat strip, ServicesSection editorial rows (panel + frame shadows + reveals gone), About flat forest chapter, Coverage sagewash chapter, BaliZoneMap flat dark surface, Gallery quiet hover (1.02 cap), Comfort flat ledger, HowItWorks flat rules (real `<ol>`/`<li>` kept), reviews heading scale, footer consistent logo lockup (white plate for amber mark).
**P3 service pages + stories**: all 4 heroes rebuilt as text/media grid columns (same images, alts, breadcrumbs, H1s, descriptions, CTAs, hrefs); gradient blends/overlays removed; highlight bands flattened to canvas; cards/panels/FAQs flattened; `font-light`→`font-normal`; `transition-all`→explicit `transition-colors`/grid-property lists with `motion-reduce` guards; amber-on-light text fixed to forest (stories stats, chevrons now forest-on-forest-circle → corrected to amber-on-forest).
**P4 cleanup**: `Reveal.tsx` deleted (zero consumers), `pc-*` classes + reveal keyframes/armed states removed from `globals.css`; fixed an unbalanced brace my edit introduced (build now green, 19 routes).
**P5 acceptance**: below.

## Verification (all passing unless noted)

- `npx tsc --noEmit`: clean. `npx eslint src`: 0 errors, 5 warnings (down from 9; unused imports removed with Reveal). `npm run build`: green. `git diff --check`: clean. `scripts/check-color-tokens.py`: pass.
- Contrast (computed): forest/canvas 11.0, ink/canvas 10.11, deepgreen/canvas 9.64, forest/amber 6.93, white/forest 11.81.
- Browser (CDP): 5 routes at 1440/390/320 + 1024/768, no overflow; sticky header stable; mobile menu opens/dismisses via Escape; estimator live run Seminyak→Canggu = 9.8 km / Zone 2 / Rp 13.000/km (matches P0 expectation); FAQ disclosure toggles; gallery lightbox opens/cycles (Appa 1/18 verified); keyboard Tab reaches controls with `3px solid` forest (cream) and amber (forest) `:focus-visible`; reduced-motion renders h1 opacity 1 with transitions at 0.01ms; no-JS shows full text, links, CTAs; `/login` + `/admin/login` 200, `/admin` 307 (auth redirect, unchanged).
- Fare engine byte-identical P0→P5 across 8 boundary cases (incl. exact 5/15 km, cross-zone outer-zone rule, one-null-endpoint quote behavior — logged as known policy question, not endorsed).

## Numbered residual findings (for approval, not auto-fixed)

1. **[MED] CMS headline fields unused**: `hero.title1/2/3Accent`, service/comfort headings, `comfort.features`, `coverage` fields exist in `content.json` but components render literals. Visual work preserved literals; CMS editability gap remains. Needs content-wiring decision.
2. **[MED] Known fare-policy ambiguities** (per plan §7): one-null-endpoint fares, nearest-coordinate zone lookup, unconfirmed return-leg pricing, literal hero ranges vs CMS rates, stale "flat-rate" idle copy. Behavior byte-identical to baseline; correctness decision still open.
3. **[LOW] Story/quote provenance** (Luna, Milo & Koko, Rocky) still owner-unconfirmed; styling implies no new verification.
4. **[LOW] 200% zoom** not lab-tested (widths 320–1440 + zoom-equivalent 768 covered); no clipping observed, but explicit zoom pass outstanding.
5. **[LOW] Elfsight/Leaflet/OSM internals** unchanged and not fully controllable; admin smoke-test only.

## Limits honestly stated

No full screen-reader pass; no production analytics; widget/experiment variants uncontrolled; reduced-motion tested pre-load; network-failure states code-reviewed, not chaos-tested; working-tree still contains the pre-existing unrelated changes I did not touch.
