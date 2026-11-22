"""Brand gate: PawCab board tokens (22 Nov 2026). Run with python3 scripts/check-color-tokens.py."""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
css = (ROOT / "src/app/globals.css").read_text()
values = dict(re.findall(r"--color-([\w-]+):\s*(#[\da-fA-F]{6});", css))

REQUIRED = {
    "canvas": "#F7F2E8",
    "accent": "#FDC300",
    "accent-hover": "#D9A800",
    "navy": "#283B70",
    "midnight": "#14233F",
    "sand": "#DDD0BA",
    "taupe": "#9C8B75",
    "ink": "#283B70",
    "line": "#333333",
    "surface": "#FCFAF6",
}
for name, expected in REQUIRED.items():
    actual = values.get(name)
    assert actual and actual.upper() == expected.upper(), f"token {name}: {actual} != {expected}"
print("tokens pinned to brand board")


def luminance(value):
    channels = [int(value[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    return sum(weight * (c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
               for weight, c in zip((0.2126, 0.7152, 0.0722), channels))


def ratio(fg, bg):
    low, high = sorted([luminance(values[fg]), luminance(values[bg])])
    return (high + 0.05) / (low + 0.05)


# Normal-text pairings used across the site (AA 4.5:1).
for foreground, background in [
    ("navy", "surface"),
    ("navy", "canvas"),
    ("ink", "surface"),
    ("navy", "accent"),
    ("accent", "navy"),
    ("accent", "midnight"),
    ("midnight", "surface"),
    ("accent-hover", "navy"),
    ("line", "surface"),
    ("line", "canvas"),
]:
    r = ratio(foreground, background)
    assert r >= 4.5, f"FAIL {foreground}/{background}: {r:.2f}:1"
    print(f"{foreground}/{background}: {r:.2f}:1")

# Taupe sits at 2.96:1 on ivory — it may never set text. Any text-taupe
# class is a gate failure, not a warning.
# Gold text only survives on dark surfaces; these files prove it per use.
GOLD_TEXT_ALLOWLIST = {
    "src/components/GallerySection.tsx",  # navy band + dark lightbox
    "src/components/AboutSection.tsx",  # navy band
    "src/components/Footer.tsx",  # midnight footer
    "src/components/PetTransportPricing.tsx",  # KM unit on navy result band
    "src/components/Hero.tsx",  # eyebrow on navy hero panel
}
for path in (ROOT / "src").rglob("*.tsx"):
    if "admin" in path.parts:
        continue
    rel = str(path.relative_to(ROOT))
    source = path.read_text()
    assert not re.search(r"#[\da-fA-F]{6}\b", source), f"Colour literal: {rel}"
    assert "178,210,53" not in source, f"Retired lime: {rel}"
    assert "focus:outline-none" not in source, f"Suppressed focus: {rel}"
    assert "text-taupe" not in source and "text-warm-taupe" not in source, f"Taupe text fails AA: {rel}"
    if "text-accent" in source:
        assert rel in GOLD_TEXT_ALLOWLIST, f"Gold text needs a dark-surface proof: {rel}"

# Map fills stay four distinct brand hues.
zones = [values[f"map-zone-{i}"] for i in (1, 2, 3, 4)]
assert len(set(zones)) == 4, f"Zone fills must differ: {zones}"
print(f"zones distinct: {', '.join(zones)}")

assert '[data-surface="navy"]' in css
assert '[data-surface="light"]' in css
assert '[data-theme="admin"]' in css
print("Colour token source checks passed; rendered focus still needs browser verification.")
