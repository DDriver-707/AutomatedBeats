import type { BeatPattern } from '../types/BeatTypes';
import type { AudioSample } from '../engine/SampleEngine';

interface FLStudioPatternEditorProps {
  pattern: BeatPattern;
  currentStep: number;
  isPlaying: boolean;
  onPatternChange: (newPattern: BeatPattern) => void;
  trackVolumes?: Record<string, number>;
  onVolumeChange?: (track: string, volume: number) => void;
  onRandomizeSample?: (instrument: string) => void;
  onRandomizePattern?: (instrument: string) => void;
  availableSamples?: AudioSample;
}

export default function FLStudioPatternEditor({ 
  pattern, 
  currentStep, 
  isPlaying, 
  onPatternChange,
  trackVolumes = {},
  onVolumeChange,
  onRandomizeSample,
  onRandomizePattern,
  availableSamples = {
    kick: [],
    snare: [],
    clap: [],
    hihat: [],
    openHat: [],
    bass: [],
    melody: []
  }
}: FLStudioPatternEditorProps) {
  const steps = Array.from({ length: 16 }, (_, i) => i);

  const toggleStep = (instrument: keyof BeatPattern, step: number) => {
    const newPattern = { ...pattern };
    
    // For all instruments, simple on/off toggle
    newPattern[instrument][step] = newPattern[instrument][step] === 1 ? 0 : 1;
    
    onPatternChange(newPattern);
  };

  const clearPattern = (instrument: keyof BeatPattern) => {
    const newPattern = { ...pattern };
    newPattern[instrument] = new Array(16).fill(0);
    onPatternChange(newPattern);
  };

  const fillPattern = (instrument: keyof BeatPattern) => {
    const newPattern = { ...pattern };
    newPattern[instrument] = new Array(16).fill(1);
    onPatternChange(newPattern);
  };

  const instruments = [
    { key: 'kick' as keyof BeatPattern, name: 'Kick', color: 'red', icon: '🔊', volumeKey: 'kick', sampleKey: 'kick' },
    { key: 'snare' as keyof BeatPattern, name: 'Snare', color: 'blue', icon: '🥁', volumeKey: 'snare', sampleKey: 'snare' },
    { key: 'clap' as keyof BeatPattern, name: 'Clap', color: 'green', icon: '👏', volumeKey: 'clap', sampleKey: 'clap' },
    { key: 'hihat' as keyof BeatPattern, name: 'Hi-Hat', color: 'yellow', icon: '🎵', volumeKey: 'hihat', sampleKey: 'hihat' },
    { key: 'openHat' as keyof BeatPattern, name: 'Open Hat', color: 'orange', icon: '🔔', volumeKey: 'openhat', sampleKey: 'openHat' },
    { key: 'bass' as keyof BeatPattern, name: 'Bass', color: 'purple', icon: '🎸', volumeKey: 'bass', sampleKey: 'bass' }
  ];

  // Check if instrument has available samples
  const hasSamples = (sampleKey: string) => {
    const key = sampleKey as keyof AudioSample;
    return availableSamples[key] && availableSamples[key].length > 0;
  };

  return (
    <div className="space-y-2">
      {/* Step Numbers Header */}
      <div className="flex items-center gap-2">
        {/* Spacer for instrument label */}
        <div className="w-20"></div>
        
        {/* Spacer for clear/fill/shuffle buttons */}
        <div className="flex gap-1">
          <div className="w-4 h-4"></div>
          <div className="w-4 h-4"></div>
          <div className="w-4 h-4"></div>
          <div className="w-4 h-4"></div>
        </div>

        {/* Step Numbers */}
        <div className="flex gap-1">
          {steps.map((step) => (
            <div
              key={step}
              className={`
                w-6 h-6 flex items-center justify-center text-xs font-bold
                ${currentStep === step && isPlaying
                  ? 'text-purple-400 bg-purple-400/20 rounded'
                  : 'text-white/60'
                }
              `}
            >
              {step + 1}
            </div>
          ))}
        </div>

        {/* Volume Header */}
        <div className="flex-1 flex justify-center">
          <span className="text-xs text-white/60 font-medium">Volume</span>
        </div>
      </div>

      {/* Instrument Rows */}
      {instruments.map((instrument) => {
        const samplesAvailable = hasSamples(instrument.sampleKey);
        
        return (
        <div key={instrument.key} className={`flex items-center gap-2 ${!samplesAvailable ? 'opacity-40' : ''}`}>
          {/* Instrument Label */}
          <div className="flex items-center gap-2 w-20">
            <span className="text-lg">{instrument.icon}</span>
            <span className={`text-xs font-medium ${samplesAvailable ? 'text-white/80' : 'text-white/40'}`}>
              {instrument.name}
              {!samplesAvailable && <span className="text-[8px] ml-1">(N/A)</span>}
            </span>
          </div>

          {/* Clear/Fill/Randomize Buttons */}
          <div className="flex gap-1">
            <button
              onClick={() => clearPattern(instrument.key)}
              disabled={!samplesAvailable}
              className={`w-4 h-4 rounded text-xs transition-colors ${
                samplesAvailable 
                  ? 'bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-red-300' 
                  : 'bg-white/5 text-white/20 cursor-not-allowed'
              }`}
              title={samplesAvailable ? "Clear" : "No samples available"}
            >
              ×
            </button>
            <button
              onClick={() => fillPattern(instrument.key)}
              disabled={!samplesAvailable}
              className={`w-4 h-4 rounded text-xs transition-colors ${
                samplesAvailable 
                  ? 'bg-green-500/20 hover:bg-green-500/40 text-green-400 hover:text-green-300' 
                  : 'bg-white/5 text-white/20 cursor-not-allowed'
              }`}
              title={samplesAvailable ? "Fill" : "No samples available"}
            >
              +
            </button>
            <button
              onClick={() => onRandomizeSample?.(instrument.sampleKey)}
              disabled={!samplesAvailable}
              className={`w-4 h-4 rounded text-xs transition-colors flex items-center justify-center ${
                samplesAvailable 
                  ? 'bg-purple-500/20 hover:bg-purple-500/40 text-purple-400 hover:text-purple-300' 
                  : 'bg-white/5 text-white/20 cursor-not-allowed'
              }`}
              title={samplesAvailable ? "Randomize Sample" : "No samples available"}
            >
              🎵
            </button>
            <button
              onClick={() => onRandomizePattern?.(instrument.sampleKey)}
              disabled={!samplesAvailable}
              className={`w-4 h-4 rounded text-xs transition-colors flex items-center justify-center ${
                samplesAvailable 
                  ? 'bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 hover:text-blue-300' 
                  : 'bg-white/5 text-white/20 cursor-not-allowed'
              }`}
              title={samplesAvailable ? "Randomize Pattern" : "No samples available"}
            >
              🎲
            </button>
          </div>

          {/* Pattern Steps */}
          <div className="flex gap-1">
            {steps.map((step) => (
              <button
                key={step}
                onClick={() => samplesAvailable && toggleStep(instrument.key, step)}
                disabled={!samplesAvailable}
                className={`
                  w-6 h-6 rounded border transition-all duration-150 flex items-center justify-center text-xs font-bold
                  ${!samplesAvailable
                    ? 'bg-white/5 border-white/10 text-white/20 cursor-not-allowed'
                    : pattern[instrument.key][step] > 0
                      ? `bg-${instrument.color}-500 border-${instrument.color}-400 text-white`
                      : 'bg-white/10 border-white/20 text-white/40 hover:bg-white/20'
                  }
                  ${currentStep === step && isPlaying && samplesAvailable
                    ? 'ring-2 ring-purple-400 ring-opacity-50 scale-110'
                    : ''
                  }
                  ${samplesAvailable ? 'hover:scale-105 active:scale-95' : ''}
                `}
              >
                {pattern[instrument.key][step] > 0 && samplesAvailable ? '●' : ''}
              </button>
            ))}
          </div>

          {/* Volume Slider */}
          <div className="flex-1 flex flex-col items-center px-2 py-1">
            <div className="relative w-full bg-white/5 rounded-lg p-2 backdrop-blur-sm">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={trackVolumes[instrument.volumeKey] || 0.5}
                onChange={(e) => onVolumeChange?.(instrument.volumeKey, parseFloat(e.target.value))}
                className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer slider relative z-10"
                style={{
                  background: `linear-gradient(to right, #${instrument.color === 'yellow' ? 'fbbf24' : instrument.color === 'green' ? '10b981' : instrument.color === 'blue' ? '3b82f6' : instrument.color === 'orange' ? 'f97316' : '8b5cf6'} 0%, #${instrument.color === 'yellow' ? 'fbbf24' : instrument.color === 'green' ? '10b981' : instrument.color === 'blue' ? '3b82f6' : instrument.color === 'orange' ? 'f97316' : '8b5cf6'} ${(trackVolumes[instrument.volumeKey] || 0.5) * 100}%, rgba(255,255,255,0.15) ${(trackVolumes[instrument.volumeKey] || 0.5) * 100}%, rgba(255,255,255,0.15) 100%)`,
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                }}
              />
              {/* Volume percentage display */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-10 text-center">
                <span className="text-xs text-white/80 font-mono bg-black/20 px-1 rounded">
                  {Math.round((trackVolumes[instrument.volumeKey] || 0.5) * 100)}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
      })}

      {/* Pattern Info */}
      <div className="mt-4 p-3 bg-white/5 rounded-lg">
        <h4 className="text-xs font-semibold mb-2 text-white/80">Pattern Controls</h4>
        <div className="text-xs text-white/60 space-y-1">
          <div>• Click squares to toggle steps on/off</div>
          <div>• ● = Step is active, empty = Step is off</div>
          <div>• × = Clear pattern, + = Fill pattern</div>
          <div>• 🎵 = Randomize sample, 🎲 = Randomize pattern</div>
          <div>• Purple highlight shows current playing step</div>
        </div>
        
      </div>
    </div>
  );
}
