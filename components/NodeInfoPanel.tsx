'use client';
import { useMemo } from 'react';
import type { Connection } from '@/lib/relationships';
import GlyphIcon from './GlyphIcon';

export interface PanelPerson {
  name: string;
  kin: number;
  sealName: string;
  sealColour: string;
  sealIcon: string;
  sealIndex: number;
  toneNumber: number;
  toneName: string;
  fullName: string;
  profileColor: string;
}

interface Props {
  selectedIdx: number;
  people: PanelPerson[];
  connections: Connection[];
  onClose: () => void;
}

const CONN_WEIGHTS: Record<string, number> = {
  analog: 5, guide: 4, occult: 4, antipode: 3,
  'colour-family': 2, 'earth-family': 2, wavespell: 1, castle: 1,
};
const MUTUAL_TYPES = new Set(['analog', 'antipode', 'occult', 'colour-family', 'earth-family', 'wavespell', 'castle']);
const MAX_SCORE = 44;

const TYPE_COLORS: Record<string, string> = {
  analog: '#C4962C', antipode: '#c0392b', occult: '#7d3c98', guide: '#27ae60',
  'colour-family': '#2471a3', 'earth-family': '#8B6914', wavespell: '#95a5a6', castle: '#bdc3c7',
};

const COLOUR_DIRS: Record<string, string> = {
  Red: 'East — initiators who spark energy into motion',
  White: 'North — refiners who clarify and distil',
  Blue: 'West — transformers who take what exists and make it new',
  Yellow: 'South — ripeners who bring things to fruition',
};

const EARTH_ROLES: Record<string, string> = {
  Polar: 'receivers who channel galactic information',
  Cardinal: 'initiators who catalyse new directions',
  Core: 'processors who transform energy at the core',
  Signal: 'transmitters who signal galactic frequencies',
  Gateway: 'openers who transport consciousness between worlds',
};

