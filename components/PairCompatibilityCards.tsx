'use client';
import { useState, useMemo, useRef } from 'react';
import type { Connection } from '@/lib/relationships';
import type { KinResult } from '@/lib/dreamspell-calc';
import GlyphIcon from './GlyphIcon';

interface PersonEntry {
  index: number;
  name: string;
  kin: number;
  sealName: string;
  sealColour: string;
  sealIcon: string;
  profileColor: string;
}

interface Props {
  people: PersonEntry[];
  connections: Connection[];
  highlightedPair: [number, number] | null;
  onPairSelect: (pair: [number, number] | null) => void;
}

const CONN_WEIGHTS: Record<string, number> = {
  analog: 5, guide: 4, occult: 4, antipode: 3,
  'colour-family': 2, 'earth-family': 2, wavespell: 1, castle: 1,
};
const MUTUAL_TYPES = new Set(['analog', 'antipode', 'occult', 'colour-family', 'earth-family', 'wavespell', 'castle']);
const MAX_SCORE = 44;

const CONN_META: Record<string, { label: string; sub: string; color: string; sw: number; dash: string }> = {
  analog:          { label: 'Analog',        sub: 'best friend energy',  color: '#C4962C', sw: 1.5, dash: '' },
  antipode:        { label: 'Antipode',      sub: 'growth partner',      color: '#c0392b', sw: 1.2, dash: '4 2' },
  occult:          { label: 'Hidden power',  sub: 'secret gift',         color: '#7d3c98', sw: 1.5, dash: '' },
  guide:           { label: 'Guide',         sub: 'higher-self teacher', color: '#27ae60', sw: 1.5, dash: '' },
  'colour-family': { label: 'Colour family', sub: 'shared purpose',      color: '#2471a3', sw: 1.5, dash: '' },
  'earth-family':  { label: 'Earth family',  sub: 'same tribe',          color: '#8B6914', sw: 1.5, dash: '' },
  wavespell:       { label: 'Wavespell',     sub: 'shared 13-day cycle', color: '#95a5a6', sw: 1.2, dash: '3 2' },
  castle:          { label: 'Castle',        sub: 'shared 52-day court', color: '#bdc3c7', sw: 1.2, dash: '3 2' },
};

type SortMode = 'score' | 'alpha' | 'count';

interface PairData {
  idxA: number;
  idxB: number;
  personA: PersonEntry;
  personB: PersonEntry;
  conns: Connection[];
  score: number;
  mutual: Set<string>;
}

function computePairs(people: PersonEntry[], connections: Connection[]): PairData[] {
  const pairs: PairData[] = [];
  for (let i = 0; i < people.length; i++) {
    for (let j = i + 1; j < people.length; j++) {
      const pairConns = connections.filter(c =>
        (c.indexA === i && c.indexB === j) || (c.indexA === j && c.indexB === i)
      );
      // Deduplicate and detect mutual
      const seen = new Set<string>();
      const mutual = new Set<string>();
      const deduped: Connection[] = [];
      for (const c of pairConns) {
        const key = `${c.type}:${Math.min(c.indexA, c.indexB)}-${Math.max(c.indexA, c.indexB)}`;
        if (seen.has(key)) {
          mutual.add(c.type);
          continue;
        }
        seen.add(key);
        deduped.push(c);
        if (MUTUAL_TYPES.has(c.type)) mutual.add(c.type);
      }
      // Score
      let score = 0;
      for (const c of deduped) {
        const w = CONN_WEIGHTS[c.type] || 0;
        score += mutual.has(c.type) ? w * 2 : w;
      }
      pairs.push({ idxA: i, idxB: j, personA: people[i], personB: people[j], conns: deduped, score, mutual });
    }
  }
  return pairs;
}

