# Kinara — Debug ALL Dreamspell Logic Issues

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag where relevant.

## Thinking Level: gigathink

---

## Context

The Kinara app (tzolkin.app / Dreamspell calculator) has been built but has MULTIPLE critical logic and rendering bugs. You MUST fix ALL of them. This is a Dreamspell / Tzolkin system — accuracy matters deeply.

Before making ANY changes, first:

1. Read the ENTIRE codebase — every component, every data file, every utility
2. Read the Nestor/Anton Kornblum books in the DeepWhisper project folder at `C:\Users\rdzingel\Documents\MY_APPS\HARMONIC_WAVES\deepwhisper.app\` — they are the authoritative Dreamspell reference (PDFs in the project folder)
3. Understand the Dreamspell system rules COMPLETELY before touching any code

---

## BUG 1: Tone Icons Are WRONG

### The Problem

The tone icon displayed next to the seal glyph on the Profile Card is incorrect. For example, Kin 143 (Tone 13 — Cosmic) is showing 3 horizontal lines (≡) instead of the correct dot-and-bar pattern.

### The Correct Dreamspell Dot-and-Bar System

Tones 1–13 use a dot-and-bar numeral system (Mayan vigesimal notation):

- **1 dot** = value of 1
- **1 bar** = value of 5

So the tones render as:

| Tone | Symbol | Description |
|------|--------|-------------|
| 1 | • | 1 dot |
| 2 | •• | 2 dots (side by side) |
| 3 | ••• | 3 dots (side by side) |
| 4 | •••• | 4 dots (side by side) |
| 5 | ━ | 1 bar |
| 6 | ━ + • | 1 bar with 1 dot above |
| 7 | ━ + •• | 1 bar with 2 dots above |
| 8 | ━ + ••• | 1 bar with 3 dots above |
| 9 | ━ + •••• | 1 bar with 4 dots above |
| 10 | ━━ | 2 bars (stacked) |
| 11 | ━━ + • | 2 bars with 1 dot above |
| 12 | ━━ + •• | 2 bars with 2 dots above |
| 13 | ━━ + ••• | 2 bars with 3 dots above |

**CRITICAL RULES:**
- Dots are ALWAYS above bars
- Bars stack vertically (bar on top of bar)
- Dots sit in a horizontal row above the topmost bar
- Maximum 4 dots in a row, maximum 2 bars stacked
- Tone 13 = 2 bars (bottom) + 3 dots (top) — NOT 3 horizontal lines!

### How to Fix

Find the tone icon rendering component/function. It is likely using a simple horizontal-lines approach or mapping to wrong Unicode characters. Replace it with proper SVG or CSS rendering:

```typescript
function getToneSymbol(tone: number): { bars: number; dots: number } {
  const bars = Math.floor(tone / 5);  // 0, 1, or 2 bars
  const dots = tone % 5;              // 0, 1, 2, 3, or 4 dots
  // Special case: tone 5 = 1 bar + 0 dots, tone 10 = 2 bars + 0 dots
  return { bars, dots };
}
```

Then render:
- Each bar as a horizontal rectangle (e.g. 40×6px, rounded corners, brown colour)
- Each dot as a filled circle (e.g. 6px radius)
- Dots in a centered horizontal row at the TOP
- Bars stacked horizontally below the dots, centered
- Gap between dot row and bar stack: ~4px
- Gap between stacked bars: ~4px

### Verification

After fixing, verify ALL 13 tones render correctly:
- Tone 1: 1 dot, 0 bars
- Tone 4: 4 dots, 0 bars
- Tone 5: 0 dots, 1 bar
- Tone 6: 1 dot, 1 bar
- Tone 9: 4 dots, 1 bar
- Tone 10: 0 dots, 2 bars
- Tone 13: 3 dots, 2 bars

Check the tone icon appears correctly on:
- The Profile Card (Section 2)
- The 260 grid row headers (Section 3)
- Anywhere else tones are displayed

---

## BUG 2: 260 Tzolkin Grid Colours Are WRONG

### The Problem

The 260-Kin grid has colours mixed up within each column. Currently showing cells like red, then white, then blue, then yellow next to each other within the same column. This is completely wrong.

### The Correct Colour Logic

In the Dreamspell system, **colour is determined by the SEAL (column), NOT by the Kin number or tone.** Each of the 20 solar seals has a FIXED colour that NEVER changes:

| Column | Seal # | Seal Name | Colour |
|--------|--------|-----------|--------|
| 1 | 1 | Red Dragon | RED |
| 2 | 2 | White Wind | WHITE |
| 3 | 3 | Blue Night | BLUE |
| 4 | 4 | Yellow Seed | YELLOW |
| 5 | 5 | Red Serpent | RED |
| 6 | 6 | White Worldbridger | WHITE |
| 7 | 7 | Blue Hand | BLUE |
| 8 | 8 | Yellow Star | YELLOW |
| 9 | 9 | Red Moon | RED |
| 10 | 10 | White Dog | WHITE |
| 11 | 11 | Blue Monkey | BLUE |
| 12 | 12 | Yellow Human | YELLOW |
| 13 | 13 | Red Skywalker | RED |
| 14 | 14 | White Wizard | WHITE |
| 15 | 15 | Blue Eagle | BLUE |
| 16 | 16 | Yellow Warrior | YELLOW |
| 17 | 17 | Red Earth | RED |
| 18 | 18 | White Mirror | WHITE |
| 19 | 19 | Blue Storm | BLUE |
| 20 | 20 | Yellow Sun | YELLOW |

The pattern repeats: **Red, White, Blue, Yellow, Red, White, Blue, Yellow...** across all 20 columns.

### Therefore

- **Every cell in column 1 (Dragon) is RED** — Kin 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 — ALL RED
- **Every cell in column 2 (Wind) is WHITE** — Kin 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26 — ALL WHITE
- **Every cell in column 3 (Night) is BLUE** — Kin 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39 — ALL BLUE
- **Every cell in column 4 (Seed) is YELLOW** — Kin 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52 — ALL YELLOW
- And so on...

**Each ENTIRE column is ONE solid colour.** The grid should visually show clear vertical colour bands: Red | White | Blue | Yellow | Red | White | Blue | Yellow | Red | White | Blue | Yellow | Red | White | Blue | Yellow | Red | White | Blue | Yellow

### The Root Cause (likely)

The bug is almost certainly that the colour is being calculated from `(kinNumber - 1) % 4` or `kinNumber % 4` — which produces a DIAGONAL pattern because Kin numbers increment across columns.

**WRONG**: `colorIndex = (kin - 1) % 4`  
**CORRECT**: `colorIndex = (sealIndex) % 4` where `sealIndex = (kin - 1) % 20`

Or even simpler — since columns ARE seals:
```typescript
// For the grid cell at column `col` (0-indexed, 0-19):
const colorIndex = col % 4; // 0=Red, 1=White, 2=Blue, 3=Yellow
```

### Grid Structure Reminder

The Tzolkin grid fills COLUMN by COLUMN:

```
           Seal 1   Seal 2   Seal 3   Seal 4   ...   Seal 20
           Dragon   Wind     Night    Seed     ...   Sun
           RED      WHITE    BLUE     YELLOW   ...   YELLOW
