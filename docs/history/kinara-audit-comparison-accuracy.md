# Deep Audit: Comparison Circle — Verify ALL Oracle Relationships and Connections

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

## Thinking Level: ultrathink

---

## What This Is

A comprehensive accuracy audit of the Comparison circle wheel. Every single connection line between every pair of Kin nodes must be verified against the Dreamspell oracle mathematics. If ANY discrepancy is found, fix it. This is a truth audit — the diagram must be mathematically correct.

---

## Step 1: Build a Verification Script

Create a standalone verification script at `scripts/verify-comparison.ts` (or `.js`). This script must:

### 1a. Implement the Dreamspell oracle formulas from scratch

Do NOT rely on the app's existing calculation code for verification — implement independently so you can cross-check. The oracle relationships for any given Kin are computed as follows:

**Kin number** = 1–260. Each Kin has a **seal** (0–19) and a **tone** (1–13).
- `seal = (kin - 1) % 20`
- `tone = ((kin - 1) % 13) + 1`

**Analog partner:**
- `analogSeal = (20 - seal) % 20` ... NO, this is wrong. Use the correct Dreamspell Analog table:
- The Analog pairs are FIXED symmetric pairs. Look these up from the actual Dreamspell system:
  - Dragon (0) ↔ Mirror (18)
  - Wind (1) ↔ Storm (19)
  - Night (2) ↔ Warrior (16)
  - Seed (3) ↔ Eagle (15)
  - Serpent (4) ↔ Wizard (14)
  - Worldbridger (5) ↔ Skywalker (13)
  - Hand (6) ↔ Human (12)
  - Star (7) ↔ Moon (9)
  - Sun (10) ↔ Dog (11) ... WAIT — do NOT trust these from memory.

**CRITICAL: Look up the ACTUAL oracle relationship tables from the Kornblum books at:**
```
C:\Users\rdzingel\Documents\MY_APPS\HARMONIC_WAVES\tzolkin.app\books\
```
Book 2 ("Chart Your Destiny") has the oracle relationships explained in detail. Also read the app's own calc files (e.g. `dreamspell-calc.ts`, `dreamspell-data.ts`, or similar) to see what's currently implemented.

For a Kin with seal S and tone T:

- **Analog**: Same tone, analog seal partner (fixed symmetric table of 10 pairs)
- **Antipode**: Same tone, antipode seal = `(S + 10) % 20`
- **Occult/Hidden Power**: Tones sum to 14 (occult tone = `14 - T`), seals sum to 19 (occult seal = `(19 - S) % 20`)
- **Guide**: Same tone, guide seal determined by tone-to-guide lookup table:
  - Tone 1, 6, 11 → Guide seal = same as main seal (self-guided)
  - Tone 2, 7, 12 → Guide seal = analog seal
  - Tone 3, 8, 13 → Guide seal = antipode seal
  - Tone 4, 9 → Guide seal = occult seal
  - Tone 5, 10 → Guide seal = ??? (look this up — it may be the chromatic/hidden teacher seal)

**DO NOT GUESS THE FORMULAS.** Read the Kornblum books located at:

```
C:\Users\rdzingel\Documents\MY_APPS\HARMONIC_WAVES\tzolkin.app\books\
  Book 1.pdf
  Book 2.pdf
  Book 3.pdf
```

These are the authoritative source. Also read the app's own calc engine source code AND cross-reference with lawoftime.org. The Guide formula in particular has multiple competing versions online — verify against the Kornblum books as the primary authority, then ensure the app's calc engine matches.

### 1b. Implement the category membership checks

These are NOT oracle relationships — they are grouping categories. Two Kins share a category if they belong to the same group:

**Colour Family** — determined by seal number:
- Red: seals 0, 4, 8, 12, 16 (Dragon, Serpent, Star, Human, Warrior)
- White: seals 1, 5, 9, 13, 17 (Wind, Worldbridger, Moon, Skywalker, Earth)
- Blue: seals 2, 6, 10, 14, 18 (Night, Hand, Dog, Wizard, Mirror)
- Yellow: seals 3, 7, 11, 15, 19 (Seed, Star, Monkey... STOP)

