'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Mic, Eye, EyeOff } from 'lucide-react';

import { SupportedLanguage } from '@/types';
import { UI_TRANSLATIONS } from '@/lib/i18n/translations';

interface CaptionsProps {
  mascotText: string;
  recognizedText: string;
  enabled: boolean;
  onToggle: () => void;
  isTranscribing: boolean;
  language?: SupportedLanguage;
}

export const Captions: React.FC<CaptionsProps> = ({
  mascotText,
  recognizedText,
  enabled,
  onToggle,
  isTranscribing,
  language = 'ta-IN',
}) => {
  const t = UI_TRANSLATIONS[language]?.captions || UI_TRANSLATIONS['ta-IN'].captions;

  return (
    <div className="w-full max-w-xl mx-auto px-4 mt-2">
      {/* Captions Header Toggle */}
      <div className="flex justify-end mb-1">
        <button
          onClick={onToggle}
          className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors py-1 px-2.5 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700"
          title={enabled ? t.hideCaptions : t.showCaptions}
        >
          {enabled ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{enabled ? t.hideCaptions : t.showCaptions}</span>
        </button>
      </div>

      <AnimatePresence>
        {enabled && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl bg-white/95 dark:bg-slate-800/95 border border-amber-200 dark:border-slate-700 shadow-md p-4 space-y-3 backdrop-blur-sm"
          >
            {/* Mascot Spoken Text */}
            {mascotText && (
              <div className="flex items-start space-x-2.5">
                <div className="mt-0.5 p-1.5 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-lg shrink-0">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 tracking-wider uppercase block">
                    FirstTap
                  </span>
                  <p className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-100 leading-snug">
                    {mascotText}
                  </p>
                </div>
              </div>
            )}

            {/* Recognized User Speech */}
            {(recognizedText || isTranscribing) && (
              <div className="flex items-start space-x-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <div className="mt-0.5 p-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0">
                  <Mic className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 tracking-wider uppercase block">
                    {t.youSpeaker}
                  </span>
                  {isTranscribing ? (
                    <p className="text-sm italic text-slate-400 dark:text-slate-500 animate-pulse">
                      {t.transcribingHint}
                    </p>
                  ) : (
                    <p className="text-base sm:text-lg font-medium text-slate-700 dark:text-slate-200 leading-snug">
                      &ldquo;{recognizedText}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
