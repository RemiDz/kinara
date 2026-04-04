# Fix: Show Profile Names on Highlighted Kin Cells in Tzolkin Matrix

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

## Thinking Level: megathink

---

## Context

The Tzolkin 20×13 Harmonic Module grid (260 Galactic Signatures) highlights cells for each person added to the Comparison view — each highlighted cell has a coloured border matching that person's colour. But the cells only show the Kin number and tone dots/bars — there's NO indication of WHO that Kin belongs to.

In the circle wheel chart, each node clearly shows the person's name (Remi, Jolanta, Edvinas, etc.). The matrix grid needs the same.

## Required Change

For every highlighted Kin cell in the Tzolkin matrix, display the person's name inside the cell.

### Layout per highlighted cell

```
┌─────────┐
│   143    │  ← Kin number (existing)
│   ════   │  ← Tone dots/bars (existing)
│  Remi    │  ← Person's name (NEW — add this)
└─────────┘
```

### Styling

- Name text: small font size (`text-[10px]` or `text-[9px]`) — it must fit inside the cell without overflow
- Colour: match the person's highlight border colour so the name visually connects to the highlight
- Position: below the tone dots/bars, at the bottom of the cell
- Truncate with ellipsis if the name is too long for the cell width (e.g. "Rmigijus" → "Rmigi…" or use a short display name if available)
- If TWO people share the same Kin (unlikely but possible), stack both names or show "Name1 / Name2" in even smaller text

### Data source

The comparison view already knows which profiles are loaded and their Kin numbers — the same data used to draw the coloured borders on the cells. Use that same data to render the name label inside each highlighted cell.

### What NOT to change

- Non-highlighted cells — do NOT add any text, keep them as-is
- Cell sizes — do NOT resize the grid cells, the name must fit within existing dimensions
- Kin numbers and tone symbols — keep exactly as-is
- Circle wheel chart — do not touch
- Other views — do not touch

### Checklist

- [ ] Every highlighted Kin cell shows the person's name below the tone symbol
- [ ] Name colour matches the cell's highlight border colour
- [ ] Names are small enough to fit without breaking cell layout
- [ ] Long names are truncated with ellipsis
- [ ] Non-highlighted cells are unchanged
- [ ] Grid still looks clean and readable on desktop
- [ ] Grid still looks correct on mobile (375px) — names may be very small but should still render
- [ ] `npm run build` — zero errors
