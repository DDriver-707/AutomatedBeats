// Enhanced Sample Engine with melody loop support and BPM syncing
import type { BeatPattern, GenreConfig } from '../types/BeatTypes';
import type { AudioSample } from './SampleEngine';

export class EnhancedSampleEngine {
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
  
  // Melody loop management
  private melodySource: AudioBufferSourceNode | null = null;
  private melodyBuffer: AudioBuffer | null = null;
  private melodyBPM = 120;
  private melodyStartTime = 0;
  
  // 808/Bass enhancement
  private bassSources: AudioBufferSourceNode[] = [];
  private bassFilter: BiquadFilterNode | null = null;
  private bassGain: GainNode | null = null;
  
  // Individual track volumes
  private trackVolumes: Record<string, number> = {
    kick: 0.8,
    snare: 0.7,
    clap: 0.6,
    hihat: 0.4,
    openhat: 0.5,
    bass: 0.6,
    melody: 0.3
  };

  constructor() {
    this.initializeAudioContext();
  }

  private async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = 0.5;

      // Setup bass enhancement chain
      this.bassFilter = this.audioContext.createBiquadFilter();
      this.bassGain = this.audioContext.createGain();
      
      // Lowpass filter around 80Hz, boost around 50Hz
      this.bassFilter.type = 'lowpass';
      this.bassFilter.frequency.value = 80;
      this.bassFilter.Q.value = 1;
      
      this.bassGain.gain.value = 0.8;
      
      this.bassFilter.connect(this.bassGain);
      this.bassGain.connect(this.gainNode);
      
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

  private extractBPMFromFilename(filename: string): number {
    // Extract BPM from filename like "sample 140 bpm.wav"
    const bpmMatch = filename.match(/(\d+)\s*bpm/i);
    return bpmMatch ? parseInt(bpmMatch[1]) : 120;
  }

  private calculatePlaybackRate(currentBPM: number, sampleBPM: number): number {
    return sampleBPM / currentBPM;
  }

  private async loadMelodyLoop(melodyUrl: string, currentBPM: number) {
    if (!this.audioContext) return;

    // Stop current melody
    if (this.melodySource) {
      try {
        this.melodySource.stop();
      } catch (e) {
        // Already stopped
      }
    }

    const buffer = await this.loadAudioBuffer(melodyUrl);
    if (!buffer) return;

    this.melodyBuffer = buffer;
    this.melodyBPM = this.extractBPMFromFilename(melodyUrl);
    
    // Calculate playback rate to match current BPM
    const playbackRate = this.calculatePlaybackRate(currentBPM, this.melodyBPM);
    
    // Create new melody source
    this.melodySource = this.audioContext.createBufferSource();
    this.melodySource.buffer = buffer;
    this.melodySource.playbackRate.value = playbackRate;
    this.melodySource.loop = true;
    
    // Create gain node for melody
    const melodyGain = this.audioContext.createGain();
    melodyGain.gain.value = 0.3; // Lower volume for melody
    
    this.melodySource.connect(melodyGain);
    melodyGain.connect(this.gainNode);
    
    // Start melody loop
    this.melodyStartTime = this.audioContext.currentTime;
    this.melodySource.start(this.audioContext.currentTime);
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
    
    // Route bass through enhancement chain
    if (instrument === 'bass' && this.bassFilter && this.bassGain) {
      source.connect(gain);
      gain.connect(this.bassFilter);
    } else {
      source.connect(gain);
      gain.connect(this.gainNode);
    }
    
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

  private async playEnhancedBass(sampleUrl: string, volume: number = 1.0) {
    if (!this.audioContext || !this.bassFilter || !this.bassGain) return;

    // Stop all current bass sources to prevent overlap
    this.bassSources.forEach(source => {
      try {
        source.stop();
      } catch (e) {
        // Already stopped
      }
    });
    this.bassSources = [];

    const buffer = await this.loadAudioBuffer(sampleUrl);
    if (!buffer) return;

    const source = this.audioContext.createBufferSource();
    const gain = this.audioContext.createGain();
    
    // ADSR envelope
    const now = this.audioContext.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.01); // Attack
    gain.gain.exponentialRampToValueAtTime(volume * 0.7, now + 0.1); // Decay
    gain.gain.setValueAtTime(volume * 0.7, now + 0.3); // Sustain
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8); // Release
    
    source.buffer = buffer;
    source.connect(gain);
    gain.connect(this.bassFilter);
    
    this.bassSources.push(source);
    source.start(now);
    
    // Clean up when ended
    source.onended = () => {
      const index = this.bassSources.indexOf(source);
      if (index > -1) {
        this.bassSources.splice(index, 1);
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

    // Load and start melody loop if available
    if (samples.melody.length > 0) {
      await this.loadMelodyLoop(samples.melody[0], genre.bpm);
    }

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

    // Play kick drum
    if (pattern.kick[step] && samples.kick.length > 0) {
      await this.playSample(samples.kick[0], this.trackVolumes.kick, 'kick');
    }

    // Play snare
    if (pattern.snare[step] && samples.snare.length > 0) {
      await this.playSample(samples.snare[0], this.trackVolumes.snare, 'snare');
    }

    // Play clap
    if (pattern.clap[step] && samples.clap.length > 0) {
      await this.playSample(samples.clap[0], this.trackVolumes.clap, 'clap');
    }

    // Play hi-hat
    if (pattern.hihat[step] && samples.hihat.length > 0) {
      await this.playSample(samples.hihat[0], this.trackVolumes.hihat, 'hihat');
    }

    // Play open hat
    if (pattern.openHat[step] && samples.openHat.length > 0) {
      await this.playSample(samples.openHat[0], this.trackVolumes.openhat, 'openhat');
    }

    // Play enhanced bass/808
    if (pattern.bass[step] !== 0 && samples.bass.length > 0) {
      await this.playEnhancedBass(samples.bass[0], this.trackVolumes.bass);
    }
  }

  stopBeat() {
    this.isPlaying = false;
    this.currentStep = 0;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // Stop melody loop
    if (this.melodySource) {
      try {
        this.melodySource.stop();
      } catch (e) {
        // Already stopped
      }
      this.melodySource = null;
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

    // Stop all bass sources
    this.bassSources.forEach(source => {
      try {
        source.stop();
      } catch (e) {
        // Already stopped
      }
    });
    this.bassSources = [];
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

  // Method to change melody during playback
  async changeMelody(melodyUrl: string) {
    if (this.isPlaying && this.audioContext) {
      await this.loadMelodyLoop(melodyUrl, this.currentBPM);
    }
  }

  // Individual track volume control
  setTrackVolume(track: string, volume: number) {
    if (this.trackVolumes.hasOwnProperty(track)) {
      this.trackVolumes[track] = Math.max(0, Math.min(1, volume));
    }
  }

  getTrackVolume(track: string): number {
    return this.trackVolumes[track] || 0;
  }

  getAllTrackVolumes(): Record<string, number> {
    return { ...this.trackVolumes };
  }

}
