# Kinara — Fix All Bugs + Dashboard-First UX + Multi-Kin Comparison

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag where relevant.

## Thinking Level: gigathink

---

## Overview

The Kinara app (Dreamspell/Tzolkin calculator) needs THREE things done in this session:

1. **FIX** — Critical logic bugs (tone icons, grid colours, empty phase cards, full Dreamspell logic audit)
2. **RESTRUCTURE** — Remove the date-input-first landing page. Make the dashboard the home page with today's Kin loaded by default
3. **ADD** — New multi-Kin comparison feature: enter up to 5 birth dates, see side-by-side cards + interactive relationship web

Before making ANY changes:
1. Read the ENTIRE existing codebase — every component, data file, utility
2. Read the Nestor/Anton Kornblum books in the DeepWhisper project folder at `C:\Users\rdzingel\Documents\MY_APPS\HARMONIC_WAVES\deepwhisper.app\` — they are the authoritative Dreamspell reference
3. Understand the full Dreamspell system before touching any code

---

# PART 1 — BUG FIXES

## BUG 1: Tone Icons Are WRONG

### Problem
The tone icon on the Profile Card shows wrong symbols. Example: Kin 143 (Tone 13 — Cosmic) displays 3 horizontal lines (≡) instead of the correct Mayan dot-and-bar pattern.

### Correct Dot-and-Bar System

Dreamspell tones use Mayan vigesimal notation:
- **1 dot** = value of 1
- **1 bar** = value of 5
- Dots are ALWAYS above bars
- Bars stack vertically
- Dots sit in a horizontal row above the topmost bar

| Tone | Bars | Dots | Visual |
|------|------|------|--------|
| 1 | 0 | 1 | • |
| 2 | 0 | 2 | •• |
| 3 | 0 | 3 | ••• |
| 4 | 0 | 4 | •••• |
| 5 | 1 | 0 | ━ |
| 6 | 1 | 1 | • over ━ |
| 7 | 1 | 2 | •• over ━ |
| 8 | 1 | 3 | ••• over ━ |
| 9 | 1 | 4 | •••• over ━ |
| 10 | 2 | 0 | ━ over ━ |
| 11 | 2 | 1 | • over ━━ |
| 12 | 2 | 2 | •• over ━━ |
| 13 | 2 | 3 | ••• over ━━ |

### Fix

```typescript
function getToneSymbol(tone: number): { bars: number; dots: number } {
  return {
    bars: Math.floor(tone / 5),  // 0, 1, or 2
    dots: tone % 5               // 0, 1, 2, 3, or 4
  };
}
```

Render as SVG or CSS:
- Each bar: horizontal rectangle ~40×6px, rounded ends, warm brown colour
- Each dot: filled circle ~6px radius, warm brown
- Dots in a centred horizontal row at TOP
- Bars stacked below dots, centred
- ~4px gap between elements

### Verification
Check ALL 13 tones render correctly. Especially:
- Tone 5: 1 bar, 0 dots (NOT 5 dots)
- Tone 10: 2 bars, 0 dots (NOT 2 bars + 5 dots)
- Tone 13: 2 bars + 3 dots above

---

## BUG 2: 260 Grid Colours Are WRONG

### Problem
Colours are mixed within columns — red, white, blue, yellow cells appearing randomly within the same column. Should be solid vertical colour bands.

### Root Cause
Colour is likely calculated from `(kinNumber - 1) % 4` (produces diagonal pattern). Must use the SEAL/COLUMN index instead.

### Correct Rule
Colour is determined by SEAL (column), NOT by Kin number. The 20 seals follow a fixed colour cycle:

```
Col 1  Dragon      = RED
Col 2  Wind        = WHITE
Col 3  Night       = BLUE
Col 4  Seed        = YELLOW
Col 5  Serpent     = RED
Col 6  Worldbridger = WHITE
Col 7  Hand        = BLUE
Col 8  Star        = YELLOW
Col 9  Moon        = RED
Col 10 Dog         = WHITE
Col 11 Monkey      = BLUE
Col 12 Human       = YELLOW
Col 13 Skywalker   = RED
Col 14 Wizard      = WHITE
Col 15 Eagle       = BLUE
Col 16 Warrior     = YELLOW
Col 17 Earth       = RED
Col 18 Mirror      = WHITE
Col 19 Storm       = BLUE
Col 20 Sun         = YELLOW
```

Pattern: Red, White, Blue, Yellow repeating. Every cell in a column shares that column's colour.

### Fix

```typescript
// For grid cell at column index `col` (0-indexed, 0-19):
const colorIndex = col % 4; // 0=Red, 1=White, 2=Blue, 3=Yellow

