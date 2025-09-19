import type { AudioSample } from './SampleEngine';

// Base URL for audio files
const BASE_URL = '/sounds';

// Helper function to create sample URLs
const createSampleUrls = (genre: string, type: string, files: string[]): string[] => {
  return files.map(file => `${BASE_URL}/${genre}/${type}/${file}`);
};

export const SAMPLE_CONFIGS: Record<string, AudioSample> = {
  'hip-hop': {
    kick: createSampleUrls('Hip Hop & Rap', 'Drum kits', [
      'BOOMIN KICK 1.wav',
      'BOOMIN KICK 2.wav',
      'BOOMIN KICK 3.wav'
    ]),
    snare: createSampleUrls('Hip Hop & Rap', 'Drum kits', [
      'BOOMIN CLAP 1.wav',
      'BOOMIN CLAP 2.wav',
      'BOOMIN CLAP 3.wav'
    ]),
    hihat: createSampleUrls('Hip Hop & Rap', 'Drum kits', [
      'BOOMIN HAT 1.wav',
      'BOOMIN HAT 2.wav',
      'BOOMIN HAT 3.wav'
    ]),
    openHat: createSampleUrls('Hip Hop & Rap', 'Drum kits', [
      'BOOMIN OPEN HAT 1.wav',
      'BOOMIN OPEN HAT 2.wav',
      'BOOMIN OPEN HAT 3.wav'
    ]),
    bass: createSampleUrls('Hip Hop & Rap', 'Drum kits', [
      'BOOMIN 808 1.wav',
      'BOOMIN 808 2.wav',
      'BOOMIN 808 3.wav'
    ])
  },

  'emo-rap': {
    kick: createSampleUrls('Emo Rap', 'Drum Kits', [
      'BOOMIN KICK 1.wav',
      'BOOMIN KICK 2.wav',
      'BOOMIN KICK 3.wav'
    ]),
    snare: createSampleUrls('Emo Rap', 'Drum Kits', [
      'BOOMIN CLAP 1.wav',
      'BOOMIN CLAP 2.wav',
      'BOOMIN CLAP 3.wav'
    ]),
    hihat: createSampleUrls('Emo Rap', 'Drum Kits', [
      'BOOMIN HAT 1.wav',
      'BOOMIN HAT 2.wav',
      'BOOMIN HAT 3.wav'
    ]),
    openHat: createSampleUrls('Emo Rap', 'Drum Kits', [
      'BOOMIN OPEN HAT 1.wav',
      'BOOMIN OPEN HAT 2.wav',
      'BOOMIN OPEN HAT 3.wav'
    ]),
    bass: createSampleUrls('Emo Rap', 'Drum Kits', [
      'BOOMIN 808 1.wav',
      'BOOMIN 808 2.wav',
      'BOOMIN 808 3.wav'
    ])
  },

  'trap': {
    kick: createSampleUrls('Hip Hop & Rap', 'Drum kits', [
      'BOOMIN 808 1.wav',
      'BOOMIN 808 2.wav',
      'BOOMIN 808 3.wav'
    ]),
    snare: createSampleUrls('Hip Hop & Rap', 'Drum kits', [
      'BOOMIN CLASSIC TRAP HOUSE SNARE 1.wav',
      'BOOMIN CLASSIC TRAP HOUSE SNARE 2.wav',
      'BOOMIN CLASSIC TRAP HOUSE SNARE 3.wav'
    ]),
    hihat: createSampleUrls('Hip Hop & Rap', 'Drum kits', [
      'BOOMIN HAT 1.wav',
      'BOOMIN HAT 2.wav',
      'BOOMIN HAT 3.wav'
    ]),
    openHat: createSampleUrls('Hip Hop & Rap', 'Drum kits', [
      'BOOMIN OPEN HAT 1.wav',
      'BOOMIN OPEN HAT 2.wav',
      'BOOMIN OPEN HAT 3.wav'
    ]),
    bass: createSampleUrls('Hip Hop & Rap', 'Drum kits', [
      'BOOMIN 808 1.wav',
      'BOOMIN 808 2.wav',
      'BOOMIN 808 3.wav'
    ])
  },

  // Country uses regular bass (no 808s)
  'country': {
    kick: createSampleUrls('Hip Hop & Rap', 'Drum kits', [
      'BOOMIN KICK 1.wav',
      'BOOMIN KICK 2.wav',
      'BOOMIN KICK 3.wav'
    ]),
    snare: createSampleUrls('Hip Hop & Rap', 'Drum kits', [
      'BOOMIN CLAP 1.wav',
      'BOOMIN CLAP 2.wav',
      'BOOMIN CLAP 3.wav'
    ]),
    hihat: createSampleUrls('Hip Hop & Rap', 'Drum kits', [
      'BOOMIN HAT 1.wav',
      'BOOMIN HAT 2.wav',
      'BOOMIN HAT 3.wav'
    ]),
    openHat: createSampleUrls('Hip Hop & Rap', 'Drum kits', [
      'BOOMIN OPEN HAT 1.wav',
      'BOOMIN OPEN HAT 2.wav',
      'BOOMIN OPEN HAT 3.wav'
    ]),
    bass: createSampleUrls('Hip Hop & Rap', 'Drum kits', [
      'BOOMIN BASS 1.wav',
      'BOOMIN BASS 2.wav',
      'BOOMIN BASS 3.wav'
    ])
  },

  // EDM uses regular bass (no 808s)
  'edm': {
    kick: createSampleUrls('Hip Hop & Rap', 'Drum kits', [
      'BOOMIN KICK 1.wav',
      'BOOMIN KICK 2.wav',
      'BOOMIN KICK 3.wav'
    ]),
    snare: createSampleUrls('Hip Hop & Rap', 'Drum kits', [
      'BOOMIN CLAP 1.wav',
      'BOOMIN CLAP 2.wav',
      'BOOMIN CLAP 3.wav'
    ]),
    hihat: createSampleUrls('Hip Hop & Rap', 'Drum kits', [
      'BOOMIN HAT 1.wav',
      'BOOMIN HAT 2.wav',
      'BOOMIN HAT 3.wav'
    ]),
    openHat: createSampleUrls('Hip Hop & Rap', 'Drum kits', [
      'BOOMIN OPEN HAT 1.wav',
      'BOOMIN OPEN HAT 2.wav',
      'BOOMIN OPEN HAT 3.wav'
    ]),
    bass: createSampleUrls('Hip Hop & Rap', 'Drum kits', [
      'BOOMIN BASS 1.wav',
      'BOOMIN BASS 2.wav',
      'BOOMIN BASS 3.wav'
    ])
  },

  // Rock uses regular bass (no 808s)
  'rock': {
    kick: createSampleUrls('Hip Hop & Rap', 'Drum kits', [
      'BOOMIN KICK 1.wav',
      'BOOMIN KICK 2.wav',
      'BOOMIN KICK 3.wav'
    ]),
    snare: createSampleUrls('Hip Hop & Rap', 'Drum kits', [
      'BOOMIN CLAP 1.wav',
      'BOOMIN CLAP 2.wav',
      'BOOMIN CLAP 3.wav'
    ]),
    hihat: createSampleUrls('Hip Hop & Rap', 'Drum kits', [
      'BOOMIN HAT 1.wav',
      'BOOMIN HAT 2.wav',
      'BOOMIN HAT 3.wav'
    ]),
    openHat: createSampleUrls('Hip Hop & Rap', 'Drum kits', [
      'BOOMIN OPEN HAT 1.wav',
      'BOOMIN OPEN HAT 2.wav',
      'BOOMIN OPEN HAT 3.wav'
    ]),
    bass: createSampleUrls('Hip Hop & Rap', 'Drum kits', [
      'BOOMIN BASS 1.wav',
      'BOOMIN BASS 2.wav',
      'BOOMIN BASS 3.wav'
    ])
  }
};