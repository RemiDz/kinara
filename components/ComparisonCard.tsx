'use client';
import type { KinResult, OracleResult } from '@/lib/dreamspell-calc';
import { SEAL_COLOUR_HEX, SEAL_COLOUR_TEXT } from '@/lib/dreamspell-data';
import { getColourFamily, getEarthFamily, getCastle, getMasteryPhase } from '@/lib/categories';
import { getFrequencyBand, getFrequencyCompatibility, type Connection } from '@/lib/relationships';
import { getCurveParams } from '@/lib/frequency-spectrum';
import GlyphIcon from './GlyphIcon';
import ToneSymbol from './ToneSymbol';

interface PersonEntry {
  name: string;
  kinResult: KinResult;
  oracle: OracleResult;
  color: string;
}

interface Props {
  people: PersonEntry[];
  connections: Connection[];
}

const ZONES = [
  { key: 'theta', name: 'Dream',  sub: '4\u20138 Hz',  accent: '#2471a3', bg: 'rgba(36,113,163,0.08)',  ring: 'rgba(36,113,163,0.3)',  faint: 'rgba(36,113,163,0.12)' },
  { key: 'alpha', name: 'Heart',  sub: '8\u201312 Hz', accent: '#7f8c8d', bg: 'rgba(127,140,141,0.08)', ring: 'rgba(127,140,141,0.3)', faint: 'rgba(127,140,141,0.12)' },
  { key: 'beta',  name: 'Active', sub: '12\u201330 Hz', accent: '#c0392b', bg: 'rgba(192,57,43,0.08)',   ring: 'rgba(192,57,43,0.3)',   faint: 'rgba(192,57,43,0.12)' },
  { key: 'gamma', name: 'Bright', sub: '30+ Hz',       accent: '#d4a017', bg: 'rgba(212,160,23,0.08)',  ring: 'rgba(212,160,23,0.3)',  faint: 'rgba(212,160,23,0.12)' },
];

