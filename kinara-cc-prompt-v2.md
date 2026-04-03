# Kinara — Standalone Tzolkin Calculator App (tzolkin.app)

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag where relevant.

## Thinking Level: ultrathink

---

## Overview

Build a standalone Tzolkin / Dreamspell calculator web app from scratch. This is a **fresh project** — NOT connected to DeepWhisper. Domain: `tzolkin.app`. App name: **Kinara**.

The app calculates a user's Galactic Signature (Kin) from their birth date and presents it as an immersive, beautifully designed experience. Target audience: sound healers, holistic practitioners, and anyone curious about the Dreamspell system. Quality reference: astrara.app, lunata.app, sonarus.app.

---

## Tech Stack

- Next.js 14+ App Router
- TypeScript strict mode
- Tailwind CSS (extend config with custom cream/cosmic palette)
- All logic client-side — no external API calls
- Plausible analytics script tag (commented out, ready to enable)
- Hidden `/promo` route (empty placeholder)
- Hidden `/sell` route (empty placeholder)
- EN/LT language support (i18n-ready, English default)
- Git push pattern: `git push origin master:main`

---

## App Sections

The app is a single-page experience with 5 sections that flow vertically. No tabs, no routing — just smooth scroll.

### Section 1 — Hero / Birth Date Input

Full-viewport hero with cosmic background (dark, starfield or subtle sacred geometry pattern). Centred content:

- App name "Kinara" in elegant serif or display font
- Tagline: "Discover Your Galactic Signature"
- Birth date input — three dropdowns (Day, Month, Year) styled as minimal pill selectors
  - Day: 1–31
  - Month: January–December (names, not numbers)
  - Year: 1920–2030
  - **Important**: Do NOT use `<input type="date">` — use three separate `<select>` elements for maximum cross-browser/cross-device compatibility
- "Reveal My Kin" button — triggers calculation and smooth-scrolls to Section 2
- Subtle animated element (floating particles, pulsing glyph outline, or rotating Tzolkin ring)

### Section 2 — Profile Card (Kin Result)

Large, visually stunning card showing the user's Galactic Signature:

- **Kin number** — large display (e.g. "Kin 243")
- **Full name** — e.g. "Blue Cosmic Night"
- **Seal glyph** — PNG icon from `/public/glyphs/` directory, displayed prominently (80–100px)
- **Tone symbol** — dot-and-bar notation rendered as SVG or CSS (1 = one dot, 5 = one bar, 6 = one bar + one dot, etc.)
- **Seal colour** — card background or accent uses the Dreamspell colour: Red, White, Blue, Yellow
- **Tone number and name** — e.g. "Tone 13 · Cosmic"
- **Tone keywords** — e.g. "Endure · Transcend · Presence"
- **Seal keywords** — e.g. "Dream · Intuition · Abundance"
- **Galactic Affirmation** — the "I [tone action] in order to [seal action]..." declaration
- **Colour family badge** — Red / White / Blue / Yellow with colour dot

The card should feel premium — subtle gradients, soft shadows, the seal's Dreamspell colour as the dominant accent.

### Section 3 — Tzolkin Matrix (260-Kin Grid)

A 20×13 grid (20 seals across × 13 tones down) showing all 260 Kins:

- Each cell shows the Kin number
- Cells are colour-coded by seal colour (Red, White, Blue, Yellow)
- The user's calculated Kin is **highlighted with a golden glow/ring**
- Hovering/tapping a cell shows a tooltip with the Kin name
- The matrix should be horizontally scrollable on mobile if needed, or use a compact layout
- Column headers: 20 seal glyph icons (small, ~20px)
- Row headers: 13 tone numbers with dot-and-bar symbols

### Section 4 — Healing Category

Map each of the 20 solar seals to a healing category and frequency recommendation. This is the sound healing differentiator.

Display the user's seal with:

