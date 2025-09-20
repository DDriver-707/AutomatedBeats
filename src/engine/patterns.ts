// Standard drum patterns for each genre
export const patterns = {
  hiphopPattern: {
    kick:      [1,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0], // Kick on 1 and 11 (and of 3)
    snare:     [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0], // Snare on 2 and 4 (5 and 13)
    hihat:     [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0], // Steady 8th notes
    openhihat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], // Minimal open hat
    bass:      [1,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0]  // Bass follows kick
  },

  emorapPattern: {
    kick:      [1,0,0,0, 0,0,1,0, 0,0,0,0, 1,0,0,0],
    snare:     [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hihat:     [1,0,0,1, 0,1,0,0, 1,0,0,1, 0,1,0,0],
    openhihat: [0,0,0,0, 0,0,0,0, 0,1,0,0, 0,0,0,0],
    bass:      [1,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0]
  },

  countryPattern: {
    kick:      [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0], // Kick on 1 and 3 (9)
    snare:     [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0], // Snare on 2 and 4 (5 and 13)
    hihat:     [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0], // Steady 8th notes
    openhihat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], // Minimal open hat
    bass:      [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0]  // Bass locked with kick
  },

  edmPattern: {
    kick:      [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0], // Four-on-the-floor
    snare:     [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0], // Snare on 2 and 4
    hihat:     [0,1,0,1, 0,1,0,1, 0,1,0,1, 0,1,0,1], // Offbeat hi-hats
    openhihat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], // Minimal open hat
    bass:      [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0]  // Bass follows kick
  },

  rockPattern: {
    kick:      [1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,1,0],
    snare:     [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hihat:     [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
    openhihat: [0,0,0,0, 0,0,0,0, 0,1,0,0, 0,0,0,0],
    bass:      [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0]
  },

  trapPattern: {
    kick:      [1,0,0,0, 0,1,0,0, 1,0,0,0, 0,0,1,0], // Trap kick pattern
    snare:     [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0], // Snare on 2 and 4
    hihat:     [1,0,1,1, 1,0,1,1, 1,0,1,1, 1,0,1,1], // Hi-hat rolls with gaps
    openhihat: [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,1,0], // Open hat accents
    bass:      [1,0,0,0, 0,1,0,0, 1,0,0,0, 0,0,1,0]  // Bass follows kick
  }
};

// Melody patterns for each genre (note indices)
export const melodyPatterns = {
  hiphopPattern: [1,0,0,0, 2,0,0,0, 1,0,0,0, 2,0,0,0],
  emorapPattern: [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
  countryPattern: [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
  edmPattern: [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
  rockPattern: [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
  trapPattern: [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0]
};

// Swing/groove patterns (timing offsets in milliseconds)
export const swingPatterns = {
  none: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  light: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  medium: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  heavy: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]
};

// Genre-specific BPM ranges
export const genreBPMs = {
  hiphop: { min: 85, max: 95, default: 90 },
  emorap: { min: 65, max: 75, default: 70 },
  country: { min: 95, max: 110, default: 100 },
  edm: { min: 120, max: 128, default: 125 },
  rock: { min: 100, max: 120, default: 110 },
  trap: { min: 130, max: 150, default: 140 }
};
