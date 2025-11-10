// Utility functions for pattern generation
import type { PRNG, StepArray } from './types';

/**
 * Generate Euclidean rhythm pattern
 * @param k Number of hits
 * @param n Total steps
 * @returns Boolean array of length n
 */
export function euclidean(k: number, n: number): boolean[] {
  if (k === 0) return new Array(n).fill(false);
  if (k >= n) return new Array(n).fill(true);

  const pattern: boolean[] = new Array(n).fill(false);
  const bucket = new Array(n).fill(0).map((_, i) => Math.floor((i * k) / n));
  
  for (let i = 0; i < n; i++) {
    if (i === 0 || bucket[i] !== bucket[i - 1]) {
      pattern[i] = true;
    }
  }
  
  return pattern;
}

/**
 * Softmax with temperature for probability conversion
 */
export function softmax(scores: number[], temperature: number): number[] {
  if (temperature === 0) {
    // Return one-hot for max score
    const max = Math.max(...scores);
    return scores.map(s => s === max ? 1 : 0);
  }
  
  const expScores = scores.map(s => Math.exp(s / temperature));
  const sum = expScores.reduce((a, b) => a + b, 0);
  return expScores.map(e => e / sum);
}

/**
 * Check if a step is an offbeat (8th note offbeats: 2, 6, 10, 14)
 */
export function isOffbeat(step: number): boolean {
  return step % 4 === 2;
}

/**
 * Check if a step is a weak 16th (odd steps)
 */
export function isWeak16th(step: number): boolean {
  return step % 2 === 1;
}

/**
 * Sample an index from probability distribution
 */
export function sampleFromDistribution(probs: number[], rng: PRNG): number {
  const r = rng.next();
  let cumsum = 0;
  for (let i = 0; i < probs.length; i++) {
    cumsum += probs[i];
    if (r <= cumsum) return i;
  }
  return probs.length - 1;
}

/**
 * Get all steps within minDistance of a given step (wrapping around 16)
 */
export function getStepsWithinDistance(step: number, minDistance: number): number[] {
  const steps: number[] = [];
  for (let i = 0; i < 16; i++) {
    const dist = Math.min(
      Math.abs(i - step),
      Math.abs(i - step + 16),
      Math.abs(i - step - 16)
    );
    if (dist < minDistance) {
      steps.push(i);
    }
  }
  return steps;
}

/**
 * Check if two step arrays have any collisions at the same step
 */
export function hasCollision(step1: number[], step2: number[]): boolean {
  for (let i = 0; i < 16; i++) {
    if (step1[i] !== 0 && step2[i] !== 0) {
      return true;
    }
  }
  return false;
}

/**
 * Count non-zero values in a step array
 */
export function countHits(pattern: StepArray): number {
  return pattern.filter(v => v !== 0).length;
}
