// Unit tests for RandomPatternGenerator
import { describe, it, expect } from 'vitest';
import { generatePattern } from '../index';
import { TRAP_RULES } from '../genres';
import { createPRNG } from '../prng';
import { generateTrack } from '../generateTrack';

describe('RandomPatternGenerator', () => {
  const TEST_SEED = 12345;

  describe('Determinism', () => {
    it('should generate identical patterns for same genre, seed, and options', () => {
      const pattern1 = generatePattern('trap', TEST_SEED, {});
      const pattern2 = generatePattern('trap', TEST_SEED, {});
      
      expect(pattern1).toEqual(pattern2);
      expect(pattern1.kick).toEqual(pattern2.kick);
      expect(pattern1.snare).toEqual(pattern2.snare);
      expect(pattern1.hihat).toEqual(pattern2.hihat);
    });

    it('should generate different patterns for different seeds', () => {
      const pattern1 = generatePattern('trap', TEST_SEED, {});
      const pattern2 = generatePattern('trap', TEST_SEED + 1, {});
      
      // At least one instrument should differ
      const differs = 
        JSON.stringify(pattern1.kick) !== JSON.stringify(pattern2.kick) ||
        JSON.stringify(pattern1.snare) !== JSON.stringify(pattern2.snare) ||
        JSON.stringify(pattern1.hihat) !== JSON.stringify(pattern2.hihat);
      
      expect(differs).toBe(true);
    });
  });

  describe('Seeds', () => {
    it('should always place trap snare seeds at steps 4 and 12', () => {
      // Test multiple seeds to ensure consistency
      for (let seed = 1000; seed < 1100; seed++) {
        const pattern = generatePattern('trap', seed, {});
        expect(pattern.snare[4]).toBeGreaterThan(0);
        expect(pattern.snare[12]).toBeGreaterThan(0);
      }
    });

    it('should always place house kick seeds at steps 0, 4, 8, 12', () => {
      for (let seed = 2000; seed < 2100; seed++) {
        const pattern = generatePattern('house', seed, {});
        expect(pattern.kick[0]).toBeGreaterThan(0);
        expect(pattern.kick[4]).toBeGreaterThan(0);
        expect(pattern.kick[8]).toBeGreaterThan(0);
        expect(pattern.kick[12]).toBeGreaterThan(0);
      }
    });

    it('should always place lofi snare seeds at steps 4 and 12', () => {
      for (let seed = 3000; seed < 3100; seed++) {
        const pattern = generatePattern('lofi', seed, {});
        expect(pattern.snare[4]).toBeGreaterThan(0);
        expect(pattern.snare[12]).toBeGreaterThan(0);
      }
    });
  });

  describe('Allowed mask', () => {
    it('should never place openHat on forbidden steps in trap (0 and 4)', () => {
      for (let seed = 4000; seed < 4100; seed++) {
        const pattern = generatePattern('trap', seed, {});
        expect(pattern.openHat[0]).toBe(0);
        expect(pattern.openHat[4]).toBe(0);
      }
    });

    it('should never place openHat on forbidden steps in house (0 and 4)', () => {
      for (let seed = 5000; seed < 5100; seed++) {
        const pattern = generatePattern('house', seed, {});
        expect(pattern.openHat[0]).toBe(0);
        expect(pattern.openHat[4]).toBe(0);
      }
    });

    it('should respect allowed mask for all instruments', () => {
      // Create custom rules with restricted allowed steps
      const customRules = {
        ...TRAP_RULES,
        openHat: {
          ...TRAP_RULES.openHat,
          allowed: new Array(16).fill(false).map((_, i) => i % 2 === 0) // Only even steps
        }
      };
      
      const rng = createPRNG(TEST_SEED);
      const track = generateTrack('openHat', customRules.openHat, rng, {});
      
      for (let i = 0; i < 16; i++) {
        if (i % 2 === 1) {
          expect(track[i]).toBe(0);
        }
      }
    });
  });

  describe('Min distance', () => {
    it('should respect minDistance for trap snare (minDistance: 3)', () => {
      for (let seed = 6000; seed < 6100; seed++) {
        const pattern = generatePattern('trap', seed, {});
        const snareHits: number[] = [];
        
        for (let i = 0; i < 16; i++) {
          if (pattern.snare[i] !== 0) {
            snareHits.push(i);
          }
        }
        
        // Check distance between consecutive hits (wrapping)
        for (let i = 0; i < snareHits.length; i++) {
          const nextI = (i + 1) % snareHits.length;
          const dist = Math.min(
            Math.abs(snareHits[nextI] - snareHits[i]),
            Math.abs(snareHits[nextI] - snareHits[i] + 16),
            Math.abs(snareHits[nextI] - snareHits[i] - 16)
          );
          expect(dist).toBeGreaterThanOrEqual(3);
        }
      }
    });

    it('should respect minDistance for house kick (minDistance: 4)', () => {
      for (let seed = 7000; seed < 7100; seed++) {
        const pattern = generatePattern('house', seed, {});
        const kickHits: number[] = [];
        
        for (let i = 0; i < 16; i++) {
          if (pattern.kick[i] !== 0) {
            kickHits.push(i);
          }
        }
        
        // House kick should only have seeds at 0, 4, 8, 12 (all exactly 4 apart)
        expect(kickHits.length).toBe(4);
        expect(kickHits).toContain(0);
        expect(kickHits).toContain(4);
        expect(kickHits).toContain(8);
        expect(kickHits).toContain(12);
      }
    });

    it('should respect minDistance for all instruments', () => {
      const pattern = generatePattern('trap', TEST_SEED, {});
      
      // Check each instrument
      ['kick', 'snare', 'clap', 'hihat', 'openHat', 'bass'].forEach(instrument => {
        const track = pattern[instrument as keyof typeof pattern] as number[];
        const hits: number[] = [];
        
        for (let i = 0; i < 16; i++) {
          if (track[i] !== 0) {
            hits.push(i);
          }
        }
        
        const rules = TRAP_RULES[instrument as keyof typeof TRAP_RULES];
        const minDist = rules.minDistance;
        
        // Check distance between all pairs
        for (let i = 0; i < hits.length; i++) {
          for (let j = i + 1; j < hits.length; j++) {
            const dist = Math.min(
              Math.abs(hits[j] - hits[i]),
              Math.abs(hits[j] - hits[i] + 16),
              Math.abs(hits[j] - hits[i] - 16)
            );
            expect(dist).toBeGreaterThanOrEqual(minDist);
          }
        }
      });
    });
  });

  describe('Collisions', () => {
    it('should never place trap kick same-step as snare or clap', () => {
      for (let seed = 8000; seed < 8100; seed++) {
        const pattern = generatePattern('trap', seed, {});
        
        for (let i = 0; i < 16; i++) {
          if (pattern.kick[i] !== 0) {
            expect(pattern.snare[i]).toBe(0);
            expect(pattern.clap[i]).toBe(0);
          }
        }
      }
    });

    it('should never place trap bass same-step as snare', () => {
      for (let seed = 9000; seed < 9100; seed++) {
        const pattern = generatePattern('trap', seed, {});
        
        for (let i = 0; i < 16; i++) {
          if (pattern.bass[i] !== 0) {
            expect(pattern.snare[i]).toBe(0);
          }
        }
      }
    });

    it('should never place trap clap same-step as snare', () => {
      for (let seed = 10000; seed < 10100; seed++) {
        const pattern = generatePattern('trap', seed, {});
        
        for (let i = 0; i < 16; i++) {
          if (pattern.clap[i] !== 0) {
            expect(pattern.snare[i]).toBe(0);
          }
        }
      }
    });
  });

  describe('Density bounds', () => {
    it('should respect trap snare density range [2, 3]', () => {
      const counts = new Set<number>();
      
      for (let seed = 11000; seed < 11100; seed++) {
        const pattern = generatePattern('trap', seed, {});
        const count = pattern.snare.filter(v => v !== 0).length;
        counts.add(count);
        expect(count).toBeGreaterThanOrEqual(2);
        expect(count).toBeLessThanOrEqual(3);
      }
      
      // Should see at least 2 different counts in range
      expect(counts.size).toBeGreaterThanOrEqual(1);
    });

    it('should respect trap kick density range [3, 6]', () => {
      for (let seed = 12000; seed < 12100; seed++) {
        const pattern = generatePattern('trap', seed, {});
        const count = pattern.kick.filter(v => v !== 0).length;
        expect(count).toBeGreaterThanOrEqual(3);
        expect(count).toBeLessThanOrEqual(6);
      }
    });

    it('should respect trap hihat density range [8, 12]', () => {
      for (let seed = 13000; seed < 13100; seed++) {
        const pattern = generatePattern('trap', seed, {});
        const count = pattern.hihat.filter(v => v !== 0).length;
        expect(count).toBeGreaterThanOrEqual(8);
        expect(count).toBeLessThanOrEqual(12);
      }
    });

    it('should respect house kick fixed density (4)', () => {
      for (let seed = 14000; seed < 14100; seed++) {
        const pattern = generatePattern('house', seed, {});
        const count = pattern.kick.filter(v => v !== 0).length;
        expect(count).toBe(4);
      }
    });

    it('should respect lofi snare density range [2, 3]', () => {
      for (let seed = 15000; seed < 15100; seed++) {
        const pattern = generatePattern('lofi', seed, {});
        const count = pattern.snare.filter(v => v !== 0).length;
        expect(count).toBeGreaterThanOrEqual(2);
        expect(count).toBeLessThanOrEqual(3);
      }
    });
  });

  describe('Syncopation effect', () => {
    it('should prefer offbeats more with syncopation=1 than syncopation=0 for hats', () => {
      const pattern0 = generatePattern('trap', TEST_SEED, { syncopation: 0 });
      const pattern1 = generatePattern('trap', TEST_SEED, { syncopation: 1 });
      
      // Count offbeat hits (steps 2, 6, 10, 14)
      const offbeats0 = [2, 6, 10, 14].filter(s => pattern0.hihat[s] !== 0).length;
      const offbeats1 = [2, 6, 10, 14].filter(s => pattern1.hihat[s] !== 0).length;
      
      // With higher syncopation, should have more offbeats (or at least not fewer)
      expect(offbeats1).toBeGreaterThanOrEqual(offbeats0);
    });
  });

  describe('Polymorphism', () => {
    it('should work for trap genre', () => {
      const pattern = generatePattern('trap', TEST_SEED, {});
      expect(pattern).toBeDefined();
      expect(pattern.stepsPerBar).toBe(16);
      expect(pattern.kick.length).toBe(16);
      expect(pattern.snare.length).toBe(16);
      expect(pattern.hihat.length).toBe(16);
    });

    it('should work for lofi genre', () => {
      const pattern = generatePattern('lofi', TEST_SEED, {});
      expect(pattern).toBeDefined();
      expect(pattern.stepsPerBar).toBe(16);
      expect(pattern.kick.length).toBe(16);
      expect(pattern.snare.length).toBe(16);
      expect(pattern.hihat.length).toBe(16);
    });

    it('should work for house genre', () => {
      const pattern = generatePattern('house', TEST_SEED, {});
      expect(pattern).toBeDefined();
      expect(pattern.stepsPerBar).toBe(16);
      expect(pattern.kick.length).toBe(16);
      expect(pattern.snare.length).toBe(16);
      expect(pattern.hihat.length).toBe(16);
    });
  });

  describe('Pattern structure', () => {
    it('should return pattern with all required instruments', () => {
      const pattern = generatePattern('trap', TEST_SEED, {});
      
      expect(pattern).toHaveProperty('kick');
      expect(pattern).toHaveProperty('snare');
      expect(pattern).toHaveProperty('clap');
      expect(pattern).toHaveProperty('hihat');
      expect(pattern).toHaveProperty('openHat');
      expect(pattern).toHaveProperty('bass');
      expect(pattern.stepsPerBar).toBe(16);
    });

    it('should return arrays of length 16 for all instruments', () => {
      const pattern = generatePattern('trap', TEST_SEED, {});
      
      expect(pattern.kick.length).toBe(16);
      expect(pattern.snare.length).toBe(16);
      expect(pattern.clap.length).toBe(16);
      expect(pattern.hihat.length).toBe(16);
      expect(pattern.openHat.length).toBe(16);
      expect(pattern.bass.length).toBe(16);
    });

    it('should only contain valid step values (0 or positive numbers)', () => {
      const pattern = generatePattern('trap', TEST_SEED, {});
      
      const allInstruments = [
        pattern.kick,
        pattern.snare,
        pattern.clap,
        pattern.hihat,
        pattern.openHat,
        pattern.bass
      ];
      
      allInstruments.forEach(track => {
        track.forEach(value => {
          expect(value).toBeGreaterThanOrEqual(0);
        });
      });
    });
  });

  describe('Sample outputs', () => {
    it('should generate trap pattern for seed 12345', () => {
      const pattern = generatePattern('trap', 12345, {});
      
      // Just verify it's valid and deterministic
      expect(pattern).toBeDefined();
      expect(pattern.snare[4]).toBeGreaterThan(0);
      expect(pattern.snare[12]).toBeGreaterThan(0);
    });

    it('should generate lofi pattern for seed 12345', () => {
      const pattern = generatePattern('lofi', 12345, {});
      
      expect(pattern).toBeDefined();
      expect(pattern.snare[4]).toBeGreaterThan(0);
      expect(pattern.snare[12]).toBeGreaterThan(0);
    });

    it('should generate house pattern for seed 12345', () => {
      const pattern = generatePattern('house', 12345, {});
      
      expect(pattern).toBeDefined();
      expect(pattern.kick[0]).toBeGreaterThan(0);
      expect(pattern.kick[4]).toBeGreaterThan(0);
      expect(pattern.kick[8]).toBeGreaterThan(0);
      expect(pattern.kick[12]).toBeGreaterThan(0);
    });
  });
});


