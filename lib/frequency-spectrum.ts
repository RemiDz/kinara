// ── Healing Category → Gaussian Curve Parameters ─────────────────────────────

export interface CurveParams {
  peakFreq: number;
  sigma: number;
  curveColor: string;
  label: string;
}

const CATEGORY_PARAMS: Record<string, CurveParams> = {
  Blue:   { peakFreq: 6,  sigma: 1.5,  curveColor: '#2471a3', label: 'Visionary' },
  White:  { peakFreq: 10, sigma: 1.5,  curveColor: '#7f8c8d', label: 'Heart' },
  Red:    { peakFreq: 18, sigma: 5,    curveColor: '#c0392b', label: 'Activator' },
  Yellow: { peakFreq: 50, sigma: 15,   curveColor: '#d4a017', label: 'Wisdom' },
};

export function getCurveParams(sealColour: string): CurveParams {
  return CATEGORY_PARAMS[sealColour] ?? CATEGORY_PARAMS.Blue;
}

// ── Gaussian ─────────────────────────────────────────────────────────────────

export function gaussian(freq: number, peak: number, sigma: number): number {
  return Math.exp(-0.5 * Math.pow((freq - peak) / sigma, 2));
}

// ── Non-linear frequency → pixel mapping ─────────────────────────────────────
// Gives more visual space to the 4–12 Hz range where most sound healing sits.

interface FreqSegment { freqStart: number; freqEnd: number; pctStart: number; pctEnd: number }

const SEGMENTS: FreqSegment[] = [
  { freqStart: 0,  freqEnd: 4,   pctStart: 0,    pctEnd: 0.10 },
  { freqStart: 4,  freqEnd: 12,  pctStart: 0.10, pctEnd: 0.45 },
  { freqStart: 12, freqEnd: 30,  pctStart: 0.45, pctEnd: 0.75 },
  { freqStart: 30, freqEnd: 120, pctStart: 0.75, pctEnd: 1.00 },
];

export function freqToX(freq: number, chartWidth: number): number {
  for (const s of SEGMENTS) {
    if (freq <= s.freqEnd) {
      const t = (freq - s.freqStart) / (s.freqEnd - s.freqStart);
      return (s.pctStart + t * (s.pctEnd - s.pctStart)) * chartWidth;
    }
  }
  return chartWidth;
}

// ── Brainwave Bands ──────────────────────────────────────────────────────────

export interface BrainwaveBand {
  name: string;
  symbol: string;
  freqStart: number;
  freqEnd: number;
  bgColor: string;
}

export const BRAINWAVE_BANDS: BrainwaveBand[] = [
  { name: 'Delta', symbol: 'δ', freqStart: 0.5, freqEnd: 4,   bgColor: 'rgba(100,100,100,0.06)' },
  { name: 'Theta', symbol: 'θ', freqStart: 4,   freqEnd: 8,   bgColor: 'rgba(36,113,163,0.08)' },
  { name: 'Alpha', symbol: 'α', freqStart: 8,   freqEnd: 12,  bgColor: 'rgba(127,140,141,0.08)' },
  { name: 'Beta',  symbol: 'β', freqStart: 12,  freqEnd: 30,  bgColor: 'rgba(192,57,43,0.08)' },
  { name: 'Gamma', symbol: 'γ', freqStart: 30,  freqEnd: 100, bgColor: 'rgba(212,160,23,0.08)' },
];

// ── Solfeggio Sub-Harmonic Markers ───────────────────────────────────────────

export interface SolfeggioMarker {
  original: number;
  subHarmonic: number;
  label: string;
  meaning: string;
}

export const SOLFEGGIO_MARKERS: SolfeggioMarker[] = [
  { original: 396, subHarmonic: 6.19,  label: '396÷', meaning: '396 Hz — Liberation, releasing fear' },
  { original: 528, subHarmonic: 8.25,  label: '528÷', meaning: '528 Hz — Transformation, DNA repair' },
  { original: 639, subHarmonic: 9.98,  label: '639÷', meaning: '639 Hz — Connection, relationships' },
  { original: 741, subHarmonic: 11.58, label: '741÷', meaning: '741 Hz — Expression, intuition' },
];

// ── Instrument Markers ───────────────────────────────────────────────────────

export interface InstrumentMarker {
  name: string;
  short: string;
  freqStart: number;
  freqEnd: number;
  freqMid: number;
}

export const INSTRUMENT_MARKERS: InstrumentMarker[] = [
  { name: 'KOTAMO Monochord', short: 'MC', freqStart: 4,  freqEnd: 8,  freqMid: 6 },
  { name: 'Crystal Bowls',    short: 'CB', freqStart: 6,  freqEnd: 12, freqMid: 9 },
  { name: 'Tibetan Bowls',    short: 'TB', freqStart: 8,  freqEnd: 14, freqMid: 11 },
  { name: 'Gong',             short: 'G',  freqStart: 2,  freqEnd: 20, freqMid: 8 },
  { name: 'Didgeridoo',       short: 'DD', freqStart: 4,  freqEnd: 8,  freqMid: 5 },
];

// ── Curve Generation ─────────────────────────────────────────────────────────

export interface CurvePoint { freq: number; amp: number }

const SAMPLE_COUNT = 250;
const FREQ_MIN = 0;
const FREQ_MAX = 120;

