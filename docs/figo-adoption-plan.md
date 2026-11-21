# PawCab × Figo: detailed design adoption and migration plan

Status: proposal for approval. Planning only; this document does not authorize a redesign deployment, content rewrite, asset creation, font acquisition, or fare-engine change.

## 1. Objective and definition of fidelity

Adopt Figo's visual grammar: prominent editorial serif headings, comfortable sans-serif copy, warm light surfaces, generous section spacing, rounded media, flat pill controls and restrained interaction feedback. Preserve PawCab's identity, existing displayed content, CMS data, destinations and service functionality.

This supersedes the proposed preservation of askperi-style hard shadows and entrance animations. They cannot coexist as equal systems without making the site look patched together.

Design dials proposed: ENERGY 2 / RHYTHM 3 / MOTION 1.

Fidelity means matching hierarchy, composition, density and interaction restraint, not copying insurance content, lime branding, illustrations or proprietary font binaries.

### Scope

In scope:
- `/`, `/services/pet-transport`, `/services/dog-walking`, `/services/pet-sitting`, `/stories`.
- Public header/footer/buttons, section surfaces, photography, FAQs, gallery, estimator and map-picker presentation.
- Keyboard, reduced-motion and responsive issues in touched public components.
- Design documentation, regression checks and baseline evidence.

Excluded from visual redesign:
- `/admin`, `/login`, `/admin/login` and administrative editors. Smoke-test these for shared-CSS regressions.
- API behaviour, routing/geocoding providers, zone policy, price calculations, CMS schemas/storage, SEO positioning or editorial rewrites.
- Figo tracking, consent tools, experimentation infrastructure, chat, newsletter collection and insurance quote flows.

## 2. Evidence boundaries and corrections

Reference: `https://figopetinsurance.com/?ref=land-book.com`.

Usable reference observations:
- Desktop/mobile screenshots show light editorial layouts, dark ink, flat pill actions, rounded photos and a persistent navigation bar.
- Runtime style samples identify IvyPresto-family headings, IvyEpic body text and short colour/transform transitions.
- Controlled dropdown capture: `ev_0e6f9f4d34c0d72bfd90efaf9cec6f5833dfe02bf69972409916e6b8fda3e37f`.
- Captured-bundle analysis parent: `ev_bc6f06f17155f366903674b04154d125839e3febe5cd1913b884eafcbd05911b`. Source parsing and route inference were partial; this is not proof of a complete application inventory.
- Earlier desktop/mobile local probe files live under `/tmp/peri/probe/figo_*`. Temporary files are supplemental evidence, not durable documentation.

Do not repeat earlier overclaims:
- A negative string search cannot establish that Figo has no first-party animation library. The alleged GSAP hit was not attributed to a specific source; both the original dependency claim and its proposed third-party explanation remain unverified.
- A small before/after scroll sample does not prove that no element uses scroll animation anywhere.
- Passive form/listener inspection does not establish the submit destination or complete validation logic.
- The ref parameter was not exhaustively A/B-tested; no attribution-only guarantee is needed for this adoption.
- The previously reported mint `#95E6C2` was a transcription error; the inspected family included `#95E6E2`. Neither is imported into PawCab.

Our own implementation choices are deliberate: no scroll-hidden marketing content, no new motion library, no tracking additions. They do not depend on universal negative claims about Figo.

## 3. Baseline before implementation

Create one dated baseline outside production source:
1. Record current working-tree status and preserve existing staged deletions and untracked files. Do not reset or restore files to manufacture a clean tree.
2. Snapshot displayed text by section and route; record headings, CTA labels/hrefs, anchors, prices, notes, contact details and image sources.
3. Record CMS source/fallback for each displayed block. `src/lib/content.ts` imports root `content.json`; do not introduce a second content source.
4. Capture desktop/mobile hero, each section and key interaction states. Disable nonessential entrance animation in the baseline capture if necessary, documenting that choice.
5. Record current build/type/lint results and known warnings. Compare subsequent results against that baseline rather than promising an arbitrary warning-free project.
6. Record calculator output for controlled routes plus boundary cases; separate actual current behaviour from expected rate-card policy.

