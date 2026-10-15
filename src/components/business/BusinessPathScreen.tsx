'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  Store,
  MapPin,
  Compass,
  ArrowRight,
  HelpCircle,
  Clock,
  Award,
  Crown,
  Volume2,
  VolumeX,
  ShieldCheck,
  QrCode,
  ShoppingBag,
} from 'lucide-react';
import {
  PrimaryCategory,
  SupportedLanguage,
  BusinessProgress,
  BusinessLessonId,
} from '@/types';
import Image from 'next/image';

interface BusinessPathScreenProps {
  language: SupportedLanguage | 'en' | 'ta' | 'hi';
  category?: PrimaryCategory | null;
  progress?: BusinessProgress | null;
  completedLessons?: BusinessLessonId[];
  skippedLessons?: BusinessLessonId[];
  currentLessonId?: BusinessLessonId;
  learnerName?: string;
  onSelectLesson: (lessonId: BusinessLessonId) => void;
  onBack: () => void;
  onOpenDoubt?: (context?: string) => void;
}

interface BusinessLessonItem {
  id: BusinessLessonId;
  number: number;
  title: Record<'en' | 'ta' | 'hi', string>;
  subtitle: Record<'en' | 'ta' | 'hi', string>;
  description: Record<'en' | 'ta' | 'hi', string>;
  durationMin: number;
  skills: Record<'en' | 'ta' | 'hi', string[]>;
  badgeText: Record<'en' | 'ta' | 'hi', string>;
  icon: 'Store' | 'MapPin';
}

