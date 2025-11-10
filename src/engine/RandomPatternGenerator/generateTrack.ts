// Generate a single instrument track based on rules
import type { InstrumentRules, StepArray, TrackPattern, PRNG, InstrumentName } from './types';
import { getStepsWithinDistance, isOffbeat, isWeak16th, softmax, sampleFromDistribution } from './utils';

function countHits(pattern: StepArray): number {
  return pattern.filter(v => v !== 0).length;
}

export function generateTrack(
  _instrument: InstrumentName,
  rules: InstrumentRules,
  rng: PRNG,
  existing: TrackPattern = {},
  globalSyncopation: number = 0,
  globalVariation: number = 0.5,
  allowGhosts: boolean = true,
  allowRatchets: boolean = false
): StepArray {
  const pattern: StepArray = new Array(16).fill(0);
  
  // Step 1: Place seeds first (unconditionally, subject to allowed mask)
  const seeds = rules.seeds.filter(step => step >= 0 && step < 16 && rules.allowed[step]);
  for (const step of seeds) {
    pattern[step] = 1;
  }
  
  // Step 2: Compute target hit count from density
  let targetHits: number;
  if (Array.isArray(rules.density)) {
    const [min, max] = rules.density;
    targetHits = rng.nextInt(min, max + 1); // [min, max] inclusive
  } else {
    targetHits = Math.round(rules.density);
  }
  
  // Ensure seeds don't exceed target
  const currentHits = countHits(pattern);
  targetHits = Math.max(targetHits, currentHits);
  
  // Step 3: Build candidate pool
  const candidates: number[] = [];
  for (let step = 0; step < 16; step++) {
    // Must be allowed
    if (!rules.allowed[step]) continue;
    
    // Skip if already placed as seed
    if (pattern[step] !== 0) continue;
    
    // Check minDistance constraint
    const withinDistance = getStepsWithinDistance(step, rules.minDistance);
    const violatesDistance = withinDistance.some(s => pattern[s] !== 0);
    if (violatesDistance) continue;
    
    candidates.push(step);
  }
  
  // If we have enough seeds, skip additional placement
  if (currentHits >= targetHits) {
    // Apply ghost notes if enabled
    if (allowGhosts && rules.ghost) {
      applyGhostNotes(pattern, rules, rng, existing);
    }
    return pattern;
  }
  
  // Step 4: Score candidates and sample
  const placed = new Set(seeds);
  const remaining = targetHits - currentHits;
  
  for (let i = 0; i < remaining && candidates.length > 0; i++) {
    // Rebuild candidates (excluding already placed)
    const available = candidates.filter(s => !placed.has(s) && pattern[s] === 0);
    if (available.length === 0) break;
    
    // Score each candidate
    const scores = available.map(step => scoreCandidate(
      step,
      rules,
      existing,
      pattern,
      globalSyncopation
    ));
    
    // Convert to probabilities with temperature based on variation
    const temperature = 0.1 + globalVariation * 0.9; // [0.1, 1.0]
    const probs = softmax(scores, temperature);
    
    // Sample without replacement
    const idx = sampleFromDistribution(probs, rng);
    const selected = available[idx];
    pattern[selected] = 1;
    placed.add(selected);
    
    // Remove candidates that violate minDistance
    const toRemove = getStepsWithinDistance(selected, rules.minDistance);
    toRemove.forEach(s => {
      const idx = candidates.indexOf(s);
      if (idx >= 0 && !placed.has(s)) {
        candidates.splice(idx, 1);
      }
    });
  }
  
  // Step 5: Iterative repair (check for violations)
  repairViolations(pattern, rules, existing, rng);
  
  // Step 6: Apply decorations
  if (allowGhosts && rules.ghost) {
    applyGhostNotes(pattern, rules, rng, existing);
  }
  
  if (allowRatchets && rules.ratchet) {
    applyRatchets(pattern, rules, rng);
  }
  
  return pattern;
}

