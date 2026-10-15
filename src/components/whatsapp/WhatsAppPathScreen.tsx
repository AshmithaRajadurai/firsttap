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
  UserPlus,
  MessageSquare,
  Mic,
  ImageIcon,
  MapPin,
  Phone,
  Volume2,
  VolumeX,
  ArrowRight,
  HelpCircle,
  Clock,
  Award,
  Crown,
  Compass,
  Sliders,
} from 'lucide-react';
import {
  PrimaryCategory,
  SupportedLanguage,
  WhatsAppProgress,
  WhatsAppSegmentId,
} from '@/types';
import { LanguageCode } from './types';
import {
  getWhatsAppSequenceForCategory,
  getTrailSequenceForCategory,
  BeginnerTrailSegmentId,
  SEQUENCE_RATIONALE,
} from './personalizedSequences';
import { WHATSAPP_LESSONS_CATALOG, WhatsAppLessonMeta } from './lessonCatalog';
import { voiceManager } from './voice';
import { AskSelviModal } from './AskSelviModal';
import Image from 'next/image';

interface WhatsAppPathScreenProps {
  language: SupportedLanguage | LanguageCode;
  category?: PrimaryCategory | null;
  progress?: WhatsAppProgress | null;
  completedSegments?: WhatsAppSegmentId[];
  skippedSegments?: WhatsAppSegmentId[];
  currentSegmentId?: WhatsAppSegmentId;
  learnerName?: string;
  onSelectLesson: (lessonId: WhatsAppSegmentId | 'phone_basics') => void;
  onBack: () => void;
  onOpenDoubt?: (context?: string) => void;
  isPhoneBasicsCompleted?: boolean;
}

const PHONE_BASICS_META: WhatsAppLessonMeta = {
  id: 'phone_basics' as any,
  code: 'M1',
  number: 1,
  title: {
    en: '1. Smartphone Basics',
    ta: '1. ஸ்மார்ட்போன் அடிப்படைகள்',
    hi: '1. स्मार्टफोन बेसिक्स',
  },
  subtitle: {
    en: 'Wi-Fi, Mobile Internet, Hotspot & Torch',
    ta: 'வைஃபை, மொபைல் டேட்டா, ஹாட்ஸ்பாட் & டார்ச்',
    hi: 'वाई-फाई, मोबाइल इंटरनेट, हॉटस्पॉट और टॉर्च',
  },
  description: {
    en: "Let's start with your phone! Learn Wi-Fi, mobile internet, hotspot and torch before moving on to WhatsApp.",
    ta: 'உங்கள் போனிலிருந்து தொடங்குவோம்! வாட்ஸ்அப்பிற்குச் செல்வதற்கு முன் வைஃபை, மொபைல் இன்டர்நெட், ஹாட்ஸ்பாட் மற்றும் டார்ச் பற்றி அறிந்துகொள்ளுங்கள்.',
    hi: 'आइए आपके फोन से शुरुआत करें! व्हाट्सएप पर जाने से पहले वाई-फाई, मोबाइल इंटरनेट, हॉटस्पॉट और टॉर्च सीखें।',
  },
  durationMin: 5,
  skills: {
    en: ['Quick Settings', 'Mobile Data', 'Torch', 'Wi-Fi', 'Hotspot', 'Sound Mode'],
    ta: ['விரைவு அமைப்புகள்', 'மொபைல் டேட்டா', 'டார்ச்', 'வைஃபை', 'ஹாட்ஸ்பாட்'],
    hi: ['क्विक सेटिंग्स', 'मोबाइल डेटा', 'टॉर्च', 'वाई-फाई', 'हॉटस्पॉट'],
  },
};

