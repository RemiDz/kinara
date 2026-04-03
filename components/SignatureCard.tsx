'use client';
import type { KinResult } from '@/lib/dreamspell-calc';
import { SEAL_COLOUR_TEXT, SEAL_COLOUR_HEX } from '@/lib/dreamspell-data';
import { getColourFamily } from '@/lib/categories';
import GlyphIcon from './GlyphIcon';
import ToneSymbol from './ToneSymbol';

interface Props { kinResult: KinResult; isHunabKu?: boolean }

export default function SignatureCard({ kinResult, isHunabKu }: Props) {
  if (isHunabKu) {
    return (
      <section id="signature-card" className="flex items-center justify-center px-6 py-20">
        <div className="max-w-md mx-auto text-center bg-parchment-card border border-gold-light rounded-2xl p-10 shadow-golden">
          <h2 className="font-serif text-4xl text-gold mb-4">0.0 Hunab Ku</h2>
          <p className="text-ink-secondary text-lg leading-relaxed">
            February 29 is designated 0.0 Hunab Ku in the Dreamspell. This date holds no Kin number — it exists outside the Tzolkin count as a portal day of galactic activation.
          </p>
        </div>
      </section>
    );
  }

  const { kin, seal, tone, fullName } = kinResult;
  const colourText = SEAL_COLOUR_TEXT[seal.colour];
  const family = getColourFamily(seal.colour);

  return (
    <section id="signature-card" className="flex items-center justify-center px-6 pt-8 pb-12">
      <div className="max-w-lg w-full mx-auto bg-parchment-card border border-border rounded-2xl p-8 md:p-10 shadow-card">
        <div className="text-center mb-6">
          <p className="section-label mb-1">Galactic Signature</p>
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
          <p className="section-label mb-1">Seal Keywords</p>
          <p className="text-ink text-sm">{seal.action} &middot; {seal.power} &middot; {seal.essence}</p>
        </div>

        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-parchment-dark/30">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: SEAL_COLOUR_HEX[seal.colour] }} />
            <span className="text-ink-secondary text-sm">{seal.colour} Family — {family.role}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
