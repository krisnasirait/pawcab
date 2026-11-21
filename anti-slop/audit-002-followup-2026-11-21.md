# Audit 002 follow-up, 2026-11-21

All 7 HIGH, 8 MEDIUM and 5 LOW numbers from `audit-002-2026-11-21.md` were approved and fixed.
Mode AFTER: this report records what changed, how it was verified, and the Delivery Gate.

## What changed

Colour system (`src/app/globals.css`):

- `--color-accent: #FEBB00`, the measured logo amber, replaces lime `#B2D235` everywhere.
- `--color-accent-ink: #1C3F1D` is the only text colour allowed on amber (6.93:1).
- `--color-pawcab-gold` now resolves to `#FEBB00` and is documented as the logo colour, so the
  name and the value agree again. `--color-brass` documented as `#2A4726`.
- Lime is gone: no `--color-lime`, no `#B2D235` left in `src`.
- `.pc-card-lg` and `.pc-frame-accent` carry the amber shadow; `.pc-card` and `.pc-frame` carry
  forest. Three elevation ranks only.

Header and hero:

- Header is forest `#1C3F1D` with the amber mark directly on it (6.93:1, no white chip), white
  nav at 6.65:1, one amber action with forest ink.
- Hero headline is amber on forest; the field below the split is a sage plate so the fare ticket
  overlaps a surface instead of dead white; the ticket carries the forest shadow.

Everywhere the accent was doing a structural job it is now forest or sage: eyebrow rules, marker
dots, link underlines, gallery numbering, section rules. Amber is the primary action plus the mark.

Also fixed: the gallery heading that rendered forest on forest (root cause: headings on a dark
band now inherit that band via `data-surface="forest"`); em dash removed from the map detail text;
tap targets raised (inputs 48px, logo link 44px); header/footer text lifted above 4.5:1; radius
scale reduced to 12/16/28/32/75/pill; soft shadows replaced with the three hard ranks (46
replacements); one icon set (Phosphor) across 12 public files; uppercase wide-tracked labels
removed (57 lines); the transport highlights, and the same strip on walking and sitting, now sit on
solid white plates so their contrast is knowable; jargon acronyms untouched.

New files: `DESIGN.md` (dials, palette reasons, radius/elevation ranks, theme decision, icon rule,
alias note), and this report.

## Verification

Build: `npm run build` exit 0, 19 routes. Types: `npx tsc --noEmit` clean. Lint: 0 errors, 9
pre-existing warnings (all `no-img-element` in service pages and two unused `expandAll` helpers).

Contrast scan (every text node composited over its effective background, 5 routes, 1440 and 390):

| Route | Failures before | Failures after |
|---|---|---|
| `/` | 1 invisible heading | 0 |
| `/services/pet-transport` | 9 | 0 |
| `/services/dog-walking` | 8 | 0 |
| `/services/pet-sitting` | 8 | 0 |
| `/stories` | 0 | 0 |

Radii on `/`: pill x28, 28px x24, 12px x12, 16px x3, 75px x2, 32px x1. No value outside the scale.
Overflow: `scrollWidth === innerWidth` at 1440 and 390 on every route.
Palette on `/`: 12 text colours and 14 backgrounds, all from the token set (amber, forest, deep
green, sage, ink, line, white, plus alpha variants of white and forest).

Recorded click-through (headless Chrome, one pass, `Runtime.consoleAPICalled` watched):

- nav links: 5 links, each `href` a real route -> PASS
- header CTA -> `https://wa.me/6282266383800?text=...` in a new tab -> PASS
- zone chip: `aria-pressed` false -> true, `aria-live` detail updated to "Zone 1, Seminyak, Kuta,
  Legian, Sanur, Denpasar..." -> PASS
- gallery lightbox: opens `role="dialog"`, closes on Escape -> PASS
- calculator: empty state present before any input -> PASS
- FAQ accordion: `aria-expanded` false -> true -> false, panel toggles -> PASS
- mobile menu at 390: opens, closes on Escape -> PASS
- horizontal overflow at 390: none -> PASS
- console errors across the run: 0 -> PASS
- billing toggle: not applicable, this product has no billing toggle (that control belongs to the
  reference site, not to PawCab)

