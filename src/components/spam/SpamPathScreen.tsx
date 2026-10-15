'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  AlertTriangle,
  Award,
  Volume2,
  VolumeX,
  ArrowRight,
  HelpCircle,
  Clock,
  PhoneOff,
  MessageSquare,
  KeyRound,
  Crown,
  Compass,
} from 'lucide-react';
import {
  PrimaryCategory,
  SupportedLanguage,
  SpamProgress,
} from '@/types';
import { SpamStepId, SpamLanguageCode } from './types';
import {
  SPAM_LESSONS,
  getRecommendedSpamSequence,
} from './spamCatalog';
import { SPAM_PATH_LESSON_METAS } from './fraudCurriculum';
import { spamVoiceManager } from './voice';
import Image from 'next/image';

interface SpamPathScreenProps {
  language: SupportedLanguage | SpamLanguageCode;
  category?: PrimaryCategory | null;
  progress?: SpamProgress | null;
  completedSteps?: SpamStepId[];
  skippedSteps?: SpamStepId[];
  currentStepId?: SpamStepId;
  learnerName?: string;
  onSelectStep: (stepId: SpamStepId) => void;
  onBack: () => void;
  onOpenDoubt?: (context?: string) => void;
}

const UI_TEXT = {
  en: {
    heading: 'Digital Safety Quest',
    adventureTheme: 'Cyber Fraud Defense Quest',
    subheading: 'Master spotting phone scams, SMS phishing traps, UPI fraud, and fake customer care on an interactive adventure trail',
    backToDashboard: 'Back to Dashboard',
    completedCount: '{completed} of 8 completed',
    skippedBadge: '{skipped} Skipped (Tap to retry)',
    allDoneBanner: '🎉 Outstanding! You have mastered all 8 Spam & Digital Fraud Safety lessons!',
    resumeActive: 'Continue Quest',
    startLearning: 'Start Lesson',
    reviewLesson: 'Review Lesson',
    retryLesson: 'Retry Lesson',
    statusCompleted: 'Completed',
    statusCurrent: 'In Progress',
    statusSkipped: 'Skipped',
    statusNotStarted: 'Not Started',
    selviAdvice: 'Welcome {name} to your Digital Safety Quest! Real banks and government officers will never ask for your ATM PIN, OTP, or remote screen access. Tap any stepping stone below to begin.',
    trackBadge: 'Personalized 8-Lesson Trail',
    minuteShort: 'min',
    skillsLabel: 'Cyber Safety Mentor',
    milestoneMid: 'Halfway Defender Milestone!',
    milestoneFinal: 'Final Fraud-Safety Challenge Crown!',
    askSelvi: 'Ask Selvi',
    helplineText: 'National Cyber Crime Helpline: 1930',
    stepPill: 'Lesson {num} of 8',
    continueCta: 'Continue to Lesson {num}',
  },
  ta: {
    heading: 'டிஜிட்டல் பாதுகாப்பு வேட்டை',
    adventureTheme: 'சைபர் மோசடி தடுப்பு சாகசம் (Digital Safety Quest)',
    subheading: 'போலி வங்கி அழைப்புகள், எஸ்.எம்.எஸ் பொறிகள், யுபிஐ மோசடிகள் மற்றும் உதவி எண்களைக் கண்டறியும் நேரடி விளையாட்டுப் பாதை',
    backToDashboard: 'டாஷ்போர்டுக்கு திரும்பு',
    completedCount: '8-ல் {completed} பாடங்கள் முடிந்தது',
    skippedBadge: '{skipped} தவிர்க்கப்பட்டது (மீண்டும் பழகலாம்)',
    allDoneBanner: '🎉 அற்புதம்! 8 சைபர் மோசடி பாதுகாப்புப் பாடங்களையும் வெற்றிகரமாக முடித்துவிட்டீர்கள்!',
    resumeActive: 'வேட்டையைத் தொடரவும்',
    startLearning: 'பாடத்தைத் தொடங்கு',
    reviewLesson: 'மீண்டும் பார்',
    retryLesson: 'மீண்டும் முயற்சி',
    statusCompleted: 'முடிந்தது',
    statusCurrent: 'செயலில் உள்ளது',
    statusSkipped: 'தவிர்க்கப்பட்டது',
    statusNotStarted: 'தொடங்கவில்லை',
    selviAdvice: 'வணக்கம் {name}! உங்கள் டிஜிட்டல் பாதுகாப்பு சாகசத்திற்கு நல்வரவு! உண்மையான வங்கி அதிகாரிகள் ஒருபோதும் ஏடிஎம் பின், OTP அல்லது ஸ்கிரீன் ஷேர் கேட்க மாட்டார்கள். கீழே உள்ள பாதையில் உள்ள கல்லைத் தொட்டுப் பயிற்சியைத் தொடங்குங்கள்.',
    trackBadge: '8 பாடங்கள் கொண்ட பாதுகாப்புப் பாதை',
    minuteShort: 'நிமிடம்',
    skillsLabel: 'சைபர் பாதுகாப்பு வழிகாட்டி',
    milestoneMid: 'பாதி வழி எட்டிய பாதுகாப்பு மைல்கல்!',
    milestoneFinal: 'இறுதி வினாடி வினா மகுடம்!',
    askSelvi: 'செல்வி உதவி',
    helplineText: 'தேசிய சைபர் கிரைம் உதவி எண்: 1930',
    stepPill: 'பாடம் {num} / 8',
    continueCta: 'பாடம் {num}-க்குச் செல்',
  },
  hi: {
    heading: 'डिजिटल सुरक्षा क्वेस्ट',
    adventureTheme: 'साइबर फ्रॉड सुरक्षा अभियान (Digital Safety Quest)',
    subheading: 'फर्जी बैंक कॉल, एसएमएस लिंक, यूपीआई फ्रॉड और कस्टमर केयर घोटालों से बचाव एक मजेदार ट्रेल पर सीखें',
    backToDashboard: 'डैशबोर्ड पर वापस',
    completedCount: '8 में से {completed} पाठ पूरे हुए',
    skippedBadge: '{skipped} छोड़े गए (पुनः प्रयास करें)',
    allDoneBanner: '🎉 शाबाश! आपने सभी 8 डिजिटल सुरक्षा पाठ सफलतापूर्वक पूरे कर लिए हैं!',
    resumeActive: 'क्वेस्ट जारी रखें',
    startLearning: 'पाठ शुरू करें',
    reviewLesson: 'फिर से देखें',
    retryLesson: 'पुनः प्रयास करें',
    statusCompleted: 'पूरा हुआ',
    statusCurrent: 'चालू',
    statusSkipped: 'छोड़ा गया',
    statusNotStarted: 'शुरू नहीं हुआ',
    selviAdvice: 'नमस्ते {name}! आपके डिजिटल सुरक्षा अभियान में स्वागत है! असली बैंक या सरकारी अधिकारी कभी फोन पर पिन या ओटीपी नहीं मांगते। अभ्यास शुरू करने के लिए नीचे दिए गए स्टेप पर टैप करें।',
    trackBadge: '8-पाठ सुरक्षा ट्रेल',
    minuteShort: 'मिनट',
    skillsLabel: 'सुरक्षा सलाहकार',
    milestoneMid: 'आधा सफर पूरा - मजबूत रक्षक!',
    milestoneFinal: 'अंतिम साइबर सुरक्षा महा-चुनौती!',
    askSelvi: 'सेलवी सहायता',
    helplineText: 'राष्ट्रीय साइबर अपराध हेल्पलाइन: 1930',
    stepPill: 'पाठ {num} / 8',
    continueCta: 'पाठ {num} शुरू करें',
  },
};

