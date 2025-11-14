import * as lamejs from '@breezystack/lamejs';
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
      throw error;
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
      const stepIndex = step % 16;

      const kickSteps   = pattern.kick   || [];
      const snareSteps  = pattern.snare  || [];
      const hihatSteps  = pattern.hihat  || [];
      const openHatSteps= pattern.openHat|| [];
      const bassSteps   = pattern.bass   || [];
      const melodySteps = pattern.melody || [];

      if (kickSteps[stepIndex] && sampleBuffers.kick) {
        this.scheduleSample(sampleBuffers.kick, stepTime, outputNode, 0.8);
        }
      if (snareSteps[stepIndex] && sampleBuffers.snare) {
        this.scheduleSample(sampleBuffers.snare, stepTime, outputNode, 0.7);
      }
      if (hihatSteps[stepIndex] && sampleBuffers.hihat) {
        this.scheduleSample(sampleBuffers.hihat, stepTime, outputNode, 0.4);
      }
      if (openHatSteps[stepIndex] && sampleBuffers.openHat) {
        this.scheduleSample(sampleBuffers.openHat, stepTime, outputNode, 0.5);
      }
      if (bassSteps[stepIndex] && sampleBuffers.bass) {
        this.scheduleSample(sampleBuffers.bass, stepTime, outputNode, 0.6);
      }
      if (melodySteps[stepIndex] && sampleBuffers.melody) {
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
  const channels = Math.min(2, audioBuffer.numberOfChannels || 1);

  // Get float32 channel data
  const leftChannel = audioBuffer.getChannelData(0);
  const rightChannel =
    channels > 1 ? audioBuffer.getChannelData(1) : leftChannel;

  // Convert to 16-bit PCM
  const leftPCM = this.convertTo16BitPCM(leftChannel);
  const rightPCM = this.convertTo16BitPCM(rightChannel);

  // Create MP3 encoder (stereo if we have 2 channels, otherwise mono)
  const mp3encoder = new lamejs.Mp3Encoder(channels, sampleRate, 128); // 128 kbps
  const mp3Data: Uint8Array[] = [];

  const chunkSize = 1152; // MP3 frame size

  for (let i = 0; i < leftPCM.length; i += chunkSize) {
    const leftChunk = leftPCM.subarray(i, i + chunkSize);
    const rightChunk =
      channels > 1 ? rightPCM.subarray(i, i + chunkSize) : leftChunk;

    // encodeBuffer can return undefined for very small/empty chunks, so guard it
    const mp3buf =
      channels > 1
        ? mp3encoder.encodeBuffer(leftChunk, rightChunk)
        : mp3encoder.encodeBuffer(leftChunk);

    if (mp3buf && mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }
  }

  // Flush any remaining data
  const mp3buf = mp3encoder.flush();
  if (mp3buf && mp3buf.length > 0) {
    mp3Data.push(mp3buf);
  }

  // Concatenate all chunks into a single Uint8Array
  const totalLength = mp3Data.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of mp3Data) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return new Blob([result], { type: "audio/mp3" });
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