function scoreCandidate(
  step: number,
  rules: InstrumentRules,
  existing: TrackPattern,
  currentPattern: StepArray,
  globalSyncopation: number
): number {
  let score = rules.weights[step] || 0;
  
  // Syncopation boost (offbeats and weak 16ths)
  const syncBias = rules.syncBias !== undefined ? rules.syncBias : globalSyncopation;
  if (syncBias > 0) {
    if (isOffbeat(step)) {
      score += 0.5 * syncBias;
    }
    if (isWeak16th(step)) {
      score += 0.3 * syncBias;
    }
  }
  
  // Anti-collision: complement other instruments
  if (rules.collisions?.preferBefore) {
    for (const other of rules.collisions.preferBefore) {
      const nextStep = (step + 1) % 16;
      if (existing[other]?.[nextStep]) {
        score += 0.3;
      }
    }
  }
  
  if (rules.collisions?.preferAfter) {
    for (const other of rules.collisions.preferAfter) {
      const prevStep = (step - 1 + 16) % 16;
      if (existing[other]?.[prevStep]) {
        score += 0.3;
      }
    }
  }
  
  // Collision penalty (disallowSameAs)
  if (rules.collisions?.disallowSameAs) {
    for (const other of rules.collisions.disallowSameAs) {
      if (existing[other]?.[step]) {
        return -Infinity; // Hard constraint
      }
    }
  }
  
  // Spacing penalty (already handled by candidate filtering, but add small penalty for proximity)
  const withinDistance = getStepsWithinDistance(step, rules.minDistance);
  const nearbyHits = withinDistance.filter(s => currentPattern[s] !== 0 && s !== step).length;
  if (nearbyHits > 0) {
    score -= 0.5 * nearbyHits;
  }
  
  return score;
}

function repairViolations(
  pattern: StepArray,
  rules: InstrumentRules,
  existing: TrackPattern,
  _rng: PRNG
): void {
  // Check for violations and remove lowest-scoring offenders
  const violations: Array<{ step: number; score: number }> = [];
  
  for (let step = 0; step < 16; step++) {
    if (pattern[step] === 0) continue;
    
    // Check minDistance
    const withinDistance = getStepsWithinDistance(step, rules.minDistance);
    const otherHits = withinDistance.filter(s => pattern[s] !== 0 && s !== step);
    if (otherHits.length > 0) {
      violations.push({
        step,
        score: rules.weights[step] || 0
      });
    }
    
    // Check collisions
    if (rules.collisions?.disallowSameAs) {
      for (const other of rules.collisions.disallowSameAs) {
        if (existing[other]?.[step]) {
          violations.push({
            step,
            score: -Infinity
          });
        }
      }
    }
  }
  
  // Remove violations, starting with lowest scores
  violations.sort((a, b) => a.score - b.score);
  for (const v of violations) {
    if (!rules.seeds.includes(v.step)) {
      // Only remove if not a seed
      pattern[v.step] = 0;
    }
  }
}

function applyGhostNotes(
  pattern: StepArray,
  rules: InstrumentRules,
  rng: PRNG,
  _existing: TrackPattern
): void {
  if (!rules.ghost) return;
  
  const velocityScale = rules.ghost.velocityScale || 0.4;
  const mainHits = pattern
    .map((v, i) => ({ step: i, value: v }))
    .filter(({ value }) => value > 0)
    .filter(({ step }) => rules.seeds.includes(step) || rng.next() < 0.5); // Only add ghosts to some hits
  
  for (const { step } of mainHits) {
    if (rng.next() > rules.ghost.chance) continue;
    
    for (const offset of rules.ghost.offsetSteps) {
      const ghostStep = (step + offset + 16) % 16;
      
      // Check if allowed
      if (!rules.allowed[ghostStep]) continue;
      
      // Check minDistance from main hits (ghosts can be closer)
      const tooClose = pattern.some((v, i) => 
        v > velocityScale && getStepsWithinDistance(ghostStep, rules.minDistance).includes(i)
      );
      if (tooClose) continue;
      
      // Add ghost (low velocity)
      if (pattern[ghostStep] === 0) {
        pattern[ghostStep] = Math.round(velocityScale * 10) / 10; // Small integer representation
      }
    }
  }
}

function applyRatchets(
  pattern: StepArray,
  rules: InstrumentRules,
  rng: PRNG
): void {
  if (!rules.ratchet) return;
  
  for (const candidateStep of rules.ratchet.steps) {
    if (pattern[candidateStep] === 0) continue;
    if (rng.next() > rules.ratchet.chance) continue;
    
    // Select division
    const division = rules.ratchet.divisions[
      rng.nextInt(0, rules.ratchet.divisions.length)
    ];
    
    // Represent ratchet as small integer (division count)
    pattern[candidateStep] = division;
  }
}

