# Audit 005 follow-up — fixes applied 2026-11-21

Approved findings 1–5 from `anti-slop/audit-005-2026-11-21.md` fixed. Verified against a fresh production build (`npm run build` green) served at localhost:3102, plus the dev server. One approved finding required a correction during implementation; see #2.

## 1. Shared chrome scope — fixed
Moved the six font-alias definitions and public text defaults (400 / 1.55) from `main[data-ui="public"]` to `body:has(main[data-ui="public"])` in `src/app/globals.css`. Production computed styles: header/footer wordmarks are Cormorant Garamond 500 on all five public routes. `/login` and `/admin/login` H1s still compute Public Sans 700 — admin/login rendering unchanged.

## 2. Unsupported serif weights — fixed with correction
Estimator numerals (distance, rate, “On request”, quote state, total) changed from display serif to Public Sans semibold with tabular figures; verified live on a populated Seminyak→Canggu fare (9.8 / Rp 13.000 / Rp 128.000 all Public Sans 600 tabular). Map dialog heading changed from 700 to Cormorant 500. Correction to the audit: the report's claim that `PetTransportPricing.tsx:491` used `font-playfair` was wrong — that element is the hero fare-ledger excerpt, not the populated fare panel; the actual serif numeral spans were in the fare-result states and are now fixed as described.

## 3. Booking steps — fixed
`HowItWorksSection.tsx`: step titles changed from weight 300 to 400 with explicit 1.25 leading. Verified 20px / 25px on desktop and phone.

## 4. Estimator heading — fixed
`PetTransportPricing.tsx`: estimator H2 leading changed from 0.95 to 1.05. Verified 52px / 54.6px desktop, 36px / 34.2px phone.

## 5. Booking text scale — fixed
Fare-panel route summary, “Driving Distance”, zone-rate, and quote/total headers changed from 11px to 12px; captions remain 11px secondary metadata. Notes textarea and field labels are 14px; address attribution stays 11px. All three FAQ question styles changed from serif 400 to serif 500 (18px at desktop widths, 16px base on phones).

## Checks
`tsc` clean, eslint 0 errors / 5 pre-existing warnings, `git diff --check` clean, token checks pass, production build green. During verification, two transient stale-CSS readings occurred (dev chunk recompiling after restart; an old production server still bound to :3102). Both were identified and re-verified; final readings above are from the current build.
