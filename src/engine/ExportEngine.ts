import lamejs from 'lamejs';
import type { GenreConfig } from '../types/BeatTypes';

export class ExportEngine {
  private audioContext: AudioContext;
  private offlineContext: OfflineAudioContext | null = null;

  constructor() {
    this.audioContext = new AudioContext();
  }

  async exportBeatToMP3(
    genreConfig: GenreConfig, 
    pattern: any, 
    samples: any, 
    durationSeconds: number = 60
  ): Promise<Blob> {
    try {
      // Create offline audio context for rendering
      const sampleRate = 44100;
      const channels = 2;
      const totalSamples = Math.floor(sampleRate * durationSeconds);
      
      this.offlineContext = new OfflineAudioContext(channels, totalSamples, sampleRate);
      
      // Create a gain node for the master output
      const masterGain = this.offlineContext.createGain();
      masterGain.connect(this.offlineContext.destination);
      masterGain.gain.value = 0.8; // Prevent clipping

      // Calculate timing
      const bpm = genreConfig.bpm;
      const stepsPerBeat = 4; // 16th notes
      const beatsPerSecond = bpm / 60;
      const stepsPerSecond = beatsPerSecond * stepsPerBeat;
      const stepDuration = 1 / stepsPerSecond;
      const totalSteps = Math.floor(durationSeconds / stepDuration);

      // Render the beat pattern
      await this.renderBeatPattern(
        pattern,
        samples,
        stepDuration,
        totalSteps,
        masterGain
      );

      // Render the audio
      const audioBuffer = await this.offlineContext.startRendering();
      
      // Convert to MP3
      return await this.convertToMP3(audioBuffer);

    } catch (error) {
      console.error('Export failed:', error);
      throw new Error('Failed to export beat to MP3');
    }
  }

  private async renderBeatPattern(
    pattern: any,
    samples: any,
    stepDuration: number,
    totalSteps: number,
    outputNode: GainNode
  ) {
    if (!this.offlineContext) return;

    // Load all sample buffers
    const sampleBuffers: { [key: string]: AudioBuffer } = {};
    
    for (const [instrument, sampleList] of Object.entries(samples)) {
      if (Array.isArray(sampleList) && sampleList.length > 0) {
        try {
          const sampleUrl = sampleList[0]; // Use first sample
          const buffer = await this.loadAudioBuffer(sampleUrl);
          if (buffer) {
            sampleBuffers[instrument] = buffer;
          }
        } catch (error) {
          console.warn(`Failed to load ${instrument} sample:`, error);
        }
      }
    }

    // Schedule all the beats
    for (let step = 0; step < totalSteps; step++) {
      const stepTime = step * stepDuration;
      const stepIndex = step % 16; // Loop the 16-step pattern

      // Play kick
      if (pattern.kick[stepIndex] && sampleBuffers.kick) {
        this.scheduleSample(sampleBuffers.kick, stepTime, outputNode, 0.8);
      }

      // Play snare
      if (pattern.snare[stepIndex] && sampleBuffers.snare) {
        this.scheduleSample(sampleBuffers.snare, stepTime, outputNode, 0.7);
      }

      // Play hi-hat
      if (pattern.hihat[stepIndex] && sampleBuffers.hihat) {
        this.scheduleSample(sampleBuffers.hihat, stepTime, outputNode, 0.4);
      }

      // Play open hat
      if (pattern.openHat[stepIndex] && sampleBuffers.openHat) {
        this.scheduleSample(sampleBuffers.openHat, stepTime, outputNode, 0.5);
      }

      // Play bass
      if (pattern.bass[stepIndex] && sampleBuffers.bass) {
        this.scheduleSample(sampleBuffers.bass, stepTime, outputNode, 0.6);
      }

      // Play melody
      if (pattern.melody[stepIndex] && sampleBuffers.melody) {
        this.scheduleSample(sampleBuffers.melody, stepTime, outputNode, 0.5);
      }
    }
  }

  private scheduleSample(
    buffer: AudioBuffer,
    startTime: number,
    outputNode: GainNode,
    volume: number = 1.0
  ) {
    if (!this.offlineContext) return;

    const source = this.offlineContext.createBufferSource();
    const gain = this.offlineContext.createGain();

    source.buffer = buffer;
    gain.gain.value = volume;

    source.connect(gain);
    gain.connect(outputNode);
    source.start(startTime);
  }

  private async loadAudioBuffer(url: string): Promise<AudioBuffer | null> {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      return await this.audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.error('Failed to load audio:', error);
      return null;
    }
  }

  private async convertToMP3(audioBuffer: AudioBuffer): Promise<Blob> {
    const sampleRate = audioBuffer.sampleRate;
    const channels = audioBuffer.numberOfChannels;

    // Get the audio data
    const leftChannel = audioBuffer.getChannelData(0);
    const rightChannel = channels > 1 ? audioBuffer.getChannelData(1) : leftChannel;

    // Convert to 16-bit PCM
    const leftPCM = this.convertTo16BitPCM(leftChannel);
    const rightPCM = this.convertTo16BitPCM(rightChannel);

    // Interleave stereo channels
    const stereoPCM = this.interleaveStereo(leftPCM, rightPCM);

    // Create MP3 encoder
    const mp3encoder = new (lamejs as any).Mp3Encoder(channels, sampleRate, 128); // 128 kbps
    const mp3Data: Int8Array[] = [];

    // Encode in chunks
    const chunkSize = 1152; // MP3 frame size
    for (let i = 0; i < stereoPCM.length; i += chunkSize) {
      const chunk = stereoPCM.subarray(i, i + chunkSize);
      const mp3buf = mp3encoder.encodeBuffer(chunk);
      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
      }
    }

    // Flush remaining data
    const mp3buf = mp3encoder.flush();
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }

    // Combine all MP3 data
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
      let s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    
    return new Int16Array(buffer);
  }

  private interleaveStereo(left: Int16Array, right: Int16Array): Int16Array {
    const length = Math.min(left.length, right.length);
    const result = new Int16Array(length * 2);
    
    for (let i = 0; i < length; i++) {
      result[i * 2] = left[i];
      result[i * 2 + 1] = right[i];
    }
    
    return result;
  }
}
