/**
 * Deep Audit: Verify ALL oracle relationships and connections
 * Independent implementation cross-checked against the app's calc engine
 */
import { calculateKin, getKinResult, getOracle, getSealIndex, getToneNumber } from '@/lib/dreamspell-calc';
import { SEALS } from '@/lib/dreamspell-data';
import { getEarthFamily, getColourFamily, getCastle, getWavespellNumber } from '@/lib/categories';
import { findConnections, type Connection } from '@/lib/relationships';

// ─── Independent Implementation (from scratch) ─────────────────────────────

const SEAL_NAMES = [
  'Dragon','Wind','Night','Seed','Serpent','Worldbridger','Hand','Star',
  'Moon','Dog','Monkey','Human','Skywalker','Wizard','Eagle','Warrior',
  'Earth','Mirror','Storm','Sun',
];
const TONE_NAMES = [
  '','Magnetic','Lunar','Electric','Self-existing','Overtone','Rhythmic',
  'Resonant','Galactic','Solar','Planetary','Spectral','Crystal','Cosmic',
];
const COLOURS = ['Red','White','Blue','Yellow'];

const EARTH_FAM: Record<string, number[]> = {
  Polar:    [19, 4, 9, 14],
  Cardinal: [0, 5, 10, 15],
  Core:     [2, 6, 11, 16],
  Signal:   [3, 7, 12, 17],
  Gateway:  [8, 1, 13, 18],
};

const GUIDE_OFFSETS: Record<number, number> = {
  1:0, 6:0, 11:0,  2:12, 7:12, 12:12,  3:4, 8:4, 13:4,  4:16, 9:16,  5:8, 10:8,
};

// Independent formula implementations
const indSeal = (kin: number) => (kin - 1) % 20;
const indTone = (kin: number) => ((kin - 1) % 13) + 1;
const indAnalog = (s: number) => (17 - s + 20) % 20;
const indAntipode = (s: number) => (s + 10) % 20;
const indOccult = (s: number) => (19 - s + 20) % 20;
const indGuide = (s: number, t: number) => (s + GUIDE_OFFSETS[t]) % 20;
const indColour = (s: number) => COLOURS[s % 4];
const indEarthFam = (s: number) => Object.entries(EARTH_FAM).find(([, m]) => m.includes(s))?.[0] ?? null;
const indWavespell = (kin: number) => Math.floor((kin - 1) / 13) + 1;
const indCastle = (kin: number) => Math.floor((kin - 1) / 52) + 1;

// ─── Test Profiles ──────────────────────────────────────────────────────────

const PROFILES = [
  { name: 'Remi',      kin: 143 },
  { name: 'Jolanta',   kin: 148 },
  { name: 'Leja',      kin: 70  },
  { name: 'Azuolas',   kin: 201 },
  { name: 'Rmigijus',  kin: 150 },
  { name: 'Mamyte',    kin: 258 },
  { name: 'Edvinas',   kin: 123 },
  { name: 'Valdas',    kin: 48  },
  { name: 'Iveta',     kin: 79  },
  { name: 'Nerijus',   kin: 209 },
];

// ─── Step 1: Verify seal/tone for each profile ─────────────────────────────

describe('Step 1: Profile seal/tone verification', () => {
  test.each(PROFILES)('$name (Kin $kin) — independent matches app', ({ name, kin }) => {
    // Independent
    const iSeal = indSeal(kin);
    const iTone = indTone(kin);
    // App
    const aSeal = getSealIndex(kin);
    const aTone = getToneNumber(kin);

    expect(iSeal).toBe(aSeal);
    expect(iTone).toBe(aTone);

    // Log for report
    console.log(`${name}: Kin ${kin} → Seal: ${SEAL_NAMES[iSeal]} (${iSeal}), Tone: ${TONE_NAMES[iTone]} (${iTone}), Colour: ${indColour(iSeal)}`);
  });
});

// ─── Step 2: Verify oracle cross for each profile ──────────────────────────

describe('Step 2: Oracle cross verification', () => {
  test.each(PROFILES)('$name (Kin $kin) — oracle cross matches', ({ name, kin }) => {
    const s = indSeal(kin);
    const t = indTone(kin);

    // Independent oracle
    const iAnalog = indAnalog(s);
    const iAntipode = indAntipode(s);
    const iOccult = indOccult(s);
    const iGuide = indGuide(s, t);

    // App oracle
    const oracle = getOracle(kin);

    expect(iAnalog).toBe(oracle.analog.index);
    expect(iAntipode).toBe(oracle.antipode.index);
    expect(iOccult).toBe(oracle.occult.index);
    expect(iGuide).toBe(oracle.guide.index);

    console.log(`${name} oracle: Analog=${SEAL_NAMES[iAnalog]}(${iAnalog}) Antipode=${SEAL_NAMES[iAntipode]}(${iAntipode}) Occult=${SEAL_NAMES[iOccult]}(${iOccult}) Guide=${SEAL_NAMES[iGuide]}(${iGuide})`);
  });
});

