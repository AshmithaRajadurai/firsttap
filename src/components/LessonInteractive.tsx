'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lesson, LessonStep, SupportedLanguage } from '@/types';
import { ShieldAlert, QrCode, Smartphone, CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react';

interface LessonInteractiveProps {
  lesson: Lesson;
  stepIndex: number;
  language: SupportedLanguage;
  onTargetTapped: () => void;
  onVoiceSimulated: (text: string) => void;
}

export const LessonInteractive: React.FC<LessonInteractiveProps> = ({
  lesson,
  stepIndex,
  language,
  onTargetTapped,
  onVoiceSimulated,
}) => {
  const step: LessonStep = lesson.steps[stepIndex] || lesson.steps[0];

  return (
    <div className="w-full max-w-md mx-auto px-4 mt-2">
      {/* Lesson Progress Dots */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {lesson.title[language]}
        </span>
        <div className="flex space-x-1.5">
          {lesson.steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === stepIndex
                  ? 'w-6 bg-amber-500'
                  : i < stepIndex
                  ? 'w-2 bg-emerald-500'
                  : 'w-2 bg-slate-300 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Simulated Smartphone Screen Card */}
      <motion.div
        key={step.id}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="rounded-3xl border-4 border-slate-800 bg-slate-900 p-4 text-white shadow-2xl relative overflow-hidden"
      >
        {/* Smartphone Speaker notch */}
        <div className="w-20 h-3 bg-slate-800 rounded-full mx-auto mb-3" />

        {/* Interactive Screen Body */}
        <div className="bg-slate-950 rounded-2xl p-4 min-h-[220px] flex flex-col justify-between border border-slate-800">
          {/* Header of simulated screen */}
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/80">
            <span className="flex items-center space-x-1">
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium">{step.title[language]}</span>
            </span>
            <span className="text-emerald-400 font-mono">100% 🔋</span>
          </div>

          {/* Interactive Simulation based on step interactiveType */}
          <div className="my-auto py-3">
            {step.interactiveType === 'tap_target' && (
              <div className="text-center space-y-4">
                <p className="text-sm text-slate-300">
                  {step.instructionText[language]}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={onTargetTapped}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-lg shadow-lg shadow-emerald-500/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <CheckCircle className="w-6 h-6" />
                  <span>தொடுங்கள் (Tap Here)</span>
                </motion.button>
              </div>
            )}

            {step.interactiveType === 'voice_confirm' && step.expectedAnswer === 'no' && (
              <div className="space-y-3">
                {/* Scam SMS / Challenge Alert Simulation */}
                <div className="rounded-xl bg-red-950/50 border border-red-500/40 p-3 space-y-2">
                  <div className="flex items-center space-x-2 text-red-400 font-semibold text-xs">
                    <ShieldAlert className="w-4 h-4" />
                    <span>எச்சரிக்கை: சந்தேகத்திற்குரிய அழைப்பு!</span>
                  </div>
                  <p className="text-xs text-slate-200 bg-black/40 p-2.5 rounded-lg border border-red-900/40">
                    &ldquo;வணக்கம்! வங்கி மேனேஜர் பேசுகிறேன். உங்கள் கணக்கு முடங்காமல் இருக்க OTP எண்ணை உடனே சொல்லுங்கள்!&rdquo;
                  </p>
                </div>

                <div className="text-center pt-1">
                  <p className="text-xs font-semibold text-amber-300 mb-2">
                    குரல் மூலம் பதில் சொல்லுங்கள்: &ldquo;இல்லை!&rdquo; (Say &ldquo;No!&rdquo;)
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onVoiceSimulated('இல்லை')}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-1"
                    >
                      <span>இல்லை (No - Safe)</span>
                    </button>
                    <button
                      onClick={() => onVoiceSimulated('ஆம்')}
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs transition-all"
                      title="Test unsafe answer to hear guidance"
                    >
                      <span>ஆம் (Unsafe)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step.interactiveType === 'voice_confirm' && step.expectedAnswer !== 'no' && (
              <div className="space-y-3">
                {/* QR Code / Payment simulation */}
                <div className="rounded-xl bg-slate-900 border border-amber-500/30 p-3 flex items-center space-x-3">
                  <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                    <QrCode className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wide block">
                      கடை பெயர் (Shop)
                    </span>
                    <span className="font-bold text-amber-200 text-sm block">
                      முருகன் டீ கடை (Murugan Tea Shop)
                    </span>
                    <span className="text-xs font-mono text-emerald-400">
                      தொகை: ₹15.00
                    </span>
                  </div>
                </div>

                <div className="text-center pt-1">
                  <p className="text-xs text-slate-300 mb-2">
                    {step.instructionText[language]}
                  </p>
                  <button
                    onClick={() => onVoiceSimulated('ஆம்')}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <span>ஆம் / புரிகிறது (Yes, Understood)</span>
                  </button>
                </div>
              </div>
            )}

            {step.interactiveType === 'info' && (
              <div className="text-center space-y-3">
                <div className="p-3 rounded-xl bg-sky-950/60 border border-sky-500/30 text-sky-200 text-xs">
                  {step.instructionText[language]}
                </div>
                <button
                  onClick={onTargetTapped}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <span>அடுத்தது (Next Step)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Golden Safety Tip Footer */}
          {step.safetyTip && (
            <div className="mt-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-2 text-[11px] text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{step.safetyTip[language]}</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
