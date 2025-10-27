// Progressive Loading Engine for Audio Samples
import { SAMPLE_CONFIGS } from './SampleConfigs';

export interface LoadingProgress {
  current: number;
  total: number;
  percentage: number;
  currentGenre: string;
  status: 'idle' | 'loading' | 'completed' | 'error';
}

export class ProgressiveLoadingEngine {
  private audioContext: AudioContext | null = null;
  private audioBuffers: Map<string, AudioBuffer> = new Map();
  private loadingPromises: Map<string, Promise<AudioBuffer>> = new Map();
  private loadedGenres: Set<string> = new Set();
  private loadingProgress: LoadingProgress = {
    current: 0,
    total: 0,
    percentage: 0,
    currentGenre: '',
    status: 'idle'
  };
  private progressCallbacks: ((progress: LoadingProgress) => void)[] = [];

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  // Subscribe to loading progress updates
  onProgress(callback: (progress: LoadingProgress) => void): () => void {
    this.progressCallbacks.push(callback);
    return () => {
      const index = this.progressCallbacks.indexOf(callback);
      if (index > -1) {
        this.progressCallbacks.splice(index, 1);
      }
    };
  }

  // Get current loading progress
  getProgress(): LoadingProgress {
    return { ...this.loadingProgress };
  }

  // Load samples for a specific genre
  async loadGenreSamples(genre: string): Promise<void> {
    if (this.loadedGenres.has(genre)) {
      return; // Already loaded
    }

    const samples = SAMPLE_CONFIGS[genre];
    if (!samples) {
      console.warn(`No samples found for genre: ${genre}`);
      return;
    }

    const urls = this.getAllSampleUrls(samples);
    
    // Set up progress tracking
    this.updateProgress({
      current: 0,
      total: urls.length,
      percentage: 0,
      currentGenre: genre,
      status: 'loading'
    });

    try {
      await this.loadSampleUrls(urls, genre, true);
      this.loadedGenres.add(genre);
      
      // Mark as completed
      this.updateProgress({
        current: urls.length,
        total: urls.length,
        percentage: 100,
        currentGenre: genre,
        status: 'completed'
      });
    } catch (error) {
      console.error(`Failed to load samples for genre ${genre}:`, error);
      this.updateProgress({
        current: 0,
        total: urls.length,
        percentage: 0,
        currentGenre: genre,
        status: 'error'
      });
      throw error;
    }
  }

  // Load samples for current genre and preload next genre in background
  async loadGenreWithPreload(currentGenre: string, nextGenre?: string): Promise<void> {
    const currentSamples = SAMPLE_CONFIGS[currentGenre];
    const nextSamples = nextGenre ? SAMPLE_CONFIGS[nextGenre] : null;

    if (!currentSamples) {
      console.warn(`No samples found for genre: ${currentGenre}`);
      return;
    }

    // Get URLs for current genre
    const currentUrls = this.getAllSampleUrls(currentSamples);
    
    // Calculate total URLs for progress tracking
    const totalUrls = currentUrls.length + (nextSamples ? this.getAllSampleUrls(nextSamples).length : 0);
    
    this.updateProgress({
      current: 0,
      total: totalUrls,
      percentage: 0,
      currentGenre: currentGenre,
      status: 'loading'
    });

    try {
      // Load current genre samples first (priority)
      await this.loadSampleUrls(currentUrls, currentGenre, true);
      
      // Preload next genre in background if specified
      if (nextSamples && nextGenre) {
        const nextUrls = this.getAllSampleUrls(nextSamples);
        this.loadSampleUrls(nextUrls, nextGenre, false); // Don't await - load in background
      }

      this.updateProgress({
        current: totalUrls,
        total: totalUrls,
        percentage: 100,
        currentGenre: currentGenre,
        status: 'completed'
      });

    } catch (error) {
      console.error(`Failed to load samples for genre ${currentGenre}:`, error);
      this.updateProgress({
        current: 0,
        total: totalUrls,
        percentage: 0,
        currentGenre: currentGenre,
        status: 'error'
      });
      throw error;
    }
  }

