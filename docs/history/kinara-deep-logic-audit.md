# Deep Audit: Verify ALL Dreamspell Logic, Connections, and Descriptions

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

## Thinking Level: gigathink

---

## MISSION

The app is showing connection descriptions and category assignments that may be incorrect or misleading. Perform a FULL logic audit of every Dreamspell calculation, every connection determination, and every description shown to the user. Fix ALL errors found.

This audit has THREE layers:
1. **Mathematical verification** — are the formulas correct?
2. **Data verification** — are the outputs correct for every profile?
3. **Description verification** — are the words shown to the user accurate and unambiguous?

---

## LAYER 1: Mathematical Verification

### Read the authority sources FIRST

Before checking any code, read the Kornblum books:
```
C:\Users\rdzingel\Documents\MY_APPS\HARMONIC_WAVES\tzolkin.app\books\
  Book 1.pdf  — Framework, Table 8 (Unified Seal Reference Matrix), 5 Phases, Earth Families
  Book 2.pdf  — Oracle relationships explained, seal descriptions, tone descriptions
  Book 3.pdf  — 260 Declarations
```

Extract and document the DEFINITIVE rules for:

**A) Kin calculation from birth date**
- The Dreamspell Feb 29 exclusion rule
- Reference anchor: July 26, 2013 = Kin 164
- Formula: adjusted days (excluding Feb 29s) mod 260

**B) Seal and Tone from Kin number**
- `seal = (kin - 1) % 20` → seal index 0-19
- `tone = ((kin - 1) % 13) + 1` → tone 1-13
- Document the EXACT seal names for indices 0-19 in order

**C) Oracle Cross formulas**
- **Analog**: fixed symmetric seal pairs — extract the EXACT 10 pairs from the books
- **Antipode**: `(seal + 10) % 20` — verify this against the books
- **Hidden Power (Occult)**: seal = `(19 - seal) % 20`, tone = `14 - tone` — verify
- **Guide**: depends on tone — extract the EXACT tone-to-guide mapping table from the books:
  - Which tones → guide = self?
  - Which tones → guide = analog seal?
  - Which tones → guide = antipode seal?
  - Which tones → guide = occult seal?
  - Which tones → guide = ??? (5th pattern)
- The Guide formula is the one most implementations get WRONG. Triple-check this.

**D) Colour Family**
- `seal % 4` determines colour? Or is it a fixed table?
- 0 = Red, 1 = White, 2 = Blue, 3 = Yellow? Or different order?
- Extract from Book 1 Table 8.

**E) Earth Family**
- 5 families (Polar, Cardinal, Core, Signal, Gateway) each with 4 seals
- Extract the EXACT groupings from Book 1

**F) Wavespell**
- Wavespell number = `Math.floor((kin - 1) / 13)` — 20 Wavespells (0-19)
- Each Wavespell's initiating seal = seal of the Magnetic (tone 1) Kin

**G) Castle**
- Castle number = `Math.floor((kin - 1) / 52)` — 5 Castles (0-4)
- IMPORTANT: Castle is determined by KIN RANGE, NOT by seal colour:
  - Red Eastern Castle: Kin 1-52
  - White Northern Castle: Kin 53-104
  - Blue Western Castle: Kin 105-156
  - Yellow Southern Castle: Kin 157-208
  - Green Central Castle: Kin 209-260
- Jolanta (Kin 148, Yellow Overtone Star) is in the BLUE Castle because Kin 148 falls in 105-156. This is CORRECT — Castle is about Kin position, not seal colour.

**H) 5 Phases of Self-Mastery**
- Which seals belong to which phase? Extract from Book 1.

---

## LAYER 2: Data Verification — Check Every Profile

Create/update the verification script at `scripts/verify-all.ts` (or `.js`).

For EVERY profile currently saveable in the app, independently compute and verify:

### Profiles to verify (at minimum — add any others found in saved data):

| Name | Birth Date | Expected Kin | Seal | Tone |
|---|---|---|---|---|
| Remi | 15 Jun 1981 | 143 | Night (2) | Cosmic (13) |
| Jolanta | 15 Jun 1986 | 148 | Star (7) | Overtone (5) |
| Edvinas | ? | 123 | Night (2) | ? |
| Mamyte | ? | 203 | Night (2) | ? — WAIT: is Mamyte really Night? Screenshot shows "Night · Kin 203". Kin 203: seal = (203-1) % 20 = 202 % 20 = 2 = Night. Tone = (202 % 13) + 1 = 7 + 1 = 8 = Galactic. So Mamyte should be Blue Galactic Night. VERIFY. |
| Tata | ? | 231 | Monkey (10)? VERIFY: (231-1) % 20 = 230 % 20 = 10 = Dog? Or Monkey? CHECK seal index 10. | ? |
| Leja | ? | 70 | Dog (10)? VERIFY | ? |
| Azuolas | ? | 201 | Dragon (0)? VERIFY | ? |
| Rmigijus | ? | 150 | Dog (10)? VERIFY | ? |
| Nerijus | ? | 209 | Moon (9)? VERIFY | ? |
| Iveta | ? | 79 | Storm (19)? VERIFY | ? |
| Janina | ? | 113 | Skywalker (12)? VERIFY | ? |
| Valdas | ? | 48 | Star? VERIFY | ? |

