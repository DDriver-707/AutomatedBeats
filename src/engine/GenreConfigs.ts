import type { GenreConfig, BeatPattern } from '../types/BeatTypes';
import { patterns, melodyPatterns, genreBPMs } from './patterns';

// Helper function to create a 16-step pattern
const createPattern = (
  kick: number[] = [],
  snare: number[] = [],
  clap: number[] = [],
  hihat: number[] = [],
  openHat: number[] = [],
  bass: number[] = [],
  melody: number[] = []
): BeatPattern => {
  const pattern: BeatPattern = {
    kick: new Array(16).fill(0),
    snare: new Array(16).fill(0),
    clap: new Array(16).fill(0),
    hihat: new Array(16).fill(0),
    openHat: new Array(16).fill(0),
    bass: new Array(16).fill(0),
    melody: new Array(16).fill(0)
  };

  // Apply kick pattern
  kick.forEach((value, index) => {
    if (index < 16) pattern.kick[index] = value;
  });

  // Apply snare pattern
  snare.forEach((value, index) => {
    if (index < 16) pattern.snare[index] = value;
  });

  // Apply clap pattern
  clap.forEach((value, index) => {
    if (index < 16) pattern.clap[index] = value;
  });

  // Apply hihat pattern
  hihat.forEach((value, index) => {
    if (index < 16) pattern.hihat[index] = value;
  });

  // Apply open hat pattern
  openHat.forEach((value, index) => {
    if (index < 16) pattern.openHat[index] = value;
  });

  // Apply bass pattern (note indices)
  bass.forEach((note, index) => {
    if (index < 16) pattern.bass[index] = note;
  });

  // Apply melody pattern (note indices)
  melody.forEach((note, index) => {
    if (index < 16) pattern.melody[index] = note;
  });

  return pattern;
};

export const GENRE_CONFIGS: Record<string, GenreConfig> = {
  'hip-hop': {
    name: 'Hip Hop/Rap',
    bpm: genreBPMs.hiphop.default,
    pattern: createPattern(
      patterns.hiphopPattern.kick,
      patterns.hiphopPattern.snare,
      patterns.hiphopPattern.clap,
      patterns.hiphopPattern.hihat,
      patterns.hiphopPattern.openhihat,
      patterns.hiphopPattern.bass,
      melodyPatterns.hiphopPattern
    ),
    melodyScale: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25], // C major
    bassNotes: [82.41, 87.31, 92.50, 98.00, 110.00, 123.47, 130.81],
    effects: {
      reverb: 0.3,
      delay: 0.2,
      distortion: 0.1
    }
  },

  'emo-rap': {
    name: 'Emo Rap',
    bpm: genreBPMs.emorap.default,
    pattern: createPattern(
      patterns.emorapPattern.kick,
      patterns.emorapPattern.snare,
      patterns.emorapPattern.clap,
      patterns.emorapPattern.hihat,
      patterns.emorapPattern.openhihat,
      patterns.emorapPattern.bass,
      melodyPatterns.emorapPattern
    ),
    melodyScale: [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00], // C harmonic minor
    bassNotes: [82.41, 87.31, 92.50, 98.00, 110.00, 123.47, 130.81],
    effects: {
      reverb: 0.4,
      delay: 0.3,
      distortion: 0.2
    }
  },

  'country': {
    name: 'Country',
    bpm: genreBPMs.country.default,
    pattern: createPattern(
      patterns.countryPattern.kick,
      patterns.countryPattern.snare,
      patterns.countryPattern.clap,
      patterns.countryPattern.hihat,
      patterns.countryPattern.openhihat,
      patterns.countryPattern.bass,
      melodyPatterns.countryPattern
    ),
    melodyScale: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25], // C major
    bassNotes: [82.41, 87.31, 92.50, 98.00, 110.00, 123.47, 130.81],
    effects: {
      reverb: 0.2,
      delay: 0.1,
      distortion: 0.05
    }
  },

  'edm': {
    name: 'EDM',
    bpm: genreBPMs.edm.default,
    pattern: createPattern(
      patterns.edmPattern.kick,
      patterns.edmPattern.snare,
      patterns.edmPattern.clap,
      patterns.edmPattern.hihat,
      patterns.edmPattern.openhihat,
      patterns.edmPattern.bass,
      melodyPatterns.edmPattern
    ),
    melodyScale: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25], // C major
    bassNotes: [82.41, 87.31, 92.50, 98.00, 110.00, 123.47, 130.81],
    effects: {
      reverb: 0.5,
      delay: 0.4,
      distortion: 0.3
    }
  },

  'rock': {
    name: 'Rock',
    bpm: genreBPMs.rock.default,
    pattern: createPattern(
      patterns.rockPattern.kick,
      patterns.rockPattern.snare,
      patterns.rockPattern.clap,
      patterns.rockPattern.hihat,
      patterns.rockPattern.openhihat,
      patterns.rockPattern.bass,
      melodyPatterns.rockPattern
    ),
    melodyScale: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25], // C major
    bassNotes: [82.41, 87.31, 92.50, 98.00, 110.00, 123.47, 130.81],
    effects: {
      reverb: 0.3,
      delay: 0.2,
      distortion: 0.4
    }
  },

  'trap': {
    name: 'Trap',
    bpm: genreBPMs.trap.default,
    pattern: createPattern(
      patterns.trapPattern.kick,
      patterns.trapPattern.snare,
      patterns.trapPattern.clap,
      patterns.trapPattern.hihat,
      patterns.trapPattern.openhihat,
      patterns.trapPattern.bass,
      melodyPatterns.trapPattern
    ),
    melodyScale: [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00], // C harmonic minor
    bassNotes: [82.41, 87.31, 92.50, 98.00, 110.00, 123.47, 130.81],
    effects: {
      reverb: 0.4,
      delay: 0.3,
      distortion: 0.3
    }
  }
};

// Random beat generator - now using the enhanced RandomBeatGenerator
import { RandomBeatGenerator } from './RandomBeatGenerator';

export function generateRandomBeat(): GenreConfig {
  return RandomBeatGenerator.generateRandomBeat();
}
