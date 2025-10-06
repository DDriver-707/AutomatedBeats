import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, Volume2, Shuffle, Music, RotateCcw, Download } from 'lucide-react';
import { EnhancedSampleEngine } from '../engine/EnhancedSampleEngine';
import { SAMPLE_CONFIGS } from '../engine/SampleConfigs';
import { GENRE_CONFIGS } from '../engine/GenreConfigs';
import { ExportEngine } from '../engine/ExportEngine';
import { RandomBeatGenerator } from '../engine/RandomBeatGenerator';
import FLStudioPatternEditor from '../components/FLStudioPatternEditor';
import AudioVisualizer from '../components/AudioVisualizer';

export default function Create() {
  const [selectedGenre, setSelectedGenre] = useState<string>('hip-hop');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentPattern, setCurrentPattern] = useState(GENRE_CONFIGS['hip-hop'].pattern);
  const [isExporting, setIsExporting] = useState(false);
  const [trackVolumes, setTrackVolumes] = useState<Record<string, number>>({});
  
  // Individual sample selection indices for each instrument
  const [sampleIndices, setSampleIndices] = useState<Record<string, number>>({
    kick: 0,
    snare: 0,
    clap: 0,
    hihat: 0,
    openHat: 0,
    bass: 0,
    melody: 0
  });
  
  const sampleEngineRef = useRef<EnhancedSampleEngine | null>(null);
  const exportEngineRef = useRef<ExportEngine | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    sampleEngineRef.current = new EnhancedSampleEngine();
    exportEngineRef.current = new ExportEngine();
    
    return () => {
      if (sampleEngineRef.current) {
        sampleEngineRef.current.stopBeat();
      }
    };
  }, []);

  useEffect(() => {
    if (sampleEngineRef.current) {
      sampleEngineRef.current.setVolume(volume);
    }
  }, [volume]);

  // Initialize track volumes from sample engine
  useEffect(() => {
    if (sampleEngineRef.current) {
      setTrackVolumes(sampleEngineRef.current.getAllTrackVolumes());
    }
  }, []);

  // Update sample engine when track volumes change
  useEffect(() => {
    if (sampleEngineRef.current) {
      Object.entries(trackVolumes).forEach(([track, volume]) => {
        sampleEngineRef.current?.setTrackVolume(track, volume);
      });
    }
  }, [trackVolumes]);


  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        if (sampleEngineRef.current) {
          setCurrentStep(sampleEngineRef.current.getCurrentStep());
        }
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const handlePlayPause = async () => {
    if (!sampleEngineRef.current) return;

    if (isPlaying) {
      sampleEngineRef.current.stopBeat();
      setIsPlaying(false);
      setCurrentStep(0);
    } else {
      const config = GENRE_CONFIGS[selectedGenre];
      const baseSamples = SAMPLE_CONFIGS[selectedGenre] || SAMPLE_CONFIGS['hip-hop'];
      
      // Create custom sample configuration using selected indices
      const customSamples = {
        kick: baseSamples.kick[sampleIndices.kick] ? [baseSamples.kick[sampleIndices.kick]] : baseSamples.kick.slice(0, 1),
        snare: baseSamples.snare[sampleIndices.snare] ? [baseSamples.snare[sampleIndices.snare]] : baseSamples.snare.slice(0, 1),
        clap: baseSamples.clap[sampleIndices.clap] ? [baseSamples.clap[sampleIndices.clap]] : baseSamples.clap.slice(0, 1),
        hihat: baseSamples.hihat[sampleIndices.hihat] ? [baseSamples.hihat[sampleIndices.hihat]] : baseSamples.hihat.slice(0, 1),
        openHat: baseSamples.openHat[sampleIndices.openHat] ? [baseSamples.openHat[sampleIndices.openHat]] : baseSamples.openHat.slice(0, 1),
        bass: baseSamples.bass[sampleIndices.bass] ? [baseSamples.bass[sampleIndices.bass]] : baseSamples.bass.slice(0, 1),
        melody: baseSamples.melody[sampleIndices.melody] ? [baseSamples.melody[sampleIndices.melody]] : baseSamples.melody.slice(0, 1)
      };
      
      // Use current pattern instead of genre pattern
      const customConfig = { ...config, pattern: currentPattern };
      
      try {
        await sampleEngineRef.current.playBeat(customConfig, customSamples);
        setIsPlaying(true);
      } catch (error) {
        console.error('Failed to play beat:', error);
        alert('Failed to initialize audio. Please check your browser permissions.');
      }
    }
  };

  const handleStop = () => {
    if (sampleEngineRef.current) {
      sampleEngineRef.current.stopBeat();
      setIsPlaying(false);
      setCurrentStep(0);
    }
  };

  const handlePatternChange = (newPattern: any) => {
    setCurrentPattern(newPattern);
  };

  const handleTrackVolumeChange = (track: string, volume: number) => {
    setTrackVolumes(prev => ({
      ...prev,
      [track]: volume
    }));
  };

  const loadGenrePattern = (genre: string) => {
    setCurrentPattern(GENRE_CONFIGS[genre].pattern);
  };

  // Randomize individual instrument sample AND pattern
  const randomizeInstrument = (instrument: string) => {
    const baseSamples = SAMPLE_CONFIGS[selectedGenre] || SAMPLE_CONFIGS['hip-hop'];
    const instrumentKey = instrument as keyof typeof baseSamples;
    const availableSamples = baseSamples[instrumentKey];
    
    // Only randomize if samples are available
    if (!availableSamples || availableSamples.length === 0) {
      return; // Don't randomize if no samples available
    }
    
    // Randomize sample selection
    const randomIndex = Math.floor(Math.random() * availableSamples.length);
    setSampleIndices(prev => ({
      ...prev,
      [instrument]: randomIndex
    }));
    
    // Randomize pattern for this instrument
    const patternKey = instrument === 'melody' ? 'melody' : instrument as keyof typeof currentPattern;
    if (patternKey && currentPattern[patternKey]) {
      const newPattern = { ...currentPattern };
      const randomSteps = new Array(16).fill(0);
      
      // Different randomization strategies based on instrument type
      if (patternKey === 'kick') {
        // Kicks on strong beats with some variation
        [0, 4, 8, 12].forEach(pos => {
          if (Math.random() > 0.2) randomSteps[pos] = 1;
        });
        // Add some off-beat kicks
        for (let i = 1; i < 16; i += 2) {
          if (Math.random() > 0.8) randomSteps[i] = 1;
        }
      } else if (patternKey === 'snare') {
        // Snares typically on 2 and 4
        [4, 12].forEach(pos => {
          if (Math.random() > 0.15) randomSteps[pos] = 1;
        });
        // Ghost snares
        for (let i = 0; i < 16; i++) {
          if (![4, 12].includes(i) && Math.random() > 0.8) randomSteps[i] = 1;
        }
      } else if (patternKey === 'hihat') {
        // Dense hi-hat patterns
        const density = Math.random();
        if (density > 0.7) {
          // 16th notes
          for (let i = 0; i < 16; i++) {
            if (Math.random() > 0.2) randomSteps[i] = 1;
          }
        } else if (density > 0.4) {
          // 8th notes with variation
          for (let i = 0; i < 16; i += 2) {
            if (Math.random() > 0.25) randomSteps[i] = 1;
          }
        } else {
          // Quarter notes
          for (let i = 0; i < 16; i += 4) {
            if (Math.random() > 0.3) randomSteps[i] = 1;
          }
        }
      } else if (patternKey === 'openHat') {
        // Sparse open hats
        [7, 15].forEach(pos => {
          if (Math.random() > 0.5) randomSteps[pos] = 1;
        });
      } else if (patternKey === 'clap') {
        // Claps on beats 2 and 4
        [4, 12].forEach(pos => {
          if (Math.random() > 0.3) randomSteps[pos] = 1;
        });
      } else if (patternKey === 'bass') {
        // Bass follows kick-like pattern
        [0, 4, 8, 12].forEach(pos => {
          if (Math.random() > 0.3) randomSteps[pos] = 1;
        });
      } else {
        // Default random pattern (for melody, etc.)
        for (let i = 0; i < 16; i++) {
          if (Math.random() > 0.6) randomSteps[i] = 1;
        }
      }
      
      newPattern[patternKey] = randomSteps;
      setCurrentPattern(newPattern);
    }
    
    // If playing, restart with new sample and pattern
    if (isPlaying) {
      handleStop();
      setTimeout(() => handlePlayPause(), 100);
    }
  };

  // Randomize ALL instruments (samples AND patterns)
  const randomizePattern = async () => {
    // Stop if playing
    const wasPlaying = isPlaying;
    if (wasPlaying) {
      handleStop();
    }
    
    // Get available samples for the current genre
    const baseSamples = SAMPLE_CONFIGS[selectedGenre] || SAMPLE_CONFIGS['hip-hop'];
    
    // Randomize all patterns (only for instruments with available samples)
    const randomPattern = RandomBeatGenerator.generateRandomPatternForGenre(baseSamples);
    setCurrentPattern(randomPattern);
    
    // Randomize all samples
    const newIndices: Record<string, number> = {};
    
    Object.keys(sampleIndices).forEach(instrument => {
      const instrumentKey = instrument as keyof typeof baseSamples;
      const availableSamples = baseSamples[instrumentKey];
      if (availableSamples && availableSamples.length > 0) {
        newIndices[instrument] = Math.floor(Math.random() * availableSamples.length);
      } else {
        newIndices[instrument] = 0;
      }
    });
    
    setSampleIndices(newIndices);
    
    // Restart if it was playing
    if (wasPlaying) {
      await new Promise(resolve => setTimeout(resolve, 150));
      handlePlayPause();
    }
  };

  const handleExport = async () => {
    if (!exportEngineRef.current) return;
    
    setIsExporting(true);
    try {
      const config = GENRE_CONFIGS[selectedGenre];
      const baseSamples = SAMPLE_CONFIGS[selectedGenre] || SAMPLE_CONFIGS['hip-hop'];
      
      // Use selected sample indices for export
      const customSamples = {
        kick: baseSamples.kick[sampleIndices.kick] ? [baseSamples.kick[sampleIndices.kick]] : baseSamples.kick.slice(0, 1),
        snare: baseSamples.snare[sampleIndices.snare] ? [baseSamples.snare[sampleIndices.snare]] : baseSamples.snare.slice(0, 1),
        clap: baseSamples.clap[sampleIndices.clap] ? [baseSamples.clap[sampleIndices.clap]] : baseSamples.clap.slice(0, 1),
        hihat: baseSamples.hihat[sampleIndices.hihat] ? [baseSamples.hihat[sampleIndices.hihat]] : baseSamples.hihat.slice(0, 1),
        openHat: baseSamples.openHat[sampleIndices.openHat] ? [baseSamples.openHat[sampleIndices.openHat]] : baseSamples.openHat.slice(0, 1),
        bass: baseSamples.bass[sampleIndices.bass] ? [baseSamples.bass[sampleIndices.bass]] : baseSamples.bass.slice(0, 1),
        melody: baseSamples.melody[sampleIndices.melody] ? [baseSamples.melody[sampleIndices.melody]] : baseSamples.melody.slice(0, 1)
      };
      
      const mp3Blob = await exportEngineRef.current.exportBeatToMP3(
        config,
        currentPattern,
        customSamples,
        60 // 60 seconds
      );
      
      // Download the MP3
      const url = URL.createObjectURL(mp3Blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `beat-${selectedGenre}-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const genres = Object.entries(GENRE_CONFIGS);

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-900 via-purple-900/20 to-neutral-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Music className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Beat Generator
            </h1>
          </motion.div>
          <p className="text-white/70 text-lg">
            Create automated beats with genre-specific patterns and melodies
          </p>
        </div>

        {/* Genre Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">Select Genre</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {genres.map(([key, config]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedGenre(key);
                  loadGenrePattern(key);
                  // Reset sample indices when changing genre
                  setSampleIndices({
                    kick: 0, snare: 0, clap: 0, hihat: 0, openHat: 0, bass: 0, melody: 0
                  });
                  if (isPlaying) handleStop();
                }}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-300
                  ${selectedGenre === key
                    ? 'border-purple-400 bg-purple-400/10 shadow-lg shadow-purple-400/20'
                    : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                  }
                  cursor-pointer
                `}
              >
                <div className="text-center">
                  <div className="text-lg font-semibold mb-1">{config.name}</div>
                </div>
                {selectedGenre === key && (
                  <motion.div
                    layoutId="selected-genre"
                    className="absolute inset-0 rounded-xl border-2 border-purple-400 bg-purple-400/10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Playback Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={handlePlayPause}
                className={`
                  w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
                  ${isPlaying
                    ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30'
                    : 'bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/30'
                  }
                `}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </button>

              <button
                onClick={handleStop}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300"
                title="Stop"
              >
                <Square className="w-6 h-6" />
              </button>

              <button
                onClick={randomizePattern}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300"
                title="Randomize All Samples & Patterns"
              >
                <Shuffle className="w-6 h-6" />
              </button>

              <button
                onClick={() => loadGenrePattern(selectedGenre)}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300"
                title="Reset to genre pattern"
              >
                <RotateCcw className="w-6 h-6" />
              </button>

              <button
                onClick={handleExport}
                disabled={isExporting}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                  ${isExporting
                    ? 'bg-yellow-500/50 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30'
                  }
                `}
                title={isExporting ? "Exporting..." : "Export as MP3"}
              >
                <Download className={`w-6 h-6 ${isExporting ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Audio Visualizer */}
            <div className="flex-1 flex justify-center">
              <AudioVisualizer isPlaying={isPlaying} currentStep={currentStep} />
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-white/70" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-32 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`
                }}
              />
              <span className="text-sm text-white/70 w-8">{Math.round(volume * 100)}</span>
            </div>


          </div>
        </motion.div>

        {/* Beat Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-semibold mb-4 text-center">Beat Pattern</h3>
          
          {/* FL Studio Style Pattern Editor */}
          <div className="mb-4">
            <FLStudioPatternEditor
              pattern={currentPattern}
              currentStep={currentStep}
              isPlaying={isPlaying}
              onPatternChange={handlePatternChange}
              trackVolumes={trackVolumes}
              onVolumeChange={handleTrackVolumeChange}
              onRandomizeInstrument={randomizeInstrument}
              availableSamples={SAMPLE_CONFIGS[selectedGenre] || SAMPLE_CONFIGS['hip-hop']}
            />
          </div>

          {/* Melody Randomizer */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="text-sm text-white/70">Melody:</span>
            <button
              onClick={() => randomizeInstrument('melody')}
              className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/40 rounded-lg text-purple-300 hover:text-purple-200 transition-all duration-300 flex items-center gap-2 border border-purple-500/30"
              title="Randomize Melody Sample & Pattern"
            >
              <span className="text-lg">🎹</span>
              <span className="text-sm font-medium">Randomize Melody Sample & Pattern</span>
            </button>
          </div>


          {/* Current Genre Info */}
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <h4 className="font-semibold mb-2 text-sm">Current Beat Info</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-white/70">Genre:</span>
                <div className="font-medium">
                  {GENRE_CONFIGS[selectedGenre]?.name}
                </div>
              </div>
              <div>
                <span className="text-white/70">BPM:</span>
                <div className="font-medium">
                  {GENRE_CONFIGS[selectedGenre]?.bpm}
                </div>
              </div>
              <div>
                <span className="text-white/70">Status:</span>
                <div className="font-medium text-green-400">
                  {isPlaying ? 'Playing' : 'Stopped'}
                </div>
              </div>
              <div>
                <span className="text-white/70">Step:</span>
                <div className="font-medium">{currentStep + 1}/16</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 text-center text-white/70"
        >
          <p>
            Select a genre, customize the pattern by clicking steps, and use the 🎲 buttons to randomize individual instrument samples and patterns. 
            Use the main shuffle button (🔀) to randomize all instruments and patterns at once.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
