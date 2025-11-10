// Genre rule bundles for trap, lofi, and house
import type { GenreRules } from './types';

export type { GenreRules };

// Helper to create default allowed (all true)
function allAllowed(): boolean[] {
  return new Array(16).fill(true);
}

// Helper to create default weights (uniform)
function uniformWeights(value: number = 1): number[] {
  return new Array(16).fill(value);
}

// Trap genre rules
export const TRAP_RULES: GenreRules = {
  snare: {
    allowed: allAllowed(),
    weights: [
      0.1, 0.1, 0.1, 0.1, // 0-3: low
      1.0, 0.1, 0.4, 0.1, // 4-7: very high on 4, medium on 7
      0.1, 0.1, 0.1, 0.1, // 8-11: low
      1.0, 0.1, 0.4, 0.1  // 12-15: very high on 12, medium on 15
    ],
    seeds: [4, 12],
    density: [2, 3],
    minDistance: 3,
    collisions: {
      disallowSameAs: [],
      preferBefore: [],
      preferAfter: []
    },
    syncBias: 0.2
  },
  
  clap: {
    allowed: allAllowed(),
    weights: uniformWeights(0.2),
    seeds: [],
    density: [0, 1],
    minDistance: 4,
    collisions: {
      disallowSameAs: ['snare'],
      preferBefore: [],
      preferAfter: []
    },
    syncBias: 0.1
  },
  
  kick: {
    allowed: allAllowed(),
    weights: [
      1.0, 0.1, 0.1, 0.4, // 0-3: very high on 0, medium on 3
      0.0, 0.1, 0.4, 0.1, // 4-7: zero on 4 (snare), medium on 7
      1.0, 0.1, 0.4, 0.1, // 8-11: very high on 8, medium on 11
      0.0, 0.1, 0.4, 0.4  // 12-15: zero on 12 (snare), medium on 15
    ],
    seeds: [],
    density: [3, 6],
    minDistance: 2,
    collisions: {
      disallowSameAs: ['snare', 'clap'],
      preferBefore: ['snare'],
      preferAfter: []
    },
    syncBias: 0.1
  },
  
  hihat: {
    allowed: allAllowed(),
    weights: [
      0.8, 0.6, 0.9, 0.6, // 0-3: slightly boosted on 2
      0.8, 0.6, 0.9, 0.6, // 4-7: slightly boosted on 6
      0.8, 0.6, 0.9, 0.6, // 8-11: slightly boosted on 10
      0.8, 0.6, 0.9, 0.6  // 12-15: slightly boosted on 14
    ],
    seeds: [],
    density: [8, 12],
    minDistance: 1,
    collisions: {},
    syncBias: 0.4,
    ratchet: {
      steps: [7, 15],
      chance: 0.15,
      divisions: [2, 3, 4]
    }
  },
  
  openHat: {
    allowed: [
      false, true, true, true,  // 0-3: false on 0
      false, true, true, true,  // 4-7: false on 4
      true, true, true, true,   // 8-11: all true
      true, true, true, true    // 12-15: all true
    ],
    weights: [
      0.0, 0.2, 0.8, 0.3, // 0-3: high on 2
      0.0, 0.2, 0.8, 0.3, // 4-7: high on 6
      0.2, 0.2, 0.8, 0.3, // 8-11: high on 10
      0.2, 0.2, 0.8, 0.3  // 12-15: high on 14
    ],
    seeds: [],
    density: [1, 2],
    minDistance: 3,
    collisions: {},
    syncBias: 0.5
  },
  
  bass: {
    allowed: allAllowed(),
    weights: [
      0.8, 0.3, 0.2, 0.4, // 0-3: high on 0, medium on 3
      0.0, 0.2, 0.4, 0.2, // 4-7: zero on 4, medium on 7
      0.8, 0.3, 0.2, 0.4, // 8-11: high on 8, medium on 11
      0.0, 0.2, 0.4, 0.4  // 12-15: zero on 12, medium on 15
    ],
    seeds: [],
    density: [1, 4],
    minDistance: 2,
    collisions: {
      disallowSameAs: ['snare'],
      preferBefore: [],
      preferAfter: ['kick']
    },
    syncBias: 0.2
  }
};