export function sampleCurve(peak: number, sigma: number): CurvePoint[] {
  const pts: CurvePoint[] = [];
  for (let i = 0; i <= SAMPLE_COUNT; i++) {
    const freq = FREQ_MIN + (FREQ_MAX - FREQ_MIN) * (i / SAMPLE_COUNT);
    pts.push({ freq, amp: gaussian(freq, peak, sigma) });
  }
  return pts;
}

export function sampleCombined(people: { peak: number; sigma: number }[]): CurvePoint[] {
  const pts: CurvePoint[] = [];
  for (let i = 0; i <= SAMPLE_COUNT; i++) {
    const freq = FREQ_MIN + (FREQ_MAX - FREQ_MIN) * (i / SAMPLE_COUNT);
    let total = 0;
    for (const p of people) total += gaussian(freq, p.peak, p.sigma);
    pts.push({ freq, amp: total });
  }
  return pts;
}

// ── Peak Detection ───────────────────────────────────────────────────────────

export interface Peak { freq: number; amp: number; band: string }

export function findPeaks(curve: CurvePoint[], threshold = 0.15): Peak[] {
  const peaks: Peak[] = [];
  for (let i = 1; i < curve.length - 1; i++) {
    if (curve[i].amp > curve[i - 1].amp &&
        curve[i].amp > curve[i + 1].amp &&
        curve[i].amp >= threshold) {
      const band = getBandName(curve[i].freq);
      peaks.push({ freq: curve[i].freq, amp: curve[i].amp, band });
    }
  }
  return peaks;
}

function getBandName(freq: number): string {
  for (const b of BRAINWAVE_BANDS) {
    if (freq >= b.freqStart && freq < b.freqEnd) return b.name;
  }
  return freq >= 100 ? 'Gamma' : 'Delta';
}

// ── Band Energy Integration ──────────────────────────────────────────────────

export function integrateBand(curve: CurvePoint[], freqStart: number, freqEnd: number): number {
  let sum = 0;
  for (const pt of curve) {
    if (pt.freq >= freqStart && pt.freq <= freqEnd) sum += pt.amp;
  }
  return sum / curve.length;
}

// ── Assessment ───────────────────────────────────────────────────────────────

export function generateAssessment(peaks: Peak[]): string {
  if (peaks.length === 0) return '';
  if (peaks.length === 1) {
    return `Unified group resonance at ${peaks[0].freq.toFixed(1)} Hz (${peaks[0].band}). Strong coherence — the group naturally gravitates to ${peaks[0].band} states.`;
  }
  if (peaks.length === 2) {
    return `Dual resonance at ${peaks[0].freq.toFixed(1)} Hz (${peaks[0].band}) and ${peaks[1].freq.toFixed(1)} Hz (${peaks[1].band}). Bridge session recommended — weave between ${peaks[0].band} and ${peaks[1].band} instruments.`;
  }
  return `Full spectrum group — energy distributed across ${peaks.length} frequency centres. Journey session recommended — move through all frequency bands progressively.`;
}

// ── Instrument Recommendations ───────────────────────────────────────────────

export interface InstrumentRec {
  band: string;
  instruments: string[];
  role: string;
}

export function getInstrumentRecommendations(curve: CurvePoint[]): InstrumentRec[] {
  const threshold = 0.05;
  const recs: InstrumentRec[] = [];

  if (integrateBand(curve, 4, 8) > threshold) {
    recs.push({ band: 'Theta', instruments: ['KOTAMO Monochord', 'Crystal Singing Bowls', 'Didgeridoo'], role: 'Primary resonance — use as session foundation' });
  }
  if (integrateBand(curve, 8, 12) > threshold) {
    recs.push({ band: 'Alpha', instruments: ['Tibetan Bowls', 'Crystal Singing Bowls', 'Soft Gong'], role: 'Heart opening — use for relational and emotional work' });
  }
  if (integrateBand(curve, 12, 30) > threshold) {
    recs.push({ band: 'Beta', instruments: ['Gongs', 'Didgeridoo', 'Rhythm instruments'], role: 'Activation — use to energise and ground' });
  }
  if (integrateBand(curve, 30, 100) > threshold) {
    recs.push({ band: 'Gamma', instruments: ['High crystal bowls', 'Bells', 'Overtone singing'], role: 'Expansion — use for peak consciousness states' });
  }

  return recs;
}

// ── SVG Path Builder ─────────────────────────────────────────────────────────

export function curveToSvgPath(
  curve: CurvePoint[],
  chartWidth: number,
  chartHeight: number,
  maxAmp: number,
): string {
  if (curve.length === 0) return '';
  const toX = (freq: number) => freqToX(freq, chartWidth);
  const toY = (amp: number) => chartHeight - (amp / maxAmp) * chartHeight;

  let d = `M ${toX(curve[0].freq)} ${toY(curve[0].amp)}`;
  for (let i = 1; i < curve.length; i++) {
    d += ` L ${toX(curve[i].freq)} ${toY(curve[i].amp)}`;
  }
  return d;
}

export function curveToSvgFill(
  curve: CurvePoint[],
  chartWidth: number,
  chartHeight: number,
  maxAmp: number,
): string {
  if (curve.length === 0) return '';
  const path = curveToSvgPath(curve, chartWidth, chartHeight, maxAmp);
  const toX = (freq: number) => freqToX(freq, chartWidth);
  return `${path} L ${toX(curve[curve.length - 1].freq)} ${chartHeight} L ${toX(curve[0].freq)} ${chartHeight} Z`;
}
