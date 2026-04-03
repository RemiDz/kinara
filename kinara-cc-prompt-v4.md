# Kinara — Dreamspell Galactic Signature App (tzolkin.app)

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag where relevant.

## Thinking Level: ultrathink

---

## STEP 0 — STUDY DEEPWHISPER FIRST (MANDATORY — DO NOT SKIP)

Before writing ANY code, thoroughly read and study the existing DeepWhisper app at:

```
C:\Users\rdzingel\Documents\MY_APPS\HARMONIC_WAVES\deepwhisper.app
```

### 0a. Read the Anton Kornblum Trilogy Books

The DeepWhisper project folder contains PDF books by Anton Kornblum (published by Purple Pages e-Publishing, 2008) — "The Mayan-Galactic Codes" trilogy. These are the **primary content source** for this app. Find them in the project and read them thoroughly:

- **Book 1** — Framework: 13 tones as phases of creation, 20 seals as phases of evolution, the Unified Seal Reference Matrix (Table 8) mapping each seal to colour, mastery phase, transformation phase, qualities, and attributes. The **5 Phases of Self-Mastery** (Re-awakening → Reconnecting → Integrating → Expanding → Re-generating) with triangle geometry symbols.
- **Book 2** ("Chart Your Destiny") — Deep descriptions of each of the 20 solar seals (paragraph-length "Soul Essence" readings) and each of the 13 galactic tones (life-purpose readings). The oracle relationships explained. The tone-to-musical-interval connection and Harmonic Octave concept.
- **Book 3** — All **260 Galactic Prosperity Declarations** — one unique affirmation per Kin following the BE-DO-HAVE structure with guide power. These are the daily affirmation content.

Study these books carefully. They contain the deep knowledge that makes this app meaningful — not just a calculator but a wisdom tool.

### 0b. Study DeepWhisper's Code

The app already has:
- **All 20 seal glyph PNGs** at `deepwhisper.app/public/icons/` (named `1_dragon.png` through `20_sun.png`)
- **Dreamspell calculation logic** — Kin engine, oracle cross calculation, Feb 29 leap day rule
- **Complete data model** with all seal names, keywords, colours, tone names, keywords, affirmations
- **Extracted book content** — 260 declarations, 20 seal descriptions, 13 tone descriptions (check `src/data/` for the `galactic-content.ts` or similar data files)
- **Wavespell, Castle, Earth Family, Colour Family** logic already implemented
- **Sound healing frequency/instrument mappings** per seal and tone
- **5 Phases of Self-Mastery** mapping (seals 1-4 = Re-awakening, 5-8 = Reconnecting, 9-12 = Integrating, 13-16 = Expanding, 17-20 = Re-generating)

### 0c. Copy Assets

```bash
# Copy all 20 seal glyph PNGs
mkdir -p C:\Users\rdzingel\Documents\MY_APPS\HARMONIC_WAVES\tzolkin.app\public\glyphs
cp C:\Users\rdzingel\Documents\MY_APPS\HARMONIC_WAVES\deepwhisper.app\public\icons\* C:\Users\rdzingel\Documents\MY_APPS\HARMONIC_WAVES\tzolkin.app\public\glyphs\
```

### 0d. Port ALL data

Port the complete data model from DeepWhisper — not just the calculation engine, but ALL content:
- All 260 Galactic Prosperity Declarations (Book 3)
- All 20 seal Soul Essence descriptions (Book 2)
- All 13 tone descriptions (Book 2)
- Oracle calculation logic
- Wavespell / Castle / Earth Family / Colour Family mappings
- Sound healing frequency + instrument mappings per seal
- Playing style mappings per tone
- 5 Phases of Self-Mastery mapping

If any of this data is missing from DeepWhisper's codebase, extract it from the Kornblum PDF books in the project folder.

---

## Overview

Build a standalone Dreamspell Galactic Signature web app. This is NOT just a Kin calculator with a grid — it's a **deep personal profile tool** that reveals the full richness of someone's galactic identity across multiple category systems.

When a user enters their birth date, they get a comprehensive, beautifully laid-out profile page showing their unique position across every Dreamspell category: seal, tone, colour family, earth family, wavespell, castle, 5 phases of self-mastery, oracle destiny cross, sound healing prescription, and their personal Galactic Prosperity Declaration.

Think of it like a personality profile — but galactic. Every person's profile is unique because the combination of seal + tone + oracle + wavespell + castle creates a multi-layered identity.

---

## VISUAL DESIGN — LIGHT / CREAM / ANCIENT PALETTE (NOT DARK MODE)