### Content preservation contract

Preserve existing visible words, including non-CMS literals, unless an explicit correction is approved. Changes in wrapping, position or semantic markup are not copy changes.

Important mismatch: CMS has headline fields that several current components do not consume. Home has `hero.title1/title2/title3Accent`, service/about/comfort headings and `comfort.features`; current Hero, Services, About and Comfort contain literal editorial headings/features. Do not silently switch to stored text during a visual redesign. Produce a field-to-visible-content ledger and flag existing CMS-editability gaps separately.

Keep existing hidden CMS fields, types, stored operating hours and JSON-LD hours unchanged. No visible hours should reappear. Preserve current phone `+62 822-6638-3800`, WhatsApp destination `6282266383800`, email and Instagram data.

Do not add press logos, ratings, review counts, testimonials, customer portraits or verification language. Existing story/quote provenance remains an owner-confirmation issue; styling must not imply new verification.

## 4. Visual foundation

### 4.1 Palette and roles

| Role | Decision | Where |
|---|---|---|
| Public canvas | Add `--color-canvas: #FBF6F1` | Main public page field |
| Surface | Keep `--color-surface: #FFFFFF` | Inputs, estimator, dialogs |
| Accent | Keep `#FEBB00` | Primary actions and sparing emphasis |
| Accent hover | Keep `#FFC61A` | Amber action hover |
| Forest | Keep `#1C3F1D` | Headings, navigation, dark actions/footer |
| Deepgreen | Keep `#2A4726` | Dark-action/ink hover |
| Body ink | Keep `#3D3D3D` | Body, labels, supporting content |
| Sagewash | Keep `#F4F9EE` | Selected care/coverage section surfaces |
| Sage | Keep `#CEE2C5` | Subtle structure and existing map category |
| On-dark/focus/status/map roles | Preserve audited mappings | Functional states |

One cream canvas is sufficient initially. Do not reproduce Figo's many near-identical cream literals. No new mint, lime or decorative teal family.

Surface rhythm is based on meaning: canvas for editorial flow, white for the interactive estimator, sagewash for care/coverage grouping, forest for the existing about/gallery/footer chapters. No mandatory background flip at every section. No giant amber band without a content-specific reason.

Text AA minimum: 4.5:1 for normal text; large text 3:1. Essential control boundaries/status indicators 3:1 where required. Verify new cream combinations including opacity, hover and focus. Amber never carries white text or acts as small text on cream. Amber actions on light backgrounds retain a clear forest/line boundary.

### 4.2 Public-only styling boundaries

Add an explicit public styling scope on the five public page roots, e.g. `data-ui="public"`. Keep existing routes and avoid an App Router directory move purely for styling.

- New public typography and canvas rules belong in that scope, not unconditionally on `body`.
- Leave canonical brand values and compatibility aliases stable for admin consumers.
- Preserve white input/dialog surfaces; do not redefine `--color-surface` to cream.
- Check nested forest/light surfaces and overlays. A light dialog opened from a dark section must resolve light focus and dark text.
- Remove reliance on broad ancestor heading-inheritance rules where they defeat explicit surface text colours. Use predictable component-level colour roles.
- If a touched modal is later portaled, ensure its scope/tokens are available at the portal root. Do not add a portal solely to adopt Figo.

### 4.3 Typography

Default route: keep Cormorant Garamond and Public Sans. Existing layout already requests Cormorant 300/400/500 and variable Public Sans; using 400/500 does not require another family.

