'use client';
import { useState } from 'react';
import { SEALS, SEAL_COLOUR_HEX } from '@/lib/dreamspell-data';
import { getKinName, getToneNumber } from '@/lib/dreamspell-calc';
import GlyphIcon from './GlyphIcon';
import ToneSymbol from './ToneSymbol';

const COLOUR_BG: Record<string, string> = {
  Red: 'bg-seal-red/15',
  White: 'bg-seal-white/40',
  Blue: 'bg-seal-blue/15',
  Yellow: 'bg-seal-yellow/15',
};

interface HighlightedKin {
  kin: number;
  color: string;
  name?: string;
}

interface Props {
  userKin: number | null;
  highlightedKins?: HighlightedKin[];
}

const COLUMNS = 13;

export default function TzolkinMatrix({ userKin, highlightedKins = [] }: Props) {
  const [tooltip, setTooltip] = useState<{ kin: number; name: string; x: number; y: number } | null>(null);

  // Traditional Harmonic Module: kins flow sequentially down each column
  // Column 0 = Kins 1-20, Column 1 = Kins 21-40, …, Column 12 = Kins 241-260
  const getKin = (sealIdx: number, col: number) => col * 20 + sealIdx + 1;

  const getHighlight = (kin: number): { color: string; names: string[] } | null => {
    const matches = highlightedKins.filter(h => h.kin === kin);
    if (matches.length > 0) return { color: matches[0].color, names: matches.map(m => m.name).filter(Boolean) as string[] };
    if (kin === userKin) return { color: '#C4962C', names: [] };
    return null;
  };

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="gold-divider mb-10" />
        <p className="section-label text-center mb-2">The Tzolkin — 260 Galactic Signatures</p>
        <p className="text-ink-muted text-center mb-8 text-xs">20 Seals &times; 13 Tones &mdash; Harmonic Module</p>

        <div className="overflow-x-auto pb-4 -mx-4 px-4">
          <table className="mx-auto border-collapse">
            <tbody>
              {SEALS.map((seal, sealIdx) => (
                <tr key={seal.index}>
                  <td className="pr-2">
                    <div className="flex justify-center">
                      <GlyphIcon iconFile={seal.iconFile} sealName={seal.name} size={52} />
                    </div>
                  </td>
                  {Array.from({ length: COLUMNS }, (_, col) => {
                    const kin = getKin(sealIdx, col);
                    const tone = getToneNumber(kin);
                    const highlight = getHighlight(kin);
                    return (
                      <td
                        key={col}
                        className="p-0"
                        onMouseEnter={e => {
                          const r = (e.target as HTMLElement).getBoundingClientRect();
                          setTooltip({ kin, name: getKinName(kin), x: r.left + r.width / 2, y: r.top - 8 });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      >
                        <div
                          className={`w-14 h-[68px] md:w-16 md:h-[72px] flex flex-col items-center justify-center overflow-hidden p-[2px] m-[1px] rounded-sm ${COLOUR_BG[seal.colour]} ${highlight ? 'font-bold relative z-10' : 'text-ink-secondary'}`}
                          style={highlight ? {
                            outline: `2px solid ${highlight.color}`,
                            outlineOffset: '-2px',
                            color: highlight.color,
                          } : undefined}
                        >
                          <span className="text-[11px] md:text-xs font-mono leading-none">{kin}</span>
                          <ToneSymbol tone={tone} size={20} colour={highlight?.color ?? '#9B8C7A'} />
                          {highlight && highlight.names.length > 0 && (
                            <span className="text-[8px] font-bold leading-none truncate w-full text-center" style={{ color: highlight.color }}>
                              {highlight.names.length === 1 ? highlight.names[0] : highlight.names.join(' / ')}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {tooltip && (
          <div className="fixed z-50 pointer-events-none px-3 py-2 bg-parchment-card border border-border rounded-lg shadow-card text-sm text-ink" style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}>
            <span className="font-mono text-gold">Kin {tooltip.kin}</span>
            <span className="mx-2 text-ink-muted">|</span>
            <span>{tooltip.name}</span>
          </div>
        )}
      </div>
    </section>
  );
}
