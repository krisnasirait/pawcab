# DESIGN.md

Direction for The PawCab Bali. Read this before touching UI, then `anti-slop/` as the filter.
Every line here is a decision with its reason (R-31); if a change contradicts it, change this file first.

Dial: **ENERGY 2 / RHYTHM 3 / MOTION 1**

Reading this as: a guest-facing private pet transport service in Bali, for pet owners who are
away from home and nervous about who takes their dog, in a warm-editorial language, dial
ENERGY 2 / RHYTHM 3 / MOTION 1.

Reference: the PawCab brand board (22 Nov 2026: navy/gold luxury, Playfair Display +
Montserrat, pill CTAs with arrows, tracked caps section labels, thin-line icons, warm
photography) is the identity. Figo-era composition lessons (flat pills, interaction-only
motion, open rows over cards) still inform the layout. See `docs/design-system-plan.md`
for the migration record; old askperi-era teardown docs are history.

## Identity

The mark is a single gold line drawing: a dog's head formed into a map pin, transparent
background, rendered at 28-32px. That is the whole brand asset, so the palette is built
from it and nothing competes with it. Header/footer show it on navy (gold-on-navy seal,
matching the board); the footer drops the old white badge and lets the bare mark sit on
midnight. A white speck is baked into the source file's lower-left strokes — invisible
at display size; request a cleaned export from the designer rather than redrawing it.

## Colour (reasons, with measured ratios)

Public canvas is warm ivory `#F7F2E8`. Public pages render on canvas via
`main[data-ui="public"]`; functional surfaces (inputs, estimator, dialogs) use soft white
`#FCFAF6`. Admin/login keep existing neutral surfaces (they inherit the new
tokens where class names overlap; no admin redesign).

| Token | Value | Reason |
|---|---|---|
| `--color-navy` | `#283B70` | PawCab navy: primary text, header, key surfaces. 9.65:1 on ivory. |
| `--color-midnight` | `#14233F` | Deep midnight: footer, overlays, estimator band. 14.03:1 on ivory. |
| `--color-accent` | `#FDC300` | PawCab gold: primary CTAs, fare total, active zone, focus on dark. 6.66:1 either direction with navy. |
| `--color-accent-hover` | `#D9A800` | Darker gold for gold-bg hovers, keeps navy text (5.0:1). |
| `--color-sand` | `#DDD0BA` | Secondary surfaces, card fills, subtle dividers (decorative only). |
| `--color-canvas` | `#F7F2E8` | Public page field. |
| `--color-surface` | `#FCFAF6` | Cards, estimator widget, estimator map placeholder. |
| `--color-ink` | `#283B70` | Body copy = navy (9.65:1 on ivory). |
| `--color-line` | `#333333` | 1-2px borders on actions and cards; 12.13:1 on surface. |
| `--color-taupe` | `#9C8B75` | Borders, dividers, inactive icons ONLY — never text (2.96:1 on ivory fails even large-text AA). |
| `--color-focus` | navy / gold | Navy ring on light, gold ring on navy surfaces (both ≥3:1, verified in browser). |

Hard constraints the measurements impose (enforced by `scripts/check-color-tokens.py`):

- gold text lives on navy/midnight only (6.66 / 9.67:1); never on light (gold on ivory ≈1.5:1)
- taupe never sets text at any size; the checker fails any `text-taupe` utility
- gold fills pair with navy text; gold-bg hovers darken, never lighten
- gold appears only at: primary CTAs, the fare total, the active zone pill, dark-surface
  focus rings, the hero eyebrow (all allowlisted with per-use proof in the checker)
- text over photography always gets a scrim, verified at the worst spot, never the best
- map fills (sand, gold, taupe, navy) distinguish zones; chips/tooltips repeat the zone so
  identity never relies on colour alone; tooltip text stays dark-on-light

Neutrals (soft white, ivory, sand wash, ink) do not count toward the palette cap (R-29):
this is two brand colours (navy, gold) plus midnight as the dark surface and sand as the
structural tint.

## Colour roles and compatibility

- `surface` is soft white; `on-dark` references it. `accent-ink` references navy.
- `focus` is navy on light surfaces and gold inside `data-surface="navy"` or
  `data-theme="admin"`. A nested `data-surface="light"` resets it (the mobile menu).
  Focus-visible outlines are 3px with a 2px offset; public inputs must not suppress them.
- Map category tokens `map-zone-1/2/3/4` resolve to sand, gold, taupe, navy.
  They distinguish geographic groups, not marketing actions. Zone labels and
  keyboard-operated chips repeat that information so identity does not rely on colour alone.
- `error` maps to Tailwind red-700 for public errors; `error-dark` maps to red-300 for admin
  error copy. `success` maps to emerald-600 and `info` to blue-500. Admin neutral backgrounds
  and the remaining red/blue/emerald status shades are intentional dark-workspace exceptions.
  Do not recolour semantic errors gold to satisfy a brand-colour count.