| Role | Desktop | Phone | Weight / line-height |
|---|---|---|---|
| Hero H1 | fluid 80–96px | 44–52px, 40–44px at 320 if needed | 400 initially, 1.02–1.1 |
| Section H2 | 52–64px | 34–40px | 400, 1.05–1.15 |
| Content H3 | 26–32px | 24–28px | 400/500, 1.15–1.25 |
| Body | 17–18px | 16–17px | 400, 1.5–1.6 |
| Actions | 15–16px | 15–16px | 500/600, 1.25 |
| Labels/notes | 13–14px | 13–14px | 400/500, 1.4–1.5 |

Numbers are starting targets, not fixed heights or forced breaks. Keep copy widths about 55–70 characters. Estimator numerical values use the body family and tabular numerals if helpful, without letterspacing or clipping currency units. Keep attribution readable even where it remains smaller than normal notes.

No arbitrary italic/accented keyword in every headline. No uppercase metadata system. Existing public wording/case remains unless separately approved.

Exact IvyPresto/IvyEpic reproduction requires valid webfont licensing and supplied files. Do not download or redistribute Figo font binaries. Font purchase is optional, not a blocker for the default plan.

### 4.4 Layout, spacing, shape and elevation

- Shared content maximum: 1280px outer container including gutters (compatible with current max-w-7xl).
- Gutters: 20px phones, 32px tablet/desktop; no 100vw wrappers that introduce scrollbar overflow.
- Section padding: compact 32–48px, normal 56–80px, editorial 80–112px desktop; 40–64px phone. Choose by section role.
- Column gaps: 24–32px phone/tablet, 48–64px wide desktop.
- No fixed text heights. Content controls component height.
- Pill actions/chips: full radius. Large media: 28–32px. Estimator/dialog: 24–32px. Inputs/notes/dropdown: 12–16px; address inputs are deliberately not giant pills because they contain location/clear tools and long text.
- Remove offset hard shadows, including inline arbitrary shadows and hover variants. Flat editorial media. Soft shadow permitted for a floating suggestion list or dialog, not every card.
- Keep functional borders; reduce heavy editorial outlines. Border opacity must not be used to hide necessary control boundaries.

## 5. Header, hero and fold specification

### Header

Light public canvas header with forest links; flat amber booking action. Keep the current route/anchor labels and CTA data sources, not a new insurance-style dropdown.

Logo decision is explicit: the amber mark alone is weak on cream. Default proposal is the unchanged mark on a compact forest plate within the light header, with forest wordmark alongside. Use the same lockup consistently on desktop/mobile. If that treatment is rejected, retain a forest header rather than silently recolouring the logo.

Use sticky positioning with a stable overall height, roughly 72–80px desktop and 64–72px phone. Do not animate padding/height during scrolling. If moving from fixed to sticky, remove compensating hero top padding on ALL five pages, not just home. Audit sticky ancestors for overflow/transform containment.

Mobile: menu trigger at least 44px, `aria-expanded`, `aria-controls`, first-item focus on opening, Escape dismissal, return focus, close on navigation. Hidden menu links must not remain tabbable. Keep overlay and dialog stack order separate; do not add a second sticky booking bar.

### Hero

Keep current approved headline/description/image/CTA labels and destinations. Do not add a dummy pet-name quote form or duplicate the live estimator in the hero.

Desktop:
```
[mark + wordmark]  existing links                      [Book a ride]

[existing headline, strong serif]       [existing rounded CMS photo]
[existing description]                 [subject kept visible]
[Book a Ride] [Check your fare]
[existing service-area line]

[fare heading]   [fixed-range] [per-km range] [waiting]
[existing explanatory note]                  [fare anchor]
```

Phone:
```
[brand] [booking action if it fits] [menu]
headline
existing description
booking + fare actions (wrap when required)
service area
rounded photo
fare summary in readable stacked rows
```

No artificial 100vh hero or overlap card. Show the headline and booking action in a practical first screen; don't force the photo and every rate into one phone viewport. Desktop target roughly 700–900px including fare ledger, but actual text/viewport determines height.

