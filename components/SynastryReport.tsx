'use client';
import { useState } from 'react';
import type { Connection } from '@/lib/relationships';
import { SEALS, SEAL_COLOUR_HEX } from '@/lib/dreamspell-data';
import { getSealIndex } from '@/lib/dreamspell-calc';
import { getFrequencyBand } from '@/lib/relationships';
import GlyphIcon from './GlyphIcon';

interface Person {
  name: string;
  kin: number;
  sealIndex: number;
  sealName: string;
  sealColour: string;
  sealIcon: string;
}

interface Props {
  people: Person[];
  connections: Connection[];
}

// Deep interpretations by connection type — how seals interact in each oracle position
const TYPE_INTROS: Record<string, { title: string; icon: string; short: string; summary: (a: string, b: string) => string }> = {
  analog: {
    title: 'Analog \u2014 Best Friend Energy',
    icon: '\u2665',
    short: 'Natural allies who strengthen each other effortlessly.',
    summary: (a, b) => `${a} and ${b} are Analog partners \u2014 natural allies who amplify each other's gifts. Their seals vibrate in sympathetic resonance, like two strings tuned to harmony. Together they create an effortless flow of support and mutual understanding.`,
  },
  antipode: {
    title: 'Antipode \u2014 Growth Partner',
    icon: '\u2694',
    short: 'Mirror opposites who push each other to grow.',
    summary: (a, b) => `${a} and ${b} are Antipode partners \u2014 they challenge each other to grow beyond comfort zones. This is productive tension, not conflict. Each holds a mirror to the other's blind spots, creating the friction needed for transformation.`,
  },
  occult: {
    title: 'Hidden Power \u2014 Secret Gift',
    icon: '\u2728',
    short: 'Reveals hidden potential that stays dormant alone.',
    summary: (a, b) => `${a} and ${b} share a Hidden Power connection \u2014 an unconscious bond that unlocks gifts neither fully sees alone. This is the deepest, most mysterious relationship. Their interaction reveals latent potential that surprises both.`,
  },
  guide: {
    title: 'Guide \u2014 Higher-Self Teacher',
    icon: '\u2606',
    short: 'A wisdom connection \u2014 one carries a teaching the other needs.',
    summary: (a, b) => `${a} and ${b} share a Guide connection \u2014 one illuminates the path for the other. The guide relationship channels higher wisdom, offering direction and clarity on the soul's journey.`,
  },
  'colour-family': {
    title: 'Colour Family \u2014 Shared Purpose',
    icon: '\u25CF',
    short: 'Share the same fundamental life direction and approach.',
    summary: (a, b) => `${a} and ${b} belong to the same Colour Family \u2014 they share a fundamental direction in life. Both carry the same chromatic charge, meaning their core way of being resonates at the same frequency of initiation.`,
  },
  'earth-family': {
    title: 'Earth Family \u2014 Same Tribe',
    icon: '\u2302',
    short: 'Belong to the same planetary service team.',
    summary: (a, b) => `${a} and ${b} share an Earth Family \u2014 they belong to the same planetary tribe. This tribal bond means they play the same role in the Earth's energetic grid, processing galactic information in the same way.`,
  },
  wavespell: {
    title: 'Wavespell \u2014 Shared 13-Day Cycle',
    icon: '\u223F',
    short: 'Fall within the same 13-day creation wave.',
    summary: (a, b) => `${a} and ${b} share the same Wavespell \u2014 they ride the same 13-day creative wave. Born into the same creation journey, their galactic signatures unfold within the same purposeful cycle.`,
  },
  castle: {
    title: 'Castle \u2014 Shared 52-Day Court',
    icon: '\u2656',
    short: 'Share the same 52-day life chapter energy.',
    summary: (a, b) => `${a} and ${b} reside in the same Castle \u2014 the same 52-day court of transformation. They share the overarching theme and direction of their section of the Tzolkin.`,
  },
};

