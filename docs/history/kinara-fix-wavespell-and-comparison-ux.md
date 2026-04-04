# Fix: Wavespell Journey Redesign + Comparison Profile Add UX

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

## Thinking Level: ultrathink

---

## There are TWO issues to fix.

---

## Issue 1: Wavespell Journey — Complete Visual Redesign

### Problem

The current Wavespell Journey section is visually poor:
- Kin icons are tiny and barely visible
- The vertical list of 13 days provides no meaningful information — just icons and numbers
- There's no context about what each day MEANS in the 13-day creation journey
- It looks like a boring list, not an inspiring sacred journey
- No seal names, no tone names, no keywords — a user looking at this learns NOTHING

### Redesign: Make it a rich, readable 13-step journey map

Replace the vertical icon list with a **proper 13-day journey table/card layout** that tells the story of the Wavespell.

Each of the 13 days should display as a horizontal card/row:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Icon]   Day 1 · Magnetic          Kin 105 · Red Magnetic Serpent     │
│  40×40    Purpose · Attract · Unity                                     │
│           "What is my purpose?"                                         │
│           ♪ Sound: Strike the first note. Set the fundamental tone.    │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  [Icon]   Day 2 · Lunar             Kin 106 · White Lunar Worldbridger│
│  40×40    Challenge · Polarize · Stability                              │
│           "What is my challenge?"                                       │
│           ♪ Sound: Introduce the second voice. Feel the tension.       │
└─────────────────────────────────────────────────────────────────────────┘

...continuing for all 13 days...
```

### Layout per day card

```
┌──────────────────────────────────────────────────────┐
│ [Seal icon]   Day N · Tone Name                      │
│  40×40px      Full Kin name (colour + tone + seal)   │
│               Action · Power · Essence               │
│               "Guiding question for this tone"       │
│               ♪ Practitioner sound guidance (italic) │
└──────────────────────────────────────────────────────┘
```

### Styling per day card

- **Seal icon**: 40×40px — large enough to clearly see the glyph
- **Day number + Tone name**: `text-sm font-semibold` in warm brown
- **Full Kin name**: `text-base font-medium` in the seal's colour (Red/White/Blue/Yellow)
- **Action · Power · Essence**: `text-sm` in muted secondary colour — these are the tone keywords from the Dreamspell system
- **Guiding question**: `text-sm italic` — each tone has a question (Magnetic = "What is my purpose?", Lunar = "What is my challenge?", etc.). Source these from the Kornblum books.
- **Sound guidance**: `text-xs italic` in a muted accent — one line of practitioner-specific advice for sound healing aligned with this tone's energy
- **Today's card**: highlighted with a warm golden background (`bg-[#f0e6c8]` or similar), slightly larger, with a subtle left border accent in gold
- **Past days** (earlier in the Wavespell): slightly muted opacity (`opacity-70`)
- **Future days**: full opacity but no highlight
- **Card spacing**: `gap-2` between cards — tight but readable

### The 13 tone questions (verify against Kornblum books)

These are the classic Dreamspell guiding questions — verify exact wording from the books:

| Tone | Name | Question |
|------|------|----------|
| 1 | Magnetic | What is my purpose? |
| 2 | Lunar | What is my challenge? |
| 3 | Electric | How can I best serve? |
| 4 | Self-Existing | What form will my service take? |
| 5 | Overtone | How can I best empower myself? |
| 6 | Rhythmic | How can I extend my equality to others? |
| 7 | Resonant | How can I attune my service to others? |
| 8 | Galactic | Do I live what I believe? |
| 9 | Solar | How do I attain my purpose? |
| 10 | Planetary | How do I perfect what I do? |
| 11 | Spectral | How do I release and let go? |
| 12 | Crystal | How can I dedicate myself to all that lives? |
| 13 | Cosmic | How can I expand my joy and love? |

**VERIFY these against the Kornblum books.** If the books use different wording, use the book version.

### Sound guidance per tone (practitioner tips)

These should be short, practical sound healing guidance. Examples:

| Tone | Sound Guidance |
|------|---------------|
| 1 | Strike the first note. Set the fundamental tone of intention. |
| 2 | Introduce the second voice. Hold the tension between two tones. |
| 3 | Add the third harmonic. Feel the triad activate. |
| 4 | Build the four-cornered foundation. Steady drone, steady rhythm. |
| 5 | Find the overtone. Let the fifth harmonic sing above the fundamental. |
| 6 | Create rhythmic pulse. Balance left and right, giving and receiving. |
| 7 | Listen for resonance. The bowl that rings longest holds today's truth. |
| 8 | Play in harmony with another. Integrate instrument and voice. |
| 9 | Build to fullness. Let the sound fill every corner of the space. |
| 10 | Manifest the perfect tone. Precision and beauty in every strike. |
| 11 | Strike once and let the note decay naturally. The dissolving IS the practice. |
| 12 | Gather all voices together. Community sound circle. Round singing. |
| 13 | Sound the octave. Return to the beginning, one level higher. Completion. |

Refine these based on what the Kornblum books say about each tone's musical relationship.

### Progress bar improvement

The progress bar at the top of the Wavespell section is fine — keep it. But add day numbers (1-13) below each segment so users can quickly see where in the journey they are.

### Overall section structure

```
┌──────────────────────────────────────────────┐
│           WAVESPELL JOURNEY                   │
│                                               │
│  [Seal icon 48px]  Red Serpent Wavespell     │
│                    Wavespell 9 of 20          │
│                    Blue Castle                │
│                                               │
│  [===========●==] Day 11 of 13 — Spectral   │
│   1  2  3  4  5  6  7  8  9  10 11 12 13    │
│                                               │
│  ┌─ Day 1 card ──────────────────────────┐   │
│  │ ...                                    │   │
│  └────────────────────────────────────────┘   │
│  ┌─ Day 2 card ──────────────────────────┐   │
│  │ ...                                    │   │
│  └────────────────────────────────────────┘   │
│  ...                                          │
│  ┌─ Day 11 card (TODAY — highlighted) ───┐   │
│  │ ...                                    │   │
│  └────────────────────────────────────────┘   │
│  ...                                          │
│  ┌─ Day 13 card ──────────────────────────┐   │
│  │ ...                                    │   │
│  └────────────────────────────────────────┘   │
└──────────────────────────────────────────────┘
```

Auto-scroll to today's card on load so the user immediately sees where they are.

---

## Issue 2: Comparison View — Saved Profiles Should Load Without Clicking +Add Person

### Problem

When a user has saved profiles (from previous comparisons stored in localStorage), they can click saved names to add them to the comparison. But after the 5th profile, the saved name buttons disappear or stop working — the user has to manually click the "+Add Person" button to get a new empty row, then find and re-enter the details.

This is bad UX. If I have 10 family members saved, I should be able to add all 10 with one tap each.

### Fix

**A) Remove the arbitrary limit on saved profile quick-add.**