**THIS APP IS BRIGHT MODE ONLY. Absolutely NO dark backgrounds.**

Warm, cream, ancient-parchment-inspired palette. Like opening an ancient Mayan codex — warm, organic, sacred, light.

### Colour Palette

| Role | Hex |
|------|-----|
| Background (primary) | `#F5F0E8` (warm cream/parchment) |
| Background (secondary) | `#EDE7DA` (slightly darker cream) |
| Background (cards) | `#FDFBF7` (soft white) |
| Text (primary) | `#3D2E1E` (deep warm brown) |
| Text (secondary) | `#6B5A47` (medium brown) |
| Text (muted) | `#9B8C7A` (light brown) |
| Accent (gold) | `#C4962C` (warm gold) |
| Accent (gold light) | `#E8D5A3` (soft gold) |
| Border | `#D4C9B8` (warm tan) |
| Highlight glow | `rgba(196, 150, 44, 0.3)` |

### Dreamspell Seal Colours (accent only, NOT full backgrounds)

| Colour | Hex |
|--------|-----|
| Red | `#C4453C` (warm terracotta) |
| White | `#E8E2D6` (bone/off-white) |
| Blue | `#4A7FB5` (dusty lapis) |
| Yellow | `#D4A843` (warm ochre) |

### Typography

- Body: Inter, system-ui, sans-serif — size 16px, line-height 1.6
- Headings: Georgia or Playfair Display (serif) for section titles — ancient codex feel
- Small caps for section labels: `font-variant: small-caps; letter-spacing: 2px`

### Design Rules