// Sound healing recommendation for each connection type
const SOUND_RX: Record<string, string> = {
  analog: 'Use monochord or dual crystal bowls tuned to the same interval \u2014 sympathetic resonance. Let one instrument feed the other.',
  antipode: 'Use gong or contrasting instruments \u2014 start with tension and resolve to harmony. The breakthrough IS the healing.',
  occult: 'Deep crystal bowls in a darkened space \u2014 eyes closed, exploring the invisible. Let the overtones reveal what is hidden.',
  guide: 'Overtone singing or high-frequency bowls \u2014 channel the guide energy downward through the crown. The guide frequency leads.',
  'colour-family': 'Use instruments from the shared colour frequency band. Same-colour families resonate with the same brainwave range.',
  'earth-family': 'Grounding instruments \u2014 monochord, earth drums, deep tones. The tribal bond is in the body.',
  wavespell: 'Sequential tones moving through the 13-step creation journey. Each tone builds on the last.',
  castle: 'A full session moving through 4 instruments representing the 4 wavespells of their shared castle.',
};

export default function SynastryReport({ people, connections }: Props) {
  const [expandedType, setExpandedType] = useState<string | null>(null);

  if (connections.length === 0) return null;

  // Deduplicate connections by type+pair
  const seen = new Set<string>();
  const deduped = connections.filter(c => {
    const key = `${c.type}:${Math.min(c.indexA, c.indexB)}-${Math.max(c.indexA, c.indexB)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Group by type
  const byType = new Map<string, Connection[]>();
  for (const c of deduped) {
    if (!byType.has(c.type)) byType.set(c.type, []);
    byType.get(c.type)!.push(c);
  }

  return (
    <div className="bg-parchment-card border border-border rounded-2xl p-5 md:p-6 my-6 shadow-card">
      <p className="section-label mb-4">Relationship Synastry</p>
      <p className="text-ink-muted text-xs mb-5 text-center">Tap a connection type to reveal its deeper meaning</p>

      <div className="space-y-2">
        {Array.from(byType.entries()).map(([type, conns]) => {
          const info = TYPE_INTROS[type];
          if (!info) return null;
          const isOpen = expandedType === type;
          const soundRx = SOUND_RX[type];
          const pairs = conns.map(c => ({
            a: people[c.indexA] || people[0],
            b: people[c.indexB] || people[1],
          }));

          return (
            <div key={type} className="border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedType(isOpen ? null : type)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-parchment-dark/10 transition-colors text-left"
              >
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: conns[0].color + '20', color: conns[0].color }}>
                  {info.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-ink text-xs font-semibold">{info.title}</p>
                  <p className="text-ink-secondary text-[10px] italic opacity-70">{info.short}</p>
                  <p className="text-ink-muted text-[10px]">{conns.length} connection{conns.length > 1 ? 's' : ''}</p>
                </div>
                <svg className={`w-4 h-4 text-ink-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 animate-fade-in">
                  {/* Interpretation for each pair */}
                  {pairs.map((pair, i) => (
                    <div key={i} className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <GlyphIcon iconFile={SEALS[pair.a.sealIndex].iconFile} sealName={pair.a.sealName} size={24} />
                          <span className="text-xs text-ink font-semibold">{pair.a.name}</span>
                        </div>
                        <span className="text-ink-muted text-xs">{'\u2194'}</span>
                        <div className="flex items-center gap-1">
                          <GlyphIcon iconFile={SEALS[pair.b.sealIndex].iconFile} sealName={pair.b.sealName} size={24} />
                          <span className="text-xs text-ink font-semibold">{pair.b.name}</span>
                        </div>
                      </div>
                      <p className="text-ink-secondary text-xs leading-relaxed">
                        {info.summary(pair.a.name, pair.b.name)}
                      </p>
                    </div>
                  ))}

                  {/* Sound healing prescription */}
                  {soundRx && (
                    <div className="bg-parchment-dark/10 rounded-lg p-3 mt-3">
                      <p className="text-[9px] uppercase tracking-widest text-ink-muted mb-1">Sound Healing Prescription</p>
                      <p className="text-ink-secondary text-xs leading-relaxed">{soundRx}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
