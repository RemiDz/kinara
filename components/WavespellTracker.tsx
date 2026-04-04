'use client';
import { useMemo, useEffect, useRef } from 'react';
import { calculateKin, getKinResult } from '@/lib/dreamspell-calc';
import { TONES, SEAL_COLOUR_HEX, SEAL_COLOUR_TEXT } from '@/lib/dreamspell-data';
import { getWavespellNumber, getWavespellSeal, getWavespellPosition, getCastle } from '@/lib/categories';
import GlyphIcon from './GlyphIcon';
import ToneSymbol from './ToneSymbol';

// Guiding questions per tone (classic Dreamspell)
const TONE_QUESTIONS: Record<number, string> = {
  1:  'What is my purpose?',
  2:  'What is my challenge?',
  3:  'How can I best serve?',
  4:  'What form will my service take?',
  5:  'How can I best empower myself?',
  6:  'How can I extend my equality to others?',
  7:  'How can I attune my service to others?',
  8:  'Do I live what I believe?',
  9:  'How do I attain my purpose?',
  10: 'How do I perfect what I do?',
  11: 'How do I release and let go?',
  12: 'How can I dedicate myself to all that lives?',
  13: 'How can I expand my joy and love?',
};

// Sound healing guidance per tone
const TONE_SOUND: Record<number, string> = {
  1:  'Strike the first note. Set the fundamental tone of intention.',
  2:  'Introduce the second voice. Hold the tension between two tones.',
  3:  'Add the third harmonic. Feel the triad activate.',
  4:  'Build the four-cornered foundation. Steady drone, steady rhythm.',
  5:  'Find the overtone. Let the fifth harmonic sing above the fundamental.',
  6:  'Create rhythmic pulse. Balance left and right, giving and receiving.',
  7:  'Listen for resonance. The bowl that rings longest holds today\u2019s truth.',
  8:  'Play in harmony with another. Integrate instrument and voice.',
  9:  'Build to fullness. Let the sound fill every corner of the space.',
  10: 'Manifest the perfect tone. Precision and beauty in every strike.',
  11: 'Strike once and let the note decay naturally. The dissolving IS the practice.',
  12: 'Gather all voices together. Community sound circle. Round singing.',
  13: 'Sound the octave. Return to the beginning, one level higher. Completion.',
};

export default function WavespellTracker() {
  const todayRef = useRef<HTMLDivElement>(null);

  const data = useMemo(() => {
    const now = new Date();
    const todayKin = calculateKin(now.getFullYear(), now.getMonth() + 1, now.getDate());
    if (!todayKin) return null;

    const wsNumber = getWavespellNumber(todayKin);
    const wsSeal = getWavespellSeal(todayKin);
    const wsPosition = getWavespellPosition(todayKin);
    const castle = getCastle(todayKin);

    const wsStartKin = (wsNumber - 1) * 13 + 1;
    const days = Array.from({ length: 13 }, (_, i) => {
      const dayKin = wsStartKin + i;
      return { dayKin, result: getKinResult(dayKin), position: i + 1 };
    });

    return { wsNumber, wsSeal, wsPosition, castle, days };
  }, []);

  // Auto-scroll to today's card
  useEffect(() => {
    if (todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [data]);

  if (!data) return null;
  const { wsNumber, wsSeal, wsPosition, castle, days } = data;

  return (
    <section className="py-8 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="gold-divider mb-8" />
        <p className="section-label text-center mb-6">Wavespell Journey</p>

        <div className="bg-parchment-card border border-border rounded-2xl p-6 md:p-8 shadow-card">
          {/* Wavespell header */}
          <div className="flex items-center justify-center gap-4 mb-5">
            <GlyphIcon iconFile={wsSeal.iconFile} sealName={wsSeal.name} size={48} />
            <div>
              <p className="font-serif text-lg text-ink">{wsSeal.colour} {wsSeal.name} Wavespell</p>
              <p className="text-ink-muted text-xs">Wavespell {wsNumber} of 20 &middot; {castle.colour} Castle</p>
            </div>
          </div>

          {/* Progress bar with day numbers */}
          <div className="mb-6">
            <div className="flex gap-[2px] mb-1">
              {Array.from({ length: 13 }, (_, i) => {
                const pos = i + 1;
                return (
                  <div
                    key={i}
                    className={`flex-1 h-2 rounded-full transition-all ${
                      pos === wsPosition ? 'bg-gold shadow-golden' :
                      pos < wsPosition ? 'bg-gold/40' : 'bg-border/50'
                    }`}
                  />
                );
              })}
            </div>
            <div className="flex">
              {Array.from({ length: 13 }, (_, i) => (
                <span key={i} className={`flex-1 text-center text-[8px] ${i + 1 === wsPosition ? 'text-gold font-bold' : 'text-ink-muted/50'}`}>
                  {i + 1}
                </span>
              ))}
            </div>
          </div>

          {/* 13-Day Journey Cards */}
          <div className="space-y-2">
            {days.map(day => {
              const isCurrent = day.position === wsPosition;
              const isPast = day.position < wsPosition;
              const tone = TONES[day.position - 1];
              const kr = day.result;
              const colourText = SEAL_COLOUR_TEXT[kr.seal.colour];
              const question = TONE_QUESTIONS[day.position];
              const sound = TONE_SOUND[day.position];

              return (
                <div
                  key={day.dayKin}
                  ref={isCurrent ? todayRef : undefined}
                  className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                    isCurrent ? 'border-l-[3px] border-gold shadow-sm' :
                    isPast ? 'opacity-60' : ''
                  }`}
                  style={isCurrent ? { backgroundColor: 'rgba(196,150,44,0.08)' } : undefined}
                >
                  <div className="flex-shrink-0 w-[48px] h-[48px]">
                    <GlyphIcon iconFile={kr.seal.iconFile} sealName={kr.seal.name} size={48} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="text-ink text-sm font-semibold">Day {day.position}</span>
                      <span className="text-ink-muted text-xs">{tone.name}</span>
                      {isCurrent && <span className="text-gold text-[9px] font-bold uppercase tracking-wider">Today</span>}
                    </div>
                    <p className={`text-sm font-medium ${colourText}`}>
                      Kin {day.dayKin} &middot; {kr.fullName}
                    </p>
                    <p className="text-ink-muted text-xs">
                      {tone.action} &middot; {tone.power} &middot; {tone.essence}
                    </p>
                    <p className="text-ink-secondary text-xs italic mt-1">&ldquo;{question}&rdquo;</p>
                    <p className="text-ink-muted text-[10px] italic mt-0.5">{'\u266A'} {sound}</p>
                  </div>
                  <div className="flex-shrink-0 pt-1 opacity-40">
                    <ToneSymbol tone={day.position} size={22} colour={isCurrent ? '#C4962C' : '#9B8C7A'} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