function generateInsight(pair: PairData): string {
  const types = pair.conns.map(c => c.type);
  const samesSeal = pair.personA.sealName === pair.personB.sealName;

  if (samesSeal) {
    return `Both carry the ${pair.personA.sealName} seal \u2014 you mirror each other's core essence. This creates deep recognition but also amplifies shared blind spots.`;
  }

  // Multiple oracle connections — check first (most significant)
  const oracleCount = types.filter(t => ['analog', 'antipode', 'occult', 'guide'].includes(t)).length;
  if (oracleCount >= 2) {
    return `Multiple oracle connections \u2014 this is a significant bond in the Dreamspell. You are woven together across several dimensions of destiny.`;
  }

  if (types.includes('analog')) {
    return `Natural allies. Your seals are complementary partners in the Dreamspell \u2014 you strengthen each other effortlessly and share an easy, supportive bond.`;
  }

  if (types.includes('guide')) {
    return `A teacher-student dynamic runs through this bond. One carries wisdom the other needs for their soul growth \u2014 pay attention to what flows between you.`;
  }

  if (types.includes('occult')) {
    return `Hidden depth here. Together you unlock potential that stays dormant when apart \u2014 this connection reveals itself slowly over time.`;
  }

  if (types.includes('antipode')) {
    return `A growth partnership. You challenge each other in ways that feel uncomfortable but ultimately drive evolution. The friction is the gift.`;
  }

  if (types.length > 0 && types.every(t => ['colour-family', 'earth-family', 'wavespell', 'castle'].includes(t))) {
    return `You share structural bonds \u2014 same cosmic neighbourhood, same seasonal rhythms. A quiet, grounding connection rather than a dramatic one.`;
  }

  if (types.length === 0) {
    return `No direct Dreamspell connections \u2014 you operate in different galactic streams. This doesn\u2019t mean no relationship, just that the Tzolkin doesn\u2019t highlight a specific dynamic.`;
  }

  return `A blend of shared cycles and structural bonds connects you \u2014 subtle but steady influences that shape how you relate over time.`;
}

