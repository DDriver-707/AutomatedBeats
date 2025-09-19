import { motion } from 'framer-motion';
import type { BeatPattern } from '../types/BeatTypes';

interface PatternVisualizerProps {
  pattern: BeatPattern;
  currentStep: number;
  isPlaying: boolean;
}

export default function PatternVisualizer({ pattern, currentStep, isPlaying }: PatternVisualizerProps) {
  const steps = Array.from({ length: 16 }, (_, i) => i);

  return (
    <div className="space-y-3">
      {/* Kick Pattern */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span className="text-xs font-medium text-white/80">Kick</span>
        </div>
        <div className="flex gap-1">
          {steps.map((step) => (
            <div
              key={step}
              className={`
                w-6 h-6 rounded border transition-all duration-200 flex items-center justify-center text-xs
                ${pattern.kick[step]
                  ? 'bg-red-500 border-red-400 text-white'
                  : 'bg-white/10 border-white/20 text-white/40'
                }
                ${currentStep === step && isPlaying
                  ? 'ring-2 ring-red-400 ring-opacity-50 scale-110'
                  : ''
                }
              `}
            >
              {step + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Snare Pattern */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500"></div>
          <span className="text-xs font-medium text-white/80">Snare</span>
        </div>
        <div className="flex gap-1">
          {steps.map((step) => (
            <div
              key={step}
              className={`
                w-6 h-6 rounded border transition-all duration-200 flex items-center justify-center text-xs
                ${pattern.snare[step]
                  ? 'bg-blue-500 border-blue-400 text-white'
                  : 'bg-white/10 border-white/20 text-white/40'
                }
                ${currentStep === step && isPlaying
                  ? 'ring-2 ring-blue-400 ring-opacity-50 scale-110'
                  : ''
                }
              `}
            >
              {step + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Hi-Hat Pattern */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-500"></div>
          <span className="text-xs font-medium text-white/80">Hi-Hat</span>
        </div>
        <div className="flex gap-1">
          {steps.map((step) => (
            <div
              key={step}
              className={`
                w-6 h-6 rounded border transition-all duration-200 flex items-center justify-center text-xs
                ${pattern.hihat[step]
                  ? 'bg-yellow-500 border-yellow-400 text-white'
                  : 'bg-white/10 border-white/20 text-white/40'
                }
                ${currentStep === step && isPlaying
                  ? 'ring-2 ring-yellow-400 ring-opacity-50 scale-110'
                  : ''
                }
              `}
            >
              {step + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Open Hat Pattern */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-orange-500"></div>
          <span className="text-xs font-medium text-white/80">Open Hat</span>
        </div>
        <div className="flex gap-1">
          {steps.map((step) => (
            <div
              key={step}
              className={`
                w-6 h-6 rounded border transition-all duration-200 flex items-center justify-center text-xs
                ${pattern.openHat[step]
                  ? 'bg-orange-500 border-orange-400 text-white'
                  : 'bg-white/10 border-white/20 text-white/40'
                }
                ${currentStep === step && isPlaying
                  ? 'ring-2 ring-orange-400 ring-opacity-50 scale-110'
                  : ''
                }
              `}
            >
              {step + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Melody Pattern */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500"></div>
          <span className="text-xs font-medium text-white/80">Melody</span>
        </div>
        <div className="flex gap-1">
          {steps.map((step) => (
            <div
              key={step}
              className={`
                w-6 h-6 rounded border transition-all duration-200 flex items-center justify-center text-xs
                ${pattern.melody[step] > 0
                  ? 'bg-green-500 border-green-400 text-white'
                  : 'bg-white/10 border-white/20 text-white/40'
                }
                ${currentStep === step && isPlaying
                  ? 'ring-2 ring-green-400 ring-opacity-50 scale-110'
                  : ''
                }
              `}
            >
              {pattern.melody[step] > 0 ? pattern.melody[step] : step + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Bass Pattern */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-purple-500"></div>
          <span className="text-xs font-medium text-white/80">Bass</span>
        </div>
        <div className="flex gap-1">
          {steps.map((step) => (
            <div
              key={step}
              className={`
                w-6 h-6 rounded border transition-all duration-200 flex items-center justify-center text-xs
                ${pattern.bass[step] > 0
                  ? 'bg-purple-500 border-purple-400 text-white'
                  : 'bg-white/10 border-white/20 text-white/40'
                }
                ${currentStep === step && isPlaying
                  ? 'ring-2 ring-purple-400 ring-opacity-50 scale-110'
                  : ''
                }
              `}
            >
              {pattern.bass[step] > 0 ? pattern.bass[step] : step + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
