import { SEALS, TONES, type SolarSeal, type GalacticTone } from './dreamspell-data';

export interface KinResult {
  kin: number;
  seal: SolarSeal;
  tone: GalacticTone;
  fullName: string;
}

export interface OracleResult {
  guide: SolarSeal;
  analog: SolarSeal;
  antipode: SolarSeal;
  occult: SolarSeal;
}

// Reference: July 26, 2013 = Kin 164 (Yellow Galactic Seed)
const REF_YEAR = 2013;
const REF_MONTH = 6; // July (0-indexed)
const REF_DAY = 26;
const REF_KIN = 164;

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function countFeb29sBetween(
  startY: number, startM: number, startD: number,
  endY: number, endM: number, endD: number
): number {
  let count = 0;
  const minYear = Math.min(startY, endY);
  const maxYear = Math.max(startY, endY);

  for (let y = minYear; y <= maxYear; y++) {
    if (!isLeapYear(y)) continue;
    const feb29Ms = Date.UTC(y, 1, 29);
    const startMs = Date.UTC(startY, startM, startD);
    const endMs = Date.UTC(endY, endM, endD);
    const lo = Math.min(startMs, endMs);
    const hi = Math.max(startMs, endMs);
    if (feb29Ms > lo && feb29Ms <= hi) count++;
  }
  return count;
}

/**
 * Calculate the Dreamspell Kin for a Gregorian date.
 * Month is 1-based (January = 1).
 * Returns null for February 29 (0.0 Hunab Ku).
 */
export function calculateKin(year: number, month: number, day: number): number | null {
  const m = month - 1;
  if (m === 1 && day === 29 && isLeapYear(year)) return null;

  const targetMs = Date.UTC(year, m, day);
  const refMs = Date.UTC(REF_YEAR, REF_MONTH, REF_DAY);
  const diffDays = Math.round((targetMs - refMs) / 86400000);

  const leapCount = countFeb29sBetween(REF_YEAR, REF_MONTH, REF_DAY, year, m, day);
  const sign = diffDays >= 0 ? 1 : -1;
  const adjustedDays = diffDays - sign * leapCount;

  return ((REF_KIN - 1 + adjustedDays) % 260 + 260) % 260 + 1;
}

export function getSealIndex(kin: number): number {
  return (kin - 1) % 20;
}

export function getToneNumber(kin: number): number {
  return ((kin - 1) % 13) + 1;
}

export function getKinResult(kin: number): KinResult {
  const sealIndex = getSealIndex(kin);
  const toneNumber = getToneNumber(kin);
  const seal = SEALS[sealIndex];
  const tone = TONES[toneNumber - 1];
  const fullName = `${seal.colour} ${tone.name} ${seal.name}`;
  return { kin, seal, tone, fullName };
}

/**
 * Oracle calculation — ported from DeepWhisper.
 * Analog: seal pairs sum to 17
 * Antipode: seal + 10 (mod 20)
 * Occult: seal pairs sum to 19
 * Guide: tone-dependent, same colour family
 */
export function getOracle(kin: number): OracleResult {
  const sealIndex = getSealIndex(kin);
  const toneNumber = getToneNumber(kin);

  const analogIndex = (17 - sealIndex + 20) % 20;
  const antipodeIndex = (sealIndex + 10) % 20;
  const occultIndex = (19 - sealIndex + 20) % 20;
  const guideIndex = getGuideSealIndex(sealIndex, toneNumber);

  return {
    guide: SEALS[guideIndex],
    analog: SEALS[analogIndex],
    antipode: SEALS[antipodeIndex],
    occult: SEALS[occultIndex],
  };
}

const GUIDE_OFFSETS: Record<number, number> = {
  1: 0, 6: 0, 11: 0,
  2: 12, 7: 12, 12: 12,
  3: 4, 8: 4, 13: 4,
  4: 16, 9: 16,
  5: 8, 10: 8,
};

function getGuideSealIndex(sealIndex: number, toneNumber: number): number {
  return (sealIndex + (GUIDE_OFFSETS[toneNumber] ?? 0)) % 20;
}

export function getKinName(kin: number): string {
  const seal = SEALS[getSealIndex(kin)];
  const tone = TONES[getToneNumber(kin) - 1];
  return `${seal.colour} ${tone.name} ${seal.name}`;
}