const UI_TEXT = {
  en: {
    heading: 'Digital Beginner Adventure',
    adventureTheme: 'Smartphone & Communication Adventure',
    subheading: 'Master phone settings (Wi-Fi, mobile data, hotspot, torch) and everyday WhatsApp messaging on an interactive learning trail',
    backToDashboard: 'Back to Dashboard',
    completedCount: '{completed} of {total} completed',
    skippedBadge: '{skipped} Skipped (Tap to retry)',
    allDoneBanner: '🎉 Outstanding! You have completed all {total} learning modules!',
    resumeActive: 'Continue Adventure',
    startLearning: 'Start Lesson',
    reviewLesson: 'Review Lesson',
    retryLesson: 'Retry Lesson',
    statusCompleted: 'Completed',
    statusCurrent: 'In Progress',
    statusSkipped: 'Skipped',
    statusNotStarted: 'Not Started',
    selviAdvice: 'Welcome {name}! Let\'s start with your phone! Learn Wi-Fi, mobile internet, hotspot and torch before moving on to WhatsApp.',
    trackBadge: 'Personalized Trail',
    minuteShort: 'min',
    skillsLabel: 'Skills',
    milestoneMid: 'Halfway Explorer Checkpoint!',
    milestoneFinal: 'Final Scam Defense Milestone!',
    askSelvi: 'Ask Selvi',
    stepPill: 'Step {num} of {total}',
    continueCta: 'Continue to Step {num}',
  },
  ta: {
    heading: 'டிஜிட்டல் தொடக்கநிலை சாகசம்',
    adventureTheme: 'ஸ்மார்ட்போன் & வாட்ஸ்அப் சாகசம்',
    subheading: 'போன் அமைப்புகள் (வைஃபை, மொபைல் டேட்டா, டார்ச், ஹாட்ஸ்பாட்) மற்றும் வாட்ஸ்அப் பயிற்சிகளை விளையாட்டு வழியில் கற்கலாம்',
    backToDashboard: 'டாஷ்போர்டுக்கு திரும்பு',
    completedCount: '{total}-ல் {completed} பாடங்கள் முடிந்தது',
    skippedBadge: '{skipped} தவிர்க்கப்பட்டது (மீண்டும் பழகலாம்)',
    allDoneBanner: '🎉 அற்புதம்! அனைத்து {total} பாடங்களையும் வெற்றிகரமாக முடித்துவிட்டீர்கள்!',
    resumeActive: 'சாகசத்தைத் தொடரவும்',
    startLearning: 'பாடத்தைத் தொடங்கு',
    reviewLesson: 'மீண்டும் பார்',
    retryLesson: 'மீண்டும் முயற்சி',
    statusCompleted: 'முடிந்தது',
    statusCurrent: 'செயலில் உள்ளது',
    statusSkipped: 'தவிர்க்கப்பட்டது',
    statusNotStarted: 'தொடங்கவில்லை',
    selviAdvice: 'வணக்கம் {name}! உங்கள் போனிலிருந்து தொடங்குவோம்! வாட்ஸ்அப்பிற்குச் செல்வதற்கு முன் வைஃபை, மொபைல் இன்டர்நெட், ஹாட்ஸ்பாட் மற்றும் டார்ச் பற்றி அறிந்துகொள்ளுங்கள்.',
    trackBadge: 'பரிந்துரைக்கப்பட்ட பாதை',
    minuteShort: 'நிமிடம்',
    skillsLabel: 'பயிற்சிகள்',
    milestoneMid: 'பாதி வழி எட்டிய மைல்கல்!',
    milestoneFinal: 'இறுதி பாதுகாப்பு மைல்கல்!',
    askSelvi: 'செல்வி உதவி',
    stepPill: 'படி {num} / {total}',
    continueCta: 'படி {num}-க்குச் செல்',
  },
  hi: {
    heading: 'डिजिटल बिगिनर एडवेंचर',
    adventureTheme: 'स्मार्टफोन और व्हाट्सएप एडवेंचर',
    subheading: 'फोन सेटिंग्स (वाई-फाई, मोबाइल डेटा, हॉटस्पॉट, टॉर्च) और व्हाट्सएप संचार एक मजेदार ट्रेल पर सीखें',
    backToDashboard: 'डैशबोर्ड पर वापस',
    completedCount: '{total} में से {completed} पाठ पूरे हुए',
    skippedBadge: '{skipped} छोड़े गए (पुनः प्रयास करें)',
    allDoneBanner: '🎉 शाबाश! आपने सभी {total} पाठ सफलतापूर्वक पूरे कर लिए हैं!',
    resumeActive: 'एडवेंचर जारी रखें',
    startLearning: 'पाठ शुरू करें',
    reviewLesson: 'फिर से देखें',
    retryLesson: 'पुनः प्रयास करें',
    statusCompleted: 'पूरा हुआ',
    statusCurrent: 'चालू',
    statusSkipped: 'छोड़ा गया',
    statusNotStarted: 'शुरू नहीं हुआ',
    selviAdvice: 'नमस्ते {name}! आइए आपके फोन से शुरुआत करें! व्हाट्सएप पर जाने से पहले वाई-फाई, मोबाइल इंटरनेट, हॉटस्पॉट और टॉर्च सीखें।',
    trackBadge: 'निजीकृत एडवेंचर',
    minuteShort: 'मिनट',
    skillsLabel: 'कौशल',
    milestoneMid: 'आधा सफर पूरा - शाबाश!',
    milestoneFinal: 'अंतिम सुरक्षा माइलस्टोन!',
    askSelvi: 'सेलवी सहायता',
    stepPill: 'कदम {num} / {total}',
    continueCta: 'कदम {num} शुरू करें',
  },
};

