// Enhanced Random Beat Generator with proper timing and variety
import type { GenreConfig, BeatPattern } from '../types/BeatTypes';
import { patterns, melodyPatterns, genreBPMs } from './patterns';
import { GENRE_CONFIGS } from './GenreConfigs';

export class RandomBeatGenerator {
  
  /**
   * Generate a completely random beat with mixed elements
   */
  static generateRandomBeat(): GenreConfig {
    const genres = Object.keys(GENRE_CONFIGS);
    const randomGenre = genres[Math.floor(Math.random() * genres.length)];
    
    // Get base config
    const baseConfig = { ...GENRE_CONFIGS[randomGenre] };
    
    // Randomize BPM within genre range
    const genreKey = randomGenre as keyof typeof genreBPMs;
    const bpmRange = genreBPMs[genreKey];
    baseConfig.bpm = bpmRange.min + Math.floor(Math.random() * (bpmRange.max - bpmRange.min + 1));
    
    // Create random pattern
    const randomPattern = this.generateRandomPattern();
    baseConfig.pattern = randomPattern;
    
    baseConfig.name = `Random ${baseConfig.name}`;
    
    return baseConfig;
  }

  /**
   * Generate a random pattern with proper timing
   */
  private static generateRandomPattern(): BeatPattern {
    const pattern: BeatPattern = {
      kick: new Array(16).fill(0),
      snare: new Array(16).fill(0),
      hihat: new Array(16).fill(0),
      openHat: new Array(16).fill(0),
      bass: new Array(16).fill(0),
      melody: new Array(16).fill(0)
    };

    // Generate kick pattern (usually on strong beats)
    const kickPositions = [0, 4, 8, 12]; // Strong beats
    kickPositions.forEach(pos => {
      if (Math.random() > 0.3) { // 70% chance on strong beats
        pattern.kick[pos] = 1;
      }
    });

    // Add some off-beat kicks (20% chance)
    for (let i = 1; i < 16; i += 2) {
      if (Math.random() > 0.8) {
        pattern.kick[i] = 1;
      }
    }

    // Generate snare pattern (usually on 2 and 4)
    const snarePositions = [4, 12]; // 2 and 4
    snarePositions.forEach(pos => {
      if (Math.random() > 0.2) { // 80% chance on 2 and 4
        pattern.snare[pos] = 1;
      }
    });

    // Add ghost snares (30% chance on other positions)
    for (let i = 0; i < 16; i++) {
      if (!snarePositions.includes(i) && Math.random() > 0.7) {
        pattern.snare[i] = 1;
      }
    }

    // Generate hi-hat pattern
    const hatDensity = Math.random();
    if (hatDensity > 0.7) {
      // Dense hats (16th notes)
      for (let i = 0; i < 16; i++) {
        if (Math.random() > 0.3) pattern.hihat[i] = 1;
      }
    } else if (hatDensity > 0.4) {
      // Medium hats (8th notes with some variation)
      for (let i = 0; i < 16; i += 2) {
        if (Math.random() > 0.3) pattern.hihat[i] = 1;
      }
      // Add some off-beat hats
      for (let i = 1; i < 16; i += 2) {
        if (Math.random() > 0.6) pattern.hihat[i] = 1;
      }
    } else {
      // Sparse hats
      for (let i = 0; i < 16; i += 4) {
        if (Math.random() > 0.4) pattern.hihat[i] = 1;
      }
    }

    // Generate open hat pattern (sparse, usually on beat 4)
    const openHatPositions = [7, 15]; // Beat 4 and end
    openHatPositions.forEach(pos => {
      if (Math.random() > 0.5) {
        pattern.openHat[pos] = 1;
      }
    });

    // Generate bass pattern (follows kick with some variation)
    for (let i = 0; i < 16; i++) {
      if (pattern.kick[i]) {
        // Bass on kick (80% chance)
        if (Math.random() > 0.2) {
          pattern.bass[i] = 1 + Math.floor(Math.random() * 3); // Notes 1-3
        }
      } else {
        // Off-beat bass (20% chance)
        if (Math.random() > 0.8) {
          pattern.bass[i] = 1 + Math.floor(Math.random() * 3);
        }
      }
    }

    // Generate melody pattern (sparse, musical)
    const melodyDensity = Math.random();
    if (melodyDensity > 0.6) {
      // More melodic
      for (let i = 0; i < 16; i += 2) {
        if (Math.random() > 0.4) {
          pattern.melody[i] = 1 + Math.floor(Math.random() * 4); // Notes 1-4
        }
      }
    } else {
      // Sparse melody
      for (let i = 0; i < 16; i += 4) {
        if (Math.random() > 0.6) {
          pattern.melody[i] = 1 + Math.floor(Math.random() * 4);
        }
      }
    }

    return pattern;
  }

