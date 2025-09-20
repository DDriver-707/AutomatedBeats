import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, Volume2, Shuffle, Music, Zap, RotateCcw, Download } from 'lucide-react';
import { EnhancedSampleEngine } from '../engine/EnhancedSampleEngine';
import { SAMPLE_CONFIGS } from '../engine/SampleConfigs';
import { GENRE_CONFIGS, generateRandomBeat } from '../engine/GenreConfigs';
import { ExportEngine } from '../engine/ExportEngine';
import FLStudioPatternEditor from '../components/FLStudioPatternEditor';
import AudioVisualizer from '../components/AudioVisualizer';

export default function Create() {
  const [selectedGenre, setSelectedGenre] = useState<string>('hip-hop');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRandomMode, setIsRandomMode] = useState(false);
  const [currentPattern, setCurrentPattern] = useState(GENRE_CONFIGS['hip-hop'].pattern);
  const [isExporting, setIsExporting] = useState(false);
  
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
      const config = isRandomMode ? generateRandomBeat() : GENRE_CONFIGS[selectedGenre];
      const samples = SAMPLE_CONFIGS[selectedGenre] || SAMPLE_CONFIGS['hip-hop'];
      
      // Use current pattern instead of genre pattern
      const customConfig = { ...config, pattern: currentPattern };
      
      try {
        await sampleEngineRef.current.playBeat(customConfig, samples);
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

  const handleRandomBeat = () => {
    setIsRandomMode(!isRandomMode);
    if (isPlaying) {
      handleStop();
    }
  };

  const handlePatternChange = (newPattern: any) => {
    setCurrentPattern(newPattern);
  };

  const loadGenrePattern = (genre: string) => {
    setCurrentPattern(GENRE_CONFIGS[genre].pattern);
  };

  const handleExport = async () => {
    if (!exportEngineRef.current) return;
    
    setIsExporting(true);
    try {
      const config = isRandomMode ? generateRandomBeat() : GENRE_CONFIGS[selectedGenre];
      const samples = SAMPLE_CONFIGS[selectedGenre] || SAMPLE_CONFIGS['hip-hop'];
      
      const mp3Blob = await exportEngineRef.current.exportBeatToMP3(
        config,
        currentPattern,
        samples,
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
                  if (isPlaying) handleStop();
                }}
                disabled={isRandomMode}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-300
                  ${selectedGenre === key && !isRandomMode
                    ? 'border-purple-400 bg-purple-400/10 shadow-lg shadow-purple-400/20'
                    : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                  }
                  ${isRandomMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="text-center">
                  <div className="text-lg font-semibold mb-1">{config.name}</div>
                </div>
                {selectedGenre === key && !isRandomMode && (
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
              >
                <Square className="w-6 h-6" />
              </button>

              <button
                onClick={handleRandomBeat}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                  ${isRandomMode
                    ? 'bg-purple-500 shadow-lg shadow-purple-500/30'
                    : 'bg-white/10 hover:bg-white/20'
                  }
                `}
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


            {/* Random Mode Indicator */}
            {isRandomMode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-400/30"
              >
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">Random Mode</span>
              </motion.div>
            )}
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
            />
          </div>


          {/* Current Genre Info */}
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <h4 className="font-semibold mb-2 text-sm">Current Beat Info</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-white/70">Genre:</span>
                <div className="font-medium">
                  {isRandomMode ? 'Random Beat' : GENRE_CONFIGS[selectedGenre]?.name}
                </div>
              </div>
              <div>
                <span className="text-white/70">BPM:</span>
                <div className="font-medium">
                  {isRandomMode ? '80-140' : GENRE_CONFIGS[selectedGenre]?.bpm}
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
            Select a genre, adjust the volume, and click play to generate automated beats. 
            Use the shuffle button for random beat generation with mixed patterns and tempos.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
