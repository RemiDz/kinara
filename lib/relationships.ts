import { getSealIndex, getToneNumber, getOracle } from './dreamspell-calc';
import { SEALS } from './dreamspell-data';
import { getColourFamily, getEarthFamily, getCastle, getWavespellNumber } from './categories';

export interface Connection {
  type: 'analog' | 'antipode' | 'occult' | 'guide' | 'colour-family' | 'earth-family' | 'wavespell' | 'castle';
  indexA: number;
  indexB: number;
  label: string;
  detail: string;
  description: string;
  color: string;
  dashed: boolean;
  thickness: number;
  arrow: boolean;
}

const ORACLE_STYLES: Record<string, { color: string; dashed: boolean; thickness: number }> = {
  analog:   { color: '#C4962C', dashed: false, thickness: 3 },
  antipode: { color: '#c0392b', dashed: true,  thickness: 3 },
  occult:   { color: '#7d3c98', dashed: false, thickness: 3 },
  guide:    { color: '#27ae60', dashed: false, thickness: 3 },
};

const FAMILY_STYLES: Record<string, { color: string; dashed: boolean; thickness: number }> = {
  'colour-family': { color: '#2471a3', dashed: false, thickness: 1.5 },
  'earth-family':  { color: '#8B6914', dashed: false, thickness: 1.5 },
  wavespell:       { color: '#95a5a6', dashed: true,  thickness: 1 },
  castle:          { color: '#bdc3c7', dashed: true,  thickness: 1 },
};

export function findConnections(kinA: number, kinB: number, idxA: number, idxB: number): Connection[] {
  const sealA = getSealIndex(kinA);
  const sealB = getSealIndex(kinB);
  const oracleA = getOracle(kinA);
  const oracleB = getOracle(kinB);
  const connections: Connection[] = [];

  // Oracle: Analog (symmetric — if A's analog seal = B's seal)
  if (oracleA.analog.index === sealB) {
    connections.push({
      type: 'analog', indexA: idxA, indexB: idxB,
      label: 'Analog (Support)',
      detail: `${SEALS[sealA].name} \u2194 ${SEALS[sealB].name}`,
      description: `These two seals are Analog partners — they naturally amplify and support each other's energy. Together they create a harmonious resonance.`,
      ...ORACLE_STYLES.analog, arrow: false,
    });
  }

  // Oracle: Antipode (symmetric)
  if (oracleA.antipode.index === sealB) {
    connections.push({
      type: 'antipode', indexA: idxA, indexB: idxB,
      label: 'Antipode (Challenge)',
      detail: `${SEALS[sealA].name} \u2194 ${SEALS[sealB].name}`,
      description: `These two seals challenge each other — creating productive tension that drives growth and stretches both beyond comfort zones.`,
      ...ORACLE_STYLES.antipode, arrow: false,
    });
  }

  // Oracle: Occult (symmetric)
  if (oracleA.occult.index === sealB) {
    connections.push({
      type: 'occult', indexA: idxA, indexB: idxB,
      label: 'Occult (Hidden Power)',
      detail: `${SEALS[sealA].name} \u2194 ${SEALS[sealB].name}`,
      description: `A deep, unconscious bond. These seals unlock hidden power in each other — gifts that neither may fully recognise alone.`,
      ...ORACLE_STYLES.occult, arrow: false,
    });
  }

  // Oracle: Guide (directional — B guides A)
  if (oracleA.guide.index === sealB) {
    connections.push({
      type: 'guide', indexA: idxA, indexB: idxB,
      label: 'Guide',
      detail: `${SEALS[sealB].name} guides ${SEALS[sealA].name}`,
      description: `${SEALS[sealB].name} serves as a guiding force for ${SEALS[sealA].name} — illuminating the path and offering direction.`,
      ...ORACLE_STYLES.guide, arrow: true,
    });
  }
  // Reverse guide check
  if (oracleB.guide.index === sealA) {
    connections.push({
      type: 'guide', indexA: idxB, indexB: idxA,
      label: 'Guide',
      detail: `${SEALS[sealA].name} guides ${SEALS[sealB].name}`,
      description: `${SEALS[sealA].name} serves as a guiding force for ${SEALS[sealB].name} — illuminating the path and offering direction.`,
      ...ORACLE_STYLES.guide, arrow: true,
    });
  }

  // Shared Colour Family (skip if oracle connection already found for this pair)
  const hasOracle = connections.some(c => ['analog','antipode','occult','guide'].includes(c.type));
  if (SEALS[sealA].colour === SEALS[sealB].colour) {
    const family = getColourFamily(SEALS[sealA].colour);
    connections.push({
      type: 'colour-family', indexA: idxA, indexB: idxB,
      label: `Same Colour Family (${family.colour})`,
      detail: `Both ${family.role}`,
      description: `Both carry ${family.colour} energy — ${family.description}`,
      ...FAMILY_STYLES['colour-family'], arrow: false,
    });
  }

  // Shared Earth Family
  const efA = getEarthFamily(sealA);
  const efB = getEarthFamily(sealB);
  if (efA.name === efB.name) {
    connections.push({
      type: 'earth-family', indexA: idxA, indexB: idxB,
      label: `Same Earth Family (${efA.name})`,
      detail: `Both ${efA.role}`,
      description: `Both belong to the ${efA.name} Earth Family — ${efA.description}`,
      ...FAMILY_STYLES['earth-family'], arrow: false,
    });
  }

  // Same Wavespell
  if (getWavespellNumber(kinA) === getWavespellNumber(kinB)) {
    connections.push({
      type: 'wavespell', indexA: idxA, indexB: idxB,
      label: `Same Wavespell (#${getWavespellNumber(kinA)})`,
      detail: 'Same 13-day journey',
      description: 'These Kins share the same 13-day Wavespell journey — they ride the same creative wave.',
      ...FAMILY_STYLES.wavespell, arrow: false,
    });
  }

  // Same Castle
  const castleA = getCastle(kinA);
  const castleB = getCastle(kinB);
  if (castleA.number === castleB.number) {
    connections.push({
      type: 'castle', indexA: idxA, indexB: idxB,
      label: `Same Castle (${castleA.colour})`,
      detail: castleA.court,
      description: `Both reside in the ${castleA.name} — ${castleA.court}. They share the same overarching cycle of transformation.`,
      ...FAMILY_STYLES.castle, arrow: false,
    });
  }

  return connections;
}

