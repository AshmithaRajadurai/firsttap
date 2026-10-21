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
  Phone,
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
import { AskSelviModal } from '@/components/whatsapp/AskSelviModal';
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
    trackBadge: '8-Lesson Cyber Defense Trail',
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
    selviAdvice: 'नमस्ते {name}! आपके डिजिटल सुरक्षा अभियान में स्वागत है! असली बैंक कभी फोन पर पिन या ओटीपी नहीं मांगते। अभ्यास शुरू करने के लिए नीचे दिए गए स्टेप पर टैप करें।',
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
  const [isSelviOpen, setIsSelviOpen] = useState<boolean>(false);

  const [activeLang, setActiveLang] = useState<'ta' | 'hi' | 'en'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('firsttap_preferred_language');
      if (saved === 'ta-IN') return 'ta';
      if (saved === 'hi-IN') return 'hi';
      if (saved === 'en-IN') return 'en';
    }
    return language.startsWith('ta') ? 'ta' : language.startsWith('hi') ? 'hi' : 'en';
  });

  useEffect(() => {
    const k = language.startsWith('ta') ? 'ta' : language.startsWith('hi') ? 'hi' : 'en';
    setActiveLang(k);
  }, [language]);

  const handleLanguageChange = (newLang: 'ta' | 'hi' | 'en') => {
    spamVoiceManager.stop();
    setActiveLang(newLang);
    if (typeof window !== 'undefined') {
      const fullCode = newLang === 'ta' ? 'ta-IN' : newLang === 'hi' ? 'hi-IN' : 'en-IN';
      localStorage.setItem('firsttap_preferred_language', fullCode);
    }
  };

  const langKey = activeLang;
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
    <div className="relative min-h-screen bg-gradient-to-b from-[#FFF5F5] via-[#FFF9F9] to-[#FDF2F2] text-slate-900 flex flex-col font-sans select-none pb-20">
      {/* 1. TOP STICKY APP-LIKE HEADER BAR (LIGHT THEME) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-200/80 px-4 py-2.5 sm:py-3 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          {/* Back to Dashboard */}
          <button
            onClick={() => {
              spamVoiceManager.stop();
              onBack();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold border border-slate-300 shadow-xs active:scale-95 transition cursor-pointer min-h-[44px]"
            title="Return to FirstTap Dashboard"
          >
            <ArrowLeft className="w-4 h-4 text-slate-700" />
            <span className="hidden xs:inline">{t.backToDashboard}</span>
            <span className="xs:hidden">←</span>
          </button>

          {/* Center Title Badge */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 text-white flex items-center justify-center font-black shadow-xs">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h2 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                {t.heading}
              </h2>
              <span className="text-[10px] text-rose-700 block font-bold">
                {t.trackBadge}
              </span>
            </div>
          </div>

          {/* Right Header Status */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex items-center bg-rose-100 dark:bg-rose-950/80 rounded-full p-0.5 border border-rose-300 dark:border-rose-700">
              <button
                onClick={() => handleLanguageChange('ta')}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  activeLang === 'ta'
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'text-rose-900 dark:text-rose-300 hover:text-rose-950'
                }`}
                title="தமிழ் (Tamil)"
              >
                தமிழ்
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  activeLang === 'en'
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'text-rose-900 dark:text-rose-300 hover:text-rose-950'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageChange('hi')}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  activeLang === 'hi'
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'text-rose-900 dark:text-rose-300 hover:text-rose-950'
                }`}
                title="हिंदी (Hindi)"
              >
                हिंदी
              </button>
            </div>

            {/* Completed badge */}
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 border border-rose-300 text-rose-950 text-xs font-black shadow-2xs">
              <Trophy className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>{completedCount}/8</span>
            </span>

            {/* Ask Selvi */}
            <button
              onClick={() => {
                spamVoiceManager.stop();
                setIsSelviOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-extrabold transition cursor-pointer shadow-xs active:scale-95 border border-rose-600 min-h-[40px]"
              title="Ask Selvi"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">{t.askSelvi}</span>
              <span className="sm:hidden">{langKey === 'ta' ? 'உதவி' : 'Help'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN ADVENTURE CONTAINER */}
      <main className="max-w-4xl mx-auto w-full px-4 pt-4 sm:pt-6 flex-1 flex flex-col items-center">
        {/* HERO SECTION: RICH, WARM & ENGAGING */}
        <section className="w-full bg-gradient-to-br from-[#881337] via-[#9F1239] to-[#4C0519] text-white p-5 sm:p-6 rounded-3xl shadow-xl border-2 border-rose-400/50 relative overflow-hidden mb-6 text-left">
          {/* Ambient glows */}
          <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-rose-400/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 justify-between">
            <div className="space-y-1.5 flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-400/60 text-xs font-extrabold text-rose-200">
                <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>{t.adventureTheme}</span>
              </div>

              <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                {t.heading}
              </h1>

              <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed max-w-xl font-medium">
                {t.subheading}
              </p>
            </div>

            {/* Selvi Avatar */}
            <div className="flex flex-col items-center shrink-0">
              <button
                onClick={handlePlaySelviIntro}
                className="relative group cursor-pointer focus:outline-hidden"
                title="Hear Selvi guide your security quest"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-400/20 p-1 border-2 border-amber-400 shadow-xl group-hover:scale-105 transition-transform overflow-hidden">
                  <Image
                    src="/mascot/welcome.png"
                    alt="Selvi"
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
          <div className="relative z-10 mt-3 p-3 rounded-2xl bg-black/30 border border-rose-400/40 text-xs sm:text-sm text-rose-100 leading-snug font-medium">
            &ldquo;{t.selviAdvice.replace('{name}', learnerName || (langKey === 'ta' ? 'தோழரே' : langKey === 'hi' ? 'साथी' : 'Friend'))}&rdquo;
          </div>

          {/* Progress summary bar & CTA */}
          <div className="relative z-10 mt-4 bg-black/40 p-3.5 rounded-2xl border border-rose-400/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex-1 w-full space-y-1">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-amber-300 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{t.completedCount.replace('{completed}', completedCount.toString())}</span>
                </span>
                <span className="text-rose-200 font-mono text-xs">{progressPercent}%</span>
              </div>

              {/* Progress bar */}
              <div className="h-3 w-full bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-rose-500/60 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-amber-300 via-amber-400 to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
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
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0 border border-amber-200 min-h-[44px]"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{t.continueCta.replace('{num}', String(activeStepNum))}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </section>

        {/* 2.1 NATIONAL HELPLINE BANNER (LIGHT THEME) */}
        <div className="w-full max-w-4xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border-2 border-rose-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600 shrink-0">
              <Phone className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-slate-900">
                  {t.helplineText}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                  Toll-Free 24x7
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                {langKey === 'ta'
                  ? 'பணம் இழந்த 24 மணி நேரத்திற்குள் 1930 எண்ணை அழைத்து பணப் பரிமாற்றத்தை முடக்கலாம்'
                  : langKey === 'hi'
                  ? 'पैसे कटने के 24 घंटे के भीतर 1930 डायल करके तुरंत ट्रांजेक्शन रुकवाएं'
                  : 'Call 1930 within golden hour to freeze fraudulent bank transfers · cybercrime.gov.in'}
              </p>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-semibold">
            MHA Gov of India
          </span>
        </div>

        {/* 3. FIRSTTAP DIGITAL ADVENTURE: WINDING TRAIL LAYOUT (LIGHT THEME) */}
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
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-black text-xs shadow-lg border-2 border-white">
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
                              ? 'bg-emerald-500 shadow-xs'
                              : 'border-l-2 border-dashed border-rose-300'
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
                      {/* DUOLINGO-STYLE 3D CIRCULAR STEPPING STONE (LIGHT THEME) */}
                      <div className="relative flex flex-col items-center shrink-0">
                        {/* Active Beacon Tooltip Floating Above */}
                        {isActive && (
                          <div className="absolute -top-9 z-30 animate-bounce">
                            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-lg border-2 border-white whitespace-nowrap">
                              {langKey === 'ta' ? 'பாதுகாப்புப் பயிற்சி!' : langKey === 'hi' ? 'सुरक्षा ड्रिल!' : 'DEFEND HERE!'}
                            </span>
                            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-amber-400 mx-auto" />
                          </div>
                        )}

                        <button
                          onClick={() => {
                            spamVoiceManager.stop();
                            onSelectStep(stepId);
                          }}
                          className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center font-black transition-all cursor-pointer active:scale-95 active:translate-y-1 group ${
                            isCompleted
                              ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-white border-b-[6px] border-emerald-800 shadow-xl shadow-emerald-500/20 hover:brightness-110'
                              : isActive
                              ? 'bg-gradient-to-b from-rose-500 via-red-500 to-rose-600 text-white border-b-[6px] border-rose-800 shadow-2xl shadow-rose-500/30 ring-4 ring-amber-400 ring-offset-2 ring-offset-rose-50 hover:brightness-110'
                              : isSkipped
                              ? 'bg-gradient-to-b from-purple-400 to-purple-600 text-white border-b-[6px] border-purple-800 shadow-lg hover:brightness-105'
                              : 'bg-gradient-to-b from-white to-slate-100 text-slate-700 border-b-[6px] border-slate-300 shadow-md hover:border-slate-400'
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
                                : 'bg-slate-200 text-slate-700'
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

                      {/* ADVENTURE CARD: LESSON METADATA (LIGHT THEME MATCHING WHATSAPP/BUSINESS) */}
                      <div
                        className={`w-full max-w-md p-4 sm:p-5 rounded-3xl border-2 transition-all duration-300 text-left shadow-md ${
                          isCompleted
                            ? 'bg-emerald-50/90 border-2 border-emerald-300 hover:border-emerald-400 shadow-sm'
                            : isActive
                            ? 'bg-white border-2 border-rose-500 shadow-xl ring-2 ring-rose-400/30'
                            : isSkipped
                            ? 'bg-purple-50/90 border-2 border-purple-300 shadow-sm'
                            : 'bg-white/95 border border-slate-200 shadow-sm hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                              {meta.code} · {t.stepPill.replace('{num}', String(sequenceNum))}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>
                                {meta.estimatedMinutes} {t.minuteShort}
                              </span>
                            </span>
                          </div>

                          {/* Status Label */}
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : isActive
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : isSkipped
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {isCompleted
                              ? t.statusCompleted
                              : isActive
                              ? t.statusCurrent
                              : isSkipped
                              ? t.statusSkipped
                              : t.statusNotStarted}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                          {meta.title[langKey]}
                        </h3>

                        <p className="text-xs text-slate-600 leading-relaxed mt-1 font-medium">
                          {meta.description[langKey]}
                        </p>

                        {/* Golden Rule Callout Box */}
                        {meta.goldenRule && (
                          <div className="mt-3 p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-[11px] text-amber-950 font-medium flex items-start gap-2">
                            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <span>{meta.goldenRule[langKey]}</span>
                          </div>
                        )}

                        {/* Primary CTA Button */}
                        <button
                          onClick={() => {
                            spamVoiceManager.stop();
                            onSelectStep(stepId);
                          }}
                          className={`w-full mt-4 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                            isCompleted
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              : isActive
                              ? 'bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black shadow-lg shadow-rose-600/20'
                              : isSkipped
                              ? 'bg-purple-600 hover:bg-purple-500 text-white'
                              : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-900'
                          }`}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{actionLabel}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Final Milestone Challenge Crown Banner */}
                  {isFinal && (
                    <div className="w-full flex justify-center py-4 animate-in fade-in duration-300">
                      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl border-2 border-white">
                        <Crown className="w-5 h-5 text-slate-950 fill-slate-950" />
                        <span>{t.milestoneFinal}</span>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </section>
      </main>

      {/* 4. ASK SELVI MODAL */}
      <AskSelviModal
        isOpen={isSelviOpen}
        onClose={() => setIsSelviOpen(false)}
        language={langKey}
        lessonId="SPAM_SAFETY"
        lessonTitle="Digital Safety Quest"
        contextPrompt="Digital Safety Quest: identifying phone scams, OTP fraud, ATM PIN theft, and cyber defense"
      />
    </div>
  );
};
