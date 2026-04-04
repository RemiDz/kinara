# Fix: Comparison Circle Wheel Layout

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

## Thinking Level: megathink

---

## Problem

The Comparison view's circle wheel (showing family members' Kin connections — Analog, Antipode, Occult, Guide, Colour Family, Earth Family, Wavespell, Castle lines) has a broken layout:

1. The circle wheel is NOT centred on the page — it's offset to the left
2. The legend/key (line type explanations: Analog support, Antipode challenge, Occult hidden, Guide, Colour family, Earth family, Wavespell, Castle) is floating to the RIGHT SIDE of the circle instead of sitting BELOW it
3. The overall layout feels like a side-by-side flex row when it should be a single centred column

## Required Fix

### Layout structure

The comparison view must use a **vertical column layout**, NOT a row:

```
┌─────────────────────────────────┐
│                                 │
│     [Circle Wheel — centred]    │
│                                 │
├─────────────────────────────────┤
│                                 │
│  [Legend / Connection Types]    │
│  centred below the wheel        │
│                                 │
│  ── Analog (support)            │
│  - - Antipode (challenge)       │
│  ═══ Occult (hidden)            │
│  ── Guide                       │
│  ── Colour family               │
│  ── Earth family                │
│  - - Wavespell                  │
│  - - Castle                     │
│                                 │
└─────────────────────────────────┘
```

### CSS/Layout rules

1. The **parent container** of the wheel + legend must be `flex-direction: column` and `align-items: center` (NOT `flex-direction: row`)
2. The **circle wheel SVG/canvas** must be `margin: 0 auto` with `max-width` that keeps it comfortably sized (e.g. `max-width: 600px`, `width: 100%`)
3. The **legend** must be a separate block BELOW the wheel, centred, with `margin-top: 1.5rem`
4. The legend items should wrap into a horizontal row of pills/chips or a clean 2-column grid — NOT a vertical sidebar list
5. On mobile (< 640px), the legend can stack into a single column if needed

### Legend layout suggestion

Display the connection types as a centred flex-wrap row of small legend items:

```
[── Analog (support)]  [- - Antipode (challenge)]  [═══ Occult (hidden)]  [── Guide]
[── Colour family]     [── Earth family]            [- - Wavespell]        [- - Castle]
```

Each legend item: `display: inline-flex; align-items: center; gap: 6px;` with the coloured line sample + label text. The whole legend row: `display: flex; flex-wrap: wrap; justify-content: center; gap: 12px 24px;`

### What NOT to change

- The circle wheel content itself (nodes, connection lines, names, Kin numbers) — do not modify
- The comparison data/logic — do not touch
- Other views/pages — do not touch
- Colour scheme — keep as-is

### Checklist

- [ ] Circle wheel is horizontally centred on the page
- [ ] Legend/key is BELOW the wheel, not beside it
- [ ] Legend items are arranged as a centred wrapped row
- [ ] Looks correct on desktop (1200px+)
- [ ] Looks correct on mobile (375px)
- [ ] No horizontal overflow
- [ ] `npm run build` — zero errors
