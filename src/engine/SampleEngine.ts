// Sample-based Beat Engine using real audio files
import type { BeatPattern, GenreConfig } from '../types/BeatTypes';

export interface AudioSample {
  kick: string[];
  snare: string[];
  hihat: string[];
  openHat: string[];
  bass: string[];
}

export class SampleEngine {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private currentPattern: BeatPattern | null = null;
  private currentBPM = 120;
  private intervalId: number | null = null;
  private currentStep = 0;
  private audioBuffers: Map<string, AudioBuffer> = new Map();
  private currentSamples: AudioSample | null = null;
  private currentSources: Map<string, AudioBufferSourceNode> = new Map();

  constructor() {
    this.initializeAudioContext();
  }

  private async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = 0.5;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  private async loadAudioBuffer(url: string): Promise<AudioBuffer | null> {
    if (!this.audioContext) return null;

    // Check if already loaded
    if (this.audioBuffers.has(url)) {
      return this.audioBuffers.get(url)!;
    }

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.audioBuffers.set(url, audioBuffer);
      return audioBuffer;
    } catch (error) {
      console.error(`Failed to load audio: ${url}`, error);
      return null;
    }
  }

  private async playSample(sampleUrl: string, volume: number = 1.0, instrument: string = '') {
    if (!this.audioContext || !this.gainNode) return;

    // Stop previous sample of the same instrument to prevent overlap
    if (instrument && this.currentSources.has(instrument)) {
      try {
        this.currentSources.get(instrument)?.stop();
      } catch (e) {
        // Source might already be stopped
      }
      this.currentSources.delete(instrument);
    }

    const buffer = await this.loadAudioBuffer(sampleUrl);
    if (!buffer) return;

    const source = this.audioContext.createBufferSource();
    const gain = this.audioContext.createGain();
    
    source.buffer = buffer;
    gain.gain.value = volume;
    
    source.connect(gain);
    gain.connect(this.gainNode);
    
    // Store the source for potential stopping
    if (instrument) {
      this.currentSources.set(instrument, source);
    }
    
    source.start(this.audioContext.currentTime);
    
    // Clean up source when it ends
    source.onended = () => {
      if (instrument) {
        this.currentSources.delete(instrument);
      }
    };
  }

  async playBeat(genre: GenreConfig, samples: AudioSample) {
    if (!this.audioContext) {
      await this.initializeAudioContext();
    }

    if (!this.audioContext || !this.gainNode) {
      throw new Error('Audio context not initialized');
    }

    this.stopBeat();
    this.currentPattern = genre.pattern;
    this.currentBPM = genre.bpm;
    this.currentSamples = samples;
    this.isPlaying = true;

    // Calculate step duration in milliseconds
    const stepDuration = (60000 / this.currentBPM) / 4; // 16th notes

    this.intervalId = window.setInterval(() => {
      this.playStep();
      this.currentStep = (this.currentStep + 1) % 16;
    }, stepDuration);
  }

  private async playStep() {
    if (!this.currentPattern || !this.currentSamples) return;

    const step = this.currentStep;
    const pattern = this.currentPattern;
    const samples = this.currentSamples;

    // Play kick drum - use first sample only
    if (pattern.kick[step] && samples.kick.length > 0) {
      await this.playSample(samples.kick[0], 0.8, 'kick');
    }

    // Play snare - use first sample only
    if (pattern.snare[step] && samples.snare.length > 0) {
      await this.playSample(samples.snare[0], 0.7, 'snare');
    }

    // Play hi-hat - use first sample only
    if (pattern.hihat[step] && samples.hihat.length > 0) {
      await this.playSample(samples.hihat[0], 0.4, 'hihat');
    }

    // Play open hat - use first sample only
    if (pattern.openHat[step] && samples.openHat.length > 0) {
      await this.playSample(samples.openHat[0], 0.5, 'openhat');
    }


    // Play bass - use first sample only
    if (pattern.bass[step] !== 0 && samples.bass.length > 0) {
      await this.playSample(samples.bass[0], 0.6, 'bass');
    }
  }

  stopBeat() {
    this.isPlaying = false;
    this.currentStep = 0;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // Stop all currently playing sources
    this.currentSources.forEach((source) => {
      try {
        source.stop();
      } catch (e) {
        // Source might already be stopped
      }
    });
    this.currentSources.clear();
  }

  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = volume;
    }
  }

  getCurrentStep(): number {
    return this.currentStep;
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }
}
