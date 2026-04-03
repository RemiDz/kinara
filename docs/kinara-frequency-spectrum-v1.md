# Kinara — Add Visual Frequency Spectrum Comparison

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag where relevant.

## Thinking Level: ultrathink

---

## Context

The Kinara app now has a multi-Kin comparison feature (up to 5 people). Each person's seal maps to a Healing Category with a frequency band. This prompt adds a VISUAL frequency spectrum display so the practitioner can literally SEE the frequencies — both individual and combined.

Read the existing codebase first to understand the current comparison feature, healing categories, and frequency mappings before making changes.

---

## What to Build

Add TWO spectrum visualisation panels side by side (stacked on mobile) inside the Kin Comparison section (Zone D), positioned between the relationship web and the summary panel.

### Panel 1 — Individual Frequency Spectrums

A frequency spectrum display showing each compared person's frequency band as a distinct visual layer.

**X-Axis:** Frequency range from 0 Hz to 120 Hz (covers all brainwave bands)
**Y-Axis:** Amplitude / intensity (arbitrary, used for visual height)

**Brainwave Band Regions (background zones):**
Draw subtle coloured background zones across the full width to show the brainwave territories:

| Band | Range | Background Colour | Label |
|------|-------|-------------------|-------|
| Delta | 0.5–4 Hz | rgba(100, 100, 100, 0.06) | δ Delta |
| Theta | 4–8 Hz | rgba(36, 113, 163, 0.08) | θ Theta |
| Alpha | 8–12 Hz | rgba(127, 140, 141, 0.08) | α Alpha |
| Beta | 12–30 Hz | rgba(192, 57, 43, 0.08) | β Beta |
| Gamma | 30–100 Hz | rgba(212, 160, 23, 0.08) | γ Gamma |

Band labels should sit at the top of each zone, small and subtle.

**Per-Person Frequency Curve:**
For each compared person, draw a smooth bell curve (Gaussian) centred on their healing category's peak frequency:

| Healing Category | Colour Family | Peak Centre | Curve Width (σ) | Curve Colour |
|-----------------|---------------|-------------|-----------------|--------------|
| Visionary Healers | Blue seals (Night, Hand, Monkey, Eagle, Storm) | 6 Hz | 1.5 Hz | #2471a3 (blue) |
| Heart Healers | White seals (Wind, Worldbridger, Dog, Wizard, Mirror) | 10 Hz | 1.5 Hz | #7f8c8d (warm grey) |
| Activator Healers | Red seals (Dragon, Serpent, Moon, Skywalker, Earth) | 18 Hz | 5 Hz | #c0392b (red) |
| Wisdom Healers | Yellow seals (Seed, Star, Human, Warrior, Sun) | 50 Hz | 15 Hz | #d4a017 (gold) |

Each person's curve should be:
- Semi-transparent fill (opacity ~0.25) so overlapping curves blend visually
- Solid stroke line on top (opacity ~0.8, 2px)
- Person's assigned comparison colour as a small dot or label at the peak
- Person's name (or "Person 1") as a small label near the peak

If two or more people share the same healing category, their curves stack/overlap perfectly — this is intentional and visually shows "resonance" (the overlapping area becomes more saturated).

**Solfeggio Frequency Markers:**
Add subtle vertical dashed lines at key Solfeggio frequencies that fall within the visible range. Since true Solfeggio frequencies (396 Hz, 528 Hz, etc.) are far above 120 Hz, instead show their SUB-HARMONIC octave reductions that fall within brainwave range:

| Solfeggio | Sub-harmonic in range | Label |
|-----------|-----------------------|-------|
| 396 Hz | 6.19 Hz (÷64) | 396÷ |
| 528 Hz | 8.25 Hz (÷64) | 528÷ |
| 639 Hz | 9.98 Hz (÷64) | 639÷ |
| 741 Hz | 11.58 Hz (÷64) | 741÷ |

These are thin dashed lines in rgba(0,0,0,0.15) with tiny labels above. They help the practitioner see which Solfeggio resonances align with the group's frequencies.

**Instrument Frequency Markers:**
Add small icons or labels at approximate fundamental frequencies for Remi's instrument collection:

| Instrument | Approx. Fundamental Range | Icon/Label |
|-----------|--------------------------|------------|
| KOTAMO Monochord | 4–8 Hz (difference tones) | 🎵 Monochord |
| Crystal Singing Bowls | 6–12 Hz (binaural range) | 🔮 Crystal |
| Tibetan Bowls | 8–14 Hz (binaural range) | 🥣 Tibetan |
| Gongs | 2–20 Hz (infrasonic wash) | ⚫ Gong |
| Didgeridoo/AirDidge | 4–8 Hz (drone fundamental) | 🌬️ Didge |

