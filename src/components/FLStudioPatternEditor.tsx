import type { BeatPattern } from '../types/BeatTypes';

interface FLStudioPatternEditorProps {
  pattern: BeatPattern;
  currentStep: number;
  isPlaying: boolean;
  onPatternChange: (newPattern: BeatPattern) => void;
}

export default function FLStudioPatternEditor({ 
  pattern, 
  currentStep, 
  isPlaying, 
  onPatternChange 
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
    { key: 'kick' as keyof BeatPattern, name: 'Kick', color: 'red', icon: '🥁' },
    { key: 'snare' as keyof BeatPattern, name: 'Snare', color: 'blue', icon: '👏' },
    { key: 'hihat' as keyof BeatPattern, name: 'Hi-Hat', color: 'yellow', icon: '🎵' },
    { key: 'openHat' as keyof BeatPattern, name: 'Open Hat', color: 'orange', icon: '🔔' },
    { key: 'bass' as keyof BeatPattern, name: 'Bass', color: 'purple', icon: '🎸' }
  ];

  return (
    <div className="space-y-2">
      {/* Step Numbers Header */}
      <div className="flex items-center gap-2">
        {/* Spacer for instrument label */}
        <div className="w-20"></div>
        
        {/* Spacer for clear/fill buttons */}
        <div className="flex gap-1">
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
      </div>

      {/* Instrument Rows */}
      {instruments.map((instrument) => (
        <div key={instrument.key} className="flex items-center gap-2">
          {/* Instrument Label */}
          <div className="flex items-center gap-2 w-20">
            <span className="text-lg">{instrument.icon}</span>
            <span className="text-xs font-medium text-white/80">{instrument.name}</span>
          </div>

          {/* Clear/Fill Buttons */}
          <div className="flex gap-1">
            <button
              onClick={() => clearPattern(instrument.key)}
              className="w-4 h-4 bg-red-500/20 hover:bg-red-500/40 rounded text-xs text-red-400 hover:text-red-300 transition-colors"
              title="Clear"
            >
              ×
            </button>
            <button
              onClick={() => fillPattern(instrument.key)}
              className="w-4 h-4 bg-green-500/20 hover:bg-green-500/40 rounded text-xs text-green-400 hover:text-green-300 transition-colors"
              title="Fill"
            >
              +
            </button>
          </div>

          {/* Pattern Steps */}
          <div className="flex gap-1">
            {steps.map((step) => (
              <button
                key={step}
                onClick={() => toggleStep(instrument.key, step)}
                className={`
                  w-6 h-6 rounded border transition-all duration-150 flex items-center justify-center text-xs font-bold
                  ${pattern[instrument.key][step] > 0
                    ? `bg-${instrument.color}-500 border-${instrument.color}-400 text-white`
                    : 'bg-white/10 border-white/20 text-white/40 hover:bg-white/20'
                  }
                  ${currentStep === step && isPlaying
                    ? 'ring-2 ring-purple-400 ring-opacity-50 scale-110'
                    : ''
                  }
                  hover:scale-105 active:scale-95
                `}
              >
                {pattern[instrument.key][step] > 0 ? '●' : ''}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Pattern Info */}
      <div className="mt-4 p-3 bg-white/5 rounded-lg">
        <h4 className="text-xs font-semibold mb-2 text-white/80">Pattern Controls</h4>
        <div className="text-xs text-white/60 space-y-1">
          <div>• Click squares to toggle steps on/off</div>
          <div>• ● = Step is active, empty = Step is off</div>
          <div>• × = Clear pattern, + = Fill pattern</div>
          <div>• Purple highlight shows current playing step</div>
        </div>
        
      </div>
    </div>
  );
}
