'use client';
import type { KinResult } from '@/lib/dreamspell-calc';
import { SEAL_COLOUR_HEX } from '@/lib/dreamspell-data';
import { getDeclaration } from '@/lib/galactic-content';

interface Props { kinResult: KinResult }

export default function Declaration({ kinResult }: Props) {
  const decl = getDeclaration(kinResult.kin);
  if (!decl) return null;

  const borderColour = SEAL_COLOUR_HEX[kinResult.seal.colour] || '#C4962C';

  return (
    <section className="py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="gold-divider mb-10" />
        <p className="section-label text-center mb-6">Your Galactic Declaration</p>
        <blockquote
          className="bg-parchment-card border-l-4 rounded-r-2xl p-6 md:p-8 shadow-card"
          style={{ borderLeftColor: borderColour }}
        >
          <p className="font-serif text-ink-secondary text-base md:text-lg leading-relaxed italic whitespace-pre-line">
            {decl.declaration}
          </p>
        </blockquote>
      </div>
    </section>
  );
}
