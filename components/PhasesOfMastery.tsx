'use client';
import type { KinResult } from '@/lib/dreamspell-calc';
import { MASTERY_PHASES, getMasteryPhase } from '@/lib/categories';
import { SEALS } from '@/lib/dreamspell-data';
import GlyphIcon from './GlyphIcon';

interface Props { kinResult: KinResult }

export default function PhasesOfMastery({ kinResult }: Props) {
  const active = getMasteryPhase(kinResult.seal.index);

  return (
    <section className="py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="gold-divider mb-10" />
        <p className="section-label text-center mb-8">Your Phase of Mastery</p>

        <div className="flex flex-col sm:flex-row gap-2 mb-8">
          {MASTERY_PHASES.map((phase, i) => {
            const isActive = phase.name === active.name;
            return (
              <div
                key={phase.name}
                className={`flex-1 rounded-2xl border p-4 text-center transition-all ${
                  isActive
                    ? 'bg-parchment-card border-gold shadow-golden'
                    : 'bg-parchment-dark/30 border-border'
                }`}
              >
                <p className="text-gold text-xs font-semibold mb-1">Phase {i + 1}</p>
                <p className="font-serif text-ink text-sm font-semibold mb-2">{phase.name}</p>
                <div className="flex justify-center gap-1 mb-2">
                  {Array.from({ length: 4 }, (_, j) => {
                    const sealIdx = phase.sealRange[0] + j;
                    return (
                      <GlyphIcon
                        key={sealIdx}
                        iconFile={SEALS[sealIdx].iconFile}
                        sealName={SEALS[sealIdx].name}
                        size={20}
                      />
                    );
                  })}
                </div>
                <p className={`text-xs leading-snug ${isActive ? 'text-ink-secondary' : 'text-ink-muted'}`}>
                  {phase.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
