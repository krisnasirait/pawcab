# Adopting the askperi system on The PawCab

> **Colour revision (anti-slop audit 002, 2026-11-21).** The accent below started as the
> reference site's lime `#b2d235`. It was replaced by this brand's own amber `#FEBB00`
> (measured from `logo-pawcab.png`), the header moved from lime to forest so the mark reads at
> 6.93:1, and lime no longer exists in the system. `DESIGN.md` is now the source of truth for
> palette, radius, elevation and motion; this file records how the system was carried over.

Reference teardown: `docs/askperi-teardown.md`. This note records what was applied to this
site, what was substituted, and where to extend it next.

Content, routes, copy, CMS wiring, forms, map and calculator behaviour are unchanged.
Only the visual system and entrance motion were replaced.

## Design system (source of truth: `src/app/globals.css`)

| Token | Value | Use |
|---|---|---|
| `--color-lime` | `#b2d235` | accent fill, serif headlines on dark surfaces, rules, markers |
| `--color-forest` | `#1c3f1d` | panels, headings, card borders, hard shadows |
| `--color-deepgreen` | `#2a4726` | hover ink on light, secondary labels |
| `--color-sage` | `#cee2c5` | section wash (`/32`), hairlines |
| `--color-ink` | `#3d3d3d` | body copy |
| `--color-line` | `#333333` | 1–2px borders on buttons and cards |

Legacy names (`pawcab-navy`, `deep-midnight`, `pawcab-gold`, `sand-beige`,
`warm-ivory`, `warm-taupe`, `canopy`, `lagoon`, `rattan`, `bark`, `paper`, `soft-white`)
remain as aliases pointing at the new palette, so existing utilities keep resolving.
Hard-coded hexes across `src/` were remapped to the same values.

Surfaces are defined once as component classes:

- `.pc-panel`, sage wash block, 75px radius (45px ≤980px), side margins
- `.pc-card`, white, 1px `#333`, 12px radius, `4px 4px 0 forest`
- `.pc-card-lg`, white, 2px forest, 32px radius, `10px 10px 0 forest`
- `.pc-frame` / `.pc-frame-lime`, 28px radius image frame with a solid offset shadow
- `.pc-rule`, forest hairline for ledger rows

Hard shadow is the signature: **zero blur, offset down-right, forest or lime fill.**

## Type

- **Cormorant Garamond** (`--font-cormorant`, weights 300/400/500) for every display
  line at weight 300 with `line-height: .88–.95`, the stand-in for the reference's
  licensed Typekit face `argent-cf`.
- **Public Sans** (`--font-public-sans`, variable) for UI and body: 200/300 body,
  500 labels, 18px/1.35 base.
- Layout's inline `Fraunces`/`DM_Sans` imports were replaced; `--font-fraunces`,
  `--font-playfair`, `--font-dm-sans`, `--font-montserrat` are kept as aliases so the
  inline `style={{ fontFamily: "var(--font-fraunces)" }}` calls still resolve to the
  new display face. `font-elmessiri` (wordmark) maps to it too.

Heading weights and leading were switched from `font-semibold`/`leading-[1.05]` to
`font-light`/`leading-[0.95]` wherever a display face is used.

## Motion

`src/components/Reveal.tsx` reproduces the reference's Divi animation engine:

- one-shot entrance, fired by `IntersectionObserver` when the element enters the viewport
- `opacity 0 → 1` while a transform unwinds (`slide`, `slideBottom`, `slideRight`,
  `zoom`, `fold`, `fade`), with `intensity`, `duration` and `delay` props
- the starting transform uses the same maths as the reference
  (`±2 × intensity %` translate, `(100 − intensity) %` scale, `±0.9 × intensity°` rotate)
- the animation is dropped on `animationend` (`data-done`), so nothing re-runs or
  keeps an animation applied
- the hidden start state is only armed when JS runs **and** motion is welcome
  (`html[data-reveal="on"]`), so no-JS and `prefers-reduced-motion` users see content

Applied to: hero copy + fare card, the proof strip (90ms stagger), services panel,
about photo/text, coverage, section headings, the booking steps (150ms stagger).

Interaction motion stays CSS-only: 200ms `transition-all` on pills (shadow grows, the
button lifts 1px), 300ms transforms on hovered image frames and gallery cards.

## Components touched

`globals.css`, `layout.tsx`, `Button`, `Header` (opaque lime bar, forest nav, white
pill CTA with offset shadow, white mobile sheet), `Hero` (split photo + forest panel,
lime serif headline, fare ticket across the seam), `FeaturesRow` (sage ledger, lime
markers), `ServicesSection` (sage panel, framed images), `AboutSection` (forest band,
lime serif, lime-shadow quote card), `ComfortSection`, `CoverageSection`,
`HowItWorksSection` (hard-surface step cards), `GallerySection` (framed filmstrip),
`Footer`, the reviews block in `app/page.tsx`, plus palette harmonisation in
`PetTransportPricing` and `BaliZoneMap`/`MapPickerModal` (zone dots now sage/lime/sand/water,
pins lime/forest).

## Where to extend next

- Service-page heroes still use bespoke inline `<a>` pills, swap them for `<Button>`
  if they should carry the offset shadow.
- `PetTransportPricing` inner panels still use dashed sage hairlines; convert to
  `.pc-card` if the widget should read as one more hard-surface card.
- Admin screens were deliberately left alone (internal UI).
