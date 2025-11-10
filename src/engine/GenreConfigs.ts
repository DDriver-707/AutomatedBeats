import type { GenreConfig } from '../types/BeatTypes';
import { getDefaultBeatPattern, genreBPMs } from './patterns';

export const GENRE_CONFIGS: Record<string, GenreConfig> = {
  'hip-hop': {
    name: 'Hip Hop/Rap',
    bpm: genreBPMs.hiphop.default,
    pattern: getDefaultBeatPattern('hip-hop'),
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
    pattern: getDefaultBeatPattern('emo-rap'),
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
    pattern: getDefaultBeatPattern('country'),
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
    pattern: getDefaultBeatPattern('edm'),
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
    pattern: getDefaultBeatPattern('rock'),
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
    pattern: getDefaultBeatPattern('trap'),
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
