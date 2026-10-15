'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  SkipForward,
  RotateCcw,
  X,
  List,
  Volume2,
  VolumeX,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Award,
  Smartphone,
  PhoneOff,
  MessageSquare,
  KeyRound,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Clock,
  Ban,
  Trophy,
} from 'lucide-react';
import {
  PrimaryCategory,
  SpamProgress,
} from '@/types';
import {
  SpamStepId,
  SpamLanguageCode,
  SpamCallLesson,
} from './types';
import {
  ALL_FRAUD_LESSONS,
  SPAM_PATH_LESSON_METAS,
} from './fraudCurriculum';
import {
  getNextSpamStep,
  getPreviousSpamStep,
} from './spamCatalog';
import { spamVoiceManager } from './voice';
import { CallSimulator } from './CallSimulator';
import { MessageSimulator } from './MessageSimulator';
import { UpiSimulator } from './UpiSimulator';
import { ChallengeSimulator } from './ChallengeSimulator';
import Image from 'next/image';

interface FirstTapSpamModuleProps {
  language: SpamLanguageCode;
  category?: PrimaryCategory;
  initialStepId?: SpamStepId;
  completedSteps?: SpamStepId[];
  skippedSteps?: SpamStepId[];
  onProgressUpdate?: (progress: SpamProgress) => void;
  onFinishModule?: () => void;
  onExit: () => void;
  onOpenDoubt?: (context?: string) => void;
}

const UI_TEXT = {
  en: {
    backToPath: 'Learning Path',
    allLessons: 'All Lessons',
    lessonHeader: 'Lesson {current} of 8',
    statusCompleted: 'Completed',
    statusInProgress: 'In Progress',
    statusSkipped: 'Skipped',
    statusNotStarted: 'Not Started',
    muteVoice: 'Mute Voice',
    unmuteVoice: 'Voice On',
    selviMentor: 'SELVI · CYBER DEFENSE INSTRUCTOR',
    goldenRuleBadge: 'GOLDEN SECURITY RULE',
    redFlagsTitle: 'FRAUD WARNING SIGNS',
    prevLesson: 'Previous Lesson',
    nextLesson: 'Next Lesson',
    skipLesson: 'Skip Lesson',
    replayDemo: 'Replay Demo',
    askSelvi: 'Ask Selvi a Question',
    exitToDashboard: 'Exit to Dashboard',
    menuTitle: 'Spam & Digital Fraud Safety Curriculum',
    menuSubtitle: '8 Connected Real-World Scam Simulations',
    skipNotice: 'Skipping this lesson will not mark it completed. You can return anytime.',
  },
  ta: {
    backToPath: 'கற்றல் பாதை',
    allLessons: 'அனைத்துப் பாடங்கள்',
    lessonHeader: 'பாடம் {current} / 8',
    statusCompleted: 'முடிந்தது',
    statusInProgress: 'செயலில் உள்ளது',
    statusSkipped: 'தவிர்க்கப்பட்டது',
    statusNotStarted: 'தொடங்கவில்லை',
    muteVoice: 'ஒலியை முடக்கு',
    unmuteVoice: 'குரல் வழிகாட்டல்',
    selviMentor: 'செல்வி · சைபர் பாதுகாப்பு ஆசிரியை',
    goldenRuleBadge: 'தங்க பாதுகாப்பு விதி',
    redFlagsTitle: 'மோசடி எச்சரிக்கை அடையாளங்கள்',
    prevLesson: 'முந்தைய பாடம்',
    nextLesson: 'அடுத்த பாடம்',
    skipLesson: 'பாடத்தைத் தவிர்',
    replayDemo: 'மீண்டும் செய்முறை',
    askSelvi: 'செல்வியிடம் கேள்வி கேட்க',
    exitToDashboard: 'டாஷ்போர்டுக்கு திரும்பு',
    menuTitle: 'டிஜிட்டல் மோசடி பாதுகாப்பு பாடத்திட்டம்',
    menuSubtitle: '8 நிஜ வாழ்க்கை மோசடி பயிற்சிகள்',
    skipNotice: 'பாடத்தைத் தவிர்த்தால் முடித்ததாகக் கருதப்படாது. நீங்கள் எப்போது வேண்டுமானாலும் மீண்டும் பழகலாம்.',
  },
  hi: {
    backToPath: 'लर्निंग पाथ',
    allLessons: 'सभी पाठ',
    lessonHeader: 'पाठ {current} / 8',
    statusCompleted: 'पूर्ण हुआ',
    statusInProgress: 'प्रगति पर',
    statusSkipped: 'छोड़ा गया',
    statusNotStarted: 'शुरू नहीं हुआ',
    muteVoice: 'आवाज बंद करें',
    unmuteVoice: 'आवाज चालू',
    selviMentor: 'सेल्वी · साइबर सुरक्षा मार्गदर्शक',
    goldenRuleBadge: 'सुरक्षा का सुनहरा नियम',
    redFlagsTitle: 'धोखाधड़ी के प्रमुख खतरे',
    prevLesson: 'पिछला पाठ',
    nextLesson: 'अगला पाठ',
    skipLesson: 'पाठ छोड़ें',
    replayDemo: 'डेमो दोबारा देखें',
    askSelvi: 'सेल्वी से सवाल पूछें',
    exitToDashboard: 'डैशबोर्ड पर वापस जाएं',
    menuTitle: 'डिजिटल फ्रॉड सुरक्षा पाठ्यक्रम',
    menuSubtitle: '8 वास्तविक साइबर अपराध अभ्यास',
    skipNotice: 'पाठ छोड़ने पर यह पूरा नहीं माना जाएगा। आप कभी भी वापस आ सकते हैं।',
  },
};

