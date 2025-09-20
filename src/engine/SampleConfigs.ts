import type { AudioSample } from './SampleEngine';

// Base URL for audio files
const BASE_URL = '/sounds';

// Helper function to create sample URLs
const createSampleUrls = (genre: string, type: string, files: string[]): string[] => {
  return files.map(file => `${BASE_URL}/${genre}/${type}/${file}`);
};

export const SAMPLE_CONFIGS: Record<string, AudioSample> = {
  'hip-hop': {
    kick: createSampleUrls('Hip Hop & Rap', 'Drum kits/Kicks', [
      'BOOMIN KICK 1.wav',
      'BOOMIN KICK 2.wav',
      'BOOMIN KICK 3.wav'
    ]),
    snare: createSampleUrls('Hip Hop & Rap', 'Drum kits/claps', [
      'clap (1).wav',
      'clap (2).wav',
      'clap (3).wav'
    ]),
    hihat: createSampleUrls('Hip Hop & Rap', 'Drum kits/hi hats', [
      'hi hat (1).wav',
      'hi hat (2).wav',
      'hi hat (3).wav'
    ]),
    openHat: createSampleUrls('Hip Hop & Rap', 'Drum kits/open hats', [
      'open hat (1).wav',
      'open hat (2).wav',
      'open hat (3).wav'
    ]),
    bass: createSampleUrls('Hip Hop & Rap', 'Drum kits/808', [
      '808 (1).wav',
      '808 (2).wav',
      '808 (3).wav'
    ]),
    melody: createSampleUrls('Hip Hop & Rap', 'melodies', [
      'don-toliver-x-gunna-type-loop-140-dmin.wav',
      'Sample 2 84Bpm Prod.hegell.wav',
      'Sample 3 94Bpm Prod.hegell.wav'
    ])
  },

  'emo-rap': {
    kick: createSampleUrls('Emo Rap', 'Drum Kits/Kicks', [
      'BOOMIN KICK 1.wav',
      'BOOMIN KICK 2.wav',
      'BOOMIN KICK 3.wav'
    ]),
    snare: createSampleUrls('Emo Rap', 'Drum Kits/claps', [
      'clap (1).wav',
      'clap (2).wav',
      'clap (3).wav'
    ]),
    hihat: createSampleUrls('Emo Rap', 'Drum Kits/hi hats', [
      'hi hat (1).wav',
      'hi hat (2).wav',
      'hi hat (3).wav'
    ]),
    openHat: createSampleUrls('Emo Rap', 'Drum Kits/open hats', [
      'open hat (1).wav',
      'open hat (2).wav',
      'open hat (3).wav'
    ]),
    bass: createSampleUrls('Emo Rap', 'Drum Kits/808', [
      '808 (1).wav',
      '808 (2).wav',
      '808 (3).wav'
    ]),
    melody: createSampleUrls('Emo Rap', 'Melodies', [
      'headaches 77 bpm.wav',
      'juice-wrld-x-nick-mira-she-not-there 140 bpm.wav',
      'Sample 1 82Bpm Prod.hegell.wav'
    ])
  },

  'trap': {
    kick: createSampleUrls('Trap', 'Drum Kits/808', [
      '808 (1).wav',
      '808 (2).wav',
      '808 (3).wav'
    ]),
    snare: createSampleUrls('Trap', 'Drum Kits/snares', [
      'snare (1).wav',
      'snare (2).wav',
      'snare (3).wav'
    ]),
    hihat: createSampleUrls('Trap', 'Drum Kits/hi hats', [
      'hi hat (1).wav',
      'hi hat (2).wav',
      'hi hat (3).wav'
    ]),
    openHat: createSampleUrls('Trap', 'Drum Kits/open hats', [
      'open hat (1).wav',
      'open hat (2).wav',
      'open hat (3).wav'
    ]),
    bass: createSampleUrls('Trap', 'Drum Kits/808', [
      '808 (1).wav',
      '808 (2).wav',
      '808 (3).wav'
    ]),
    melody: createSampleUrls('Trap', 'Melodies', [
      'ken-carson-x-playboi-carti-synth-loop 140 bpm.wav',
      'lil-baby-x-future-dumb-and-dumber 132 bpm.wav',
      'parachute-cubeatz-x-future-melody 170 bpm.wav'
    ])
  },

  // Country uses Rock samples (Country folder is empty)
  'country': {
    kick: createSampleUrls('Rock', 'Drum Kits/[HR] KICKS', [
      '[HR] KICK (1).wav',
      '[HR] KICK (2).wav',
      '[HR] KICK (3).wav'
    ]),
    snare: createSampleUrls('Rock', 'Drum Kits/[HR] SNARES', [
      '[HR] SNARE (1).wav',
      '[HR] SNARE (2).wav',
      '[HR] SNARE (3).wav'
    ]),
    hihat: createSampleUrls('Rock', 'Drum Kits/[HR] HATS', [
      '[HR] HAT (1).wav',
      '[HR] HAT (2).wav',
      '[HR] HAT (3).wav'
    ]),
    openHat: createSampleUrls('Rock', 'Drum Kits/[HR] HATS', [
      '[HR] HAT (15).wav',
      '[HR] HAT (16).wav',
      '[HR] HAT (17).wav'
    ]),
    bass: createSampleUrls('Rock', 'Drum Kits/[HR] KICKS', [
      '[HR] KICK (4).wav',
      '[HR] KICK (5).wav',
      '[HR] KICK (6).wav'
    ]),
    melody: createSampleUrls('Country', 'Melodies', [
      'acoustic-guitar-x-country-midland-nightclub 150 bpm.wav',
      'sunset-dust-summer-country-acoustic-loop 160 bpm.wav',
      'wisp-x-alternative-type-guitar 150 bpm.wav'
    ])
  },

  // EDM uses regular bass (no 808s)
  'edm': {
    kick: createSampleUrls('EDM', 'Drum Kits/Kicks', [
      '(EDM) Kick (1).wav',
      '(EDM) Kick (2).wav',
      '(EDM) Kick (3).wav'
    ]),
    snare: createSampleUrls('EDM', 'Drum Kits/Claps', [
      '(EDM) Clap (1).wav',
      '(EDM) Clap (2).wav',
      '(EDM) Clap (3).wav'
    ]),
    hihat: createSampleUrls('EDM', 'Drum Kits/Hi Hats', [
      '(EDM) Hi Hat (1).wav',
      '(EDM) Hi Hat (2).wav',
      '(EDM) Hi Hat (3).wav'
    ]),
    openHat: createSampleUrls('EDM', 'Drum Kits/Open Hats', [
      '(EDM) OH (1).wav',
      '(EDM) OH (2).wav',
      '(EDM) OH (3).wav'
    ]),
    bass: createSampleUrls('EDM', 'Drum Kits/Bass', [
      '(EDM) Bass (1).wav',
      '(EDM) Bass (2).wav',
      '(EDM) Bass (3).wav'
    ]),
    melody: createSampleUrls('EDM', 'Melodies', [
      'hellion-afro-house-x-pop-synth-pad 125 bpm.wav',
      'looperman stay-here 130 bpm.wav',
      'ny-drill-x-sexy-drill-type-loop-by-landsharkszn 140 bpm.wav'
    ])
  },

  // Rock uses regular bass (no 808s)
  'rock': {
    kick: createSampleUrls('Rock', 'Drum Kits/[HR] KICKS', [
      '[HR] KICK (1).wav',
      '[HR] KICK (2).wav',
      '[HR] KICK (3).wav'
    ]),
    snare: createSampleUrls('Rock', 'Drum Kits/[HR] SNARES', [
      '[HR] SNARE (1).wav',
      '[HR] SNARE (2).wav',
      '[HR] SNARE (3).wav'
    ]),
    hihat: createSampleUrls('Rock', 'Drum Kits/[HR] HATS', [
      '[HR] HAT (1).wav',
      '[HR] HAT (2).wav',
      '[HR] HAT (3).wav'
    ]),
    openHat: createSampleUrls('Rock', 'Drum Kits/[HR] OPEN HATS', [
      '[HR] OPEN HAT (1).wav',
      '[HR] OPEN HAT (2).wav',
      '[HR] OPEN HAT (3).wav'
    ]),
    bass: createSampleUrls('Rock', 'Drum Kits/[HR] BASS', [
      '[HR] BASS (1).wav',
      '[HR] BASS (2).wav',
      '[HR] BASS (3).wav'
    ]),
    melody: createSampleUrls('Rock', 'Melodies', [
      'chicken-nuggets 110bpm.wav',
      'e guitar 142 bpm.wav',
      'low-distorted-guitar 165 bpm.wav'
    ])
  }
};