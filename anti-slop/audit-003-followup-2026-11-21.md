# Colour-token audit follow-up — 2026-11-21

Approval: “fix all” (findings 1–6). Existing brand palette, content, CMS configuration and behaviour preserved. No dependencies added.

## Changes

1. **Dark-surface focus:** `--color-focus` is now a scoped semantic role. Forest surfaces and the admin workspace select amber; nested light panels select forest. Marked calculator loading/error/results panels and the coverage map. The mobile menu and login card explicitly reset the light-surface role. Removed the global `header :focus-visible` coupling.
2. **Input focus:** removed public `focus:outline-none` suppression. Address search and the calculator textarea retain the shared 3px outline/2px offset. Existing admin amber ring replacements are preserved.
3. **Token adoption:** replaced public TSX hex colours with canonical utilities, CSS variables inside shadows/gradients, SVG fills and Leaflet pin HTML. There are now zero six-digit hex literals in public TSX. Legacy colour aliases now reference canonical variables instead of duplicating values; base CSS white surfaces reference `surface`. Layout, shadow dimensions and photographic fade compositions are preserved.
4. **Map colours:** stale lime shadow replaced by translucent tokenized amber. Four named map category roles preserve zone distinction; labels and zone chips continue to repeat category identity without relying on colour alone.
5. **Documentation:** DESIGN.md records the accurate ink/white ratio (10.86:1), forest/white (11.81:1), hover and sagewash values, actual amber roles, and intentional map/admin exceptions. Removed misleading 5%-mix and mark/actions-only descriptions from globals.css.
6. **Semantic roles:** added surface/on-dark/focus/error/error-dark/success/info mappings. Public error copy and existing matching admin status shades consume the roles; other dark-admin status shades remain documented, intentional exceptions rather than arbitrary brand drift.

During rendered verification, found and fixed white mobile-nav labels on its white panel. They now use forest labels, sagewash hover, and deepgreen hover ink. Its amber booking action also uses the documented line-colour boundary on the white surface.

## Checks

- `python3 scripts/check-color-tokens.py`: PASS. Dependency-free regression check for source colour literals, retired lime, suppressed public focus, required scoping, and core contrast pairs.
- `npx tsc --noEmit`: PASS.
- `npx eslint src`: 0 errors, 9 existing warnings (successful exit; not warning-free).
- `npm run build`: PASS.
- `git diff --check`: PASS.
- Browser computed-style checks on `/`, `/stories`, and all three service pages at 1440px: forest header intact; no horizontal overflow. Representative hard shadows retain forest values after tokenization.
- Actual address search selected Seminyak and Canggu, rendering the calculator results. Keyboard-focus styles on its checkbox and waiting select are amber, 3px. Address input focus is forest, 3px.
- At 390px, home has no horizontal overflow; mobile-menu focus is forest on white. Map chip focus is amber on forest; category fill resolves to sage; map shadow resolves to amber at 35% alpha. Mobile menu screenshot inspected.
- Login input verified to resolve forest focus, 3px, inside the light login card.
- Admin scope checked with a synthetic DOM fixture: amber, 3px. This is NOT an authenticated admin interaction test.

Browser probe: `/tmp/peri/probe/color_tokens.py`; results `/tmp/pawcab-color-browser.json`. Screenshot: `/tmp/pawcab-color-mobile.png` (captured before the final mobile CTA border refinement).

## Limits

This is targeted token and focus verification, not a complete WCAG certification. Not every hover, error, image overlay, map tile or authenticated admin state was rendered. Existing administrative local focus-ring treatments and photographic RGB fade values remain intentional exceptions. Low-contrast decorative sage separators are not essential control boundaries and were not darkened indiscriminately. Content provenance and fare calculations were outside this approved colour audit.