- **Healing category** — which of the 5 Earth Families the seal belongs to (Polar, Cardinal, Core, Signal, Gateway)
- **Colour family** — Red (initiates), White (refines), Blue (transforms), Yellow (ripens)
- **Element** — Fire, Air, Water, Earth, Ether (mapped to seal groups)
- **Suggested frequency** — a Solfeggio or harmonic frequency associated with the seal
- **Instrument suggestion** — which sound healing instrument resonates with this seal's energy (crystal bowl note, tuning fork, drum, etc.)

Highlight the user's category and subcategory with a **golden glow**. Show frequency recommendation and instrument suggestions.

### Section 5 — Oracle Cross

The Destiny Oracle — the four kin that form a cross pattern of relationships with the user's Kin:

- **Guide** — determined by tone number and colour family rules
- **Analog** — the complementary seal (seal positions sum to 19)
- **Antipode** — the challenging seal (seal + 10, mod 20)
- **Occult** — the hidden power seal (21 - seal number)

Display as a **cross layout** (Guide top, Analog right, Antipode left, Occult bottom, user's Kin in centre). Each position shows its glyph PNG icon, seal name, and colour.

---

## Kin Calculation Engine (CRITICAL ACCURACY)

This is the most critical component. If the Kin calculation is wrong, the entire app is worthless. Users WILL cross-check against lawoftime.org and the 13:20 Sync app.

### Dreamspell Rules

- The Tzolkin is a 260-day cycle: 20 solar seals × 13 galactic tones
- Kin numbers range from 1 to 260 (never 0)
- Seal index = (Kin - 1) % 20
- Tone index = (Kin - 1) % 13

### The February 29 Rule (CRITICAL)

February 29 is designated **0.0 Hunab Ku** — it has NO Kin number. The Tzolkin count freezes on leap day and resumes the next day. When counting days between a reference date and a target date, every February 29 in that range must be **subtracted**.

### Reference Anchor Points

- July 26, 2013 = Kin 164 (Yellow Galactic Seed year)
- July 26, 1987 = Kin 34 (White Galactic Wizard — Dreamspell count initiation)

### Algorithm Pseudocode

1. Count Gregorian days between reference date and target date
2. Count all February 29 dates in that range
3. `adjustedDays = gregorianDays - leapDaysInRange`
4. `kin = ((referenceKin - 1 + adjustedDays) % 260 + 260) % 260 + 1`
5. Handle negative results (dates before reference) with modular arithmetic

### Oracle Calculation

Each Kin has four oracle relationships determined by its seal position:

- **Guide**: Determined by tone number and colour family rules
- **Analog**: Complementary seal — `(19 - sealIndex) % 20`
- **Antipode**: Challenging seal — `(sealIndex + 10) % 20`
- **Occult**: Hidden power seal — `(19 - sealIndex) % 20` (paired differently — uses the 21 - seal formula for Occult specifically)

### Guide Calculation Rules

The Guide seal depends on the Tone number AND the seal's colour:
- Tone 1, 6, 11 → Guide is the SAME seal
- Tone 2, 7, 12 → Guide is the seal that is +12 positions ahead in the same colour
- Tone 3, 8, 13 → Guide is the seal that is +4 positions ahead in the same colour
- Tone 4, 9 → Guide is the seal that is +16 positions ahead in the same colour
- Tone 5, 10 → Guide is the seal that is +8 positions ahead in the same colour

(Positions are within the 20-seal cycle, mod 20)

### Mandatory Validation

Before considering the build complete, the calculation MUST pass ALL of these test cases (verify against lawoftime.org):

- **June 15, 1981 = Kin 243, Blue Cosmic Night** ← This is the primary validation. If this fails, fix before anything else.
- At least 20 additional dates spanning 1940–2030
- Dates immediately before and after every Feb 29 in that range
- Dec 31 and Jan 1 across leap year boundaries
- July 25 (Day Out of Time) and July 26 (New Year) for multiple years
- The Dreamspell initiation date: July 26, 1987 = Kin 34

Write these as automated tests in a test file and run them. Do not proceed if any test fails.

---

## Data Model

### 20 Solar Seals

```typescript
interface SolarSeal {
  index: number;        // 0-19
  name: string;         // "Dragon", "Wind", "Night", etc.
  colour: "Red" | "White" | "Blue" | "Yellow";
  keywords: string[];   // [action, power, essence]
  earthFamily: "Polar" | "Cardinal" | "Core" | "Signal" | "Gateway";
  element: string;      // "Fire", "Air", "Water", "Earth", "Ether"
  frequency: string;    // Suggested healing frequency
  instrument: string;   // Suggested sound healing instrument
  glyphFile: string;    // e.g. "01_dragon.png"
}
```

Seal order (0-indexed):
0. Red Dragon, 1. White Wind, 2. Blue Night, 3. Yellow Seed, 4. Red Serpent,
5. White Worldbridger, 6. Blue Hand, 7. Yellow Star, 8. Red Moon, 9. White Dog,
10. Blue Monkey, 11. Yellow Human, 12. Red Skywalker, 13. White Wizard, 14. Blue Eagle,
15. Yellow Warrior, 16. Red Earth, 17. White Mirror, 18. Blue Storm, 19. Yellow Sun

### 13 Galactic Tones

```typescript
interface GalacticTone {
  number: number;       // 1-13
  name: string;         // "Magnetic", "Lunar", etc.
  keywords: string[];   // [action, power, essence]
  question: string;     // "What is my purpose?" etc.
  affirmationVerb: string; // "unify", "polarize", etc.
}
```

Tone order:
1. Magnetic (Unify · Attract · Purpose)
2. Lunar (Polarize · Stabilize · Challenge)
3. Electric (Activate · Bond · Service)
4. Self-Existing (Define · Measure · Form)
5. Overtone (Empower · Command · Radiance)
6. Rhythmic (Organize · Balance · Equality)
7. Resonant (Channel · Inspire · Attunement)
8. Galactic (Harmonize · Model · Integrity)
9. Solar (Pulse · Realize · Intention)
10. Planetary (Perfect · Produce · Manifestation)
11. Spectral (Dissolve · Release · Liberation)
12. Crystal (Dedicate · Universalize · Cooperation)
13. Cosmic (Endure · Transcend · Presence)

---

## Healing Frequency Mappings

Map each seal to a sound healing prescription:

| Seal | Frequency | Instrument | Chakra/Body Area |
|------|-----------|------------|------------------|
| Dragon | 396 Hz | Gong | Root |
| Wind | 741 Hz | AirDidge/Didgeridoo | Throat |
| Night | 528 Hz | Crystal Singing Bowl (C) | Third Eye |
| Seed | 639 Hz | Tuning Fork | Heart |
| Serpent | 396 Hz | Frame Drum | Root/Sacral |
| Worldbridger | 852 Hz | Tibetan Singing Bowl | Crown |
| Hand | 528 Hz | Monochord (KOTAMO) | Solar Plexus |
| Star | 963 Hz | Crystal Singing Bowl (B) | Crown |
| Moon | 417 Hz | Ocean Drum | Sacral |
| Dog | 639 Hz | Crystal Singing Bowl (F) | Heart |
| Monkey | 741 Hz | Chimes/Bells | Throat |
| Human | 852 Hz | Overtone Singing | Third Eye |
| Skywalker | 963 Hz | Gong | Crown |
| Wizard | 528 Hz | Crystal Singing Bowl (E) | Solar Plexus |
| Eagle | 852 Hz | Tibetan Singing Bowl | Third Eye |
| Warrior | 396 Hz | Frame Drum | Root |
| Earth | 432 Hz | Monochord (KOTAMO) | Heart |
| Mirror | 741 Hz | Crystal Singing Bowl (G) | Throat |
| Storm | 417 Hz | Thunder Drum / Gong | Sacral |
| Sun | 963 Hz | Crystal Singing Bowl (B) | Crown |

These are practitioner-facing recommendations. Display them in a way that's useful for someone who owns these instruments.

---

## File Structure

```
tzolkin.app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── promo/
│   │   └── page.tsx          (empty placeholder)
│   └── sell/
│       └── page.tsx          (empty placeholder)
├── components/
│   ├── Hero.tsx              (Section 1 — date input + CTA)
│   ├── ProfileCard.tsx       (Section 2 — Kin result card)
│   ├── TzolkinMatrix.tsx     (Section 3 — 260-Kin grid)
│   ├── HealingCategory.tsx   (Section 4 — frequency/instrument mapping)
│   ├── OracleCross.tsx       (Section 5 — destiny oracle cross layout)
│   ├── GlyphIcon.tsx         (reusable seal glyph image component)
│   ├── ToneSymbol.tsx        (dot-and-bar tone renderer)
│   └── Footer.tsx            (minimal footer with Harmonic Waves link)
├── lib/
│   ├── dreamspell-data.ts    (seal + tone data arrays)
│   ├── dreamspell-calc.ts    (Kin calculation + oracle engine)
│   └── healing-mappings.ts   (frequency/instrument/chakra data)
├── public/
│   └── glyphs/
│       ├── 00_dragon.png
│       ├── 01_wind.png
│       ├── 02_night.png
│       ├── ... (all 20 seal glyphs)
│       └── 19_sun.png
├── __tests__/
│   └── dreamspell-calc.test.ts  (mandatory validation suite)
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
└── package.json
```

---

## Visual Design Guidelines

- **Dark cosmic theme** — deep navy/black (#080812 to #0a0a1a) with cream text (#e8e6df)
- **Seal colours** as accents: Red (#e74c3c), White (#e8e6df), Blue (#3498db), Yellow (#f1c40f)
- **Golden glow** for highlights and user's Kin — `box-shadow: 0 0 20px rgba(218, 165, 32, 0.4)`
- **Typography**: System font stack or Inter/DM Sans for body, serif accent for headings
- **No scrollbars** — hide all scrollbars with CSS (`scrollbar-width: none`, `::-webkit-scrollbar { display: none }`)
- **Smooth scroll behaviour** — `scroll-behavior: smooth` on html
- **Mobile-first** — everything must work on 375px width
- **Sacred geometry subtle background** — optional Flower of Life or Metatron's Cube as very faint watermark
- **Premium feel** — think astrara.app quality, not generic Bootstrap

---

## Glyph Images

For the initial build, create **placeholder SVG glyphs** for all 20 seals — simple geometric shapes with the seal's colour. The real PNGs will be added manually later by copying from the DeepWhisper project at `C:\Users\rdzingel\Documents\MY_APPS\HARMONIC_WAVES\deepwhisper.app\public\icons\`.

Each placeholder should be a 100×100 SVG with:
- The seal's colour as background circle
- A 2-letter abbreviation centred (DR, WI, NI, SE, SR, WB, HA, ST, MO, DO, MK, HU, SK, WZ, EA, WR, ET, MI, SO, SU)

---

## iOS Safari Compatibility

All date/time inputs must include:
```css
-webkit-appearance: none;
appearance: none;
min-width: 0;
```

Since we're using `<select>` dropdowns instead of `<input type="date">`, this mainly applies to the select elements themselves — ensure they don't overflow on iOS Safari.

---

## Footer

Minimal footer:
- "Part of the Harmonic Waves ecosystem" with link to harmonicwaves.app
- "Built with love for the sound healing community"
- Current year

---

## Run Commands

```bash
cd C:\Users\rdzingel\Documents\MY_APPS\HARMONIC_WAVES
npx create-next-app@latest tzolkin.app --typescript --tailwind --app --yes
cd tzolkin.app
# Install any additional deps if needed
npm run dev
```

After running, verify:
1. Enter June 15, 1981 → Must show **Kin 243, Blue Cosmic Night**
2. Run the full test suite — all tests must pass
3. Check mobile layout at 375px width
4. Verify all 5 sections render and scroll smoothly

---

## Summary

Build a beautiful, accurate, standalone Tzolkin calculator at tzolkin.app. The Kin calculation MUST be correct — verify against lawoftime.org. The design should feel cosmic, premium, and practitioner-friendly. Sound healing frequency mappings are the unique differentiator. Start building now.