These sit along the bottom of the spectrum as small markers, showing which instruments naturally serve which frequency zones. This is the sound healing practitioner killer feature — you look at where your group's energy sits, and you see which instruments to reach for.

**Panel Title:** "Individual Frequency Profiles"

---

### Panel 2 — Combined Frequency Spectrum

A second spectrum panel showing the COMBINED/SUMMED frequency profile of the entire group.

**Same X-axis and background zones** as Panel 1 (0–120 Hz, same brainwave regions).

**Combined Curve:**
Sum all individual Gaussian curves into one composite curve. This shows the group's overall energy signature as a single waveform.

```typescript
// For each x-point along the frequency axis:
function combinedAmplitude(freq: number, people: Person[]): number {
  let total = 0;
  for (const person of people) {
    const { peakFreq, sigma } = getHealingCategoryParams(person.sealNumber);
    // Gaussian: amplitude = exp(-0.5 * ((freq - peak) / sigma)^2)
    total += Math.exp(-0.5 * Math.pow((freq - peakFreq) / sigma, 2));
  }
  return total;
}
```

**Rendering:**
- Fill the area under the combined curve with a gradient:
  - Use the dominant healing category colour at the peak
  - Or use a warm gold gradient (#d4a017 → #c8a96e) as a neutral "group energy" colour
- Solid stroke on top (2px, darker shade)
- Show the PEAK frequency as a vertical line with label: "Group Peak: X.X Hz (Band Name)"
- If the combined curve has MULTIPLE peaks (e.g. one person at Theta, another at Beta), show BOTH peaks labelled — this indicates a "split spectrum" group

**Group Energy Assessment (text below the spectrum):**

Analyse the combined curve shape and generate a one-line assessment:

```typescript
// Detect curve shape
const peaks = findPeaks(combinedCurve); // local maxima

if (peaks.length === 1) {
  // Single peak — unified group energy
  assessment = `Unified group resonance at ${peakFreq.toFixed(1)} Hz (${bandName}). 
    Strong coherence — the group naturally gravitates to ${bandName} states.`;
} else if (peaks.length === 2) {
  // Dual peak — bridging energy
  assessment = `Dual resonance at ${peak1.toFixed(1)} Hz (${band1}) and ${peak2.toFixed(1)} Hz (${band2}). 
    Bridge session recommended — weave between ${band1} and ${band2} instruments.`;
} else {
  // Multi-peak — full spectrum
  assessment = `Full spectrum group — energy distributed across ${peaks.length} frequency centres. 
    Journey session recommended — move through all frequency bands progressively.`;
}
```

**Recommended Instruments Section (below assessment):**

Based on where the combined curve has energy, recommend specific instruments from the collection:

```typescript
// Check which brainwave bands have significant energy
const bandEnergy = {
  theta: integrateCurve(4, 8, combinedCurve),
  alpha: integrateCurve(8, 12, combinedCurve),
  beta: integrateCurve(12, 30, combinedCurve),
  gamma: integrateCurve(30, 100, combinedCurve),
};

// Sort bands by energy, recommend instruments for top bands
const recommendations = [];
if (bandEnergy.theta > threshold) {
  recommendations.push({
    band: 'Theta',
    instruments: ['KOTAMO Monochord', 'Crystal Singing Bowls', 'Didgeridoo'],
    role: 'Primary resonance — use as session foundation'
  });
}
if (bandEnergy.alpha > threshold) {
  recommendations.push({
    band: 'Alpha',
    instruments: ['Tibetan Bowls', 'Crystal Singing Bowls', 'Soft Gong'],
    role: 'Heart opening — use for relational and emotional work'
  });
}
if (bandEnergy.beta > threshold) {
  recommendations.push({
    band: 'Beta',
    instruments: ['Gongs', 'Didgeridoo', 'Rhythm instruments'],
    role: 'Activation — use to energise and ground'
  });
}
if (bandEnergy.gamma > threshold) {
  recommendations.push({
    band: 'Gamma',
    instruments: ['High crystal bowls', 'Bells', 'Overtone singing'],
    role: 'Expansion — use for peak consciousness states'
  });
}
```

Display as a clean list with instrument icons and role descriptions.

**Panel Title:** "Combined Group Spectrum"

---

## Layout

### Desktop (≥1024px)
```
┌──────────────────────────────────────────────────┐
│  [Side-by-side Kin Cards — existing]             │
├──────────────────────────────────────────────────┤
│  [Relationship Web — existing]                   │
├────────────────────────┬─────────────────────────┤
│  Individual Frequency  │  Combined Group         │
│  Profiles              │  Spectrum               │
│                        │                         │
│  [spectrum chart]      │  [spectrum chart]       │
│                        │                         │
│  [instrument markers]  │  [peak label]           │
│                        │  [assessment text]      │
│                        │  [instrument recs]      │
├────────────────────────┴─────────────────────────┤
│  [Relationship Summary — existing]               │
└──────────────────────────────────────────────────┘
```

Both panels should be equal width, aligned tops, with matching Y-axis scale so curves are visually comparable at a glance.

### Mobile (<640px)
Stack vertically: Individual Spectrum on top, Combined Spectrum below. Full width each.

---

## Visual Design Details

### Spectrum Panels
- Background: #faf5eb (slightly lighter than page background) with 1px #c9b99a border
- Rounded corners: 12px
- Padding: 20px
- Panel title in small caps, warm brown, above the chart
- Chart area: clean white-ish background (#fefcf7)
- Grid lines: very subtle, rgba(0,0,0,0.05), horizontal only
- Axis labels: 10px, warm grey (#6b4c2a)

### Curves
- Smooth bezier curves (use Canvas quadraticCurveTo or SVG path with smooth interpolation)
- Sample at least 200 points across the frequency range for smoothness
- Semi-transparent fills with solid strokes
- Curves should feel organic and flowing — not jagged or blocky

### Animation
- When comparison is triggered, curves should "grow" upward from the baseline over 600ms with an ease-out timing
- Combined spectrum animates 200ms after individual curves finish
- Peak labels fade in after curves settle
- Instrument markers are static (no animation needed)

### Responsiveness
- Charts should use SVG or Canvas that scales with container width
- Minimum chart height: 200px on mobile, 280px on desktop
- Instrument markers collapse to abbreviations on mobile (MC, CB, TB, G, DD)

---

## Interaction

- **Hover on individual curve** → highlight that person's curve (increase opacity to 0.6, dim others to 0.1), show tooltip with: "Name — Seal Name — Healing Category — Peak: X Hz"
- **Hover on combined spectrum peak** → show tooltip with peak frequency and contributing people
- **Hover on instrument marker** → show tooltip with full instrument name and optimal frequency range
- **Hover on Solfeggio marker** → show tooltip with the full Solfeggio frequency and its meaning (e.g. "528 Hz — Transformation, DNA Repair")

---

## Edge Cases

- **1 person only**: Individual panel shows single curve. Combined panel shows same curve with note "Add more people to see group dynamics."
- **All same category**: Both panels look identical. Assessment says "Perfect unison — the group resonates at a single frequency centre."
- **5 people, all different categories**: Combined curve will be wide and multi-peaked. Assessment says "Full spectrum diversity — a rich palette for a journey session."

---

## Technical Notes

- Use Canvas (preferred for performance with 5 overlapping curves) or SVG
- Compute Gaussian curves in a utility function, not inline in the component
- The frequency-to-pixel mapping should be logarithmic or at least compressed in the higher ranges, since the interesting detail is mostly in 4–30 Hz. Consider a layout like:
  - 0–4 Hz: 10% of chart width (Delta — less detail needed)
  - 4–12 Hz: 35% of chart width (Theta + Alpha — most detail)
  - 12–30 Hz: 30% of chart width (Beta — moderate detail)
  - 30–100 Hz: 25% of chart width (Gamma — compressed)
- This non-linear scaling ensures the Theta/Alpha region (where most sound healing happens) gets the most visual space

---

## Verification

1. Enter 2 people: one Blue seal (Night) and one Red seal (Dragon)
   - Individual panel: two curves in different positions (Theta and Beta)
   - Combined panel: dual-peaked curve
   - Assessment mentions "bridge session"
   - Recommended instruments include both Theta and Beta instruments

2. Enter 3 people: all Blue seals (Night, Hand, Monkey)
   - Individual panel: three overlapping curves in Theta zone (high saturation)
   - Combined panel: single tall peak at ~6 Hz
   - Assessment mentions "unified group resonance"
   - Recommended instruments focus on Theta: Monochord, Crystal bowls, Didge

3. Enter 5 people: one from each colour (Red, White, Blue, Yellow + one repeat)
   - Individual panel: curves spread across spectrum
   - Combined panel: multi-peaked
   - Assessment mentions "full spectrum" or "journey session"

4. Mobile 375px — both panels stack, charts readable, no overflow

5. `npm run build` succeeds with no errors

Start building now.
