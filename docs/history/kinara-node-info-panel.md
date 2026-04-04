# Feature: Node Click Info Panel — Detailed Connection Breakdown

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

## Thinking Level: ultrathink

---

## What to Build

When a user clicks on a name circle in the 2D comparison wheel, a **sliding info panel** appears on the LEFT side of the wheel showing a detailed breakdown of that person's connections to every other person in the comparison. The panel has a close button to dismiss it.

This panel gives CLEAR, UNAMBIGUOUS information — no Dreamspell jargon without explanation, no vague labels, no mystery about what connects who to whom.

---

## Panel Behaviour

### Open

1. User clicks a node circle (e.g. Remi)
2. The existing highlight/filter activates (connections fade, node glows — keep this)
3. ADDITIONALLY, an info panel slides in from the left side
4. Panel is positioned to the LEFT of the wheel, taking up roughly 320-380px width
5. The wheel shifts slightly right (or shrinks) to make room — OR the panel overlays on top with a semi-transparent backdrop on mobile
6. Panel has smooth slide-in animation (300ms ease-out, `translateX(-100%) → translateX(0)`)

### Close

- Click the ✕ close button in the panel header
- OR click the same node again (deselect)
- OR click a different node (panel updates to show new person's data)
- Panel slides out with reverse animation

### Switch

- Clicking a different node while the panel is open → panel content cross-fades to the new person's data (no slide out/in, just content swap with a 200ms fade)

---

## Panel Content

### Header

```
┌──────────────────────────────────┐
│  ✕                               │
│                                  │
│  [Seal icon 48px]                │
│  Remi                            │
│  Blue Cosmic Night · Kin 143     │
│  Tone 13 · Cosmic                │
│  11 connections                  │
│                                  │
│  ─────────────────────────────── │
```

### Connection list — grouped by person

For EACH other person in the comparison, show a section:

```
│  ─────────────────────────────── │
│                                  │
│  → Edvinas                       │
│    Night · Kin 123               │
│    Score: 24 · ████████████░     │
│                                  │
│    ↔ SAME SEAL                   │
│    Both carry the Night seal.    │
│    You share the same core       │
│    archetype — deep recognition  │
│    and mirrored vision.          │
│                                  │
│    ↔ SAME COLOUR (Blue)          │
│    Both belong to the Blue       │
│    family — transformers who     │
│    work through inner vision.    │
│                                  │
│    ↔ SAME TRIBE (Polar)          │
│    Both in the Polar Earth       │
│    family — receivers who        │
│    channel galactic information. │
│                                  │
│    → REMI'S GUIDE IS EDVINAS     │
│    Edvinas carries Night energy  │
│    in tone 6 — he holds a       │
│    higher-self teaching for      │
│    Remi. Pay attention to what   │
│    wisdom flows from him.        │
│                                  │
│    ↔ SAME CASTLE (Blue #3)       │
│    Both live in the Blue Western │
│    Castle of Burning (Kin        │
│    105-156). Shared season of    │
│    transformation.               │
│                                  │
│    ↔ SAME WAVESPELL              │
│    Both in the same 13-day wave. │
│    Shared creative pulse.        │
│                                  │
│  ─────────────────────────────── │
│                                  │
│  → Mamyte                        │
│    Mirror · Kin 258              │
│    Score: 14 · ██████░░░░░░     │
│                                  │
│    → REMI'S HIDDEN POWER IS      │
│      MAMYTE                      │
│    Mamyte's Mirror energy is     │
│    Remi's secret gift — she      │
│    reveals hidden potential in   │
│    him that stays dormant        │
│    otherwise.                    │
│                                  │
│    (no other connections)        │
│                                  │
│  ─────────────────────────────── │
│                                  │
│  → Nerijus                       │
│    Moon · Kin 209                │
│    Score: 2 · █░░░░░░░░░░░     │
│                                  │
│    ↔ SAME CASTLE (Green #5)      │
│    Both in the Green Central     │
│    Castle. Shared season.        │
│                                  │
│  ─────────────────────────────── │
│                                  │
│  → Azuolas                       │
│    Dragon · Kin 201              │
│    No Dreamspell connections.    │
│    You operate in different      │
│    galactic streams.             │
│                                  │
```

### Key rules for connection descriptions — NO AMBIGUITY

Every connection description must answer THREE questions clearly:

1. **WHAT is the connection?** — Named plainly. Not just "Analog" but "REMI'S ANALOG IS JOLANTA" or "SAME COLOUR FAMILY (Blue)"
2. **WHICH DIRECTION?** — `↔` mutual or `→` one-way, with explicit naming: "Remi's Guide is Edvinas" NOT just "Guide connection"
3. **WHAT DOES IT MEAN?** — 1-2 sentences of plain English explanation. No Dreamspell jargon left unexplained.

### Connection type plain-language templates

Use these templates — fill in the person names and specifics:

**Same Seal:**
```
↔ SAME SEAL
Both carry the {sealName} seal. You share the same core archetype — 
{sealMeaning from books}. Deep recognition, but also shared blind spots.
```

**Analog (mutual):**
```
↔ {nameA}'S BEST FRIEND IS {nameB} (and vice versa)
Your seals ({sealA} and {sealB}) are natural partners in the Dreamspell.
You strengthen each other effortlessly — this is the easiest bond.
```

**Analog (one-way):**
```
→ {nameA}'S BEST FRIEND SEAL IS {nameB}'S SEAL
{nameA}'s {sealA} energy naturally supports {sealB}. {nameB} feels 
uplifted by {nameA}'s presence.
```

**Antipode (mutual):**
```
↔ {nameA} AND {nameB} ARE GROWTH PARTNERS
Your seals ({sealA} and {sealB}) sit opposite each other in the 
Dreamspell. You challenge each other to grow — the friction is the gift.
```

**Antipode (one-way):**
```
→ {nameB} IS {nameA}'S GROWTH CHALLENGE
{nameB}'s {sealB} energy confronts {nameA}'s {sealA} — pushing {nameA}
to face what they avoid.
```

**Hidden Power (mutual):**
```
↔ {nameA} AND {nameB} UNLOCK EACH OTHER'S HIDDEN POTENTIAL
Together you activate abilities that stay dormant alone. This connection 
reveals itself slowly — pay attention to unexpected breakthroughs when 
you're together.
```

**Hidden Power (one-way):**
```
→ {nameB} IS {nameA}'S SECRET GIFT
{nameB}'s {sealB} energy unlocks hidden potential in {nameA} that 
{nameA} doesn't see alone. An unexpected depth.
```

**Guide (one-way — guide is always one-way):**
```
→ {nameB} IS {nameA}'S HIGHER-SELF TEACHER
{nameB} carries a teaching that {nameA} needs for soul growth. 
This is a mentor-student dynamic — {nameA} learns from {nameB}'s 
{sealB} wisdom.
```

**Same Colour Family:**
```
↔ SAME COLOUR FAMILY ({colourName} — {direction})
Both face the same direction: {Red = East/Initiate, White = North/Refine, 
Blue = West/Transform, Yellow = South/Ripen}. You share a fundamental 
approach to life.
```

**Same Earth Family:**
```
↔ SAME TRIBE ({familyName})
Both belong to the {familyName} Earth family — {Polar = receivers, 
Cardinal = initiators, Core = processors, Signal = transmitters, 
Gateway = openers}. You serve the same role in the collective.
```

**Same Wavespell:**
```
↔ SAME 13-DAY CYCLE (Wavespell {number})
Your Kins fall within the same Wavespell — you share the same underlying
creation theme. Different tones, same wave.
```

**Same Castle:**
```
↔ SAME 52-DAY COURT ({castleName})
Both live in the {castleName} Castle ({kinRange}). You share the same 
major life season energy.
```

**VERIFY all descriptions against the Kornblum books:**
```
C:\Users\rdzingel\Documents\MY_APPS\HARMONIC_WAVES\tzolkin.app\books\
```

---

## Sort order within the panel

People are sorted by compatibility score (highest first) — the most connected person appears at the top, the least connected at the bottom. People with zero connections appear last with "No Dreamspell connections."

---

## Panel Styling

```css
.info-panel {
  position: absolute;      /* or fixed on mobile */
  left: 0;
  top: 0;
  width: 360px;
  height: 100%;            /* match wheel container height */
  max-height: 80vh;
  overflow-y: auto;
  background: #f5f0e8;
  border-right: 1px solid #c9b99a;
  border-radius: 0 12px 12px 0;
  padding: 24px 20px;
  box-shadow: 4px 0 20px rgba(44, 26, 14, 0.08);
  z-index: 20;
  
  /* Slide animation */
  transform: translateX(-100%);
  transition: transform 300ms ease-out;
}
.info-panel.open {
  transform: translateX(0);
}

/* Scrollbar — hidden but scrollable */
.info-panel::-webkit-scrollbar { display: none; }
.info-panel { -ms-overflow-style: none; scrollbar-width: none; }
```

### Mobile (< 768px)

On mobile, the panel should be a **bottom sheet** instead of a left panel:
- Slides up from the bottom
- Takes full width
- `max-height: 70vh`
- Rounded top corners
- Drag handle at the top to dismiss
- Semi-transparent backdrop behind it

### Typography inside the panel

- Person name headers: `text-base font-semibold` in warm brown
- Seal/Kin: `text-sm` in muted
- Score: `text-sm font-bold` with score bar
- Connection type headers: `text-xs font-bold uppercase tracking-wide` in the connection type's colour (gold for Analog, red-brown for Antipode, purple for Hidden Power, green for Guide, blue for Colour, brown for Earth, grey for Wavespell/Castle)
- Connection descriptions: `text-sm leading-relaxed` in warm brown
- Dividers between people: thin line `border-t border-[#c9b99a]/30`

### Close button

Top-right of the panel, fixed position within the panel:
```tsx
<button
  onClick={onClose}
  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center
    rounded-full hover:bg-[#ede7d9] transition-colors text-[#6b4c2a] text-lg"
>
  ✕
</button>
```

---

## Integration with existing node click

The existing node click toggle (highlight connections, dim others) stays. The info panel is an ADDITION to that behaviour:

1. Click node → highlight + filter connections (existing) + open info panel (new)
2. Click same node → unhighlight + unfilter (existing) + close info panel (new)
3. Click different node → switch highlight (existing) + update panel content (new)
4. Click ✕ on panel → close panel + also unhighlight/unfilter the node

---

## What NOT to change

- Node click highlight/filter behaviour — keep, add panel on top
- Connection lines — do not touch
- Legend filter — do not touch
- Compatibility cards below — do not touch
- Synastry panel — do not touch
- 3D view — do not touch
- Wavespell — do not touch

## Checklist

- [ ] Clicking any node opens the info panel on the left (desktop) or bottom sheet (mobile)
- [ ] Panel header shows seal icon, person name, full Kin name, tone, connection count
- [ ] Panel lists every other person sorted by compatibility score
- [ ] Each person section shows: name, seal, Kin, score with bar
- [ ] Every connection is described with explicit direction (→ or ↔)
- [ ] Every connection names BOTH people explicitly ("Remi's Guide is Edvinas")
- [ ] Every connection has a 1-2 sentence plain English explanation
- [ ] People with zero connections show "No Dreamspell connections"
- [ ] Panel has a working ✕ close button
- [ ] Clicking a different node updates panel content with cross-fade
- [ ] Clicking the same node closes the panel
- [ ] Panel scrolls for long content (many people)
- [ ] Panel doesn't block the wheel — positioned to the left, not overlapping
- [ ] Mobile: bottom sheet with drag handle
- [ ] Smooth slide-in/out animations
- [ ] Connection type headers use the correct colour per type
- [ ] Descriptions verified against Kornblum books
- [ ] `npm run build` — zero errors