  // Load multiple sample URLs with progress tracking
  private async loadSampleUrls(urls: string[], genre: string, isPriority: boolean = true): Promise<void> {
    const loadPromises = urls.map(async (url) => {
      try {
        await this.loadAudioBuffer(url);
        
        // Update progress for priority loads only
        if (isPriority) {
          this.updateProgress({
            current: this.loadingProgress.current + 1,
            total: this.loadingProgress.total,
            percentage: Math.round(((this.loadingProgress.current + 1) / this.loadingProgress.total) * 100),
            currentGenre: genre,
            status: 'loading'
          });
        }
      } catch (error) {
        console.error(`Failed to load sample: ${url}`, error);
        // Continue loading other samples even if one fails
      }
    });

    await Promise.all(loadPromises);
  }

  // Get all sample URLs from a sample configuration
  private getAllSampleUrls(samples: any): string[] {
    const urls: string[] = [];
    Object.values(samples).forEach((sampleArray: any) => {
      if (Array.isArray(sampleArray)) {
        urls.push(...sampleArray);
      }
    });
    return urls;
  }

  // Load individual audio buffer with caching and error handling
  private async loadAudioBuffer(url: string): Promise<AudioBuffer> {
    if (!this.audioContext) {
      throw new Error('Audio context not initialized');
    }

    // Check if already loaded
    if (this.audioBuffers.has(url)) {
      return this.audioBuffers.get(url)!;
    }

    // Check if currently loading
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url)!;
    }

    const promise = this.fetchAndDecodeAudio(url);
    this.loadingPromises.set(url, promise);

    try {
      const buffer = await promise;
      this.audioBuffers.set(url, buffer);
      return buffer;
    } finally {
      this.loadingPromises.delete(url);
    }
  }

  // Fetch and decode audio with improved error handling
  private async fetchAndDecodeAudio(url: string): Promise<AudioBuffer> {
    try {
      // Check if file exists first
      const headResponse = await fetch(url, { method: 'HEAD' });
      if (!headResponse.ok) {
        throw new Error(`File not found: ${url}`);
      }

      // Fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const response = await fetch(url, { 
        signal: controller.signal,
        cache: 'force-cache' // Use browser cache
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
      
      return audioBuffer;
    } catch (error) {
      console.error(`Failed to load audio: ${url}`, error);
      throw error;
    }
  }

  // Get audio buffer (synchronous)
  getAudioBuffer(url: string): AudioBuffer | null {
    return this.audioBuffers.get(url) || null;
  }

  // Check if a genre is loaded
  isGenreLoaded(genre: string): boolean {
    return this.loadedGenres.has(genre);
  }

  // Check if a specific sample is loaded
  isSampleLoaded(url: string): boolean {
    return this.audioBuffers.has(url);
  }

  // Clean up samples from unused genres
  cleanupUnusedSamples(currentGenre: string): void {
    const currentSamples = SAMPLE_CONFIGS[currentGenre];
    if (!currentSamples) return;

    const currentUrls = this.getAllSampleUrls(currentSamples);
    const urlsToKeep = new Set(currentUrls);

    // Remove samples not in current genre
    for (const url of this.audioBuffers.keys()) {
      if (!urlsToKeep.has(url)) {
        this.audioBuffers.delete(url);
      }
    }

    // Update loaded genres
    this.loadedGenres.clear();
    this.loadedGenres.add(currentGenre);
  }

  // Get memory usage info
  getMemoryInfo(): { loadedSamples: number; loadedGenres: string[] } {
    return {
      loadedSamples: this.audioBuffers.size,
      loadedGenres: Array.from(this.loadedGenres)
    };
  }

  // Update progress and notify callbacks
  private updateProgress(progress: Partial<LoadingProgress>): void {
    this.loadingProgress = { ...this.loadingProgress, ...progress };
    this.progressCallbacks.forEach(callback => callback(this.loadingProgress));
  }

  // Reset loading state
  reset(): void {
    this.loadingProgress = {
      current: 0,
      total: 0,
      percentage: 0,
      currentGenre: '',
      status: 'idle'
    };
    this.progressCallbacks.forEach(callback => callback(this.loadingProgress));
  }
}
