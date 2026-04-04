'use client';
import { useState, useRef, useCallback } from 'react';
import type { KinResult } from '@/lib/dreamspell-calc';
import { TONES, SEAL_COLOUR_HEX } from '@/lib/dreamspell-data';
import ToneSymbol from './ToneSymbol';

// 13 Tones mapped to musical intervals (just intonation ratios)
// Base frequency 256 Hz (scientific tuning middle C)
const BASE_FREQ = 256;
const INTERVALS: { ratio: number; name: string }[] = [
  { ratio: 1,       name: 'Unison' },       // Tone 1: Magnetic
  { ratio: 16/15,   name: 'Minor 2nd' },    // Tone 2: Lunar
  { ratio: 9/8,     name: 'Major 2nd' },    // Tone 3: Electric
  { ratio: 6/5,     name: 'Minor 3rd' },    // Tone 4: Self-existing
  { ratio: 5/4,     name: 'Major 3rd' },    // Tone 5: Overtone
  { ratio: 4/3,     name: 'Perfect 4th' },  // Tone 6: Rhythmic
  { ratio: 45/32,   name: 'Tritone' },      // Tone 7: Resonant
  { ratio: 3/2,     name: 'Perfect 5th' },  // Tone 8: Galactic
  { ratio: 8/5,     name: 'Minor 6th' },    // Tone 9: Solar
  { ratio: 5/3,     name: 'Major 6th' },    // Tone 10: Planetary
  { ratio: 16/9,    name: 'Minor 7th' },    // Tone 11: Spectral
  { ratio: 15/8,    name: 'Major 7th' },    // Tone 12: Crystal
  { ratio: 2,       name: 'Octave' },       // Tone 13: Cosmic
];

// Consonance/dissonance rating for interval combinations
function getHarmonyType(t1: number, t2: number): { label: string; color: string } {
  const r1 = INTERVALS[t1 - 1].ratio;
  const r2 = INTERVALS[t2 - 1].ratio;
  const combined = r2 / r1;
  // Simple consonance check based on ratio simplicity
  const CONSONANT = [1, 2, 3/2, 4/3, 5/4, 6/5, 5/3, 8/5];
  const isConsonant = CONSONANT.some(c => Math.abs(combined - c) < 0.02 || Math.abs(1/combined - c) < 0.02);
  if (t1 === t2) return { label: 'Perfect unison', color: '#C4962C' };
  if (isConsonant) return { label: 'Consonant harmony', color: '#27ae60' };
  return { label: 'Creative tension', color: '#c0392b' };
}

interface Props { kinResult: KinResult }

export default function HarmonicOctave({ kinResult }: Props) {
  const [playing, setPlaying] = useState<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    return audioCtxRef.current;
  }, []);

  const playTone = useCallback((toneNum: number) => {
    // Stop any currently playing tone
    if (oscRef.current) {
      oscRef.current.stop();
      oscRef.current = null;
    }

    if (playing === toneNum) {
      setPlaying(null);
      return;
    }

    const ctx = getCtx();
    const freq = BASE_FREQ * INTERVALS[toneNum - 1].ratio;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 2.5);

    oscRef.current = osc;
    gainRef.current = gain;
    setPlaying(toneNum);

    osc.onended = () => {
      if (oscRef.current === osc) {
        setPlaying(null);
        oscRef.current = null;
      }
    };
  }, [playing, getCtx]);

  const userTone = kinResult.tone.number;
  const userFreq = BASE_FREQ * INTERVALS[userTone - 1].ratio;
  const userInterval = INTERVALS[userTone - 1];
  const sealColour = SEAL_COLOUR_HEX[kinResult.seal.colour];

  return (
    <section className="py-8 px-6">
      <div className="max-w-lg mx-auto">
        <div className="gold-divider mb-8" />
        <p className="section-label text-center mb-6">Harmonic Octave</p>

        <div className="bg-parchment-card border border-border rounded-2xl p-6 md:p-8 shadow-card">
          {/* Your tone highlight */}
          <div className="text-center mb-6">
            <p className="text-ink text-sm font-semibold mb-1">Your Galactic Tone</p>
            <div className="flex items-center justify-center gap-3 mb-2">
              <ToneSymbol tone={userTone} size={32} colour={sealColour} />
              <div className="text-left">
                <p className="font-serif text-lg text-ink">Tone {userTone} &middot; {kinResult.tone.name}</p>
                <p className="text-ink-muted text-xs">{userInterval.name} &middot; {userFreq.toFixed(1)} Hz</p>
              </div>
            </div>
            <button
              onClick={() => playTone(userTone)}
              className={`mt-2 px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                playing === userTone
                  ? 'bg-gold text-parchment-card shadow-golden'
                  : 'border border-gold text-gold hover:bg-gold/10'
              }`}
            >
              {playing === userTone ? '\u266A Playing...' : '\u25B6 Hear Your Tone'}
            </button>
          </div>

          {/* Full 13-tone octave */}
          <p className="text-ink-muted text-[10px] uppercase tracking-widest text-center mb-3">13-Tone Harmonic Scale</p>
          <div className="space-y-[2px]">
            {TONES.map((tone, i) => {
              const freq = BASE_FREQ * INTERVALS[i].ratio;
              const interval = INTERVALS[i];
              const isUser = tone.number === userTone;
              const isPlaying = playing === tone.number;
              const harmony = tone.number !== userTone ? getHarmonyType(userTone, tone.number) : null;

              return (
                <button
                  key={tone.number}
                  onClick={() => playTone(tone.number)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${
                    isUser ? 'bg-gold/10 ring-1 ring-gold/30' :
                    isPlaying ? 'bg-parchment-dark/20' : 'hover:bg-parchment-dark/10'
                  }`}
                >
                  <ToneSymbol tone={tone.number} size={16} colour={isUser ? sealColour : '#9B8C7A'} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-xs font-semibold ${isUser ? 'text-gold' : 'text-ink'}`}>{tone.name}</span>
                      <span className="text-[9px] text-ink-muted">{interval.name}</span>
                    </div>
                    <span className="text-[9px] text-ink-muted">{tone.action} &middot; {tone.power}</span>
                  </div>
                  <span className="text-[9px] text-ink-muted font-mono w-14 text-right">{freq.toFixed(1)}</span>
                  {harmony && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: harmony.color }} />}
                  {isPlaying && <span className="text-gold text-[10px]">{'\u266A'}</span>}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-4 mt-4 text-[9px] text-ink-muted">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#C4962C]" />Your tone</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#27ae60]" />Consonant</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#c0392b]" />Tension</span>
          </div>
        </div>
      </div>
    </section>
  );
}