Reduced motion: `prefers-reduced-motion: reduce` leaves all 21 reveal elements at opacity 1, and the
reveal is never armed. JS disabled: `data-reveal` never set, so all content renders.

Logo: `#FEBB00` now sits on forest at 6.93:1 in header and footer; the amber action uses forest ink
at 6.93:1; amber never carries white text and is never text on white or sage.

## Delivery Gate

Block 1, Hard Gate (all "no"):

- R-02 em dash: no. Removed from map copy, docs and this report.
- R-03 mobile: no overflow, text inside containers, tap targets >= 44px on the interactive set
  (the OpenStreetMap credit link stays at 12px height: it is an attribution, not a control).
- R-17 / R-18 / R-36 / R-38 statistics, testimonials, invented claims: none introduced; existing
  CMS stories remain the owner's content (open question from audit 001 still stands).
- R-23 assets: no new imagery or logo created; the existing mark is used as shipped.
- R-24 / R-26 dead links: 0 dead, 0 dead anchors, all controls exercised above.
- R-25 contrast: 0 failures across 5 routes at 2 widths, computed not eyeballed.
- R-27 states: search has idle/searching/ready/empty/error; calculator has an empty state; the
  contact/WhatsApp path is external and unchanged.
- R-32 keyboard: focus ring defined once, amber on forest surfaces; menu, accordion and lightbox
  close on Escape (verified).
- R-33 script patching: no runtime patching ships. Process note stands: the palette migration used
  one-off string replacement, which is why a heading on a dark band needed the root fix above.
- R-34 themes: one theme shipped, no toggle to break.
- R-35 verification: recorded above, per control.
- R-37 direction: `DESIGN.md` now exists with dial ENERGY 2 / RHYTHM 3 / MOTION 2.
- R-39 semantics: native elements, cursor set in the base layer, labels on fields, alt on every
  image, reduced motion respected.
- R-40 performance mechanics: hero is `priority` + high fetch priority; images sized or inside
  aspect boxes; no third-party script in `<head>`; no performance number claimed anywhere.

Block 2, Purpose-Gate (each technique has a written reason in `DESIGN.md`): gradient default none;
icons one set with a stated stroke reason; no uppercase tracking; no background grid; arrows only
on the three "See <service>" navigation links; no decorative badges; no glassmorphism; hard shadow
with three documented ranks; no glow; feature tiles now differ from the pattern because each is a
solid plate tied to a photo band; animation one-shot with a stated purpose.

Block 3, Liveliness: dials declared; sections visibly vary (split hero, ledger strip, sage index
panel, forest band with polaroid filmstrip, sage map panel, step cards, plain contact); one focal
point per screen; whitespace structural; one accent (the amber mark/action); identity motif is the
hard offset surface plus the single-weight serif.

Block 4, Craftsmanship and Quality Locks: no decision justified by "AI default"; no dead controls;
no template sections; holds at both breakpoints, reduced motion and no-JS; evidence only; radius
scale consistent; CTAs specific ("Book a Ride", "Check your fare", "Price my ride below"); no
buzzwords; palette within 2 brand colours plus sage; the design now carries this brand's amber, not
the reference site's lime.

Result: PASS on all four blocks.

## Left as is (with reason)

- The 12px OpenStreetMap attribution link: external legal credit, not an action.
- `--font-fraunces` and `--font-playfair` alias names: kept so ~90 existing inline styles keep
  resolving; documented in `DESIGN.md`.
- Admin and login screens: out of scope, as in audit 001.
- `next/image` `fill` images report `aspect-ratio: auto` on their internal wrapper; the host box
  reserves the space, so L2 was a probe artefact rather than a defect. Re-checked.
- CMS story provenance (audit 001 H-2): still an owner question, unchanged by this work.
