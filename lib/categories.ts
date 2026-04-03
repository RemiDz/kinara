import { SEALS, type SolarSeal } from './dreamspell-data';

// ── Colour Families ──────────────────────────────────────────────────────────
export interface ColourFamily {
  colour: string;
  role: string;
  keynote: string;
  description: string;
  sealIndices: number[];
}

export const COLOUR_FAMILIES: ColourFamily[] = [
  { colour: 'Red',    role: 'Initiators',   keynote: 'Birth',        description: 'You begin things. You spark energy into motion.',                            sealIndices: [0, 4, 8, 12, 16] },
  { colour: 'White',  role: 'Refiners',     keynote: 'Death/Release', description: 'You clarify and distil. You strip away the unnecessary.',                   sealIndices: [1, 5, 9, 13, 17] },
  { colour: 'Blue',   role: 'Transformers', keynote: 'Magic',        description: 'You change things. You take what exists and make it new.',                   sealIndices: [2, 6, 10, 14, 18] },
  { colour: 'Yellow', role: 'Ripeners',     keynote: 'Intelligence', description: 'You bring things to fruition. You mature and harvest.',                      sealIndices: [3, 7, 11, 15, 19] },
];

export function getColourFamily(sealColour: string): ColourFamily {
  return COLOUR_FAMILIES.find(f => f.colour === sealColour) ?? COLOUR_FAMILIES[0];
}

// ── Earth Families ───────────────────────────────────────────────────────────
export interface EarthFamily {
  name: string;
  role: string;
  description: string;
  sealIndices: number[];
}

export const EARTH_FAMILIES: EarthFamily[] = [
  { name: 'Polar',    role: 'Receive',   description: 'You receive galactic information and ground it into awareness.',        sealIndices: [19, 4, 9, 14] },
  { name: 'Cardinal', role: 'Catalyse',  description: 'You initiate action and catalyse new directions.',                     sealIndices: [0, 5, 10, 15] },
  { name: 'Core',     role: 'Process',   description: 'You process and transform energy at the core.',                        sealIndices: [2, 6, 11, 16] },
  { name: 'Signal',   role: 'Transmit',  description: 'You signal and transmit galactic frequencies to the world.',            sealIndices: [3, 7, 12, 17] },
  { name: 'Gateway',  role: 'Transport', description: 'You open gateways between worlds and transport consciousness.',         sealIndices: [8, 1, 13, 18] },
];

export function getEarthFamily(sealIndex: number): EarthFamily {
  return EARTH_FAMILIES.find(f => f.sealIndices.includes(sealIndex)) ?? EARTH_FAMILIES[0];
}

export function getEarthFamilySeals(family: EarthFamily): SolarSeal[] {
  return family.sealIndices.map(i => SEALS[i]);
}

// ── Five Phases of Self-Mastery ──────────────────────────────────────────────
export interface MasteryPhase {
  name: string;
  sealRange: [number, number]; // inclusive
  description: string;
}

export const MASTERY_PHASES: MasteryPhase[] = [
  { name: 'Re-awakening', sealRange: [0, 3],   description: 'Awakening to your true nature and cosmic identity. You are remembering who you truly are — waking up to the codes written in your being. This is the phase of birth, breath, dream, and intention — the primal emergence of consciousness recognising itself.' },
  { name: 'Reconnecting', sealRange: [4, 7],   description: 'Reconnecting to the web of life, to others, to the Earth, and to Spirit. Building bridges between dimensions of your experience. Learning to feel, touch, and communicate with the deeper fabric of reality. Life force, surrender, accomplishment, and beauty weave together here.' },
  { name: 'Integrating',  sealRange: [8, 11],  description: 'Integrating all aspects of yourself — the emotional, the loyal, the playful, the free-willed. Bringing together the parts that have been separated. Becoming whole through acceptance of all your expressions. Flow, love, magic, and choice unite in this phase.' },
  { name: 'Expanding',    sealRange: [12, 15], description: 'Expanding beyond known boundaries. Exploring new dimensions, reclaiming your timelessness, gaining higher vision, and finding the courage to question everything. Space, receptivity, vision, and fearlessness carry you beyond the familiar.' },
  { name: 'Re-generating', sealRange: [16, 19], description: 'Regenerating and completing the cycle. Navigating by synchronicity, reflecting truth without distortion, catalysing transformation, and radiating unconditional light. The mastery of enlightened being — evolution, endlessness, self-generation, and universal fire.' },
];

export function getMasteryPhase(sealIndex: number): MasteryPhase {
  return MASTERY_PHASES[Math.floor(sealIndex / 4)];
}

// ── Castles ──────────────────────────────────────────────────────────────────
export interface Castle {
  number: number;
  name: string;
  colour: string;
  court: string;
  kinRange: [number, number];
  description: string;
}

export const CASTLES: Castle[] = [
  { number: 1, name: 'Red Eastern Castle of Turning',       colour: 'Red',    court: 'Court of Birth',           kinRange: [1, 52],    description: 'The castle of initiation and birth. Here the journey begins — raw energy is turned into purpose.' },
  { number: 2, name: 'White Northern Castle of Crossing',   colour: 'White',  court: 'Court of Death',           kinRange: [53, 104],  description: 'The castle of refinement and crossing. Here you face the challenge, release what no longer serves, and cross into clarity.' },
  { number: 3, name: 'Blue Western Castle of Burning',      colour: 'Blue',   court: 'Court of Magic',           kinRange: [105, 156], description: 'The castle of transformation and burning. Here magic is made — deep change forges you into something new.' },
  { number: 4, name: 'Yellow Southern Castle of Giving',    colour: 'Yellow', court: 'Court of Intelligence',    kinRange: [157, 208], description: 'The castle of fruition and giving. Here you harvest your gifts and share them with the world.' },
  { number: 5, name: 'Green Central Castle of Enchantment', colour: 'Green',  court: 'Court of Synchronisation', kinRange: [209, 260], description: 'The castle of enchantment and synchronisation. Here all threads weave together — you synchronise with the galactic whole.' },
];

export function getCastle(kin: number): Castle {
  return CASTLES.find(c => kin >= c.kinRange[0] && kin <= c.kinRange[1]) ?? CASTLES[0];
}

// ── Wavespell ────────────────────────────────────────────────────────────────
export function getWavespellNumber(kin: number): number {
  return Math.floor((kin - 1) / 13) + 1;
}

export function getWavespellSeal(kin: number): SolarSeal {
  const startKin = (getWavespellNumber(kin) - 1) * 13 + 1;
  const sealIndex = (startKin - 1) % 20;
  return SEALS[sealIndex];
}

export function getWavespellPosition(kin: number): number {
  return ((kin - 1) % 13) + 1;
}
