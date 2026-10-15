'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface VoiceVisualizerProps {
  amplitude: number; // 0 to 1
  isListening: boolean;
  isSpeaking: boolean;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  amplitude,
  isListening,
  isSpeaking,
}) => {
  const bars = [0.3, 0.6, 0.9, 1.0, 0.8, 0.5, 0.4];

  if (!isListening && !isSpeaking) {
    return (
      <div className="h-10 flex items-center justify-center space-x-1 opacity-30">
        {bars.map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-2 bg-slate-400 rounded-full"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="h-12 flex items-center justify-center space-x-1.5 px-4 py-1">
      {bars.map((factor, i) => {
        const height = Math.max(6, Math.min(44, amplitude * 44 * factor + 6));
        const colorClass = isListening
          ? 'bg-gradient-to-t from-emerald-500 to-teal-400 shadow-emerald-200'
          : 'bg-gradient-to-t from-amber-500 to-orange-400 shadow-amber-200';

        return (
          <motion.div
            key={i}
            className={`w-2 rounded-full shadow-sm ${colorClass}`}
            animate={{
              height: `${height}px`,
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25,
            }}
          />
        );
      })}
    </div>
  );
};
