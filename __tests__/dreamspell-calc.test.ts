import { calculateKin, getKinResult, getSealIndex, getToneNumber, getOracle } from '../lib/dreamspell-calc';
import { SEALS } from '../lib/dreamspell-data';
import { getEarthFamily, getCastle, getWavespellNumber, getWavespellPosition, getMasteryPhase } from '../lib/categories';

describe('Dreamspell Kin Calculation', () => {
  // ===== PRIMARY VALIDATION =====
  test('June 15, 1981 = Kin 143, Blue Cosmic Night', () => {
    const kin = calculateKin(1981, 6, 15);
    expect(kin).toBe(143);
    const r = getKinResult(kin!);
    expect(r.seal.name).toBe('Night');
    expect(r.seal.colour).toBe('Blue');
    expect(r.tone.name).toBe('Cosmic');
    expect(r.fullName).toBe('Blue Cosmic Night');
  });

  // ===== REFERENCE ANCHORS =====
  test('July 26, 2013 = Kin 164', () => { expect(calculateKin(2013, 7, 26)).toBe(164); });
  test('July 26, 1987 = Kin 34, White Galactic Wizard', () => {
    const kin = calculateKin(1987, 7, 26);
    expect(kin).toBe(34);
    const r = getKinResult(kin!);
    expect(r.fullName).toBe('White Galactic Wizard');
  });

  // ===== FEB 29 (HUNAB KU) =====
  test('Feb 29 returns null', () => {
    expect(calculateKin(1984, 2, 29)).toBeNull();
    expect(calculateKin(2000, 2, 29)).toBeNull();
    expect(calculateKin(2024, 2, 29)).toBeNull();
  });

  test('Feb 28 and Mar 1 of leap years are consecutive Kins', () => {
    for (const y of [1984, 2000, 2024]) {
      const a = calculateKin(y, 2, 28)!;
      const b = calculateKin(y, 3, 1)!;
      expect((b - a + 260) % 260).toBe(1);
    }
  });

  test('2024 leap boundary: Feb 28=131, Mar 1=132', () => {
    expect(calculateKin(2024, 2, 28)).toBe(131);
    expect(calculateKin(2024, 3, 1)).toBe(132);
  });

  test('2020 leap boundary: Feb 28=231, Mar 1=232', () => {
    expect(calculateKin(2020, 2, 28)).toBe(231);
    expect(calculateKin(2020, 3, 1)).toBe(232);
  });

  test('Non-leap Feb 28 → Mar 1 consecutive (2023)', () => {
    const a = calculateKin(2023, 2, 28)!;
    const b = calculateKin(2023, 3, 1)!;
    expect((b - a + 260) % 260).toBe(1);
  });

  // ===== YEAR BOUNDARIES =====
  test('Dec 31 → Jan 1 across leap year boundaries', () => {
    for (const y of [1983, 1999, 2023]) {
      const a = calculateKin(y, 12, 31)!;
      const b = calculateKin(y + 1, 1, 1)!;
      expect((b - a + 260) % 260).toBe(1);
    }
  });

  test('2025-12-31 = Kin 22, 2026-01-01 = Kin 23', () => {
    expect(calculateKin(2025, 12, 31)).toBe(22);
    expect(calculateKin(2026, 1, 1)).toBe(23);
  });

  // ===== DAY OUT OF TIME + NEW YEAR =====
  test('July 25 → July 26 consecutive for multiple years', () => {
    for (const y of [1987, 1995, 2000, 2010, 2013, 2020, 2025]) {
      const a = calculateKin(y, 7, 25)!;
      const b = calculateKin(y, 7, 26)!;
      expect((b - a + 260) % 260).toBe(1);
    }
  });

  test('2025 Day Out of Time = Kin 123, New Year = Kin 124', () => {
    expect(calculateKin(2025, 7, 25)).toBe(123);
    expect(calculateKin(2025, 7, 26)).toBe(124);
  });

  // ===== VERIFIED HISTORICAL DATES =====
  test('Dec 21, 2012 = Kin 207, Blue Crystal Hand', () => {
    expect(calculateKin(2012, 12, 21)).toBe(207);
  });

  test('March 20, 2026 = Kin 101, Red Planetary Dragon', () => {
    const kin = calculateKin(2026, 3, 20);
    expect(kin).toBe(101);
    const r = getKinResult(kin!);
    expect(r.fullName).toBe('Red Planetary Dragon');
  });

  test('Jan 1, 1990 = Kin 143, Blue Cosmic Night', () => {
    expect(calculateKin(1990, 1, 1)).toBe(143);
  });

  test('Jul 20, 1969 = Kin 218, White Planetary Mirror (Moon landing)', () => {
    expect(calculateKin(1969, 7, 20)).toBe(218);
  });

  // ===== 20+ DATE RANGE TEST (1940–2030) =====
  test('Dates 1940–2030 all produce valid Kins 1–260', () => {
    const dates: [number,number,number][] = [
      [1940,1,1],[1945,5,8],[1950,6,25],[1955,12,1],[1960,3,15],
      [1965,8,20],[1969,7,20],[1970,1,1],[1975,4,10],[1980,11,11],
      [1985,7,13],[1990,1,1],[1995,9,15],[2000,1,1],[2005,6,21],
      [2010,9,9],[2012,12,21],[2015,3,20],[2018,6,1],[2020,7,4],
      [2023,11,1],[2025,11,25],[2028,2,28],[2030,12,31],
    ];
    for (const [y,m,d] of dates) {
      const kin = calculateKin(y, m, d);
      expect(kin).not.toBeNull();
      expect(kin).toBeGreaterThanOrEqual(1);
      expect(kin).toBeLessThanOrEqual(260);
    }
  });

  test('Consecutive non-leap days advance by 1', () => {
    const base = calculateKin(2023, 5, 1)!;
    for (let d = 2; d <= 31; d++) {
      expect(calculateKin(2023, 5, d)).toBe(((base - 1 + (d - 1)) % 260) + 1);
    }
  });

  // ===== ORACLE (verified against DeepWhisper + lawoftime.org) =====
  test('Oracle for Kin 143 (Blue Cosmic Night)', () => {
    const o = getOracle(143); // Night (index 2)
    expect(o.analog.name).toBe('Warrior');     // (17-2+20)%20 = 15
    expect(o.antipode.name).toBe('Skywalker'); // (2+10)%20 = 12
    expect(o.occult.name).toBe('Mirror');      // (19-2+20)%20 = 17
    expect(o.guide.name).toBe('Hand');         // tone 13 → offset 4 → (2+4)%20 = 6
    expect(o.guide.colour).toBe('Blue');
  });

  test('Oracle for Kin 1 (Red Magnetic Dragon)', () => {
    const o = getOracle(1); // Dragon (index 0)
    expect(o.analog.name).toBe('Mirror');      // (17-0+20)%20 = 17
    expect(o.antipode.name).toBe('Monkey');    // (0+10)%20 = 10
    expect(o.occult.name).toBe('Sun');         // (19-0+20)%20 = 19
    expect(o.guide.name).toBe('Dragon');       // tone 1 → offset 0
  });

  test('Oracle for Kin 164 (Yellow Galactic Seed)', () => {
    const o = getOracle(164); // Seed (index 3)
    expect(o.analog.name).toBe('Eagle');       // (17-3+20)%20 = 14
    expect(o.antipode.name).toBe('Wizard');    // (3+10)%20 = 13
    expect(o.occult.name).toBe('Earth');       // (19-3+20)%20 = 16
    expect(o.guide.name).toBe('Star');         // tone 8 → offset 4 → (3+4)%20 = 7
    expect(o.guide.colour).toBe('Yellow');
  });

  test('Guide always same colour as main seal', () => {
    for (let kin = 1; kin <= 260; kin++) {
      const seal = SEALS[getSealIndex(kin)];
      const oracle = getOracle(kin);
      expect(oracle.guide.colour).toBe(seal.colour);
    }
  });

  test('Analog, Antipode, Occult are always distinct seals', () => {
    for (let kin = 1; kin <= 260; kin++) {
      const oracle = getOracle(kin);
      const names = [oracle.analog.name, oracle.antipode.name, oracle.occult.name];
      expect(new Set(names).size).toBe(3);
    }
  });

  // ===== YEAR CROSSING =====
  test('Non-leap year = 365 Dreamspell days', () => {
    const a = calculateKin(2013, 7, 26)!;
    const b = calculateKin(2014, 7, 26)!;
    expect(b).toBe(((a - 1 + 365) % 260) + 1);
  });

  test('Leap year crossing = 365 Dreamspell days (366 Gregorian - 1 Feb 29)', () => {
    const a = calculateKin(2015, 7, 26)!;
    const b = calculateKin(2016, 7, 26)!;
    expect(b).toBe(((a - 1 + 365) % 260) + 1);
  });
});

