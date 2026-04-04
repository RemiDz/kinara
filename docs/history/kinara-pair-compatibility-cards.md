# Feature: Person-to-Person Compatibility Cards — Sorted by Score

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

## Thinking Level: ultrathink

---

## What to Build

Below the comparison wheel (and above the Synastry panel), add a **complete pair-by-pair compatibility analysis** — every possible pair of people, each with a full analysis card, sorted from most compatible to least compatible.

For 11 people that's 55 pairs. Each pair gets a card showing their full relationship breakdown.

---

## Card Layout

### Overall structure

```
┌──────────────────────────────────────────────────────────┐
│  COMPATIBILITY RANKINGS                                   │
│  55 pairs · sorted by connection strength                 │
│                                                           │
│  ┌─ #1 ──────────────────────────────────────────────┐   │
│  │  Remi ←→ Edvinas                    Score: 24     │   │
│  │  Night (143) · Night (123)          ████████████░  │   │
│  │                                                    │   │
│  │  Connections:                                      │   │
│  │  ↔ Colour family — shared purpose (Blue family)   │   │
│  │  ↔ Earth family — same tribe (Polar family)       │   │
│  │  → Guide — higher-self teacher                    │   │
│  │  ↔ Castle — shared 52-day court (Blue #3)         │   │
│  │  ↔ Wavespell — shared 13-day cycle                │   │
│  │                                                    │   │
│  │  "Both carry the Night seal — the dream energy    │   │
│  │   runs deep between you. You share the same       │   │
│  │   vision and inner world."                        │   │
│  └────────────────────────────────────────────────────┘   │
│                                                           │
│  ┌─ #2 ──────────────────────────────────────────────┐   │
│  │  Mamyte ←→ Jolanta                  Score: 18     │   │
│  │  Mirror (258) · Star (148)          █████████░░░  │   │
│  │  ...                                              │   │
│  └────────────────────────────────────────────────────┘   │
│                                                           │
│  ... all 55 pairs ...                                     │
│                                                           │
│  ┌─ #55 ─────────────────────────────────────────────┐   │
│  │  Azuolas ←→ Iveta                   Score: 2      │   │
│  │  Dragon (201) · Storm (79)          █░░░░░░░░░░░  │   │
│  │  ...                                              │   │
│  └────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

### Each card contains

**Header row:**
- Rank number (#1, #2, #3...)
- Both names with their profile colours
- Arrow: `←→` for mutual connections present, `→` if only one-way connections exist
- Compatibility score (number)
- Score bar — visual progress bar showing score relative to the maximum possible score

**Seal identity row:**
- Both people's seal names and Kin numbers
- Both seal icons (small, 24×24px) with `object-fit: contain`

**Connection list:**
- Every connection between this pair, listed with:
  - Direction arrow: `↔` mutual, `→` one-way (show who points to whom)
  - Connection type name with the friendly subtitle
  - Specific detail where applicable:
    - Colour family: which colour (Red/White/Blue/Yellow)
    - Earth family: which family (Polar/Cardinal/Core/Signal/Gateway)
    - Castle: which castle (Red #1, White #2, etc.)
    - Wavespell: which wavespell number
    - Guide/Analog/Antipode/Hidden: which seal is in which role
- If NO connections exist between a pair, show: "No direct Dreamspell connections" in muted text

**Insight text:**
- A short 1-3 sentence interpretation of the overall relationship dynamic
- Generate this based on the combination of connection types present:

```typescript
function generateInsight(pairConnections: Connection[]): string {
  const types = pairConnections.map(c => c.type);
  
  // Same seal
  if (sealA === sealB) {
    return `Both carry the ${sealName} seal — you mirror each other's core essence. This creates deep recognition but also amplifies shared blind spots.`;
  }
  
  // Has Analog
  if (types.includes('analog')) {
    const mutual = pairConnections.find(c => c.type === 'analog')?.direction === 'mutual';
    if (mutual) return `Natural allies. Your seals are complementary partners in the Dreamspell — you strengthen each other effortlessly and share an easy, supportive bond.`;
    return `One of you carries the other's Analog energy — a natural support flows in one direction. The receiver feels uplifted, the giver feels purposeful.`;
  }
  
  // Has Guide
  if (types.includes('guide')) {
    return `A teacher-student dynamic runs through this bond. One carries wisdom the other needs for their soul growth — pay attention to what flows between you.`;
  }
  
  // Has Hidden Power
  if (types.includes('hidden_power')) {
    return `Hidden depth here. Together you unlock potential that stays dormant when apart — this connection reveals itself slowly over time.`;
  }
  
  // Has Antipode
  if (types.includes('antipode')) {
    return `A growth partnership. You challenge each other in ways that feel uncomfortable but ultimately drive evolution. The friction is the gift.`;
  }
  
  // Only category connections
  if (types.every(t => ['colour_family', 'earth_family', 'wavespell', 'castle'].includes(t))) {
    return `You share structural bonds — same cosmic neighbourhood, same seasonal rhythms. A quiet, grounding connection rather than a dramatic one.`;
  }
  
  // No connections at all
  if (types.length === 0) {
    return `No direct Dreamspell connections — you operate in different galactic streams. This doesn't mean no relationship, just that the Tzolkin doesn't highlight a specific dynamic.`;
  }
  
  // Multiple oracle connections
  if (types.filter(t => ['analog', 'antipode', 'guide', 'hidden_power'].includes(t)).length >= 2) {
    return `Multiple oracle connections — this is a significant bond in the Dreamspell. You are woven together across several dimensions of destiny.`;
  }
  
  return `A blend of shared cycles and structural bonds connects you — subtle but steady influences that shape how you relate over time.`;
}
```

**IMPORTANT:** Verify the insight generation against the Kornblum books at:
```
C:\Users\rdzingel\Documents\MY_APPS\HARMONIC_WAVES\tzolkin.app\books\
```
Refine the insight texts based on how the books describe oracle relationships.

---

## Scoring System

Use the same weighted scoring from the auto-arrange algorithm:

| Connection Type | Base Weight | Mutual Multiplier |
|---|---|---|
| Analog | 5 | ×2 = 10 |
| Guide | 4 | ×2 = 8 |
| Hidden power | 4 | ×2 = 8 |
| Antipode | 3 | ×2 = 6 |
| Colour family | 2 | always mutual = 4 |
| Earth family | 2 | always mutual = 4 |
| Wavespell | 1 | always mutual = 2 |
| Castle | 1 | always mutual = 2 |

**Maximum possible score** for any pair = if they had every single connection type as mutual: 10 + 8 + 8 + 6 + 4 + 4 + 2 + 2 = 44

The score bar shows the score as a proportion of 44:
```tsx
<div className="w-32 h-2 bg-[#ede7d9] rounded-full overflow-hidden">
  <div
    className="h-full rounded-full transition-all duration-500"
    style={{
      width: `${(score / 44) * 100}%`,
      backgroundColor: score > 30 ? '#d4a017' : score > 15 ? '#c8a96e' : '#c9b99a',
    }}
  />
