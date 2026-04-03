'use client';
import type { KinResult } from '@/lib/dreamspell-calc';
import { CASTLES, getCastle } from '@/lib/categories';

interface Props { kinResult: KinResult }

const CASTLE_COLOURS: Record<string, string> = {
  Red: 'border-seal-red/30',
  White: 'border-ink-muted/20',
  Blue: 'border-seal-blue/30',
  Yellow: 'border-seal-yellow/30',
  Green: 'border-green-600/30',
};

export default function CastleSection({ kinResult }: Props) {
  const active = getCastle(kinResult.kin);

  return (
    <section className="py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="gold-divider mb-10" />
        <p className="section-label text-center mb-8">Your Castle</p>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-6">
          {CASTLES.map(c => {
            const isActive = c.number === active.number;
            return (
              <div
                key={c.number}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isActive
                    ? 'bg-parchment-card border-gold shadow-golden'
                    : `bg-parchment-dark/30 ${CASTLE_COLOURS[c.colour]}`
                }`}
              >
                <p className="font-serif text-ink text-xs font-semibold leading-tight">{c.name}</p>
                <p className="text-ink-muted text-[10px] mt-1">{c.court}</p>
                <p className="text-ink-muted text-[10px]">Kin {c.kinRange[0]}–{c.kinRange[1]}</p>
              </div>
            );
          })}
        </div>

        <p className="text-ink-secondary text-sm text-center leading-relaxed">{active.description}</p>
      </div>
    </section>
  );
}