export const FirstTapSpamModule: React.FC<FirstTapSpamModuleProps> = ({
  language = 'en',
  category = 'DIGITAL_BEGINNER',
  initialStepId = 1,
  completedSteps = [],
  skippedSteps = [],
  onProgressUpdate,
  onFinishModule,
  onExit,
  onOpenDoubt,
}) => {
  const [currentStep, setCurrentStep] = useState<SpamStepId>(initialStepId);
  const [completed, setCompleted] = useState<SpamStepId[]>(completedSteps);
  const [skipped, setSkipped] = useState<SpamStepId[]>(skippedSteps);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(() => spamVoiceManager.getIsMuted());
  const [simulatorResetKey, setSimulatorResetKey] = useState<number>(0);

  const t = UI_TEXT[language] || UI_TEXT.en;

  // Active lesson data
  const currentLesson: SpamCallLesson = useMemo(() => {
    return ALL_FRAUD_LESSONS.find((l) => l.id === currentStep) || ALL_FRAUD_LESSONS[0];
  }, [currentStep]);

  const currentMeta = SPAM_PATH_LESSON_METAS[currentStep] || SPAM_PATH_LESSON_METAS[1];

  // Stop voice on unmount
  useEffect(() => {
    return () => {
      spamVoiceManager.stop();
    };
  }, []);

  // Sync mute state
  const handleToggleMute = () => {
    const nextMuted = !isVoiceMuted;
    setIsVoiceMuted(nextMuted);
    spamVoiceManager.setMuted(nextMuted);
  };

  // Persist progress helper
  const notifyProgress = useCallback(
    (
      updatedCurrent: SpamStepId,
      updatedCompleted: SpamStepId[],
      updatedSkipped: SpamStepId[]
    ) => {
      const isAllDone = [1, 2, 3, 4, 5, 6, 7, 8].every((id) =>
        updatedCompleted.includes(id as SpamStepId)
      );

      const progress: SpamProgress = {
        current_step_id: updatedCurrent,
        completed_steps: updatedCompleted,
        skipped_steps: updatedSkipped,
        is_module_completed: isAllDone,
        last_active_at: new Date().toISOString(),
      };

      if (onProgressUpdate) {
        onProgressUpdate(progress);
      }

      if (isAllDone && onFinishModule) {
        onFinishModule();
      }
    },
    [onProgressUpdate, onFinishModule]
  );

  // Lesson selection
  const handleSelectLesson = (stepId: SpamStepId) => {
    spamVoiceManager.stop();
    setCurrentStep(stepId);
    setSimulatorResetKey((prev) => prev + 1);
    setIsMenuOpen(false);

    notifyProgress(stepId, completed, skipped);
  };

  // Complete a lesson
  const handleLessonComplete = () => {
    let updatedCompleted = completed;
    if (!completed.includes(currentStep)) {
      updatedCompleted = [...completed, currentStep];
      setCompleted(updatedCompleted);
    }

    // Remove from skipped if was skipped earlier
    let updatedSkipped = skipped;
    if (skipped.includes(currentStep)) {
      updatedSkipped = skipped.filter((id) => id !== currentStep);
      setSkipped(updatedSkipped);
    }

    notifyProgress(currentStep, updatedCompleted, updatedSkipped);
  };

  // Navigate to Next Lesson
  const handleNextLesson = () => {
    spamVoiceManager.stop();
    const nextStep = getNextSpamStep(currentStep);
    if (nextStep) {
      setCurrentStep(nextStep);
      setSimulatorResetKey((prev) => prev + 1);
      notifyProgress(nextStep, completed, skipped);
    } else {
      if (onFinishModule) onFinishModule();
      else onExit();
    }
  };

  // Navigate to Previous Lesson
  const handlePreviousLesson = () => {
    spamVoiceManager.stop();
    const prevStep = getPreviousSpamStep(currentStep);
    if (prevStep) {
      setCurrentStep(prevStep);
      setSimulatorResetKey((prev) => prev + 1);
      notifyProgress(prevStep, completed, skipped);
    }
  };

  // Skip current lesson (does NOT mark completed)
  const handleSkipLesson = () => {
    spamVoiceManager.stop();
    let updatedSkipped = skipped;
    if (!skipped.includes(currentStep)) {
      updatedSkipped = [...skipped, currentStep];
      setSkipped(updatedSkipped);
    }

    const nextStep = getNextSpamStep(currentStep);
    if (nextStep) {
      setCurrentStep(nextStep);
      setSimulatorResetKey((prev) => prev + 1);
      notifyProgress(nextStep, completed, updatedSkipped);
    } else {
      notifyProgress(currentStep, completed, updatedSkipped);
      onExit();
    }
  };

  // Replay demo
  const handleReplayDemo = () => {
    spamVoiceManager.stop();
    setSimulatorResetKey((prev) => prev + 1);
  };

  // Exit module
  const handleExit = () => {
    spamVoiceManager.stop();
    onExit();
  };

  // Dynamic Icon Helper
  const renderLessonIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'PhoneOff':
        return <PhoneOff className={className} />;
      case 'ShieldAlert':
        return <ShieldAlert className={className} />;
      case 'Trophy':
        return <Trophy className={className} />;
      case 'Smartphone':
        return <Smartphone className={className} />;
      case 'MessageSquare':
        return <MessageSquare className={className} />;
      case 'KeyRound':
        return <KeyRound className={className} />;
      case 'Award':
        return <Award className={className} />;
      default:
        return <ShieldCheck className={className} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center w-full px-3 sm:px-6 py-3 font-sans selection:bg-red-500/30">
      {/* 1. TOP RESPONSIVE HEADER BAR */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between gap-3 mb-4 bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-2xl shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleExit}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700 cursor-pointer shadow-xs"
            title={t.backToPath}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t.backToPath}</span>
          </button>

          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition border border-slate-700 cursor-pointer shadow-xs"
            title={t.allLessons}
          >
            <List className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">{t.allLessons}</span>
          </button>

          <div className="pl-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                {t.lessonHeader.replace('{current}', String(currentStep))}
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
              {currentLesson.title[language] || currentLesson.title.en}
            </p>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-2">
          {/* Mute Voice Button */}
          <button
            onClick={handleToggleMute}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border shadow-xs ${
              isVoiceMuted
                ? 'bg-red-950/60 text-red-300 border-red-800'
                : 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
            }`}
            title={isVoiceMuted ? t.unmuteVoice : t.muteVoice}
          >
            {isVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">
              {isVoiceMuted ? t.muteVoice : t.unmuteVoice}
            </span>
          </button>

          {/* Current Status Pill */}
          <span
            className={`text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 border shadow-xs ${
              completed.includes(currentStep)
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : skipped.includes(currentStep)
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}
          >
            {completed.includes(currentStep) ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">{t.statusCompleted}</span>
              </>
            ) : skipped.includes(currentStep) ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">{t.statusSkipped}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{t.statusInProgress}</span>
              </>
            )}
          </span>
        </div>
      </header>

      {/* 2. BALANCED TWO-COLUMN RESPONSIVE LAYOUT */}
      <main className="w-full max-w-7xl mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-6">
        {/* ================= LEFT COLUMN: LESSON INFORMATION, SELVI MENTOR & CONTROLS ================= */}
        <section className="lg:col-span-7 flex flex-col gap-4 order-2 lg:order-1">
          {/* Card 1: Lesson Overview Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden text-left">
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-red-600/20 text-red-300 border border-red-500/30">
                {currentMeta.badge[language] || currentMeta.badge.en}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{currentMeta.estimatedMinutes} mins</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2 flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-red-600 text-white shrink-0 shadow-md">
                {renderLessonIcon(currentMeta.iconName, 'w-5 h-5')}
              </span>
              <span>{currentLesson.title[language] || currentLesson.title.en}</span>
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              {currentLesson.description[language] || currentLesson.description.en}
            </p>
          </div>

          {/* Card 2: Selvi Mascot Mentor Speech Bubble */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border-2 border-amber-500/40 rounded-3xl p-5 shadow-2xl flex flex-col sm:flex-row items-center sm:items-start gap-4 text-left">
            {/* Mascot Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border-2 border-amber-400/50 flex items-center justify-center overflow-hidden shadow-xl">
                <Image
                  src="/mascot/idle.png"
                  alt="Selvi Security Mentor"
                  width={72}
                  height={72}
                  className="object-contain"
                  priority
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white fill-current" />
              </span>
            </div>

            {/* Speech Bubble */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>{t.selviMentor}</span>
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-medium">
                  Voice Active
                </span>
              </div>

              <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-amber-500/20 text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                "{currentLesson.scammerSpeech[language] || currentLesson.scammerSpeech.en}"
              </div>

              <p className="text-[11px] text-amber-200/90 font-medium">
                👉 Follow the on-screen simulated drill on the right. You can practice as many times as you need!
              </p>
            </div>
          </div>

          {/* Card 3: Red Flags Breakdown & Golden Rule Alert */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Red Flag Warning */}
            <div className="bg-red-950/40 border border-red-800/60 rounded-2xl p-4 text-left space-y-1.5 shadow-lg">
              <span className="text-[10px] font-extrabold text-red-400 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>{t.redFlagsTitle}</span>
              </span>
              <p className="text-xs text-red-200 leading-snug font-medium">
                {currentLesson.redFlagNote[language] || currentLesson.redFlagNote.en}
              </p>
            </div>

            {/* Golden Rule Highlight */}
            <div className="bg-amber-400 text-slate-950 rounded-2xl p-4 text-left space-y-1 shadow-lg">
              <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1 text-slate-900">
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                <span>{t.goldenRuleBadge}</span>
              </span>
              <p className="text-xs font-extrabold leading-snug">
                {currentLesson.goldenRule[language] || currentLesson.goldenRule.en}
              </p>
            </div>
          </div>

          {/* Card 4: Navigation & Action Controls Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousLesson}
                disabled={currentStep === 1}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border cursor-pointer ${
                  currentStep === 1
                    ? 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
                title={t.prevLesson}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.prevLesson}</span>
              </button>

              <button
                onClick={handleReplayDemo}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
                title={t.replayDemo}
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.replayDemo}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSkipLesson}
                className="px-3 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 text-xs font-bold flex items-center gap-1.5 transition border border-purple-800/60 cursor-pointer"
                title={t.skipLesson}
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span>{t.skipLesson}</span>
              </button>

              <button
                onClick={handleNextLesson}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold flex items-center gap-1.5 transition shadow-lg cursor-pointer active:scale-95 border border-red-400"
                title={t.nextLesson}
              >
                <span>{t.nextLesson}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Helpline Note */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-2">
            <span>🛡️ FirstTap Digital Literacy & Fraud Defense</span>
            <span>National Cyber Crime Helpline: <strong>1930</strong></span>
          </div>
        </section>

        {/* ================= RIGHT COLUMN: INTERACTIVE SIMULATOR ================= */}
        <section className="lg:col-span-5 flex flex-col items-center justify-center sticky top-4 order-1 lg:order-2 w-full">
          <div key={`${currentStep}_${simulatorResetKey}`} className="w-full flex justify-center">
            {/* Lessons 1, 2, 3, 4, 7: Interactive Call Simulator */}
            {(currentStep === 1 ||
              currentStep === 2 ||
              currentStep === 3 ||
              currentStep === 4 ||
              currentStep === 7) && (
              <CallSimulator
                lesson={currentLesson}
                language={language}
                onLessonComplete={handleLessonComplete}
                onNextLesson={handleNextLesson}
                onBackToPath={handleExit}
              />
            )}

            {/* Lesson 5: Interactive SMS / WhatsApp Message Simulator */}
            {currentStep === 5 && (
              <MessageSimulator
                lesson={currentLesson}
                language={language}
                onLessonComplete={handleLessonComplete}
                onNextLesson={handleNextLesson}
                onBackToPath={handleExit}
              />
            )}

            {/* Lesson 6: Interactive UPI Collect Request Simulator */}
            {currentStep === 6 && (
              <UpiSimulator
                lesson={currentLesson}
                language={language}
                onLessonComplete={handleLessonComplete}
                onNextLesson={handleNextLesson}
                onBackToPath={handleExit}
              />
            )}

            {/* Lesson 8: Final Fraud-Safety Challenge Assessment */}
            {currentStep === 8 && (
              <ChallengeSimulator
                language={language}
                onComplete={(score) => {
                  handleLessonComplete();
                }}
                onBackToPath={handleExit}
              />
            )}
          </div>
        </section>
      </main>

      {/* ================= 3. ALL LESSONS DRAWER / MODAL ================= */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between text-left">
              <div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                  <span>{t.menuTitle}</span>
                </h3>
                <p className="text-xs text-slate-400">{t.menuSubtitle}</p>
              </div>

              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Lesson List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 text-left">
              {ALL_FRAUD_LESSONS.map((l) => {
                const meta = SPAM_PATH_LESSON_METAS[l.id as SpamStepId];
                const isSelected = l.id === currentStep;
                const isDone = completed.includes(l.id as SpamStepId);
                const isSkip = skipped.includes(l.id as SpamStepId);

                return (
                  <button
                    key={l.id}
                    onClick={() => handleSelectLesson(l.id as SpamStepId)}
                    className={`w-full p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 text-left cursor-pointer active:scale-98 ${
                      isSelected
                        ? 'border-red-500 bg-red-950/40 shadow-lg'
                        : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected
                            ? 'bg-red-600 text-white'
                            : isDone
                            ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                            : isSkip
                            ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {renderLessonIcon(meta?.iconName || 'ShieldAlert', 'w-4 h-4')}
                      </span>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-white">
                            {l.title[language] || l.title.en}
                          </h4>
                          {isSelected && (
                            <span className="text-[9px] bg-red-600 text-white font-extrabold px-1.5 py-0.2 rounded">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
                          {l.description[language] || l.description.en}
                        </p>
                      </div>
                    </div>

                    {/* Status badge */}
                    <div className="shrink-0">
                      {isDone ? (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>{t.statusCompleted}</span>
                        </span>
                      ) : isSkip ? (
                        <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <RotateCcw className="w-3 h-3 text-purple-400" />
                          <span>{t.statusSkipped}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-medium">
                          {t.statusNotStarted}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 flex justify-between items-center text-xs">
              <span className="text-slate-400">
                Completed: <strong>{completed.length} / 8</strong>
              </span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