const BUSINESS_LESSONS: BusinessLessonItem[] = [
  {
    id: 'wa_business',
    number: 1,
    title: {
      en: 'WhatsApp Business & Product Catalogue',
      ta: 'வாட்ஸ்அப் வணிகம் & பொருட்கள் பட்டியல்',
      hi: 'व्हाट्सएप बिजनेस और उत्पाद कैटलॉग',
    },
    subtitle: {
      en: 'Create a verified shop profile, set up simulated OTP, and add products to your digital catalogue',
      ta: 'சரிபார்க்கப்பட்ட கடை கணக்கு அமைத்தல், மாதிரி OTP மற்றும் டிஜிட்டல் பொருட்கள் பட்டியல் தயாரித்தல்',
      hi: 'सत्यापित दुकान प्रोफ़ाइल बनाएं, सिम्युलेटेड ओटीपी सत्यापित करें और कैटलॉग में सामान जोड़ें',
    },
    description: {
      en: 'Learn how to transform everyday WhatsApp into a powerful digital shopfront. Practice setting business hours, address, photo, product listings with prices, and earning your FirstTap Verified Certificate.',
      ta: 'வாட்ஸ்அப்பை உங்கள் கடைக்கான டிஜிட்டல் விற்பனைக் கூடமாக மாற்றுங்கள். வணிக நேரம், முகவரி, புகைப்படங்கள், விலையுடன் பொருட்கள் பட்டியல் அமைத்து ஃபர்ஸ்ட்டேப் சான்றிதழ் பெறுங்கள்.',
      hi: 'व्हाट्सएप को अपनी डिजिटल दुकान में बदलें। व्यापार समय, पता, फोटो, कीमतों के साथ उत्पाद सूची बनाना सीखें और फर्स्टटैप प्रमाणपत्र प्राप्त करें।',
    },
    durationMin: 5,
    skills: {
      en: ['Shop Account Setup', 'Simulated OTP', 'Store Profile', 'Product Catalogue', 'Price Tag', 'FirstTap Certificate'],
      ta: ['கடை கணக்கு அமைத்தல்', 'மாதிரி OTP', 'கடை விவரக்குறிப்பு', 'பொருட்கள் பட்டியல்', 'விலை நிர்ணயம்', 'சான்றிதழ்'],
      hi: ['दुकान खाता निर्माण', 'सिम्युलेटेड ओटीपी', 'स्टोर प्रोफ़ाइल', 'उत्पाद कैटलॉग', 'कीमत सूची', 'प्रमाणपत्र'],
    },
    badgeText: {
      en: 'Merchant Core',
      ta: 'வணிக அடிப்படை',
      hi: 'व्यापार मुख्य',
    },
    icon: 'Store',
  },
  {
    id: 'google_maps',
    number: 2,
    title: {
      en: 'Google Maps Shop & Home Location',
      ta: 'கூகுள் மேப்ஸ் கடை & வீட்டு முகவரி',
      hi: 'गूगल मैप्स दुकान और घर का स्थान',
    },
    subtitle: {
      en: 'Place your shop on Google Maps to attract local customers, and safely save your private home location',
      ta: 'வாடிக்கையாளர்கள் அறிய கூகுள் மேப்ஸில் கடை சேர்த்தல் மற்றும் தனிப்பட்ட வீட்டு முகவரியை பாதுகாப்பாக சேமித்தல்',
      hi: 'स्थानीय ग्राहकों को आकर्षित करने के लिए दुकान जोड़ें और सुरक्षित रूप से घर का पता सहेजें',
    },
    description: {
      en: 'Master dropping a map pin, entering your store category, phone and working hours. Learn how Google verification works for public shops while keeping your personal home address strictly private.',
      ta: 'கூகுள் மேப்ஸில் உங்கள் கடைக்கான இருப்பிடத்தை துல்லியமாக குறிக்கவும். பொது வணிக முகவரிக்கும் தனிப்பட்ட வீட்டு முகவரிக்குமான வித்தியாசத்தை உணர்ந்து பாதுகாப்பாக சேமிக்கவும்.',
      hi: 'गूगल मैप्स पर अपनी दुकान की पिन लगाना, श्रेणी और समय दर्ज करना सीखें। सार्वजनिक दुकान और निजी घर के पते में अंतर समझकर सुरक्षित रहें।',
    },
    durationMin: 6,
    skills: {
      en: ['Map Location Search', 'Public Shop Pin Drop', 'Business Hours & Phone', 'Google Verification', 'Private Home Shortcut'],
      ta: ['மேப் முகவரி தேடல்', 'பொது கடை குறியீடு', 'வணிக நேரம் & தொலைபேசி', 'கூகுள் சரிபார்ப்பு விழிப்புணர்வு', 'தனிப்பட்ட வீட்டு முகவரி'],
      hi: ['स्थान खोज', 'दुकान पिन ड्रॉप', 'व्यापार समय और फोन', 'गूगल सत्यापन', 'निजी घर का शॉर्टकट'],
    },
    badgeText: {
      en: 'Local Discovery',
      ta: 'உள்ளூர் வாடிக்கையாளர்கள்',
      hi: 'स्थानीय पहुंच',
    },
    icon: 'MapPin',
  },
];

