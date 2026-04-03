'use client';
import type { KinResult } from '@/lib/dreamspell-calc';
import { getFrequencyBand } from '@/lib/relationships';
import { getCurveParams, gaussian, BRAINWAVE_BANDS } from '@/lib/frequency-spectrum';

interface Props { kinResult: KinResult }

const BAND_DESC: Record<string, string> = {
  Theta: 'Your energy resonates in the Theta brainwave range \u2014 the realm of deep meditation, dreams, and visionary insight. Instruments tuned to this frequency create the deepest resonance with your galactic signature.',
  Alpha: 'Your energy resonates in the Alpha brainwave range \u2014 the bridge between conscious and unconscious, where heart-centred healing flows naturally and emotional balance is restored.',
  Beta: 'Your energy resonates in the Beta brainwave range \u2014 active, grounding, and physically present. Rhythmic sound activates your energy body and anchors transformation in the physical.',
  Gamma: 'Your energy resonates in the Gamma brainwave range \u2014 the highest frequency of consciousness, associated with peak awareness, spiritual insight, and expanded perception.',
};

const BAND_INSTRUMENTS: Record<string, string[]> = {
  Theta: ['KOTAMO Monochord', 'Crystal Singing Bowls', 'Didgeridoo'],
  Alpha: ['Tibetan Bowls', 'Crystal Bowls', 'Soft Gong'],
  Beta:  ['Gong', 'Frame Drum', 'Djembe'],
  Gamma: ['High Crystal Bowls', 'Bells', 'Overtone Singing'],
};

const BAND_HEX: Record<string, string> = {
  Theta: '#2471a3',
  Alpha: '#7f8c8d',
  Beta: '#c0392b',
  Gamma: '#d4a017',
};

export default function FrequencyProfile({ kinResult }: Props) {
  const freq = getFrequencyBand(kinResult.seal.colour);
  const curve = getCurveParams(kinResult.seal.colour);
  const brainwave = BRAINWAVE_BANDS.find(b => b.name === freq.brainwave);
  const color = BAND_HEX[freq.brainwave] || '#C4962C';
  const instruments = BAND_INSTRUMENTS[freq.brainwave] || [];
  const desc = BAND_DESC[freq.brainwave] || '';

  // Mini SVG Gaussian curve
  const W = 260, H = 64, P = 10;
  const cW = W - P * 2, cH = H - P * 2;
  const FMAX = 80;
  const pts: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const f = FMAX * (i / 120);
    const a = gaussian(f, curve.peakFreq, curve.sigma);
    pts.push(`${P + (f / FMAX) * cW},${P + cH - a * cH}`);
  }
  const linePath = 'M ' + pts.join(' L ');
  const fillPath = `${linePath} L ${P + cW},${P + cH} L ${P},${P + cH} Z`;
  const peakX = P + (curve.peakFreq / FMAX) * cW;

  return (
    <section className="py-8 px-6">
      <div className="max-w-lg mx-auto">
        <div className="gold-divider mb-8" />
        <p className="section-label text-center mb-6">Frequency Signature</p>

        <div className="bg-parchment-card border border-border rounded-2xl p-6 md:p-8 shadow-card">
          {/* Band header */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
              style={{ backgroundColor: `${color}15`, color, border: `2px solid ${color}` }}
            >
              {brainwave?.symbol || '\u03B8'}
            </div>
            <div>
              <p className="text-ink text-sm font-semibold">{freq.brainwave} Band</p>
              <p className="text-ink-muted text-xs">{freq.range} &middot; Peak {curve.peakFreq} Hz</p>
            </div>
          </div>

          {/* Healer type */}
          <div className="text-center mb-5">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: `${color}15`, color, border: `1px solid ${color}40` }}
            >
              {freq.healerType}
            </span>
          </div>

          {/* Gaussian curve */}
          <div className="flex justify-center mb-5">
            <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="max-w-full">
              {BRAINWAVE_BANDS.filter(b => b.freqStart < FMAX).map(b => {
                const x1 = P + (b.freqStart / FMAX) * cW;
                const x2 = P + (Math.min(b.freqEnd, FMAX) / FMAX) * cW;
                return (
                  <g key={b.name}>
                    <rect x={x1} y={P} width={x2 - x1} height={cH} fill={b.bgColor} rx={2} />
                    <text x={(x1 + x2) / 2} y={H - 1} textAnchor="middle" fontSize={7} fill="#9B8C7A">{b.symbol}</text>
                  </g>
                );
              })}
              <path d={fillPath} fill={`${color}20`} />
              <path d={linePath} fill="none" stroke={color} strokeWidth={2} />
              <circle cx={peakX} cy={P} r={3} fill={color} />
              <text x={peakX} y={P - 5} textAnchor="middle" fontSize={8} fill={color} fontWeight="bold">
                {curve.peakFreq} Hz
              </text>
            </svg>
          </div>

          {/* Description */}
          <p className="text-ink-secondary text-xs leading-relaxed text-center mb-5">{desc}</p>

          {/* Instruments */}
          <div className="pt-4 border-t border-border">
            <p className="text-ink-muted text-[10px] uppercase tracking-widest text-center mb-3">Resonant Instruments</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {instruments.map(inst => (
                <span
                  key={inst}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: `${color}10`, color }}
                >
                  {inst}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
