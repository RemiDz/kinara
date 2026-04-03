'use client';
import type { KinResult } from '@/lib/dreamspell-calc';
import { SEALS } from '@/lib/dreamspell-data';
import { EARTH_FAMILIES, getEarthFamily } from '@/lib/categories';
import GlyphIcon from './GlyphIcon';

interface Props { kinResult: KinResult }

export default function EarthFamily({ kinResult }: Props) {
  const active = getEarthFamily(kinResult.seal.index);

  return (
    <section className="py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="gold-divider mb-10" />
        <p className="section-label text-center mb-8">Your Earth Family</p>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {EARTH_FAMILIES.map(fam => {
            const isActive = fam.name === active.name;
            return (
              <div
                key={fam.name}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  isActive
                    ? 'bg-parchment-card border-gold shadow-golden'
                    : 'bg-parchment-dark/30 border-border'
                }`}
              >
                <p className="font-serif text-ink text-sm font-semibold">{fam.name}</p>
                <p className="text-gold text-xs font-semibold mb-1">{fam.role}</p>
                <p className="text-ink-secondary text-xs mb-3 leading-snug">{fam.description}</p>
                <div className="flex justify-center gap-1">
                  {fam.sealIndices.map(i => (
                    <GlyphIcon key={i} iconFile={SEALS[i].iconFile} sealName={SEALS[i].name} size={22} />
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