const TRAIL_OFFSETS = [
  { desktopX: 0, mobileX: 0, side: 'center' },
  { desktopX: -120, mobileX: -36, side: 'left' },
  { desktopX: -60, mobileX: -18, side: 'left' },
  { desktopX: 60, mobileX: 18, side: 'right' },
  { desktopX: 130, mobileX: 38, side: 'right' },
  { desktopX: 30, mobileX: 10, side: 'center' },
  { desktopX: -100, mobileX: -30, side: 'left' },
  { desktopX: 0, mobileX: 0, side: 'center' },
];

export const SpamPathScreen: React.FC<SpamPathScreenProps> = ({
  language = 'en',
  category = 'DIGITAL_BEGINNER',
  progress,
  completedSteps = [],
  skippedSteps = [],
  currentStepId,
  learnerName = '',
  onSelectStep,
  onBack,
  onOpenDoubt,
}) => {
  const [isMascotSpeaking, setIsMascotSpeaking] = useState<boolean>(false);

  const langKey: 'ta' | 'hi' | 'en' = language.startsWith('ta')
    ? 'ta'
    : language.startsWith('hi')
    ? 'hi'
    : 'en';
  const t = UI_TEXT[langKey] || UI_TEXT.en;

  const sequence = getRecommendedSpamSequence(category || 'DIGITAL_BEGINNER');
  const completedList = progress?.completed_steps || completedSteps;
  const skippedList = progress?.skipped_steps || skippedSteps;
  const completedCount = completedList.length;
  const progressPercent = Math.min(100, Math.round((completedCount / 8) * 100));
  const isAllCompleted = completedCount >= 8;

  // Active / Recommended next node
  const activeStepId: SpamStepId =
    currentStepId ||
    sequence.find((s) => !completedList.includes(s) && !skippedList.includes(s)) ||
    sequence.find((s) => !completedList.includes(s)) ||
    1;

  const activeIndex = sequence.indexOf(activeStepId);
  const activeStepNum = activeIndex >= 0 ? activeIndex + 1 : 1;

  // Stop voice on unmount
  useEffect(() => {
    return () => {
      spamVoiceManager.stop();
    };
  }, []);

  const handlePlaySelviIntro = () => {
    if (isMascotSpeaking) {
      spamVoiceManager.stop();
      setIsMascotSpeaking(false);
      return;
    }

    const introSpeech =
      langKey === 'ta'
        ? `வணக்கம் ${learnerName || ''}! உங்கள் டிஜிட்டல் பாதுகாப்பு சாகசத்திற்கு நல்வரவு! உண்மையான வங்கி அதிகாரிகள் ஒருபோதும் ஏடிஎம் பின், OTP அல்லது ஸ்கிரீன் ஷேர் கேட்க மாட்டார்கள். கீழே உள்ள பாதையில் உள்ள கல்லைத் தொட்டுப் பயிற்சியைத் தொடங்குங்கள்.`
        : langKey === 'hi'
        ? `नमस्ते ${learnerName || ''}! आपके डिजिटल सुरक्षा अभियान में स्वागत है! असली बैंक कभी फोन पर पिन या ओटीपी नहीं मांगते। अभ्यास शुरू करने के लिए नीचे दिए गए स्टेप पर टैप करें।`
        : `Welcome ${learnerName || 'friend'} to your Digital Safety Quest! Real banks will never ask for your ATM PIN, OTP, or remote screen access. Follow the winding adventure trail below to practice defense drills.`;

    setIsMascotSpeaking(true);
    spamVoiceManager.speak(introSpeech, langKey);
    setTimeout(() => {
      setIsMascotSpeaking(false);
    }, 7000);
  };

  const renderLessonIcon = (iconName: string, className = 'w-7 h-7 sm:w-8 sm:h-8') => {
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
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0A0F1D] text-slate-100 flex flex-col font-sans select-none pb-20">
      {/* 1. TOP STICKY BAR */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-red-900/60 shadow-lg px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => {
              spamVoiceManager.stop();
              onBack();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold transition cursor-pointer border border-slate-700 shadow-xs active:scale-95"
            title={t.backToDashboard}
          >
            <ArrowLeft className="w-4 h-4 text-slate-300" />
            <span className="hidden sm:inline">{t.backToDashboard}</span>
            <span className="sm:hidden">{langKey === 'ta' ? 'பின்செல்' : 'Back'}</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Progress badge */}
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-950/80 border border-red-700 text-red-200 text-xs font-black shadow-xs">
              <Trophy className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{completedCount}/8</span>
            </span>

            {/* Ask Selvi */}
            {onOpenDoubt && (
              <button
                onClick={() => {
                  spamVoiceManager.stop();
                  onOpenDoubt('Spam & Fraud Safety overview');
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold transition cursor-pointer shadow-xs active:scale-95 border border-red-400"
                title="Ask Selvi"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{t.askSelvi}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. MAIN ADVENTURE CONTAINER */}
      <main className="max-w-4xl mx-auto w-full px-4 pt-4 sm:pt-6 flex-1 flex flex-col items-center">
        {/* HERO SECTION */}
        <section className="w-full bg-gradient-to-br from-red-950 via-slate-900 to-amber-950 p-5 sm:p-6 rounded-3xl shadow-2xl border-2 border-red-500/50 relative overflow-hidden mb-8 text-left">
          {/* Ambient glow */}
          <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-red-600/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-amber-400/15 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 justify-between">
            <div className="space-y-1.5 flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-900/80 border border-red-500/50 text-xs font-extrabold text-red-200">
                <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>{t.adventureTheme}</span>
              </div>

              <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                {t.heading}
              </h1>

              <p className="text-xs sm:text-sm text-red-100/90 leading-relaxed max-w-xl">
                {t.subheading}
              </p>
            </div>

            {/* Selvi Mascot Interactive Avatar */}
            <div className="flex flex-col items-center shrink-0">
              <button
                onClick={handlePlaySelviIntro}
                className="relative group cursor-pointer focus:outline-hidden"
                title="Hear Selvi guide your security quest"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-400/20 p-1 border-2 border-amber-400 shadow-xl group-hover:scale-105 transition-transform overflow-hidden">
                  <Image
                    src="/mascot/idle.png"
                    alt="Selvi Security Mentor"
                    width={72}
                    height={72}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-amber-400 text-slate-950 shadow-md">
                  {isMascotSpeaking ? (
                    <VolumeX className="w-3.5 h-3.5" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                </div>
              </button>
              <span className="text-[10px] text-amber-300 font-bold mt-1">Selvi Mentor</span>
            </div>
          </div>

          {/* Speech bubble */}
          <div className="relative z-10 mt-3 p-3 rounded-2xl bg-black/40 border border-red-500/30 text-xs sm:text-sm text-red-100 leading-snug font-medium">
            &ldquo;{t.selviAdvice.replace('{name}', learnerName || (langKey === 'ta' ? 'தோழரே' : 'Friend'))}&rdquo;
          </div>

          {/* Progress summary bar & CTA */}
          <div className="relative z-10 mt-4 bg-black/50 p-3.5 rounded-2xl border border-red-500/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex-1 w-full space-y-1">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-amber-300 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{t.completedCount.replace('{completed}', completedCount.toString())}</span>
                </span>
                <span className="text-red-200 font-mono text-xs">{progressPercent}%</span>
              </div>

              {/* Progress bar */}
              <div className="h-3 w-full bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-red-800/60 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Primary Action Button */}
            {!isAllCompleted && (
              <button
                onClick={() => {
                  spamVoiceManager.stop();
                  onSelectStep(activeStepId);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs sm:text-sm shadow-xl transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0 border border-red-400"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{t.continueCta.replace('{num}', String(activeStepNum))}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </section>

        {/* 3. FIRSTTAP DIGITAL ADVENTURE: WINDING TRAIL LAYOUT */}
        <section className="w-full max-w-3xl flex flex-col items-center py-4 relative">
          <div className="w-full space-y-10 sm:space-y-14 relative">
            {sequence.map((stepId, index) => {
              const meta = SPAM_PATH_LESSON_METAS[stepId];
              const isCompleted = completedList.includes(stepId);
              const isSkipped = skippedList.includes(stepId);
              const isActive = stepId === activeStepId && !isCompleted;
              const isNotStarted = !isCompleted && !isSkipped && !isActive;

              const sequenceNum = index + 1;
              const isMidpoint = index === 3;
              const isFinal = index === 7;
              const offset = TRAIL_OFFSETS[index % TRAIL_OFFSETS.length];

              const actionLabel = isCompleted
                ? t.reviewLesson
                : isSkipped
                ? t.retryLesson
                : isActive
                ? t.startLearning
                : t.startLearning;

              return (
                <React.Fragment key={stepId}>
                  {/* Midpoint Checkpoint Milestone Banner */}
                  {isMidpoint && (
                    <div className="w-full flex justify-center py-2 animate-in fade-in duration-300">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs shadow-lg border-2 border-white">
                        <Award className="w-4 h-4 text-slate-950" />
                        <span>{t.milestoneMid}</span>
                      </div>
                    </div>
                  )}

                  {/* Adventure Trail Step Item */}
                  <div className="relative flex flex-col items-center">
                    {/* SVG Connector Trail Line */}
                    {index > 0 && (
                      <div className="absolute -top-10 sm:-top-14 h-10 sm:h-14 w-1 flex justify-center pointer-events-none">
                        <div
                          className={`w-1.5 h-full rounded-full transition-all duration-300 ${
                            isCompleted
                              ? 'bg-emerald-500 shadow-sm'
                              : 'border-l-2 border-dashed border-red-500/80'
                          }`}
                        />
                      </div>
                    )}

                    {/* Stepping Stone Node with Responsive Horizontal Offset */}
                    <div
                      className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 transition-transform duration-300"
                      style={{
                        transform: `translateX(${
                          typeof window !== 'undefined' && window.innerWidth >= 640
                            ? offset.desktopX
                            : offset.mobileX
                        }px)`,
                      }}
                    >
                      {/* DUOLINGO-STYLE 3D CIRCULAR STEPPING STONE */}
                      <div className="relative flex flex-col items-center shrink-0">
                        {/* Active Beacon Tooltip Floating Above */}
                        {isActive && (
                          <div className="absolute -top-9 z-30 animate-bounce">
                            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-lg border-2 border-white whitespace-nowrap">
                              {langKey === 'ta' ? 'பாதுகாப்புப் பயிற்சி!' : 'DEFEND HERE!'}
                            </span>
                            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-red-600 mx-auto" />
                          </div>
                        )}

                        <button
                          onClick={() => {
                            spamVoiceManager.stop();
                            onSelectStep(stepId);
                          }}
                          className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center font-black transition-all cursor-pointer active:scale-95 active:translate-y-1 group ${
                            isCompleted
                              ? 'bg-gradient-to-b from-emerald-500 to-teal-700 text-white border-b-[6px] border-emerald-900 shadow-xl shadow-emerald-600/30 hover:brightness-110'
                              : isActive
                              ? 'bg-gradient-to-b from-red-500 to-red-700 text-white border-b-[6px] border-red-950 shadow-2xl shadow-red-600/50 ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-900 hover:brightness-110'
                              : isSkipped
                              ? 'bg-gradient-to-b from-purple-500 to-purple-700 text-white border-b-[6px] border-purple-900 shadow-lg hover:brightness-105'
                              : 'bg-gradient-to-b from-slate-800 to-slate-900 text-slate-300 border-b-[6px] border-slate-950 shadow-lg hover:border-slate-700'
                          }`}
                          title={`Open ${meta.title[langKey]}`}
                        >
                          {/* Inner Icon */}
                          <div className="group-hover:scale-110 transition-transform">
                            {renderLessonIcon(meta.iconName)}
                          </div>

                          {/* Step Number Badge */}
                          <div
                            className={`absolute -top-1.5 -left-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full text-xs font-black flex items-center justify-center shadow-md border-2 border-white ${
                              isCompleted
                                ? 'bg-emerald-700 text-white'
                                : isActive
                                ? 'bg-amber-400 text-slate-950 font-black'
                                : 'bg-slate-700 text-white'
                            }`}
                          >
                            {sequenceNum}
                          </div>

                          {/* Completed Trophy / Crown Badge */}
                          {isCompleted && (
                            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md border-2 border-white">
                              <Crown className="w-4 h-4 fill-slate-950" />
                            </div>
                          )}

                          {/* Skipped Badge */}
                          {isSkipped && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md border-2 border-white">
                              <RotateCcw className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </button>
                      </div>

                      {/* COMPACT FLOATING ADVENTURE CARD BESIDE NODE */}
                      <div
                        className={`w-full max-w-xs sm:max-w-sm rounded-3xl p-4 transition-all duration-300 shadow-md border text-left ${
                          isActive
                            ? 'bg-slate-900 border-2 border-red-500 shadow-2xl ring-2 ring-red-400/40'
                            : isCompleted
                            ? 'bg-slate-900/90 border-2 border-emerald-500/70 shadow-lg'
                            : isSkipped
                            ? 'bg-slate-900/90 border-2 border-purple-500/70'
                            : 'bg-slate-900/70 border border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-red-300 bg-red-950/80 px-2 py-0.5 rounded-md border border-red-800/60">
                            {meta.code} · {t.stepPill.replace('{num}', String(sequenceNum))}
                          </span>

                          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{meta.estimatedMinutes} {t.minuteShort}</span>
                          </span>
                        </div>

                        <h3 className="text-sm font-extrabold text-white leading-snug mb-1">
                          {meta.title[langKey]}
                        </h3>

                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                          {meta.description[langKey]}
                        </p>

                        <button
                          onClick={() => {
                            spamVoiceManager.stop();
                            onSelectStep(stepId);
                          }}
                          className={`w-full py-2 px-3 rounded-xl font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                            isCompleted
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              : isActive
                              ? 'bg-red-600 hover:bg-red-500 text-white ring-2 ring-red-400'
                              : isSkipped
                              ? 'bg-purple-700 hover:bg-purple-600 text-white'
                              : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                          }`}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{actionLabel}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};
