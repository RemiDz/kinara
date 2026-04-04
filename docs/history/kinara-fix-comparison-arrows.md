# Fix: Add Directional Arrows to Comparison Wheel Connection Lines

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

## Thinking Level: megathink

---

## Context

The Comparison view shows a circle wheel with family members' Kin nodes arranged in a circle, connected by coloured lines representing Dreamspell oracle relationships (Analog, Antipode, Occult, Guide, Colour Family, Earth Family, Wavespell, Castle).

Currently the lines have NO direction — you can't tell if a connection is:
- **One-way**: Person A's Analog is Person B, but Person B's Analog is NOT Person A
- **Mutual/bidirectional**: Person A is Person B's Analog AND Person B is Person A's Analog

## Required Change

### Add SVG arrowheads to all connection lines

1. **One-way connection** → Single arrowhead pointing FROM the source Kin TOWARD the target Kin (i.e. the arrow points at the person who IS the oracle role for the source)
   - Example: If Remi's Guide is Jolanta, draw an arrow from Remi → Jolanta on the Guide line

2. **Mutual/bidirectional connection** → Arrowheads on BOTH ends of the line (double-headed arrow)
   - Example: If Remi's Analog is Edvinas AND Edvinas's Analog is Remi, show arrows on both ends

### Implementation

Use SVG `<marker>` definitions for arrowheads. Each connection type (Analog, Antipode, Occult, Guide, Colour family, Earth family, Wavespell, Castle) needs its own marker because they have different colours:

```svg
<defs>
  <!-- One marker per connection type colour -->
  <marker id="arrow-analog" viewBox="0 0 10 7" refX="10" refY="3.5"
    markerWidth="8" markerHeight="6" orient="auto-start-fix">
    <polygon points="0 0, 10 3.5, 0 7" fill="{analog-colour}" />
  </marker>
  <!-- Repeat for each type... -->
</defs>
```

For each connection line:
- **One-way**: Apply `marker-end="url(#arrow-{type})"` only
- **Mutual**: Apply BOTH `marker-start="url(#arrow-{type}-reverse)"` and `marker-end="url(#arrow-{type})"`
  - The `marker-start` version needs `orient="auto-start-fix"` or a reversed polygon so the arrowhead points outward at the start end too

### Arrow sizing and positioning

- Arrowheads should be small enough to not overwhelm the diagram — `markerWidth="8" markerHeight="6"` is a good starting point
- The line endpoint (`refX`) should stop just BEFORE it hits the Kin circle node, so the arrowhead sits at the edge of the circle, not hidden behind it
- Adjust `refX` based on the node circle radius — the arrow tip should visually touch the circle border
- For dashed lines (Antipode, Wavespell, Castle), the arrowhead should still be a solid filled triangle, just coloured to match

### Determining direction

For each pair of people in the comparison, calculate oracle relationships in BOTH directions:
- Compute Person A's oracle cross (Analog, Antipode, Occult, Guide) and check if Person B appears
- Compute Person B's oracle cross and check if Person A appears
- If both have each other in the same role → mutual (double arrow)
- If only one has the other → one-way (single arrow pointing at the target)
- For category connections (Colour Family, Earth Family, Wavespell, Castle) — these are inherently mutual (if A and B share Earth Family, it's symmetric), so always use double arrows for these

### Legend update

Update the legend below the wheel to show the arrow convention:
- Add a small note: "→ one-way · ↔ mutual" or similar
- Or show single vs double arrowhead examples in the legend line samples

### What NOT to change

- Node positions, sizes, names, Kin numbers — do not modify
- Connection colours — keep existing colours
- Line styles (solid, dashed, dotted) — keep as-is
- Layout (centred wheel, legend below) — keep as-is
- Other views/pages — do not touch

### Checklist

- [ ] All connection lines have directional arrowheads
- [ ] One-way connections show a single arrow pointing at the target
- [ ] Mutual connections show arrows on both ends
- [ ] Arrowheads match the line colour for each connection type
- [ ] Arrowheads are visible but not oversized
- [ ] Arrowheads sit at the circle edge, not hidden behind nodes
- [ ] Dashed/dotted lines have solid arrowheads
- [ ] Category connections (Colour/Earth Family, Wavespell, Castle) show double arrows
- [ ] Legend updated to explain arrow convention
- [ ] Looks correct on desktop and mobile (375px)
- [ ] No SVG rendering issues or clipping
- [ ] `npm run build` — zero errors
