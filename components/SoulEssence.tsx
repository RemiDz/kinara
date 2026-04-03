'use client';
import type { KinResult } from '@/lib/dreamspell-calc';
import { getSealDescription } from '@/lib/galactic-content';

interface Props { kinResult: KinResult }

export default function SoulEssence({ kinResult }: Props) {
  const { seal } = kinResult;
  // galactic-content uses seal names, but "Worldbridger" may be "World-Bridger" in the data
  const desc = getSealDescription(seal.name) || getSealDescription(seal.name.replace('Worldbridger', 'World-Bridger'));

  if (!desc) return null;

  return (
    <section className="py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="gold-divider mb-10" />
        <p className="section-label text-center mb-6">Your Soul Essence</p>
        <p className="text-ink-secondary text-base leading-relaxed text-center whitespace-pre-line">
          {desc}
        </p>
      </div>
    </section>
  );
}