  /**
   * Generate a random beat based on a specific genre with variations
   */
  static generateGenreVariation(genreKey: string): GenreConfig {
    const baseConfig = { ...GENRE_CONFIGS[genreKey] };
    
    // Vary BPM slightly (±10 BPM)
    const variation = -10 + Math.floor(Math.random() * 21);
    baseConfig.bpm = Math.max(60, Math.min(200, baseConfig.bpm + variation));
    
    // Create variation of the base pattern
    const variedPattern = this.createPatternVariation(baseConfig.pattern);
    baseConfig.pattern = variedPattern;
    
    baseConfig.name = `Varied ${baseConfig.name}`;
    
    return baseConfig;
  }

  /**
   * Create variations of an existing pattern
   */
  private static createPatternVariation(basePattern: BeatPattern): BeatPattern {
    const pattern = JSON.parse(JSON.stringify(basePattern)); // Deep copy

    // Randomly modify some elements (20% chance per step)
    for (let i = 0; i < 16; i++) {
      // Modify kick
      if (Math.random() > 0.8) {
        pattern.kick[i] = pattern.kick[i] ? 0 : 1;
      }

      // Modify snare
      if (Math.random() > 0.8) {
        pattern.snare[i] = pattern.snare[i] ? 0 : 1;
      }

      // Modify hi-hat
      if (Math.random() > 0.8) {
        pattern.hihat[i] = pattern.hihat[i] ? 0 : 1;
      }

      // Modify bass notes
      if (Math.random() > 0.8) {
        if (pattern.bass[i] > 0) {
          pattern.bass[i] = 0;
        } else {
          pattern.bass[i] = 1 + Math.floor(Math.random() * 4);
        }
      }

      // Modify melody notes
      if (Math.random() > 0.8) {
        if (pattern.melody[i] > 0) {
          pattern.melody[i] = 0;
        } else {
          pattern.melody[i] = 1 + Math.floor(Math.random() * 4);
        }
      }
    }

    return pattern;
  }

  /**
   * Generate a completely chaotic beat (for experimental use)
   */
  static generateChaoticBeat(): GenreConfig {
    const baseConfig = { ...GENRE_CONFIGS['hip-hop'] }; // Use hip-hop as base
    
    // Random BPM
    baseConfig.bpm = 80 + Math.floor(Math.random() * 80); // 80-160 BPM
    
    // Create chaotic pattern
    const chaoticPattern: BeatPattern = {
      kick: new Array(16).fill(0),
      snare: new Array(16).fill(0),
      hihat: new Array(16).fill(0),
      openHat: new Array(16).fill(0),
      bass: new Array(16).fill(0),
      melody: new Array(16).fill(0)
    };

    // Random everything (50% chance per step)
    for (let i = 0; i < 16; i++) {
      if (Math.random() > 0.5) chaoticPattern.kick[i] = 1;
      if (Math.random() > 0.5) chaoticPattern.snare[i] = 1;
      if (Math.random() > 0.5) chaoticPattern.hihat[i] = 1;
      if (Math.random() > 0.5) chaoticPattern.openHat[i] = 1;
      if (Math.random() > 0.5) chaoticPattern.bass[i] = 1 + Math.floor(Math.random() * 4);
      if (Math.random() > 0.5) chaoticPattern.melody[i] = 1 + Math.floor(Math.random() * 4);
    }

    baseConfig.pattern = chaoticPattern;
    baseConfig.name = 'Chaotic Beat';
    
    return baseConfig;
  }
}
