# Audit 004 follow-up — fixes applied 2026-11-21

Approved numbers 1–4 from `anti-slop/audit-004-2026-11-21.md` fixed. No other application changes.

## 1. Hero grids — fixed
Closed the text-column wrapper before the photo wrapper in all four subpages (`pet-transport`, `dog-walking`, `pet-sitting`, `stories`); removed the now-extra closing div. Verified: 2 grid children, photo right of copy at 1440, copy-first at 390 on all four routes. Screenshot: `/tmp/pawcab-review/fixed-transport.png`.

## 2. Font aliases — fixed, public-scoped
Resolved `--font-display/fraunces/playfair/text/dm-sans/montserrat` inside `main[data-ui="public"]`, where `--font-cormorant`/`--font-public-sans` (set on `<body>`) are visible. Root `@theme` aliases kept so utilities still generate. Verified subpage H1s compute to Cormorant Garamond; `/login` H1 still computes Public Sans (admin/login rendering unchanged). Note: the dev server was serving stale CSS mid-session; restarted it before verifying.

## 3. Gallery lightbox — fixed
Added dialog ref, Tab/Shift+Tab cycling within the dialog, Escape with stopPropagation, and opener capture/restore on the open/close transition only. Verified with real keyboard events: 6 Tabs stay inside; Escape returns focus to the invoking photo button (`View photo of Batman`).

## 4. Map picker — fixed
Same containment/restore pattern on the existing effect (`MapPickerModal.tsx`). Verified: Shift+Tab from close stays inside; Escape closes and returns focus to `Choose on Map`. Leaflet controls, backdrop behavior, opener restoration otherwise untouched.

## Checks
`tsc` clean, eslint 0 errors / 5 warnings (pre-existing `no-img-element` + unused vars), production `npm run build` green, token check pass, `git diff --check` clean.
