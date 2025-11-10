// RandomPatternGenerator - Main entry point
import type { GenreId, BeatPattern, GenOptions } from './types';
import { createPRNG } from './prng';
import { generateTrack } from './generateTrack';
import { GENRE_RULES, TRAP_RULES, LOFI_RULES, HOUSE_RULES, type GenreRules } from './genres';

export { generateTrack } from './generateTrack';
export { createPRNG } from './prng';
export { euclidean } from './utils';
export * from './types';

/**
 * Generate a deterministic beat pattern for a given genre
 * @param genre Genre identifier
 * @param seed Seed for deterministic generation
 * @param options Generation options (density, syncopation, variation, etc.)
 * @returns BeatPattern with 16-step arrays for each instrument
 */
export function generatePattern(
  genre: GenreId,
  seed: number,
  options: GenOptions = {}
): BeatPattern {
  const rules = GENRE_RULES[genre];
  const rng = createPRNG(seed);
  
  // Extract options with defaults
  const syncopation = options.syncopation ?? 0.3;
  const variation = options.variation ?? 0.5;
  const allowGhosts = options.allowGhosts ?? true;
  const allowRatchets = options.allowRatchets ?? false;
  
  // Priority order: snare/clap â†’ kick â†’ hats â†’ openHat â†’ bass
  const instrumentOrder: Array<keyof GenreRules> = [
    'snare',
    'clap',
    'kick',
    'hihat',
    'openHat',
    'bass'
  ];
  
  const existing: Record<string, number[]> = {};
  const pattern: Partial<BeatPattern> = {
    stepsPerBar: 16
  };
  
  // Generate each instrument in priority order
  for (const instrument of instrumentOrder) {
    const instrumentRules = rules[instrument];
    
    // Override density if provided in options
    let density = instrumentRules.density;
    if (options.density?.[instrument] !== undefined) {
      density = options.density[instrument]!;
    }
    
    // Merge rules with option overrides
    const mergedRules = {
      ...instrumentRules,
      density
    };
    
    // Generate track
    const track = generateTrack(
      instrument,
      mergedRules,
      rng,
      existing,
      syncopation,
      variation,
      allowGhosts,
      allowRatchets
    );
    
    // Store in pattern and existing
    pattern[instrument] = track;
    existing[instrument] = track;
  }
  
  // Ensure all instruments are present (fill with zeros if missing)
  const defaultArray = new Array(16).fill(0);
  return {
    stepsPerBar: 16,
    kick: pattern.kick ?? defaultArray,
    snare: pattern.snare ?? defaultArray,
    clap: pattern.clap ?? defaultArray,
    hihat: pattern.hihat ?? defaultArray,
    openHat: pattern.openHat ?? defaultArray,
    bass: pattern.bass ?? defaultArray
  };
}

// Export genre rules for external use
export { GENRE_RULES, TRAP_RULES, LOFI_RULES, HOUSE_RULES };

