# Fix: Add Meaningful Explanations to Comparison Connection Categories

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

## Thinking Level: megathink

---

## Problem

The comparison wheel legend shows connection type names like "Hidden power — secret gift" and "Analog — best friend energy" but nowhere does the app explain what these actually MEAN. A user seeing "secret gift" has no idea what that implies for the relationship between two people. The labels are catchy but meaningless without context.

## Required: Add explanations in TWO places

---

### Place 1: Legend Tooltips

Each legend item should show a tooltip on hover (desktop) or tap (mobile) with a 1-2 sentence plain-language explanation.

| Connection Type | Tooltip Explanation |
|---|---|
| **Analog — best friend energy** | Your natural ally. You share complementary gifts and strengthen each other effortlessly. This is the easiest, most supportive connection in the Dreamspell. |
| **Antipode — growth partner** | Your mirror opposite. This person challenges you to grow by reflecting what you avoid. Friction here is productive — it pushes both of you to evolve. |
| **Hidden power — secret gift** | An unexpected depth between you. This connection reveals hidden potential that neither of you sees on the surface. Together you unlock abilities that stay dormant alone. |
| **Guide — higher-self teacher** | A wisdom connection. The guide carries a teaching that the other person needs for their soul growth. This is a mentor-student dynamic, sometimes flowing both ways. |
| **Colour family — shared purpose** | You face the same direction in life. Same colour family means you share a fundamental approach — both initiating (Red), refining (White), transforming (Blue), or ripening (Yellow). |
| **Earth family — same tribe** | You belong to the same planetary service team. Your Earth family determines your shared role in the collective — Polar (receives), Cardinal (initiates), Core (processes), Signal (transmits), or Gateway (opens). |
| **Wavespell — shared 13-day cycle** | Your Kin numbers fall within the same 13-day creation wave. You share the same underlying theme and purpose cycle, though you each express a different tone within it. |
| **Castle — shared 52-day court** | You both live in the same 52-day court of the Tzolkin. This is a broad seasonal connection — you share the same major life chapter energy. |

### Tooltip implementation

Use a simple hover/tap tooltip. On desktop, show on hover with a small delay (200ms). On mobile, show on tap with a tap-outside-to-close.

```tsx
// Simple tooltip component
<div className="group relative cursor-help">
  <span className="legend-label">Hidden power — secret gift</span>
  <div className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2
    bg-[#2c1a0e] text-[#f5f0e8] text-xs rounded-lg px-3 py-2 max-w-[280px] w-max
    shadow-lg z-30 leading-relaxed">
    An unexpected depth between you. This connection reveals hidden potential
    that neither of you sees on the surface. Together you unlock abilities
    that stay dormant alone.
  </div>
</div>
```

Style the tooltip:
- Dark warm brown background (`#2c1a0e`) with cream text (`#f5f0e8`)
- `max-width: 280px` so it doesn't stretch too wide
- Rounded corners, subtle shadow
- Small triangle/arrow pointing down toward the legend item
- `z-index: 30` to sit above everything

Add a subtle visual hint that the legend items are hoverable — a faint `?` icon or a dotted underline on the subtitle text.

---

### Place 2: Synastry Panel Category Headers

The Relationship Synastry panel below the wheel already groups connections by type (e.g. "Castle — Shared 52-Day Court: 12 connections"). Each of these category headers should include the explanation text directly — not hidden in a tooltip, but shown as a subtitle below the header.

```
┌──────────────────────────────────────────────────────┐
│  ● Hidden power — secret gift                    ⌄   │
│    An unexpected depth between you. Together you      │
│    unlock abilities that stay dormant alone.          │
│    3 connections                                      │
├──────────────────────────────────────────────────────┤
│  (expanded: individual pair interpretations)          │
└──────────────────────────────────────────────────────┘
```

Styling:
- Category name: `text-sm font-semibold` in warm brown
- Explanation subtitle: `text-xs` in muted secondary (`#6b4c2a` at `opacity-70`), italic
- Connection count: `text-xs` in muted tertiary
- Keep the expand/collapse chevron on the right

Use a slightly shorter version of the explanation for the synastry panel (1 sentence max) to keep the UI clean:

| Connection Type | Short Explanation (for synastry panel) |
|---|---|
| Analog | Natural allies who strengthen each other effortlessly. |
| Antipode | Mirror opposites who push each other to grow. |
| Hidden power | Reveals hidden potential that stays dormant alone. |
| Guide | A wisdom connection — one carries a teaching the other needs. |
| Colour family | Share the same fundamental life direction and approach. |
| Earth family | Belong to the same planetary service team. |
| Wavespell | Fall within the same 13-day creation wave. |
| Castle | Share the same 52-day life chapter energy. |

---

### Place 3: Connection line tap/click (if not already implemented)

When a user taps on a connection LINE in the wheel (not a node), show a small popup with:
- The two people's names
- The connection type with its short explanation
- Arrow direction (one-way or mutual)

Example:
```
┌──────────────────────────────┐
│  Remi → Mamyte               │
│  Hidden power — secret gift  │
│  One-way                     │
│                              │
│  Reveals hidden potential    │
│  that stays dormant alone.   │
└──────────────────────────────┘
```

This makes the wheel itself interactive and educational — tapping any line tells you exactly what it means.

If tapping lines is technically difficult (thin SVG lines are hard tap targets), add an invisible wider stroke (`stroke-width: 12; opacity: 0`) behind each visible line as a hit area.

---

## Content source

**VERIFY all explanations against the Kornblum books** at:
```
C:\Users\rdzingel\Documents\MY_APPS\HARMONIC_WAVES\tzolkin.app\books\
```

Book 2 explains the oracle positions in detail. If the books provide richer or more accurate descriptions than what I've written above, use the book versions. The descriptions above are starting points — improve them with the book's wisdom.

---

## What NOT to change

- Connection line rendering — do not touch
- Wheel layout and sizing — do not touch
- Synastry individual pair interpretations — do not touch
- Node rendering — do not touch

## Checklist

- [ ] All 8 legend items have hover tooltips with 1-2 sentence explanations
- [ ] Tooltips styled with dark background, cream text, max-width 280px
- [ ] Tooltips work on mobile (tap to show, tap elsewhere to dismiss)
- [ ] Legend items have visual hint they're hoverable (dotted underline or ? icon)
- [ ] All 8 synastry panel category headers show short explanation subtitle
- [ ] Connection line tapping shows popup with names, type, direction, and explanation
- [ ] Invisible wider hit areas on lines for easier tapping
- [ ] Explanations verified against Kornblum books
- [ ] Looks clean on desktop and mobile
- [ ] `npm run build` — zero errors