export default function ComparisonCard({ people, connections }: Props) {
  if (people.length < 2) return null;

  const oracleConns = connections.filter(c => ['analog', 'antipode', 'occult', 'guide'].includes(c.type));
  const familyConns = connections.filter(c => ['colour-family', 'earth-family'].includes(c.type));

  // Frequency analysis
  const freqBands = people.map(p => getFrequencyBand(p.kinResult.seal.colour));
  const uniqueBands = [...new Set(freqBands.map(f => f.label))];
  const allSameBand = uniqueBands.length === 1;

  const sessionRx = allSameBand
    ? `Unified ${uniqueBands[0]} session \u2014 deep, focused resonance work.`
    : uniqueBands.length === 2
    ? `Bridge session \u2014 weave between ${uniqueBands[0]} and ${uniqueBands[1]} instruments.`
    : `Journey session \u2014 move through ${uniqueBands.join(', ')} bands progressively.`;

  const personFreqs = people.map(p => ({
    person: p,
    band: getFrequencyBand(p.kinResult.seal.colour),
    peak: getCurveParams(p.kinResult.seal.colour).peakFreq,
  }));

  const activeIndices = ZONES.map((z, i) => personFreqs.some(pf => pf.band.band === z.key) ? i : -1).filter(i => i >= 0);

  const bridgeInfo = !allSameBand ? (() => {
    for (let i = 0; i < people.length; i++) {
      for (let j = i + 1; j < people.length; j++) {
        if (freqBands[i].band !== freqBands[j].band) {
          return getFrequencyCompatibility(people[i].kinResult.seal.colour, people[j].kinResult.seal.colour);
        }
      }
    }
    return null;
  })() : null;

  // People grid cols — cap at 3 to avoid tiny columns
  const peopleCols = people.length === 2 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <div className="my-8">
      <p className="section-label text-center mb-4">Shareable Reading</p>

      <div
        id="comparison-card"
        className="max-w-xl mx-auto bg-parchment-card rounded-3xl overflow-hidden shadow-golden-lg"
        style={{ border: '1.5px solid rgba(196,150,44,0.25)' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-gold/10 via-gold/20 to-gold/10 px-6 py-4 text-center border-b border-gold/20">
          <p className="font-serif text-xl text-ink tracking-wider">Kinara</p>
          <p className="text-ink-muted text-[10px] uppercase tracking-[3px] mt-0.5">Galactic Relationship Reading</p>
        </div>

        {/* People */}
        <div className="px-6 pt-6 pb-2">
          <div className={`grid gap-4 ${peopleCols}`}>
            {people.map((p, i) => {
              const colourText = SEAL_COLOUR_TEXT[p.kinResult.seal.colour];
              return (
                <div key={i} className="text-center">
                  <div className="flex justify-center mb-2">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ border: `2.5px solid ${SEAL_COLOUR_HEX[p.kinResult.seal.colour]}`, backgroundColor: `${SEAL_COLOUR_HEX[p.kinResult.seal.colour]}10` }}
                    >
                      <GlyphIcon iconFile={p.kinResult.seal.iconFile} sealName={p.kinResult.seal.name} size={40} />
                    </div>
                  </div>
                  <p className="text-ink text-xs font-semibold">{p.name}</p>
                  <p className={`font-serif text-sm font-bold ${colourText}`}>Kin {p.kinResult.kin}</p>
                  <p className="text-ink text-[11px] font-semibold">{p.kinResult.fullName}</p>
                  <div className="flex justify-center mt-1">
                    <ToneSymbol tone={p.kinResult.tone.number} size={20} colour={SEAL_COLOUR_HEX[p.kinResult.seal.colour]} />
                  </div>
                  <p className="text-ink-muted text-[9px] mt-1">{p.kinResult.tone.name}</p>
                  <p className="text-ink-muted text-[8px]">{p.kinResult.seal.action} &middot; {p.kinResult.seal.power} &middot; {p.kinResult.seal.essence}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="px-6"><div className="gold-divider my-4" /></div>

        {/* Oracle Connections */}
        {oracleConns.length > 0 && (
          <div className="px-6 pb-3">
            <p className="text-[9px] uppercase tracking-[2px] text-ink-muted text-center mb-3">Oracle Connections</p>
            {oracleConns.map((c, i) => (
              <div key={i} className="flex items-start gap-2.5 mb-3">
                <span className="mt-0.5 w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                <div>
                  <p className="text-ink text-xs font-semibold">{c.label}</p>
                  <p className="text-ink-secondary text-[10px] leading-relaxed">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {oracleConns.length === 0 && (
          <div className="px-6 pb-3 text-center">
            <p className="text-[9px] uppercase tracking-[2px] text-ink-muted mb-2">Oracle Connections</p>
            <p className="text-ink-muted text-[10px] italic">No direct oracle connections — these Kins relate through shared families and complementary frequencies.</p>
          </div>
        )}

        {/* Shared Resonance */}
        {familyConns.length > 0 && (
          <div className="px-6 pb-3">
            <p className="text-[9px] uppercase tracking-[2px] text-ink-muted text-center mb-3">Shared Resonance</p>
            <div className="flex flex-wrap justify-center gap-2">
              {familyConns.map((c, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-parchment-dark/20 border border-border text-[10px] text-ink-secondary">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="px-6"><div className="gold-divider my-4" /></div>

        {/* Frequency Spectrum */}
        <div className="px-6 pb-4">
          <p className="text-[9px] uppercase tracking-[2px] text-ink-muted text-center mb-3">Frequency Spectrum</p>

          <div className="grid grid-cols-4 gap-[3px] mb-3">
            {ZONES.map(zone => {
              const inZone = personFreqs.filter(pf => pf.band.band === zone.key);
              const active = inZone.length > 0;
              return (
                <div
                  key={zone.key}
                  className="text-center rounded-xl py-2 px-1"
                  style={{
                    backgroundColor: active ? zone.bg : 'rgba(0,0,0,0.02)',
                    border: active ? `1.5px solid ${zone.ring}` : '1.5px solid transparent',
                  }}
                >
                  <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: active ? zone.accent : 'rgba(155,140,122,0.4)' }}>
                    {zone.name}
                  </p>
                  <p className="text-[7px] mb-2" style={{ color: active ? '#6B5A47' : 'rgba(155,140,122,0.25)' }}>{zone.sub}</p>

                  <div className="min-h-[50px] flex flex-wrap items-center justify-center gap-2">
                    {active ? inZone.map((pf, j) => (
                      <div key={j} className="flex flex-col items-center w-[50px]">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm"
                          style={{ backgroundColor: pf.person.color, color: '#FDFBF7' }}
                        >
                          {pf.person.name.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-[7px] text-ink font-semibold mt-0.5 truncate w-full text-center">{pf.person.name}</p>
                        <p className="text-[6px] text-ink-muted italic">{pf.person.kinResult.tone.name}</p>
                        <p className="text-[6px] font-semibold" style={{ color: zone.accent }}>{pf.peak} Hz</p>
                      </div>
                    )) : (
                      <div className="w-8 h-8 rounded-full border border-dashed" style={{ borderColor: zone.faint }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bridge connector */}
          {!allSameBand && activeIndices.length >= 2 && (
            <div className="flex items-center justify-center gap-1.5 mb-2">
              {activeIndices.map((idx, i) => (
                <div key={idx} className="flex items-center gap-1.5">
                  {i > 0 && <div className="w-5 border-t-[1.5px] border-dashed" style={{ borderColor: bridgeInfo?.color || '#C4962C' }} />}
                  <span className="text-[8px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap" style={{ backgroundColor: ZONES[idx].bg, color: ZONES[idx].accent }}>
                    {ZONES[idx].name}
                  </span>
                </div>
              ))}
            </div>
          )}

          <p className="text-center text-[11px] font-semibold" style={{ color: allSameBand ? '#C4962C' : bridgeInfo?.color || '#C4962C' }}>
            {allSameBand ? '\u2726 Resonant Match' : bridgeInfo?.label || 'Harmonic Bridge'}
          </p>
          {bridgeInfo && <p className="text-ink-muted text-[9px] text-center mt-0.5">{bridgeInfo.badge}</p>}
        </div>

        {/* Sound Healing Prescription */}
        <div className="mx-6 mb-5 bg-parchment-dark/15 rounded-xl p-4">
          <p className="text-[9px] uppercase tracking-[2px] text-ink-muted text-center mb-2">Sound Healing Prescription</p>
          <p className="text-ink text-xs text-center leading-relaxed">{sessionRx}</p>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gold/5 via-gold/10 to-gold/5 px-6 py-3 text-center border-t border-gold/15">
          <p className="text-ink-muted text-[8px] tracking-wider">
            kinara.app &middot; Part of the Harmonic Waves ecosystem
          </p>
        </div>
      </div>
    </div>
  );
}
