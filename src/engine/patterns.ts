import type { BeatPattern } from '../types/BeatTypes';

type InstrumentName = keyof BeatPattern;
type InstrumentPattern = number[];
type InstrumentPatternSet = InstrumentPattern[];

export type PatternPool = Record<InstrumentName, InstrumentPatternSet>;

const EMPTY_PATTERN = new Array(16).fill(0);

const clonePattern = (pattern: number[]): number[] => [...pattern];

const DEFAULT_PATTERNS: Record<string, BeatPattern> = {
  'hip-hop': {
    kick:      [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    snare:     [0,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,0,0],
    clap:      [0,0,0,1, 0,0,0,0, 0,0,0,1, 0,0,0,0],
    hihat:     [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
    openHat:   [0,0,0,1, 0,0,0,0, 0,0,0,1, 0,0,0,0],
    bass:      [0,0,0,0, 0,1,0,0, 0,0,0,0, 0,0,0,1],
    melody:    [1,0,0,0, 2,0,0,0, 1,0,0,0, 2,0,0,0]
  },
  'emo-rap': {
    kick:      [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    snare:     [0,0,0,0, 0,0,0,1, 0,1,0,0, 0,0,0,0],
    clap:      [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hihat:     [1,0,0,1, 0,1,0,0, 1,0,0,1, 0,1,0,0],
    openHat:   [0,0,0,0, 0,0,0,0, 0,1,0,0, 0,0,0,0],
    bass:      [1,0,0,0, 0,0,1,0, 0,0,1,0, 0,0,0,0],
    melody:    [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0]
  },
  'country': {
    kick:      [1,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0],
    snare:     [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    clap:      [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hihat:     [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    openHat:   [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    bass:      [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    melody:    [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0]
  },
  'edm': {
    kick:      [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    snare:     [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    clap:      [0,0,0,1, 0,0,0,0, 0,0,0,1, 0,0,0,0],
    hihat:     [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    openHat:   [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,0,0],
    bass:      [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
    melody:    [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0]
  },
  'rock': {
    kick:      [1,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,1,0],
    snare:     [0,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
    clap:      [0,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
    hihat:     [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
    openHat:   [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,0,0],
    bass:      [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    melody:    [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0]
  },
  'trap': {
    kick:      [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    snare:     [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    clap:      [0,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
    hihat:     [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,1],
    openHat:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    bass:      [1,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,0,0],
    melody:    [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0]
  }
};

const cloneBeatPattern = (pattern: BeatPattern): BeatPattern => ({
  kick: clonePattern(pattern.kick),
  snare: clonePattern(pattern.snare),
  clap: clonePattern(pattern.clap),
  hihat: clonePattern(pattern.hihat),
  openHat: clonePattern(pattern.openHat),
  bass: clonePattern(pattern.bass),
  melody: clonePattern(pattern.melody)
});

const URBAN_POOL: PatternPool = {
  kick: [
    [1,0,0,0, 0,0,1,0, 1,0,0,1, 0,0,1,0],
    [1,0,0,0, 0,1,0,0, 1,0,0,0, 0,1,0,1],
    [1,0,1,0, 0,0,1,0, 1,0,0,0, 0,1,0,0],
    [1,0,0,0, 0,0,0,1, 1,0,1,0, 0,0,1,0],
    [1,0,0,1, 0,0,1,0, 1,0,0,0, 0,0,1,1]
  ],
  snare: [
    [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    [0,0,0,1, 1,0,0,0, 0,0,0,1, 1,0,0,0],
    [0,0,0,0, 1,0,0,1, 0,0,0,0, 1,0,0,1],
    [0,0,1,0, 1,0,1,0, 0,1,0,0, 1,0,1,0],
    [0,0,0,0, 1,0,0,0, 0,1,0,0, 1,0,0,1]
  ],
  clap: [
    [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    [0,0,0,0, 0,0,0,0, 0,0,0,0, 1,0,0,0],
    [0,0,0,1, 1,0,0,0, 0,0,0,1, 1,0,0,0],
    [0,0,0,0, 1,0,0,1, 0,0,0,0, 1,0,0,1],
    [0,0,0,1, 0,0,0,0, 0,1,0,0, 1,0,1,0]
  ],
  hihat: [
    [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
    [1,0,1,1, 1,0,1,1, 1,0,1,1, 1,0,1,1],
    [1,0,0,1, 0,1,0,1, 1,0,0,1, 0,1,0,1],
    [1,0,1,0, 1,1,1,0, 1,0,1,0, 1,1,0,1]
  ],
  openHat: [
    [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,0,1],
    [0,0,0,1, 0,0,0,0, 0,0,0,1, 0,0,0,0],
    [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,1,0],
    [0,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
    [0,0,0,0, 0,0,0,1, 0,0,1,0, 0,0,0,1]
  ],
  bass: [
    [1,0,0,0, 0,0,2,0, 1,0,0,3, 0,0,4,0],
    [1,0,0,0, 0,2,0,0, 1,0,0,0, 0,3,0,4],
    [1,0,2,0, 0,0,3,0, 1,0,0,0, 0,2,0,4],
    [1,0,0,0, 0,0,2,0, 0,0,3,0, 1,0,0,4],
    [1,0,2,0, 0,3,0,0, 1,0,0,0, 4,0,0,0]
  ],
  melody: [
    [1,0,0,0, 2,0,0,0, 3,0,0,0, 4,0,0,0],
    [1,0,0,2, 0,0,3,0, 1,0,0,4, 0,0,3,0],
    [0,0,1,0, 0,2,0,0, 3,0,0,0, 4,0,2,0],
    [1,0,0,0, 0,2,0,3, 0,0,4,0, 0,3,0,2],
    [0,1,0,0, 3,0,0,0, 1,0,0,4, 0,0,2,0]
  ]
};

const COUNTRY_ROCK_POOL: PatternPool = {
  kick: [
    [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,1,0],
    [1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,1,0],
    [1,0,0,0, 0,0,0,1, 1,0,0,0, 0,1,0,0],
    [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
    [1,0,0,1, 0,0,0,0, 1,0,0,1, 0,0,0,0]
  ],
  snare: [
    [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    [0,0,0,1, 1,0,0,0, 0,0,0,1, 1,0,0,0],
    [0,0,0,0, 1,0,0,1, 0,0,0,0, 1,0,0,1],
    [0,0,1,0, 1,0,1,0, 0,1,0,0, 1,0,1,0],
    [0,0,0,0, 1,0,0,0, 0,1,0,0, 1,0,0,0]
  ],
  clap: [
    [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    [0,0,0,1, 1,0,0,0, 0,0,0,1, 1,0,0,0],
    [0,0,0,0, 1,0,0,1, 0,0,0,0, 1,0,0,1],
    [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,1,0]
  ],
  hihat: [
    [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
    [1,0,1,0, 1,1,1,0, 1,0,1,0, 1,1,1,0],
    [1,0,1,0, 1,0,0,0, 1,0,1,0, 1,0,0,0],
    [1,0,1,0, 1,0,1,0, 1,1,1,1, 1,0,1,0]
  ],
  openHat: [
    [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,0,1],
    [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,1,0],
    [0,0,0,1, 0,0,0,0, 0,0,0,1, 0,0,0,0],
    [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    [0,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0]
  ],
  bass: [
    [1,0,0,0, 0,0,2,0, 3,0,0,0, 0,0,2,0],
    [1,0,0,0, 0,2,0,0, 3,0,0,0, 0,2,0,0],
    [1,0,1,0, 0,0,2,0, 3,0,1,0, 0,0,2,0],
    [1,0,0,0, 0,0,2,0, 0,0,3,0, 1,0,0,0],
    [1,0,0,0, 0,0,2,0, 3,0,0,2, 1,0,0,0]
  ],
  melody: [
    [1,0,0,0, 3,0,0,0, 5,0,0,0, 3,0,0,0],
    [1,0,0,3, 0,0,5,0, 1,0,0,3, 0,0,5,0],
    [1,0,2,0, 3,0,0,0, 5,0,2,0, 3,0,0,0],
    [0,1,0,0, 3,0,0,0, 5,0,0,0, 3,0,1,0],
    [1,0,0,0, 0,3,0,0, 5,0,0,0, 0,3,0,0]
  ]
};

const EDM_POOL: PatternPool = {
  kick: [
    [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
    [1,0,0,0, 1,0,0,1, 1,0,0,0, 1,0,0,1],
    [1,0,0,0, 1,0,1,0, 1,0,0,0, 1,0,1,0],
    [1,0,0,0, 1,0,0,0, 1,0,1,0, 1,0,0,0],
    [1,0,0,1, 1,0,0,0, 1,0,0,1, 1,0,0,0]
  ],
  snare: [
    [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    [0,0,0,0, 1,0,0,1, 0,0,0,0, 1,0,0,1],
    [0,0,0,1, 1,0,0,1, 0,0,0,1, 1,0,0,1],
    [0,0,1,0, 1,0,1,0, 0,1,0,0, 1,0,1,0],
    [0,0,0,0, 1,0,1,0, 0,0,0,0, 1,0,1,0]
  ],
  clap: [
    [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,0,1],
    [0,0,0,1, 1,0,0,1, 0,0,0,1, 1,0,0,1],
    [0,0,0,0, 1,0,1,0, 0,0,0,0, 1,0,1,0],
    [0,0,1,0, 1,0,0,1, 0,1,0,0, 1,0,0,1]
  ],
  hihat: [
    [0,1,0,1, 0,1,0,1, 0,1,0,1, 0,1,0,1],
    [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
    [0,1,1,0, 0,1,1,0, 0,1,1,0, 0,1,1,0],
    [1,0,0,1, 0,1,0,1, 1,0,0,1, 0,1,0,1]
  ],
  openHat: [
    [0,0,0,0, 0,1,0,0, 0,0,0,0, 0,1,0,0],
    [0,0,0,1, 0,0,0,1, 0,0,0,1, 0,0,0,1],
    [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,0,1],
    [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    [0,0,0,0, 0,1,0,1, 0,0,0,0, 0,1,0,1]
  ],
  bass: [
    [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
    [1,0,0,0, 2,0,0,0, 3,0,0,0, 2,0,0,0],
    [1,0,2,0, 1,0,2,0, 3,0,4,0, 3,0,4,0],
    [1,0,0,0, 1,0,0,2, 3,0,0,0, 3,0,0,2],
    [1,0,0,0, 0,2,0,2, 3,0,0,0, 0,2,0,2]
  ],
  melody: [
    [1,0,0,0, 5,0,0,0, 3,0,0,0, 5,0,0,0],
    [1,0,0,5, 0,0,3,0, 1,0,0,5, 0,0,3,0],
    [1,0,3,0, 5,0,3,0, 1,0,3,0, 5,0,3,0],
    [0,1,0,3, 0,5,0,3, 0,1,0,3, 0,5,0,3],
    [1,0,0,0, 0,3,0,5, 0,0,3,0, 0,5,0,3]
  ]
};

const GENRE_TO_POOL: Record<string, PatternPool> = {
  'hip-hop': URBAN_POOL,
  'emo-rap': URBAN_POOL,
  'trap': URBAN_POOL,
  'country': COUNTRY_ROCK_POOL,
  'rock': COUNTRY_ROCK_POOL,
  'edm': EDM_POOL
};

const arraysEqual = (a: number[], b?: number[]): boolean => {
  if (!b || a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
};

const pickFromPool = (
  pool: PatternPool,
  instrument: InstrumentName,
  index: number = 0
): number[] => {
  const patterns = pool[instrument];
  if (!patterns || patterns.length === 0) {
    return [...EMPTY_PATTERN];
  }

  const safeIndex = ((index % patterns.length) + patterns.length) % patterns.length;
  return clonePattern(patterns[safeIndex]);
};

const createBeatPatternFromPool = (
  pool: PatternPool,
  indices: Partial<Record<InstrumentName, number>> = {}
): BeatPattern => ({
  kick: pickFromPool(pool, 'kick', indices.kick ?? 0),
  snare: pickFromPool(pool, 'snare', indices.snare ?? 0),
  clap: pickFromPool(pool, 'clap', indices.clap ?? 0),
  hihat: pickFromPool(pool, 'hihat', indices.hihat ?? 0),
  openHat: pickFromPool(pool, 'openHat', indices.openHat ?? 0),
  bass: pickFromPool(pool, 'bass', indices.bass ?? 0),
  melody: pickFromPool(pool, 'melody', indices.melody ?? 0)
});

export const getPatternPoolForGenre = (genre: string): PatternPool => {
  return GENRE_TO_POOL[genre] ?? URBAN_POOL;
};

export const getDefaultBeatPattern = (genre: string): BeatPattern => {
  const defaultPattern = DEFAULT_PATTERNS[genre];
  if (defaultPattern) {
    return cloneBeatPattern(defaultPattern);
  }
  return createBeatPatternFromPool(getPatternPoolForGenre(genre));
};

export const getRandomBeatPattern = (
  genre: string,
  rng: () => number = Math.random
): BeatPattern => {
  const pool = getPatternPoolForGenre(genre);
  const indices: Partial<Record<InstrumentName, number>> = {};

  (Object.keys(pool) as InstrumentName[]).forEach((instrument) => {
    const patternSet = pool[instrument];
    if (patternSet && patternSet.length > 0) {
      indices[instrument] = Math.floor(rng() * patternSet.length);
    }
  });

  return createBeatPatternFromPool(pool, indices);
};

export const getRandomInstrumentPattern = (
  genre: string,
  instrument: InstrumentName,
  current?: number[],
  rng: () => number = Math.random
): number[] => {
  const pool = getPatternPoolForGenre(genre);
  const patterns = pool[instrument];

  if (!patterns || patterns.length === 0) {
    return [...EMPTY_PATTERN];
  }

  const alternatives = current
    ? patterns.filter(pattern => !arraysEqual(pattern, current))
    : patterns;

  const candidates = alternatives.length > 0 ? alternatives : patterns;
  const choice = candidates[Math.floor(rng() * candidates.length)];

  return clonePattern(choice);
};

// Genre-specific BPM defaults (no limits)
export const genreBPMs = {
  hiphop: { default: 90 },
  emorap: { default: 80 },
  country: { default: 110 },
  edm: { default: 128 },
  rock: { default: 120 },
  trap: { default: 145 }
};
