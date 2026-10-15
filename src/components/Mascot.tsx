'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MascotMood, SupportedLanguage } from '@/types';
import confetti from 'canvas-confetti';
import Image from 'next/image';
import { UI_TRANSLATIONS } from '@/lib/i18n/translations';

interface MascotProps {
  mood: MascotMood;
  isSpeaking: boolean;
  isListening: boolean;
  amplitude: number; // 0 to 1
  language?: SupportedLanguage;
  audioStatus?: 'idle' | 'preparing' | 'speaking' | 'blocked' | 'error' | 'replay';
  onResumeAutoplay?: () => void;
  onReplayPrompt?: () => void;
}

export const Mascot: React.FC<MascotProps> = ({
  mood,
  isSpeaking,
  isListening,
  amplitude,
  language = 'ta-IN',
  audioStatus = 'idle',
  onResumeAutoplay,
  onReplayPrompt,
}) => {
  const t = UI_TRANSLATIONS[language]?.mascot || UI_TRANSLATIONS['ta-IN'].mascot;

  // Trigger celebratory confetti burst when mood switches to happy / celebrating
  useEffect(() => {
    if (mood === 'happy' || mood === 'celebrating') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#0D9488', '#F59E0B', '#3B82F6', '#EC4899', '#10B981'],
        });
      } catch (e) {}
    }
  }, [mood]);

  // Periodic natural eye blinking cycle when idle (every 3.2s - 5.4s, lasting 180ms)
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    let blinkTimer: NodeJS.Timeout;
    let finishTimer: NodeJS.Timeout;

    const scheduleNextBlink = () => {
      const delay = 3200 + Math.random() * 2200;
      blinkTimer = setTimeout(() => {
        setIsBlinking(true);
        finishTimer = setTimeout(() => {
          setIsBlinking(false);
          scheduleNextBlink();
        }, 180);
      }, delay);
    };

    scheduleNextBlink();

    return () => {
      clearTimeout(blinkTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  // Determine active visual pose & state badge based on FSM and audio lifecycle
  let activePose = 'idle';
  let badgeText = t.readyBadge;
  let badgeDotColor = 'bg-teal-500';

  if (mood === 'celebrating' || mood === 'happy') {
    activePose = 'celebrating';
    badgeText = t.celebratingBadge || t.happyBadge;
    badgeDotColor = 'bg-emerald-500';
  } else if (mood === 'encouraging') {
    activePose = 'encouraging';
    badgeText = t.encouragingBadge;
    badgeDotColor = 'bg-teal-500';
  } else if (mood === 'retry' || mood === 'concerned') {
    activePose = 'retry';
    badgeText = t.retryBadge || t.encouragingBadge;
    badgeDotColor = 'bg-amber-500';
  } else if (mood === 'thinking') {
    activePose = 'thinking';
    badgeText = t.thinkingBadge;
    badgeDotColor = 'bg-sky-500';
  } else if (mood === 'waiting') {
    activePose = 'waiting';
    badgeText = t.readyToAnswer;
    badgeDotColor = 'bg-teal-500';
  } else if (isListening || mood === 'listening') {
    activePose = 'listening';
    badgeText = t.listeningBadge;
    badgeDotColor = 'bg-teal-500';
  } else if (isSpeaking || mood === 'speaking') {
    activePose = 'speaking';
    badgeText = t.speakingBadge;
    badgeDotColor = 'bg-amber-500';
  } else if (mood === 'language_selection') {
    activePose = 'language_selection';
    badgeText = t.welcomeBadge;
    badgeDotColor = 'bg-orange-500';
  } else if (mood === 'welcome' || mood === 'waving') {
    activePose = 'welcome';
    badgeText = t.welcomeBadge;
    badgeDotColor = 'bg-orange-500';
  } else {
    activePose = 'idle';
    badgeText = t.readyBadge;
    badgeDotColor = 'bg-teal-500';
  }

  // Audio status override for status badge if active
  if (audioStatus === 'preparing') {
    badgeText = t.preparingVoice;
    badgeDotColor = 'bg-amber-400';
  } else if (audioStatus === 'speaking') {
    badgeText = t.speakingStatus;
    badgeDotColor = 'bg-amber-500';
  } else if (audioStatus === 'error') {
    badgeText = t.audioUnavailable;
    badgeDotColor = 'bg-rose-500';
  } else if (audioStatus === 'blocked') {
    badgeText = t.autoplayBlocked;
    badgeDotColor = 'bg-amber-500';
  }

  // Voice-amplitude responsive parameters for natural speaking cadence
  const dynamicSpeakingScale = isSpeaking ? 1 + amplitude * 0.038 : 1;
  const dynamicSpeakingY = isSpeaking ? -amplitude * 6 : 0;

  return (
    <div className="relative flex flex-col items-center justify-center select-none w-full max-w-[280px] sm:max-w-[320px] mx-auto">
      {/* Dynamic Background Glow Aura - Color coded by state */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            key="listening-glow"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{
              scale: [1, 1.15, 1.05],
              opacity: [0.35, 0.7, 0.45],
            }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-teal-400 via-cyan-300 to-emerald-300 blur-2xl -z-10"
          />
        )}
        {isSpeaking && (
          <motion.div
            key="speaking-glow"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400 via-orange-300 to-yellow-200 blur-2xl -z-10"
          />
        )}
        {activePose === 'thinking' && (
          <motion.div
            key="thinking-glow"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.25, 0.5, 0.25],
            }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-400 via-indigo-300 to-blue-200 blur-2xl -z-10"
          />
        )}
        {activePose === 'retry' && (
          <motion.div
            key="retry-glow"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{
              scale: [1, 1.06, 1],
              opacity: [0.25, 0.45, 0.25],
            }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-300 via-orange-200 to-rose-200 blur-2xl -z-10"
          />
        )}
        {(activePose === 'celebrating' || activePose === 'encouraging') && (
          <motion.div
            key="celebrating-glow"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{
              scale: [1, 1.14, 1.05],
              opacity: [0.35, 0.65, 0.4],
            }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-400 via-teal-300 to-amber-300 blur-2xl -z-10"
          />
        )}
      </AnimatePresence>

      {/* Main Mascot Container with 2:3 aspect ratio perfectly fitting original artwork */}
      <motion.div
        className="relative w-[230px] sm:w-[260px] aspect-[2/3] overflow-hidden rounded-3xl shadow-xl border-2 border-amber-200/80 dark:border-slate-700 bg-[#FAF5EF]"
        animate={{
          scale: dynamicSpeakingScale,
          y:
            activePose === 'celebrating'
              ? [0, -10, 0, -6, 0]
              : activePose === 'welcome'
              ? [0, -4, 0, -2, 0]
              : activePose === 'listening'
              ? [-2, -4, -2]
              : activePose === 'encouraging'
              ? [0, 4, -1, 3, 0]
              : activePose === 'retry'
              ? [0, -3, 0]
              : activePose === 'thinking'
              ? [0, -5, 0]
              : activePose === 'waiting'
              ? [0, -2, 0]
              : isSpeaking
              ? dynamicSpeakingY
              : [0, -3, 0], // natural idle breathing
          rotate:
            activePose === 'welcome'
              ? [0, 2, -1, 2, 0] // friendly hand-wave oscillation
              : activePose === 'listening'
              ? [-1, 2, 0.5, 1.8, -1] // gentle listening head tilt
              : activePose === 'thinking'
              ? [0, -2, -1, -2, 0] // thoughtful upward tilt
              : activePose === 'retry'
              ? [0, -2, 2, -1, 0] // inquiring gentle shrug
              : isSpeaking
              ? [-0.6, 0.8, -0.4, 0.6] // natural speech gesture sway
              : 0,
        }}
        transition={{
          repeat: Infinity,
          duration:
            activePose === 'celebrating'
              ? 1.2
              : activePose === 'welcome'
              ? 2.4
              : activePose === 'listening'
              ? 2.8
              : activePose === 'encouraging'
              ? 2.0
              : activePose === 'retry'
              ? 2.4
              : activePose === 'thinking'
              ? 3.0
              : activePose === 'waiting'
              ? 3.2
              : isSpeaking
              ? 1.2
              : 3.6, // smooth idle breathing cycle
          ease: 'easeInOut',
        }}
      >
        {/* State-aware Character Pose with smooth Cross-fade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePose === 'idle' && isBlinking ? 'blink' : activePose}
            initial={{ opacity: 0.9, scale: 0.995 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.9 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className="relative w-full h-full"
          >
            <Image
              src={`/mascot/${activePose === 'idle' && isBlinking ? 'blink' : activePose}.png`}
              alt="FirstTap Voice Teacher"
              fill
              priority
              sizes="(max-width: 640px) 230px, 260px"
              className="object-contain object-center select-none pointer-events-none drop-shadow-sm"
            />
          </motion.div>
        </AnimatePresence>

        {/* Dynamic Speaking Soundwave Overlay at bottom-right */}
        {isSpeaking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-amber-500/95 text-slate-950 text-[10px] font-bold shadow-md flex items-center space-x-1.5 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
            <span>{t.speakingTag}</span>
          </motion.div>
        )}

        {/* Dynamic Listening Pulse Indicator */}
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-teal-600/95 text-white text-[10px] font-bold shadow-md flex items-center space-x-1.5 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
            <span>{t.listeningTag}</span>
          </motion.div>
        )}

        {/* Thinking Indicator */}
        {activePose === 'thinking' && !isSpeaking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-sky-600/95 text-white text-[10px] font-bold shadow-md flex items-center space-x-1.5 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-sky-300 animate-pulse" />
            <span>{t.thinkingTag}</span>
          </motion.div>
        )}

        {/* Autoplay restriction overlay button */}
        {audioStatus === 'blocked' && onResumeAutoplay && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center z-20"
          >
            <button
              onClick={onResumeAutoplay}
              className="py-2.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all animate-bounce cursor-pointer flex items-center space-x-1.5"
            >
              <span>{t.autoplayBlocked}</span>
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Floating State Badge & Replay Control under Character */}
      <div className="mt-2.5 flex items-center space-x-2">
        <div className="px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-md flex items-center space-x-2 border transition-all duration-300 backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border-amber-200 dark:border-slate-700">
          <span
            className={`w-2.5 h-2.5 rounded-full ${badgeDotColor} ${
              isSpeaking || audioStatus === 'preparing' ? 'animate-pulse' : isListening ? 'animate-ping' : ''
            }`}
          />
          <span className="text-slate-800 dark:text-slate-200 tracking-wide font-medium">
            {badgeText}
          </span>
        </div>

        {/* Visible Replay Button if speech ended or on error */}
        {onReplayPrompt && (audioStatus === 'error' || (!isSpeaking && !isListening)) && (
          <button
            onClick={onReplayPrompt}
            title={t.tapToHearAgain}
            aria-label={t.tapToHearAgain}
            className="p-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 border border-amber-200 dark:border-slate-700 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800 shadow-sm transition-all cursor-pointer text-xs"
          >
            🔁
          </button>
        )}
      </div>
    </div>
  );
};
