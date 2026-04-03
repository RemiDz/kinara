'use client';
import type { KinResult, OracleResult } from '@/lib/dreamspell-calc';
import { SEAL_COLOUR_HEX, SEAL_COLOUR_TEXT } from '@/lib/dreamspell-data';
import { getColourFamily, getEarthFamily, getCastle, getMasteryPhase } from '@/lib/categories';
import { getFrequencyBand, type Connection } from '@/lib/relationships';
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

export default function ComparisonCard({ people, connections }: Props) {
  if (people.length < 2) return null;

  const oracleConns = connections.filter(c => ['analog', 'antipode', 'occult', 'guide'].includes(c.type));
  const familyConns = connections.filter(c => ['colour-family', 'earth-family'].includes(c.type));

  // Frequency analysis
  const freqBands = people.map(p => getFrequencyBand(p.kinResult.seal.colour));
  const uniqueBands = [...new Set(freqBands.map(f => f.label))];
  const allSameBand = uniqueBands.length === 1;

  // Session recommendation
  const sessionRx = allSameBand
    ? `Unified ${uniqueBands[0]} session — deep, focused resonance work.`
    : uniqueBands.length === 2
    ? `Bridge session — weave between ${uniqueBands[0]} and ${uniqueBands[1]} instruments.`
    : `Journey session — move through ${uniqueBands.join(', ')} bands progressively.`;

  return (
    <div className="my-8">
      <p className="section-label text-center mb-4">Shareable Reading</p>

      <div
        id="comparison-card"
        className="max-w-xl mx-auto bg-parchment-card rounded-3xl overflow-hidden shadow-golden-lg"
        style={{ border: '1.5px solid #C4962C40' }}
      >
        {/* Gold header bar */}
        <div className="bg-gradient-to-r from-gold/10 via-gold/20 to-gold/10 px-6 py-4 text-center border-b border-gold/20">
          <p className="font-serif text-xl text-ink tracking-wider">Kinara</p>
          <p className="text-ink-muted text-[10px] uppercase tracking-[3px] mt-0.5">Galactic Relationship Reading</p>
        </div>

        {/* People — side by side */}
        <div className="px-6 pt-6 pb-2">
          <div className={`grid gap-4 ${people.length === 2 ? 'grid-cols-2' : people.length === 3 ? 'grid-cols-3' : people.length === 4 ? 'grid-cols-4' : 'grid-cols-5'}`}>
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

        {/* Frequency Profile */}
        <div className="px-6 pb-3">
          <p className="text-[9px] uppercase tracking-[2px] text-ink-muted text-center mb-3">Frequency Profile</p>
          <div className="flex justify-center gap-3 mb-3">
            {people.map((p, i) => {
              const freq = getFrequencyBand(p.kinResult.seal.colour);
              return (
                <div key={i} className="text-center">
                  <span
                    className="inline-block px-3 py-1.5 rounded-full text-[10px] font-semibold"
                    style={{ backgroundColor: `${SEAL_COLOUR_HEX[p.kinResult.seal.colour]}15`, color: SEAL_COLOUR_HEX[p.kinResult.seal.colour], border: `1px solid ${SEAL_COLOUR_HEX[p.kinResult.seal.colour]}30` }}
                  >
                    {freq.label} &middot; {freq.range}
                  </span>
                  <p className="text-[8px] text-ink-muted mt-1">{p.name}</p>
                </div>
              );
            })}
          </div>
          <p className="text-center text-ink-secondary text-[11px] font-semibold">
            {allSameBand ? 'Resonant Match' : uniqueBands.length === 2 ? 'Harmonic Bridge' : 'Dynamic Spectrum'}
          </p>
        </div>

        {/* Sound Healing Prescription */}
        <div className="mx-6 mb-5 bg-parchment-dark/15 rounded-xl p-4">
          <p className="text-[9px] uppercase tracking-[2px] text-ink-muted text-center mb-2">Sound Healing Prescription</p>
          <p className="text-ink text-xs text-center leading-relaxed">{sessionRx}</p>
        </div>

        {/* Footer branding */}
        <div className="bg-gradient-to-r from-gold/5 via-gold/10 to-gold/5 px-6 py-3 text-center border-t border-gold/15">
          <p className="text-ink-muted text-[8px] tracking-wider">
            kinara.app &middot; Part of the Harmonic Waves ecosystem
          </p>
        </div>
      </div>
    </div>
  );
}