const UI_TEXT = {
  en: {
    heading: 'Business Growth Journey',
    adventureTheme: 'MSME Digital Skills Adventure',
    subheading: 'Learn simple digital tools to attract local customers, showcase products on WhatsApp, and grow your shop with confidence.',
    backToDashboard: 'Back to Dashboard',
    completedCount: '{completed} of 2 completed',
    allDoneBanner: '🎉 Outstanding! You have completed all business growth lessons and mastered essential digital tools!',
    resumeActive: 'Continue Journey',
    startLearning: 'Start Lesson',
    reviewLesson: 'Review Lesson',
    retryLesson: 'Retry Lesson',
    statusCompleted: 'Completed',
    statusCurrent: 'In Progress',
    statusNotStarted: 'Not Started',
    selviAdvice: 'Welcome {name} to your Business Growth Journey! Small shops and vendors can reach many more customers using WhatsApp catalogues and Google Maps. Follow the path below to practice with our friendly simulators!',
    trackBadge: 'Shop Owner Trail',
    minuteShort: 'min',
    skillsLabel: 'Skills',
    askSelvi: 'Ask Selvi',
    stepPill: 'Lesson {num} of 2',
    continueCta: 'Continue to Lesson {num}',
    upcomingMilestone: 'Next Milestone: UPI Soundbox & QR Payments (Coming Soon)',
    upcomingDesc: 'Accept instant customer QR payments, verify payer slips, and hear real-time audio confirmations.',
  },
  ta: {
    heading: 'வணிக வளர்ச்சிப் பயணம்',
    adventureTheme: 'சிறு வணிகர்களுக்கான டிஜிட்டல் சாகசம்',
    subheading: 'உள்ளூர் வாடிக்கையாளர்களை கவர, வாட்ஸ்அப்பில் பொருட்கள் பட்டியலை காட்சிப்படுத்த மற்றும் எளிய டிஜிட்டல் கருவிகள் மூலம் வியாபாரத்தை வளர்க்கலாம்.',
    backToDashboard: 'டாஷ்போர்டுக்கு திரும்பு',
    completedCount: '2-ல் {completed} பாடங்கள் முடிந்தது',
    allDoneBanner: '🎉 அற்புதம்! அனைத்து வணிகப் பயிற்சிகளையும் வெற்றிகரமாக முடித்துவிட்டீர்கள்!',
    resumeActive: 'பயணத்தைத் தொடரவும்',
    startLearning: 'பாடத்தைத் தொடங்கு',
    reviewLesson: 'மீண்டும் பார்',
    retryLesson: 'மீண்டும் முயற்சி',
    statusCompleted: 'முடிந்தது',
    statusCurrent: 'செயலில் உள்ளது',
    statusNotStarted: 'தொடங்கவில்லை',
    selviAdvice: 'வணக்கம் {name}! உங்கள் சிறு வணிகத்தை நவீனப்படுத்த வாட்ஸ்அப் கேட்லாக் மற்றும் கூகுள் மேப்ஸ் மிகவும் உதவும். கீழே உள்ள பாதையைப் பின்பற்றி மாதிரி செயலியில் பாதுகாப்பாகப் பழகிப் பாருங்கள்!',
    trackBadge: 'கடை உரிமையாளர் பாதை',
    minuteShort: 'நிமிடம்',
    skillsLabel: 'திறன்கள்',
    askSelvi: 'செல்வியிடம் கேளுங்கள்',
    stepPill: 'பாடம் {num} (மொத்தம் 2)',
    continueCta: 'பாடம் {num}-ஐ தொடங்கு',
    upcomingMilestone: 'அடுத்த கட்டம்: கடை QR & சவுண்ட்பாக்ஸ் (விரைவில்)',
    upcomingDesc: 'வாடிக்கையாளர் QR பணப் பரிவர்த்தனை, ஒலி உறுதிப்படுத்தல் கேட்டல் மற்றும் போலி ஸ்கிரீன்ஷாட் மோசடி தடுப்பு.',
  },
  hi: {
    heading: 'व्यापार विकास यात्रा',
    adventureTheme: 'एमएसएमई डिजिटल कौशल यात्रा',
    subheading: 'स्थानीय ग्राहकों को आकर्षित करने, व्हाट्सएप पर उत्पादों को प्रदर्शित करने और अपने व्यवसाय को आसानी से बढ़ाने के लिए सरल डिजिटल कौशल सीखें।',
    backToDashboard: 'डैशबोर्ड पर वापस',
    completedCount: '2 में से {completed} पूर्ण',
    allDoneBanner: '🎉 शानदार! आपने सभी व्यावसायिक विकास पाठ सफलतापूर्वक पूरे कर लिए हैं!',
    resumeActive: 'यात्रा जारी रखें',
    startLearning: 'पाठ शुरू करें',
    reviewLesson: 'दोबारा देखें',
    retryLesson: 'पुनः प्रयास करें',
    statusCompleted: 'पूर्ण',
    statusCurrent: 'प्रगति पर है',
    statusNotStarted: 'शुरू नहीं हुआ',
    selviAdvice: 'नमस्ते {name}! व्हाट्सएप कैटलॉग और गूगल मैप्स आपकी दुकान को नए ग्राहकों तक पहुंचाने में बहुत मदद करते हैं। नीचे दिए गए पाथ से चरण-दर-चरण अभ्यास करें!',
    trackBadge: 'दुकानदार पाथ',
    minuteShort: 'मिनट',
    skillsLabel: 'कौशल',
    askSelvi: 'सेल्वी से पूछें',
    stepPill: 'पाठ {num} (कुल 2)',
    continueCta: 'पाठ {num} पर जारी रखें',
    upcomingMilestone: 'अगला पड़ाव: साउंडबॉक्स यूपीआई और क्यूआर (जल्द आ रहा है)',
    upcomingDesc: 'ग्राहकों से तुरंत क्यूआर भुगतान लेना, वॉइस बॉक्स से आवाज सुनना और फर्जी रसीदों से बचना।',
  },
};

