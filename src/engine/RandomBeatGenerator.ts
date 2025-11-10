// Enhanced Random Beat Generator with proper timing and variety
import type { GenreConfig, BeatPattern } from '../types/BeatTypes';
import type { AudioSample } from './SampleEngine';
import { GENRE_CONFIGS } from './GenreConfigs';
import { genreBPMs, getRandomBeatPattern } from './patterns';
import { SAMPLE_CONFIGS } from './SampleConfigs';

export class RandomBeatGenerator {
  
  /**
   * Generate a completely random beat with mixed elements
   */
  static generateRandomBeat(): GenreConfig {
    const genres = Object.keys(GENRE_CONFIGS);
    const randomGenre = genres[Math.floor(Math.random() * genres.length)];
    
    // Get base config
    const baseConfig = { ...GENRE_CONFIGS[randomGenre] };
    
    // Use default BPM for the genre
    const genreKey = randomGenre as keyof typeof genreBPMs;
    const bpmConfig = genreBPMs[genreKey];
    baseConfig.bpm = bpmConfig.default;
    
    // Create random pattern
    const randomPattern = this.generateRandomPattern(randomGenre);
    baseConfig.pattern = randomPattern;
    
    baseConfig.name = `Random ${baseConfig.name}`;
    
    return baseConfig;
  }

  /**
   * Generate a random pattern for a specific genre (only instruments with available samples)
   */
  static generateRandomPatternForGenre(genreKey: string, samples: AudioSample): BeatPattern {
    const genrePattern = getRandomBeatPattern(genreKey);

    return {
      kick: samples.kick && samples.kick.length > 0 ? [...genrePattern.kick] : new Array(16).fill(0),
      snare: samples.snare && samples.snare.length > 0 ? [...genrePattern.snare] : new Array(16).fill(0),
      clap: samples.clap && samples.clap.length > 0 ? [...genrePattern.clap] : new Array(16).fill(0),
      hihat: samples.hihat && samples.hihat.length > 0 ? [...genrePattern.hihat] : new Array(16).fill(0),
      openHat: samples.openHat && samples.openHat.length > 0 ? [...genrePattern.openHat] : new Array(16).fill(0),
      bass: samples.bass && samples.bass.length > 0 ? [...genrePattern.bass] : new Array(16).fill(0),
      melody: samples.melody && samples.melody.length > 0 ? [...genrePattern.melody] : new Array(16).fill(0)
    };
  }

  /**
   * Generate a random pattern with proper timing
   */
  static generateRandomPattern(genreKey: string): BeatPattern {
    return getRandomBeatPattern(genreKey);
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
      clap: new Array(16).fill(0),
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

  /**
   * Generate randomized sample selections for a genre
   * Picks random samples from the available sample arrays
   */
  static generateRandomSamples(genreKey: string): AudioSample {
    const baseSamples = SAMPLE_CONFIGS[genreKey] || SAMPLE_CONFIGS['hip-hop'];
    
    // Helper function to pick random sample from array
    const pickRandom = (samples: string[]): string[] => {
      if (samples.length === 0) return samples;
      const randomIndex = Math.floor(Math.random() * samples.length);
      return [samples[randomIndex]];
    };

    // Create new sample config with randomly selected samples
    return {
      kick: pickRandom(baseSamples.kick),
      snare: pickRandom(baseSamples.snare),
      clap: pickRandom(baseSamples.clap),
      hihat: pickRandom(baseSamples.hihat),
      openHat: pickRandom(baseSamples.openHat),
      bass: pickRandom(baseSamples.bass),
      melody: pickRandom(baseSamples.melody)
    };
  }
}