// ─── Step 3: Verify categories ──────────────────────────────────────────────

describe('Step 3: Category verification', () => {
  test.each(PROFILES)('$name (Kin $kin) — categories match', ({ name, kin }) => {
    const s = indSeal(kin);

    // Independent
    const iColour = indColour(s);
    const iEarth = indEarthFam(s);
    const iWS = indWavespell(kin);
    const iCastle = indCastle(kin);

    // App
    const aColour = getColourFamily(SEALS[s].colour).colour;
    const aEarth = getEarthFamily(s).name;
    const aWS = getWavespellNumber(kin);
    const aCastle = getCastle(kin).number;

    expect(iColour).toBe(aColour);
    expect(iEarth).toBe(aEarth);
    expect(iWS).toBe(aWS);
    expect(iCastle).toBe(aCastle);
  });
});

// ─── Step 4: Verify ALL 45 pair connections ─────────────────────────────────

describe('Step 4: All 45 pair connections audit', () => {
  // Build independent connection list
  type IndConn = {
    nameA: string; nameB: string;
    type: string; direction: string;
  };

  const independentConns: IndConn[] = [];

  for (let i = 0; i < PROFILES.length; i++) {
    for (let j = i + 1; j < PROFILES.length; j++) {
      const a = PROFILES[i];
      const b = PROFILES[j];
      const sA = indSeal(a.kin), sB = indSeal(b.kin);
      const tA = indTone(a.kin), tB = indTone(b.kin);

      // Oracle connections (seal-level)
      if (indAnalog(sA) === sB)
        independentConns.push({ nameA: a.name, nameB: b.name, type: 'analog', direction: 'mutual' });
      if (indAntipode(sA) === sB)
        independentConns.push({ nameA: a.name, nameB: b.name, type: 'antipode', direction: 'mutual' });
      if (indOccult(sA) === sB)
        independentConns.push({ nameA: a.name, nameB: b.name, type: 'occult', direction: 'mutual' });

      // Guide (directional)
      const aGuideB = indGuide(sA, tA) === sB;
      const bGuideA = indGuide(sB, tB) === sA;
      if (aGuideB && bGuideA)
        independentConns.push({ nameA: a.name, nameB: b.name, type: 'guide', direction: 'mutual' });
      else if (aGuideB)
        independentConns.push({ nameA: a.name, nameB: b.name, type: 'guide', direction: `${b.name} guides ${a.name}` });
      else if (bGuideA)
        independentConns.push({ nameA: a.name, nameB: b.name, type: 'guide', direction: `${a.name} guides ${b.name}` });

      // Family connections
      if (indColour(sA) === indColour(sB))
        independentConns.push({ nameA: a.name, nameB: b.name, type: 'colour-family', direction: 'mutual' });
      if (indEarthFam(sA) === indEarthFam(sB))
        independentConns.push({ nameA: a.name, nameB: b.name, type: 'earth-family', direction: 'mutual' });
      if (indWavespell(a.kin) === indWavespell(b.kin))
        independentConns.push({ nameA: a.name, nameB: b.name, type: 'wavespell', direction: 'mutual' });
      if (indCastle(a.kin) === indCastle(b.kin))
        independentConns.push({ nameA: a.name, nameB: b.name, type: 'castle', direction: 'mutual' });
    }
  }

  // Now get the app's connections
  const appConns: Connection[] = [];
  for (let i = 0; i < PROFILES.length; i++) {
    for (let j = i + 1; j < PROFILES.length; j++) {
      appConns.push(...findConnections(PROFILES[i].kin, PROFILES[j].kin, i, j));
    }
  }

  // Deduplicate app connections (Guide can appear twice for mutual)
  const appDeduped: Array<{ type: string; pairKey: string; direction: string }> = [];
  const appSeen = new Set<string>();
  for (const c of appConns) {
    const pk = `${c.type}:${Math.min(c.indexA, c.indexB)}-${Math.max(c.indexA, c.indexB)}`;
    if (appSeen.has(pk)) {
      // Reverse of existing → mutual
      const orig = appDeduped.find(d => d.pairKey === pk);
      if (orig) orig.direction = 'mutual';
      continue;
    }
    appSeen.add(pk);
    appDeduped.push({
      type: c.type,
      pairKey: pk,
      direction: c.arrow ? `${PROFILES[c.indexB].name} guides ${PROFILES[c.indexA].name}` : 'mutual',
    });
  }

  test('Independent and app connection counts match', () => {
    console.log(`\n--- CONNECTION SUMMARY ---`);
    console.log(`Independent found: ${independentConns.length} connections`);
    console.log(`App found: ${appDeduped.length} connections`);

    // Group by type
    const indByType: Record<string, number> = {};
    independentConns.forEach(c => { indByType[c.type] = (indByType[c.type] || 0) + 1; });
    const appByType: Record<string, number> = {};
    appDeduped.forEach(c => { appByType[c.type] = (appByType[c.type] || 0) + 1; });

    console.log('\nBy type:');
    for (const t of ['analog', 'antipode', 'occult', 'guide', 'colour-family', 'earth-family', 'wavespell', 'castle']) {
      const ind = indByType[t] || 0;
      const app = appByType[t] || 0;
      const match = ind === app ? '✓' : '✗ MISMATCH';
      console.log(`  ${t}: independent=${ind}, app=${app} ${match}`);
    }

    expect(independentConns.length).toBe(appDeduped.length);
  });

  test('Every independent connection has a matching app connection', () => {
    const missingInApp: IndConn[] = [];

    for (const ic of independentConns) {
      const iIdx = PROFILES.findIndex(p => p.name === ic.nameA);
      const jIdx = PROFILES.findIndex(p => p.name === ic.nameB);
      const pk = `${ic.type}:${Math.min(iIdx, jIdx)}-${Math.max(iIdx, jIdx)}`;
      const found = appDeduped.find(a => a.pairKey === pk);
      if (!found) missingInApp.push(ic);
    }

    if (missingInApp.length > 0) {
      console.log('\n--- MISSING IN APP ---');
      missingInApp.forEach(c => console.log(`  ✗ ${c.nameA} ↔ ${c.nameB}: ${c.type} (${c.direction})`));
    }
    expect(missingInApp).toHaveLength(0);
  });

  test('Every app connection has a matching independent connection', () => {
    const extraInApp: typeof appDeduped = [];

    for (const ac of appDeduped) {
      const [, pair] = ac.pairKey.split(':');
      const [iStr, jStr] = pair.split('-');
      const i = parseInt(iStr), j = parseInt(jStr);
      const nameA = PROFILES[i].name, nameB = PROFILES[j].name;
      const found = independentConns.find(ic =>
        ic.type === ac.type && ic.nameA === nameA && ic.nameB === nameB
      );
      if (!found) extraInApp.push(ac);
    }

    if (extraInApp.length > 0) {
      console.log('\n--- EXTRA IN APP (should not exist) ---');
      extraInApp.forEach(c => console.log(`  ✗ ${c.pairKey}: ${c.type}`));
    }
    expect(extraInApp).toHaveLength(0);
  });

  test('Print full connection report', () => {
    console.log('\n--- FULL CONNECTION REPORT ---');
    for (const c of independentConns) {
      console.log(`  ✓ ${c.nameA} ↔ ${c.nameB}: ${c.type} (${c.direction})`);
    }
  });
});

// ─── Step 5: Verify Analog symmetry properties ─────────────────────────────

describe('Step 5: Oracle formula properties', () => {
  test('Analog is symmetric for all 20 seals', () => {
    for (let s = 0; s < 20; s++) {
      const partner = indAnalog(s);
      expect(indAnalog(partner)).toBe(s);
    }
  });

  test('Antipode is symmetric (self-inverse) for all 20 seals', () => {
    for (let s = 0; s < 20; s++) {
      expect(indAntipode(indAntipode(s))).toBe(s);
    }
  });

  test('Occult is symmetric for all 20 seals', () => {
    for (let s = 0; s < 20; s++) {
      const partner = indOccult(s);
      expect(indOccult(partner)).toBe(s);
    }
  });

  test('Every seal belongs to exactly one Earth Family', () => {
    for (let s = 0; s < 20; s++) {
      let count = 0;
      for (const members of Object.values(EARTH_FAM)) {
        if (members.includes(s)) count++;
      }
      expect(count).toBe(1);
    }
  });

  test('Each Earth Family has exactly 4 members', () => {
    for (const [name, members] of Object.entries(EARTH_FAM)) {
      expect(members).toHaveLength(4);
    }
  });
});
