// Type definitions for RandomPatternGenerator

export type GenreId = 'trap' | 'lofi' | 'house';

export type InstrumentName = 'kick' | 'snare' | 'clap' | 'hihat' | 'openHat' | 'bass';

export type BeatPattern = {
  stepsPerBar: 16;
  kick: number[];
  snare: number[];
  clap: number[];
  hihat: number[];
  openHat: number[];
  bass: number[];
};

export type StepArray = number[]; // length 16, values 0/1 (or small ints for velocity)

export type GenOptions = {
  density?: Partial<Record<InstrumentName, number | [number, number]>>;
  syncopation?: number; // 0..1
  variation?: number; // 0..1 randomness beyond weights
  allowGhosts?: boolean; // default true
  allowRatchets?: boolean; // default false
};

export type InstrumentRules = {
  allowed: boolean[]; // length 16, hard mask
  weights: number[]; // length 16, soft preferences
  seeds: number[]; // must-place steps (e.g., snare backbeats)
  density: number | [number, number]; // target hits per bar
  minDistance: number; // steps between same-instrument hits
  collisions?: {
    // penalties/guards vs other instruments
    disallowSameAs?: InstrumentName[];
    preferBefore?: InstrumentName[];
    preferAfter?: InstrumentName[];
  };
  syncBias?: number; // 0..1, offbeat preference
  ghost?: {
    // optional ghosting behavior
    chance: number; // 0..1
    offsetSteps: number[]; // e.g., [-1, +1]
    velocityScale: number; // e.g., 0.4
  };
  ratchet?: {
    // optional rolls for hats
    steps: number[]; // candidate steps (e.g., 7,15)
    chance: number; // 0..1
    divisions: (1 | 2 | 3 | 4)[]; // e.g., [2,3,4]
  };
};

export type TrackPattern = Partial<Record<InstrumentName, StepArray>>;

export type GenreRules = Record<InstrumentName, InstrumentRules>;

// Seeded PRNG interface
export interface PRNG {
  next(): number; // returns [0, 1)
  nextInt(min: number, max: number): number; // returns integer in [min, max)
  seed: number;
}
