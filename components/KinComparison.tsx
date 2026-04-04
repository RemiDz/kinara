'use client';
import { useState, useMemo, useEffect } from 'react';
import { calculateKin, getKinResult, getOracle, getSealIndex, type KinResult, type OracleResult } from '@/lib/dreamspell-calc';
import { SEALS, SEAL_COLOUR_HEX } from '@/lib/dreamspell-data';
import { getColourFamily, getEarthFamily, getCastle, getMasteryPhase, getWavespellNumber } from '@/lib/categories';
import { findConnections, getFrequencyBand, getGroupRecommendation, type Connection } from '@/lib/relationships';
import GlyphIcon from './GlyphIcon';
import ToneSymbol from './ToneSymbol';
import FrequencySpectrum from './FrequencySpectrum';
import ComparisonCard from './ComparisonCard';
import CalendarPicker from './CalendarPicker';
import SynastryReport from './SynastryReport';
import dynamic from 'next/dynamic';
import { loadProfiles, saveProfile, removeProfile, type SavedProfile } from '@/lib/profiles';
import PairCompatibilityCards from './PairCompatibilityCards';
import NodeInfoPanel from './NodeInfoPanel';
import type { PanelPerson } from './NodeInfoPanel';

const ComparisonWheel3D = dynamic(() => import('./ComparisonWheel3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full flex items-center justify-center rounded-2xl bg-parchment-dark/10" style={{ height: '70vh', minHeight: '500px' }}>
      <p className="text-ink-muted text-sm">Loading 3D view...</p>
    </div>
  ),
});

const ENTRY_COLORS = [
  '#C4962C', '#2B8A8A', '#C4654A', '#8B5EB5', '#7B9B6B',
  '#D4864A', '#4A7FB5', '#93623A', '#4B7A4B', '#8B5B7A',
  '#D4A843', '#3A7A7A', '#B5554A', '#6B4E95', '#6B8B5B',
  '#C4764A', '#3A6FA5', '#A3824A', '#5B9A4B', '#7B5B8A',
];

interface Entry {
  id: string;
  name: string;
  day: string;
  month: string;
  year: string;
  kinResult: KinResult | null;
  oracle: OracleResult | null;
}

interface Props {
  onKinsChanged: (kins: { kin: number; color: string; name: string }[]) => void;
}

let nextId = 0;
function createEntry(): Entry {
  return { id: `e${nextId++}`, name: '', day: '', month: '', year: '', kinResult: null, oracle: null };
}