Again — DO NOT trust my enumeration. Read the actual data from the Kornblum books at `C:\Users\rdzingel\Documents\MY_APPS\HARMONIC_WAVES\tzolkin.app\books\` and from the app's own source code. The colour families are: `seal % 4` determines colour (0=Red, 1=White, 2=Blue, 3=Yellow) — OR it might be a fixed table. Verify from the books.

**Earth Family** — 5 families of 4 seals each (Polar, Cardinal, Core, Signal, Gateway). Look up the exact groupings from DeepWhisper's data files.

**Wavespell** — Two Kins share a Wavespell if they fall within the same 13-day cycle. Wavespell number = `Math.floor((kin - 1) / 13)`. There are 20 Wavespells.

**Castle** — Two Kins share a Castle if they fall within the same 52-day period. Castle number = `Math.floor((kin - 1) / 52)`. There are 5 Castles (Red, White, Blue, Yellow, Green).

### 1c. Run verification for ALL profiles in the comparison

Use the 10 profiles currently in the comparison:

| Name | Kin | Seal | Tone |
|---|---|---|---|
| Remi | 143 | Night (2) | Cosmic (13) |
| Jolanta | 148 | Star (7) | Overtone (5) |
| Leja | 70 | Dog (10) | Overtone (5) |
| Azuolas | 201 | Dragon (0) | Rhythmic (6) |
| Rmigijus | 150 | Dog (10) | Magnetic (1) ... VERIFY THIS |
| Mamyte | 258 | Mirror (18) | ... VERIFY |
| Edvinas | 123 | Night (2) | ... VERIFY |
| Valdas | 48 | Star (7) | ... VERIFY |
| Iveta | 79 | Storm (19) | ... VERIFY |
| Nerijus | 209 | Moon (9) | ... VERIFY |

**IMPORTANT:** First verify the seal and tone for each Kin number. I've listed some above but they may be wrong — compute them all fresh from the formulas.

For each PAIR of profiles (that's 45 pairs for 10 people), compute:
1. Is A's Analog = B? Is B's Analog = A? → one-way or mutual?
2. Is A's Antipode = B? Is B's Antipode = A? → one-way or mutual?
3. Is A's Hidden Power = B? Is B's Hidden Power = A? → one-way or mutual?
4. Is A's Guide = B? Is B's Guide = A? → one-way or mutual?
5. Do A and B share Colour Family? (always mutual)
6. Do A and B share Earth Family? (always mutual)
7. Do A and B share Wavespell? (always mutual)
8. Do A and B share Castle? (always mutual)

### 1d. Output a verification report

Print a detailed report:

```
=== COMPARISON CIRCLE VERIFICATION REPORT ===

--- Profile Data ---
Remi: Kin 143, Seal: Night (2), Tone: Cosmic (13)
Jolanta: Kin 148, Seal: Star (7), Tone: Overtone (5)
...

--- Oracle Cross for each profile ---
Remi (Kin 143):
  Analog: Kin ??? (Seal ???, Tone 13)
  Antipode: Kin ??? (Seal ???, Tone 13)
  Hidden Power: Kin ??? (Seal ???, Tone 1)
  Guide: Kin ??? (Seal ???, Tone 13)

Jolanta (Kin 148):
  ...

--- All Connections (45 pairs) ---
Remi ↔ Jolanta:
  ✓ Colour Family: NO (Blue vs Yellow)
  ✓ Earth Family: ... 
  ✓ Wavespell: ...
  ✓ Castle: ...
  ✓ Analog: Remi→Jolanta? NO | Jolanta→Remi? NO
  ✓ Antipode: ...
  ✓ Hidden Power: ...
  ✓ Guide: ...

Remi ↔ Leja:
  ...

--- DISCREPANCIES ---
[List every connection that the app currently draws INCORRECTLY]
[List every connection the app is MISSING]
[List every arrow direction that is WRONG]
```

---

## Step 2: Compare Against What the App Currently Renders

After running the verification script, compare its output against the actual connections drawn in the comparison circle component.

Find the comparison circle rendering code and extract:
- Which pairs have lines drawn between them
- What type each line is (Analog, Antipode, etc.)
- What direction each arrow points

Cross-reference against the verification report. Log every discrepancy.

---

## Step 3: Fix ALL Discrepancies

For every discrepancy found:
1. Fix the connection data/logic in the app
2. If the issue is in the oracle calculation functions, fix those functions (and ensure the fix propagates everywhere those functions are used — profile view, comparison view, etc.)
3. If the issue is in the rendering code (wrong lines drawn), fix the rendering

---

## Step 4: Run the Verification Again Post-Fix

After all fixes, re-run the verification script to confirm zero discrepancies remain.

---

## Deliverables

1. The verification script (keep it in `scripts/` — useful for future audits)
2. The verification report printed to console
3. All code fixes applied
4. A summary of what was wrong and what was fixed

## Checklist

- [ ] Verification script independently computes all oracle relationships
- [ ] Oracle formulas verified against Kornblum books (in `tzolkin.app/books/`) and lawoftime.org
- [ ] All 10 profiles' seal/tone verified
- [ ] All 45 pairs checked for all 8 connection types
- [ ] Arrow directions verified (one-way vs mutual) for every connection
- [ ] All discrepancies documented
- [ ] All discrepancies fixed in the app code
- [ ] Post-fix re-verification passes with zero issues
- [ ] Category memberships (Colour, Earth, Wavespell, Castle) all correct
- [ ] `npm run build` — zero errors
- [ ] `npm run test` — all tests pass
