import type { AudioSample } from './SampleEngine';

// Base URL for audio files
const BASE_URL = '/sounds';

// Helper function to create sample URLs
const createSampleUrls = (genre: string, type: string, files: string[]): string[] => {
  return files.map(file => `${BASE_URL}/${genre}/${type}/${file}`);
};

export const SAMPLE_CONFIGS: Record<string, AudioSample> = {
  'hip-hop': {
    kick: createSampleUrls('Hip Hop & Rap', 'Drum kits/Bass', [
      '808 (1).wav',
      '808 (2).wav',
      '808 (3).wav'
    ]),
    snare: createSampleUrls('Hip Hop & Rap', 'Drum kits/snares', [
      'snare (1).wav',
      'snare (2).wav',
      'snare (3).wav',
      'snare (4).wav',
      'snare (5).wav'
    ]),
    clap: createSampleUrls('Hip Hop & Rap', 'Drum kits/claps', [
      'clap (1).wav',
      'clap (2).wav',
      'clap (3).wav',
      'clap (4).wav',
      'clap (5).wav'
    ]),
    hihat: createSampleUrls('Hip Hop & Rap', 'Drum kits/hi hats', [
      'hi hat (1).wav',
      'hi hat (2).wav',
      'hi hat (3).wav',
      'hi hat (4).wav',
      'hi hat (5).wav'
    ]),
    openHat: createSampleUrls('Hip Hop & Rap', 'Drum kits/open hats', [
      'open hat (1).wav',
      'open hat (2).wav',
      'open hat (3).wav',
      'open hat (4).wav',
      'open hat (5).wav'
    ]),
    bass: createSampleUrls('Hip Hop & Rap', 'Drum kits/Bass', [
      '808 (1).wav',
      '808 (2).wav',
      '808 (3).wav',
      '808 (4).wav',
      '808 (5).wav'
    ]),
    melody: createSampleUrls('Hip Hop & Rap', 'melodies', [
      'don-toliver-x-gunna-type-loop-140-dmin.wav',
      'Sample 2 84Bpm Prod.hegell.wav',
      'Sample 3 94Bpm Prod.hegell.wav'
    ])
  },

  'emo-rap': {
    kick: createSampleUrls('Emo Rap', 'Drum Kits', [
      'BOOMIN KICK 1.wav',
      'BOOMIN KICK 2.wav',
      'BOOMIN KICK 3.wav'
    ]),
    snare: createSampleUrls('Emo Rap', 'Drum Kits/snares', [
      'snare (1).wav',
      'snare (2).wav',
      'snare (3).wav',
      'snare (4).wav',
      'snare (5).wav'
    ]),
    clap: createSampleUrls('Emo Rap', 'Drum Kits/claps', [
      'clap (1).wav',
      'clap (2).wav',
      'clap (3).wav',
      'clap (4).wav',
      'clap (5).wav'
    ]),
    hihat: createSampleUrls('Emo Rap', 'Drum Kits/hi hats', [
      'hi hat (1).wav',
      'hi hat (2).wav',
      'hi hat (3).wav',
      'hi hat (4).wav',
      'hi hat (5).wav'
    ]),
    openHat: createSampleUrls('Emo Rap', 'Drum Kits/open hats', [
      'open hat (1).wav',
      'open hat (2).wav',
      'open hat (3).wav',
      'open hat (4).wav',
      'open hat (5).wav'
    ]),
    bass: createSampleUrls('Emo Rap', 'Drum Kits/Bass', [
      '808 (1).wav',
      '808 (2).wav',
      '808 (3).wav',
      '808 (4).wav',
      '808 (5).wav'
    ]),
    melody: createSampleUrls('Emo Rap', 'Melodies', [
      'headaches 77 bpm.wav',
      'juice-wrld-x-nick-mira-she-not-there 140 bpm.wav',
      'Sample 1 82Bpm Prod.hegell.wav'
    ])
  },

  'trap': {
    kick: createSampleUrls('Trap', 'Drum Kits/Bass', [
      '808 (1).wav',
      '808 (2).wav',
      '808 (3).wav',
      '808 (4).wav',
      '808 (5).wav'
    ]),
    snare: createSampleUrls('Trap', 'Drum Kits/snares', [
      'snare (1).wav',
      'snare (2).wav',
      'snare (3).wav',
      'snare (4).wav',
      'snare (5).wav'
    ]),
    clap: createSampleUrls('Trap', 'Drum Kits/claps', [
      'clap (1).wav',
      'clap (2).wav',
      'clap (3).wav',
      'clap (4).wav',
      'clap (5).wav'
    ]),
    hihat: createSampleUrls('Trap', 'Drum Kits/hi hats', [
      'hi hat (1).wav',
      'hi hat (2).wav',
      'hi hat (3).wav',
      'hi hat (4).wav',
      'hi hat (5).wav'
    ]),
    openHat: createSampleUrls('Trap', 'Drum Kits/open hats', [
      'open hat (1).wav',
      'open hat (2).wav',
      'open hat (3).wav',
      'open hat (4).wav',
      'open hat (5).wav'
    ]),
    bass: createSampleUrls('Trap', 'Drum Kits/Bass', [
      '808 (1).wav',
      '808 (2).wav',
      '808 (3).wav',
      '808 (4).wav',
      '808 (5).wav'
    ]),
    melody: createSampleUrls('Trap', 'Melodies', [
      'ken-carson-x-playboi-carti-synth-loop 140 bpm.wav',
      'lil-baby-x-future-dumb-and-dumber 132 bpm.wav',
      'parachute-cubeatz-x-future-melody 170 bpm.wav'
    ])
  },

  'country': {
    kick: createSampleUrls('Country', 'Drum Kits/Bass', [
      '808 (1).wav',
      '808 (2).wav',
      '808 (3).wav',
      '808 (4).wav',
      '808 (5).wav'
    ]),
    snare: createSampleUrls('Country', 'Drum Kits/Snare', [
      'RD_S_7.wav',
      'RD_S_8.wav',
      'RD_S_9.wav',
      'RD_S_10.wav',
      'RD_S_11.wav'
    ]),
    clap: createSampleUrls('Country', 'Drum Kits/Claps', [
      'RD_C_1.wav',
      'RD_C_2.wav',
      'RD_C_3.wav',
      'RD_C_4.wav',
      'RD_C_5.wav'
    ]),
    hihat: createSampleUrls('Country', 'Drum Kits/hi hats', [
      'hi hat (1).wav',
      'hi hat (2).wav',
      'hi hat (3).wav',
      'hi hat (4).wav',
      'hi hat (5).wav'
    ]),
    openHat: createSampleUrls('Country', 'Drum Kits/Open Hat', [
      'open hat (4).wav',
      'open hat (5).wav',
      'open hat (6).wav',
      'open hat (7).wav'
    ]),
    bass: createSampleUrls('Country', 'Drum Kits/Bass', [
      '808 (1).wav',
      '808 (2).wav',
      '808 (3).wav',
      '808 (4).wav',
      '808 (5).wav'
    ]),
    melody: createSampleUrls('Country', 'Melodies', [
      'acoustic-guitar-x-country-midland-nightclub 150 bpm.wav',
      'sunset-dust-summer-country-acoustic-loop 160 bpm.wav',
      'wisp-x-alternative-type-guitar 150 bpm.wav'
    ])
  },

  'edm': {
    kick: createSampleUrls('EDM', 'Drum Kits/Kicks', [
      '(EDM) Kick (1).wav',
      '(EDM) Kick (2).wav',
      '(EDM) Kick (3).wav',
      '(EDM) Kick (4).wav',
      '(EDM) Kick (5).wav'
    ]),
    snare: createSampleUrls('EDM', 'Drum Kits/Snares', [
      '(EDM) Snare (1).wav',
      '(EDM) Snare (2).wav',
      '(EDM) Snare (3).wav',
      '(EDM) Snare (4).wav',
      '(EDM) Snare (5).wav'
    ]),
    clap: createSampleUrls('EDM', 'Drum Kits/Claps', [
      '(EDM) Clap (1).wav',
      '(EDM) Clap (2).wav',
      '(EDM) Clap (3).wav',
      '(EDM) Clap (4).wav',
      '(EDM) Clap (5).wav'
    ]),
    hihat: createSampleUrls('Trap', 'Drum Kits/hi hats', [
      'hi hat (1).wav',
      'hi hat (2).wav',
      'hi hat (3).wav',
      'hi hat (4).wav',
      'hi hat (5).wav'
    ]),
    openHat: createSampleUrls('EDM', 'Drum Kits/Open Hats', [
      '(EDM) OH (1).wav',
      '(EDM) OH (2).wav',
      '(EDM) OH (3).wav',
      '(EDM) OH (4).wav',
      '(EDM) OH (5).wav'
    ]),
    bass: createSampleUrls('EDM', 'Drum Kits/Bass', [
      '(EDM) 808 (1).wav',
      '(EDM) 808 (2).wav',
      '(EDM) 808 (3).wav'
    ]),
    melody: createSampleUrls('EDM', 'Melodies', [
      'hellion-afro-house-x-pop-synth-pad 125 bpm.wav',
      'looperman stay-here 130 bpm.wav',
      'ny-drill-x-sexy-drill-type-loop-by-landsharkszn 140 bpm.wav'
    ])
  },

  'rock': {
    kick: createSampleUrls('Rock', 'Drum Kits/Kicks', [
      '[HR] KICK (1).wav',
      '[HR] KICK (2).wav',
      '[HR] KICK (3).wav',
      '[HR] KICK (4).wav',
      '[HR] KICK (5).wav'
    ]),
    snare: createSampleUrls('Rock', 'Drum Kits/[HR] SNARES', [
      '[HR] SNARE (1).wav',
      '[HR] SNARE (2).wav',
      '[HR] SNARE (3).wav',
      '[HR] SNARE (4).wav',
      '[HR] SNARE (5).wav'
    ]),
    clap: createSampleUrls('Rock', 'Drum Kits/[HR] CLAPS', [
      '[HR] CLAP (6).wav',
      '[HR] CLAP (7).wav',
      '[HR] CLAP (8).wav',
      '[HR] CLAP (9).wav',
      '[HR] CLAP (10).wav'
    ]),
    hihat: createSampleUrls('Rock', 'Drum Kits/[HR] HATS', [
      '[HR] HAT (1).wav',
      '[HR] HAT (2).wav',
      '[HR] HAT (3).wav',
      '[HR] HAT (4).wav',
      '[HR] HAT (5).wav'
    ]),
    openHat: createSampleUrls('Rock', 'Drum Kits/[HR] HATS', [
      '[HR] HAT (15).wav',
      '[HR] HAT (16).wav',
      '[HR] HAT (17).wav',
      '[HR] HAT (18).wav',
      '[HR] HAT (19).wav'
    ]),
    bass: createSampleUrls('Rock', 'Drum Kits/Bass', [
      '808 (1).wav',
      '808 (2).wav',
      '808 (3).wav',
      '808 (4).wav',
      '808 (5).wav'
    ]),
    melody: createSampleUrls('Rock', 'Melodies', [
      'chicken-nuggets 110bpm.wav',
      'e guitar 142 bpm.wav',
      'low-distorted-guitar 165 bpm.wav'
    ])
  }
};