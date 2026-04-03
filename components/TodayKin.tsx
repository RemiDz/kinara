'use client';
import type { KinResult } from '@/lib/dreamspell-calc';
import type { OracleResult } from '@/lib/dreamspell-calc';
import { SEAL_COLOUR_TEXT, SEAL_COLOUR_HEX } from '@/lib/dreamspell-data';
import { getColourFamily } from '@/lib/categories';
import { getDeclaration } from '@/lib/galactic-content';
import GlyphIcon from './GlyphIcon';
import ToneSymbol from './ToneSymbol';

interface Props {
  kinResult: KinResult | null;
}

export default function TodayKin({ kinResult }: Props) {
  if (!kinResult) {
    return (
      <section className="flex items-center justify-center min-h-[40vh] px-6">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
          <p className="text-ink-muted text-sm">Loading today&apos;s Kin&hellip;</p>
        </div>
      </section>
    );
  }

  const { kin, seal, tone, fullName } = kinResult;
  const colourText = SEAL_COLOUR_TEXT[seal.colour];
  const family = getColourFamily(seal.colour);
  const declaration = getDeclaration(kin);

  return (
    <section className="px-6 pt-8 pb-4">
      <div className="max-w-lg w-full mx-auto">
        <p className="section-label text-center mb-2">Today&apos;s Galactic Energy</p>

        <div className="bg-parchment-card border border-border rounded-2xl p-8 md:p-10 shadow-card animate-fade-in">
          <div className="text-center mb-6">
            <p className={`font-serif text-5xl md:text-6xl ${colourText} mb-2`}>Kin {kin}</p>
            <h2 className="font-serif text-2xl md:text-3xl text-ink">{fullName}</h2>
          </div>

          <div className="flex items-center justify-center gap-6 mb-6">
            <GlyphIcon iconFile={seal.iconFile} sealName={seal.name} size={90} />
            <div className="flex flex-col items-center">
              <ToneSymbol tone={tone.number} size={50} />
              <p className="text-ink-muted text-xs mt-1">Tone {tone.number}</p>
            </div>
          </div>

          <div className="text-center mb-4">
            <p className={`text-lg ${colourText} font-semibold`}>Tone {tone.number} &middot; {tone.name}</p>
            <p className="text-ink-secondary text-sm mt-1">{tone.action} &middot; {tone.power} &middot; {tone.essence}</p>
          </div>

          <div className="text-center mb-4">
            <p className="text-ink-secondary text-sm">{seal.action} &middot; {seal.power} &middot; {seal.essence}</p>
          </div>

          {declaration && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="section-label text-center mb-3">Today&apos;s Declaration</p>
              <blockquote
                className="text-ink-secondary text-sm italic leading-relaxed text-center whitespace-pre-line"
                style={{ borderLeft: `3px solid ${SEAL_COLOUR_HEX[seal.colour]}`, paddingLeft: '1rem', textAlign: 'left' }}
              >
                {declaration.declaration}
              </blockquote>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-parchment-dark/30">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: SEAL_COLOUR_HEX[seal.colour] }} />
              <span className="text-ink-secondary text-sm">{seal.colour} Family — {family.role}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
