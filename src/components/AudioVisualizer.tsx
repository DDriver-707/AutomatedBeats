import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AudioVisualizerProps {
  isPlaying: boolean;
  currentStep: number;
}

export default function AudioVisualizer({ isPlaying, currentStep }: AudioVisualizerProps) {
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(32).fill(0));
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        // Generate random audio levels for visualization
        const newLevels = audioLevels.map((_, index) => {
          // Higher activity during active steps
          const stepActive = Math.floor(index / 2) === currentStep;
          const baseLevel = stepActive ? Math.random() * 0.8 + 0.2 : Math.random() * 0.3;
          return Math.max(0, Math.min(1, baseLevel));
        });
        
        setAudioLevels(newLevels);
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      setAudioLevels(new Array(32).fill(0));
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentStep]);

  return (
    <div className="flex items-end justify-center gap-1 h-20">
      {audioLevels.map((level, index) => (
        <motion.div
          key={index}
          className={`w-2 rounded-t ${
            isPlaying 
              ? 'bg-gradient-to-t from-purple-500 to-pink-400' 
              : 'bg-white/20'
          }`}
          style={{
            height: `${Math.max(4, level * 80)}px`,
          }}
          animate={{
            height: isPlaying ? `${Math.max(4, level * 80)}px` : '4px',
            opacity: isPlaying ? 1 : 0.3,
          }}
          transition={{
            duration: 0.1,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