Photo: preserve CMS source and descriptive alt; don't imply a stock image documents an actual PawCab customer. Check crop at each breakpoint. Reserve dimensions/aspect ratio. Only the true above-fold hero image is eager/high-priority.

## 6. Homepage section-by-section migration

Keep this order for the first rollout to avoid changing the conversion journey and visual design simultaneously.

| Section / file | Concrete change | Preserve / verify |
|---|---|---|
| `Hero.tsx` | Stronger type, flat actions, warm canvas, existing integrated ledger | Visible copy, CMS image, three links, rate ranges |
| `FeaturesRow.tsx` | Flat proof strip, comfortable labels, no decorative dots needed for meaning | All four existing features; 4 columns wide, 2 tablet, stacked phone |
| `PetTransportPricing.tsx` | White flat estimator, simple grouped controls, calm result hierarchy | All states and calculations; see section 7 |
| `ServicesSection.tsx` | Remove oversized inset pc-panel and frame shadows; editorial image/text rows | All 3 services, descriptions, images, hrefs; original reading order |
| `AboutSection.tsx` | Retain forest chapter, remove framed offset shadow and overlapping quote-card treatment | Existing description, CTA, quote and attribution; do not invent proof |
| `CoverageSection.tsx` | Sagewash/editorial introduction with map as functional focal point | Zone copy, links, existing coverage data |
| `BaliZoneMap.tsx` | Flat dark map surface, legible labels/chips, no lime/amber offset shadow | Zone colours/labels, 29 baseline areas, 4 zone counts, filter interaction |
| `GallerySection.tsx` | Quiet rounded media, no hover hard shadow, modest optional zoom | Existing names, photos, captions and all gallery items |
| `ComfortSection.tsx` | Flat editorial photo and existing feature ledger, no reveal | All six current literal points, CMS image; flag CMS features mismatch |
| `HowItWorksSection.tsx` | Real ordered steps with flat separators/panels, no entry stagger | Step count from content, order, numbers, CTA and note |
| Reviews in `app/page.tsx` | Spacious serif introduction with quiet surface | Configured Elfsight ID and existing fallback; no invented review grid |
| `Footer.tsx` | Forest footer, consistent mark/wordmark, flat structure | Existing links, contact details, area text; no hours restored |

Gallery default: retain horizontal scrolling on phone and a static grid on desktop only if every image and its caption remains represented. No autoplay or carousel library. Record this as a responsive layout change, not a new content section. Keyboard focus must scroll items into view.

Do not manufacture full-bleed photo interludes by duplicating an image just to match Figo. Existing About/Comfort media supply visual breathing room without duplicate content.

## 7. Estimator and maps: full state contract

Figo contributes form clarity and surface treatment, not PawCab business logic.

### Estimator layout

- External section title/description remain left-aligned.
- Estimator remains max-w-4xl unless actual long-address testing supports a wider layout.
- Pickup/drop-off: equal-width columns at wide desktop; stack below 1024px, with swap positioned between or beside them without changing DOM/tab order unpredictably.
- Labels stay above fields. Search, clear and location tools do not overlap typed text.
- Map shortcut remains distinct from address search. Optional notes remain visible and do not block estimation.
- Results remain in normal document flow, not sticky. Show distance, zone/rate and total/quote status with clear hierarchy.
- Round-trip/waiting controls and WhatsApp booking stay attached to results.
- Existing rate-card notes/table remain discoverable. Do not collapse policy into a tooltip.

### Required state matrix