**CRITICAL: Check the seal index-to-name mapping.** The 20 seals in order (index 0-19) should be:
```
0: Dragon
1: Wind
2: Night
3: Seed
4: Serpent
5: Worldbridger
6: Hand
7: Star
8: Moon
9: Dog
10: Monkey
11: Human
12: Skywalker
13: Wizard
14: Eagle
15: Warrior
16: Earth
17: Mirror
18: Storm
19: Sun
```

**VERIFY THIS LIST AGAINST THE BOOKS.** Some implementations swap the order of seals 7-10 or have other errors. If the app's seal list doesn't match the books, THIS is where many downstream errors originate.

For each profile, verify:
- [ ] Kin number correct (from birth date if available)
- [ ] Seal name correct (from Kin)
- [ ] Tone name correct (from Kin)
- [ ] Colour family correct (from seal)
- [ ] Earth family correct (from seal)
- [ ] Wavespell number and name correct (from Kin)
- [ ] Castle number and name correct (from Kin range)
- [ ] Phase of Self-Mastery correct (from seal)
- [ ] Oracle Cross: Analog Kin correct
- [ ] Oracle Cross: Antipode Kin correct
- [ ] Oracle Cross: Hidden Power Kin correct
- [ ] Oracle Cross: Guide Kin correct

---

## LAYER 3: Description Verification

After verifying the data, check every text description shown to the user.

### Check the info panel descriptions

For each connection type, verify the description text is:

**A) Factually correct:**
- "Both belong to the Blue family — West" → Is Blue = West? Verify from books.
- "Both belong to the Core Earth family — processors who transform energy" → Is Night really in the Core family? Verify.
- "Both live in the Blue Castle — Court of Magic" → Is the Blue Castle called "Court of Magic"? Or is it "Court of Burning"? Or another name? Look up the Castle names from the books.
- "Jolanta's Best Friend is Tata" → Is Star's Analog really Monkey? Verify the Analog seal pairs.

**B) Direction is correct:**
- "REMI IS EDVINAS'S HIGHER-SELF TEACHER" → Verify: is Remi actually Edvinas's Guide? Compute Edvinas's Guide seal from the formula. If Edvinas is Kin 123, Night, tone = ((123-1) % 13) + 1 = 122 % 13 + 1 = 5 + 1 = 6 = Rhythmic. What seal is the Guide for tone 6? Look up the tone-to-guide rule.
- Every "→ one-way" description: verify the direction is not reversed

**C) Not misleading:**
- If a description says "SAME SEAL" for two people who are both Night, that's correct
- If a description mentions a Castle colour, make clear it's the Kin-range Castle, not the seal colour (e.g. "You both fall in the Blue Castle — Kin 105 to 156 — the court of transformation" rather than implying it's related to their seal colour)

### Fix misleading Castle descriptions

The Castle descriptions currently say "Both live in the Blue Castle" which can confuse users who think "but Jolanta is Yellow Star, why Blue?" Add clarifying language:

Instead of:
```
↔ SAME 52-DAY COURT (BLUE)
Both live in the Blue Castle — Court of Magic. You share the same major life season energy.
```

Use:
```
↔ SAME 52-DAY COURT
Both Kins fall within the Blue Western Castle (Kin 105-156) — the court of transformation and magic. Castle is determined by Kin number position in the 260-day cycle, not by seal colour.
```

This one-line clarification prevents the most common confusion.

---

## LAYER 4: Fix Everything Found

For every error found in Layers 1-3:

1. Fix the calculation code if formulas are wrong
2. Fix the data files if seal lists or mappings are wrong
3. Fix the description templates if text is inaccurate or misleading
4. Re-run verification after fixes to confirm zero remaining errors

---

## OUTPUT

### Verification Report

Save to `VERIFICATION_REPORT.md` in the project root:

```markdown
# Kinara Verification Report
Date: [today]

## Seal Index Mapping
[List all 20 seals with index, verified against Kornblum books]

## Oracle Formulas
[Document each formula, verified against books]
[Note any discrepancies found between app code and books]

## Profile Verification
[For each profile: all checks with ✓ or ✗]

## Connection Verification
[For each pair with connections: verify each connection type and direction]

## Description Accuracy
[List every description error found and the fix applied]

## Fixes Applied
[List every code change made]
```

---

## Checklist

- [ ] All 20 seal names verified against Kornblum books in exact order
- [ ] Analog pairs verified (all 10 symmetric pairs correct)
- [ ] Antipode formula verified
- [ ] Hidden Power formula verified
- [ ] Guide tone-to-seal mapping verified (the tricky one)
- [ ] Colour family mapping verified
- [ ] Earth family groupings verified
- [ ] Castle names and Kin ranges verified
- [ ] 5 Phases of Self-Mastery seal groupings verified
- [ ] Every profile's Kin, seal, tone independently computed and confirmed
- [ ] Every profile's oracle cross independently computed and confirmed
- [ ] Every profile's category memberships confirmed
- [ ] All connection directions verified for every pair
- [ ] All description texts checked for accuracy
- [ ] Castle descriptions clarified (Kin range, not seal colour)
- [ ] Misleading descriptions rewritten
- [ ] VERIFICATION_REPORT.md saved
- [ ] All fixes applied
- [ ] Post-fix re-verification passes
- [ ] `npm run build` — zero errors
- [ ] `npm run test` — all tests pass
