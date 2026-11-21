# askperi.ai, reverse-engineered front-end teardown

Target: `https://askperi.ai/` (WordPress 6.x + **Divi 5.8.1**, page id 8, template-based header/footer).
Observed: served HTML/CSS/JS (`/tmp/peri/askperi.html`, `et-core-unified-*.css`, typekit CSS, Divi module scripts),
a headless-Chrome render (1440×1000, `document.scrollHeight = 9818 px`), and REA passive browser captures.

Evidence
- REA `list_browser_targets` → `ev_377a177cb2fbdfe92c96494ee74b74eec65238e71a9cb057c174287cda1c4308`
- REA `inspect_web_page` → `ev_3ccf66303e47e2b9587071a1fce1f28f2fd27cb13fa7844b591b283251b54156` (1416 DOM nodes, 26 scripts, `status: policy_filtered`)
- Local runtime probes: `/tmp/peri/probe/runtime.json`, `probe2.json`, `opacity.json`, `full.png`, `vp_*.png`
- Limits: capture is one 1440 px desktop pass, attached-window only (no pre-attach network); tablet/phone
  values below are declared-in-CSS, not rendered; full-page `captureBeyondViewport` missed a few
  lazy images, viewport screenshots were used to confirm them.

---

## 1. Page map (1440 px, desktop)

| # | Anchor | Height | Background | Radius | Layout summary |
|---|--------|--------|------------|--------|----------------|
| 0 |, | 476 | white | 0 | Hero: photo 864 px (60%) + forest panel 576 px (40%) |
| 1 |, | 517 | `#b2d235` lime | 0 | Composer GIF pulled up −93 px over hero + line-art collage left, copy right |
| 2 | `#who` | 923 | white | 0 | Serif h2 + link list left, intro right; 4-up icon grid below |
| 3 |, | 813 | white | 0 | Full-width Vimeo player, 75 % width, offset hard shadow |
| 4 | `#how` | 1002 | `#cee2c5` @25 % | 75 | Rounded sage panel: rabbit illustration + 3 divided steps |
| 5 | `#benefits` | 966 | white | 0 | Centered h2 + 2×3 icon cards |
| 6 |, | 1430 | `#cee2c5` @30 % | 0 | 2-col split: text rows + 3 line-art animals left, edge-to-edge photo right (28 px radius) |
| 7 | `#faq` | 997 | white | 0 | h2 + 8 accordion cards, 1080 px wide |
| 8 | `#pricing` | 1591 | `#cee2c5` @30 % | 75 | 3 pricing cards (custom HTML) + footnote + savings calculator |
| 9 | `#contact` | 642 | white | 0 | Demo form, 2-col + textarea + math captcha |
|, | footer | ~180 | `#1c3f1d` | 0 | Bird mark, address, legal links, Instagram icon |

Header: static (no sticky), lime bar, **112 px** tall, logo left (900×392 PNG), 7 nav links right.

## 2. Component inventory

1. **Header**, Divi Menu module (`et_pb_menu--with-logo`, left-aligned logo / right-aligned links, dropdown animation `fade`).
2. **Hero split**, image module (100 % of its 60 % column) + forest column containing the bird glyph (96 px) and the `h1`.
3. **Chat-composer mockup**, `composer_animation-6.gif`, 820×110 source, rendered 605×81 at `42vw`, right-aligned, `-93px` overlap.
4. **Line-art collage**, `Pet-Care-Illustration-Final_drk_green_700.png`, 700×412 source → 482×284.
5. **Link list**, `ul/li` in the "Who is Peri for?" column (bullet markers, 18 px/200).
6. **Icon grid**, 4 (desktop) / 2 (tablet) / 1 (phone) columns; SVG icons forced to 65 px box (`max-height:65px`), h4 + 18 px body.
7. **Video block**, Vimeo `1134010769` iframe in `.et_pb_video_0`: 87 % width, 20 px radius, `box-shadow: 20px 20px 0 0 #2a4726`, play icon suppressed.
8. **Rounded panels**, sections 4 and 8 use `border-radius:75px` (45 px ≤980 px) + side margins 20 px, `overflow:hidden`.
9. **Step list**, 3 × (h4 + p) with `1px #b2d235` bottom rules (not last).
10. **Accordion**, 8 × Divi Toggle: white, `1px #333`, radius 12, `box-shadow: 4px 4px 0 #1c3f1d`; title 18 px/500; icon is **ETmodules U+E050** (16 px, lime).
11. **Pricing card (hand-written HTML in `et_pb_code_0/1` + `group` wrapper)**, group = white, radius 38, `2px #1c3f1d` border, `box-shadow: 10px 10px 0 #1c3f1d`, padding 40/20. Inside: icon 60 px, h3 24/500, price stack, feature lines.
12. **Billing toggle (per card)**, `.switch` 46×24 (42×22 ≤980) track, 18 px knob (16 px), `translateX(22px)` on check, colors `#ccc → #b2d235`; two `.price-line` stacked in one grid area and cross-faded; `<br>`-broken labels fade `0.45 → 1`.
13. **Savings calculator**, custom HTML + `<link>` re-import of Public Sans 400/600; 3 number inputs (`5ch`, 0.75 pt `#333`, 4 px radius), radio plan picker (`accent-color:#b2d235`), result 48 px/700 `#1c3f1d`.
14. **Contact form**, Divi Contact Form: inputs white, `1px #1c3f1d`, 10 px radius, 16 px padding, lime placeholder; select + textarea + `11 + 10 =` captcha + pill submit.
15. **Footer**, split row: 60 px bird mark, address/legal (14 px/300 `rgba(255,255,255,.97)`), social icon forced `target=_blank`.
16. **Scroll-to-top**, `.et_pb_scroll_top`: fixed, 40×40, `rgba(0,0,0,.4)`, 30 px ETmodules chevron, appears on scroll.