function describeConnection(
  conn: Connection,
  sel: PanelPerson,
  other: PanelPerson,
  selectedIdx: number,
): { heading: string; body: string; arrow: string } {
  switch (conn.type) {
    case 'analog':
      return {
        arrow: '\u2194',
        heading: `${sel.name.toUpperCase()}'S BEST FRIEND IS ${other.name.toUpperCase()}`,
        body: `Your seals (${sel.sealName} and ${other.sealName}) are natural partners in the Dreamspell. You strengthen each other effortlessly \u2014 this is the easiest bond.`,
      };
    case 'antipode':
      return {
        arrow: '\u2194',
        heading: `${sel.name.toUpperCase()} AND ${other.name.toUpperCase()} ARE GROWTH PARTNERS`,
        body: `Your seals (${sel.sealName} and ${other.sealName}) sit opposite each other. You challenge each other to grow \u2014 the friction is the gift.`,
      };
    case 'occult':
      return {
        arrow: '\u2194',
        heading: `${sel.name.toUpperCase()} AND ${other.name.toUpperCase()} UNLOCK HIDDEN POTENTIAL`,
        body: `Together you activate abilities that stay dormant alone. This connection reveals itself slowly \u2014 pay attention to unexpected breakthroughs when you're together.`,
      };
    case 'guide': {
      // indexA = guided person, indexB = guide
      if (conn.indexA === selectedIdx) {
        return {
          arrow: '\u2192',
          heading: `${other.name.toUpperCase()} IS ${sel.name.toUpperCase()}'S HIGHER-SELF TEACHER`,
          body: `${other.name} carries a teaching that ${sel.name} needs for soul growth. This is a mentor-student dynamic \u2014 ${sel.name} learns from ${other.name}'s ${other.sealName} wisdom.`,
        };
      }
      return {
        arrow: '\u2192',
        heading: `${sel.name.toUpperCase()} IS ${other.name.toUpperCase()}'S HIGHER-SELF TEACHER`,
        body: `${sel.name} carries a teaching that ${other.name} needs for soul growth. ${sel.name}'s ${sel.sealName} wisdom guides ${other.name}'s path.`,
      };
    }
    case 'colour-family': {
      const dir = COLOUR_DIRS[sel.sealColour] || sel.sealColour;
      return {
        arrow: '\u2194',
        heading: `SAME COLOUR FAMILY (${sel.sealColour})`,
        body: `Both belong to the ${sel.sealColour} family \u2014 ${dir}. You share a fundamental approach to life.`,
      };
    }
    case 'earth-family': {
      const m = conn.label.match(/\((\w+)\)/);
      const fam = m ? m[1] : '';
      const role = EARTH_ROLES[fam] || 'members of the same planetary team';
      return {
        arrow: '\u2194',
        heading: `SAME TRIBE (${fam})`,
        body: `Both belong to the ${fam} Earth family \u2014 ${role}. You serve the same role in the collective.`,
      };
    }
    case 'wavespell': {
      const m = conn.label.match(/#(\d+)/);
      const num = m ? m[1] : '';
      return {
        arrow: '\u2194',
        heading: `SAME 13-DAY CYCLE${num ? ` (Wavespell ${num})` : ''}`,
        body: `Your Kins fall within the same Wavespell \u2014 you share the same underlying creation theme. Different tones, same wave.`,
      };
    }
    case 'castle': {
      const detail = conn.detail || '';
      return {
        arrow: '\u2194',
        heading: 'SAME 52-DAY COURT',
        body: `${detail ? `Both Kins fall within the ${detail}` : 'Both Kins share the same Castle'}. Castle is determined by Kin position in the 260-day cycle, not by seal colour.`,
      };
    }
    default:
      return { arrow: '\u2194', heading: conn.label, body: conn.description };
  }
}

interface PairSection {
  otherIdx: number;
  person: PanelPerson;
  conns: Connection[];
  sameSeal: boolean;
  score: number;
}

export default function NodeInfoPanel({ selectedIdx, people, connections, onClose }: Props) {
  const sel = people[selectedIdx];

  const sections = useMemo(() => {
    const result: PairSection[] = [];
    for (let i = 0; i < people.length; i++) {
      if (i === selectedIdx) continue;
      const pairConns = connections.filter(c =>
        (c.indexA === selectedIdx && c.indexB === i) || (c.indexA === i && c.indexB === selectedIdx)
      );
      // Deduplicate
      const seen = new Set<string>();
      const deduped: Connection[] = [];
      let score = 0;
      for (const c of pairConns) {
        const key = `${c.type}:${Math.min(c.indexA, c.indexB)}-${Math.max(c.indexA, c.indexB)}`;
        if (seen.has(key)) continue;
        seen.add(key);
        deduped.push(c);
        const w = CONN_WEIGHTS[c.type] || 0;
        score += MUTUAL_TYPES.has(c.type) ? w * 2 : w;
      }
      result.push({
        otherIdx: i,
        person: people[i],
        conns: deduped,
        sameSeal: sel.sealIndex === people[i].sealIndex,
        score,
      });
    }
    result.sort((a, b) => b.score - a.score || a.person.name.localeCompare(b.person.name));
    return result;
  }, [selectedIdx, people, connections, sel.sealIndex]);

  const totalConns = sections.reduce((s, sec) => s + sec.conns.length + (sec.sameSeal ? 1 : 0), 0);

  if (!sel) return null;

  return (
    <div>
      {/* Sticky header */}
      <div className="sticky top-0 bg-[#f5f0e8] z-10 px-5 pt-5 pb-3 border-b border-[#c9b99a]/30">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#ede7d9] transition-colors text-[#6b4c2a] text-lg"
        >
          &#x2715;
        </button>
        <div className="flex items-center gap-3 mb-2" key={selectedIdx}>
          <GlyphIcon iconFile={sel.sealIcon} sealName={sel.sealName} size={48} />
          <div>
            <p className="text-base font-semibold" style={{ color: sel.profileColor }}>{sel.name}</p>
            <p className="text-sm text-ink-secondary">{sel.fullName}</p>
            <p className="text-xs text-ink-muted">Kin {sel.kin} &middot; Tone {sel.toneNumber} &middot; {sel.toneName}</p>
          </div>
        </div>
        <p className="text-xs text-ink-muted">{totalConns} connection{totalConns !== 1 ? 's' : ''}</p>
      </div>

      {/* Per-person sections */}
      <div key={`content-${selectedIdx}`} className="animate-[fadeIn_200ms_ease]">
        {sections.map(sec => {
            const other = sec.person;
            const barColor = sec.score > 30 ? '#d4a017' : sec.score > 15 ? '#c8a96e' : '#c9b99a';
            const hasContent = sec.conns.length > 0 || sec.sameSeal;
            return (
              <div key={sec.otherIdx}>
                <div className="px-5 py-4">
                  {/* Person header */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-ink-muted text-xs">&rarr;</span>
                    <GlyphIcon iconFile={other.sealIcon} sealName={other.sealName} size={24} />
                    <span className="text-base font-semibold" style={{ color: other.profileColor }}>{other.name}</span>
                  </div>
                  <p className="text-sm text-ink-muted ml-7 mb-2">
                    {other.sealName} &middot; Kin {other.kin}
                  </p>

                  {/* Score bar */}
                  {sec.score > 0 && (
                    <div className="flex items-center gap-2 ml-7 mb-3">
                      <span className="text-sm font-bold text-ink">{sec.score}</span>
                      <div className="w-24 h-1.5 bg-[#ede7d9] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(sec.score / MAX_SCORE) * 100}%`, backgroundColor: barColor }} />
                      </div>
                    </div>
                  )}

                  {/* Same seal notice */}
                  {sec.sameSeal && (
                    <div className="ml-7 mb-3">
                      <p className="text-xs font-bold uppercase tracking-wide mb-0.5" style={{ color: TYPE_COLORS.analog }}>
                        &#x2194; SAME SEAL
                      </p>
                      <p className="text-sm text-[#3D2E1E] leading-relaxed">
                        Both carry the {sel.sealName} seal. You share the same core archetype &mdash; deep recognition and mirrored vision, but also shared blind spots.
                      </p>
                    </div>
                  )}

                  {/* Connection list */}
                  {sec.conns.length > 0 ? (
                    <div className="space-y-3 ml-7">
                      {sec.conns.map((conn, ci) => {
                        const d = describeConnection(conn, sel, other, selectedIdx);
                        return (
                          <div key={ci}>
                            <p className="text-xs font-bold uppercase tracking-wide mb-0.5" style={{ color: TYPE_COLORS[conn.type] || '#6b4c2a' }}>
                              {d.arrow} {d.heading}
                            </p>
                            <p className="text-sm text-[#3D2E1E] leading-relaxed">{d.body}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : !sec.sameSeal ? (
                    <p className="text-sm text-ink-muted italic ml-7">
                      No Dreamspell connections. You operate in different galactic streams.
                    </p>
                  ) : null}
                </div>
                <div className="border-t border-[#c9b99a]/30" />
              </div>
            );
          })}
        </div>
    </div>
  );
}
