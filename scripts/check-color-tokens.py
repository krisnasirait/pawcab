"""Run with python3 scripts/check-color-tokens.py (no dependencies)."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
css = (ROOT / "src/app/globals.css").read_text()
values = dict(re.findall(r"--color-([\w-]+):\s*(#[\da-f]{6});", css))


def luminance(value):
    channels = [int(value[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    return sum(weight * (c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
               for weight, c in zip((0.2126, 0.7152, 0.0722), channels))


for foreground, background in [("forest", "surface"), ("ink", "surface"),
                              ("forest", "accent"), ("forest", "sage"),
                              ("forest", "accent-hover")]:
    low, high = sorted([luminance(values[foreground]), luminance(values[background])])
    ratio = (high + 0.05) / (low + 0.05)
    assert ratio >= 4.5, (foreground, background, ratio)
    print(f"{foreground}/{background}: {ratio:.2f}:1")

for path in (ROOT / "src").rglob("*.tsx"):
    if "admin" in path.parts:
        continue
    source = path.read_text()
    assert not re.search(r"#[\da-fA-F]{6}\b", source), f"Colour literal: {path}"
    assert "178,210,53" not in source, f"Retired lime: {path}"
    assert "focus:outline-none" not in source, f"Suppressed focus: {path}"

assert 'header :focus-visible' not in css
assert '[data-theme="admin"]' in css
assert '[data-surface="light"]' in css
print("Colour token source checks passed; rendered focus still needs browser verification.")
