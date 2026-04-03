export interface SolarSeal {
  index: number;
  name: string;
  colour: 'Red' | 'White' | 'Blue' | 'Yellow';
  power: string;
  action: string;
  essence: string;
  iconFile: string;
}

export interface GalacticTone {
  number: number;
  name: string;
  action: string;
  power: string;
  essence: string;
}

export const SEALS: SolarSeal[] = [
  { index: 0,  name: 'Dragon',       colour: 'Red',    power: 'Birth',           action: 'Nurtures',     essence: 'Being',         iconFile: '1_dragon.png' },
  { index: 1,  name: 'Wind',         colour: 'White',  power: 'Spirit',          action: 'Communicates', essence: 'Breath',        iconFile: '2_wind.png' },
  { index: 2,  name: 'Night',        colour: 'Blue',   power: 'Abundance',       action: 'Dreams',       essence: 'Intuition',     iconFile: '3_night.png' },
  { index: 3,  name: 'Seed',         colour: 'Yellow', power: 'Flowering',       action: 'Targets',      essence: 'Awareness',     iconFile: '4_seed.png' },
  { index: 4,  name: 'Serpent',      colour: 'Red',    power: 'Life Force',      action: 'Survives',     essence: 'Instinct',      iconFile: '5_serpent.png' },
  { index: 5,  name: 'Worldbridger', colour: 'White',  power: 'Death',           action: 'Equalises',    essence: 'Opportunity',   iconFile: '6_worldbridger.png' },
  { index: 6,  name: 'Hand',         colour: 'Blue',   power: 'Accomplishment',  action: 'Knows',        essence: 'Healing',       iconFile: '7_hand.png' },
  { index: 7,  name: 'Star',         colour: 'Yellow', power: 'Elegance',        action: 'Beautifies',   essence: 'Art',           iconFile: '8_star.png' },
  { index: 8,  name: 'Moon',         colour: 'Red',    power: 'Universal Water', action: 'Purifies',     essence: 'Flow',          iconFile: '9_moon.png' },
  { index: 9,  name: 'Dog',          colour: 'White',  power: 'Heart',           action: 'Loves',        essence: 'Loyalty',       iconFile: '10_dog.png' },
  { index: 10, name: 'Monkey',       colour: 'Blue',   power: 'Magic',           action: 'Plays',        essence: 'Illusion',      iconFile: '11_monkey.png' },
  { index: 11, name: 'Human',        colour: 'Yellow', power: 'Free Will',       action: 'Influences',   essence: 'Wisdom',        iconFile: '12_human.png' },
  { index: 12, name: 'Skywalker',    colour: 'Red',    power: 'Space',           action: 'Explores',     essence: 'Wakefulness',   iconFile: '13_skywalker.png' },
  { index: 13, name: 'Wizard',       colour: 'White',  power: 'Timelessness',    action: 'Enchants',     essence: 'Receptivity',   iconFile: '14_wizard.png' },
  { index: 14, name: 'Eagle',        colour: 'Blue',   power: 'Vision',          action: 'Creates',      essence: 'Mind',          iconFile: '15_eagle.png' },
  { index: 15, name: 'Warrior',      colour: 'Yellow', power: 'Intelligence',    action: 'Questions',    essence: 'Fearlessness',  iconFile: '16_warrior.png' },
  { index: 16, name: 'Earth',        colour: 'Red',    power: 'Navigation',      action: 'Evolves',      essence: 'Synchronicity', iconFile: '17_earth.png' },
  { index: 17, name: 'Mirror',       colour: 'White',  power: 'Endlessness',     action: 'Reflects',     essence: 'Order',         iconFile: '18_mirror.png' },
  { index: 18, name: 'Storm',        colour: 'Blue',   power: 'Self-generation', action: 'Catalyses',    essence: 'Energy',        iconFile: '19_storm.png' },
  { index: 19, name: 'Sun',          colour: 'Yellow', power: 'Universal Fire',  action: 'Enlightens',   essence: 'Life',          iconFile: '20_sun.png' },
];

export const TONES: GalacticTone[] = [
  { number: 1,  name: 'Magnetic',      action: 'Unify',     power: 'Attract',     essence: 'Purpose' },
  { number: 2,  name: 'Lunar',         action: 'Polarise',  power: 'Stabilise',   essence: 'Challenge' },
  { number: 3,  name: 'Electric',      action: 'Activate',  power: 'Bond',        essence: 'Service' },
  { number: 4,  name: 'Self-existing', action: 'Define',    power: 'Measure',     essence: 'Form' },
  { number: 5,  name: 'Overtone',      action: 'Empower',   power: 'Command',     essence: 'Radiance' },
  { number: 6,  name: 'Rhythmic',      action: 'Organise',  power: 'Balance',     essence: 'Equality' },
  { number: 7,  name: 'Resonant',      action: 'Channel',   power: 'Inspire',     essence: 'Attunement' },
  { number: 8,  name: 'Galactic',      action: 'Harmonise', power: 'Model',       essence: 'Integrity' },
  { number: 9,  name: 'Solar',         action: 'Pulse',     power: 'Realise',     essence: 'Intention' },
  { number: 10, name: 'Planetary',     action: 'Perfect',   power: 'Produce',     essence: 'Manifestation' },
  { number: 11, name: 'Spectral',      action: 'Dissolve',  power: 'Release',     essence: 'Liberation' },
  { number: 12, name: 'Crystal',       action: 'Dedicate',  power: 'Cooperate',   essence: 'Universalise' },
  { number: 13, name: 'Cosmic',        action: 'Endure',    power: 'Transcend',   essence: 'Presence' },
];

export const SEAL_COLOUR_HEX: Record<string, string> = {
  Red: '#C4453C',
  White: '#E8E2D6',
  Blue: '#4A7FB5',
  Yellow: '#D4A843',
};

export const SEAL_COLOUR_TEXT: Record<string, string> = {
  Red: 'text-seal-red',
  White: 'text-ink-secondary',
  Blue: 'text-seal-blue',
  Yellow: 'text-seal-yellow',
};
