'use client';
import type { KinResult } from '@/lib/dreamspell-calc';
import { getToneDescription } from '@/lib/galactic-content';
import ToneSymbol from './ToneSymbol';

interface Props { kinResult: KinResult }

export default function ToneSection({ kinResult }: Props) {
  const { tone } = kinResult;
  const desc = getToneDescription(tone.number);

  return (
    <section className="py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="gold-divider mb-10" />
        <p className="section-label text-center mb-6">Your Creative Tone</p>

        <div className="flex items-center justify-center gap-4 mb-6">
          <ToneSymbol tone={tone.number} size={48} colour="#C4962C" />
          <div>
            <p className="font-serif text-2xl text-ink">Tone {tone.number} &middot; {tone.name}</p>
            <p className="text-ink-muted text-sm">{tone.action} &middot; {tone.power} &middot; {tone.essence}</p>
          </div>
        </div>

        {desc && (
          <p className="text-ink-secondary text-base leading-relaxed text-center">
            {desc}
          </p>
        )}
      </div>
    </section>
  );
}
