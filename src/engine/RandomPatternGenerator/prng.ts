// Deterministic seeded PRNG (mulberry32)
import type { PRNG } from './types';

export type { PRNG };

export class SeededPRNG implements PRNG {
  private state: number;

  constructor(seed: number) {
    this.state = seed;
  }

  get seed(): number {
    return this.state;
  }

  next(): number {
    // mulberry32 PRNG
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  nextInt(min: number, max: number): number {
    // Returns integer in [min, max)
    return Math.floor(this.next() * (max - min)) + min;
  }

  // Additional utility for weighted sampling
  sampleFromWeights(weights: number[]): number {
    const total = weights.reduce((sum, w) => sum + Math.max(0, w), 0);
    if (total === 0) {
      return Math.floor(this.next() * weights.length);
    }
    let r = this.next() * total;
    for (let i = 0; i < weights.length; i++) {
      r -= Math.max(0, weights[i]);
      if (r <= 0) return i;
    }
    return weights.length - 1;
  }
}

// Helper to create a new PRNG from a seed
export function createPRNG(seed: number): PRNG {
  return new SeededPRNG(seed);
}

