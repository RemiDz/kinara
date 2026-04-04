# Fix: Maximise Comparison Wheel + Fix Distorted Wavespell Icons

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

## Thinking Level: megathink

---

## THREE issues to fix.

---

## Issue 1: Comparison Wheel — Maximise to Fill Page Width

### Problem

When 10+ profiles are loaded, the comparison circle wheel is too small and compressed. The nodes overlap, names are unreadable, and connection lines become a tangled mess. The wheel needs to use MUCH more screen real estate.

### Fix

**A) Make the wheel responsive and significantly larger:**

Desktop (1200px+):
- The wheel SVG/container should be `width: 100%` of its parent container
- `max-width: 900px` (up from whatever it currently is — likely 500-600px)
- `aspect-ratio: 1` to keep it circular
- Centre horizontally with `margin: 0 auto`

Desktop wide (1400px+):
- `max-width: 1000px`

Mobile (< 768px):
- `width: 100%` minus padding
- `max-width: 100vw - 2rem`

**B) Scale node circles and text with the wheel size:**

The nodes (circle + seal name + Kin number + person name) should scale proportionally. If the wheel doubles in size, the nodes should get bigger too — not stay the same tiny size in a vast empty circle.

Use relative sizing based on the SVG viewBox, NOT fixed pixel sizes. If the SVG viewBox is e.g. `0 0 800 800`:
- Node circles: radius `40-50` (not 25-30)
- Seal name text: `font-size="14"` 
- Kin number text: `font-size="11"`
- Person name text: `font-size="13"`

**C) Increase node spacing on the circle perimeter:**

With a larger wheel, nodes naturally spread further apart. But also ensure:
- The circle radius (where nodes sit) uses at least 85% of the available SVG width
- Nodes are evenly distributed around the full 360°
- Person names are positioned OUTSIDE the circle (not overlapping with connection lines)

**D) Add a fullscreen/expand toggle button:**

Add a small button (icon: expand arrows ⤢) in the top-right corner of the wheel section. When clicked:
- The wheel section expands to fill the full viewport (`position: fixed; inset: 0; z-index: 40; background: #f5f0e8`)
- The wheel SVG scales to fill the viewport (minus padding for the legend)
- Legend moves to bottom of viewport
- A close button (✕) appears in the top-right to exit fullscreen
- Press Escape to also exit fullscreen

This gives users a "zoom in" mode for detailed analysis of complex family comparisons.

**E) Connection lines should also scale:**

- In the larger wheel, line `stroke-width` can stay the same or slightly increase
- Arrowheads should remain proportional
- The parallel line offset for multiple connections between the same pair should increase proportionally so lines are still distinguishable

---

## Issue 2: Wavespell Journey — Seal Icons Are Distorted and Stretched

### Problem

The seal glyph icons in the Wavespell Journey day cards are visually distorted — they appear stretched/squished, not maintaining their correct aspect ratio. The icons look wrong.

### Fix

**A) Force correct aspect ratio on all seal icons:**

Every `<img>` tag rendering a seal icon must have:

```css
.seal-icon {
  width: 48px;
  height: 48px;
  object-fit: contain;  /* CRITICAL — prevents stretching */
  flex-shrink: 0;       /* prevents flex container from squishing it */
}
```

If the icons are rendered as `<div>` backgrounds:
```css
background-size: contain;
background-repeat: no-repeat;
background-position: center;
```

If the icons are SVG components, ensure they have:
```tsx
<svg viewBox="0 0 100 100" width="48" height="48" preserveAspectRatio="xMidYMid meet">
```

**B) Check the source icon files:**

Look at the actual PNG/SVG files in the project's icon folder. Check if:
- They are square (1:1 aspect ratio) — if not, the container must use `object-fit: contain`
- They have transparent backgrounds — if not, add `border-radius: 8px` to round the corners

**C) Ensure the icon container doesn't stretch:**

In the day card flex layout, the icon container must NOT stretch vertically to match the text height:

```css
.day-card {
  display: flex;
  align-items: flex-start;  /* NOT stretch */
  gap: 12px;
}

.icon-container {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  flex-grow: 0;
}
```

`align-items: stretch` (the flex default) would cause the icon container to grow to match the text column height, distorting the icon. Use `flex-start` or `center` instead.

**D) Also fix seal icons everywhere else in the app:**

Do a global search for all seal icon rendering. Apply the same `object-fit: contain` and fixed dimensions to:
- Comparison wheel nodes (if using img tags)
- Profile cards
- Oracle cross
- Tzolkin matrix row headers
- Any other place seal icons appear

---

## Issue 3: Wavespell Day Card Tone Dots — Right Side Placement

### Problem

Looking at the screenshot, the tone dot/bar symbols on the right side of each day card appear to be randomly placed and inconsistently sized. Some show as tiny dots, others as bars, with no clear visual pattern.

### Fix

The tone dots/bars on the right side of each day card should be:
- Consistently sized: each dot `6px` diameter, each bar `18px × 4px`
- Vertically centred within the card
- Right-aligned with consistent right margin
- The dot-and-bar system should be clear: 1-4 = dots, 5 = one bar, 6 = bar + dot, etc.
- All rendered at `opacity: 0.4` as subtle visual reference (the tone NAME is the primary info, dots are decorative)

---

## What NOT to change

- Relationship Synastry feature — do NOT touch, it's working great
- Connection line colours and types — keep as-is
- Legend labels — keep as-is
- Profile data / localStorage logic — do not touch
- Saved profile chips (if implemented from last prompt) — do not touch

## Checklist

- [ ] Comparison wheel is significantly larger — fills most of page width on desktop
- [ ] Nodes are proportionally larger with readable text
- [ ] Fullscreen expand button works — wheel fills viewport
- [ ] Escape / close button exits fullscreen
- [ ] Wheel handles 10+ profiles without nodes overlapping
- [ ] Wavespell seal icons are NOT distorted — correct 1:1 aspect ratio
- [ ] All seal icons use `object-fit: contain` or equivalent
- [ ] Icon containers don't stretch in flex layout
- [ ] Tone dots/bars on day cards are consistent and subtle
- [ ] Fixed icon rendering everywhere in the app (global fix)
- [ ] Looks great on desktop (1200px+)
- [ ] Looks acceptable on mobile (375px)
- [ ] `npm run build` — zero errors
