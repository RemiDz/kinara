'use client';
import type { KinResult } from '@/lib/dreamspell-calc';
import { SEAL_SOUND_MAP, TONE_SOUND_MAP } from '@/lib/healing-mappings';

interface Props { kinResult: KinResult }

export default function SoundHealing({ kinResult }: Props) {
  const { seal, tone } = kinResult;
  const sealSound = SEAL_SOUND_MAP[seal.index];
  const toneSound = TONE_SOUND_MAP[tone.number - 1];

  return (
    <section className="py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="gold-divider mb-10" />
        <p className="section-label text-center mb-6">Your Sound Healing Prescription</p>

        {/* Combined prose prescription */}
        <div className="bg-parchment-card border border-gold-light rounded-2xl p-6 md:p-8 shadow-golden mb-6">
          <p className="text-ink text-base leading-relaxed">
            {sealSound.description} {toneSound.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Seal instruments */}
          <div className="bg-parchment-card border border-border rounded-2xl p-5 shadow-card">
            <p className="section-label mb-2">Instruments ({seal.name})</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {sealSound.instruments.map(inst => (
                <span key={inst} className="px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold">{inst}</span>
              ))}
            </div>
            <p className="text-ink-muted text-xs">Focus: {sealSound.bodyFocus}</p>
          </div>

          {/* Tone playing style */}
          <div className="bg-parchment-card border border-border rounded-2xl p-5 shadow-card">
            <p className="section-label mb-2">Playing Style ({tone.name})</p>
            <p className="text-gold font-semibold text-sm mb-2">{toneSound.style}</p>
            <p className="text-ink-secondary text-xs leading-relaxed">{toneSound.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
