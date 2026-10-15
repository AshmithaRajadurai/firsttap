'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, RotateCcw, VolumeX, HelpCircle } from 'lucide-react';
import { FSMState, SupportedLanguage, VoiceEngineState } from '@/types';
import { UI_TRANSLATIONS } from '@/lib/i18n/translations';
import { APP_PROMPTS } from '@/lib/lessons/catalog';

interface ControlBarProps {
  voiceState: VoiceEngineState;
  fsmState: FSMState;
  language: SupportedLanguage;
  consecutiveRetries: number;
  onMicClick: () => void;
  onStopSpeaking: () => void;
  onRepeatPrompt: () => void;
  onAskQuestion: () => void;
  onSelectOptionManually?: (optionText: string) => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  voiceState,
  fsmState,
  language,
  consecutiveRetries,
  onMicClick,
  onStopSpeaking,
  onRepeatPrompt,
  onAskQuestion,
  onSelectOptionManually,
}) => {
  const t = UI_TRANSLATIONS[language]?.controls || UI_TRANSLATIONS['ta-IN'].controls;
  const isSpeaking =
    voiceState === 'SPEAKING' ||
    voiceState === 'PLAYING_LANGUAGE_OPTIONS' ||
    voiceState === 'WAITING_FOR_AUDIO_TO_FINISH';
  const isPreparing = voiceState === 'STARTING_MICROPHONE';
  const isListening = voiceState === 'LISTENING';
  const isTranscribing =
    voiceState === 'STOPPING_RECORDING' ||
    voiceState === 'TRANSCRIBING' ||
    voiceState === 'DETECTING_LANGUAGE' ||
    voiceState === 'UNDERSTANDING';
  const isRetryOrError = voiceState === 'RETRY' || voiceState === 'ERROR';

  // Fallback buttons when user is on Language Select
  const showLanguageButtons =
    fsmState === 'LANGUAGE_SELECT' ||
    fsmState === 'LANGUAGE_OPTIONS' ||
    fsmState === 'WAITING_FOR_LANGUAGE';

  // Fallback buttons for Yes/No questions (Question 1 or Question 3)
  const showYesNoButtons =
    fsmState === 'ASKING_PHONE_INDEPENDENCE' ||
    fsmState === 'WAITING_FOR_PHONE_ANSWER' ||
    fsmState === 'ASK_PHONE_OWNERSHIP' ||
    fsmState === 'ASKING_BRANCH_QUESTION' ||
    fsmState === 'WAITING_FOR_BRANCH_ANSWER';

  // Fallback buttons for Question 2 (Main Learning Goal)
  const showGoalButtons =
    fsmState === 'ASKING_LEARNING_GOAL' ||
    fsmState === 'WAITING_FOR_LEARNING_GOAL';

  // Fallback input for Name collection
  const showNameInput =
    fsmState === 'ASKING_NAME' ||
    fsmState === 'WAITING_FOR_NAME' ||
    fsmState === 'ASK_NAME';

  const [manualNameInput, setManualNameInput] = React.useState('');
  const goalOptions = APP_PROMPTS.learningGoal.options;

  return (
    <div className="w-full max-w-md mx-auto px-4 mt-2 mb-4 space-y-2.5">
      {/* 1. Accessible Fallback: Language Select */}
      {showLanguageButtons && onSelectOptionManually && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50/90 dark:bg-slate-800/90 p-3 rounded-2xl border border-amber-200/80 dark:border-slate-700 shadow-sm"
        >
          <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 block mb-2 text-center">
            {t.fallbackLanguageTitle}
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onSelectOptionManually('தமிழ்')}
              className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-sm transition-all cursor-pointer"
            >
              தமிழ்
            </button>
            <button
              onClick={() => onSelectOptionManually('English')}
              className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-sm transition-all cursor-pointer"
            >
              English
            </button>
            <button
              onClick={() => onSelectOptionManually('हिंदी')}
              className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-sm transition-all cursor-pointer"
            >
              हिंदी
            </button>
          </div>
        </motion.div>
      )}

      {/* 2. Accessible Fallback: Yes / No Questions */}
      {showYesNoButtons && onSelectOptionManually && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-50/90 dark:bg-slate-800/90 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm"
        >
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2 text-center">
            {t.fallbackYesNoTitle}
          </span>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onSelectOptionManually(t.yesButton)}
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-sm transition-all cursor-pointer"
            >
              {t.yesButton}
            </button>
            <button
              onClick={() => onSelectOptionManually(t.noButton)}
              className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-base shadow-sm transition-all cursor-pointer"
            >
              {t.noButton}
            </button>
          </div>
        </motion.div>
      )}

      {/* 3. Accessible Fallback: Learning Goal Selection */}
      {showGoalButtons && onSelectOptionManually && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-50/90 dark:bg-slate-800/90 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-2"
        >
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block text-center">
            {t.fallbackGoalTitle}
          </span>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => onSelectOptionManually('1')}
              className="text-left p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-sm transition-all cursor-pointer"
            >
              <span className="inline-block w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-center text-xs mr-2 leading-5">
                1
              </span>
              {goalOptions.EVERYDAY_DIGITAL_SKILLS[language]}
            </button>
            <button
              onClick={() => onSelectOptionManually('2')}
              className="text-left p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-sm transition-all cursor-pointer"
            >
              <span className="inline-block w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-center text-xs mr-2 leading-5">
                2
              </span>
              {goalOptions.DIGITAL_PAYMENTS[language]}
            </button>
            <button
              onClick={() => onSelectOptionManually('3')}
              className="text-left p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-sm transition-all cursor-pointer"
            >
              <span className="inline-block w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-center text-xs mr-2 leading-5">
                3
              </span>
              {goalOptions.MSME_BUSINESS_SKILLS[language]}
            </button>
          </div>
        </motion.div>
      )}

      {/* 4. Accessible Fallback: Name Input */}
      {showNameInput && onSelectOptionManually && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-50/90 dark:bg-slate-800/90 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm"
        >
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2 text-center">
            {t.fallbackNameTitle}
          </span>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (manualNameInput.trim()) {
                onSelectOptionManually(manualNameInput.trim());
                setManualNameInput('');
              }
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={manualNameInput}
              onChange={(e) => setManualNameInput(e.target.value)}
              placeholder={t.namePlaceholder}
              className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={!manualNameInput.trim()}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
            >
              {t.submitNameButton}
            </button>
          </form>
        </motion.div>
      )}

      {/* Main Bottom Voice Control Dock */}
      <div className="flex items-center justify-center space-x-4 bg-white/90 dark:bg-slate-900/90 p-3 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 backdrop-blur-md">
        {/* Repeat Prompt Button */}
        <button
          onClick={onRepeatPrompt}
          className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all shadow-sm active:scale-95 cursor-pointer"
          title={t.repeatPrompt}
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Central Primary Mic Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          onClick={onMicClick}
          className={`relative p-5 rounded-3xl shadow-xl transition-all flex items-center justify-center cursor-pointer ${
            isListening
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white ring-4 ring-emerald-300 dark:ring-emerald-800 shadow-emerald-500/40'
              : isPreparing
              ? 'bg-amber-400 text-slate-900 ring-2 ring-amber-300 animate-pulse'
              : isSpeaking
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/30'
              : isTranscribing
              ? 'bg-sky-500 text-white animate-pulse'
              : isRetryOrError
              ? 'bg-rose-500 text-white'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-orange-500/30'
          }`}
          title={isListening ? t.listeningStop : t.tapToSpeak}
        >
          {isListening ? (
            <>
              <span className="absolute inset-0 rounded-3xl bg-emerald-400 animate-ping opacity-30" />
              <Mic className="w-8 h-8 relative z-10" />
            </>
          ) : isSpeaking ? (
            <MicOff className="w-8 h-8 opacity-75" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
        </motion.button>

        {/* Stop Speaking / Mute Button */}
        {isSpeaking ? (
          <button
            onClick={onStopSpeaking}
            className="p-3.5 rounded-2xl bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 text-rose-600 dark:text-rose-400 transition-all shadow-sm active:scale-95 cursor-pointer"
            title={t.stopSpeaking}
          >
            <VolumeX className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onAskQuestion}
            className="p-3.5 rounded-2xl bg-sky-100 dark:bg-sky-950/60 hover:bg-sky-200 text-sky-600 dark:text-sky-400 transition-all shadow-sm active:scale-95 cursor-pointer"
            title={t.askQuestion}
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Voice Prompt Status Hint */}
      <p className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
        {isListening
          ? t.voiceHints.listening
          : isPreparing
          ? t.voiceHints.preparingMicrophone
          : isSpeaking
          ? t.voiceHints.speaking
          : isTranscribing
          ? t.voiceHints.transcribing
          : isRetryOrError
          ? t.voiceHints.couldNotHear
          : t.voiceHints.idle}
      </p>
    </div>
  );
};