const TRAIL_OFFSETS = [
  { desktopX: -60, mobileX: 0 },
  { desktopX: 60, mobileX: 0 },
];

export const BusinessPathScreen: React.FC<BusinessPathScreenProps> = ({
  language,
  category,
  progress,
  completedLessons = [],
  skippedLessons = [],
  currentLessonId,
  learnerName,
  onSelectLesson,
  onBack,
  onOpenDoubt,
}) => {
  const langKey = language.startsWith('ta') ? 'ta' : language.startsWith('hi') ? 'hi' : 'en';
  const t = UI_TEXT[langKey];

  const [isMascotSpeaking, setIsMascotSpeaking] = useState<boolean>(false);

  // Compute completed lessons
  const completedList: BusinessLessonId[] =
    completedLessons.length > 0
      ? completedLessons
      : (progress?.completed_lessons as BusinessLessonId[]) || [];

  const completedCount = completedList.length;
  const progressPercent = Math.min(100, Math.round((completedCount / 2) * 100));
  const isAllCompleted = completedCount >= 2;

  // Determine active lesson
  const activeLessonId: BusinessLessonId =
    currentLessonId ||
    progress?.current_lesson_id ||
    (!completedList.includes('wa_business') ? 'wa_business' : 'google_maps');

  const activeStepNum = activeLessonId === 'wa_business' ? 1 : 2;

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlaySelviIntro = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isMascotSpeaking) {
      window.speechSynthesis.cancel();
      setIsMascotSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const adviceText = t.selviAdvice.replace(
      '{name}',
      learnerName || (langKey === 'ta' ? 'வணிகத் தோழரே' : langKey === 'hi' ? 'दुकानदार साथी' : 'Shopkeeper Friend')
    );

    const utterance = new SpeechSynthesisUtterance(adviceText);
    utterance.lang = langKey === 'ta' ? 'ta-IN' : langKey === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsMascotSpeaking(true);
    utterance.onend = () => setIsMascotSpeaking(false);
    utterance.onerror = () => setIsMascotSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950/70 to-slate-950 text-slate-100 flex flex-col font-sans pb-16">
      {/* 1. TOP STICKY APP-LIKE HEADER BAR */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-indigo-900/60 px-4 py-2.5 sm:py-3 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          {/* Back to Dashboard */}
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              onBack();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-indigo-900/80 hover:bg-indigo-800 text-indigo-100 text-xs sm:text-sm font-black shadow-md border border-indigo-600/60 transition cursor-pointer min-h-[44px] active:scale-95"
            title="Return to FirstTap Dashboard"
          >
            <ArrowLeft className="w-4 h-4 text-amber-300" />
            <span className="hidden xs:inline">{t.backToDashboard}</span>
            <span className="xs:hidden">←</span>
          </button>

          {/* Title Badge */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black shadow-xs">
              <Store className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h2 className="text-xs sm:text-sm font-black text-white leading-tight">
                {t.heading}
              </h2>
              <span className="text-[10px] text-indigo-300 block font-semibold">
                {t.trackBadge}
              </span>
            </div>
          </div>

          {/* Right Header Status */}
          <div className="flex items-center gap-2">
            {/* Completed badge */}
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-950 border border-indigo-600/70 text-indigo-200 text-xs font-black shadow-2xs">
              <Trophy className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{completedCount}/2</span>
            </span>

            {/* Ask Selvi */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                onOpenDoubt?.('Business Growth Journey overview');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-900/80 hover:bg-purple-800 text-purple-100 text-xs font-extrabold transition cursor-pointer shadow-xs active:scale-95 border border-purple-500/70 min-h-[40px]"
              title="Ask Selvi"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">{t.askSelvi}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN ADVENTURE CONTAINER */}
      <main className="max-w-4xl mx-auto w-full px-4 pt-4 sm:pt-6 flex-1 flex flex-col items-center">
        {/* HERO SECTION: RICH & ENGAGING */}
        <section className="w-full bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#0F172A] text-white p-5 sm:p-6 rounded-3xl shadow-xl border-2 border-indigo-500/40 relative overflow-hidden mb-8 text-left">
          {/* Ambient glows */}
          <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-amber-400/15 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 justify-between">
            <div className="space-y-1.5 flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-400/50 text-xs font-extrabold text-indigo-200">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.adventureTheme}</span>
              </div>

              <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                {t.heading}
              </h1>

              <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed max-w-xl font-medium">
                {t.subheading}
              </p>
            </div>

            {/* Selvi Avatar */}
            <div className="flex flex-col items-center shrink-0">
              <button
                onClick={handlePlaySelviIntro}
                className="relative group cursor-pointer focus:outline-hidden"
                title="Hear Selvi guide your business journey"
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
          <div className="relative z-10 mt-3 p-3 rounded-2xl bg-black/40 border border-indigo-500/30 text-xs sm:text-sm text-indigo-100 leading-snug font-medium">
            &ldquo;{t.selviAdvice.replace('{name}', learnerName || (langKey === 'ta' ? 'வணிகத் தோழரே' : langKey === 'hi' ? 'साथी' : 'Friend'))}&rdquo;
          </div>

          {/* Progress summary bar & CTA */}
          <div className="relative z-10 mt-4 bg-black/50 p-3.5 rounded-2xl border border-indigo-500/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex-1 w-full space-y-1">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-amber-300 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{t.completedCount.replace('{completed}', completedCount.toString())}</span>
                </span>
                <span className="text-indigo-200 font-mono text-xs">{progressPercent}%</span>
              </div>

              {/* Progress bar */}
              <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-indigo-600/60 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-300 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Primary Action Button */}
            {!isAllCompleted && (
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                  onSelectLesson(activeLessonId);
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

        {/* 3. FIRSTTAP DIGITAL ADVENTURE: WINDING TRAIL LAYOUT */}
        <section className="w-full max-w-3xl flex flex-col items-center py-4 relative">
          <div className="w-full space-y-10 sm:space-y-14 relative">
            {BUSINESS_LESSONS.map((lesson, index) => {
              const isCompleted = completedList.includes(lesson.id);
              const isActive = lesson.id === activeLessonId && !isCompleted;
              const isNotStarted = !isCompleted && !isActive;

              const sequenceNum = index + 1;
              const offset = TRAIL_OFFSETS[index % TRAIL_OFFSETS.length];

              const actionLabel = isCompleted
                ? t.reviewLesson
                : isActive
                ? t.startLearning
                : t.startLearning;

              return (
                <div key={lesson.id} className="relative flex flex-col items-center">
                  {/* Connector Trail Line */}
                  {index > 0 && (
                    <div className="absolute -top-10 sm:-top-14 h-10 sm:h-14 w-1 flex justify-center pointer-events-none">
                      <div
                        className={`w-1.5 h-full rounded-full transition-all duration-300 ${
                          isCompleted
                            ? 'bg-indigo-500 shadow-sm'
                            : 'border-l-2 border-dashed border-indigo-400/80'
                        }`}
                      />
                    </div>
                  )}

                  {/* Stepping Stone Node with Responsive Offset */}
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
                      {/* Active Beacon Floating Above */}
                      {isActive && (
                        <div className="absolute -top-7 animate-bounce flex items-center justify-center">
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                            {t.statusCurrent}
                          </span>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                            window.speechSynthesis.cancel();
                          }
                          onSelectLesson(lesson.id);
                        }}
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center font-black transition-all duration-200 cursor-pointer relative shadow-2xl active:scale-95 group min-h-[44px] ${
                          isCompleted
                            ? 'bg-gradient-to-b from-emerald-500 to-teal-700 text-white border-4 border-emerald-300 hover:border-emerald-200'
                            : isActive
                            ? 'bg-gradient-to-b from-indigo-500 to-purple-700 text-white border-4 border-amber-300 ring-4 ring-amber-400/40 hover:scale-105'
                            : 'bg-gradient-to-b from-slate-700 to-slate-800 text-slate-300 border-4 border-slate-600 hover:border-slate-500'
                        }`}
                        title={lesson.title[langKey]}
                      >
                        {/* Stepping Stone Icon */}
                        <div className="flex flex-col items-center">
                          {isCompleted ? (
                            <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9 text-white stroke-[2.5]" />
                          ) : lesson.icon === 'Store' ? (
                            <Store className="w-7 h-7 sm:w-8 sm:h-8 text-amber-300" />
                          ) : (
                            <MapPin className="w-7 h-7 sm:w-8 sm:h-8 text-sky-300" />
                          )}
                          <span className="text-[10px] sm:text-xs font-black tracking-tight mt-0.5">
                            {t.stepPill.replace('{num}', String(sequenceNum))}
                          </span>
                        </div>

                        {/* Completed Status Checkmark Badge */}
                        {isCompleted && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shadow-md border-2 border-white">
                            <CheckCircle2 className="w-4 h-4 fill-emerald-400 text-slate-950" />
                          </div>
                        )}
                      </button>
                    </div>

                    {/* ADVENTURE CARD: LESSON METADATA */}
                    <div
                      className={`w-full max-w-md p-4 sm:p-5 rounded-3xl border-2 transition-all duration-300 text-left shadow-lg ${
                        isCompleted
                          ? 'bg-slate-900/90 border-emerald-500/50 hover:border-emerald-400'
                          : isActive
                          ? 'bg-gradient-to-br from-indigo-950/90 via-purple-950/80 to-slate-900 border-indigo-400/70 shadow-indigo-500/10 hover:border-indigo-300 ring-1 ring-indigo-400/30'
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-900/80 text-indigo-300 border border-indigo-500/30">
                            {lesson.badgeText[langKey]}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>
                              {lesson.durationMin} {t.minuteShort}
                            </span>
                          </span>
                        </div>

                        {/* Status Label */}
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                            isCompleted
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                              : isActive
                              ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {isCompleted
                            ? t.statusCompleted
                            : isActive
                            ? t.statusCurrent
                            : t.statusNotStarted}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                        {lesson.title[langKey]}
                      </h3>

                      <p className="text-xs text-slate-300 leading-relaxed mt-1 font-medium">
                        {lesson.subtitle[langKey]}
                      </p>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {lesson.skills[langKey].map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60 font-medium"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                      </div>

                      {/* Action CTA Button */}
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                        <button
                          onClick={() => {
                            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                              window.speechSynthesis.cancel();
                            }
                            onSelectLesson(lesson.id);
                          }}
                          className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 cursor-pointer min-h-[44px] active:scale-95 ${
                            isCompleted
                              ? 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30'
                              : isActive
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/30'
                              : 'bg-indigo-900/60 hover:bg-indigo-800 text-indigo-100 border border-indigo-700/50'
                          }`}
                        >
                          {isCompleted ? (
                            <RotateCcw className="w-3.5 h-3.5" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current" />
                          )}
                          <span>{actionLabel}</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-auto text-indigo-200" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* UPCOMING ROADMAP MILESTONE NODE */}
            <div className="relative flex flex-col items-center pt-2">
              <div className="absolute -top-10 sm:-top-14 h-10 sm:h-14 w-1 flex justify-center pointer-events-none">
                <div className="w-1.5 h-full rounded-full border-l-2 border-dashed border-indigo-400/50" />
              </div>

              <div className="w-full max-w-md p-4 sm:p-5 rounded-3xl bg-slate-900/60 border-2 border-dashed border-slate-700 text-left space-y-2 opacity-90">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center font-bold">
                    <QrCode className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400">
                      🚀 {t.upcomingMilestone}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      Shop UPI Soundbox & Instant QR Payments
                    </h4>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {t.upcomingDesc}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