export default function PairCompatibilityCards({ people, connections, highlightedPair, onPairSelect }: Props) {
  const [sortMode, setSortMode] = useState<SortMode>('score');
  const [expandedSet, setExpandedSet] = useState<Set<string>>(() => new Set());
  const [initialized, setInitialized] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const pairs = useMemo(() => computePairs(people, connections), [people, connections]);

  const sorted = useMemo(() => {
    const list = [...pairs];
    switch (sortMode) {
      case 'score':
        list.sort((a, b) => b.score - a.score || b.conns.length - a.conns.length);
        break;
      case 'alpha':
        list.sort((a, b) => a.personA.name.localeCompare(b.personA.name) || a.personB.name.localeCompare(b.personB.name));
        break;
      case 'count':
        list.sort((a, b) => b.conns.length - a.conns.length || b.score - a.score);
        break;
    }
    return list;
  }, [pairs, sortMode]);

  // Initialize expanded set to top 5 on first sort
  if (!initialized && sorted.length > 0) {
    const top5 = new Set(sorted.slice(0, 5).map(p => `${p.idxA}-${p.idxB}`));
    setExpandedSet(top5);
    setInitialized(true);
  }

  const pairKey = (p: PairData) => `${p.idxA}-${p.idxB}`;
  const isExpanded = (p: PairData) => expandedSet.has(pairKey(p));
  const toggleExpand = (p: PairData) => {
    setExpandedSet(prev => {
      const next = new Set(prev);
      const k = pairKey(p);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });
  };

  const expandAll = () => setExpandedSet(new Set(sorted.map(pairKey)));
  const collapseAll = () => setExpandedSet(new Set());

  const handleCardClick = (p: PairData) => {
    toggleExpand(p);
    const pair: [number, number] = [p.idxA, p.idxB];
    if (highlightedPair && highlightedPair[0] === p.idxA && highlightedPair[1] === p.idxB) {
      onPairSelect(null);
    } else {
      onPairSelect(pair);
    }
  };

  const pairCount = sorted.length;

  return (
    <div ref={sectionRef} className="mt-8 mb-6">
      {/* Section header */}
      <p className="section-label mb-1">Compatibility Rankings</p>
      <p className="text-ink-muted text-[10px] mb-4">
        {pairCount} pairs &middot; sorted by {sortMode === 'score' ? 'connection strength' : sortMode === 'alpha' ? 'name' : 'connection count'}
      </p>

      {/* Sort + expand controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="text-ink-muted text-[10px] uppercase tracking-widest">Sort</span>
        {([
          ['score', 'Most compatible'] as const,
          ['alpha', 'Alphabetical'] as const,
          ['count', 'Most connections'] as const,
        ]).map(([mode, label]) => (
          <button
            key={mode}
            onClick={() => setSortMode(mode)}
            className={`text-[10px] px-3 py-1 rounded-full border transition-all ${
              sortMode === mode ? 'border-gold bg-gold/10 text-gold' : 'border-border text-ink-muted hover:border-gold'
            }`}
          >
            {label}
          </button>
        ))}
        <span className="text-border mx-1">|</span>
        <button onClick={expandAll} className="text-[9px] text-gold hover:text-gold/80 transition-colors">Expand all</button>
        <button onClick={collapseAll} className="text-[9px] text-ink-muted hover:text-ink transition-colors">Collapse all</button>
      </div>

      {/* Pair cards */}
      <div className="space-y-2">
        {sorted.map((pair, rank) => {
          const expanded = isExpanded(pair);
          const isHighlighted = highlightedPair && highlightedPair[0] === pair.idxA && highlightedPair[1] === pair.idxB;
          const rankNum = rank + 1;
          const barColor = pair.score > 30 ? '#d4a017' : pair.score > 15 ? '#c8a96e' : '#c9b99a';
          const hasMutualConn = pair.conns.some(c => pair.mutual.has(c.type) || MUTUAL_TYPES.has(c.type));

          return (
            <div
              key={pairKey(pair)}
              className={`bg-[#ede7d9] border rounded-xl overflow-hidden transition-all duration-200 cursor-pointer ${
                isHighlighted ? 'border-gold shadow-golden' : 'border-[#c9b99a] hover:border-gold/50'
              }`}
              onClick={() => handleCardClick(pair)}
            >
              {/* Header row — always visible */}
              <div className="flex items-center gap-3 px-4 py-3">
                {/* Rank */}
                <span className={`text-sm font-bold min-w-[28px] ${rankNum <= 3 ? 'text-gold' : 'text-ink-muted'}`}>
                  #{rankNum}
                </span>

                {/* Seal icons */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <GlyphIcon iconFile={pair.personA.sealIcon} sealName={pair.personA.sealName} size={24} />
                  <GlyphIcon iconFile={pair.personB.sealIcon} sealName={pair.personB.sealName} size={24} />
                </div>

                {/* Names */}
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <span className="font-semibold text-xs truncate" style={{ color: pair.personA.profileColor }}>
                    {pair.personA.name}
                  </span>
                  <span className="text-ink-muted text-[10px] flex-shrink-0">
                    {hasMutualConn ? '\u2194' : '\u2192'}
                  </span>
                  <span className="font-semibold text-xs truncate" style={{ color: pair.personB.profileColor }}>
                    {pair.personB.name}
                  </span>
                </div>

                {/* Score + bar */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-bold text-ink">{pair.score}</span>
                  <div className="w-20 sm:w-32 h-2 bg-parchment rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(pair.score / MAX_SCORE) * 100}%`, backgroundColor: barColor }}
                    />
                  </div>
                </div>

                {/* Expand chevron */}
                <svg className={`w-4 h-4 text-ink-muted transition-transform flex-shrink-0 ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Expanded content */}
              {expanded && (
                <div className="px-4 pb-4 pt-0 border-t border-[#c9b99a]/40" onClick={e => e.stopPropagation()}>
                  {/* Seal identity row */}
                  <div className="flex items-center gap-4 mt-3 mb-3">
                    <div className="flex items-center gap-1.5">
                      <GlyphIcon iconFile={pair.personA.sealIcon} sealName={pair.personA.sealName} size={24} />
                      <span className="text-[10px] text-ink-secondary">{pair.personA.sealName} (Kin {pair.personA.kin})</span>
                    </div>
                    <span className="text-ink-muted text-[10px]">&middot;</span>
                    <div className="flex items-center gap-1.5">
                      <GlyphIcon iconFile={pair.personB.sealIcon} sealName={pair.personB.sealName} size={24} />
                      <span className="text-[10px] text-ink-secondary">{pair.personB.sealName} (Kin {pair.personB.kin})</span>
                    </div>
                  </div>

                  {/* Connection list */}
                  {pair.conns.length > 0 ? (
                    <div className="space-y-1.5 mb-3">
                      <p className="text-[10px] font-semibold text-ink uppercase tracking-widest mb-1">Connections</p>
                      {pair.conns.map((conn, ci) => {
                        const meta = CONN_META[conn.type];
                        const isMutual = pair.mutual.has(conn.type) || MUTUAL_TYPES.has(conn.type);
                        return (
                          <div key={ci} className="flex items-start gap-2">
                            <svg width="22" height="5" className="flex-shrink-0 mt-1">
                              <polygon points="17 0, 22 2.5, 17 5" fill={meta.color} />
                              <line x1="0" y1="2.5" x2="17" y2="2.5" stroke={meta.color} strokeWidth={meta.sw} strokeDasharray={meta.dash || undefined} />
                            </svg>
                            <div className="min-w-0">
                              <span className="text-ink text-xs">
                                <span className="text-ink-muted text-[10px] mr-1">{isMutual ? '\u2194' : '\u2192'}</span>
                                <span className="font-semibold">{meta.label}</span>
                                <span className="text-ink-muted"> &mdash; {meta.sub}</span>
                              </span>
                              {conn.detail && (
                                <p className="text-ink-muted text-[10px]">{conn.detail}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-ink-muted text-xs italic mb-3">No direct Dreamspell connections</p>
                  )}

                  {/* Insight text */}
                  <div className="border-l-2 border-gold/40 pl-3 py-1">
                    <p className="text-ink-secondary text-xs italic leading-relaxed">
                      {generateInsight(pair)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