| State | Visual/interaction requirement | Test |
|---|---|---|
| Empty | Clear current prompt; no invented fare | Initial load, keyboard access |
| One selected endpoint | Other field still editable; no premature booking estimate | Clear/select/swap |
| Search loading | Readable status; dropdown stays within viewport | Slow controlled search |
| Search ready | Active option distinguished by more than ambiguous colour | Arrows, Enter, Escape, pointer |
| Search empty | Existing nearby-landmark/map fallback visible | Controlled no results |
| Search failure | Existing Retry reachable without losing typed text | Controlled network failure |
| Geolocation pending/denied/outside | Status/error associated with correct endpoint | Browser permission mocks |
| Route loading | Stable reserved result area; readable status | Slow route response |
| Route error | Visible failure + working Retry; no stale total presented as current | Failed then recovered response |
| Fixed fare | Distance/zone/fixed fare clear | Exact 5km boundary |
| Per-km fare | Rate/distance/total remain together | Above 5km and exact 15km |
| Manual quote | No fake numeric total or stale bookable fare | Beyond 15km; supported outside-zone cases |
| Same endpoint | Current zero-distance behaviour recorded, no redesign-induced crash | Same coordinates |
| Round trip/waiting | Checked state, selected hours and amount legible | Toggle and 1–4 hour options |
| Long route/notes | Wrap without pushing actions offscreen | Long local names and multiline notes |
| Swap/clear/reselect | Values/suggestions update; older requests don't visually overwrite current route | Rapid input sequence |

### Map picker

Keep dynamic Leaflet import, attribution, target toggle, current-location control, candidate marker, address resolution, confirmation and cancellation. No replacement map provider.

- Dialog fits the visual viewport, including mobile browser chrome; confirmation actions remain reachable with internal scrolling.
- Suggestion dropdown must escape calculator clipping but remain below modal layers.
- Suggested layer order: sticky header 30, suggestions 40 within the page stacking context, gallery overlay 60, map picker 70. Validate actual stacking contexts rather than relying on numbers alone.
- Focus stays inside an open modal, Escape closes, body scroll is restored, opener focus returns. Existing modal code does not prove all these properties; test and close touched accessibility gaps.
- Leaflet JS movement is separate from CSS motion. Its current fly-to lasts 0.8s, and reduced motion sets duration zero. Preserve reduction; consider shortening normal travel only if needed, not deleting location feedback.
- Keep OpenStreetMap attribution and keyboard-operable controls. If pointer picking is not fully keyboard-equivalent, document search/geolocation alternatives rather than claiming the map itself is fully keyboard-accessible.

### Known pricing/content discrepancies: separate gate

Do not endorse or silently fix these while restyling:
- `quoteZoneFare` filters null endpoints; one known endpoint can produce a fare even if the other is outside-zone.
- Zone lookup uses nearest listed coordinates within a cutoff, not verified service polygons.
- Round-trip currently adds waiting to the one-route base; return-leg pricing policy is not confirmed.
- Hero rate ranges are literals while estimator rates read configuration. They can diverge when CMS rates change.
- Some idle copy still says flat-rate despite zone tiers.

Log baseline versus intended policy. If pricing is changed, use a separate approved change/test set before release; do not bake known incorrect policy into permanent regression assertions. Do not claim pricing compliance solely because the visual checks pass.

## 8. Service pages and stories

All four currently have their own visual treatments; changing the global stylesheet alone will leave a hybrid result.

### Shared public subpage pattern

- Existing H1, description, image and primary action retained.
- Replace gradient-over-photo hero treatments with predictable text/media columns where possible. The complete copy moves with the section; it is not removed.
- Use the same type, gutters, action hierarchy and radius roles as home.
- Reflow to copy first, image second on phone; don't rely on image overlays for essential text contrast.
- Highlights are flat content groupings rather than heavy outlined/shadowed icon boxes.
- Preserve every existing internal anchor and CTA destination.

### Transport

Files: `app/services/pet-transport/page.tsx`, `PetTransportPricing.tsx`, `PetTransportFAQ.tsx`.

Preserve hero, highlights, comfort details, estimator, all notes/fees/tables, FAQs and final CTA. The shared estimator must match home in all states. Restyle FAQ open/closed states without losing search/help controls that already exist.

### Walking