## 3. Motion

### 3.1 Scroll-in animation engine (Divi, no library beyond jQuery Waypoints)

`diviElementAnimationData` in the page holds **32 entries**; `script-library-animation.js` per entry:

1. writes `data-animation-*` attributes onto the element;
2. registers a waypoint at `offset:"100%"` → fires when the element's top crosses the viewport bottom (enters);
3. on fire, sets `opacity = starting_opacity (0)`, `animation-duration`, `animation-delay`, `timing-function`,
   plus an inline *starting transform* derived from style + intensity:

| style | starting transform (intensity `i`) |
|-------|------------------------------------|
| `slide`/`slideTop|Bottom|Left|Right` | `translate3d(0, ±2i%, 0)` (X axis for left/right) |
| `zoom` | `scale3d(k,k,k)`, `k = (100−i)/100` |
| `flip` | `perspective(2000px) rotateX/Y(±0.9i deg)` |
| `fold` | `perspective(2000px) rotateX/Y(∓0.9i deg)` |
| `roll` | `rotateZ(±3.6i deg)` |

4. adds `.et_animated` + style class → CSS keyframes run `to { transform:none; opacity:1 }`
   (`.et_animated{opacity:0;animation-duration:1s;animation-fill-mode:both}`).
5. after `duration+delay`, all animation classes are stripped and `et_had_animation` is added → **plays once, never re-fires**.

The library also sets `body{overflow-x:hidden}` and `#page-container{overflow-y:hidden}`.

### 3.2 Actual timeline (desktop)

| Element | Style | Duration | Delay | Intensity | Curve |
|---|---|---|---|---|---|
| Hero h1 (`text_0`) | slide | 1000 | 0 | 50 % | ease-in-out |
| Collage (`image_3`) | slide | 1000 | 0 | 17 % | ease-in-out |
| Lime-band copy (`text_1`) | slideBottom | 1000 | 0 | 15 % | ease-in-out |
| `#who` row | slideBottom | 1000 | 0 | 9 % | ease-in-out |
| Who-grid columns 7-14 | slideBottom | 1000/1200/1400 | 500 | 8–15 % | ease-out |
| Video | **zoom** | 1000 | 0 | 50 % | ease-in-out |
| `#how` text column | slideBottom | 1000 | 0 | 11 % | ease-in-out |
| Rabbit | **fade** | 1500 | 1000 |, | ease-in-out |
| Benefits columns 20-25 | slideBottom | 500/1200/1400 | 0/800/1000 | 15 % | ease-out |
| "Try Peri now!" button | **bounce** (scale .3→1.1→.9→1.03→.97→1) | 800 | 5 | 50 % | ease-out |
| Chatbot photo | slideRight | 1200 | 0 | 20 % | ease-in-out |
| FAQ row | slideBottom | 1000 | 0 | 21 % | ease-in-out |
| Pricing columns | **fold** | 1000 | 0/500/800 | 50 % | ease-in-out |
| Calculator row | slide | 1000 | 0 | 50 % |, |
| Contact form / row | slideBottom | 1000 | 0 | 15 % / 10 % | ease-in-out |

