'use client';
import type { KinResult } from '@/lib/dreamspell-calc';
import { SEALS, SEAL_COLOUR_HEX } from '@/lib/dreamspell-data';
import { COLOUR_FAMILIES, getColourFamily } from '@/lib/categories';
import GlyphIcon from './GlyphIcon';

interface Props { kinResult: KinResult }

export default function ColourFamily({ kinResult }: Props) {
  const active = getColourFamily(kinResult.seal.colour);

  return (
    <section className="py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="gold-divider mb-10" />
        <p className="section-label text-center mb-8">Your Colour Family</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {COLOUR_FAMILIES.map(fam => {
            const isActive = fam.colour === active.colour;
            return (
              <div
                key={fam.colour}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  isActive
                    ? 'bg-parchment-card border-gold shadow-golden'
                    : 'bg-parchment-dark/30 border-border'
                }`}
              >
                <div className="w-5 h-5 rounded-full mx-auto mb-2" style={{ backgroundColor: SEAL_COLOUR_HEX[fam.colour] }} />
                <p className="font-serif text-ink text-sm font-semibold">{fam.colour}</p>
                <p className="text-ink-muted text-xs mb-2">{fam.role} &middot; {fam.keynote}</p>
                <p className="text-ink-secondary text-xs mb-3">{fam.description}</p>
                <div className="flex justify-center gap-1">
                  {fam.sealIndices.map(i => (
                    <GlyphIcon key={i} iconFile={SEALS[i].iconFile} sealName={SEALS[i].name} size={20} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