Files: `app/services/dog-walking/page.tsx`, `DogWalkingPricing.tsx`, `DogWalkingFAQ.tsx`.

Preserve hero, existing activity/highlight content, three zone plans and FAQs. Rates stay Rp 80,000 / 90,000 / 100,000 per hour. Keep up-to-two-dogs and neighbourhood/transport-fee/outside-zone conditions. Three columns only when long area names fit; otherwise stack. No fabricated popular-plan badge.

### Sitting

Files: `app/services/pet-sitting/page.tsx`, `PetSittingFAQ.tsx`.

Preserve quote-factor presentation, process, highlights and FAQs. Location, pet count and duration remain quote factors, not purchasable packages. Do not expose zero placeholders as free services. Keep `#rates` and `#how-it-works`.

### Stories

File: `app/stories/page.tsx`.

Preserve intro, featured story, story list/sections, images, story-specific CTA messages and final action. Use flat rounded editorial images, not a fictional review/photo grid inspired by Figo. Do not add star ratings, verification badges or customer counts. Existing stock-vs-real and quotation provenance questions remain flagged.

## 9. Interaction and motion specification

| Element | Normal motion | Reduced motion / exceptions |
|---|---|---|
| Marketing content on load/scroll | No opacity-zero gates, transforms or stagger | Same immediate visibility |
| Text links | Colour/underline treatment, 150–200ms | Immediate |
| Buttons/chips | Background/border/text, 150–200ms | Immediate; focus always immediate |
| Clickable media | Optional scale 1 to at most 1.02, 250–350ms | No scale; only on hover-capable fine pointers |
| Menu | Optional opacity and translateY up to 6px, 150–200ms | Immediate; focus cannot precede visibility |
| FAQ | Explicit grid-row/disclosure transition 180–220ms, caret rotation | Immediate; hidden content not tabbable |
| Gallery/map modal | Optional fade 120–180ms; no zoom/fold | Immediate; focus trap/restoration independent of animation |
| Search/result status | Normal flow; small progress indicator only while pending | Static status text remains perceivable |
| Map movement | Existing controlled fly-to, review duration separately | Set JS duration to zero |

Do not animate outline-colour, focus position, header height, large ambient backgrounds or every state change. No transition-all, perpetual decoration, parallax, smooth-scroll library, GSAP addition or JS height animator.

### Reveal migration

1. Enumerate all `Reveal` imports/usages and wrapper `as` semantics.
2. Replace them with the same semantic HTML tags, preserving keys, classes, layout, ordered-list structure and image containers.
3. Check remaining consumers before deleting `Reveal.tsx`.
4. Remove pc-reveal selectors, keyframes and `html[data-reveal]` arming only when references are gone.
5. Verify no route retains hidden opacity/transform initial states or unnecessary client boundaries.
6. Keep reduced-motion CSS for remaining interaction/loading motion and test JS map movement separately.

## 10. Component and file migration map