Signature: everything is 0.5–1.5 s, 0–1 s delay, 8–50 % travel, `ease-in-out` for entrances,
`ease-out` for the staggered card grids, fired on entry (not mid-viewport).

### 3.3 Interaction motion

- **Buttons** (`.et_pb_button`): `transition: all .2s`; hover shifts padding `5.4px 18px → 5.4px 36px 5.4px 12.6px`
  and reveals an ETmodules arrow (`content:"5"`, 32 px) that fades in at the right.
  The "Try Peri now!" button uses `content:'$'` (circled arrow, inherits size).
- **Accordion**: jQuery `slideToggle(700)` on `.et_pb_toggle_content`, class swap `et_pb_toggle_close|open`;
  content is `display:none` while closed. Touch devices get `touchstart` → click.
- **Billing toggle**: `transition .25s ease` on `background-color` (track), `transform` (knob), `opacity` (labels/price lines), no JS animation.
- **Mobile menu**: `fadeInBottom/fadeOutBottom 1s cubic-bezier(.77,0,.175,1)`; dropdowns fade in `.2s`.
- **Scroll-to-top**: appears with `.et-visible`, smooth scroll.
- No GSAP, no Lenis/smooth-scroll, no canvas/WebGL, no parallax, no video background, no scroll-driven pinning.

## 4. Typography

