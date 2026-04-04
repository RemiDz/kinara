# Fix: Tzolkin Matrix — Reduce Gap Between Tone Symbol and Name in Highlighted Cells

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

## Thinking Level: megathink

---

## Problem

In highlighted Tzolkin matrix cells, there is too much vertical space between the tone dots/bars symbol and the profile name below it. This wastes cell space and makes highlighted cells look stretched compared to non-highlighted cells.

Current layout (too much gap):
```
┌──────────┐
│   143    │
│          │
│   ════   │
│          │  ← too much space here
│          │
│   Remi   │
└──────────┘
```

Required layout (tight, compact):
```
┌──────────┐
│   143    │
│   ════   │
│   Remi   │
└──────────┘
```

## Required Fix

Find the matrix cell component. Inside highlighted cells, the three content elements (Kin number, tone symbol, name) need to be packed tightly together with minimal gaps.

### Remove all excess spacing

1. **Remove `margin-top: auto`** from the name element if it was added from the previous prompt — this was pushing the name to the bottom of the cell, creating the gap. Instead use a simple small margin: `margin-top: 1px` or `mt-0.5`.

2. **Set the cell's flex layout to pack from the centre:**
```css
.matrix-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;  /* NOT space-between, NOT flex-end */
  gap: 0px;  /* zero gap between children */
  padding: 2px 1px;
}
```

3. **Remove any gap, margin, or padding between the three child elements:**
```css
.kin-number {
  font-size: 11px;
  font-weight: 500;
  line-height: 1.1;
  margin: 0;
  padding: 0;
}

.tone-symbol {
  line-height: 1;
  margin: 0;
  padding: 0;
}

.profile-name {
  font-size: 8px;
  line-height: 1;
  margin: 0;
  padding: 0;
}
```

4. **Check for any wrapper divs** adding extra padding or margin between the elements. Strip them down to the bare minimum.

5. **Non-highlighted cells** should also centre their content (Kin number + tone) vertically with `justify-content: center` and zero gap, so the vertical rhythm is consistent across the entire grid.

## What NOT to change

- Cell outer dimensions — keep uniform
- Name text size and truncation — keep at 8-9px with ellipsis
- Highlight border/outline colours — keep as-is
- Kin numbers and tone symbols — keep as-is
- Other views — do not touch

## Checklist

- [ ] Zero visible gap between tone symbol and profile name in highlighted cells
- [ ] All three elements (number, tone, name) are tightly packed in the centre of the cell
- [ ] Highlighted cells look the same height as non-highlighted cells
- [ ] Non-highlighted cells still centre their content vertically
- [ ] Grid rows are uniform height
- [ ] `npm run build` — zero errors