// Frequency band mapping by seal colour
export type FrequencyBand = 'theta' | 'alpha' | 'beta' | 'gamma';

export interface FrequencyInfo {
  band: FrequencyBand;
  label: string;
  range: string;
  brainwave: string;
  healerType: string;
}

const FREQUENCY_MAP: Record<string, FrequencyInfo> = {
  Blue:   { band: 'theta', label: 'Theta',  range: '4–8 Hz',    brainwave: 'Theta', healerType: 'Visionary Healers' },
  White:  { band: 'alpha', label: 'Alpha',  range: '8–12 Hz',   brainwave: 'Alpha', healerType: 'Heart Healers' },
  Red:    { band: 'beta',  label: 'Beta',   range: '12–30 Hz',  brainwave: 'Beta',  healerType: 'Activator Healers' },
  Yellow: { band: 'gamma', label: 'Gamma',  range: '30–100 Hz', brainwave: 'Gamma', healerType: 'Wisdom Healers' },
};

export function getFrequencyBand(sealColour: string): FrequencyInfo {
  return FREQUENCY_MAP[sealColour] ?? FREQUENCY_MAP.Blue;
}

export function getFrequencyCompatibility(colourA: string, colourB: string): { label: string; badge: string; color: string } {
  const bandA = FREQUENCY_MAP[colourA]?.band;
  const bandB = FREQUENCY_MAP[colourB]?.band;
  if (bandA === bandB) return { label: 'Resonant Match', badge: 'Naturally harmonise', color: '#C4962C' };

  const order: FrequencyBand[] = ['theta', 'alpha', 'beta', 'gamma'];
  const diff = Math.abs(order.indexOf(bandA) - order.indexOf(bandB));
  if (diff === 1) return { label: 'Harmonic Bridge', badge: 'Complementary energies', color: '#27ae60' };
  return { label: 'Dynamic Tension', badge: 'Energising contrast', color: '#e67e22' };
}

export function getGroupRecommendation(colours: string[]): { type: string; description: string } {
  const bands = colours.map(c => FREQUENCY_MAP[c]?.band).filter(Boolean);
  const unique = new Set(bands);

  if (unique.size === 1) {
    const info = Object.values(FREQUENCY_MAP).find(f => f.band === bands[0])!;
    return {
      type: 'Deep Resonance',
      description: `All members share ${info.label} frequency — use ${info.healerType.toLowerCase()} instruments throughout for deep group resonance.`,
    };
  }

  const order: FrequencyBand[] = ['theta', 'alpha', 'beta', 'gamma'];
  const indices = [...unique].map(b => order.indexOf(b)).sort();
  const spread = indices[indices.length - 1] - indices[0];

  if (spread <= 1) {
    return {
      type: 'Harmonic Bridge',
      description: 'Adjacent frequency bands — layer instruments from low to high, building a harmonic bridge between the group\'s energies.',
    };
  }
  if (unique.size >= 3) {
    return {
      type: 'Full Spectrum',
      description: 'A balanced spread across frequency bands — journey through all frequencies from grounding to expansive for a complete group experience.',
    };
  }
  return {
    type: 'Dynamic Spectrum',
    description: 'Contrasting frequency bands — alternate grounding and expansive instruments to create dynamic energy movement within the group.',
  };
}
