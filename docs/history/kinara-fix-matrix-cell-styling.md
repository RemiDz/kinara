# Fix: Tzolkin Matrix Cell Styling — Broken Layout on Highlighted Cells

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

## Thinking Level: megathink

---

## Problem

The Tzolkin 20×13 matrix has broken cell styling. Looking at the current state:

1. **Highlighted cells are taller than non-highlighted cells** — the addition of the profile name text is pushing the cell height up, making those rows uneven. The name text needs to fit WITHOUT changing the cell's outer dimensions.

2. **Some highlighted cells have the name cut off or squished** — e.g. "Rmigijus" is likely overflowing or compressing the tone dots above it.

3. **Inconsistent vertical alignment** — in a given row, the Kin number and tone symbols shift position between highlighted and non-highlighted cells because the highlighted cells have extra content (the name) pushing things around.

4. **The coloured borders on highlighted cells add visual bulk** — some cells look heavier/wider than neighbours.

## Required Fix

### All cells must have IDENTICAL outer dimensions

The grid must be a strict, uniform grid. Every cell — highlighted or not — must be exactly the same width and height. No cell should be taller or wider than any other.

### Approach: Fixed cell height with internal layout

```css
.matrix-cell {
  /* Fixed dimensions — EVERY cell identical */
  width: 100%;
  aspect-ratio: 1 / 1.2;  /* or use a fixed height like 72px — match what non-highlighted cells currently use */
  overflow: hidden;
  
  /* Internal layout */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 2px;
}
```

### Internal content layout for ALL cells

```
┌──────────────┐
│     143      │  ← Kin number: text-xs or text-[11px], font-medium
│     ════     │  ← Tone dots/bars: scaled to fit, ~10px tall
│              │  ← Spacer (empty in non-highlighted cells)
│     Remi     │  ← Name (ONLY in highlighted cells): text-[8px], truncate
└──────────────┘
```

For non-highlighted cells, the name row simply doesn't render, but the cell is the same size — the Kin number and tone just centre vertically in the available space.

For highlighted cells, the content shifts up slightly to make room for the name at the bottom. Use these rules:

```css
/* Highlighted cell name */
.cell-name {
  font-size: 8px;
  line-height: 1;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  margin-top: auto;  /* pushes name to bottom of flex column */
}
```

### Highlighted cell border

Use `outline` instead of `border` so the border doesn't affect the cell's box model dimensions:

```css
.matrix-cell-highlighted {
  outline: 2px solid {profileColour};
  outline-offset: -2px;  /* inset so it doesn't overflow into neighbours */
}
```

If the cells currently use `border` for the highlight, switch to `outline` — this is likely contributing to the size inconsistency.

### Tone dots/bars scaling

If the tone dots/bars are rendered as actual elements (dots + bars), ensure they have a max-height so they don't grow:

```css
.tone-symbol {
  max-height: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  flex-shrink: 0;
}
```

### Grid container

The grid itself should enforce uniform columns:

```css
.matrix-grid {
  display: grid;
  grid-template-columns: repeat(13, 1fr);  /* or however many columns */
  gap: 1px;  /* tight gap, or 2px */
}
```

If the grid uses `auto` sizing on rows, switch to a fixed row height:

```css
grid-auto-rows: minmax(0, 1fr);  /* prevents rows from growing to fit content */
```

Or use:

```css
grid-template-rows: repeat(20, 1fr);
```

## Summary of Changes

1. All cells: identical fixed outer dimensions (use `aspect-ratio` or fixed `height`)
2. Highlighted cell borders: switch from `border` to `outline` with negative offset
3. Name text: `8px`, `truncate`, `margin-top: auto` to push to bottom
4. Tone symbols: capped `max-height`
5. Grid container: fixed row heights, no `auto` sizing
6. Test with all 10 highlighted profiles visible — no cell should be taller/wider than its neighbours

## What NOT to change

- Kin numbers — keep as-is
- Tone dot/bar symbols — keep the visual design, just constrain sizing
- Seal icons in the row headers — do not touch
- Highlight colours per profile — keep as-is
- Profile name content — keep as-is, just fix the styling
- Other views — do not touch

## Checklist

- [ ] All 260 cells are exactly the same outer dimensions
- [ ] No row height inconsistency between highlighted and non-highlighted rows
- [ ] Highlighted cell borders don't affect cell box model (use outline)
- [ ] All 10 profile names visible and legible inside highlighted cells
- [ ] Long names ("Rmigijus") truncated with ellipsis at cell edge
- [ ] Kin numbers vertically aligned consistently across all cells in a row
- [ ] Tone symbols vertically aligned consistently across all cells in a row
- [ ] Grid looks clean and uniform on desktop
- [ ] Grid looks acceptable on mobile (375px) — cells will be small but uniform
- [ ] `npm run build` — zero errors