// Or from a Kin number:
const sealIndex = (kinNumber - 1) % 20; // 0-19
const colorIndex = sealIndex % 4;       // 0=Red, 1=White, 2=Blue, 3=Yellow
```

Grid fills column-by-column:
```
kinNumber = (col * 13) + row + 1   // col 0-19, row 0-12
```

Colour values (warm cream palette):
```typescript
const sealColors = {
  red:    { bg: 'rgba(192, 57, 43, 0.15)', border: '#c0392b' },
  white:  { bg: 'rgba(127, 140, 141, 0.10)', border: '#bdc3c7' },
  blue:   { bg: 'rgba(36, 113, 163, 0.15)', border: '#2471a3' },
  yellow: { bg: 'rgba(212, 160, 23, 0.15)', border: '#d4a017' },
};
const colorOrder = ['red', 'white', 'blue', 'yellow'];
```

### Verification
- Each column is ONE solid colour — no mixing within any column
- 5 vertical bands of 4 columns each, repeating R-W-B-Y
- Kin 143 is in column 3 (Night = BLUE), highlighted with gold ring

---

## BUG 3: Phase of Mastery Cards Are EMPTY

### Problem
Only Phase 1 shows description text. Phases 2–5 are blank.

### All 5 Phases Content

**Phase 1 — Re-awakening** (Seals 1–4: Dragon, Wind, Night, Seed)
Awakening to your true nature and cosmic identity. You are remembering who you truly are — waking up to the codes written in your being. This is the phase of birth, breath, dream, and intention — the primal emergence of consciousness recognising itself.

**Phase 2 — Reconnecting** (Seals 5–8: Serpent, Worldbridger, Hand, Star)
Reconnecting to the web of life, to others, to the Earth, and to Spirit. Building bridges between dimensions of your experience. Learning to feel, touch, and communicate with the deeper fabric of reality. Life force, surrender, accomplishment, and beauty weave together here.

**Phase 3 — Integrating** (Seals 9–12: Moon, Dog, Monkey, Human)
Integrating all aspects of yourself — the emotional, the loyal, the playful, the free-willed. Bringing together the parts that have been separated. Becoming whole through acceptance of all your expressions. Flow, love, magic, and choice unite in this phase.

**Phase 4 — Expanding** (Seals 13–16: Skywalker, Wizard, Eagle, Warrior)
Expanding beyond known boundaries. Exploring new dimensions, reclaiming your timelessness, gaining higher vision, and finding the courage to question everything. Space, receptivity, vision, and fearlessness carry you beyond the familiar.

**Phase 5 — Re-generating** (Seals 17–20: Earth, Mirror, Storm, Sun)
Regenerating and completing the cycle. Navigating by synchronicity, reflecting truth without distortion, catalysing transformation, and radiating unconditional light. The mastery of enlightened being — evolution, endlessness, self-generation, and universal fire.

### Assignment Logic
```typescript
function getPhaseOfMastery(sealNumber: number): number {
  // sealNumber 1-20, returns Phase 1-5
  return Math.ceil(sealNumber / 4);
}
```

### Fix
Populate ALL 5 phase cards with their descriptions. Highlight the user's active phase with a gold border or expanded state. ALL cards must show: phase number, phase name, AND full description text — not just the active one.

---

## BUG 4: Full Dreamspell Logic Audit

### 4a. Kin Calculation
Test these birth dates and verify results match lawoftime.org:
- June 15, 1981 → **Kin 243**, Blue Cosmic Night
- July 26, 2025 → Kin 1, Red Magnetic Dragon (Galactic New Year)
- Feb 29, 2000 → Must use Feb 28 (Dreamspell skips Feb 29)
- Dec 31, 2025 → Check against lawoftime.org

**IMPORTANT**: If the app currently shows Kin 143 for June 15, 1981, the Kin calculation itself is WRONG. Correct answer is Kin 243.

### 4b. Oracle Cross Formulas

For a Kin with seal number S (1-20) and tone T (1-13):

**Analog** — pairs that sum to 21 with wrapping:
```
Dragon(1) ↔ Sun(20)
Wind(2) ↔ Storm(19)
Night(3) ↔ Hand(7)
Seed(4) ↔ Earth(17)
Serpent(5) ↔ Mirror(18)
Worldbridger(6) ↔ Moon(9)
Star(8) ↔ Warrior(16)
Dog(10) ↔ Eagle(15)
Monkey(11) ↔ Wizard(14)
Human(12) ↔ Skywalker(13)
```

**Antipode** — seal + 10 (mod 20):
```typescript
const antipodeSeal = ((sealNumber - 1 + 10) % 20) + 1;
```

**Occult Hidden** — pair sums to 21:
```typescript
const occultSeal = 21 - sealNumber; // if > 20, subtract 20
```

**Guide** — depends on TONE, always same colour as Kin's seal:
```
Tones 1, 6, 11 → Guide = SELF (same seal)
Tones 2, 7, 12 → Guide = same-colour seal +12 positions (mod 20)
Tones 3, 8, 13 → Guide = same-colour seal +4 positions (mod 20)
Tones 4, 9     → Guide = same-colour seal +16 positions (mod 20)
Tones 5, 10    → Guide = same-colour seal +8 positions (mod 20)
```

Verify for Kin 243 (Blue Cosmic Night, Seal 3, Tone 13):
- Guide: Tone 13 → +4 → (3+4-1)%20+1 = 7 = Blue Hand ✓
- Analog: Night(3) ↔ Hand(7)
- Antipode: (3-1+10)%20+1 = 13 = Red Skywalker
- Occult: 21-3 = 18 = White Mirror

Cross-reference against the Kornblum books.

### 4c. Wavespell, Castle, Earth Family, Colour Family

All formulas and lookup tables must be verified — see the existing codebase and correct against Kornblum books if needed. Earth Family groupings:

- **Polar** (Crown): Dragon(1), Dog(10), Eagle(15), Sun(20)
- **Cardinal** (Throat): Wind(2), Skywalker(13), Warrior(16), Earth(17)
- **Core** (Heart): Night(3), Hand(7), Human(12), Storm(19)
- **Signal** (Solar Plexus): Seed(4), Star(8), Wizard(14), Mirror(18)
- **Gateway** (Root): Serpent(5), Worldbridger(6), Moon(9), Monkey(11)

---

# PART 2 — DASHBOARD-FIRST UX RESTRUCTURE

## Current Problem
The app opens with a date input form. User must enter a date before seeing anything. This is wrong — a practitioner wants to see TODAY's energy immediately on load.

## New Structure

The app should have a SINGLE-PAGE dashboard layout with these zones:

### Zone A — Top Bar (sticky)
- App name "Kinara" (left)
- Today's Gregorian date + 13-Moon date (centre or right)
- Small settings icon (right) — for language toggle etc.

### Zone B — Today's Kin Hero (auto-loaded on page open)
- Automatically calculates and displays TODAY's Galactic Signature
- Full Profile Card: Kin number, name, seal glyph, tone dot-and-bar icon, keywords, affirmation
- Updates daily at midnight (or on page refresh)
- This is what the practitioner sees first — "what's the energy today?"
- Below the card: a subtle "Enter birth date" expansion panel or inline input row

### Zone C — Client Lookup (collapsible section)
- Title: "Client Lookup" or "Personal Kin"
- Compact inline input: Day / Month / Year dropdowns + "Calculate" button (all in one row)
- Optional: Name field (text input) so you can label the Kin (e.g. "Jolanta", "Client A")
- When calculated, the full profile appears below: Profile Card, Soul Essence, Tone Description, Oracle Cross, Colour Family, Earth Family, Phase of Mastery, Wavespell, Castle, Sound Healing Rx
- This REPLACES the old date-input landing page — it's now just a section within the dashboard

### Zone D — Kin Comparison (new feature — see Part 3)

### Zone E — 260 Tzolkin Matrix
- The full 20×13 grid (with colours FIXED per Bug 2)
- If a Kin has been calculated (today's or client's), highlight it with gold ring
- If comparison mode is active, highlight ALL compared Kins with distinct colours

### Zone F — Footer
- "Part of the Harmonic Waves ecosystem" + link to harmonicwaves.app
- "Built with love for the sound healing community"
- Current year

## Page Flow
1. User opens the app → sees Zone B (today's Kin) immediately, no clicks needed
2. Scrolls down or clicks "Client Lookup" → enters a birth date → sees full profile
3. Can add more dates to comparison → sees relationship web
4. Scrolls to see 260 matrix with highlighted Kins

## Important UX Details
- NO separate landing page, NO separate routes — everything is on ONE scrollable dashboard
- The date input is WITHIN the dashboard, not a gate before it
- Today's Kin section should feel like the hero/centrepiece
- All sections below should be collapsible/expandable with smooth animations
- Mobile-first: everything stacks vertically, full width
- iOS Safari date fix on all selects: `-webkit-appearance: none; appearance: none; min-width: 0;`

---

# PART 3 — MULTI-KIN COMPARISON FEATURE

## Overview
Enter up to 5 birth dates. See side-by-side Kin cards AND an interactive relationship web showing how the Kins connect through oracle relationships, shared families, and frequency compatibility.

## Zone D — Kin Comparison Section

### D1. Input Area
- Title: "Kin Comparison" or "Group Energy Analysis"
- Up to 5 input rows, each with:
  - Name field (optional text input, e.g. "Remi", "Jolanta", "Client A")
  - Day / Month / Year dropdowns
  - A colour dot auto-assigned to this entry (for the relationship web): use a distinct palette like gold, teal, coral, violet, sage
  - Remove (×) button
- "Add Person" button (appears when fewer than 5 entries, disabled at 5)
- "Compare" button — triggers the comparison view

### D2. Side-by-Side Cards
When Compare is clicked, display cards horizontally (scrollable on mobile):

Each card shows (compact version):
- Assigned colour dot + name (or "Person 1" etc.)
- Kin number and full name (e.g. "Kin 243 — Blue Cosmic Night")
- Seal glyph icon (small, ~48px)
- Tone dot-and-bar symbol
- Seal colour accent strip
- Tone name + keywords (one line)
- Seal keywords (one line)
- Colour Family badge
- Earth Family badge
- Phase of Mastery badge
- Castle badge
- Healing Category + frequency range (one line)

Cards should be compact enough that 2–3 fit on screen side by side on desktop. On mobile, horizontally scrollable.

### D3. Relationship Web (Interactive Visualisation)

Below the cards, render an interactive relationship map. This is the centrepiece of the comparison feature.

**Visual Layout:**
- A circular or organic arrangement of nodes (one per compared Kin)
- Each node shows the seal glyph + name + assigned colour
- Connection lines between nodes, colour-coded by relationship type
- Click/tap a connection line to see details

**Relationship Types to Detect and Display:**

#### Oracle Connections (strongest — thick lines)
For each pair of compared Kins, check if either person's seal appears in the other's Oracle Cross:
- **Analog pair** — gold line, label "Analog (Support)" — these two naturally support each other
- **Antipode pair** — red dashed line, label "Antipode (Challenge/Growth)" — these two challenge and strengthen each other
- **Occult Hidden pair** — purple line, label "Occult (Hidden Power)" — deep unconscious connection
- **Guide relationship** — green arrow (directional), label "Guide" — one guides the other

Detection logic for each pair (Person A seal, Person B seal):
```typescript
function findOracleConnection(sealA: number, sealB: number): string | null {
  // Check Analog (pairs that sum to 21, with special pairs)
  const analogPairs: Record<number, number> = {
    1:20, 2:19, 3:7, 4:17, 5:18, 6:9, 7:3, 8:16, 9:6, 10:15,
    11:14, 12:13, 13:12, 14:11, 15:10, 16:8, 17:4, 18:5, 19:2, 20:1
  };
  if (analogPairs[sealA] === sealB) return 'analog';

  // Check Antipode (10 apart)
  if (((sealA - 1 + 10) % 20) + 1 === sealB) return 'antipode';
  if (((sealB - 1 + 10) % 20) + 1 === sealA) return 'antipode';

  // Check Occult (sum to 21)
  if (sealA + sealB === 21) return 'occult';
  // Edge case: 1+20=21 is both analog AND occult — show as analog (stronger)

  return null;
}
```

Also check if Person B's seal is Person A's Guide (depends on A's tone) and vice versa.

#### Shared Family Connections (medium — thinner lines)
- **Same Colour Family** — blue line, label "Same Colour Family ([name])" — shared approach to life
- **Same Earth Family** — brown line, label "Same Earth Family ([name])" — same planetary role
- **Same Wavespell** — silver line, label "Same Wavespell ([name])" — on the same 13-day journey
- **Same Castle** — faint line, label "Same Castle ([name])" — within the same 52-day cycle

#### Frequency Compatibility (shown as badges/overlay, not lines)
Based on the Healing Category frequency mapping:

| Category | Frequency Band | Brainwave |
|----------|---------------|-----------|
| Visionary Healers (Blue seals) | 4–8 Hz | Theta |
| Heart Healers (White seals) | 8–12 Hz | Alpha |
| Activator Healers (Red seals) | 12–30 Hz | Beta |
| Wisdom Healers (Yellow seals) | 30–100 Hz | Gamma |

Compatibility indicators:
- **Same frequency band** → "Resonant Match" (gold badge) — naturally harmonise
- **Adjacent bands** (e.g. Theta + Alpha) → "Harmonic Bridge" (green badge) — complementary energies
- **Opposite bands** (e.g. Theta + Beta) → "Dynamic Tension" (orange badge) — energising contrast
- **All same band** (3+ people) → "Group Resonance" (special gold glow on all)

Show a small "Group Frequency Profile" summary:
- Bar chart or pie showing how many people in each frequency band
- Recommended group session approach:
  - All same: "Deep resonance session — use [frequency band] instruments throughout"
  - Mixed adjacent: "Harmonic bridge session — layer instruments from [low] to [high]"
  - Mixed opposite: "Dynamic spectrum session — alternate grounding and expansive instruments"
  - Balanced spread: "Full spectrum session — journey through all frequency bands"

### D4. Relationship Summary Panel

Below or beside the web, a text summary:

```
Group Analysis — 3 Kins Compared

