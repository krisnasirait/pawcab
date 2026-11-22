# PawCab Design System & Color Token Plan v2

Source of truth: brand board (`WhatsApp Image 2026-11-22 at 16.07.13.jpeg`).
Status: IMPLEMENTED 22 Nov 2026 — P0 baseline, P1 tokens, P2 type, P3 components,
P4 verification all executed (see §10 for decisions).

Skills applied: `frontend-design` (direction, type scale, liveliness),
`antislop` core + `antislop-ui` (purpose test, dose caps, default-pattern
sweep), `antislop-human` (computed contrast, focus, states),
`antislop-layoutmobile` (three-state reflow), `ponytail` (fewest files,
no new deps). Mode: `antislop active: during (session override).`

## 0. Direction lock (frontend-design two-pass)

- Subject: private pet mobility in Bali — warm, premium, calm hospitality.
  Audience: pet owners booking rides/sitting. Job: trust → price → book.
- The brief pins the look (navy/gold luxury, Playfair + Montserrat,
  pill CTAs with →, tracked caps labels, thin-line icons, warm photo
  hero) — follow it exactly. Owner confirmed: navy alike, full board look.
- Liveliness: one bold element — the dark navy hero with gold CTA.
  Everything else stays quiet (ivory canvas, hairline dividers).
- Self-critique: the current forest-green editorial look is crafted but
  it is not this brand; keeping forest would leave two identities.

## 1. Tokens

Raw layer (board hexes): navy `#283B70`, midnight `#14233F`,
gold `#FDC300`, ivory `#F7F2E8`, sand `#DDD0BA`, taupe `#9C8B75`,
soft-white `#FCFAF6`.

