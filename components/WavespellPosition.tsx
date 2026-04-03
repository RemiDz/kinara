'use client';
import type { KinResult } from '@/lib/dreamspell-calc';
import { TONES } from '@/lib/dreamspell-data';
import { getWavespellSeal, getWavespellPosition, getWavespellNumber } from '@/lib/categories';
import GlyphIcon from './GlyphIcon';

interface Props { kinResult: KinResult }

export default function WavespellPosition({ kinResult }: Props) {
  const ws = getWavespellSeal(kinResult.kin);
  const pos = getWavespellPosition(kinResult.kin);
  const wsNum = getWavespellNumber(kinResult.kin);
  const posTone = TONES[pos - 1];

  return (
    <section className="py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="gold-divider mb-10" />
        <p className="section-label text-center mb-6">Your Wavespell</p>

        <div className="bg-parchment-card border border-border rounded-2xl p-6 shadow-card text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GlyphIcon iconFile={ws.iconFile} sealName={ws.name} size={40} />
            <div className="text-left">
              <p className="font-serif text-ink text-lg">{ws.colour} {ws.name} Wavespell</p>
              <p className="text-ink-muted text-xs">Wavespell {wsNum} of 20</p>
            </div>
          </div>

          <div className="flex justify-center gap-1 mb-4">
            {Array.from({ length: 13 }, (_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-mono ${
                  i + 1 === pos
                    ? 'bg-gold text-parchment-card font-bold shadow-golden'
                    : 'bg-parchment-dark text-ink-muted'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>

          <p className="text-ink-secondary text-sm">
            Day <span className="text-gold font-semibold">{pos}</span> of 13 &middot; {posTone.name} position — <em>{posTone.action} &middot; {posTone.power} &middot; {posTone.essence}</em>
          </p>
        </div>
      </div>
    </section>
  );
}