🔗 Oracle Connections Found:
• Remi (Night) ↔ Jolanta (Hand) — Analog (Natural Support)
  "These two seals are analog partners — they naturally amplify and support each other's energy."
• Remi (Night) ↔ Client A (Skywalker) — Antipode (Growth Challenge)  
  "These two seals challenge each other — creating productive tension that drives growth."

👥 Shared Families:
• Remi + Jolanta — Same Earth Family: Core (Heart chakra, Transduce)
• All 3 — Same Castle: Blue Western Castle of Burning

🎵 Group Frequency Profile:
• 2× Theta (Blue/Visionary) + 1× Beta (Red/Activator)
• Recommended: Harmonic Bridge session — open with crystal bowls (Theta), 
  build energy with gong (Beta), return to bowls for integration.
```

Each connection description should be meaningful and practitioner-relevant — not just "they share a family" but WHY it matters for a sound healing session.

### D5. Visual Design for Comparison

- Relationship web uses SVG or Canvas — smooth, elegant, animated
- Nodes gently pulse on hover
- Connection lines animate in when comparison is triggered (draw one by one)
- Lines have varying thickness: oracle connections thick, family connections thin
- Hover/click a line to see a tooltip with the relationship description
- The whole thing should feel like a living constellation map
- Warm cream palette consistent with the rest of the app
- Connection line colours:
  - Analog: #d4a017 (gold)
  - Antipode: #c0392b (deep red), dashed
  - Occult: #7d3c98 (purple)
  - Guide: #27ae60 (green), with arrowhead
  - Same Colour Family: #2471a3 (blue), thin
  - Same Earth Family: #8B6914 (brown), thin
  - Same Wavespell: #95a5a6 (silver), thin dotted
  - Same Castle: #bdc3c7 (light grey), thin dotted

---

# PART 4 — INTEGRATION DETAILS

## Highlighted Kins on 260 Matrix

When comparison mode is active, ALL compared Kins should be highlighted on the 260 grid:
- Each compared Kin gets a ring in its assigned colour (gold, teal, coral, violet, sage)
- The rings should be visible enough to spot patterns
- If two compared Kins are in the same column (same seal), show both rings stacked/nested
- Today's Kin (if different from compared Kins) gets a subtle silver ring

## State Management

- Today's Kin: calculated on page load, stored in state
- Client Lookup Kin: stored when calculated
- Comparison Kins: array of up to 5, each with { name, date, kin, seal, tone }
- All sections react to state changes — adding a comparison Kin updates the cards, web, matrix highlights, and summary simultaneously

## Mobile Layout (375px)

- Zone B (Today's Kin): full width, centred
- Zone C (Client Lookup): full width, collapsible
- Zone D1 (Comparison inputs): stacked vertically, full width
- Zone D2 (Side-by-side cards): horizontal scroll container
- Zone D3 (Relationship web): full width, but simplified — nodes in a column with connection lines as a list instead of circular web if viewport < 640px
- Zone D4 (Summary): full width text
- Zone E (260 Matrix): horizontal scroll, sticky row/column headers

## Animations

- Today's Kin card: subtle fade-in on load
- Client Kin: slide-in from below when calculated
- Comparison cards: stagger-animate in left to right
- Relationship web connections: draw in one by one with 200ms delay between each
- Phase cards: all visible by default, active phase gently pulses
- Section collapse/expand: smooth height transition 300ms ease

---

# EXECUTION ORDER

1. **READ** the entire codebase + Kornblum books in DeepWhisper folder
2. **FIX Bug 1** — Tone dot-and-bar icons (all 13 tones)
3. **FIX Bug 2** — 260 grid colours (column-based, not kin-based)
4. **FIX Bug 3** — Phase of Mastery cards (all 5 populated)
5. **FIX Bug 4** — Full Dreamspell logic audit (Kin calc, Oracle Cross, Wavespell, Castle, Earth Family)
6. **RESTRUCTURE** — Dashboard-first layout (today's Kin auto-loads as hero)
7. **BUILD** — Client Lookup section (inline date input within dashboard)
8. **BUILD** — Multi-Kin Comparison inputs (up to 5 entries)
9. **BUILD** — Side-by-side comparison cards
10. **BUILD** — Relationship web visualisation (SVG/Canvas)
11. **BUILD** — Relationship detection logic (oracle, families, frequency)
12. **BUILD** — Group Frequency Profile + session recommendation
13. **BUILD** — Relationship summary panel
14. **INTEGRATE** — Multi-highlight on 260 matrix
15. **TEST** — Verify June 15, 1981 = Kin 243 Blue Cosmic Night
16. **TEST** — Verify all tone icons (1-13)
17. **TEST** — Verify grid colours (solid columns)
18. **TEST** — Verify all 5 phase cards have content
19. **TEST** — Verify Oracle Cross for Kin 243
20. **TEST** — Verify comparison between Kin 243 (Night) and Kin 87 (Blue Solar Hand) shows Analog connection
21. **TEST** — Mobile layout at 375px
22. **BUILD** — `npm run build` must succeed with zero errors
23. **VERIFY** — `npm run dev` — visually confirm everything works

Do NOT skip any step. Do NOT declare done until ALL bugs are fixed, the dashboard loads today's Kin on open, and the comparison feature works with relationship detection.