- No dark backgrounds anywhere (#080812, #0a0a1a = BANNED)
- No harsh white (#FFFFFF) — always warm to cream
- No black text — always warm brown
- No scrollbars: `scrollbar-width: none`, `::-webkit-scrollbar { display: none }`
- Cards: soft warm shadows `box-shadow: 0 2px 12px rgba(61, 46, 30, 0.08)`, border-radius 16px
- Gold-leaf dividers between sections (thin gold lines, subtle glow)
- Subtle parchment texture via CSS gradients (not image files)
- Mobile-first: must work at 375px width

---

## Tech Stack

- Next.js 14+ App Router
- TypeScript strict mode
- Tailwind CSS (extend config with cream palette above)
- All logic client-side — no API calls
- Plausible analytics (commented out, ready to enable)
- Hidden `/promo` route (empty placeholder)
- Hidden `/sell` route (empty placeholder)
- EN/LT i18n-ready, English default
- Git push pattern: `git push origin master:main`

---

## App Flow

The app has two states: **landing** (before calculation) and **profile** (after calculation). Single page, smooth scroll.

### State 1 — Landing (Hero)

Full-viewport hero on warm cream background. Centred:

- "Kinara" in elegant serif, warm brown
- Tagline: "Discover Your Galactic Signature"
- Birth date input: three `<select>` dropdowns (Day 1–31, Month name, Year 1920–2030)
  - NOT `<input type="date">` — three separate selects
  - iOS fix: `-webkit-appearance: none; appearance: none; min-width: 0;`
  - Styled as minimal pills with gold border on focus
- "Reveal My Kin" button — gold background, brown text
- Subtle background: faint sacred geometry watermark (Flower of Life) at `opacity: 0.04`
- Optional: soft pulsing animation on the button or a slowly rotating Tzolkin ring outline

### State 2 — Full Profile Page (scrollable)

After calculation, the hero collapses and reveals a long, beautifully typeset profile page with the following sections. Each section is visually distinct with gold dividers between them. This is the CORE of the app — not a simple card, but a rich editorial-style profile like a magazine feature.

---

## PROFILE SECTIONS (the heart of the app)

### Section A — Galactic Signature Card

Premium hero card at the top:

- **Seal glyph** — large PNG from `/public/glyphs/` (80–100px)
- **Kin number** — large gold display: "Kin 243"
- **Full name** — "Blue Cosmic Night" in seal's colour
- **Tone dot-and-bar symbol** — SVG/CSS (1 dot = 1, 1 bar = 5, etc.)
- **Tone name + keywords** — "Tone 13 · Cosmic — Endure · Transcend · Presence"
- **Seal keywords** — "Dream · Intuition · Abundance"
- **Colour family badge** — coloured dot + "Blue Family — Transformers"

### Section B — Soul Essence (Seal Description)

2-3 paragraphs from Book 2's seal descriptions — the deep "Soul Essence" reading for their seal. This is NOT a one-liner — it's a rich, meaningful description of what it means to carry this seal energy. Pulled from the DeepWhisper data.

Section heading: "YOUR SOUL ESSENCE" (small caps, muted)

### Section C — Galactic Prosperity Declaration

Their unique declaration from Book 3 (260 unique ones). Displayed as a styled blockquote with left border in the seal's colour. Italic serif text. This is the affirmation they can read aloud as a daily practice.

Section heading: "YOUR GALACTIC DECLARATION" (small caps)

### Section D — The Tone (Creative Phase)

1-2 paragraphs from Book 2's tone descriptions explaining what their tone means — how it shapes and modifies the seal energy. What creative phase are they in?

Section heading: "YOUR CREATIVE TONE" (small caps)

Include tone number, name, and the three keywords (action · power · essence).

### Section E — Oracle Destiny Cross

The four oracle kin displayed as a **visual cross layout**:

```
           [Guide]
              |
  [Antipode] — [USER KIN] — [Analog]
              |
           [Occult]
```

Each position shows: seal glyph PNG, seal name in its colour, tone name, and a 1-2 sentence prose description of what that oracle relationship means.

- **Guide** (top) — who leads you
- **Analog / Support** (right) — who strengthens you
- **Antipode / Challenge** (left) — who stretches you
- **Occult / Hidden Power** (bottom) — your secret strength

Section heading: "YOUR DESTINY ORACLE" (small caps)

### Section F — Colour Family

Which of the four colour families they belong to and what it means:

- **Red** — Initiators. Keynote: Birth. "You begin things. You spark energy into motion."
- **White** — Refiners. Keynote: Death/Release. "You clarify and distil. You strip away the unnecessary."
- **Blue** — Transformers. Keynote: Magic. "You change things. You take what exists and make it new."
- **Yellow** — Ripeners. Keynote: Intelligence. "You bring things to fruition. You mature and harvest."

Show all four families as a row of small cards, with the user's family highlighted with golden glow. Each card: colour dot, family name, keynote, and the 5 seals that belong to it (glyph icons).

Section heading: "YOUR COLOUR FAMILY" (small caps)

### Section G — Earth Family

Which of the five Earth Families they belong to:

1. **Polar** (Dragon, Wind, Night, Seed) — "Receive. You are the input — receiving cosmic information."
2. **Cardinal** (Serpent, Worldbridger, Hand, Star) — "Catalyse. You initiate movement and change."
3. **Core** (Moon, Dog, Monkey, Human) — "Transmit. You process and broadcast energy to others."
4. **Signal** (Skywalker, Wizard, Eagle, Warrior) — "Inform. You carry intelligence and communicate it."
5. **Gateway** (Earth, Mirror, Storm, Sun) — "Open. You are the portal — opening pathways for others."

Same layout: five small cards, user's highlighted with golden glow. Each shows the 4 seals (glyph icons) that belong to it.

Section heading: "YOUR EARTH FAMILY" (small caps)

### Section H — Five Phases of Self-Mastery

From Anton Kornblum's Book 1. Which of the five evolutionary phases their seal belongs to:

1. **Re-awakening** (Seals 1-4: Dragon, Wind, Night, Seed) — "Awakening to your true nature and cosmic identity."
2. **Reconnecting** (Seals 5-8: Serpent, Worldbridger, Hand, Star) — "Reconnecting with the web of life and your place in it."
3. **Integrating** (Seals 9-12: Moon, Dog, Monkey, Human) — "Integrating all aspects of self into wholeness."
4. **Expanding** (Seals 13-16: Skywalker, Wizard, Eagle, Warrior) — "Expanding awareness and expressing it in the world."
5. **Re-generating** (Seals 17-20: Earth, Mirror, Storm, Sun) — "Regenerating and returning wisdom to the source."

Visual: a horizontal 5-step progress indicator showing all phases, with the user's phase highlighted and expanded with a longer description from Book 1.

Section heading: "YOUR PHASE OF MASTERY" (small caps)

### Section I — Wavespell Position

Where the user sits in the 13-day wavespell cycle:

- Wavespell name (the Tone 1 seal that opens the wavespell)
- Position: "Day X of 13"
- Brief description of what this position means in the wavespell journey

Section heading: "YOUR WAVESPELL" (small caps)

### Section J — Castle

Which of the five castles the user's Kin falls in:

1. **Red Eastern Castle of Turning** (Kins 1-52) — "Court of Birth"
2. **White Northern Castle of Crossing** (Kins 53-104) — "Court of Death"
3. **Blue Western Castle of Burning** (Kins 105-156) — "Court of Magic"
4. **Yellow Southern Castle of Giving** (Kins 157-208) — "Court of Intelligence"
5. **Green Central Castle of Enchantment** (Kins 209-260) — "Court of Synchronisation"

Brief description of what this castle means for the user's life path.

Section heading: "YOUR CASTLE" (small caps)

### Section K — Sound Healing Prescription

The unique differentiator. A prose section describing which instruments and techniques align with this seal + tone combination:

**Seal → Instrument Mapping** (use the detailed table from DeepWhisper's data):

| Seal | Instruments | Focus |
|------|------------|-------|
| Dragon | Gong, frame drum | Root, primal energy |
| Wind | Didgeridoo, overtone singing | Throat, breath |
| Night | Crystal bowls (deep), ocean drum | Third eye, dreams |
| Seed | Tuning forks, chimes | Crown, intention |
| Serpent | Monochord (KOTAMO), body drums | Sacral, kundalini |
| Worldbridger | Tibetan singing bowls, bells | Heart, transition |
| Hand | Crystal bowls (hands-on) | Hands, healing |
| Star | Crystal bowls (high), kalimba | Solar plexus, harmony |
| Moon | Ocean drum, rain stick | Sacral, emotions |
| Dog | Singing bowls (warm tones) | Heart, love |
| Monkey | Kalimba, tongue drum | Throat, play |
| Human | Voice/chanting, harmonium | All chakras |
| Skywalker | Didgeridoo, drones | Root to crown |
| Wizard | Crystal + Tibetan bowls (layered) | Third eye |
| Eagle | Flute, high overtones | Third eye, vision |
| Warrior | Frame drum, djembe | Solar plexus, courage |
| Earth | Monochord, grounding tones | Root |
| Mirror | Crystal bowls, silence | Third eye, clarity |
| Storm | Gong (building), thunder drum | All chakras |
| Sun | Crystal bowls (all), full sound bath | Crown |

**Tone → Playing Style** (from DeepWhisper's data):

| Tone | Style |
|------|-------|
| 1 Magnetic | Set intention. Single sustained tone to begin. |
| 2 Lunar | Two contrasting sounds. Explore polarity. |
| 3 Electric | Activate with rhythm. Three-beat patterns. |
| 4 Self-Existing | Structured session. Clear form and timing. |
| 5 Overtone | Build power. Command the space. Crescendo. |
| 6 Rhythmic | Steady pulse. Balance left and right. |
| 7 Resonant | Deep listening. Channel what comes through. |
| 8 Galactic | Harmonise multiple instruments together. |
| 9 Solar | Full expression. Play with intention. |
| 10 Planetary | Perfect the technique. Manifest the sound fully. |
| 11 Spectral | Release. Let notes decay naturally. Don't hold. |
| 12 Crystal | Group healing. Community sound circle. |
| 13 Cosmic | Transcendence. Hold space. Let the silence speak. |

Combine the seal instruments + tone playing style into a flowing 2-3 sentence prescription.

Section heading: "YOUR SOUND HEALING PRESCRIPTION" (small caps)

### Section L — Tzolkin Matrix (compact)

A compact 20×13 grid showing all 260 Kins, colour-coded by seal colour. The user's Kin is highlighted with golden glow. This is a **reference section**, not the main feature — placed at the bottom.

- Cells show Kin number
- Column headers: 20 seal glyph icons (small)
- Row headers: 13 tone numbers
- Tap/hover shows Kin name tooltip
- Horizontally scrollable on mobile

Section heading: "THE TZOLKIN — 260 GALACTIC SIGNATURES" (small caps)

---

## Kin Calculation Engine

**Port the proven logic from DeepWhisper. Do NOT write from scratch.**

Study `deepwhisper.app`'s calculation implementation and adapt it. Key rules:

- 260-day cycle: 20 seals × 13 tones
- Kin 1–260 (never 0)
- Seal index = (Kin - 1) % 20
- Tone index = (Kin - 1) % 13
- **February 29 = 0.0 Hunab Ku** — has NO Kin. Subtract all Feb 29s in the date range.
- Reference: July 26, 2013 = Kin 164; July 26, 1987 = Kin 34
- Oracle: Guide (tone + colour rules), Analog, Antipode, Occult — port the exact functions from DeepWhisper

### Mandatory Validation

**June 15, 1981 = Kin 243, Blue Cosmic Night** — if this fails, fix before anything else.

Write automated tests in `__tests__/dreamspell-calc.test.ts`:
- 20+ dates spanning 1940–2030
- Dates around Feb 29 boundaries
- Dec 31 / Jan 1 across leap years
- July 25 (Day Out of Time) / July 26 (New Year) for multiple years
- July 26, 1987 = Kin 34

All tests must pass before proceeding.

---

## File Structure

```
tzolkin.app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── promo/page.tsx        (empty placeholder)
│   └── sell/page.tsx         (empty placeholder)
├── components/
│   ├── Hero.tsx              (landing — date input + CTA)
│   ├── SignatureCard.tsx      (Section A — main Kin card)
│   ├── SoulEssence.tsx       (Section B — seal description)
│   ├── Declaration.tsx       (Section C — galactic declaration)
│   ├── ToneSection.tsx       (Section D — tone description)
│   ├── OracleCross.tsx       (Section E — destiny oracle cross)
│   ├── ColourFamily.tsx      (Section F — 4 colour families)
│   ├── EarthFamily.tsx       (Section G — 5 earth families)
│   ├── PhasesOfMastery.tsx   (Section H — 5 phases)
│   ├── WavespellPosition.tsx (Section I — wavespell context)
│   ├── CastleSection.tsx     (Section J — castle position)
│   ├── SoundHealing.tsx      (Section K — sonic prescription)
│   ├── TzolkinMatrix.tsx     (Section L — 260-grid reference)
│   ├── GlyphIcon.tsx         (reusable seal image component)
│   ├── ToneSymbol.tsx        (dot-and-bar renderer)
│   └── Footer.tsx
├── lib/
│   ├── dreamspell-calc.ts    (Kin engine + oracle — port from DeepWhisper)
│   ├── dreamspell-data.ts    (seal + tone arrays — port from DeepWhisper)
│   ├── galactic-content.ts   (260 declarations + seal descriptions + tone descriptions — port from DeepWhisper)
│   ├── healing-mappings.ts   (frequency/instrument/chakra/playing style data)
│   └── categories.ts         (colour family, earth family, castle, phases logic)
├── public/
│   └── glyphs/               (20 PNGs copied from deepwhisper.app/public/icons/)
├── __tests__/
│   └── dreamspell-calc.test.ts
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
└── package.json
```

---

## Footer

Minimal, warm cream:
- "Part of the Harmonic Waves ecosystem" → harmonicwaves.app
- "Built with love for the sound healing community"
- Current year

---

## Build Commands

```bash
cd C:\Users\rdzingel\Documents\MY_APPS\HARMONIC_WAVES
npx create-next-app@latest tzolkin.app --typescript --tailwind --app --yes
cd tzolkin.app
npm run dev
```

---

## Verification Checklist

After building, verify ALL of these:

- [ ] **Icons visible** — all 20 seal glyph PNGs load from `/public/glyphs/`
- [ ] **Light cream theme** — NO dark backgrounds anywhere. Warm cream primary.
- [ ] **Kin accuracy** — June 15, 1981 = Kin 243, Blue Cosmic Night
- [ ] **All tests pass** — run the automated test suite
- [ ] **All 12 profile sections render** (A through L) with real content, not placeholders
- [ ] **260 declarations present** — check Kin 1, Kin 143, Kin 260 have unique declaration text
- [ ] **20 seal descriptions present** — check Dragon, Night, Sun have Soul Essence paragraphs
- [ ] **13 tone descriptions present** — check Magnetic, Cosmic have full descriptions
- [ ] **Oracle cross shows 4 oracle kin** with glyph icons and names
- [ ] **Colour Family highlights correctly** — Blue Cosmic Night = Blue family highlighted
- [ ] **Earth Family highlights correctly** — Night = Polar family
- [ ] **Phase of Mastery correct** — Night (seal 3) = Re-awakening phase
- [ ] **Wavespell shows name and position**
- [ ] **Castle correct** — Kin 243 = Green Central Castle
- [ ] **Sound healing prescription** combines seal instrument + tone playing style
- [ ] **Tzolkin matrix renders** with user's Kin highlighted in gold
- [ ] **Mobile 375px** — everything readable, no horizontal overflow
- [ ] **`npm run build` succeeds** with no errors
- [ ] **No console errors**

---

## Summary

1. **READ DeepWhisper thoroughly** — codebase AND the Kornblum books in the project folder
2. **COPY icons** from DeepWhisper's `/public/icons/`
3. **PORT all data** — calc engine, 260 declarations, seal descriptions, tone descriptions, oracle, categories, sound healing mappings
4. **BUILD LIGHT CREAM** — warm parchment aesthetic, NOT dark mode
5. **BUILD 12 RICH PROFILE SECTIONS** — this is a deep personal profile tool, not just a calculator with a grid
6. **VERIFY** — Kin 243 = Blue Cosmic Night, all content present, all sections render

Start building now.
