import type { AudioSample } from './SampleEngine';

// Base URL for audio files
const BASE_URL = '/sounds';

// NOTE: All melody files in this configuration have been verified to exist in the /sounds folder
// Non-existent files have been removed to prevent loading errors during initialization

// Helper function to create sample URLs
const createSampleUrls = (genre: string, type: string, files: string[]): string[] => {
  return files.map(file => `${BASE_URL}/${genre}/${type}/${file}`);
};

export const SAMPLE_CONFIGS: Record<string, AudioSample> = {
  'hip-hop': {
    kick: [], // No kick samples - hip-hop uses 808s for bass
    snare: createSampleUrls('Hip Hop & Rap', 'Drum kits/snares', [
      'snare (1).wav',
      'snare (2).wav',
      'snare (3).wav',
      'snare (4).wav',
      'snare (5).wav',
      'snare (6).wav',
      'snare (7).wav',
      'snare (8).wav'
    ]),
    clap: createSampleUrls('Hip Hop & Rap', 'Drum kits/claps', [
      'clap (1).wav',
      'clap (2).wav',
      'clap (3).wav',
      'clap (4).wav',
      'clap (5).wav',
      'clap (6).wav',
      'clap (7).wav',
      'clap (8).wav'
    ]),
    hihat: createSampleUrls('Hip Hop & Rap', 'Drum kits/hi hats', [
      'hi hat (1).wav',
      'hi hat (2).wav',
      'hi hat (3).wav',
      'hi hat (4).wav',
      'hi hat (5).wav',
      'hi hat (6).wav'
    ]),
    openHat: createSampleUrls('Hip Hop & Rap', 'Drum kits/open hats', [
      'open hat (1).wav',
      'open hat (2).wav',
      'open hat (3).wav',
      'open hat (4).wav',
      'open hat (5).wav',
      'open hat (6).wav',
      'open hat (7).wav'
    ]),
    bass: createSampleUrls('Hip Hop & Rap', 'Drum kits/808', [
      '808 (1).wav',
      '808 (2).wav',
      '808 (3).wav',
      '808 (4).wav',
      '808 (5).wav',
      '808 (6).wav',
      '808 (7).wav',
      '808 (8).wav',
      '808 (9).wav',
      '808 (10).wav',
      '808 (11).wav',
      '808 (12).wav',
      '808 (13).wav'
    ]),
    melody: createSampleUrls('Hip Hop & Rap', 'melodies', [
      'don-toliver-x-gunna-type-loop-140-dmin.wav',
      'griselda-x-hiphop-sampled-type-loop 85 bpm.wav',
      'Hiphop Melody X Mirror X Gagan Salwan 90 bpm.wav'
    ])
  },

  'emo-rap': {
    kick: [], // No kick samples - emo rap uses 808s for bass
    snare: createSampleUrls('Emo Rap', 'Drum Kits/snares', [
      'snare (1).wav',
      'snare (2).wav',
      'snare (3).wav',
      'snare (4).wav',
      'snare (5).wav',
      'snare (6).wav',
      'snare (7).wav',
      'snare (8).wav'
    ]),
    clap: createSampleUrls('Emo Rap', 'Drum Kits/claps', [
      'clap (1).wav',
      'clap (2).wav',
      'clap (3).wav',
      'clap (4).wav',
      'clap (5).wav',
      'clap (6).wav',
      'clap (7).wav',
      'clap (8).wav'
    ]),
    hihat: createSampleUrls('Emo Rap', 'Drum Kits/hi hats', [
      'hi hat (1).wav',
      'hi hat (2).wav',
      'hi hat (3).wav',
      'hi hat (4).wav',
      'hi hat (5).wav',
      'hi hat (6).wav'
    ]),
    openHat: createSampleUrls('Emo Rap', 'Drum Kits/open hats', [
      'open hat (1).wav',
      'open hat (2).wav',
      'open hat (3).wav',
      'open hat (4).wav',
      'open hat (5).wav',
      'open hat (6).wav',
      'open hat (7).wav'
    ]),
    bass: createSampleUrls('Emo Rap', 'Drum Kits/808', [
      '808 (1).wav',
      '808 (2).wav',
      '808 (3).wav',
      '808 (4).wav',
      '808 (5).wav',
      '808 (6).wav',
      '808 (7).wav',
      '808 (8).wav',
      '808 (9).wav',
      '808 (10).wav',
      '808 (11).wav',
      '808 (12).wav',
      '808 (13).wav'
    ]),
    melody: createSampleUrls('Emo Rap', 'Melodies', [
      'headaches 77 bpm.wav',
      'Sample 1 82Bpm Prod.hegell.wav',
      'Halfdream 86 bpm.wav',
      'kolor-prod-sconthetrack 97 bpm.wav'
    ])
  },

  'trap': {
    kick: [], // No kick samples - trap uses 808s for bass
    snare: createSampleUrls('Trap', 'Drum Kits/snares', [
      'snare (1).wav',
      'snare (2).wav',
      'snare (3).wav',
      'snare (4).wav',
      'snare (5).wav',
      'snare (6).wav',
      'snare (7).wav',
      'snare (8).wav'
    ]),
    clap: createSampleUrls('Trap', 'Drum Kits/claps', [
      'clap (1).wav',
      'clap (2).wav',
      'clap (3).wav',
      'clap (4).wav',
      'clap (5).wav',
      'clap (6).wav',
      'clap (7).wav',
      'clap (8).wav'
    ]),
    hihat: createSampleUrls('Trap', 'Drum Kits/hi hats', [
      'hi hat (1).wav',
      'hi hat (2).wav',
      'hi hat (3).wav',
      'hi hat (4).wav',
      'hi hat (5).wav',
      'hi hat (6).wav'
    ]),
    openHat: createSampleUrls('Trap', 'Drum Kits/open hats', [
      'open hat (1).wav',
      'open hat (2).wav',
      'open hat (3).wav',
      'open hat (4).wav',
      'open hat (5).wav',
      'open hat (6).wav',
      'open hat (7).wav'
    ]),
    bass: createSampleUrls('Trap', 'Drum Kits/808', [
      '808 (1).wav',
      '808 (2).wav',
      '808 (3).wav',
      '808 (4).wav',
      '808 (5).wav',
      '808 (6).wav',
      '808 (7).wav',
      '808 (8).wav',
      '808 (9).wav',
      '808 (10).wav',
      '808 (11).wav',
      '808 (12).wav',
      '808 (13).wav'
    ]),
    melody: createSampleUrls('Trap', 'Melodies', [
      'lil-baby-x-future-dumb-and-dumber 132 bpm.wav',
      'drake-x-future-nutshell-pad-part 140 bpm.wav',
      'mexico-future-est-gee-synth 142 bpm.wav',
      'piano-with-gross-beat-by-kobeatz 141 bpm.wav'
    ])
  },

  'country': {
    kick: createSampleUrls('Country', 'Drum Kits/Bass', [
      'KSHMR Acoustic Kick 01.wav',
      'KSHMR Acoustic Kick 02.wav',
      'KSHMR Acoustic Kick 03.wav',
      'KSHMR Acoustic Kick 04.wav',
      'KSHMR Acoustic Kick 05.wav',
      'KSHMR Acoustic Kick 06.wav',
      'KSHMR Acoustic Kick 07.wav',
      'KSHMR Acoustic Kick 08.wav'
    ]),
    snare: createSampleUrls('Country', 'Drum Kits/Snares', [
      'KSHMR Acoustic Snare 01.wav',
      'KSHMR Acoustic Snare 02.wav',
      'KSHMR Acoustic Snare 03.wav',
      'KSHMR Acoustic Snare 04.wav',
      'KSHMR Acoustic Snare 05.wav',
      'KSHMR Acoustic Snare 06.wav',
      'KSHMR Acoustic Snare 07.wav',
      'KSHMR Acoustic Snare 08.wav',
      'KSHMR Acoustic Snare 09.wav',
      'KSHMR Acoustic Snare 10.wav'
    ]),
    clap: createSampleUrls('Country', 'Drum Kits/Clap', [
      'KSHMR Clap 26 - Tiny 05.wav'
    ]),
    hihat: createSampleUrls('Country', 'Drum Kits/Hi-Hat', [
      'KSHMR Acoustic Closed Hat 01.wav',
      'KSHMR Acoustic Closed Hat 02.wav',
      'KSHMR Acoustic Closed Hat 03.wav',
      'KSHMR Acoustic Closed Hat 04.wav',
      'KSHMR Acoustic Closed Hat 05.wav',
      'KSHMR Acoustic Closed Hat 06.wav',
      'KSHMR Acoustic Closed Hat 07.wav',
      'KSHMR Acoustic Closed Hat 08.wav',
      'KSHMR Acoustic Closed Hat 09.wav',
      'KSHMR Acoustic Closed Hat 10.wav',
      'KSHMR Acoustic Closed Hat 11.wav',
      'KSHMR Acoustic Closed Hat 12.wav',
      'KSHMR Acoustic Closed Hat 13.wav',
      'KSHMR Acoustic Closed Hat 14.wav',
      'KSHMR Acoustic Stomp Hat 01.wav',
      'KSHMR Acoustic Stomp Hat 02.wav'
    ]),
    openHat: createSampleUrls('Country', 'Drum Kits/Open Hat', [
      'KSHMR Acoustic Open Hat 01.wav',
      'KSHMR Acoustic Open Hat 02.wav',
      'KSHMR Acoustic Open Hat 03.wav',
      'KSHMR Acoustic Open Hat 04.wav',
      'KSHMR Acoustic Open Hat 05.wav',
      'KSHMR Acoustic Open Hat 06.wav',
      'KSHMR Acoustic Open Hat 07.wav',
      'KSHMR Acoustic Open Hat 08.wav',
      'KSHMR Acoustic Open Hat 09.wav',
      'KSHMR Acoustic Open Hat 10.wav',
      'KSHMR Acoustic Open Hat 11.wav',
      'KSHMR Acoustic Open Hat 12.wav',
      'KSHMR Acoustic Open Hat 13.wav'
    ]),
    bass: createSampleUrls('Country', 'Drum Kits/Bass', [
      'KSHMR Acoustic Kick 01.wav',
      'KSHMR Acoustic Kick 02.wav',
      'KSHMR Acoustic Kick 03.wav',
      'KSHMR Acoustic Kick 04.wav',
      'KSHMR Acoustic Kick 05.wav',
      'KSHMR Acoustic Kick 06.wav',
      'KSHMR Acoustic Kick 07.wav',
      'KSHMR Acoustic Kick 08.wav'
    ]),
    melody: createSampleUrls('Country', 'Melodies', [
      'sunset-dust-summer-country-acoustic-loop 160 bpm.wav',
      'country-guitar-sample-x-farmland-x 100 bpm.wav',
      'faded-out-the-mud-loops-guitar-9 120 bpm.wav',
      'okc-country-guitar-strum 100 bpm.wav'
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
      'big-fat-chorus-pads 128 bpm.wav',
      'edm-loop 140 bpm key c.wav',
      'paradox-arp 130 bpm.wav',
      'virgo-constellation.wav 140 bpm.wav'
    ])
  },

  'rock': {
    kick: createSampleUrls('Rock', 'Drum Kits/Bass', [
      'KSHMR Acoustic Kick 01.wav',
      'KSHMR Acoustic Kick 02.wav',
      'KSHMR Acoustic Kick 03.wav',
      'KSHMR Acoustic Kick 04.wav',
      'KSHMR Acoustic Kick 05.wav',
      'KSHMR Acoustic Kick 06.wav',
      'KSHMR Acoustic Kick 07.wav',
      'KSHMR Acoustic Kick 08.wav'
    ]),
    snare: createSampleUrls('Rock', 'Drum Kits/Snares', [
      'KSHMR Acoustic Snare 01.wav',
      'KSHMR Acoustic Snare 02.wav',
      'KSHMR Acoustic Snare 03.wav',
      'KSHMR Acoustic Snare 04.wav',
      'KSHMR Acoustic Snare 05.wav',
      'KSHMR Acoustic Snare 06.wav',
      'KSHMR Acoustic Snare 07.wav',
      'KSHMR Acoustic Snare 08.wav',
      'KSHMR Acoustic Snare 09.wav',
      'KSHMR Acoustic Snare 10.wav'
    ]),
    clap: createSampleUrls('Rock', 'Drum Kits/Clap', [
      'KSHMR Clap 26 - Tiny 05.wav'
    ]),
    hihat: createSampleUrls('Rock', 'Drum Kits/Hi-Hat', [
      'KSHMR Acoustic Closed Hat 01.wav',
      'KSHMR Acoustic Closed Hat 02.wav',
      'KSHMR Acoustic Closed Hat 03.wav',
      'KSHMR Acoustic Closed Hat 04.wav',
      'KSHMR Acoustic Closed Hat 05.wav',
      'KSHMR Acoustic Closed Hat 06.wav',
      'KSHMR Acoustic Closed Hat 07.wav',
      'KSHMR Acoustic Closed Hat 08.wav',
      'KSHMR Acoustic Closed Hat 09.wav',
      'KSHMR Acoustic Closed Hat 10.wav',
      'KSHMR Acoustic Closed Hat 11.wav',
      'KSHMR Acoustic Closed Hat 12.wav',
      'KSHMR Acoustic Closed Hat 13.wav',
      'KSHMR Acoustic Closed Hat 14.wav',
      'KSHMR Acoustic Stomp Hat 01.wav',
      'KSHMR Acoustic Stomp Hat 02.wav'
    ]),
    openHat: createSampleUrls('Rock', 'Drum Kits/Open Hat', [
      'KSHMR Acoustic Open Hat 01.wav',
      'KSHMR Acoustic Open Hat 02.wav',
      'KSHMR Acoustic Open Hat 03.wav',
      'KSHMR Acoustic Open Hat 04.wav',
      'KSHMR Acoustic Open Hat 05.wav',
      'KSHMR Acoustic Open Hat 06.wav',
      'KSHMR Acoustic Open Hat 07.wav',
      'KSHMR Acoustic Open Hat 08.wav',
      'KSHMR Acoustic Open Hat 09.wav',
      'KSHMR Acoustic Open Hat 10.wav',
      'KSHMR Acoustic Open Hat 11.wav',
      'KSHMR Acoustic Open Hat 12.wav',
      'KSHMR Acoustic Open Hat 13.wav'
    ]),
    bass: createSampleUrls('Rock', 'Drum Kits/Bass', [
      'KSHMR Acoustic Kick 01.wav',
      'KSHMR Acoustic Kick 02.wav',
      'KSHMR Acoustic Kick 03.wav',
      'KSHMR Acoustic Kick 04.wav',
      'KSHMR Acoustic Kick 05.wav',
      'KSHMR Acoustic Kick 06.wav',
      'KSHMR Acoustic Kick 07.wav',
      'KSHMR Acoustic Kick 08.wav'
    ]),
    melody: createSampleUrls('Rock', 'Melodies', [
      'chicken-nuggets 110bpm.wav',
      'city-lights-2 100 bpm.wav',
      'guess-well-never-know 120 bpm.wav',
      'robotic 100 bpm.wav'
    ])
  }
};