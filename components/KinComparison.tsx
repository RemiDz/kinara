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
import { loadProfiles, saveProfile, removeProfile, type SavedProfile } from '@/lib/profiles';

const ENTRY_COLORS = ['#C4962C', '#2B8A8A', '#C4654A', '#8B5EB5', '#7B9B6B'];

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
  onKinsChanged: (kins: { kin: number; color: string }[]) => void;
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
    if (entries.length < 5) {
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

  const handleLoadProfile = (profile: SavedProfile) => {
    setEntries(prev => {
      const empty = prev.findIndex(e => !e.day && !e.month && !e.year && !e.name);
      if (empty >= 0) {
        return prev.map((e, i) => i === empty ? { ...e, name: profile.name, day: profile.day, month: profile.month, year: profile.year, kinResult: null, oracle: null } : e);
      }
      if (prev.length < 5) {
        return [...prev, { ...createEntry(), name: profile.name, day: profile.day, month: profile.month, year: profile.year }];
      }
      return prev;
    });
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
      .map((e, i) => e.kinResult ? { kin: e.kinResult.kin, color: ENTRY_COLORS[i] } : null)
      .filter(Boolean) as { kin: number; color: string }[];
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

        <div className={`transition-all duration-300 ${open ? 'max-h-[5000px] opacity-100 overflow-visible' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          {/* Saved profiles */}
          {profiles.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mt-4 mb-2">
              <span className="text-ink-muted text-[10px] uppercase tracking-widest self-center mr-1">Saved</span>
              {profiles.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleLoadProfile(p)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-parchment-dark border border-border text-xs text-ink hover:border-gold hover:shadow-golden transition-all group"
                >
                  {p.name}
                  <span
                    onClick={(e) => { e.stopPropagation(); handleRemoveProfile(p.id); }}
                    className="text-ink-muted hover:text-ink text-sm leading-none ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    &times;
                  </span>
                </button>
              ))}
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
            {entries.length < 5 && (
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
              <div className="overflow-x-auto pb-4 -mx-2">
                <div className="flex gap-3 px-2" style={{ minWidth: validEntries.length * 220 }}>
                  {validEntries.map((entry, i) => {
                    const origIdx = entries.indexOf(entry);
                    const kr = entry.kinResult!;
                    const ef = getEarthFamily(kr.seal.index);
                    const mp = getMasteryPhase(kr.seal.index);
                    const castle = getCastle(kr.kin);
                    const freq = getFrequencyBand(kr.seal.colour);
                    return (
                      <div key={entry.id} className="flex-shrink-0 w-52 bg-parchment-card border border-border rounded-2xl p-4 shadow-card">
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

              {/* Relationship Web (SVG) */}
              <RelationshipWeb entries={validEntries} allEntries={entries} connections={allConnections} />

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
}: {
  entries: Entry[];
  allEntries: Entry[];
  connections: Connection[];
}) {
  if (validEntries.length < 2) return null;

  const size = 360;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.34;
  const n = validEntries.length;

  const nodes = validEntries.map((entry, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    const origIdx = allEntries.indexOf(entry);
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      entry,
      color: ENTRY_COLORS[origIdx],
      label: entry.name || `Person ${origIdx + 1}`,
    };
  });

  return (
    <div className="flex justify-center my-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="max-w-full">
        {/* Connection lines */}
        {connections.map((conn, i) => {
          const a = nodes[conn.indexA];
          const b = nodes[conn.indexB];
          if (!a || !b) return null;
          return (
            <line
              key={i}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={conn.color}
              strokeWidth={conn.thickness}
              strokeDasharray={conn.dashed ? '6 4' : undefined}
              opacity={0.7}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const seal = node.entry.kinResult!.seal;
          return (
            <g key={i}>
              <circle cx={node.x} cy={node.y} r={28} fill="#FDFBF7" stroke={node.color} strokeWidth={2.5} />
              <circle cx={node.x} cy={node.y} r={22} fill={SEAL_COLOUR_HEX[seal.colour]} opacity={0.15} />
              <text x={node.x} y={node.y - 2} textAnchor="middle" fill="#3D2E1E" fontSize={9} fontWeight="bold">
                {seal.name}
              </text>
              <text x={node.x} y={node.y + 10} textAnchor="middle" fill="#9B8C7A" fontSize={7}>
                Kin {node.entry.kinResult!.kin}
              </text>
              {/* Name label outside */}
              <text
                x={node.x}
                y={node.y + 38}
                textAnchor="middle"
                fill={node.color}
                fontSize={9}
                fontWeight="600"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