Semantic remap in `src/app/globals.css` `@theme` (aliases
`--color-pawcab-navy` etc. already exist — repoint, don't rename usages):

| Semantic | Now | Becomes |
|---|---|---|
| `--color-primary` / `--color-pawcab-navy` | `#1C3F1D` | `#283B70` |
| `--color-night` *(new)* / `--color-deep-midnight` | `#1C3F1D` | `#14233F` |
| `--color-accent` / `--color-pawcab-gold` | `#FEBB00` | `#FDC300` |
| `--color-canvas` / `--color-warm-ivory` | `#FBF6F1` | `#F7F2E8` |
| `--color-surface` / `--color-soft-white` | `#FFFFFF` | `#FCFAF6` |
| `--color-sand` *(new)* / `--color-sand-beige` | sage `#CEE2C5` | `#DDD0BA` |
| `--color-muted` *(new-ish)* / `--color-warm-taupe` | `#3D3D3D` | `#9C8B75`, borders/inactive only, never body text |
| `--color-ink` | `#3D3D3D` | keep, tertiary fine print only (body copy is navy/midnight) |
| `--color-line` | `#333333` | recompute: must be ≥3:1 on ivory AND white (checker decides, not eyes) |
| `--color-focus` | forest | split: gold on dark, navy on light (both ≥3:1, verified P3) |
| map zones 1–4 | sage/amber/etc. | navy/gold/sand/taupe ramp, mutually distinguishable, tooltips checked |

Palette discipline (R-29): cores are navy + ivory, one dark surface
(midnight), one accent (gold); sand/taupe/white are the neutral ramp.

## 2. Contrast law (computed, R-25 — never eyeballed)

navy/ivory 9.65 · ivory/navy 9.65 · gold/navy 6.66 · navy/gold 6.66 ·
gold/midnight 9.67 · midnight/ivory 14.03 · **taupe/ivory 2.96 FAIL**
(even the 3.0 large-text bar) · gold/ivory ~1.5 FAIL.

Rules for the checker (hard failures, not warnings):
- Taupe: borders, dividers, inactive icons, decoration only. Never text.
- Gold text: on navy/midnight only, never on light.
- Gold fills: navy text only (6.66:1).
- Hero photo text (board mandates white/gold over photography):
  mandatory scrim + worst-spot verification.
- Non-text: input borders, zone pills, focus rings ≥3:1 (R-32/R-34).
- Status is never color-only (zone `aria-pressed` keeps label + fill).

## 3. Typography

- Display: Playfair Display 400/500/600 (+ italic for the board's gold
  accent word). Body/UI: Montserrat 400/500/600/700 via `next/font`,
  `display: swap`.
- Delete: Cormorant + Public Sans wiring, `font-playfair` /
  `--font-fraunces` strays unified to one `--font-display`,
  `public/font/elmessiri*` removed if unreferenced (audit first).
  Re-measure LCP after — budget stays 1.7s mobile.
- Scale:

| Role | Desktop | Mobile | Leading / tracking |
|---|---|---|---|
| Display H1 hero | clamp(2.75rem,6vw,5.5rem) 400 | same clamp | 1.02 / -0.02em |
| H2 section | 40–52px 400 | 32–36px | 1.08 |
| H3 / card titles | 20–24px Montserrat 500 | 18–20px | snug |
| Body | 17–18px Montserrat 400 | 16px | 1.55, ≤68ch (`max-w-prose` kept) |
| Eyebrow + rule | 13–14px 500 tracked caps | same | kept: it is the board's own section-label device (R-09 reason written), never a pill/dot |
| Fare numerals | tabular-nums Montserrat 600 | same | existing treatment kept |

## 4. Dose caps & motion (R-10–R-13, R-19)

- Radii: pill = CTAs only; 28px = cards/panels; 12–16px = inputs/inner.
  Nothing else (R-11).
- Shadow: flat everywhere; single lift reserved for the sticky estimator
  booking card, reason written (R-12). No glow. No grid/dot backgrounds.
- Glass: max 1 element — sticky header backdrop-blur stays, reason:
  legibility over scrolling photos (R-10).
- Motion dial = interaction-only: hover/focus transitions, `<details>`
  disclosure, map pan/zoom. No entrances, no loops. Existing
  `prefers-reduced-motion` global retained + re-verified.
- CTA arrows kept: the board draws every primary button with `→`;
  brand vocabulary, sized to label, direction cue toward booking (R-08).
- Icons: Pi outline set already matches the board's thin-line style;
  P3 audit swaps any filled glyphs for outline equivalents (R-04).

## 5. Gold discipline (one deliberate accent)

Gold appears ONLY at: primary CTA fills, fare total numeral, active
zone-filter pill, focus ring on dark, hero accent word. Nowhere else —
no gold dividers, badges, body links, icon washes. Enforced by grep
in P3 review.

## 6. Component map (colors/type only — no layout rebuilds)

- Header: navy background, ivory text/links, gold Book-a-Ride pill,
  logo badge `bg-forest` → navy (gold mark on navy disc = the board
  seal; logo PNG is transparent, no asset change needed).
- Logo asset note: `logo-pawcab.png` is transparent gold line-art;
  only its containers recolor. A tiny white speck is baked into the
  lower-left strokes — invisible at 28–32px; request a cleaned export
  from the designer when convenient (no agent-made logo edits, R-23).
- Footer: midnight + ivory links + gold CTA; footer logo badge loses
  its white box, bare gold mark sits directly on midnight.
- Hero: board preview structure — dark navy panel, gold Book a Ride,
  outline View Services, scrimmed warm photo, gold italic accent word.
- Estimator widget soft-white; result band midnight + gold total +
  ivory labels. ZoneRateCard: ivory rows, sand dividers, navy
  headlines, gold CTA pills. FAQ: structure kept, dividers/plus
  recolored. Coverage map: fills re-tinted to brand ramp, rings navy.
  Gallery dialog: midnight scrim. Inputs: white fill, ≥3:1 navy-tone
  borders, navy labels. Admin + login untouched.

## 7. Responsive contract (three states, content-driven)

Verify 320 / 390 / 768 / 1024 / 1440 + 200%-zoom narrow every phase:
stacked single column → 2-col where cards get too wide → full grid
only where it fits. Mobile type/padding registers (no desktop sizes
carried down), 48px targets kept, no `100vh` slabs (hero is a
content-sized panel). Fare-result 3-col stays ≥1024px. No overflow,
no clipped numerals (same element-level probe as before).

## 8. Mechanics (ponytail: smallest diff that does the job)

Files: `src/app/globals.css` (theme + base), `src/app/layout.tsx`
(fonts), `scripts/check-color-tokens.py` (new pairs + taupe/gold hard
rules), `DESIGN.md` + photo brief note, component files ONLY where a
hardcoded hex/class survives the alias remap (grep-driven, handful
expected). No new packages; only the two board font families.

Gates each phase: `tsc`, ESLint 0 errors, token checker green,
`git diff --check`, production build, fresh-server screenshots at all
five widths, fare + map + FAQ + nav regression scripts, LCP re-check.

## 9. Phases

- P0 baseline: token ledger dump, screenshots, font payload +
  Lighthouse baseline, map/zone/motion inventory.
- P1 tokens: remap aliases, add sand/muted/night, line-color via
  checker, build + contrast gate green (screenshot diff proves mapping).
- P2 type: Playfair + Montserrat in, dead families (+ElMessiri if
  unreferenced) out, scale table applied, LCP must stay ≤1.7s.
- P3 components: §6 pass in board order, gold-discipline grep,
  focus pairs both themes, keyboard-only pass, 200% zoom.
- P4 finish: photo brief applied to next image picks, docs updated,
  full Delivery Gate (core + UI + human + layoutmobile checklists).

## 10. Decisions

- D1 — navy header + dark hero (full board look): DECIDED yes.
- D2 — forest fully retired? Recommended yes (two identities otherwise).
- D3 — map zones re-tinted to brand ramps? Recommended yes.
- D4 — hero photo: keep current dog-in-car with new scrim, or swap to
  golden-hour lifestyle per the photography brief?