export default function KinComparison({ onKinsChanged }: Props) {
  const [entries, setEntries] = useState<Entry[]>([createEntry(), createEntry()]);
  const [compared, setCompared] = useState(false);
  const [open, setOpen] = useState(false);
  const [profiles, setProfiles] = useState<SavedProfile[]>([]);
  const [view3D, setView3D] = useState(false);
  const [highlightedPair, setHighlightedPair] = useState<[number, number] | null>(null);

  useEffect(() => { setProfiles(loadProfiles()); }, []);

  const updateEntry = (id: string, field: keyof Entry, value: string) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, [field]: value, kinResult: null, oracle: null } : e));
    setCompared(false);
  };

  const updateDate = (id: string, day: string, month: string, year: string) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, day, month, year, kinResult: null, oracle: null } : e));
    setCompared(false);
  };

  const addEntry = () => {
    if (entries.length < 20) {
      setEntries(prev => [...prev, createEntry()]);
      setCompared(false);
    }
  };

  const removeEntry = (id: string) => {
    if (entries.length > 2) {
      setEntries(prev => prev.filter(e => e.id !== id));
      setCompared(false);
    }
  };

  const handleSaveProfile = (entry: Entry) => {
    if (!entry.name || !entry.day || !entry.month || !entry.year) return;
    saveProfile({ name: entry.name, day: entry.day, month: entry.month, year: entry.year });
    setProfiles(loadProfiles());
  };

  const isProfileLoaded = (profile: SavedProfile) => {
    return entries.some(e => e.name.toLowerCase() === profile.name.toLowerCase() && e.day === profile.day && e.month === profile.month && e.year === profile.year);
  };

  const handleLoadProfile = (profile: SavedProfile) => {
    if (isProfileLoaded(profile)) return; // already added
    setEntries(prev => {
      // First try to fill an empty slot
      const empty = prev.findIndex(e => !e.day && !e.month && !e.year && !e.name);
      if (empty >= 0) {
        return prev.map((e, i) => i === empty ? { ...e, name: profile.name, day: profile.day, month: profile.month, year: profile.year, kinResult: null, oracle: null } : e);
      }
      // Otherwise add a new row (up to 20)
      if (prev.length < 20) {
        return [...prev, { ...createEntry(), name: profile.name, day: profile.day, month: profile.month, year: profile.year }];
      }
      return prev;
    });
    setCompared(false);
  };

  const handleSelectAll = () => {
    const newProfiles = profiles.filter(p => !isProfileLoaded(p));
    if (newProfiles.length === 0) return;
    setEntries(prev => {
      let updated = [...prev];
      for (const p of newProfiles) {
        const empty = updated.findIndex(e => !e.day && !e.month && !e.year && !e.name);
        if (empty >= 0) {
          updated[empty] = { ...updated[empty], name: p.name, day: p.day, month: p.month, year: p.year, kinResult: null, oracle: null };
        } else if (updated.length < 20) {
          updated.push({ ...createEntry(), name: p.name, day: p.day, month: p.month, year: p.year });
        }
      }
      return updated;
    });
    setCompared(false);
  };

  const handleClearAll = () => {
    setEntries([createEntry(), createEntry()]);
    setCompared(false);
  };

  const handleRemoveProfile = (id: string) => {
    removeProfile(id);
    setProfiles(loadProfiles());
  };

  const handleCompare = () => {
    const updated = entries.map(e => {
      if (!e.day || !e.month || !e.year) return e;
      const kin = calculateKin(parseInt(e.year), parseInt(e.month), parseInt(e.day));
      if (kin === null) return { ...e, kinResult: null, oracle: null };
      return { ...e, kinResult: getKinResult(kin), oracle: getOracle(kin) };
    });
    setEntries(updated);
    setCompared(true);
    const validKins = updated
      .map((e, i) => e.kinResult ? { kin: e.kinResult.kin, color: ENTRY_COLORS[i], name: e.name || `Person ${i + 1}` } : null)
      .filter(Boolean) as { kin: number; color: string; name: string }[];
    onKinsChanged(validKins);
  };

  const validEntries = entries.filter(e => e.kinResult !== null);

  const allConnections = useMemo(() => {
    if (!compared || validEntries.length < 2) return [];
    const conns: Connection[] = [];
    for (let i = 0; i < validEntries.length; i++) {
      for (let j = i + 1; j < validEntries.length; j++) {
        const a = validEntries[i];
        const b = validEntries[j];
        conns.push(...findConnections(a.kinResult!.kin, b.kinResult!.kin, i, j));
      }
    }
    return conns;
  }, [compared, validEntries]);

  const oracleConns = allConnections.filter(c => ['analog','antipode','occult','guide'].includes(c.type));
  const familyConns = allConnections.filter(c => ['colour-family','earth-family','wavespell','castle'].includes(c.type));

  const groupRec = useMemo(() => {
    if (validEntries.length < 2) return null;
    const colours = validEntries.map(e => e.kinResult!.seal.colour);
    return getGroupRecommendation(colours);
  }, [validEntries]);

  return (
    <section className="py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="gold-divider mb-8" />

        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between py-3"
        >
          <p className="section-label">Kin Comparison</p>
          <svg className={`w-5 h-5 text-ink-muted transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[8000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          {/* Saved profiles — tap to add instantly */}
          {profiles.length > 0 && (
            <div className="mt-4 mb-2">
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="text-ink-muted text-[10px] uppercase tracking-widest self-center mr-1">Saved</span>
                {profiles.map(p => {
                  const loaded = isProfileLoaded(p);
                  return (
                    <button
                      key={p.id}
                      onClick={() => !loaded && handleLoadProfile(p)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs transition-all group ${
                        loaded
                          ? 'bg-gold/10 border-gold/30 text-gold cursor-default'
                          : 'bg-parchment-dark border-border text-ink hover:border-gold hover:shadow-golden cursor-pointer'
                      }`}
                    >
                      {loaded && <span className="text-gold text-[10px]">{'\u2713'}</span>}
                      {p.name}
                      {!loaded && (
                        <span
                          onClick={(e) => { e.stopPropagation(); handleRemoveProfile(p.id); }}
                          className="text-ink-muted hover:text-ink text-sm leading-none ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          &times;
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {profiles.length > 0 && (
                <div className="flex items-center justify-center gap-3 mt-2">
                  <button
                    onClick={handleSelectAll}
                    disabled={profiles.every(p => isProfileLoaded(p))}
                    className="text-sm font-medium px-4 py-1.5 rounded-full bg-[#c8a96e] text-[#2c1a0e] hover:bg-[#b8993e] transition-colors duration-200 disabled:opacity-40 disabled:cursor-default"
                  >
                    Select all ({profiles.length})
                  </button>
                  {entries.some(e => e.day || e.month || e.year || e.name) && (
                    <button
                      onClick={handleClearAll}
                      className="text-sm px-4 py-1.5 rounded-full border border-[#c9b99a] text-[#6b4c2a] hover:bg-[#ede7d9] transition-colors duration-200"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Input area */}
          <div className="space-y-3 mb-6 mt-4 max-w-md mx-auto">
            {entries.map((entry, i) => (
              <div key={entry.id} className="flex items-center gap-2 justify-center">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: ENTRY_COLORS[i] }} />
                <input
                  type="text"
                  placeholder="Name"
                  value={entry.name}
                  onChange={e => updateEntry(entry.id, 'name', e.target.value)}
                  className="bg-parchment-card border border-border text-ink px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-gold transition-all w-28 min-w-0"
                />
                <CalendarPicker
                  day={entry.day}
                  month={entry.month}
                  year={entry.year}
                  onChange={(d, m, y) => updateDate(entry.id, d, m, y)}
                />
                {entry.name && entry.day && entry.month && entry.year && (
                  <button
                    onClick={() => handleSaveProfile(entry)}
                    className={`transition-colors flex-shrink-0 ${profiles.some(p => p.name.toLowerCase() === entry.name.toLowerCase()) ? 'text-gold' : 'text-ink-muted hover:text-gold'}`}
                    title="Save profile"
                  >
                    <svg className="w-4 h-4" fill={profiles.some(p => p.name.toLowerCase() === entry.name.toLowerCase()) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                )}
                {entries.length > 2 && (
                  <button onClick={() => removeEntry(entry.id)} className="text-ink-muted hover:text-ink text-lg leading-none flex-shrink-0">&times;</button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center mb-8">
            {entries.length < 20 && (
              <button onClick={addEntry} className="text-gold text-xs font-semibold hover:text-gold/80 transition-colors">
                + Add Person
              </button>
            )}
            <button
              onClick={handleCompare}
              className="bg-gold text-parchment-card font-semibold px-6 py-2 rounded-full text-sm hover:bg-gold/90 transition-all shadow-golden"
            >
              Compare
            </button>
          </div>

          {/* Side-by-side cards */}
          {compared && validEntries.length >= 2 && (
            <>
              <div className="pb-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {validEntries.map((entry, i) => {
                    const origIdx = entries.indexOf(entry);
                    const kr = entry.kinResult!;
                    const ef = getEarthFamily(kr.seal.index);
                    const mp = getMasteryPhase(kr.seal.index);
                    const castle = getCastle(kr.kin);
                    const freq = getFrequencyBand(kr.seal.colour);
                    return (
                      <div key={entry.id} className="bg-parchment-card border border-border rounded-2xl p-4 shadow-card">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: ENTRY_COLORS[origIdx] }} />
                          <span className="text-ink text-xs font-semibold truncate">{entry.name || `Person ${origIdx + 1}`}</span>
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                          <GlyphIcon iconFile={kr.seal.iconFile} sealName={kr.seal.name} size={48} />
                          <div>
                            <p className="text-gold font-mono text-sm font-bold">Kin {kr.kin}</p>
                            <p className="text-ink text-xs font-semibold">{kr.fullName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <ToneSymbol tone={kr.tone.number} size={24} />
                          <p className="text-ink-secondary text-[10px]">{kr.tone.name} — {kr.tone.action} &middot; {kr.tone.power}</p>
                        </div>
                        <div className="space-y-1 text-[10px]">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SEAL_COLOUR_HEX[kr.seal.colour] }} />
                            <span className="text-ink-secondary">{kr.seal.colour} — {getColourFamily(kr.seal.colour).role}</span>
                          </div>
                          <p className="text-ink-muted">Earth: {ef.name} ({ef.role})</p>
                          <p className="text-ink-muted">Phase: {mp.name}</p>
                          <p className="text-ink-muted">Castle: {castle.colour} #{castle.number}</p>
                          <p className="text-ink-muted">Freq: {freq.range} ({freq.band})</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Relationship Web — 2D/3D toggle */}
              <div className="flex justify-center gap-2 mb-2">
                <button onClick={() => setView3D(false)} className={`text-[10px] px-3 py-1 rounded-full border transition-all ${!view3D ? 'border-gold bg-gold/10 text-gold' : 'border-border text-ink-muted'}`}>2D Wheel</button>
                <button onClick={() => setView3D(true)} className={`text-[10px] px-3 py-1 rounded-full border transition-all ${view3D ? 'border-gold bg-gold/10 text-gold' : 'border-border text-ink-muted'}`}>3D Wheel</button>
              </div>

              {view3D ? (
                <ComparisonWheel3D
                  nodes={validEntries.map((entry, i) => {
                    const origIdx = entries.indexOf(entry);
                    const kr = entry.kinResult!;
                    const angle = (2 * Math.PI * i) / validEntries.length;
                    return {
                      index: i,
                      x: 5 * Math.cos(angle),
                      y: 0,
                      z: 5 * Math.sin(angle),
                      sealName: kr.seal.name,
                      sealColour: kr.seal.colour,
                      kinNumber: kr.kin,
                      personName: entry.name || `Person ${origIdx + 1}`,
                      profileColor: ENTRY_COLORS[origIdx],
                    };
                  })}
                  connections={(() => {
                    const MUTUAL = new Set(['analog','antipode','occult','colour-family','earth-family','wavespell','castle']);
                    const proc: Array<{ type: string; indexA: number; indexB: number; color: string; dashed: boolean; mutual: boolean }> = [];
                    const s = new Set<string>();
                    for (const c of allConnections) {
                      const pk = `${c.type}:${Math.min(c.indexA,c.indexB)}-${Math.max(c.indexA,c.indexB)}`;
                      if (s.has(pk)) { const o = proc.find(p=>p.type===c.type&&Math.min(p.indexA,p.indexB)===Math.min(c.indexA,c.indexB)&&Math.max(p.indexA,p.indexB)===Math.max(c.indexA,c.indexB)); if(o) o.mutual=true; continue; }
                      s.add(pk);
                      proc.push({ type:c.type, indexA:c.indexA, indexB:c.indexB, color:c.color, dashed:c.dashed, mutual:MUTUAL.has(c.type) });
                    }
                    return proc;
                  })()}
                  activeTypes={new Set(['analog','antipode','occult','guide','colour-family','earth-family','wavespell','castle'])}
                  fullscreen={false}
                />
              ) : (
                <RelationshipWeb entries={validEntries} allEntries={entries} connections={allConnections} highlightedPair={highlightedPair} />
              )}

              {/* Pair Compatibility Rankings */}
              <PairCompatibilityCards
                people={validEntries.map((e, i) => {
                  const kr = e.kinResult!;
                  const origIdx = entries.indexOf(e);
                  return {
                    index: i,
                    name: e.name || `Person ${origIdx + 1}`,
                    kin: kr.kin,
                    sealName: kr.seal.name,
                    sealColour: kr.seal.colour,
                    sealIcon: kr.seal.iconFile,
                    profileColor: ENTRY_COLORS[origIdx],
                  };
                })}
                connections={allConnections}
                highlightedPair={highlightedPair}
                onPairSelect={setHighlightedPair}
              />

              {/* Synastry Report */}
              <SynastryReport
                people={validEntries.map((e) => {
                  const kr = e.kinResult!;
                  return { name: e.name || `Person ${entries.indexOf(e) + 1}`, kin: kr.kin, sealIndex: kr.seal.index, sealName: kr.seal.name, sealColour: kr.seal.colour, sealIcon: kr.seal.iconFile };
                })}
                connections={allConnections}
              />

              {/* Frequency Spectrum */}
              <FrequencySpectrum
                people={validEntries.map((e) => ({
                  name: e.name || `Person ${entries.indexOf(e) + 1}`,
                  sealColour: e.kinResult!.seal.colour,
                  sealName: e.kinResult!.seal.name,
                  sealIcon: e.kinResult!.seal.iconFile,
                  entryColor: ENTRY_COLORS[entries.indexOf(e)],
                }))}
              />

              {/* Summary */}
              {allConnections.length > 0 && (
                <div className="bg-parchment-card border border-border rounded-2xl p-6 mt-6 shadow-card">
                  <p className="section-label mb-4">Group Analysis — {validEntries.length} Kins Compared</p>

                  {oracleConns.length > 0 && (
                    <div className="mb-4">
                      <p className="text-ink text-xs font-semibold mb-2">Oracle Connections</p>
                      {oracleConns.map((c, i) => {
                        const nameA = validEntries[c.indexA]?.name || entries[entries.indexOf(validEntries[c.indexA])]?.name || `Person ${c.indexA + 1}`;
                        const nameB = validEntries[c.indexB]?.name || entries[entries.indexOf(validEntries[c.indexB])]?.name || `Person ${c.indexB + 1}`;
                        return (
                          <div key={i} className="flex items-start gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: c.color }} />
                            <div>
                              <p className="text-ink text-xs">
                                <span className="font-semibold">{nameA}</span> ↔ <span className="font-semibold">{nameB}</span> — {c.label}
                              </p>
                              <p className="text-ink-muted text-[10px]">{c.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {familyConns.length > 0 && (
                    <div className="mb-4">
                      <p className="text-ink text-xs font-semibold mb-2">Shared Families</p>
                      {familyConns.map((c, i) => {
                        const nameA = validEntries[c.indexA]?.name || `Person ${c.indexA + 1}`;
                        const nameB = validEntries[c.indexB]?.name || `Person ${c.indexB + 1}`;
                        return (
                          <div key={i} className="flex items-start gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: c.color }} />
                            <p className="text-ink-muted text-xs">{nameA} + {nameB} — {c.label}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {groupRec && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-ink text-xs font-semibold mb-1">Group Frequency Profile: {groupRec.type}</p>
                      <p className="text-ink-muted text-xs">{groupRec.description}</p>
                      <div className="flex gap-2 mt-3">
                        {validEntries.map((e, i) => {
                          const origIdx = entries.indexOf(e);
                          const freq = getFrequencyBand(e.kinResult!.seal.colour);
                          return (
                            <span key={e.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-border text-[10px]">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ENTRY_COLORS[origIdx] }} />
                              {freq.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Shareable Comparison Card */}
              <ComparisonCard
                people={validEntries.map(e => ({
                  name: e.name || `Person ${entries.indexOf(e) + 1}`,
                  kinResult: e.kinResult!,
                  oracle: e.oracle!,
                  color: ENTRY_COLORS[entries.indexOf(e)],
                }))}
                connections={allConnections}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── Relationship Web (SVG) ───────────────────────────────────────────── */

function RelationshipWeb({
  entries: validEntries,
  allEntries,
  connections,
  highlightedPair,
}: {
  entries: Entry[];
  allEntries: Entry[];
  connections: Connection[];
  highlightedPair?: [number, number] | null;
}) {
  const ALL_TYPES = ['analog', 'antipode', 'occult', 'guide', 'colour-family', 'earth-family', 'wavespell', 'castle'];
  const [activeTypes, setActiveTypes] = useState<Set<string>>(() => new Set(ALL_TYPES));
  const toggleType = (t: string) => setActiveTypes(prev => { const n = new Set(prev); if (n.has(t)) n.delete(t); else n.add(t); return n; });
  const [fullscreen, setFullscreen] = useState(false);
  const [linePopup, setLinePopup] = useState<{ x: number; y: number; type: string; indexA: number; indexB: number; mutual: boolean } | null>(null);

  const [autoArrange, setAutoArrange] = useState(true);
  const [selectedNodeIdx, setSelectedNodeIdx] = useState<number | null>(null);

  const size = 800;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.36;
  const nodeR = 46;
  const edgeR = 52;
  const n = validEntries.length;

  // ── Process connections first (needed for arrangement scoring) ──
  const MUTUAL_TYPES = new Set(['analog', 'antipode', 'occult', 'colour-family', 'earth-family', 'wavespell', 'castle']);
  const processed: Array<{ type: string; indexA: number; indexB: number; color: string; dashed: boolean; mutual: boolean }> = [];
  const seen = new Set<string>();
  for (const conn of connections) {
    const pairKey = `${conn.type}:${Math.min(conn.indexA, conn.indexB)}-${Math.max(conn.indexA, conn.indexB)}`;
    if (seen.has(pairKey)) {
      const orig = processed.find(p => p.type === conn.type && Math.min(p.indexA, p.indexB) === Math.min(conn.indexA, conn.indexB) && Math.max(p.indexA, p.indexB) === Math.max(conn.indexA, conn.indexB));
      if (orig) orig.mutual = true;
      continue;
    }
    seen.add(pairKey);
    processed.push({ type: conn.type, indexA: conn.indexA, indexB: conn.indexB, color: conn.color, dashed: conn.dashed, mutual: MUTUAL_TYPES.has(conn.type) });
  }

  // Connection count per node (all types, for badges)
  const connectionCounts: Record<number, number> = {};
  for (let idx = 0; idx < n; idx++) connectionCounts[idx] = 0;
  for (const c of processed) {
    connectionCounts[c.indexA] = (connectionCounts[c.indexA] || 0) + 1;
    connectionCounts[c.indexB] = (connectionCounts[c.indexB] || 0) + 1;
  }

  // ── Compatibility score matrix ──
  const CONN_WEIGHTS: Record<string, number> = { analog: 5, guide: 4, occult: 4, antipode: 3, 'colour-family': 2, 'earth-family': 2, wavespell: 1, castle: 1 };
  const pairScores = new Map<string, number>();
  for (const c of processed) {
    const pk = `${Math.min(c.indexA, c.indexB)}-${Math.max(c.indexA, c.indexB)}`;
    const w = CONN_WEIGHTS[c.type] || 0;
    pairScores.set(pk, (pairScores.get(pk) || 0) + (c.mutual ? w * 2 : w));
  }

  const getScore = (a: number, b: number) => pairScores.get(`${Math.min(a, b)}-${Math.max(a, b)}`) || 0;

  // ── Auto-arrangement: greedy nearest-neighbour + swap optimisation ──
  const arrangement = useMemo(() => {
    if (!autoArrange || n <= 2) return Array.from({ length: n }, (_, i) => i);

    // Find hub (highest total connectivity)
    let hubIdx = 0, hubMax = -1;
    for (let i = 0; i < n; i++) {
      let total = 0;
      for (let j = 0; j < n; j++) if (i !== j) total += getScore(i, j);
      if (total > hubMax) { hubMax = total; hubIdx = i; }
    }

    const order = [hubIdx];
    const placed = new Set([hubIdx]);
    while (order.length < n) {
      const last = order[order.length - 1];
      let best = -1, bestS = -1;
      for (let i = 0; i < n; i++) {
        if (placed.has(i)) continue;
        const s = getScore(last, i);
        if (s > bestS || best === -1) { bestS = s; best = i; }
      }
      order.push(best);
      placed.add(best);
    }

    // Optimisation: pairwise swaps (maximise total adjacency score)
    const benefit = () => {
      let t = 0;
      for (let i = 0; i < n; i++) t += getScore(order[i], order[(i + 1) % n]);
      return t;
    };
    for (let round = 0; round < 3; round++) {
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const before = benefit();
          [order[i], order[j]] = [order[j], order[i]];
          if (benefit() <= before) [order[i], order[j]] = [order[j], order[i]]; // revert if no improvement
        }
      }
    }
    return order;
  }, [autoArrange, n, connections.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Build position map: originalIndex → circlePosition
  const positionOf = new Array(n).fill(0);
  arrangement.forEach((origIdx, pos) => { positionOf[origIdx] = pos; });

  // ── Detect clusters (adjacent nodes with score ≥ threshold) ──
  const clusterThreshold = 4;
  const clusters: number[][] = [];
  if (autoArrange && n >= 3) {
    let cur: number[] = [0];
    for (let i = 1; i < n; i++) {
      if (getScore(arrangement[i - 1], arrangement[i]) >= clusterThreshold) {
        cur.push(i);
      } else {
        if (cur.length >= 3) clusters.push(cur);
        cur = [i];
      }
    }
    if (cur.length >= 3) clusters.push(cur);
  }

  // ── Compute node positions with cluster gap spacing ──
  const gapExtra = 8; // degrees extra between clusters
  const totalClusterGaps = clusters.length > 0 ? clusters.length * gapExtra : 0;
  const baseAngle = n > 0 ? (360 - totalClusterGaps) / n : 0;

  // Mark which positions have a gap BEFORE them
  const gapBefore = new Set<number>();
  for (const cluster of clusters) {
    gapBefore.add(cluster[0]); // gap before first node of each cluster
  }

  const nodeAngles: number[] = [];
  let currentAngle = -90;
  for (let pos = 0; pos < n; pos++) {
    if (gapBefore.has(pos) && pos > 0) currentAngle += gapExtra;
    nodeAngles.push(currentAngle);
    currentAngle += baseAngle;
  }

  const nodes = validEntries.map((entry, i) => {
    const pos = autoArrange ? positionOf[i] : i;
    const angle = n > 0 ? nodeAngles[pos] * (Math.PI / 180) : 0;
    const origIdx = allEntries.indexOf(entry);
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      entry,
      color: ENTRY_COLORS[origIdx],
      label: entry.name || `Person ${origIdx + 1}`,
    };
  });

  // ── Filter visible connections + compute offsets ──
  const visible = processed.filter(c => activeTypes.has(c.type));
  const visPairs = new Map<string, number[]>();
  visible.forEach((c, i) => {
    const pk = `${Math.min(c.indexA, c.indexB)}-${Math.max(c.indexA, c.indexB)}`;
    if (!visPairs.has(pk)) visPairs.set(pk, []);
    visPairs.get(pk)!.push(i);
  });
  const offsets = visible.map((c, i) => {
    const pk = `${Math.min(c.indexA, c.indexB)}-${Math.max(c.indexA, c.indexB)}`;
    const group = visPairs.get(pk)!;
    const idx = group.indexOf(i);
    const total = group.length;
    return total === 1 ? 0 : (idx - (total - 1) / 2) * 4;
  });

  // Marker definitions — smaller arrowheads (5×4)
  const MARKER_DEFS = [
    { id: 'analog', color: '#C4962C' },
    { id: 'antipode', color: '#c0392b' },
    { id: 'occult', color: '#7d3c98' },
    { id: 'guide', color: '#27ae60' },
    { id: 'colour-family', color: '#2471a3' },
    { id: 'earth-family', color: '#8B6914' },
    { id: 'wavespell', color: '#95a5a6' },
    { id: 'castle', color: '#bdc3c7' },
  ];

  // Escape to exit fullscreen
  useEffect(() => {
    if (!fullscreen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setFullscreen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [fullscreen]);

  if (validEntries.length < 2) return null;

  const panelPeople: PanelPerson[] = validEntries.map((entry, i) => {
    const kr = entry.kinResult!;
    const origIdx = allEntries.indexOf(entry);
    return {
      name: entry.name || `Person ${origIdx + 1}`,
      kin: kr.kin, sealName: kr.seal.name, sealColour: kr.seal.colour,
      sealIcon: kr.seal.iconFile, sealIndex: kr.seal.index,
      toneNumber: kr.tone.number, toneName: kr.tone.name,
      fullName: kr.fullName, profileColor: ENTRY_COLORS[origIdx],
    };
  });

  return (
    <div className={fullscreen ? 'fixed inset-0 z-40 bg-parchment flex flex-col items-center justify-center p-4 overflow-auto' : 'flex flex-col items-center my-6 relative'}>
      {/* Controls: auto-arrange toggle + fullscreen */}
      <div className={`flex gap-4 ${fullscreen ? 'absolute top-4 right-4' : 'self-end mb-2'}`}>
        <button
          onClick={() => setAutoArrange(!autoArrange)}
          className={`text-xs flex items-center gap-1 transition-colors ${autoArrange ? 'text-gold' : 'text-ink-muted hover:text-gold'}`}
          title={autoArrange ? 'Switch to entry order' : 'Arrange by compatibility'}
        >
          {autoArrange ? '\u2726 Auto-arranged' : '\u2194 Entry order'}
        </button>
        <button onClick={() => setFullscreen(!fullscreen)} className="text-ink-muted hover:text-gold transition-colors text-xs flex items-center gap-1" title={fullscreen ? 'Exit fullscreen' : 'Expand wheel'}>
          {fullscreen ? '\u2715 Close' : '\u2922 Expand'}
        </button>
      </div>

      {/* Two-column layout: panel + wheel */}
      <div className="flex w-full items-start">
        {/* Desktop panel slot — animated width */}
        <div
          className="hidden md:block overflow-hidden transition-[width] duration-300 ease-out flex-shrink-0"
          style={{ width: selectedNodeIdx !== null ? '360px' : '0px' }}
        >
          <div
            className="w-[360px] overflow-y-auto bg-[#f5f0e8] border-r border-[#c9b99a]/30 rounded-l-xl shadow-[4px_0_20px_rgba(44,26,14,0.06)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            style={{ maxHeight: '700px' }}
          >
            {selectedNodeIdx !== null && (
              <NodeInfoPanel selectedIdx={selectedNodeIdx} people={panelPeople} connections={connections} onClose={() => setSelectedNodeIdx(null)} />
            )}
          </div>
        </div>

        {/* Wheel — takes remaining space */}
        <div className="flex-1 min-w-0 flex items-start justify-center transition-all duration-300">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="max-w-full" style={{ maxWidth: fullscreen ? '90vh' : '900px', width: '100%' }}>
        <defs>
          {MARKER_DEFS.flatMap(m => [
            <marker key={`${m.id}-fwd`} id={`arr-${m.id}`} viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="5" markerHeight="4" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill={m.color} />
            </marker>,
            <marker key={`${m.id}-rev`} id={`arr-${m.id}-rev`} viewBox="0 0 10 7" refX="0" refY="3.5" markerWidth="5" markerHeight="4" orient="auto">
              <polygon points="10 0, 0 3.5, 10 7" fill={m.color} />
            </marker>,
          ])}
        </defs>

        {/* Cluster background arcs */}
        {clusters.map((cluster, ci) => {
          if (cluster.length < 3) return null;
          const startAngle = nodeAngles[cluster[0]] - baseAngle * 0.4;
          const endAngle = nodeAngles[cluster[cluster.length - 1]] + baseAngle * 0.4;
          const sA = startAngle * Math.PI / 180;
          const eA = endAngle * Math.PI / 180;
          const arcR = radius + 20;
          const innerR = radius - 20;
          const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;
          const d = `M ${cx + arcR * Math.cos(sA)} ${cy + arcR * Math.sin(sA)} A ${arcR} ${arcR} 0 ${largeArc} 1 ${cx + arcR * Math.cos(eA)} ${cy + arcR * Math.sin(eA)} L ${cx + innerR * Math.cos(eA)} ${cy + innerR * Math.sin(eA)} A ${innerR} ${innerR} 0 ${largeArc} 0 ${cx + innerR * Math.cos(sA)} ${cy + innerR * Math.sin(sA)} Z`;
          return <path key={`cluster-${ci}`} d={d} fill="rgba(200,169,110,0.06)" />;
        })}

        {/* Connection lines with arrows — offset parallel lines */}
        {visible.map((conn, i) => {
          const a = nodes[conn.indexA];
          const b = nodes[conn.indexB];
          if (!a || !b) return null;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist === 0) return null;
          const nx = dx / dist;
          const ny = dy / dist;
          // Perpendicular offset for parallel lines
          const px = -ny * offsets[i];
          const py = nx * offsets[i];
          const sw = conn.dashed ? 1.2 : 1.5;
          const x1 = a.x + nx * edgeR + px, y1 = a.y + ny * edgeR + py;
          const x2 = b.x - nx * edgeR + px, y2 = b.y - ny * edgeR + py;
          return (
            <g key={i}>
              {/* Invisible wide hit area for click/tap */}
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth={14} className="cursor-pointer"
                onClick={(e) => {
                  const svg = (e.target as SVGElement).closest('svg');
                  if (!svg) return;
                  const pt = svg.createSVGPoint();
                  pt.x = e.clientX; pt.y = e.clientY;
                  const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
                  setLinePopup({ x: svgP.x, y: svgP.y, type: conn.type, indexA: conn.indexA, indexB: conn.indexB, mutual: conn.mutual });
                }}
              />
              {(() => {
                const hp = highlightedPair;
                const isPairConn = hp && (
                  (conn.indexA === hp[0] && conn.indexB === hp[1]) ||
                  (conn.indexA === hp[1] && conn.indexB === hp[0])
                );
                const isNodeConn = selectedNodeIdx !== null && (conn.indexA === selectedNodeIdx || conn.indexB === selectedNodeIdx);
                const hasFilter = hp || selectedNodeIdx !== null;
                const active = hp ? isPairConn : isNodeConn;
                return (
                  <line x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={conn.color}
                    strokeWidth={active ? sw + 0.5 : sw}
                    strokeDasharray={conn.dashed ? '6 4' : undefined}
                    opacity={!hasFilter ? 0.7 : active ? 0.9 : 0.05}
                    pointerEvents="none"
                    markerEnd={`url(#arr-${conn.type})`}
                    markerStart={conn.mutual ? `url(#arr-${conn.type}-rev)` : undefined}
                    style={{ transition: 'opacity 300ms ease, stroke-width 300ms ease' }}
                  />
                );
              })()}
            </g>
          );
        })}

        {/* Nodes — use transform for smooth repositioning */}
        {nodes.map((node, i) => {
          const seal = node.entry.kinResult!.seal;
          const hp = highlightedPair;
          const isInPair = hp ? (i === hp[0] || i === hp[1]) : false;
          const isSelected = hp ? isInPair : selectedNodeIdx === i;
          const hasFilter = hp || selectedNodeIdx !== null;
          const isConnected = !hp && selectedNodeIdx !== null && processed.some(c =>
            (c.indexA === selectedNodeIdx && c.indexB === i) ||
            (c.indexB === selectedNodeIdx && c.indexA === i)
          );
          const nodeOpacity = !hasFilter ? 1 : isSelected ? 1 : isConnected ? 1 : 0.3;
          const nodeScale = isSelected ? 1.15 : 1;
          const count = connectionCounts[i] || 0;
          return (
            <g key={i}
              onClick={() => setSelectedNodeIdx(prev => prev === i ? null : i)}
              style={{
                transform: `translate(${node.x}px, ${node.y}px) scale(${nodeScale})`,
                opacity: nodeOpacity,
                cursor: 'pointer',
                transition: 'transform 300ms ease, opacity 300ms ease',
              }}
            >
              {isSelected && (
                <circle cx={0} cy={0} r={nodeR + 4} fill="none" stroke="#d4a017" strokeWidth={2} opacity={0.6} />
              )}
              <circle cx={0} cy={0} r={nodeR} fill="#FDFBF7" stroke={node.color} strokeWidth={2.5} />
              <circle cx={0} cy={0} r={38} fill={SEAL_COLOUR_HEX[seal.colour]} opacity={0.15} />
              <text x={0} y={-6} textAnchor="middle" fill="#3D2E1E" fontSize={14} fontWeight="bold">
                {seal.name}
              </text>
              <text x={0} y={12} textAnchor="middle" fill="#9B8C7A" fontSize={11}>
                Kin {node.entry.kinResult!.kin}
              </text>
              <text x={0} y={62} textAnchor="middle" fill={node.color} fontSize={13} fontWeight="600">
                {node.label}
              </text>
              {count > 0 && (
                <g transform={`translate(${nodeR * 0.65}, ${nodeR * 0.65})`}>
                  <circle r={11} fill="#c9b99a" stroke="#2c1a0e" strokeWidth={0.5} />
                  <text textAnchor="middle" dominantBaseline="central" fontSize={9} fontWeight="bold" fill="#2c1a0e">
                    {count}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Line click popup */}
        {linePopup && (() => {
          const EXPLAINS: Record<string, string> = {
            analog: 'Natural allies who strengthen each other effortlessly.',
            antipode: 'Mirror opposites who push each other to grow.',
            occult: 'Reveals hidden potential that stays dormant alone.',
            guide: 'A wisdom connection \u2014 one carries a teaching the other needs.',
            'colour-family': 'Share the same fundamental life direction and approach.',
            'earth-family': 'Belong to the same planetary service team.',
            wavespell: 'Fall within the same 13-day creation wave.',
            castle: 'Share the same 52-day life chapter energy.',
          };
          const LABELS: Record<string, string> = {
            analog: 'Analog', antipode: 'Antipode', occult: 'Hidden power', guide: 'Guide',
            'colour-family': 'Colour family', 'earth-family': 'Earth family', wavespell: 'Wavespell', castle: 'Castle',
          };
          const nameA = nodes[linePopup.indexA]?.label || '';
          const nameB = nodes[linePopup.indexB]?.label || '';
          return (
            <g>
              <rect x={0} y={0} width={size} height={size} fill="transparent" onClick={() => setLinePopup(null)} />
              <foreignObject x={Math.min(linePopup.x, size - 220)} y={Math.max(linePopup.y - 80, 10)} width={210} height={90}>
                <div className="bg-[#2c1a0e] text-[#f5f0e8] rounded-lg px-3 py-2 text-xs leading-relaxed shadow-lg">
                  <p className="font-semibold mb-0.5">{nameA} {linePopup.mutual ? '\u2194' : '\u2192'} {nameB}</p>
                  <p className="text-gold text-[10px] mb-0.5">{LABELS[linePopup.type]} &middot; {linePopup.mutual ? 'Mutual' : 'One-way'}</p>
                  <p className="text-[#c9b99a] text-[10px]">{EXPLAINS[linePopup.type]}</p>
                </div>
              </foreignObject>
            </g>
          );
        })()}
      </svg>
        </div>{/* end wheel container */}
      </div>{/* end flex container */}

      {/* Mobile bottom sheet */}
      {selectedNodeIdx !== null && (
        <>
          <div className="md:hidden fixed inset-0 bg-black/20 z-20" onClick={() => setSelectedNodeIdx(null)} />
          <div className="md:hidden fixed inset-x-0 bottom-0 z-30 bg-[#f5f0e8] rounded-t-2xl shadow-[0_-4px_20px_rgba(44,26,14,0.1)] max-h-[70vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] animate-[slideUp_300ms_ease-out]">
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 rounded-full bg-[#c9b99a]" />
            </div>
            <NodeInfoPanel selectedIdx={selectedNodeIdx} people={panelPeople} connections={connections} onClose={() => setSelectedNodeIdx(null)} />
          </div>
        </>
      )}

      {/* Legend — clickable toggles with tooltips */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-6 text-[10px] max-w-2xl">
        {([
          { type: 'analog',        color: '#C4962C', sw: 1.5, dash: '', label: 'Analog',        sub: 'best friend energy',    tip: 'Your natural ally. You share complementary gifts and strengthen each other effortlessly. This is the easiest, most supportive connection.' },
          { type: 'antipode',      color: '#c0392b', sw: 1.2, dash: '4 2', label: 'Antipode',   sub: 'growth partner',        tip: 'Your mirror opposite. This person challenges you to grow by reflecting what you avoid. Friction here is productive \u2014 it pushes both of you to evolve.' },
          { type: 'occult',        color: '#7d3c98', sw: 1.5, dash: '', label: 'Hidden power',  sub: 'secret gift',           tip: 'An unexpected depth between you. This connection reveals hidden potential that neither sees on the surface. Together you unlock abilities that stay dormant alone.' },
          { type: 'guide',         color: '#27ae60', sw: 1.5, dash: '', label: 'Guide',         sub: 'higher-self teacher',   tip: 'A wisdom connection. The guide carries a teaching that the other person needs for their soul growth. This is a mentor-student dynamic, sometimes flowing both ways.' },
          { type: 'colour-family', color: '#2471a3', sw: 1.5, dash: '', label: 'Colour family', sub: 'shared purpose',        tip: 'You face the same direction in life. Same colour family means you share a fundamental approach \u2014 both initiating (Red), refining (White), transforming (Blue), or ripening (Yellow).' },
          { type: 'earth-family',  color: '#8B6914', sw: 1.5, dash: '', label: 'Earth family',  sub: 'same tribe',            tip: 'You belong to the same planetary service team. Your Earth family determines your shared role in the collective \u2014 Polar, Cardinal, Core, Signal, or Gateway.' },
          { type: 'wavespell',     color: '#95a5a6', sw: 1.2, dash: '3 2', label: 'Wavespell',  sub: 'shared 13-day cycle',   tip: 'Your Kin numbers fall within the same 13-day creation wave. You share the same underlying theme and purpose cycle, expressing different tones within it.' },
          { type: 'castle',        color: '#bdc3c7', sw: 1.2, dash: '3 2', label: 'Castle',     sub: 'shared 52-day court',   tip: 'You both live in the same 52-day court of the Tzolkin. This is a broad seasonal connection \u2014 you share the same major life chapter energy.' },
        ] as const).map(item => {
          const on = activeTypes.has(item.type);
          return (
            <div key={item.type} className="group relative">
              <button onClick={() => toggleType(item.type)} className={`flex items-center gap-1.5 cursor-pointer transition-all ${on ? 'opacity-100' : 'opacity-25'}`}>
                <svg width="22" height="5"><polygon points="17 0, 22 2.5, 17 5" fill={item.color} /><line x1="0" y1="2.5" x2="17" y2="2.5" stroke={item.color} strokeWidth={item.sw} strokeDasharray={item.dash || undefined} /></svg>
                <span className="text-ink">{item.label}</span>
                <span className="text-ink-muted hidden sm:inline border-b border-dotted border-ink-muted/30">&mdash; {item.sub}</span>
                <span className="text-ink-muted/40 text-[8px] ml-0.5">?</span>
              </button>
              {/* Tooltip */}
              <div className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#2c1a0e] text-[#f5f0e8] text-[10px] rounded-lg px-3 py-2 max-w-[280px] w-max shadow-lg z-30 leading-relaxed pointer-events-none">
                {item.tip}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[#2c1a0e]" />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 mt-2">
        <button onClick={() => setActiveTypes(new Set(ALL_TYPES))} className="text-[9px] text-gold hover:text-gold/80 transition-colors">Show all</button>
        <button onClick={() => setActiveTypes(new Set())} className="text-[9px] text-ink-muted hover:text-ink transition-colors">Hide all</button>
      </div>
      <p className="text-[9px] text-ink-muted mt-1">&rarr; one-way &nbsp;&middot;&nbsp; &harr; mutual &nbsp;&middot;&nbsp; click legend to filter</p>
    </div>
  );
}