There should be no cap on how many saved profiles can be added by tapping their name buttons. If 10 profiles are saved, all 10 should be tappable and load instantly.

**B) Tapping a saved profile name should auto-create the row AND populate it.**

The user should NOT have to:
1. Click "+Add Person"
2. Then click the saved name

Instead, just clicking the saved name should:
1. Automatically add a new profile row
2. Populate it with the saved name and date
3. Calculate the Kin
4. Add it to the comparison wheel immediately

**C) Show all saved profiles as a chip/pill row:**

```
┌──────────────────────────────────────────────────┐
│  Saved: [Remi] [Jolanta] [Leja] [Azuolas]       │
│         [Rmigijus] [Mamyte] [Edvinas] [Valdas]  │
│         [Iveta] [Nerijus] [+ Add new]            │
└──────────────────────────────────────────────────┘
```

- Each chip shows the name in their profile colour
- Chips that are ALREADY in the comparison are dimmed/checked (can't add twice)
- Tapping an available chip instantly adds that person
- The "[+ Add new]" chip opens the manual entry form for someone not yet saved
- Chips wrap onto multiple lines if many profiles are saved

**D) "Select All" shortcut:**

If there are more than 3 saved profiles, show a "Select all" link that loads every saved profile into the comparison at once. Family use case — load everyone in one tap.

### What NOT to change

- The comparison wheel rendering — do not touch
- Connection line logic — do not touch
- Profile data structure — do not touch (keep using localStorage)
- The Relationship Synastry feature — it's working great, do NOT touch it

## Checklist

- [ ] Wavespell Journey shows 13 rich day cards with icon (40px), full Kin name, tone keywords, guiding question, and sound guidance
- [ ] Today's card is highlighted with golden background and auto-scrolled into view
- [ ] Past days are slightly muted, future days are full opacity
- [ ] Progress bar has day numbers (1-13) below segments
- [ ] Tone questions verified against Kornblum books
- [ ] All saved profiles appear as tappable chips in comparison view
- [ ] Tapping a saved chip instantly adds that person (no separate "+Add Person" step)
- [ ] Already-added profiles are dimmed/disabled in the chip row
- [ ] "Select all" link available when 4+ profiles saved
- [ ] No limit on number of profiles in comparison (or at minimum support 15+)
- [ ] Comparison wheel renders correctly with 10+ profiles
- [ ] Looks great on desktop and mobile
- [ ] `npm run build` — zero errors