Tone 1  |  Kin 1  | Kin 14 | Kin 27 | Kin 40 | ... | Kin 247
Tone 2  |  Kin 2  | Kin 15 | Kin 28 | Kin 41 | ... | Kin 248
Tone 3  |  Kin 3  | Kin 16 | Kin 29 | Kin 42 | ... | Kin 249
...
Tone 13 |  Kin 13 | Kin 26 | Kin 39 | Kin 52 | ... | Kin 260
```

Formula: `kinNumber = (col * 13) + row + 1` (where col = 0-19, row = 0-12)

Reverse: given a kinNumber, `sealIndex = (kinNumber - 1) % 20` and `toneIndex = (kinNumber - 1) % 13`

### Colour Values

Use the warm cream palette colours:
```typescript
const sealColors = {
  red:    { bg: 'rgba(192, 57, 43, 0.15)', border: '#c0392b', text: '#c0392b' },
  white:  { bg: 'rgba(127, 140, 141, 0.10)', border: '#bdc3c7', text: '#7f8c8d' },
  blue:   { bg: 'rgba(36, 113, 163, 0.15)', border: '#2471a3', text: '#2471a3' },
  yellow: { bg: 'rgba(212, 160, 23, 0.15)', border: '#d4a017', text: '#d4a017' },
};