- Legacy colour names (`forest`, `sage`, `deepgreen`, `deep-midnight`, `canopy`, `lagoon`,
  `rattan`, `bark`, `paper`, `accent-hover` aside) were renamed or repointed to the canonical
  brand values; remaining `*-gold/ivory/taupe/sand/midnight` aliases reference canonical
  variables, not copied hex values. Public utility classes, SVG fills, map pins and shadows
  use tokens; changing a canonical brand value updates their consumers. Transparent black
  overlays and photographic fade treatments are compositing tools rather than brand colours.

## Type

- **Playfair Display** 400/500/600 (+ italics for the hero accent treatment) for display:
  headlines clamp(3.25rem, 8vw, 7rem) hero / 40-52px section desktop, 44px+ / 32-36px phone,
  line-height 1.02-1.15, tracking -0.01 to -0.02em.
- **Montserrat** (variable) for text: 400 body at 17-18px/1.55 desktop, 16px phone,
  500/600 actions and labels, 700 available for emphasis. Estimator numerals use the body
  family with tabular figures where helpful.

Both are self-hosted through `next/font` with `display: swap`. Cormorant Garamond and
Public Sans were removed with the 22 Nov rebrand (plus unused local ElMessiri files).

Aliases kept on purpose: `--font-fraunces`, `--font-cormorant`, `--font-public-sans`,
`--font-dm-sans` and the `.font-display` class all resolve to the two families above, so older
components keep working. They describe faces that are no longer loaded; do not add new uses.

Labels are sentence case, except the board-mandated tracked caps eyebrows (gold on navy,
navy on ivory with hairline rule, 13-14px) that open sections — that device is the brand's
own voice, not a default (R-06). The hero opens with a sentence-case intro line instead.

## Homepage hero composition

The hero is open editorial on ivory: a sentence-case intro line, an oversized navy Playfair
headline with intentional three-line breaks, a sans lede, gold primary CTA plus navy-outline
secondary, and the service-area line beside a near-square CMS photograph (media-rank rounding).
Below, a hairline-banded fare strip pairs the ledger heading with three stacked tiers.
At phone widths, the message and actions precede the photo. The photo carries the
ivory. At phone widths, the message and actions precede the photo. The photo carries the
emotional subject; the ledger keeps the actual zone-rate ranges close to the booking decision
without an overlapping card or an empty lower half. The headline is visible immediately,
without entrance motion, for reading and LCP. Gold is reserved for the primary booking
action in this composition. Existing content, CMS fields and destinations remain unchanged;
the stock-photo alt text describes the image without implying that it documents a PawCab
passenger.

## Radius scale (R-11)

Four ranks plus the action pill. Anything outside this list is a mistake.

| Rank | Value | Where |
|---|---|---|
| action | 999px | buttons, chips, dots |
| small surface | 12px | accordion cards, inputs, list items |
| medium surface | 16px | inner panels, dropdowns |
| media | 28px | photographs, gallery cards, video |
| large surface | 32px | the calculator card, modals |
| section panel | 28px | large navy content panels, content-sized, never full-viewport |

## Elevation (R-12)

Flat editorial surfaces. No offset hard shadows on public marketing content (removed in
the Figo migration, P4). Depth only where function needs it: a soft ambient shadow on
floating suggestion lists and modal dialogs. Borders carry structure; hover is colour or
at most a 1.02 media scale, never a diagonal lift.

Legacy `pc-card` / `pc-frame` shadow classes remain defined only until P4 removes their
last consumer; new work must not use them.

## Motion (MOTION 1)

Content is visible immediately: no scroll-gated opacity/transform entrances, no staggers.
Interaction motion is CSS only and explicit (no `transition-all`): 150-200ms colour /
background / border on actions and links, 180-220ms FAQ disclosure, optional media scale
to at most 1.02 over 250-350ms on hover-capable pointers, 120-180ms dialog fade.
Never animate focus outlines, header height, or ambient backgrounds.
`prefers-reduced-motion` renders everything immediate; JS map travel sets duration zero.
Legacy `Reveal`/`pc-reveal` remains only until P4 migrates its last consumer.

## Theme (R-21)

Light page, navy brand panels — not a dark mode. The canvas stays ivory; navy appears as
contained panels (header, estimator band, About, gallery, footer) per the board.
There is no user-toggleable theme to break. focus rings, form fields and the mobile menu
all hold on both surfaces (verified in browser, not just tokens).

## Icons (R-04)

One set: **Phosphor** (`react-icons/pi`). Chosen for its even 1.5px-equivalent stroke across paw,
car, map, chat and warning glyphs, which matches the logo's single-weight line drawing. Bootstrap
Icons and Ionicons were removed from the public site; do not reintroduce a second set.

## Not a clone (R-30)

The reference teardown (`docs/askperi-teardown.md`) informed the system: thin serif display,
light grotesk body, sage wash panels, hard offset shadows, one-shot entrance motion. The identity
is not adopted from it: the accent is this brand's amber, not the reference's lime; the sections
carry PawCab's own content order (fare first, then services, then the cabin); and the illustrations,
photography and copy are the business's own.
