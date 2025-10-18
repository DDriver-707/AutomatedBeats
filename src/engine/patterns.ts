// Standard drum patterns for each genre
export const patterns = {
  hiphopPattern: {
    kick:      [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], // No kick
    snare:     [0,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,0,0], // Snare on 5 and 13 (switched from clap)
    clap:      [0,0,0,1, 0,0,0,0, 0,0,0,1, 0,0,0,0], // Clap on 4 and 12 (switched from snare)
    hihat:     [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1], // Steady 16th notes
    openhihat: [0,0,0,1, 0,0,0,0, 0,0,0,1, 0,0,0,0], // Open hat on 3 and 11
    bass:      [0,0,0,0, 0,1,0,0, 0,0,0,0, 0,0,0,1]  // Bass on 1 and 9
  },

  emorapPattern: {
    kick:      [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], // No kick
    snare:     [0,0,0,0, 0,0,0,1, 0,1,0,0, 0,0,0,0], // Snare on 9 (switched from clap)
    clap:      [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0], // Clap on 5 and 13 (switched from snare)
    hihat:     [1,0,0,1, 0,1,0,0, 1,0,0,1, 0,1,0,0],
    openhihat: [0,0,0,0, 0,0,0,0, 0,1,0,0, 0,0,0,0],
    bass:      [1,0,0,0, 0,0,1,0, 0,0,1,0, 0,0,0,0]
  },

  countryPattern: {
    kick:      [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], // No kick
    snare:     [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,0,0], // Snare on 11 (switched from clap)
    clap:      [0,0,0,0, 1,0,0,0, 0,0,0,0, 0,0,1,0], // Clap on 5 and 13 (switched from snare)
    hihat:     [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0], // Steady 8th notes
    openhihat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 1,0,0,0], // No open hat
    bass:      [1,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0]  // Bass on 4 and 12
  },

  edmPattern: {
    kick:      [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], // No kick
    snare:     [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], // No snare (switched from clap)
    clap:      [0,0,0,1, 0,0,0,0, 0,0,0,1, 0,0,0,0], // Clap on 5 and 13 (switched from snare)
    hihat:     [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0], // Offbeat hi-hats
    openhihat: [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,0,0], // Minimal open hat
    bass:      [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0]  // Bass on every beat
  },

  rockPattern: {
    kick:      [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], // No kick
    snare:     [0,0,0,0, 0,0,1,0, 0,1,0,0, 0,0,0,0], // No snare (switched from clap)
    clap:      [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0], // Clap on 5 and 13 (switched from snare)
    hihat:     [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
    openhihat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    bass:      [1,0,0,0, 1,0,0,0, 1,0,0,0, 0,0,0,0]
  },

  trapPattern: {
    kick:      [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], // No kick
    snare:     [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], // No snare (switched from clap)
    clap:      [0,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0], // Clap on 5 and 13 (switched from snare)
    hihat:     [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1], // Hi-hat rolls with gaps
    openhihat: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0], // Open hat accents
    bass:      [1,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,0,0]  // Bass pattern
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
  emorap: { min: 75, max: 85, default: 80 },
  country: { min: 100, max: 120, default: 110 },
  edm: { min: 125, max: 130, default: 128 },
  rock: { min: 110, max: 130, default: 120 },
  trap: { min: 140, max: 150, default: 145 }
};
