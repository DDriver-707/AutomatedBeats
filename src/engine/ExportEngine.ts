import lamejs from '@breezystack/lamejs';
import type { BeatPattern, GenreConfig } from '../types/BeatTypes';
import type { AudioSample } from './SampleEngine';

export class ExportEngine {
  private audioContext: AudioContext;
  private offlineContext: OfflineAudioContext | null = null;

  constructor() {
    const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextCtor) {
      throw new Error('Web Audio API is not supported in this browser');
    }
    this.audioContext = new AudioContextCtor();
  }

  async exportBeatToMP3(
    genreConfig: GenreConfig,
    pattern: BeatPattern,
    samples: AudioSample,
    durationSeconds: number = 60,
    trackVolumes?: Record<string, number>
  ): Promise<Blob> {
    try {
      // Validation and logging before export
      console.log('=== Export Started ===');
      console.log('Genre:', genreConfig.name);
      console.log('BPM:', genreConfig.bpm);
      console.log('Pattern lengths:', {
        kick: pattern.kick?.length || 0,
        snare: pattern.snare?.length || 0,
        clap: pattern.clap?.length || 0,
        hihat: pattern.hihat?.length || 0,
        openHat: pattern.openHat?.length || 0,
        bass: pattern.bass?.length || 0,
        melody: pattern.melody?.length || 0
      });
      console.log('Track volumes:', trackVolumes || 'default');
      console.log('Sample indices:', {
        kick: samples.kick?.[0] || 'none',
        snare: samples.snare?.[0] || 'none',
        clap: samples.clap?.[0] || 'none',
        hihat: samples.hihat?.[0] || 'none',
        openHat: samples.openHat?.[0] || 'none',
        bass: samples.bass?.[0] || 'none',
        melody: samples.melody?.[0] || 'none'
      });

      // Render beat to AudioBuffer
      const audioBuffer = await this.renderBeatToAudioBuffer(
        genreConfig,
        pattern,
        samples,
        durationSeconds,
        trackVolumes
      );

      // Log rendered buffer duration
      const renderedDuration = audioBuffer.duration;
      console.log('Rendered buffer duration:', renderedDuration.toFixed(2), 'seconds');

      // Ensure exactly 60 seconds
      const trimmedBuffer = this.ensureExactDuration(audioBuffer, durationSeconds);
      console.log('Final buffer duration:', trimmedBuffer.duration.toFixed(2), 'seconds');

      // Convert to MP3
      const mp3Blob = await this.convertToMP3(trimmedBuffer);
      console.log('=== Export Completed ===');

      return mp3Blob;
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  }

  private async renderBeatToAudioBuffer(
    genreConfig: GenreConfig,
    pattern: BeatPattern,
    samples: AudioSample,
    durationSeconds: number,
    trackVolumes?: Record<string, number>
  ): Promise<AudioBuffer> {
    const sampleRate = 44100;
    const channels = 2;
    const totalSamples = Math.floor(sampleRate * durationSeconds);

    const OfflineContextCtor = (window.OfflineAudioContext || (window as any).webkitOfflineAudioContext) as
      | typeof OfflineAudioContext
      | undefined;

    if (!OfflineContextCtor) {
      throw new Error('Offline audio rendering is not supported in this browser');
    }

    this.offlineContext = new OfflineContextCtor(channels, totalSamples, sampleRate);

    // Create master gain node
    const masterGain = this.offlineContext.createGain();
    masterGain.connect(this.offlineContext.destination);
    masterGain.gain.value = 0.8; // Prevent clipping

    // Resolve track volumes with defaults matching live playback
    const volumes = this.resolveTrackVolumes(trackVolumes);

    // Load all sample buffers
    const sampleBuffers: Partial<Record<keyof AudioSample, AudioBuffer>> = {};
    const sampleUrls: Partial<Record<keyof AudioSample, string>> = {};

    for (const instrument of Object.keys(samples) as (keyof AudioSample)[]) {
      const sampleList = samples[instrument];
      if (Array.isArray(sampleList) && sampleList.length > 0) {
        try {
          const sampleUrl = sampleList[0];
          const buffer = await this.loadAudioBuffer(sampleUrl);
          if (buffer) {
            sampleBuffers[instrument] = buffer;
            sampleUrls[instrument] = sampleUrl;
          }
        } catch (error) {
          console.warn(`Failed to load ${instrument} sample:`, error);
        }
      }
    }

    // Calculate timing (same as live playback)
    const bpm = genreConfig.bpm;
    const genre = genreConfig.name.toLowerCase();
    
    // Use same step duration calculation as live playback (returns milliseconds)
    const stepDurationMs = this.calculateStepDuration(bpm, genre);
    const stepDurationSeconds = stepDurationMs / 1000; // Convert to seconds for offline rendering
    
    // Calculate total steps needed for 60 seconds
    const totalSteps = Math.ceil(durationSeconds / stepDurationSeconds);

    // Schedule melody as a loop for the full duration (not pattern-based)
    if (sampleBuffers.melody && sampleUrls.melody) {
      this.scheduleMelodyLoop(
        sampleBuffers.melody,
        sampleUrls.melody,
        masterGain,
        volumes.melody,
        bpm,
        durationSeconds
      );
    }

    // Schedule drum samples based on pattern steps (same logic as live playback)
    for (let step = 0; step < totalSteps; step++) {
      const stepTime = step * stepDurationSeconds;
      const stepIndex = step % 16; // Loop the 16-step pattern

      // Kick
      if (pattern.kick[stepIndex] && sampleBuffers.kick) {
        this.scheduleSample(sampleBuffers.kick, stepTime, masterGain, volumes.kick, 'kick');
      }

      // Snare
      if (pattern.snare[stepIndex] && sampleBuffers.snare) {
        this.scheduleSample(sampleBuffers.snare, stepTime, masterGain, volumes.snare, 'snare');
      }

      // Clap
      if (pattern.clap[stepIndex] && sampleBuffers.clap) {
        this.scheduleSample(sampleBuffers.clap, stepTime, masterGain, volumes.clap, 'clap');
      }

      // Hi-hat
      if (pattern.hihat[stepIndex] && sampleBuffers.hihat) {
        this.scheduleSample(sampleBuffers.hihat, stepTime, masterGain, volumes.hihat, 'hihat');
      }

      // Open hat
      if (pattern.openHat[stepIndex] && sampleBuffers.openHat) {
        this.scheduleSample(sampleBuffers.openHat, stepTime, masterGain, volumes.openHat, 'openhat');
      }

      // Bass (enhanced processing)
      if (pattern.bass[stepIndex] !== 0 && sampleBuffers.bass) {
        this.scheduleEnhancedBass(sampleBuffers.bass, stepTime, masterGain, volumes.bass);
      }
    }

    // Render the audio
    return await this.offlineContext.startRendering();
  }

  // Same step duration calculation as EnhancedSampleEngine
  private calculateStepDuration(bpm: number, genre: string): number {
    // Apply half-time drum pattern for high-BPM samples in country and rock genres
    const shouldUseHalfTime = (genre === 'country' || genre === 'rock') && bpm > 140;

    if (shouldUseHalfTime) {
      // Half-time: drums play at half the BPM while melody stays at full BPM
      const halfTimeBPM = bpm / 2;
      return (60000 / halfTimeBPM) / 4; // 16th notes at half-time (milliseconds)
    }

    // Normal timing for other genres or lower BPM
    return (60000 / bpm) / 4; // 16th notes (milliseconds)
  }

  private scheduleMelodyLoop(
    buffer: AudioBuffer,
    sampleUrl: string,
    outputNode: GainNode,
    volume: number,
    targetBPM: number,
    durationSeconds: number
  ) {
    if (!this.offlineContext) return;

    // Extract BPM from filename
    const bpmMatch = sampleUrl.match(/(\d+)\s*bpm/i);
    const sampleBPM = bpmMatch ? parseInt(bpmMatch[1], 10) : targetBPM;

    // Calculate playback rate to match target BPM
    const playbackRate = targetBPM / sampleBPM;

    const source = this.offlineContext.createBufferSource();
    const gain = this.offlineContext.createGain();

    source.buffer = buffer;
    source.loop = true;
    source.playbackRate.value = playbackRate;
    gain.gain.value = volume;

    source.connect(gain);
    gain.connect(outputNode);

    // Start at time 0 and stop at durationSeconds
    source.start(0);
    source.stop(durationSeconds);
  }

  private scheduleSample(
    buffer: AudioBuffer,
    startTime: number,
    outputNode: GainNode,
    volume: number = 1.0,
    instrument: string = ''
  ) {
    if (!this.offlineContext) return;

    const source = this.offlineContext.createBufferSource();
    const gain = this.offlineContext.createGain();

    source.buffer = buffer;
    gain.gain.value = volume;

    // Route bass through enhancement chain (same as live playback)
    if (instrument === 'bass') {
      // For bass, we use scheduleEnhancedBass instead
      // This is just for non-bass instruments
      source.connect(gain);
      gain.connect(outputNode);
    } else {
      source.connect(gain);
      gain.connect(outputNode);
    }

    source.start(startTime);
  }

  private scheduleEnhancedBass(
    buffer: AudioBuffer,
    startTime: number,
    outputNode: GainNode,
    volume: number = 1.0
  ) {
    if (!this.offlineContext) return;

    // Create bass enhancement chain (same as live playback)
    const bassFilter = this.offlineContext.createBiquadFilter();
    const bassGain = this.offlineContext.createGain();

    // Lowpass filter around 80Hz
    bassFilter.type = 'lowpass';
    bassFilter.frequency.value = 80;
    bassFilter.Q.value = 1;
    bassGain.gain.value = 0.8;

    bassFilter.connect(bassGain);
    bassGain.connect(outputNode);

    const source = this.offlineContext.createBufferSource();
    const gain = this.offlineContext.createGain();

    // ADSR envelope (same as live playback)
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.01); // Attack
    gain.gain.exponentialRampToValueAtTime(volume * 0.7, startTime + 0.1); // Decay
    gain.gain.setValueAtTime(volume * 0.7, startTime + 0.3); // Sustain
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.8); // Release

    source.buffer = buffer;
    source.connect(gain);
    gain.connect(bassFilter);

    source.start(startTime);
  }

  private async loadAudioBuffer(url: string): Promise<AudioBuffer | null> {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      return await this.audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.error('Failed to load audio:', error);
      return null;
    }
  }

  private ensureExactDuration(audioBuffer: AudioBuffer, targetDurationSeconds: number): AudioBuffer {
    const sampleRate = audioBuffer.sampleRate;
    const channels = audioBuffer.numberOfChannels;
    const targetSamples = Math.floor(sampleRate * targetDurationSeconds);
    const currentSamples = audioBuffer.length;

    if (currentSamples === targetSamples) {
      return audioBuffer; // Already exact duration
    }

    // Create new buffer with exact duration
    const newBuffer = this.audioContext.createBuffer(channels, targetSamples, sampleRate);

    // Copy existing data
    for (let channel = 0; channel < channels; channel++) {
      const oldData = audioBuffer.getChannelData(channel);
      const newData = newBuffer.getChannelData(channel);
      const copyLength = Math.min(currentSamples, targetSamples);

      newData.set(oldData.subarray(0, copyLength), 0);

      // If target is longer, pad with silence (already zeros)
      // If target is shorter, data is already trimmed by copyLength
    }

    return newBuffer;
  }

  private async convertToMP3(audioBuffer: AudioBuffer): Promise<Blob> {
    const sampleRate = audioBuffer.sampleRate;
    const channels = Math.min(2, audioBuffer.numberOfChannels || 1);

    // Get float32 channel data
    const leftChannel = audioBuffer.getChannelData(0);
    const rightChannel = channels > 1 ? audioBuffer.getChannelData(1) : leftChannel;

    // Convert to 16-bit PCM
    const leftPCM = this.convertTo16BitPCM(leftChannel);
    const rightPCM = this.convertTo16BitPCM(rightChannel);

    // Create MP3 encoder (stereo if we have 2 channels, otherwise mono)
    const mp3encoder = new lamejs.Mp3Encoder(channels, sampleRate, 128); // 128 kbps
    const mp3Data: Int8Array[] = [];

    const chunkSize = 1152; // MP3 frame size

    for (let i = 0; i < leftPCM.length; i += chunkSize) {
      const leftChunk = leftPCM.subarray(i, i + chunkSize);
      const rightChunk = channels > 1 ? rightPCM.subarray(i, i + chunkSize) : undefined;

      // encodeBuffer can return undefined for very small/empty chunks, so guard it
      const mp3buf =
        channels > 1
          ? mp3encoder.encodeBuffer(leftChunk, rightChunk)
          : mp3encoder.encodeBuffer(leftChunk);

      if (mp3buf && mp3buf.length > 0) {
        // Cast to Int8Array to match type definition
        mp3Data.push(new Int8Array(mp3buf));
      }
    }

    // Flush any remaining data
    const mp3buf = mp3encoder.flush();
    if (mp3buf && mp3buf.length > 0) {
      // Cast to Int8Array to match type definition
      mp3Data.push(new Int8Array(mp3buf));
    }

    // Concatenate all chunks into a single Int8Array
    const totalLength = mp3Data.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Int8Array(totalLength);
    let offset = 0;

    for (const chunk of mp3Data) {
      result.set(chunk, offset);
      offset += chunk.length;
    }

    return new Blob([result], { type: 'audio/mp3' });
  }

  private convertTo16BitPCM(float32Array: Float32Array): Int16Array {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    let offset = 0;

    for (let i = 0; i < float32Array.length; i++, offset += 2) {
      const sample = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    }

    return new Int16Array(buffer);
  }

  private resolveTrackVolumes(trackVolumes?: Record<string, number>) {
    return {
      kick: trackVolumes?.kick ?? 0.8,
      snare: trackVolumes?.snare ?? 0.7,
      clap: trackVolumes?.clap ?? 0.6,
      hihat: trackVolumes?.hihat ?? 0.4,
      openHat: trackVolumes?.openHat ?? trackVolumes?.openhat ?? 0.5,
      bass: trackVolumes?.bass ?? 0.6,
      melody: trackVolumes?.melody ?? 0.5
    };
  }
}