| Files | Work | Risk / guardrail |
|---|---|---|
| `DESIGN.md`, adoption plan/report | Replace old reference-specific rules with approved direction | Keep old teardown docs as history, label superseded |
| `app/globals.css` | Public-scoped type/canvas, surface/radius/motion roles; retire hard shadows/reveals | Do not recolour admin or global white surfaces |
| `app/layout.tsx` | Only necessary public font/documentation adjustments | Preserve metadata, JSON-LD, shared font variables |
| `Button.tsx` | Flat variants, no lifts, clear focus/disabled states | Preserve link/button semantics, props, href/targets |
| `Header.tsx`, `Footer.tsx` | Public chrome, consistent logo use, menu lifecycle | Anchor offsets and route-wide header change |
| `Hero.tsx`, `FeaturesRow.tsx` | Fold, type, rate ledger/strip | No hardcoded copy replacement or image source changes |
| `ServicesSection.tsx`, `AboutSection.tsx`, `ComfortSection.tsx`, `HowItWorksSection.tsx` | Editorial section layout and reveal removal | Preserve current literal and CMS content |
| `CoverageSection.tsx`, `BaliZoneMap.tsx` | Map presentation/section hierarchy | Preserve all category data and filters |
| `GallerySection.tsx` | Flat media, responsive presentation, modal accessibility | Keep all items/captions; focus/cycling/scroll restoration |
| `PetTransportPricing.tsx`, `AddressSearchInput.tsx`, `MapPickerModal.tsx` | Functional form surfaces, state legibility and overlays | Routing/quote logic unchanged unless separately approved |
| `DogWalkingPricing.tsx`, all 3 FAQ files | Shared pricing/disclosure style | Every existing note/question/answer retained |
| `app/page.tsx`, all 3 service pages, stories | Scope roots, remove inline visual exceptions, consistent chapter layout | Preserve anchors/metadata and third-party integration |
| `Reveal.tsx` | Remove only after last consumer migrates | No stale root arming styles |
| `scripts/check-color-tokens.py` | Extend public-palette/source checks if new roles require it | Keep useful existing assertions |

No new design framework, schema migration, broad component factory or dependency upgrade. Reuse Button and a small number of CSS roles; introduce shared components only where repeated markup actually warrants them. Read relevant installed Next.js guides before implementation.

## 11. Delivery phases and checkpoints

### P0 — Preservation and technical baseline
Deliver content/route/anchor/state ledger, screenshots, known-issue list and test commands. No UI diff. Gate: all intended sections and business invariants are accounted for.

### P1 — Foundation and representative vertical slice
Update approved design rules and public scoping. Build header, homepage hero, shared button and estimator shell/representative states. Do not globally delete legacy styles while unconverted routes need them.

Checkpoint screenshots: 1440 desktop hero + populated estimator; 390 phone header/menu + hero + estimator; 320 long-address form. Gate: recognisably Figo-inspired composition with PawCab branding, readable logo, no content disappearance, no admin leakage. Review this before mass rollout.

### P2 — Complete homepage
Migrate all homepage sections, gallery and map overlays, review section and footer. Gate: full-page content diff reconciled; keyboard and modal checks pass; no duplicated content used as filler.

### P3 — Service pages and stories
Migrate transport, walking, sitting and stories. Gate: per-page heading/CTA/price/FAQ inventories match baseline; reused estimator matches home.

### P4 — Motion and legacy cleanup
Remove unused reveal code/hard-shadow rules and superseded font/style literals. Gate: no public marketing content depends on intersection observation; no remnants of old lift/stagger system. Intentional third-party/Leaflet exceptions documented.

### P5 — Acceptance and AFTER audit
Run matrix below; create numbered audit and fix only approved extra findings. Record what was tested, what was mocked and what could not be inspected. No production deployment or unrelated working-tree cleanup without a separate instruction.

## 12. Test and acceptance matrix

### Visual/responsive

- Widths: 320, 390, 768, 1024 and 1440. Capture all five routes at representative sizes, not only home.
- Check short desktop height (e.g. 768px) as well as tall screenshots; sticky elements must not consume the screen.
- 200% zoom/text sizing: no clipped titles, prices, labels or booking actions.
- Test long CMS headings, multi-line addresses, large currency values and missing optional fields.
- No horizontal document overflow. Intentional gallery/rate-table scroll is contained and signposted.
- No cropped dog faces introduced by object-position changes. No duplicate stock photos used as new evidence.

### Keyboard/accessibility

