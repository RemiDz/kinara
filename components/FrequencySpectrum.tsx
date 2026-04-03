'use client';
import { useMemo } from 'react';
import { getCurveParams, BRAINWAVE_BANDS, INSTRUMENT_MARKERS, type CurveParams } from '@/lib/frequency-spectrum';
import { getFrequencyBand } from '@/lib/relationships';
import GlyphIcon from './GlyphIcon';

interface PersonData {
  name: string;
  sealColour: string;
  sealName: string;
  sealIcon: string;
  entryColor: string;
}

interface Props { people: PersonData[] }

const BAND_COLORS: Record<string, { bg: string; fill: string; text: string }> = {
  Theta: { bg: 'rgba(36,113,163,0.10)', fill: '#2471a3', text: 'Theta' },
  Alpha: { bg: 'rgba(127,140,141,0.10)', fill: '#7f8c8d', text: 'Alpha' },
  Beta:  { bg: 'rgba(192,57,43,0.10)',   fill: '#c0392b', text: 'Beta' },
  Gamma: { bg: 'rgba(212,160,23,0.10)',  fill: '#d4a017', text: 'Gamma' },
};

const BANDS = [
  { key: 'Theta', label: 'Theta', sub: '4–8 Hz', colour: 'Blue',   instruments: ['Monochord', 'Crystal Bowls', 'Didgeridoo'] },
  { key: 'Alpha', label: 'Alpha', sub: '8–12 Hz', colour: 'White',  instruments: ['Tibetan Bowls', 'Crystal Bowls', 'Soft Gong'] },
  { key: 'Beta',  label: 'Beta',  sub: '12–30 Hz', colour: 'Red',   instruments: ['Gong', 'Didgeridoo', 'Frame Drum'] },
  { key: 'Gamma', label: 'Gamma', sub: '30–100 Hz', colour: 'Yellow', instruments: ['High Crystal Bowls', 'Bells', 'Overtone Singing'] },
];

export default function FrequencySpectrum({ people }: Props) {
  const personBands = useMemo(() => people.map(p => {
    const freq = getFrequencyBand(p.sealColour);
    const curve = getCurveParams(p.sealColour);
    return { ...p, band: freq.band, bandLabel: freq.label, peak: curve.peakFreq, curveColor: curve.curveColor };
  }), [people]);

  if (people.length === 0) return null;

  // Count people per band
  const bandCounts: Record<string, typeof personBands> = {};
  for (const p of personBands) {
    if (!bandCounts[p.bandLabel]) bandCounts[p.bandLabel] = [];
    bandCounts[p.bandLabel].push(p);
  }

  // Active bands
  const activeBands = BANDS.filter(b => bandCounts[b.key]?.length);
  const allSame = activeBands.length === 1;

  return (
    <div className="bg-parchment-card border border-border rounded-2xl p-5 md:p-6 my-6 shadow-card">
      <p className="section-label mb-5">Frequency Spectrum</p>

      {/* Band meter — each band is a column */}
      <div className="grid grid-cols-4 gap-1 mb-4">
        {BANDS.map(band => {
          const inBand = bandCounts[band.key] || [];
          const isActive = inBand.length > 0;
          const bc = BAND_COLORS[band.key];
          return (
            <div
              key={band.key}
              className={`rounded-xl p-3 text-center transition-all ${isActive ? 'ring-1 ring-gold/40' : ''}`}
              style={{ backgroundColor: isActive ? bc.bg : 'rgba(0,0,0,0.02)' }}
            >
              {/* Band header */}
              <p className={`text-[10px] font-semibold uppercase tracking-wider mb-0.5 ${isActive ? 'text-ink' : 'text-ink-muted/50'}`}>
                {band.label}
              </p>
              <p className={`text-[9px] mb-3 ${isActive ? 'text-ink-muted' : 'text-ink-muted/40'}`}>
                {band.sub}
              </p>

              {/* People in this band */}
              <div className="min-h-[60px] flex flex-col items-center justify-center gap-2">
                {inBand.length > 0 ? inBand.map((p, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${bc.fill}15`, border: `2px solid ${p.entryColor}` }}>
                      <GlyphIcon iconFile={p.sealIcon} sealName={p.sealName} size={20} />
                    </div>
                    <p className="text-[9px] font-semibold mt-1 text-ink truncate max-w-[70px]">{p.name}</p>
                  </div>
                )) : (
                  <div className="w-8 h-8 rounded-full border border-dashed border-ink-muted/20" />
                )}
              </div>

              {/* Instruments */}
              {isActive && (
                <div className="mt-3 pt-2 border-t border-ink-muted/10">
                  {band.instruments.map(inst => (
                    <p key={inst} className="text-[8px] text-ink-muted leading-relaxed">{inst}</p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Group assessment */}
      <div className="bg-parchment-dark/20 rounded-xl p-4 text-center">
        {allSame ? (
          <>
            <p className="text-ink text-xs font-semibold mb-1">Unified Resonance</p>
            <p className="text-ink-secondary text-[11px] leading-relaxed">
              Everyone resonates in <span className="font-semibold">{activeBands[0].label}</span> ({activeBands[0].sub}).
              Deep coherence — use {activeBands[0].instruments.join(', ').toLowerCase()} for a focused session.
            </p>
          </>
        ) : activeBands.length === 2 ? (
          <>
            <p className="text-ink text-xs font-semibold mb-1">Harmonic Bridge</p>
            <p className="text-ink-secondary text-[11px] leading-relaxed">
              Energy spans <span className="font-semibold">{activeBands[0].label}</span> and <span className="font-semibold">{activeBands[1].label}</span>.
              Layer instruments from {activeBands[0].instruments[0].toLowerCase()} to {activeBands[1].instruments[0].toLowerCase()}, building a bridge between the frequencies.
            </p>
          </>
        ) : (
          <>
            <p className="text-ink text-xs font-semibold mb-1">Full Spectrum</p>
            <p className="text-ink-secondary text-[11px] leading-relaxed">
              Energy distributed across {activeBands.length} bands. Journey session recommended — move through each frequency band progressively.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
