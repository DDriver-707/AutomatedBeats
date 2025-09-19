// Beat Generation Engine using Web Audio API
import type { BeatPattern, GenreConfig } from '../types/BeatTypes';

export class BeatEngine {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private delayNode: DelayNode | null = null;
  private distortionNode: WaveShaperNode | null = null;
  private isPlaying = false;
  private currentPattern: BeatPattern | null = null;
  private currentBPM = 120;
  private intervalId: number | null = null;
  private currentStep = 0;
  private oscillatorNodes: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];

  constructor() {
    this.initializeAudioContext();
  }

  private async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = 0.5;

      // Create reverb
      this.reverbNode = this.audioContext.createConvolver();
      this.createReverbImpulse();
      
      // Create delay
      this.delayNode = this.audioContext.createDelay(1);
      this.delayNode.delayTime.value = 0.3;
      this.delayNode.connect(this.gainNode);

      // Create distortion
      this.distortionNode = this.audioContext.createWaveShaper();
      this.createDistortionCurve();
      
      this.reverbNode.connect(this.gainNode);
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  private createReverbImpulse() {
    if (!this.audioContext || !this.reverbNode) return;
    
    const length = this.audioContext.sampleRate * 2;
    const impulse = this.audioContext.createBuffer(2, length, this.audioContext.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
      }
    }
    
    this.reverbNode.buffer = impulse;
  }

  private createDistortionCurve() {
    if (!this.distortionNode) return;
    
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;
    
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((3 + 20) * x * 20 * deg) / (Math.PI + 20 * Math.abs(x));
    }
    
    this.distortionNode.curve = curve;
    this.distortionNode.oversample = '4x';
  }

  private applyEffects(genre: GenreConfig) {
    if (!this.reverbNode || !this.delayNode || !this.distortionNode || !this.audioContext) return;

    // Apply delay
    this.delayNode.delayTime.value = genre.effects.delay;

    // Apply distortion
    const distortionAmount = genre.effects.distortion;
    this.distortionNode.curve = this.createDistortionCurveForAmount(distortionAmount);
  }

  private createDistortionCurveForAmount(amount: number) {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;
    
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((3 + 20 * amount) * x * 20 * deg) / (Math.PI + 20 * amount * Math.abs(x));
    }
    
    return curve;
  }

  async playBeat(genre: GenreConfig) {
    if (!this.audioContext) {
      await this.initializeAudioContext();
    }

    if (!this.audioContext || !this.gainNode) {
      throw new Error('Audio context not initialized');
    }

    this.stopBeat();
    this.currentPattern = genre.pattern;
    this.currentBPM = genre.bpm;
    this.isPlaying = true;

    // Apply genre-specific effects
    this.applyEffects(genre);

    // Calculate step duration in milliseconds
    const stepDuration = (60000 / this.currentBPM) / 4; // 16th notes

    this.intervalId = window.setInterval(() => {
      this.playStep();
      this.currentStep = (this.currentStep + 1) % 16;
    }, stepDuration);
  }

  private playStep() {
    if (!this.currentPattern || !this.audioContext) return;

    const step = this.currentStep;
    const pattern = this.currentPattern;

    // Play kick drum
    if (pattern.kick[step]) {
      this.playKick();
    }

    // Play snare
    if (pattern.snare[step]) {
      this.playSnare();
    }

    // Play hi-hat
    if (pattern.hihat[step]) {
      this.playHiHat();
    }

    // Play open hat
    if (pattern.openHat[step]) {
      this.playOpenHat();
    }

    // Play melody
    if (pattern.melody[step] !== 0) {
      this.playMelody(pattern.melody[step]);
    }

    // Play bass
    if (pattern.bass[step] !== 0) {
      this.playBass(pattern.bass[step]);
    }
  }

  private playKick() {
    if (!this.audioContext || !this.gainNode) return;

    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(60, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(30, this.audioContext.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.8, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
    
    oscillator.connect(gain);
    gain.connect(this.gainNode);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.2);

    this.oscillatorNodes.push(oscillator);
    this.gainNodes.push(gain);
  }

  private playSnare() {
    if (!this.audioContext || !this.gainNode) return;

    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const noiseBuffer = this.createNoiseBuffer();
    const noiseSource = this.audioContext.createBufferSource();
    const noiseGain = this.audioContext.createGain();
    
    // Snare tone
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    
    // Snare noise
    noiseSource.buffer = noiseBuffer;
    
    gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    noiseGain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    oscillator.connect(gain);
    noiseSource.connect(noiseGain);
    gain.connect(this.gainNode);
    noiseGain.connect(this.gainNode);
    
    oscillator.start(this.audioContext.currentTime);
    noiseSource.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
    noiseSource.stop(this.audioContext.currentTime + 0.1);

    this.oscillatorNodes.push(oscillator);
    this.gainNodes.push(gain);
  }

  private playHiHat() {
    if (!this.audioContext || !this.gainNode) return;

    const noiseBuffer = this.createNoiseBuffer();
    const noiseSource = this.audioContext.createBufferSource();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    noiseSource.buffer = noiseBuffer;
    filter.type = 'highpass';
    filter.frequency.value = 8000;
    
    gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
    
    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.gainNode);
    
    noiseSource.start(this.audioContext.currentTime);
    noiseSource.stop(this.audioContext.currentTime + 0.05);
  }

  private playOpenHat() {
    if (!this.audioContext || !this.gainNode) return;

    const noiseBuffer = this.createNoiseBuffer();
    const noiseSource = this.audioContext.createBufferSource();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    noiseSource.buffer = noiseBuffer;
    filter.type = 'highpass';
    filter.frequency.value = 7000;
    
    gain.gain.setValueAtTime(0.15, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
    
    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.gainNode);
    
    noiseSource.start(this.audioContext.currentTime);
    noiseSource.stop(this.audioContext.currentTime + 0.2);
  }

  private playMelody(noteIndex: number) {
    if (!this.audioContext || !this.gainNode || noteIndex === 0) return;

    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(this.getMelodyFrequency(noteIndex), this.audioContext.currentTime);
    
    gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
    
    oscillator.connect(gain);
    gain.connect(this.gainNode);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);

    this.oscillatorNodes.push(oscillator);
    this.gainNodes.push(gain);
  }

  private playBass(noteIndex: number) {
    if (!this.audioContext || !this.gainNode || noteIndex === 0) return;

    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(this.getBassFrequency(noteIndex), this.audioContext.currentTime);
    
    gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
    
    oscillator.connect(gain);
    gain.connect(this.gainNode);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.4);

    this.oscillatorNodes.push(oscillator);
    this.gainNodes.push(gain);
  }

  private createNoiseBuffer() {
    if (!this.audioContext) throw new Error('Audio context not initialized');
    
    const bufferSize = this.audioContext.sampleRate * 0.2;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    return buffer;
  }

  private getMelodyFrequency(noteIndex: number): number {
    const scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; // C major scale
    return scale[(noteIndex - 1) % scale.length] * Math.pow(2, Math.floor((noteIndex - 1) / scale.length));
  }

  private getBassFrequency(noteIndex: number): number {
    const bassNotes = [82.41, 87.31, 92.50, 98.00, 110.00, 123.47, 130.81]; // Lower octave
    return bassNotes[(noteIndex - 1) % bassNotes.length];
  }

  stopBeat() {
    this.isPlaying = false;
    this.currentStep = 0;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // Stop all oscillators
    this.oscillatorNodes.forEach(node => {
      try {
        node.stop();
      } catch (e) {
        // Node might already be stopped
      }
    });
    this.oscillatorNodes = [];
    this.gainNodes = [];
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