- One H1 per page; coherent heading order, labels and descriptive link names.
- Tab through header/menu, combobox suggestions, notes, map shortcut, waiting selector, booking CTA, FAQ and gallery.
- Native activation semantics maintained; no fake clickable divs.
- Focus rings visible on cream, white, forest and amber. No animated outline transition.
- Escape dismisses overlays; focus returns; background is not keyboard-accessible while modal is active.
- No hidden FAQ/menu content remains in the tab order. Test accessible combobox option announcements.
- Minimum 44px standalone target recommendation, 48px primary actions/fields; ensure dense text-link exceptions are intentional.
- Contrast measured from computed pairings, including opacity and hover/selected/error states. Image text either has a reliable backing or is removed from the image.
- Reduced-motion preference tested before load and while open. JS map fly-to verified separately from CSS.
- No-JS: core text, service links, prices and manual WhatsApp booking remain available; do not promise live geocoding without JavaScript.

### Functional/content

- All route and anchor destinations retained, including `#fare`, `#pricing`, `#services`, `#passengers`, sitting `#rates`/`#how-it-works` and `#footer` where applicable. Offset anchors below sticky header.
- Decode estimator WhatsApp payload and compare pickup/drop-off, map URLs, distance, zone, rate/quote reason, waiting, round-trip and notes against the unchanged baseline.
- Walking and sitting booking messages and existing story-specific messages retained.
- Search loading/empty/error/selection and route error/retry tested with controlled fixtures; one live smoke route additionally confirms real integration. Do not rely on external availability for all tests.
- Rate boundaries: 5, just above 5, 15, above 15; every zone and known quote-policy exceptions logged. Cross-zone baseline behaviour recorded without claiming owner approval of the rule.
- Coverage area set/count and filters unchanged; Ubud and Gianyar remain represented.
- Gallery opens/cycles/closes; FAQ answers remain complete.
- Configured reviews still load or show current fallback. Cross-origin widget internals may not be fully restylable/testable; report that limitation.
- CMS change smoke check for fields already wired (e.g. hero description/image, service item, zone rate, gallery caption), in a reversible local fixture only. No writes to production content.
- No visible hours restored; no numberless WhatsApp links introduced.

### Build/performance

Commands: `npx tsc --noEmit`, `npx eslint src`, `npm run build`, `python3 scripts/check-color-tokens.py`, `git diff --check`.

Record baseline warnings versus new warnings. No newly introduced runtime console errors. Production build success is not a substitute for route-state browser checks.

Compare production measurements on the same environment/device profile. Targets, not unmeasured promises: CLS <=0.1, LCP <=2.5s and field INP <=200ms where field measurement exists. Lab interaction checks are not field INP. At minimum prevent regression in repeated comparable lab runs.

- No new motion-library or duplicated-client bundles.
- Hero image has reserved dimensions and appropriate sizes/priority. Below-fold media remains lazy; no blanket eager loading.
- Preserve dynamic map loading. Avoid server components becoming clients solely for animation.
- Keep third-party review script loading policy; don't add Figo trackers or widget dependencies.

## 13. Decisions, blockers and sign-off

Defaults ready for approval:
- PawCab amber/forest preserved; new public cream canvas.
- Existing font families with stronger weights, not unlicensed Ivy fonts.
- Light sticky header with unchanged logo on compact forest backing.
- Current homepage order and full visible content retained.
- Flat editorial surfaces and interaction-only motion replace hard shadows/reveals.
- Existing photos retained; no generated illustrations.

Not blockers to begin visual work, but explicit exceptions:
- Stock imagery versus actual passenger/handler claims needs owner confirmation.
- Existing CMS-title/feature mismatches need separate content-wiring approval.
- Existing fare-policy issues need a separate correctness decision; do not conceal them with a new result UI.
- Widget interiors and third-party variants are not fully controllable.

No need to stop every phase for arbitrary style decisions. The meaningful visual gate is P1. Exact Figo fonts, new illustrations, a navigation restructure, content rewrites, pricing changes or deployment each require separate approval.

Final deliverables: updated public UI; updated DESIGN.md; content/state regression evidence; durable representative before/after screenshots; command results; numbered AFTER audit; explicit residual limitations. No claim that all possible browser, widget, experiment or pricing states are exhausted.