describe('Earth Family Mapping', () => {
  test('Night (index 2) = Core family', () => {
    expect(getEarthFamily(2).name).toBe('Core');
  });

  test('Dragon (index 0) = Cardinal family', () => {
    expect(getEarthFamily(0).name).toBe('Cardinal');
  });

  test('Sun (index 19) = Polar family', () => {
    expect(getEarthFamily(19).name).toBe('Polar');
  });

  test('Moon (index 8) = Gateway family', () => {
    expect(getEarthFamily(8).name).toBe('Gateway');
  });

  test('Seed (index 3) = Signal family', () => {
    expect(getEarthFamily(3).name).toBe('Signal');
  });

  test('Every seal belongs to exactly one Earth Family', () => {
    for (let i = 0; i < 20; i++) {
      const family = getEarthFamily(i);
      expect(family).toBeDefined();
      expect(family.sealIndices).toContain(i);
    }
  });

  test('Each Earth Family has exactly 4 seals', () => {
    const { EARTH_FAMILIES } = require('../lib/categories');
    for (const fam of EARTH_FAMILIES) {
      expect(fam.sealIndices.length).toBe(4);
    }
  });
});

describe('Categories', () => {
  test('Kin 143 = Blue Western Castle of Burning', () => {
    expect(getCastle(143).name).toBe('Blue Western Castle of Burning');
  });

  test('Castle ranges', () => {
    expect(getCastle(1).number).toBe(1);
    expect(getCastle(52).number).toBe(1);
    expect(getCastle(53).number).toBe(2);
    expect(getCastle(104).number).toBe(2);
    expect(getCastle(105).number).toBe(3);
    expect(getCastle(156).number).toBe(3);
    expect(getCastle(157).number).toBe(4);
    expect(getCastle(208).number).toBe(4);
    expect(getCastle(209).number).toBe(5);
    expect(getCastle(260).number).toBe(5);
  });

  test('Wavespell: Kin 143 is in Wavespell 11, position 13', () => {
    expect(getWavespellNumber(143)).toBe(11);
    expect(getWavespellPosition(143)).toBe(13);
  });

  test('Night (index 2) = Re-awakening phase', () => {
    expect(getMasteryPhase(2).name).toBe('Re-awakening');
  });
});