const LESSON_ICONS: Record<string, React.ReactNode> = {
  phone_basics: <Sliders className="w-7 h-7 sm:w-8 sm:h-8" />,
  W0: <Smartphone className="w-7 h-7 sm:w-8 sm:h-8" />,
  W1: <UserPlus className="w-7 h-7 sm:w-8 sm:h-8" />,
  W2: <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8" />,
  W3: <Mic className="w-7 h-7 sm:w-8 sm:h-8" />,
  W4: <ImageIcon className="w-7 h-7 sm:w-8 sm:h-8" />,
  W5: <MapPin className="w-7 h-7 sm:w-8 sm:h-8" />,
  W6: <Phone className="w-7 h-7 sm:w-8 sm:h-8" />,
  W7: <ShieldAlert className="w-7 h-7 sm:w-8 sm:h-8" />,
};

// Winding trail horizontal offsets across desktop and mobile (9-node trail)
const TRAIL_OFFSETS = [
  { desktopX: 0, mobileX: 0, side: 'center' },      // Node 0 (phone_basics): Center Start
  { desktopX: -110, mobileX: -32, side: 'left' },   // Node 1 (W0): Left
  { desktopX: -60, mobileX: -16, side: 'left' },    // Node 2 (W1): Soft Left
  { desktopX: 50, mobileX: 14, side: 'right' },     // Node 3 (W2): Soft Right
  { desktopX: 120, mobileX: 34, side: 'right' },    // Node 4 (W3): Deep Right
  { desktopX: 30, mobileX: 10, side: 'center' },    // Node 5 (W4): Back Center
  { desktopX: -70, mobileX: -20, side: 'left' },    // Node 6 (W6): Left
  { desktopX: -110, mobileX: -30, side: 'left' },   // Node 7 (W5): Deep Left
  { desktopX: 0, mobileX: 0, side: 'center' },      // Node 8 (W7): Trophy Finish Center
];

