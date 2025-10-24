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
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.audioBuffers.set(url, audioBuffer);
      return audioBuffer;
    } catch (error) {
      console.error(`Failed to load audio: ${url}`, error);
      return null;
    }
  }

  // Validate melody file exists and is accessible
  private async validateMelodyFile(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.warn(`Melody file validation failed for: ${url}`, error);
      return false;
    }
  }

  // Find a valid melody from available samples with fallback logic
  private async findValidMelody(samples: AudioSample, genre: string): Promise<string> {
    // First, try the selected melody sample (now guaranteed to exist due to updated SampleConfigs)
    if (samples.melody.length > 0) {
      for (const melodyUrl of samples.melody) {
        const isValid = await this.validateMelodyFile(melodyUrl);
        if (isValid) {
          console.log(`Using validated melody: ${melodyUrl}`);
          return melodyUrl;
        } else {
          console.warn(`Missing melody file detected: ${melodyUrl}`);
        }
      }
    }

    // Fallback: try genre-specific default melodies (all verified to exist)
    const genreFallbacks: Record<string, string[]> = {
      'hip-hop': ['/sounds/Hip Hop & Rap/melodies/don-toliver-x-gunna-type-loop-140-dmin.wav'],
      'emo-rap': ['/sounds/Emo Rap/Melodies/headaches 77 bpm.wav'],
      'trap': ['/sounds/Trap/Melodies/lil-baby-x-future-dumb-and-dumber 132 bpm.wav'],
      'country': ['/sounds/Country/Melodies/sunset-dust-summer-country-acoustic-loop 160 bpm.wav'],
      'edm': ['/sounds/EDM/Melodies/hellion-afro-house-x-pop-synth-pad 125 bpm.wav'],
      'rock': ['/sounds/Rock/Melodies/chicken-nuggets 110bpm.wav']
    };

    const fallbacks = genreFallbacks[genre] || genreFallbacks['hip-hop'];
    for (const fallbackUrl of fallbacks) {
      const isValid = await this.validateMelodyFile(fallbackUrl);
      if (isValid) {
        console.warn(`Using fallback melody for ${genre}: ${fallbackUrl}`);
        return fallbackUrl;
      }
    }

    // Final fallback: use any available melody from any genre
    const allGenres = ['hip-hop', 'emo-rap', 'trap', 'country', 'edm', 'rock'];
    for (const fallbackGenre of allGenres) {
      const fallbacks = genreFallbacks[fallbackGenre];
      for (const fallbackUrl of fallbacks) {
        const isValid = await this.validateMelodyFile(fallbackUrl);
        if (isValid) {
          console.warn(`Using cross-genre fallback melody: ${fallbackUrl}`);
          return fallbackUrl;
        }
      }
    }

    // If all else fails, return the first melody URL anyway (will show error but won't crash)
    console.error('No valid melody files found, using first available as fallback');
    return samples.melody.length > 0 ? samples.melody[0] : '/sounds/Hip Hop & Rap/melodies/don-toliver-x-gunna-type-loop-140-dmin.wav';
  }

  private extractBPMFromFilename(filename: string): number {
    // Extract BPM from filename like "sample 140 bpm.wav"
    const bpmMatch = filename.match(/(\d+)\s*bpm/i);
    return bpmMatch ? parseInt(bpmMatch[1]) : 120;
  }

  private calculatePlaybackRate(currentBPM: number, sampleBPM: number): number {
    return currentBPM / sampleBPM;
  }

  private async loadMelodyLoop(melodyUrl: string, currentBPM: number) {
    if (!this.audioContext || !this.gainNode) return;

    // Stop current melody
    if (this.melodySource) {
      try {
        this.melodySource.stop();
      } catch (e) {
        // Already stopped
      }
    }

    // Validate melody file exists before attempting to load
    const isValid = await this.validateMelodyFile(melodyUrl);
    if (!isValid) {
      console.warn(`Melody file not found or inaccessible: ${melodyUrl}`);
      return;
    }

    const buffer = await this.loadAudioBuffer(melodyUrl);
    if (!buffer) {
      console.error(`Failed to load melody buffer: ${melodyUrl}`);
      return;
    }

    this.melodyBuffer = buffer;
    this.melodyBPM = this.extractBPMFromFilename(melodyUrl);
    
    // Calculate playback rate to match current BPM with improved precision
    const playbackRate = this.calculatePlaybackRate(currentBPM, this.melodyBPM);
    
    // Create new melody source
    this.melodySource = this.audioContext.createBufferSource();
    this.melodySource.buffer = buffer;
    this.melodySource.playbackRate.value = playbackRate;
    this.melodySource.loop = true;
    
    // Create gain node for melody with track volume control
    const melodyGain = this.audioContext.createGain();
    melodyGain.gain.value = this.trackVolumes.melody;
    
    this.melodySource.connect(melodyGain);
    melodyGain.connect(this.gainNode);
    
    // Start melody loop
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

    // Find a valid melody with fallback logic to ensure melody is never silent
    const melodyUrl = await this.findValidMelody(samples, genre.name.toLowerCase());
    await this.loadMelodyLoop(melodyUrl, genre.bpm);

    // Calculate step duration with half-time logic for high-BPM samples in country/rock
    const stepDuration = this.calculateStepDuration(genre.bpm, genre.name.toLowerCase());

    this.intervalId = window.setInterval(() => {
      this.playStep();
      this.currentStep = (this.currentStep + 1) % 16;
    }, stepDuration);
  }

  // Calculate step duration with half-time logic for high-BPM samples
  private calculateStepDuration(bpm: number, genre: string): number {
    // Apply half-time drum pattern for high-BPM samples in country and rock genres
    const shouldUseHalfTime = (genre === 'country' || genre === 'rock') && bpm > 140;
    
    if (shouldUseHalfTime) {
      // Half-time: drums play at half the BPM while melody stays at full BPM
      const halfTimeBPM = bpm / 2;
      const stepDuration = (60000 / halfTimeBPM) / 4; // 16th notes at half-time
      console.log(`Half-time mode: drums at ${halfTimeBPM} BPM, melody at ${bpm} BPM`);
      return stepDuration;
    }
    
    // Normal timing for other genres or lower BPM
    return (60000 / bpm) / 4; // 16th notes
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

  // Method to update BPM and resync melody
  async updateBPM(newBPM: number, genre: string = 'hip-hop') {
    this.currentBPM = newBPM;
    
    // If melody is playing, restart it with new BPM
    if (this.isPlaying && this.melodySource && this.melodyBuffer) {
      // Stop current melody
      try {
        this.melodySource.stop();
      } catch (e) {
        // Already stopped
      }
      
      // Restart melody with new BPM
      const playbackRate = this.calculatePlaybackRate(newBPM, this.melodyBPM);
      
      this.melodySource = this.audioContext!.createBufferSource();
      this.melodySource.buffer = this.melodyBuffer;
      this.melodySource.playbackRate.value = playbackRate;
      this.melodySource.loop = true;
      
      // Create gain node for melody
      const melodyGain = this.audioContext!.createGain();
      melodyGain.gain.value = this.trackVolumes.melody;
      
      this.melodySource.connect(melodyGain);
      melodyGain.connect(this.gainNode!);
      
      // Start melody loop
      this.melodySource.start(this.audioContext!.currentTime);
    }
    
    // Update step duration for drum timing with half-time logic
    if (this.intervalId) {
      clearInterval(this.intervalId);
      const stepDuration = this.calculateStepDuration(newBPM, genre);
      this.intervalId = window.setInterval(() => {
        this.playStep();
        this.currentStep = (this.currentStep + 1) % 16;
      }, stepDuration);
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

  // Debug method to check current melody status
  getCurrentMelodyInfo(): { url: string; bpm: number; isPlaying: boolean } {
    return {
      url: this.melodySource ? 'melody loaded' : 'no melody',
      bpm: this.melodyBPM,
      isPlaying: this.isPlaying
    };
  }

}