</div>
```

Colour coding:
- Gold (`#d4a017`) for high scores (>30) — deep connection
- Warm tan (`#c8a96e`) for medium (15-30) — solid connection
- Light tan (`#c9b99a`) for low (<15) — lighter connection

---

## Card Interaction

### Default state: collapsed

By default, show only the first 5 pairs expanded. The rest show as **collapsed rows** — just the header (rank, names, score, bar) without the connection list or insight:

```
┌─ #6  Remi ←→ Rmigijus          Score: 12  ████████░░░░  ⌄ ─┐
└──────────────────────────────────────────────────────────────┘
```

Tap to expand and see the full card.

### "Expand all" / "Collapse all" toggle

```
[Expand all]  [Collapse all]
```

### Click to filter wheel

When a pair card is tapped/expanded:
- Highlight BOTH people's nodes on the wheel above
- Show only the connections between those two people
- Dim everything else
- Scroll the wheel into view if needed

This connects the cards to the wheel — tap a card, see the relationship on the wheel. Tap the card again or click empty space to clear the filter.

---

## Sorting

Default sort: highest score first (most compatible at top).

Add a sort toggle:
```
Sort: [Most compatible ▼]  [Alphabetical]  [Most connections]
```

- **Most compatible**: by total weighted score, descending
- **Alphabetical**: by first person's name, then second person's name
- **Most connections**: by raw count of connection types (not weighted)

---

## Section Styling

- Section heading: `COMPATIBILITY RANKINGS` in the same spaced uppercase style as other section headings
- Subtitle: `{pairCount} pairs · sorted by connection strength` in muted text
- Cards: cream background (`#ede7d9`), subtle border (`#c9b99a`), rounded corners
- Rank number: large, bold, gold colour for top 3, muted for the rest
- Score number: bold, sized larger than body text
- Connection list items: use the same coloured line sample icons from the legend to identify each type
- Insight text: italic, slightly muted, with a left border accent in gold

---

## What NOT to change

- Comparison wheel — do not touch (only add the click-to-filter-from-card interaction)
- Legend — do not touch
- Existing Synastry panel — this new section goes BETWEEN the wheel and the synastry panel. If it feels redundant with the synastry panel, that's OK — they serve different purposes (synastry groups by type, this groups by pair)
- Node click toggle — keep working independently
- Auto-arrange — do not touch
- Wavespell Journey — do not touch

## Checklist

- [ ] All pairs generated (N×(N-1)/2 cards)
- [ ] Each card shows: rank, both names, both seals/kins, score, score bar, connections list, insight text
- [ ] Pairs sorted by compatibility score descending by default
- [ ] Score calculation uses correct weights including mutual multiplier
- [ ] Score bar colour-coded (gold/tan/light)
- [ ] Top 5 cards expanded by default, rest collapsed
- [ ] Expand/collapse toggle per card
- [ ] Expand all / Collapse all buttons
- [ ] Sort toggle works (compatible / alphabetical / most connections)
- [ ] Clicking a card highlights the pair on the wheel above
- [ ] Connection types show direction arrows (↔ mutual, → one-way)
- [ ] Connection types show specific details (which colour, which family, etc.)
- [ ] Insight text generated based on connection combination
- [ ] "No direct connections" shown for pairs with zero connections
- [ ] Section placed between wheel and synastry panel
- [ ] Looks clean on desktop and mobile
- [ ] `npm run build` — zero errors