export const WhatsAppPathScreen: React.FC<WhatsAppPathScreenProps> = ({
  language = 'en',
  category = 'DIGITAL_BEGINNER',
  progress,
  completedSegments = [],
  skippedSegments = [],
  currentSegmentId,
  learnerName = '',
  onSelectLesson,
  onBack,
  onOpenDoubt,
  isPhoneBasicsCompleted = false,
}) => {
  const [isSelviOpen, setIsSelviOpen] = useState<boolean>(false);
  const [isMascotSpeaking, setIsMascotSpeaking] = useState<boolean>(false);

  const langKey = language.startsWith('ta') ? 'ta' : language.startsWith('hi') ? 'hi' : 'en';
  const t = UI_TEXT[langKey] || UI_TEXT.en;

  const sequence = getTrailSequenceForCategory(category);
  const totalModules = sequence.length;
  const isPhoneBasicsDone = Boolean(isPhoneBasicsCompleted);
  const rationale =
    category && SEQUENCE_RATIONALE[category]
      ? SEQUENCE_RATIONALE[category][langKey]
      : SEQUENCE_RATIONALE.DIGITAL_BEGINNER[langKey];

  const completedList = progress?.completed_segments || completedSegments;
  const skippedList = progress?.skipped_segments || skippedSegments;
  const completedCount =
    (isPhoneBasicsDone && sequence.includes('phone_basics') ? 1 : 0) +
    completedList.filter((s) => (s as string) !== 'phone_basics').length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalModules) * 100));
  const isAllCompleted = completedCount >= totalModules;

  // Active / recommended next node
  const activeSegmentId: BeginnerTrailSegmentId =
    (!isPhoneBasicsDone && sequence.includes('phone_basics'))
      ? 'phone_basics'
      : currentSegmentId ||
        sequence.find((s) => {
          if (s === 'phone_basics') return !isPhoneBasicsDone;
          return !completedList.includes(s as any) && !skippedList.includes(s as any);
        }) ||
        sequence.find((s) => {
          if (s === 'phone_basics') return !isPhoneBasicsDone;
          return !completedList.includes(s as any);
        }) ||
        sequence[0];

  const activeIndex = sequence.indexOf(activeSegmentId);
  const activeStepNum = activeIndex >= 0 ? activeIndex + 1 : 1;

  // Cleanup voice on unmount
  useEffect(() => {
    return () => {
      voiceManager.stop();
    };
  }, []);

  const handlePlaySelviIntro = () => {
    if (isMascotSpeaking) {
      voiceManager.stop();
      setIsMascotSpeaking(false);
      return;
    }
    const introSpeech =
      langKey === 'ta'
        ? `வணக்கம் ${learnerName || ''}! உங்கள் டிஜிட்டல் தொடக்கநிலை சாகசத்திற்கு நல்வரவு! கீழே உள்ள பாதையில் உள்ள ஒவ்வொரு கட்டத்தையும் தொட்டுப் பழகத் தொடங்குங்கள்.`
        : langKey === 'hi'
        ? `नमस्ते ${learnerName || ''}! आपके डिजिटल बिगिनर एडवेंचर में स्वागत है! अभ्यास शुरू करने के लिए नीचे दिए गए ट्रेल पर आगे बढ़ें।`
        : `Welcome ${learnerName || 'friend'} to your Digital Beginner Adventure! Follow the winding trail below to practice real smartphone basics and everyday communication step-by-step.`;

    setIsMascotSpeaking(true);
    voiceManager.speak(introSpeech, langKey);
    setTimeout(() => {
      setIsMascotSpeaking(false);
    }, 7000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EBF5F3] via-[#F3FAF8] to-[#E5F2EE] text-slate-900 flex flex-col font-sans select-none pb-20">
      {/* 1. TOP STICKY APP BAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-teal-200/80 shadow-xs px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => {
              voiceManager.stop();
              onBack();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer border border-slate-300 shadow-xs active:scale-95"
            title={t.backToDashboard}
          >
            <ArrowLeft className="w-4 h-4 text-slate-700" />
            <span className="hidden sm:inline">{t.backToDashboard}</span>
            <span className="sm:hidden">{langKey === 'ta' ? 'பின்செல்' : 'Back'}</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Progress pill */}
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-black shadow-2xs">
              <Trophy className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>{completedCount}/{totalModules}</span>
            </span>

            {/* Ask Selvi */}
            <button
              onClick={() => {
                voiceManager.stop();
                setIsSelviOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-800 hover:bg-teal-700 text-teal-50 text-xs font-extrabold transition cursor-pointer shadow-xs active:scale-95 border border-teal-600"
              title="Ask Selvi"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.askSelvi}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN ADVENTURE CONTAINER */}
      <main className="max-w-4xl mx-auto w-full px-4 pt-4 sm:pt-6 flex-1 flex flex-col items-center">
        {/* HERO SECTION: COMPACT, RICH & ENGAGING */}
        <section className="w-full bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#022C22] text-white p-5 sm:p-6 rounded-3xl shadow-xl border-2 border-emerald-400/40 relative overflow-hidden mb-8 text-left">
          {/* Ambient background glows */}
          <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-teal-400/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-amber-400/15 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 justify-between">
            <div className="space-y-1.5 flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-400/50 text-xs font-extrabold text-emerald-200">
                <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>{t.adventureTheme}</span>
              </div>

              <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                {t.heading}
              </h1>

              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl">
                {t.subheading}
              </p>
            </div>

            {/* Selvi Mascot Interactive Avatar */}
            <div className="flex flex-col items-center shrink-0">
              <button
                onClick={handlePlaySelviIntro}
                className="relative group cursor-pointer focus:outline-hidden"
                title="Hear Selvi guide your adventure"
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
          <div className="relative z-10 mt-3 p-3 rounded-2xl bg-black/30 border border-emerald-500/30 text-xs sm:text-sm text-emerald-100 leading-snug font-medium">
            &ldquo;{t.selviAdvice.replace('{name}', learnerName || (langKey === 'ta' ? 'தோழரே' : 'Friend'))}&rdquo;
          </div>

          {/* Progress summary bar & CTA */}
          <div className="relative z-10 mt-4 bg-black/40 p-3.5 rounded-2xl border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex-1 w-full space-y-1">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-amber-300 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{t.completedCount.replace('{completed}', completedCount.toString()).replace('{total}', totalModules.toString())}</span>
                </span>
                <span className="text-emerald-200 font-mono text-xs">{progressPercent}%</span>
              </div>

              {/* Progress bar */}
              <div className="h-3 w-full bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-emerald-600/60 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Primary Action Button */}
            {isAllCompleted ? (
              <div className="px-4 py-2 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md flex items-center gap-1.5 border border-white shrink-0">
                <Crown className="w-4 h-4 fill-slate-950" />
                <span>{t.allDoneBanner.replace('{total}', totalModules.toString())}</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  voiceManager.stop();
                  onSelectLesson(activeSegmentId);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0 border border-amber-200"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>
                  {activeSegmentId === 'phone_basics'
                    ? (langKey === 'ta' ? 'ஸ்மார்ட்போன் அடிப்படைகளைத் தொடங்கு' : langKey === 'hi' ? 'स्मार्टफोन बेसिक्स शुरू करें' : 'Start Smartphone Basics')
                    : t.continueCta.replace('{num}', String(activeStepNum))}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </section>

        {/* 3. FIRSTTAP DIGITAL ADVENTURE: WINDING TRAIL LAYOUT */}
        <section className="w-full max-w-3xl flex flex-col items-center py-4 relative">
          <div className="w-full space-y-10 sm:space-y-14 relative">
            {sequence.map((segmentId, index) => {
              const isPhoneBasics = segmentId === 'phone_basics';
              const meta: WhatsAppLessonMeta = isPhoneBasics
                ? PHONE_BASICS_META
                : (WHATSAPP_LESSONS_CATALOG[segmentId as WhatsAppSegmentId] || {
                    id: segmentId as any,
                    code: segmentId,
                    number: index + 1,
                    title: { en: `Lesson ${segmentId}`, ta: `பாடம் ${segmentId}`, hi: `पाठ ${segmentId}` },
                    subtitle: { en: `Lesson ${segmentId}`, ta: `பாடம் ${segmentId}`, hi: `पाठ ${segmentId}` },
                    description: { en: '', ta: '', hi: '' },
                    durationMin: 3,
                    skills: { en: [], ta: [], hi: [] },
                  });

              const isCompleted = isPhoneBasics
                ? isPhoneBasicsDone
                : completedList.includes(segmentId as WhatsAppSegmentId);
              const isSkipped = isPhoneBasics
                ? false
                : skippedList.includes(segmentId as WhatsAppSegmentId);
              const isActive = segmentId === activeSegmentId && !isCompleted;
              const isNotStarted = !isCompleted && !isSkipped && !isActive;

              const sequenceNum = index + 1;
              const isMidpoint = index === 4;
              const isFinal = index === totalModules - 1;
              const offset = TRAIL_OFFSETS[index % TRAIL_OFFSETS.length];

              const actionLabel = isCompleted
                ? t.reviewLesson
                : isSkipped
                ? t.retryLesson
                : isActive
                ? (isPhoneBasics ? (langKey === 'ta' ? 'பாடத்தைத் தொடங்கு' : 'Start Lesson') : t.startLearning)
                : t.startLearning;

              return (
                <React.Fragment key={segmentId}>
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
                              : 'border-l-2 border-dashed border-teal-400/80'
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
                            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-lg border-2 border-white whitespace-nowrap">
                              {langKey === 'ta' ? 'தொடங்கு!' : 'START HERE!'}
                            </span>
                            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-amber-400 mx-auto" />
                          </div>
                        )}

                        <button
                          onClick={() => {
                            voiceManager.stop();
                            onSelectLesson(segmentId);
                          }}
                          className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center font-black transition-all cursor-pointer active:scale-95 active:translate-y-1 group ${
                            isCompleted
                              ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-white border-b-[6px] border-emerald-800 shadow-xl shadow-emerald-600/30 hover:brightness-110'
                              : isActive
                              ? 'bg-gradient-to-b from-teal-400 to-teal-600 text-white border-b-[6px] border-teal-800 shadow-2xl shadow-teal-500/40 ring-4 ring-amber-400 ring-offset-2 ring-offset-emerald-50 hover:brightness-110'
                              : isSkipped
                              ? 'bg-gradient-to-b from-purple-400 to-purple-600 text-white border-b-[6px] border-purple-800 shadow-lg hover:brightness-105'
                              : 'bg-gradient-to-b from-white to-slate-100 text-slate-700 border-b-[6px] border-slate-300 shadow-lg hover:border-slate-400'
                          }`}
                          title={`Open ${meta.title[langKey]}`}
                        >
                          {/* Inner Icon */}
                          <div className="group-hover:scale-110 transition-transform">
                            {LESSON_ICONS[segmentId]}
                          </div>

                          {/* Step Number Badge */}
                          <div
                            className={`absolute -top-1.5 -left-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full text-xs font-black flex items-center justify-center shadow-md border-2 border-white ${
                              isCompleted
                                ? 'bg-emerald-700 text-white'
                                : isActive
                                ? 'bg-amber-400 text-slate-950 font-black'
                                : 'bg-slate-800 text-white'
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
                            ? 'bg-white border-2 border-teal-500 shadow-xl ring-2 ring-teal-400/40'
                            : isCompleted
                            ? 'bg-emerald-50/90 border-2 border-emerald-300'
                            : isSkipped
                            ? 'bg-purple-50/90 border-2 border-purple-300'
                            : 'bg-white/95 border border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
                            {meta.code} · {t.stepPill.replace('{num}', String(sequenceNum)).replace('{total}', String(totalModules))}
                          </span>

                          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{meta.durationMin} {t.minuteShort}</span>
                          </span>
                        </div>

                        <h3 className="text-sm font-extrabold text-slate-900 leading-snug mb-1">
                          {meta.title[langKey]}
                        </h3>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                          {meta.description[langKey]}
                        </p>

                        <button
                          onClick={() => {
                            voiceManager.stop();
                            onSelectLesson(segmentId);
                          }}
                          className={`w-full py-2 px-3 rounded-xl font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                            isCompleted
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              : isActive
                              ? 'bg-teal-700 hover:bg-teal-600 text-white ring-2 ring-teal-400'
                              : isSkipped
                              ? 'bg-purple-700 hover:bg-purple-600 text-white'
                              : 'bg-slate-900 hover:bg-slate-800 text-white'
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

      {/* 4. ASK SELVI MODAL */}
      <AskSelviModal
        isOpen={isSelviOpen}
        onClose={() => setIsSelviOpen(false)}
        language={langKey}
        lessonId="ADVENTURE"
        lessonTitle="Digital Beginner Adventure"
        contextPrompt="Digital Beginner Adventure trail overview (Smartphone basics & everyday communication)"
      />
    </div>
  );
};