Two families only (plus Divi's icon font):

- **argent-cf**, Adobe Typekit (`use.typekit.net/oao1ofx.css`), weights 100/300/400, used at **weight 100**, serif display.
  Loaded face in use: 100 (`getComputedStyle` → `argent-cf, serif` / `fw 100`).
- **Public Sans**, Google Fonts variable `wght@100..900` (latin, latin-ext, `display=swap`); the calculator re-imports `400;600`.
- **ETmodules**, Divi icon font (accordion glyph, button arrow, scroll-top chevron).

Scale at 1440 px (measured):

| Role | Family | Size / line-height / weight | Colour |
|---|---|---|---|
| Hero h1 | argent-cf | 72 / 61.2 (0.85em) / 100 | `#b2d235` |
| Section h2 | argent-cf | 47 / 47 / 100 | `#b2d235` (white sections) · `#1c3f1d` (sage panels) |
| Lead h2 (lime band) | Public Sans | 27 / 30 / 300 | `#1c3f1d` |
| Lead h3 | Public Sans | 21 / 1.3em / 300 | `#4c4c4c` |
| h4 (card + step titles) | Public Sans | 20 / 1.1em / 400 (some 200) | `#4c4c4c` |
| Body / p | Public Sans | 18 / 24.3 (1.35em) / 200 | `#3d3d3d` |
| FAQ body | Public Sans | 18 / 23.4 / 300 | `#3d3d3d` |
| Accordion title (h5) | Public Sans | 18 / 18 / 500 | `#3d3d3d` |
| Pricing h3 | Public Sans | 24 / 24 / 500 | `#4c4c4c` |
| Nav link | Public Sans | 18 / 1.7em / 500 (17 ≤980) | `#1c3f1d` |
| Button | Public Sans | 18 / 30.6 / 500 (b1: 20 / 300 → 16 ≤980) | `#1c3f1d` |
| Footnote | Public Sans | 12 / 16.2 / 200 | `#3d3d3d` |
| Footer | Public Sans | 14 / 15.4 / 300 | `rgba(255,255,255,.97)` |
| Calculator result | Public Sans | 48 / 700 | `#1c3f1d` |

Global tokens: `--et_global_body_font_size:18px`, body `line-height:1.3em`, headings `--et_global_heading_font_weight:500`,
body weight `300` globally but text modules override to `200` via `.preset--module--divi-text--default`.
Hero h1 also carries `clamp(5vw,4vw,40px)` (which resolves to the 72 px minimum) and `11vw` ≤980 px.
Letter-spacing: none anywhere. No uppercase transforms.

## 5. Colour & surface language

```
lime        #b2d235   (secondary), hero h1, serif h2 on white, icons, accents, header bar
forest      #1c3f1d   (primary) , hero panel, footer, borders, hard shadows, h2 on sage
sage        #cee2c5   at 25 % / 30 % alpha, section 4 / 6 + 8 washes
white       #ffffff  , page, cards, accordion, buttons
ink         #3d3d3d (body) #4c4c4c (headings) #333 (borders) #2a4726 (video shadow)
```

Design motif = **1–2 px dark border + solid offset shadow with zero blur**:

| Component | Border | Shadow | Radius |
|---|---|---|---|
| Primary button | `2px #333` | `5px 5px 0 #1c3f1d` | 82 px (pill) |
| "Try Peri now!" | `2px #1c3f1d` | `4px 4px 0 #1c3f1d` | 351 px |
| Accordion card | `1px #333` | `4px 4px 0 #1c3f1d` | 12 px |
| Pricing card | `2px #1c3f1d` | `10px 10px 0 #1c3f1d` | 38 px |
| Video | none | `20px 20px 0 #2a4726` | 20 px |
| Chatbot photo |, |, | 28 px |
| Panel sections |, |, | 75 px (45 px ≤980) |

## 6. Graphics / assets

Line-art system: **Tabler Icons** outline SVGs (24×24, `stroke-width:1.5`, round caps) recoloured lime
(`dog.svg` `#b1d135`, others `#b2d235`), forced to a 65 px box; six 74 px PNG line icons
(`clock_icon`, `smile_icon`, `heart_icon`, `bolt-icon`, `chat_icon`, `clock_arrow_icon`).
Illustrations: five `*_illustration_final_drk_green_700.png` (dog/cat/parrot/rabbit collage 700×412,
rabbit 464×700, terrier 450×700, parrot 806×700, kitten 700×300), single dark-green line weight, transparent.
Photography: `pet_care_2.jpg` 1400×771 (hero), `cat_dog_playing.jpg` 900×1260 (right-edge panel).
Brand: `periant-peri-lockup…png` (900×392 header), `peri_favicon-1.png` (bird glyph 512×512 used 60–96 px).
Animation: `composer_animation-6.gif`, 820×110, **225 frames @25 fps (9.0 s)**, 1.2 MB: pill composer with
2 px border and hard shadow, icons `+ / mic / smiley`; starts with placeholder "Hi, I'm Peri. Got a pet care
question? Just ask." + blinking caret, clears, types "How do I prepare my Pup for their next appointment?",
caret blinks three times, loops.
Video: Vimeo `1134010769` (player iframe, `dnt=1`), poster = Peri logo on black.

## 7. JS stack

jQuery 3.7.1 (+migrate) · mediaelement (unused on this page) · Divi 5 module scripts:
`script-library-animation` (waypoints + intensity transforms), `-toggle` (accordion slideToggle 700),
`-menu`, `-multi-view` (breakpoint content swaps), `-video-overlay`, `-section-dividers`, `-fitvids`,
`-form-conditions`, `module-library-script-contact-form`, `theme-scripts-library-base`, `-scroll-to-top`.
Page-level inline scripts: billing-toggle (per `.plan`), savings calculator (26 working days/month,
`(hours × rate × 26 × locations) − plan × locations`, `Intl.NumberFormat USD`), social `target=_blank`,
WordPress speculation-rules prefetch.

## 8. Responsive plan

Breakpoints: tablet **≤980 px**, phone **≤767 px** (Divi defaults), rows 85/80/75 % with `--horizontal-gap` custom props.

- Hero: h1 → `11vw` / 0.95em, row reverses (`wrap-reverse`), photo moves below copy, columns stack.
- Section h2 → 49 px (≤767) on some, 47 px retained elsewhere; body → 16 px in places.
- Icon grids: 4 → 2 (tablet: rows 5/6 take over) → 1. Rows 5/6 are `display:none` ≥981 px (duplicates of row 4).
- Panels: 75 px → 45 px radius; padding 100/130 → 50/50.
- Video 87 % stays; pricing row 75 % → 90 % wrapped; cards stack.
- **Content swapping**: `diviElementMultiViewData` rewrites 10 text modules per device, e.g. the
  "Who is Peri for?" list becomes "Clinical Health Providers / Care & Community Service Providers / Retail &
  Product Suppliers" on phone; "Getting started with Peri is simple…" gains `<br>`s and an em-dash on phone.
- Rabbit image is sticky on tablet (`et_pb_image_sticky_tablet`); nav collapses to Divi mobile menu.

## 9. What this implies for a rebuild (if used as reference)

- The whole "brand" is: one serif at weight 100 + one grotesk at 200/300/500, two greens + one lime,
  zero-blur offset shadows, pill buttons, and large rounded sage panels, the illustration set does the rest.
- Motion is cheap and consistent: entrance only, on first entry, translate ≤50 %, 1 s, ease-in-out, with
  staggered delays (500/800/1000 ms) for card grids. Nothing loops, nothing parallaxes, no scroll-jacking.
- The two "demos" (composer GIF, savings calculator) carry the product story, both are static/custom HTML, not framework widgets.
