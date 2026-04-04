# Fix: Comparison View — Arrow Clutter, Legend Clarity, and Matrix Names

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

## Thinking Level: ultrathink

---

## There are THREE issues to fix. Do ALL three.

---

## Issue 1: Arrow Clutter — Overlapping Lines Creating Star Shapes

### Problem

When multiple connection lines run between Kin nodes that are close together on the circle, the large arrowheads overlap and create messy star/blob shapes. The arrows are too big and the lines stack directly on top of each other.

### Fix

**A) Reduce arrowhead size significantly:**
- `markerWidth="5"` `markerHeight="4"` (down from 8/6)
- Keep arrowheads as simple small triangles — no fancy shapes

**B) Offset parallel lines between the same two nodes:**

When multiple connection types exist between the same pair of Kin nodes (e.g. Remi↔Jolanta has both Analog AND Colour Family lines), the lines must NOT sit directly on top of each other. Offset them:

- Calculate how many connections exist between each pair of nodes
- If only 1 connection: draw straight line, no offset
- If 2 connections: offset each line by ~4px perpendicular to the direct path (one line slightly above, one slightly below)
- If 3+ connections: spread them evenly with ~3-4px gaps perpendicular to the direct path

Implementation approach — for each line between nodes A and B:
1. Calculate the perpendicular direction to the A→B vector
2. Shift the line start and end points along that perpendicular by an offset
3. The offset = `(lineIndex - (totalLines - 1) / 2) * 4px`

This fans out parallel connections so they're visually distinct rather than collapsing into a blob.

**C) Shorten lines so they stop further from the node circles:**
- Add padding of at least `nodeRadius + 6px` so arrowheads sit cleanly outside the circle with a small gap
- No arrowhead should overlap with a Kin circle node

**D) Reduce line stroke-width slightly:**
- Solid lines: `stroke-width: 1.5` (down from 2 if currently thicker)
- Dashed lines: `stroke-width: 1.2`
- This reduces visual weight and makes the diagram feel cleaner

---

## Issue 2: Unclear Legend Labels

### Problem

Several connection type names are ambiguous for non-experts:
- "Wavespell" — what does this mean?
- "Castle" — unclear
- "Occult (hidden)" — "occult" sounds dark/scary to mainstream users

### Fix

Update the legend labels to be clearer and more user-friendly. Change these labels BOTH in the legend AND in any tooltips/popups:

| Current label | New label |
|---|---|
| Analog (support) | Analog — best friend energy |
| Antipode (challenge) | Antipode — growth partner |
| Occult (hidden) | Hidden power — secret gift |
| Guide | Guide — higher-self teacher |
| Colour family | Colour family — shared purpose |
| Earth family | Earth family — same tribe |
| Wavespell | Wavespell — shared 13-day cycle |
| Castle | Castle — shared 52-day court |

Keep the short label before the dash as the primary identifier, and the phrase after the dash as the clarifying subtitle. In the legend, style it as:

```
[line sample] Analog — best friend energy
```

Where "Analog" is the normal weight text and "— best friend energy" is lighter/muted colour (`text-secondary` or `opacity-60`).

If space is tight on mobile, show only the short label (e.g. just "Analog") and hide the subtitle below 640px.

---

## Issue 3: Profile Names NOT Showing in Tzolkin Matrix Cells

### Problem

The previous prompt asked for person names to appear in highlighted Kin cells in the 20×13 Tzolkin matrix. The fix did NOT work — cells still only show the Kin number and tone dots/bars, with no name visible.

### Diagnosis and Fix

Find the Tzolkin matrix component (likely in the Comparison view or a shared matrix component). Look for where highlighted cells are rendered. The issue is probably one of these:

1. **The name element was added but is invisible** — check if it has `opacity: 0`, `display: none`, `color: transparent`, `font-size: 0`, or is positioned off-screen. Fix the visibility.

2. **The name was added outside the cell's visible area** — if the cell has `overflow: hidden` and the name is pushed below the cell boundary, it gets clipped. Fix by either:
   - Increasing cell height slightly (add ~12px) to make room
   - OR making the tone dots smaller to free up vertical space
   - OR positioning the name absolutely at the bottom of the cell within bounds

3. **The name was never actually rendered** — the code change may not have been applied to the correct component. Search the entire codebase for the Tzolkin matrix rendering code. Find where cells are rendered in a `.map()` or loop. The highlighted cells will have some conditional styling (coloured border). Add the name rendering inside that same conditional block.

### Correct implementation

Find the cell rendering code. It will look something like:

```tsx
{/* Inside the cell render */}
<div className="...cell styles...">
  <span>{kinNumber}</span>
  <span>{toneSymbol}</span>
  {/* ADD THIS — only for highlighted cells */}
  {highlightedProfile && (
    <span
      className="text-[9px] leading-none truncate w-full text-center block mt-0.5"
      style={{ color: highlightedProfile.colour }}
    >
      {highlightedProfile.name}
    </span>
  )}
</div>
```

The key requirements:
- `text-[9px]` or `text-[10px]` — small enough to fit
- `leading-none` — no extra line height
- `truncate` — ellipsis for long names
- `w-full text-center` — centred in the cell
- `block` — forces it to a new line below the tone symbol
- Only rendered for cells that have a highlighted profile (the same condition used for the coloured border)
- Name colour matches the border colour

### Verify it works

After implementing, check these specific cells from the comparison data visible in the screenshots:
- Kin 143 (Night) → should show "Remi"
- Kin 148 (Star) → should show "Jolanta"  
- Kin 201 (Dragon) → should show "Azuolas"
- Kin 70 (Dog) → should show "Leja"
- Kin 150 (Dog) → should show "Rmigijus"
- Kin 123 (Night) → should show "Edvinas"
- Kin 258 (Mirror) → should show "Mamyte"
- Kin 48 (Star) → should show "Valdas"
- Kin 79 (Storm) → should show "Iveta"
- Kin 209 (Moon) → should show "Nerijus"

ALL of these cells must show the name below the tone symbol with the matching border colour.

---

## What NOT to change

- Kin calculation logic — do not touch
- Node positions on the circle — do not touch (only the lines between them)
- Colour scheme of lines — keep existing colours, just update labels
- Other views/pages — do not touch
- Profile data — do not touch

## Checklist

- [ ] Arrowheads are smaller (5×4 or similar)
- [ ] Parallel lines between the same two nodes are offset/fanned out, not stacked
- [ ] Lines stop with a gap before the node circle (no arrowhead overlap with nodes)
- [ ] No more star/blob shapes where nodes are close together
- [ ] Legend labels updated with friendly subtitles
- [ ] "Occult" renamed to "Hidden power"
- [ ] All 10 highlighted cells in the Tzolkin matrix show the person's name
- [ ] Names are small (9-10px), coloured to match the border, centred, truncated if long
- [ ] Looks clean on desktop (1200px+)
- [ ] Looks clean on mobile (375px)
- [ ] `npm run build` — zero errors