// Lo-Fi / Boom-Bap genre rules
export const LOFI_RULES: GenreRules = {
  snare: {
    allowed: allAllowed(),
    weights: [
      0.1, 0.1, 0.1, 0.3, // 0-3: medium on 3 (ghost candidate)
      1.0, 0.2, 0.1, 0.3, // 4-7: very high on 4, medium on 5 (ghost candidate)
      0.1, 0.1, 0.1, 0.3, // 8-11: medium on 11
      1.0, 0.2, 0.1, 0.3  // 12-15: very high on 12, medium on 13
    ],
    seeds: [4, 12],
    density: [2, 3],
    minDistance: 3,
    collisions: {},
    syncBias: 0.3,
    ghost: {
      chance: 0.3,
      offsetSteps: [-1, 1],
      velocityScale: 0.4
    }
  },
  
  clap: {
    allowed: allAllowed(),
    weights: uniformWeights(0.1),
    seeds: [],
    density: [0, 1],
    minDistance: 4,
    collisions: {},
    syncBias: 0.1
  },
  
  kick: {
    allowed: allAllowed(),
    weights: [
      1.0, 0.2, 0.1, 0.1, // 0-3: very high on 0
      0.1, 0.1, 0.1, 0.1, // 4-7: low
      1.0, 0.2, 0.3, 0.1, // 8-11: very high on 8, medium on 11
      0.1, 0.1, 0.1, 0.3  // 12-15: medium on 15
    ],
    seeds: [],
    density: [2, 4],
    minDistance: 2,
    collisions: {},
    syncBias: 0.1
  },
  
  hihat: {
    allowed: allAllowed(),
    weights: [
      0.5, 0.3, 1.0, 0.3, // 0-3: very high on 2 (offbeat)
      0.5, 0.3, 1.0, 0.3, // 4-7: very high on 6 (offbeat)
      0.5, 0.3, 1.0, 0.3, // 8-11: very high on 10 (offbeat)
      0.5, 0.3, 1.0, 0.3  // 12-15: very high on 14 (offbeat)
    ],
    seeds: [],
    density: [8, 10],
    minDistance: 1,
    collisions: {},
    syncBias: 0.6
  },
  
  openHat: {
    allowed: [
      false, true, true, true,  // 0-3: false on 0
      false, true, true, true,  // 4-7: false on 4
      true, true, true, true,   // 8-11: all true
      true, true, true, true    // 12-15: all true
    ],
    weights: uniformWeights(0.2),
    seeds: [],
    density: [0, 1],
    minDistance: 4,
    collisions: {},
    syncBias: 0.4
  },
  
  bass: {
    allowed: allAllowed(),
    weights: [
      0.8, 0.3, 0.1, 0.1, // 0-3: high on 0
      0.1, 0.1, 0.1, 0.1, // 4-7: low
      0.8, 0.3, 0.2, 0.1, // 8-11: high on 8
      0.1, 0.1, 0.1, 0.2  // 12-15: low
    ],
    seeds: [],
    density: [2, 4],
    minDistance: 2,
    collisions: {},
    syncBias: 0.2
  }
};

// House genre rules
export const HOUSE_RULES: GenreRules = {
  kick: {
    allowed: allAllowed(),
    weights: [
      1.0, 0.0, 0.0, 0.0, // 0-3: very high on 0
      1.0, 0.0, 0.0, 0.0, // 4-7: very high on 4
      1.0, 0.0, 0.0, 0.0, // 8-11: very high on 8
      1.0, 0.0, 0.0, 0.0  // 12-15: very high on 12
    ],
    seeds: [0, 4, 8, 12],
    density: 4,
    minDistance: 4,
    collisions: {},
    syncBias: 0.0
  },
  
  snare: {
    allowed: allAllowed(),
    weights: [
      0.1, 0.1, 0.1, 0.1, // 0-3: low
      1.0, 0.1, 0.1, 0.1, // 4-7: very high on 4
      0.1, 0.1, 0.1, 0.1, // 8-11: low
      1.0, 0.1, 0.1, 0.1  // 12-15: very high on 12
    ],
    seeds: [4, 12],
    density: [1, 2],
    minDistance: 4,
    collisions: {},
    syncBias: 0.1
  },
  
  clap: {
    allowed: allAllowed(),
    weights: uniformWeights(0.1),
    seeds: [],
    density: [0, 1],
    minDistance: 4,
    collisions: {},
    syncBias: 0.1
  },
  
  hihat: {
    allowed: allAllowed(),
    weights: [
      0.3, 0.2, 1.0, 0.2, // 0-3: very high on 2 (offbeat)
      0.3, 0.2, 1.0, 0.2, // 4-7: very high on 6 (offbeat)
      0.3, 0.2, 1.0, 0.2, // 8-11: very high on 10 (offbeat)
      0.3, 0.2, 1.0, 0.2  // 12-15: very high on 14 (offbeat)
    ],
    seeds: [],
    density: [6, 10],
    minDistance: 1,
    collisions: {},
    syncBias: 0.5
  },
  
  openHat: {
    allowed: [
      false, true, true, true,  // 0-3: false on 0
      false, true, true, true,  // 4-7: false on 4
      true, true, true, true,   // 8-11: all true
      true, true, true, true    // 12-15: all true
    ],
    weights: [
      0.0, 0.2, 1.0, 0.2, // 0-3: very high on 2
      0.0, 0.2, 1.0, 0.2, // 4-7: very high on 6
      0.2, 0.2, 0.8, 0.2, // 8-11: high on 10
      0.2, 0.2, 0.8, 0.2  // 12-15: high on 14
    ],
    seeds: [],
    density: [1, 2],
    minDistance: 4,
    collisions: {},
    syncBias: 0.6
  },
  
  bass: {
    allowed: allAllowed(),
    weights: [
      1.0, 0.1, 0.1, 0.1, // 0-3: very high on 0
      0.1, 0.1, 0.1, 0.1, // 4-7: low
      1.0, 0.1, 0.1, 0.1, // 8-11: very high on 8
      0.1, 0.1, 0.1, 0.1  // 12-15: low
    ],
    seeds: [],
    density: [2, 4],
    minDistance: 2,
    collisions: {},
    syncBias: 0.1
  }
};

// Genre rules mapping
export const GENRE_RULES: Record<'trap' | 'lofi' | 'house', GenreRules> = {
  trap: TRAP_RULES,
  lofi: LOFI_RULES,
  house: HOUSE_RULES
};

