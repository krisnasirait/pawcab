# DESIGN.md

Direction for The PawCab Bali. Read this before touching UI, then `anti-slop/` as the filter.
Every line here is a decision with its reason (R-31); if a change contradicts it, change this file first.

Dial: **ENERGY 2 / RHYTHM 3 / MOTION 1**

Reading this as: a guest-facing private pet transport service in Bali, for pet owners who are
away from home and nervous about who takes their dog, in a warm-editorial language, dial
ENERGY 2 / RHYTHM 3 / MOTION 1.

Reference: Figo's visual grammar (editorial serif, warm canvas, flat pills, interaction-only
motion) informs the composition. The identity stays PawCab: amber/forest, existing photos and
copy. See `docs/figo-adoption-plan.md`; old askperi-era teardown docs are history.

## Identity

The mark is a single amber line drawing: a dog's head formed into a map pin. That is the whole
brand asset, so the palette is built from it and nothing competes with it.

Measured from `public/images/logo-pawcab.png` at native size (957x797, 69,175 opaque pixels):
dominant `#FEBB00`, weighted mean `#F9BB0A`. One hue.

## Colour (reasons, with measured ratios)

Public canvas is warm cream `#FBF6F1` (Figo-informed, single value). Public pages render
on canvas via `main[data-ui="public"]`; functional surfaces (inputs, estimator, dialogs)
stay white. Admin/login keep existing neutral surfaces.

| Token | Value | Reason |
|---|---|---|
| `--color-accent` | `#FEBB00` | Logo amber: primary actions, dark-band emphasis, selected FAQ/media shadows and step markers. Never small text on light surfaces. |
| `--color-accent-hover` | `#FFC61A` | Brighter amber for action hover, retaining forest ink. |
| `--color-accent-ink` | `#1C3F1D` | The only text colour allowed on amber: 6.93:1. |
| `--color-forest` | `#1C3F1D` | Dark bands, headings, borders and hard shadows. 11.81:1 on white; 6.93:1 against amber. |
| `--color-deepgreen` | `#2A4726` | Hover ink on light surfaces, so hover does not rely on the accent. |
| `--color-sage` | `#CEE2C5` | Section wash (32%) and hairlines: structure without boxes. 8.61:1 under forest text. |
| `--color-canvas` | `#FBF6F1` | Public page field. 12.16:1 under forest text, 10.16:1 under ink. |
| `--color-sagewash` | `#F4F9EE` | Selected care/coverage section surfaces; not a percentage mix of sage. |
| `--color-ink` | `#3D3D3D` | Body copy, 10.86:1 on white. |
| `--color-line` | `#333333` | 1-2px borders on actions and cards; 12.63:1 against white. |

Hard constraints the measurements impose:

- amber never carries white text (1.70:1) and is never text on white or sage (1.70 / 1.24:1)
- amber text lives on forest only (6.93:1)
- amber actions on a light surface carry a 2px `#333` border so the control has a 3:1 boundary
- amber signals action or emphasis: primary actions and the mark, headings/labels/rules on dark
  bands, selected-item shadows and numbered steps with forest ink. Decorative amber underlines
  never replace the readable forest label. No additional brand accent is introduced.

Neutrals (white, sage wash, ink) do not count toward the palette cap (R-29): this is two brand
colours (amber, forest) plus sage as the structural tint.

## Colour roles and compatibility

- `surface` is white; `on-dark` references it. `accent-ink` references forest.
- `focus` is forest on light surfaces and amber inside `data-surface="forest"` or
  `data-theme="admin"`. A nested `data-surface="light"` resets it (the mobile menu).
  Focus-visible outlines are 3px with a 2px offset; public inputs must not suppress them.
- Map category tokens `map-zone-1/2/3/4` resolve to sage, amber, sand `#EDE6C9` and water
  `#8FBDB0`. They distinguish geographic groups, not marketing actions. Zone labels and
  keyboard-operated chips repeat that information so identity does not rely on colour alone.
- `error` maps to Tailwind red-700 for public errors; `error-dark` maps to red-300 for admin
  error copy. `success` maps to emerald-600 and `info` to blue-500. Admin neutral backgrounds
  and the remaining red/blue/emerald status shades are intentional dark-workspace exceptions.
  Existing admin input rings remain amber local replacements; public header styles no longer
  control admin focus. Do not recolour semantic errors amber to satisfy a brand-colour count.
- Legacy colour names reference the canonical variables, not copied hex values. Public utility
  classes, SVG fills, map pins and shadows use tokens; changing a canonical brand value updates
  their consumers. Transparent black overlays and photographic fade treatments are compositing
  tools rather than brand colours.

## Type

- **Cormorant Garamond** 400 for display (500 available for emphasis). Stronger editorial
  voice, Figo-informed; headlines 80-96px hero / 52-64px section desktop, 44-52px / 34-40px
  phone, line-height 1.02-1.15.
- **Public Sans** (variable) for text: 400 body at 17-18px/1.5-1.6, 500/600 actions and labels.
  Estimator numerals use the body family with tabular figures where helpful.

Both are self-hosted through `next/font`. The reference site's display face (`argent-cf`) is
licensed Typekit and cannot ship here, so Cormorant stands in at the same weight and optical size.

Aliases kept on purpose: `--font-fraunces`, `--font-playfair`, `--font-dm-sans`, `--font-montserrat`
and the `.font-display` class all resolve to the two families above, so older components keep
working. They describe faces that are no longer loaded; do not add new uses.

Labels are sentence case. Uppercase with wide tracking is not used anywhere on the public site
(R-06): the rule + short label at 13-14px does the same job without shouting.

## Homepage hero composition

The hero is a contained sagewash opening: forest headline and booking actions on the left,
existing CMS photograph on the right, followed by an integrated fare ledger. At phone widths,
the message and actions precede the photo. The photo carries the emotional subject; the ledger
keeps the actual zone-rate ranges close to the booking decision without an overlapping card or
an empty lower half. The headline is visible immediately, without entrance motion, for reading
and LCP. Amber is reserved for the primary booking action in this composition. Existing content,
CMS fields and destinations remain unchanged; the stock-photo alt text describes the image
without implying that it documents a PawCab passenger.

## Radius scale (R-11)

Four ranks plus the action pill. Anything outside this list is a mistake.

| Rank | Value | Where |
|---|---|---|
| action | 999px | buttons, chips, dots |
| small surface | 12px | accordion cards, inputs, list items |
| medium surface | 16px | inner panels, dropdowns |
| media | 28px | photographs, gallery cards, video |
| large surface | 32px | the calculator card, modals |
| section panel | 75px (45px <=980px) | the sage wash panels |

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

Light only, on purpose: this is an outdoor, daylight, guest-facing booking page, and the palette
is built on a white field with sage washes. There is no dark mode to break. If a dark theme is ever
requested, the amber/forest pair inverts cleanly (amber on forest is 6.93:1), so it is a token swap,
not a redesign.

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