// Map column index to colour:
const colorOrder = ['red', 'white', 'blue', 'yellow']; // repeats every 4 columns
const cellColor = sealColors[colorOrder[col % 4]];
```

### Verification

After fixing, visually confirm:
- Column 1 (Dragon): ALL 13 cells are the same red shade
- Column 2 (Wind): ALL 13 cells are the same white/bone shade  
- Column 3 (Night): ALL 13 cells are the same blue shade
- Column 4 (Seed): ALL 13 cells are the same yellow shade
- The pattern repeats cleanly for all 20 columns
- NO diagonal colour pattern exists anywhere
- Kin 143 (Blue Cosmic Night) is in column 3 (Night / BLUE), row 13 (Tone 13) — should be blue with gold highlight ring

---

## BUG 3: Phase of Mastery Cards Are EMPTY

### The Problem

The "Your Phase of Mastery" section shows 5 phase cards, but only Phase 1 has content text. Phases 2–5 are completely empty — just the title with no description.

### The Correct Content for All 5 Phases

The 5 Phases of Self-Mastery come from the Nestor/Anton Kornblum Dreamspell books. Each phase corresponds to a group of 4 seals:

**Phase 1 — Re-awakening** (Seals 1–4: Dragon, Wind, Night, Seed)
Awakening to your true nature and cosmic identity. You are remembering who you truly are — waking up to the codes written in your being.

**Phase 2 — Reconnecting** (Seals 5–8: Serpent, Worldbridger, Hand, Star)
Reconnecting to the web of life, to others, to the Earth, and to Spirit. Building bridges between dimensions of your experience. Learning to feel, touch, and communicate with the deeper fabric of reality.

**Phase 3 — Integrating** (Seals 9–12: Moon, Dog, Monkey, Human)
Integrating all aspects of yourself — the emotional, the playful, the loyal, the free-willed. Bringing together the parts that have been separated. Becoming whole through acceptance of all your expressions.

**Phase 4 — Expanding** (Seals 13–16: Skywalker, Wizard, Eagle, Warrior)
Expanding beyond known boundaries. Exploring new dimensions, reclaiming your timelessness, gaining higher vision, and finding the courage to question everything. The adventurer's phase.

**Phase 5 — Re-generating** (Seals 17–20: Earth, Mirror, Storm, Sun)
Regenerating and completing the cycle. Navigating by synchronicity, reflecting truth without distortion, catalysing transformation, and radiating unconditional light. The mastery of enlightened being.

### Determining the User's Phase

```typescript
function getPhaseOfMastery(sealNumber: number): number {
  // sealNumber is 1-20
  // Phase 1: seals 1-4, Phase 2: seals 5-8, Phase 3: seals 9-12,
  // Phase 4: seals 13-16, Phase 5: seals 17-20
  return Math.ceil(sealNumber / 4); // Returns 1-5
}
```

For Kin 143 (Blue Night = seal 3): Phase = ceil(3/4) = 1 (Re-awakening) ✓

### How to Fix

1. Find the Phase of Mastery component
2. Ensure ALL 5 phases have their description text populated (not just Phase 1)
3. The user's active phase should be visually highlighted (gold border, expanded, or different background)
4. ALL 5 cards should show: Phase number, Phase name, Description text
5. Content can come from the Kornblum books (check the DeepWhisper project's data files) or from the descriptions above

### Verification

- All 5 cards display title AND description text
- For Kin 143 (seal 3 = Night), Phase 1 should be highlighted as the active phase
- Try seal 7 (Hand) → Phase 2 should highlight
- Try seal 11 (Monkey) → Phase 3 should highlight
- Try seal 15 (Eagle) → Phase 4 should highlight
- Try seal 19 (Storm) → Phase 5 should highlight

---

## BUG 4: General Audit — Check EVERYTHING Else

While you're fixing the above, do a complete audit of ALL Dreamspell logic in the app:

### 4a. Kin Calculation Accuracy

Verify the core Kin calculation engine:
- June 15, 1981 → **Kin 243, Blue Cosmic Night** (NOT Kin 143 — double-check this)
- July 26, 2025 → Kin 1, Red Magnetic Dragon (Galactic New Year)
- February 28, 2000 → Check against lawoftime.org
- February 29, 2000 → Must use Feb 28 (Dreamspell has no Feb 29)
- March 1, 2000 → Check against lawoftime.org
- December 31, 2025 → Check against lawoftime.org

If ANY of these are wrong, fix the calculation engine.

**Feb 29 rule**: In the Dreamspell system, February 29 does not exist. Anyone born on Feb 29 uses Feb 28. The Kin count skips Feb 29 — Feb 28 and March 1 are consecutive Kins with no gap.

### 4b. Oracle Cross / Destiny Oracle

Verify the Oracle Cross (Guide, Analog, Antipode, Occult Hidden) calculations:

For each Kin, the oracle seals are:
- **Analog**: `(sealNumber + 19) % 20` (or equivalently, `(20 - sealNumber) % 20` — the seal that adds to 20)
  - Dragon(1) ↔ Sun(20), Wind(2) ↔ Storm(19), Night(3) ↔ Hand(7)... etc.
  - Full analog pairs: 1↔20, 2↔19, 3↔7, 4↔17, 5↔18, 6↔9, 8↔16, 10↔15, 11↔14, 12↔13
- **Antipode**: `(sealNumber + 10 - 1) % 20 + 1` (seal 10 positions away)
  - Dragon(1)↔Monkey(11), Wind(2)↔Human(12), Night(3)↔Skywalker(13)... etc.
- **Occult Hidden**: `(21 - sealNumber)` if result is ≤20, else `(21 - sealNumber + 20)`
  - Dragon(1)↔Sun(20), Wind(2)↔Storm(19), Night(3)↔Mirror(18)... etc.
  - Actually: Occult pairs sum to 21: 1+20=21, 2+19=21, 3+18=21, 4+17=21, etc.
- **Guide**: Depends on the TONE. The guide is always the same colour as the Kin's seal. Which same-colour seal guides depends on tone:
  - Tones 1, 6, 11: Guide = SELF (same seal)
  - Tones 2, 7, 12: Guide = same-colour seal that is +12 positions away (mod 20)
  - Tones 3, 8, 13: Guide = same-colour seal that is +4 positions away (mod 20)  
  - Tones 4, 9: Guide = same-colour seal that is +16 positions away (mod 20)
  - Tones 5, 10: Guide = same-colour seal that is +8 positions away (mod 20)

**Verification for Kin 143 (Blue Cosmic Night = Seal 3, Tone 13):**
- Guide: Tone 13 rule → +4 positions → seal (3+4-1)%20+1 = seal 7 = Blue Hand ✓ (same colour: Blue)
- Analog: Night(3) pairs with Hand(7)... wait, check the Kornblum books for the exact analog table
- Antipode: (3+10-1)%20+1 = 13 = Red Skywalker
- Occult: 21-3 = 18 = White Mirror

Cross-reference ALL oracle relationships against the Kornblum books in the DeepWhisper project folder.

### 4c. Wavespell Assignment

Each Kin belongs to a Wavespell (group of 13 consecutive Kins starting from a Tone 1):
```typescript
function getWavespell(kinNumber: number): number {
  return Math.ceil(kinNumber / 13); // Wavespell 1-20
}
```

Wavespell 1 = Kins 1–13 (Red Dragon Wavespell)
Wavespell 2 = Kins 14–26 (White Wizard Wavespell)
...etc.

The Wavespell is named after its Tone 1 seal.

### 4d. Castle Assignment

5 Castles of 52 Kins each (4 Wavespells per Castle):
```typescript
function getCastle(kinNumber: number): number {
  return Math.ceil(kinNumber / 52); // Castle 1-5
}
```

- Castle 1: Red Eastern Castle of Turning (Kins 1–52)
- Castle 2: White Northern Castle of Crossing (Kins 53–104)
- Castle 3: Blue Western Castle of Burning (Kins 105–156)
- Castle 4: Yellow Southern Castle of Giving (Kins 157–208)
- Castle 5: Green Central Castle of Enchantment (Kins 209–260)

Kin 143 → Castle 3 (Blue Western Castle of Burning) ✓

### 4e. Earth Family Assignment

5 Earth Families, each containing 4 seals:
- **Polar** (Crown chakra): Sun(20), Dog(10), Eagle(15), Dragon(1) → "Receive"
- **Cardinal** (Throat): Wind(2), Skywalker(13), Warrior(16), Earth(17) → "Transmit"
- **Core** (Heart): Night(3), Hand(7), Human(12), Storm(19) → "Transduce"
- **Signal** (Solar Plexus): Seed(4), Star(8), Wizard(14), Mirror(18) → "Transform"
- **Gateway** (Root): Serpent(5), Worldbridger(6), Moon(9), Monkey(11) → "Transport"

Night (seal 3) = **Core Earth Family** → "Transduce"

### 4f. Colour Family

4 Colour Families, 5 seals each:
- **Red Family — Initiators**: Dragon(1), Serpent(5), Moon(9), Skywalker(13), Earth(17)
- **White Family — Refiners**: Wind(2), Worldbridger(6), Dog(10), Wizard(14), Mirror(18)
- **Blue Family — Transformers**: Night(3), Hand(7), Monkey(11), Eagle(15), Storm(19)
- **Yellow Family — Ripeners**: Seed(4), Star(8), Human(12), Warrior(16), Sun(20)

Night (seal 3) = **Blue Family — Transformers** ✓ (matches the screenshot)

---

## Summary of Required Fixes

1. **Tone icons** — Replace with proper dot-and-bar SVG rendering (dots above bars, following Mayan numeral system)
2. **260 grid colours** — Fix to use seal/column-based colour (R-W-B-Y repeating), NOT kin-number-based
3. **Phase cards** — Populate ALL 5 phases with description content
4. **Full logic audit** — Verify Kin calculation, Oracle Cross, Wavespells, Castles, Earth Families, Colour Families against the Kornblum books

## Execution Order

1. First: READ the entire codebase and ALL Kornblum book data files
2. Fix Bug 1 (tone icons)
3. Fix Bug 2 (grid colours) 
4. Fix Bug 3 (phase cards)
5. Run Bug 4 audit (check all other logic)
6. Run `npm run build` — must succeed with no errors
7. Run `npm run dev` — visually verify all fixes
8. Test with: June 15, 1981 and confirm every section is accurate

Do NOT skip any step. Do NOT declare done until ALL bugs are fixed and verified.
