// Beat Generation Types
export interface BeatPattern {
  kick: number[];
  snare: number[];
  clap: number[];
  hihat: number[];
  openHat: number[];
  bass: number[];
  melody: number[];
}

export interface GenreConfig {
  name: string;
  bpm: number;
  pattern: BeatPattern;
  melodyScale: number[];
  bassNotes: number[];
  effects: {
    reverb: number;
    delay: number;
    distortion: number;
  };
}
