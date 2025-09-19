import type { GenreConfig, BeatPattern } from '../types/BeatTypes';

// Helper function to create a 16-step pattern
const createPattern = (
  kick: number[] = [],
  snare: number[] = [],
  hihat: number[] = [],
  openHat: number[] = [],
  bass: number[] = []
): BeatPattern => {
  const pattern: BeatPattern = {
    kick: new Array(16).fill(0),
    snare: new Array(16).fill(0),
    hihat: new Array(16).fill(0),
    openHat: new Array(16).fill(0),
    bass: new Array(16).fill(0)
  };

  // Apply kick pattern
  kick.forEach(step => {
    if (step >= 0 && step < 16) pattern.kick[step] = 1;
  });

  // Apply snare pattern
  snare.forEach(step => {
    if (step >= 0 && step < 16) pattern.snare[step] = 1;
  });

  // Apply hihat pattern
  hihat.forEach(step => {
    if (step >= 0 && step < 16) pattern.hihat[step] = 1;
  });

  // Apply open hat pattern
  openHat.forEach(step => {
    if (step >= 0 && step < 16) pattern.openHat[step] = 1;
  });

  // Apply bass pattern (note indices)
  bass.forEach((note, index) => {
    if (index < 16) pattern.bass[index] = note;
  });

  return pattern;
};

export const GENRE_CONFIGS: Record<string, GenreConfig> = {
  'hip-hop': {
    name: 'Hip Hop/Rap',
    bpm: 90, // Classic hip hop BPM
    pattern: createPattern(
      [0, 8, 12], // Kick on 1, 3, and 3.5
      [4, 12], // Snare on 2 and 4
      [2, 6, 10, 14], // Hi-hat on off-beats
      [7, 15], // Open hat occasionally
      [1, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 0] // Bass pattern
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
    bpm: 140, // Double-time feel
    pattern: createPattern(
      [0, 6, 8, 14], // More complex kick pattern
      [4, 12], // Snare on 2 and 4
      [1, 3, 5, 7, 9, 11, 13, 15], // Continuous hi-hat
      [7, 15], // Open hat
      [1, 0, 2, 0, 1, 0, 3, 0, 2, 0, 1, 0, 4, 0, 3, 0] // Bass pattern
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
    bpm: 100, // Upbeat country BPM
    pattern: createPattern(
      [0, 8], // Simple kick on 1 and 3
      [4, 12], // Snare on 2 and 4
      [2, 4, 6, 8, 10, 12, 14], // Steady hi-hat
      [7, 15], // Open hat
      [1, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0] // Simple bass (no 808s)
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
    bpm: 128, // Classic house BPM
    pattern: createPattern(
      [0, 4, 8, 12], // Four-on-the-floor kick
      [4, 12], // Snare on 2 and 4
      [1, 3, 5, 7, 9, 11, 13, 15], // Continuous hi-hat
      [6, 14], // Open hat
      [1, 0, 1, 0, 2, 0, 2, 0, 3, 0, 3, 0, 4, 0, 4, 0] // Bass pattern
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
    bpm: 120, // Classic rock BPM
    pattern: createPattern(
      [0, 8], // Kick on 1 and 3
      [4, 12], // Snare on 2 and 4
      [2, 4, 6, 8, 10, 12, 14, 16], // Steady hi-hat
      [7, 15], // Open hat
      [1, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0] // Simple bass (no 808s)
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
    bpm: 140, // Classic trap BPM
    pattern: createPattern(
      [0, 6, 8, 14], // Trap kick pattern
      [4, 12], // Snare on 2 and 4
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], // Rapid hi-hat rolls
      [7, 15], // Open hat
      [1, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 0] // Bass pattern (808s)
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

// Random beat generator
export function generateRandomBeat(): GenreConfig {
  const genres = Object.keys(GENRE_CONFIGS);
  const randomGenre = genres[Math.floor(Math.random() * genres.length)];
  
  // Get base config
  const baseConfig = { ...GENRE_CONFIGS[randomGenre] };
  
  // Randomize some elements
  baseConfig.bpm = 80 + Math.floor(Math.random() * 60); // 80-140 BPM
  
  // Randomize some pattern elements
  const randomPattern = { ...baseConfig.pattern };
  
  // Randomize some melody notes
  for (let i = 0; i < 16; i++) {
    if (Math.random() > 0.6) { // 40% chance to change melody
      randomPattern.melody[i] = Math.floor(Math.random() * 8) + 1;
    }
  }
  
  // Randomize some bass notes
  for (let i = 0; i < 16; i++) {
    if (Math.random() > 0.7) { // 30% chance to change bass
      randomPattern.bass[i] = Math.floor(Math.random() * 7) + 1;
    }
  }
  
  baseConfig.pattern = randomPattern;
  baseConfig.name = `Random ${baseConfig.name}`;
  
  return baseConfig;
}
