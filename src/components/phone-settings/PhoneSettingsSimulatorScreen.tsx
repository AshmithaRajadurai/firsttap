import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Wifi,
  WifiOff,
  Flashlight,
  Volume2,
  VolumeX,
  Vibrate,
  Radio,
  Share2,
  Sparkles,
  RotateCcw,
  ChevronRight,
  CheckCircle2,
  Check,
  AlertCircle,
  HelpCircle,
  Award,
  ChevronDown,
  ChevronUp,
  Sun,
  ShieldCheck,
  Smartphone,
  Phone,
  MessageSquare,
  Camera,
  Play,
  Info,
  Sliders,
  Plane,
  RotateCw,
} from 'lucide-react';
import {
  LanguageCode,
  LessonId,
  SoundMode,
  PhoneSettingsState,
} from './types';
import {
  SETTINGS_LESSONS,
  SETTINGS_QUIZ_QUESTIONS,
} from './lessonsData';
import { settingsVoice } from './voice';
import { AskSelviModal } from '../whatsapp/AskSelviModal';

export interface PhoneSettingsSimulatorScreenProps {
  language?: LanguageCode;
  onBackToMainMenu?: () => void;
  onSwitchToWhatsApp?: () => void;
  onSwitchToMaps?: () => void;
  onComplete?: () => void;
}

export const PhoneSettingsSimulatorScreen: React.FC<PhoneSettingsSimulatorScreenProps> = ({
  language: propLanguage,
  onBackToMainMenu,
  onSwitchToWhatsApp,
  onSwitchToMaps,
  onComplete,
}) => {
  // Navigation & Settings
  const [language, setLanguage] = useState<LanguageCode>(() => {
    if (propLanguage && ['ta', 'hi', 'en'].includes(propLanguage)) {
      return propLanguage;
    }
    return 'ta';
  });

  useEffect(() => {
    if (propLanguage && ['ta', 'hi', 'en'].includes(propLanguage)) {
      setLanguage(propLanguage);
    }
  }, [propLanguage]);

  const [activeLessonId, setActiveLessonId] = useState<LessonId>(1);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPracticeMode, setIsPracticeMode] = useState<boolean>(false);
  const [practicePassed, setPracticePassed] = useState<boolean>(false);

  // Simulated Phone Hardware & Settings State
  const [phoneState, setPhoneState] = useState<PhoneSettingsState>({
    mobileDataEnabled: false,
    torchEnabled: false,
    wifiEnabled: false,
    connectedWifi: null,
    hotspotEnabled: false,
    connectedDevices: [],
    soundMode: 'sound',
    isQuickSettingsOpen: false,
    quickSettingsExpanded: true,
    brightness: 80,
  });

  // Audio voice speaking indicator
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false);
  const [isAskSelviOpen, setIsAskSelviOpen] = useState<boolean>(false);

  // Home Screen App Feedback Modal (e.g. testing internet with YouTube/WhatsApp)
  const [appTestFeedback, setAppTestFeedback] = useState<string | null>(null);

  // Quiz state
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  // Flashlight beam animation toggle helper
  const [torchBeamIntensity, setTorchBeamIntensity] = useState<number>(0);

  // Subscribe to voice speaking changes
  useEffect(() => {
    const unsub = settingsVoice.onSpeakingChange((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => {
      unsub();
      settingsVoice.stop();
    };
  }, []);

  // Current lesson definition
  const currentLesson =
    activeLessonId !== 'quiz'
      ? SETTINGS_LESSONS.find((l) => l.id === activeLessonId) || SETTINGS_LESSONS[0]
      : null;

  const currentStep =
    currentLesson && !isPracticeMode
      ? currentLesson.learnSteps[currentStepIndex] || currentLesson.learnSteps[0]
      : null;

  // Trigger voice narration on step/lesson/language change
  useEffect(() => {
    speakCurrentContext();
  }, [activeLessonId, currentStepIndex, isPracticeMode, language, quizIndex]);

  // Handle Torch beam glow state
  useEffect(() => {
    if (phoneState.torchEnabled) {
      setTorchBeamIntensity(1);
    } else {
      setTorchBeamIntensity(0);
    }
  }, [phoneState.torchEnabled]);

  const speakCurrentContext = () => {
    if (isVoiceMuted) return;

    if (activeLessonId === 'quiz') {
      if (quizCompleted) {
        const text =
          language === 'ta'
            ? `வாழ்த்துகள்! நீங்கள் பயிற்சி வினாடி வினாவை முடித்துவிட்டீர்கள். உங்கள் மதிப்பெண் 5 க்கு ${quizScore}!`
            : language === 'hi'
            ? `बधाई हो! आपने अभ्यास क्विज़ पूरा कर लिया है। आपका स्कोर 5 में से ${quizScore} है!`
            : `Congratulations! You completed the practice quiz with a score of ${quizScore} out of 5!`;
        settingsVoice.speak(text, language);
      } else {
        const q = SETTINGS_QUIZ_QUESTIONS[quizIndex];
        if (q) {
          settingsVoice.speak(q.question[language], language);
        }
      }
      return;
    }

    if (isPracticeMode && currentLesson) {
      settingsVoice.speak(currentLesson.practiceTask.prompt[language], language);
      return;
    }

    if (currentStep) {
      settingsVoice.speak(currentStep.voicePrompt[language], language);
    }
  };

  const handleToggleMute = () => {
    const nextMute = !isVoiceMuted;
    setIsVoiceMuted(nextMute);
    settingsVoice.setMuted(nextMute);
    if (!nextMute) {
      speakCurrentContext();
    }
  };

  const handleReplayVoice = () => {
    settingsVoice.playSound('toggle');
    speakCurrentContext();
  };

  // Trilingual helper
  const t = (enText: string, taText: string, hiText: string) => {
    if (language === 'ta') return taText;
    if (language === 'hi') return hiText;
    return enText;
  };

  // Quick Settings Swipe-Down / Toggle Handle
  const handleToggleQuickSettings = () => {
    settingsVoice.playSound('swipe');
    setPhoneState((prev) => ({
      ...prev,
      isQuickSettingsOpen: !prev.isQuickSettingsOpen,
    }));

    // If on Step 1 expecting swipe down, advance step!
    if (currentStep?.expectedAction === 'SWIPE_DOWN') {
      setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
        settingsVoice.playSound('success');
      }, 300);
    }
  };

  // Toggle Mobile Data
  const handleToggleMobileData = () => {
    const nextData = !phoneState.mobileDataEnabled;
    settingsVoice.playSound('toggle');
    setPhoneState((prev) => ({
      ...prev,
      mobileDataEnabled: nextData,
    }));

    // Check practice task
    if (isPracticeMode && currentLesson?.practiceTask.targetSetting === 'data') {
      if (nextData === currentLesson.practiceTask.desiredValue) {
        settingsVoice.playSound('success');
        setPracticePassed(true);
      }
    } else if (currentStep?.expectedAction === 'TOGGLE_DATA') {
      setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
        settingsVoice.playSound('success');
      }, 500);
    }
  };

  // Toggle Torch / Flashlight
  const handleToggleTorch = () => {
    const nextTorch = !phoneState.torchEnabled;
    settingsVoice.playSound('torch');
    setPhoneState((prev) => ({
      ...prev,
      torchEnabled: nextTorch,
    }));

    // Check practice task
    if (isPracticeMode && currentLesson?.practiceTask.targetSetting === 'torch') {
      if (nextTorch === currentLesson.practiceTask.desiredValue) {
        settingsVoice.playSound('success');
        setPracticePassed(true);
      }
    } else if (currentStep?.expectedAction === 'TOGGLE_TORCH') {
      setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
        settingsVoice.playSound('success');
      }, 500);
    }
  };

  // Toggle Wi-Fi
  const handleToggleWifi = () => {
    const nextWifi = !phoneState.wifiEnabled;
    settingsVoice.playSound('toggle');
    setPhoneState((prev) => ({
      ...prev,
      wifiEnabled: nextWifi,
      connectedWifi: nextWifi ? prev.connectedWifi : null,
    }));

    // Check practice task
    if (isPracticeMode && currentLesson?.practiceTask.targetSetting === 'wifi') {
      if (nextWifi === currentLesson.practiceTask.desiredValue) {
        settingsVoice.playSound('success');
        setPracticePassed(true);
      }
    } else if (currentStep?.expectedAction === 'TOGGLE_WIFI') {
      setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
        settingsVoice.playSound('success');
      }, 400);
    }
  };

  // Connect to Fictional Wi-Fi Network
  const handleConnectWifi = (networkName: string) => {
    settingsVoice.playSound('wifi');
    setPhoneState((prev) => ({
      ...prev,
      wifiEnabled: true,
      connectedWifi: networkName,
    }));

    if (currentStep?.expectedAction === 'CONNECT_WIFI') {
      setTimeout(() => {
        setIsPracticeMode(true);
        setPracticePassed(false);
        settingsVoice.playSound('success');
      }, 700);
    }
  };

  // Toggle Hotspot
  const handleToggleHotspot = () => {
    const nextHotspot = !phoneState.hotspotEnabled;
    settingsVoice.playSound('toggle');
    setPhoneState((prev) => ({
      ...prev,
      hotspotEnabled: nextHotspot,
      connectedDevices: nextHotspot ? ["Priya's Tablet (1.2 MB shared)"] : [],
    }));

    // Check practice task
    if (isPracticeMode && currentLesson?.practiceTask.targetSetting === 'hotspot') {
      if (nextHotspot === currentLesson.practiceTask.desiredValue) {
        settingsVoice.playSound('success');
        setPracticePassed(true);
      }
    } else if (currentStep?.expectedAction === 'TOGGLE_HOTSPOT') {
      setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
        settingsVoice.playSound('success');
      }, 500);
    }
  };

  // Cycle Sound Mode: sound -> vibrate -> silent -> sound
  const handleCycleSoundMode = () => {
    const currentMode = phoneState.soundMode;
    let nextMode: SoundMode = 'sound';

    if (currentMode === 'sound') {
      nextMode = 'vibrate';
      settingsVoice.playSound('vibrate');
    } else if (currentMode === 'vibrate') {
      nextMode = 'silent';
      settingsVoice.playSound('mute');
    } else {
      nextMode = 'sound';
      settingsVoice.playSound('ringtone');
    }

    setPhoneState((prev) => ({
      ...prev,
      soundMode: nextMode,
    }));

    // Check practice task
    if (isPracticeMode && currentLesson?.practiceTask.targetSetting === 'sound') {
      if (nextMode === currentLesson.practiceTask.desiredValue) {
        settingsVoice.playSound('success');
        setPracticePassed(true);
      }
    } else if (currentStep?.expectedAction === 'CYCLE_SOUND') {
      setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
        settingsVoice.playSound('success');
      }, 400);
    }
  };

  // Try Again / Reset Lesson
  const handleTryAgain = () => {
    settingsVoice.playSound('toggle');
    setCurrentStepIndex(0);
    setIsPracticeMode(false);
    setPracticePassed(false);
    setAppTestFeedback(null);
  };

  // Advance to Next Step / Next Lesson
  const handleNextStepOrLesson = () => {
    settingsVoice.playSound('click');

    if (activeLessonId === 'quiz') return;

    if (isPracticeMode) {
      // Advance to next lesson
      if (activeLessonId < 5) {
        const nextId = (activeLessonId + 1) as LessonId;
        setActiveLessonId(nextId);
        setCurrentStepIndex(0);
        setIsPracticeMode(false);
        setPracticePassed(false);
      } else {
        // Move to Practice Quiz
        setActiveLessonId('quiz');
        setQuizIndex(0);
        setQuizScore(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setQuizCompleted(false);
      }
      return;
    }

    if (currentLesson && currentStepIndex < currentLesson.learnSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Start practice task for this lesson
      setIsPracticeMode(true);
      setPracticePassed(false);
    }
  };

  // Go to previous step or lesson
  const handleBackStepOrLesson = () => {
    settingsVoice.playSound('click');
    if (isPracticeMode) {
      setIsPracticeMode(false);
      setPracticePassed(false);
      return;
    }

    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else if (typeof activeLessonId === 'number' && activeLessonId > 1) {
      setActiveLessonId((activeLessonId - 1) as LessonId);
      setCurrentStepIndex(0);
      setIsPracticeMode(false);
    } else if (activeLessonId === 'quiz') {
      setActiveLessonId(5);
      setIsPracticeMode(true);
    }
  };

  // Handle Home Screen App Clicks to demonstrate internet dependence
  const handleTestAppClick = (appName: string) => {
    settingsVoice.playSound('click');
    const isOnline = phoneState.mobileDataEnabled || phoneState.connectedWifi !== null;

    if (isOnline) {
      const connName = phoneState.connectedWifi ? `Wi-Fi (${phoneState.connectedWifi})` : 'Mobile Data (4G)';
      setAppTestFeedback(`✓ ${appName}: Connected via ${connName}. Internet is working fast!`);
    } else {
      setAppTestFeedback(`⚠️ ${appName}: No Internet! Swipe down from top and turn on Mobile Data or Wi-Fi.`);
    }

    setTimeout(() => {
      setAppTestFeedback(null);
    }, 4000);
  };

  // Quiz Question Submission
  const handleAnswerQuiz = (optIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(optIndex);
    setShowExplanation(true);

    const q = SETTINGS_QUIZ_QUESTIONS[quizIndex];
    if (optIndex === q.correctIndex) {
      settingsVoice.playSound('success');
      setQuizScore((prev) => prev + 1);
    } else {
      settingsVoice.playSound('click');
    }
  };

  const handleNextQuizQuestion = () => {
    settingsVoice.playSound('click');
    if (quizIndex < SETTINGS_QUIZ_QUESTIONS.length - 1) {
      setQuizIndex(quizIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
      settingsVoice.playSound('success');
      onComplete?.();
    }
  };

  // Progress Calculation
  const getOverallProgressPercentage = () => {
    if (activeLessonId === 'quiz') {
      return 100;
    }
    const lessonNum = typeof activeLessonId === 'number' ? activeLessonId : 1;
    const base = (lessonNum - 1) * 20;
    const stepRatio = isPracticeMode
      ? 18
      : ((currentStepIndex + 1) / (currentLesson?.learnSteps.length || 3)) * 15;
    return Math.min(Math.round(base + stepRatio), 95);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none relative overflow-x-hidden">
      {/* Top Main Navigation Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-3 py-2.5 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2.5">
          {onBackToMainMenu && (
            <button
              data-demo-id="phone-settings-back-btn"
              onClick={() => {
                settingsVoice.stop();
                onBackToMainMenu();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700 cursor-pointer min-h-[38px]"
              title="Return to Learning Path"
            >
              <ArrowLeft className="w-4 h-4 text-amber-300" />
              <span>{t('Back to Path', 'பயணப்பாதைக்குத் திரும்பு', 'लर्निंग पाथ')}</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Smartphone Settings Master</span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-400 font-semibold px-2 py-0.5 rounded-full border border-blue-500/30">
                    5 Lessons + Quiz
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-400">
                {t(
                  'Learn Mobile Data, Torch, Wi-Fi, Hotspot & Silent Mode',
                  'டேட்டா, டார்ச், வைஃபை, ஹாட்ஸ்பாட் & சைலண்ட் மோடு பயிற்சி',
                  'मोबाइल डेटा, टॉर्च, वाई-फाई, हॉटस्पॉट और साइलेंट मोड सीखें'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Right side controls: Audio toggle & Language Switcher */}
        <div className="flex items-center gap-2">
          {/* Quick other simulators dropdown */}
          <div className="hidden md:flex items-center gap-1 text-xs text-slate-400 mr-2 border-r border-slate-800 pr-3">
            {onSwitchToWhatsApp && (
              <button
                onClick={() => {
                  settingsVoice.stop();
                  onSwitchToWhatsApp();
                }}
                className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              >
                💬 WhatsApp
              </button>
            )}
            {onSwitchToMaps && (
              <button
                onClick={() => {
                  settingsVoice.stop();
                  onSwitchToMaps();
                }}
                className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              >
                🗺️ Maps
              </button>
            )}
          </div>

          {/* Ask Selvi */}
          <button
            onClick={() => {
              settingsVoice.stop();
              setIsAskSelviOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition cursor-pointer shadow-xs active:scale-95 border border-amber-300"
            title="Ask Selvi"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>{language === 'ta' ? 'செல்வி உதவி' : language === 'hi' ? 'सेल्वी से पूछें' : 'Ask Selvi'}</span>
          </button>

          {/* Voice Narration Audio Toggle */}
          <button
            onClick={handleToggleMute}
            className={`p-2 rounded-xl border transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
              isVoiceMuted
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
            }`}
            title={isVoiceMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
            <span className="hidden sm:inline">{isVoiceMuted ? 'Muted' : 'Voice On'}</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            {(['ta', 'hi', 'en'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  language === lang
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang === 'ta' ? 'தமிழ்' : lang === 'hi' ? 'हिंदी' : 'English'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Lesson Selector Ribbon & Progress Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full">
          {SETTINGS_LESSONS.map((lesson) => {
            const isActive = activeLessonId === lesson.id;
            return (
              <button
                key={lesson.id}
                onClick={() => {
                  settingsVoice.playSound('click');
                  setActiveLessonId(lesson.id);
                  setCurrentStepIndex(0);
                  setIsPracticeMode(false);
                  setPracticePassed(false);
                }}
                className={`px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap text-xs ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>{lesson.icon}</span>
                <span className="hidden sm:inline">{lesson.title[language].split(' ')[0]}</span>
                <span className="sm:hidden">{lesson.number}</span>
              </button>
            );
          })}

          {/* Quiz Button */}
          <button
            onClick={() => {
              settingsVoice.playSound('click');
              setActiveLessonId('quiz');
              setQuizIndex(0);
              setQuizScore(0);
              setSelectedAnswer(null);
              setShowExplanation(false);
              setQuizCompleted(false);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap text-xs ${
              activeLessonId === 'quiz'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-800/80 text-amber-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t('Quiz & Certificate', 'வினாடி வினா & சான்றிதழ்', 'क्विज़ और प्रमाण पत्र')}</span>
          </button>
        </div>

        {/* Replay Speech Button */}
        <button
          onClick={handleReplayVoice}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0"
          title="Replay Voice Audio"
        >
          <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
          <span>{t('Replay Voice', 'குரலை மீண்டும் கேள்', 'आवाज़ दोबारा सुनें')}</span>
        </button>
      </div>

      {/* Progress Bar Line */}
      <div className="w-full bg-slate-900 h-1.5 relative overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400 transition-all duration-500"
          style={{ width: `${getOverallProgressPercentage()}%` }}
        />
      </div>

      {/* Main Learning & Simulation Area */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center p-2 sm:p-4 gap-4 max-w-6xl mx-auto w-full">
        {/* Left Column: AI Mentor Guidance, Multilingual Subtitles & Lesson Roadmap */}
        <div className="w-full lg:w-96 flex flex-col gap-3 order-2 lg:order-1">
          {/* AI Mentor Card (Selvi) */}
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-xl relative overflow-hidden text-left">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-600" />

            <div className="flex items-center gap-3 mb-2.5">
              <div className="relative">
                <img
                  src="/selvi_avatar.jpg"
                  alt="Mentor Selvi"
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/avatar_mentor.png';
                  }}
                />
                {isSpeaking && (
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 items-center justify-center">
                      <Volume2 className="w-2.5 h-2.5 text-white" />
                    </span>
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-white text-sm">
                    {t('AI Mentor Selvi', 'ஆசிரியை செல்வி', 'मार्गदर्शक सेलवी')}
                  </h3>
                  <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-md font-semibold">
                    {t('Settings Guide', 'அமைப்புகள் வழிகாட்டி', 'सेटिंग्स गाइड')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {currentLesson ? currentLesson.title[language] : t('Practice Quiz', 'பயிற்சி வினாடி வினா', 'अभ्यास क्विज़')}
                </p>
              </div>
            </div>

            {/* Multilingual Voice Subtitles Banner */}
            <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 mb-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-blue-400 mb-1">
                <span>{t('VOICE GUIDANCE & SUBTITLE', 'குரல் வழிகாட்டுதல் & வாசகம்', 'आवाज़ और उपशीर्षक')}</span>
                {isSpeaking && (
                  <span className="flex items-center gap-1 text-[10px] text-blue-400 animate-pulse">
                    <span>●</span> {t('Speaking...', 'பேசுகிறது...', 'बोल रहा है...')}
                  </span>
                )}
              </div>
              <p className="text-white text-sm sm:text-base font-medium leading-snug">
                {activeLessonId === 'quiz'
                  ? quizCompleted
                    ? t(
                        `Quiz completed! You scored ${quizScore} out of 5. Claim your certificate below.`,
                        `தேர்வு முடிந்தது! நீங்கள் 5க்கு ${quizScore} மதிப்பெண் பெற்றுள்ளீர்கள். சான்றிதழைப் பெறுங்கள்.`,
                        `क्विज़ पूरा हुआ! आपने 5 में से ${quizScore} अंक प्राप्त किए हैं। नीचे प्रमाण पत्र देखें।`
                      )
                    : SETTINGS_QUIZ_QUESTIONS[quizIndex]?.question[language]
                  : isPracticeMode
                  ? currentLesson?.practiceTask.prompt[language]
                  : currentStep?.subtitles[language]}
              </p>
            </div>

            {/* Active Action Prompt Badge */}
            {currentStep && !isPracticeMode && (
              <div className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/40 rounded-xl p-2.5 text-xs text-blue-200">
                <span className="text-base animate-bounce">👉</span>
                <span className="font-extrabold text-blue-100">
                  {currentStep.actionBadge[language]}
                </span>
              </div>
            )}

            {/* Practice Task Success Alert */}
            {isPracticeMode && practicePassed && (
              <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-2.5 text-xs text-emerald-200 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="flex-1">
                  <span className="font-extrabold text-emerald-300 block">
                    {t('Practice Completed!', 'பயிற்சி வெற்றி!', 'अभ्यास पूरा हुआ!')}
                  </span>
                  <span>{currentLesson?.practiceTask.successMessage[language]}</span>
                </div>
              </div>
            )}

            {/* Lightbulb Digital Literacy Tip */}
            {currentStep?.tip && !isPracticeMode && (
              <div className="mt-2.5 flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 text-xs text-amber-200">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-300">
                    {t('Smart Tip: ', 'பயனுள்ள குறிப்பு: ', 'जरूरी सलाह: ')}
                  </span>
                  <span>{currentStep.tip[language]}</span>
                </div>
              </div>
            )}
          </div>

          {/* Controller Step Buttons: Back, Try Again, Next */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleBackStepOrLesson}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('Back', 'பின்செல்', 'पीछे')}</span>
            </button>

            <button
              onClick={handleTryAgain}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              title="Reset current step"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('Try Again', 'மீண்டும் செய்', 'दोबारा')}</span>
            </button>

            <button
              onClick={handleNextStepOrLesson}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-lg cursor-pointer ${
                isPracticeMode && !practicePassed
                  ? 'bg-slate-700 text-slate-400'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-700/30 ring-2 ring-blue-400/30'
              }`}
            >
              <span>
                {isPracticeMode
                  ? activeLessonId === 5
                    ? t('Take Quiz', 'வினாடி வினா தொடங்கு', 'क्विज़ शुरू करें')
                    : t('Next Lesson', 'அடுத்த பாடம்', 'अगला पाठ')
                  : t('Next Step', 'அடுத்த படி', 'आगे बढ़ें')}
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick settings test app triggers (YouTube / WhatsApp) */}
          <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800 text-xs text-left">
            <span className="font-bold text-slate-300 block mb-1">
              {t('Test Internet Connection with Sample Apps:', 'இன்டர்நெட்டை சோதிக்க செயலிகளைத் தொடவும்:', 'इंटरनेट की जांच के लिए ऐप्स छुएं:')}
            </span>
            <div className="flex items-center gap-2 mt-1.5">
              <button
                onClick={() => handleTestAppClick('WhatsApp')}
                className="flex-1 py-1.5 px-2 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-600/40 text-emerald-300 rounded-lg font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={() => handleTestAppClick('YouTube')}
                className="flex-1 py-1.5 px-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-600/40 text-rose-300 rounded-lg font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>YouTube</span>
              </button>
            </div>

            {appTestFeedback && (
              <div className="mt-2 p-2 bg-slate-950 rounded-lg border border-slate-700 text-[11px] font-bold text-slate-200">
                {appTestFeedback}
              </div>
            )}
          </div>
        </div>

        {/* Center Column: Realistic Smartphone Mockup */}
        <div className="w-full max-w-[390px] h-[720px] max-h-[85vh] bg-black rounded-[42px] p-3 shadow-2xl border-4 border-slate-800 flex flex-col relative select-none order-1 lg:order-2">
          {/* Simulated Torch Light Beam Animation (illuminating above/behind phone) */}
          {phoneState.torchEnabled && (
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-80 h-36 bg-gradient-to-t from-amber-300/40 via-yellow-200/20 to-transparent pointer-events-none rounded-t-full blur-md animate-pulse z-0" />
          )}

          {/* Phone Shell Top Speaker & Camera Punch Hole */}
          <div className="w-full flex items-center justify-between px-6 py-1 shrink-0 z-30">
            <span className="text-[11px] font-semibold text-slate-300">10:30</span>
            <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-700 relative">
              {phoneState.torchEnabled && (
                <div className="absolute inset-0 rounded-full bg-yellow-400 blur-xs animate-ping" />
              )}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-300">
              {phoneState.wifiEnabled && (
                <Wifi className="w-3 h-3 text-white" />
              )}
              {phoneState.mobileDataEnabled && (
                <span className="font-extrabold text-[9px] text-white bg-blue-600 px-1 rounded-2xs">
                  4G
                </span>
              )}
              {phoneState.hotspotEnabled && (
                <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
              )}
              {phoneState.soundMode === 'vibrate' && (
                <Vibrate className="w-3 h-3 text-amber-300" />
              )}
              {phoneState.soundMode === 'silent' && (
                <VolumeX className="w-3 h-3 text-rose-400" />
              )}
              <div className="w-4 h-2 border border-slate-400 rounded-xs relative ml-0.5">
                <div className="h-full bg-emerald-400 w-3/4 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* Smartphone Screen Viewport */}
          <div className="flex-1 bg-slate-950 rounded-[32px] overflow-hidden flex flex-col relative shadow-inner text-slate-100">
            {/* ------------------------------------------------------------------ */}
            {/* VIEW A: INTERACTIVE PRACTICE QUIZ & CERTIFICATE MODE */}
            {/* ------------------------------------------------------------------ */}
            {activeLessonId === 'quiz' ? (
              <div className="flex-1 p-4 bg-slate-900 flex flex-col justify-between overflow-y-auto text-left">
                {!quizCompleted ? (
                  <>
                    <div>
                      {/* Quiz Header */}
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                        <span className="font-extrabold text-xs text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-amber-400" />
                          <span>{t('Settings Practice Quiz', 'அமைப்புகள் வினாடி வினா', 'सेटिंग्स क्विज़')}</span>
                        </span>
                        <span className="text-xs bg-slate-800 px-2.5 py-0.5 rounded-full font-bold text-slate-300">
                          {quizIndex + 1} / {SETTINGS_QUIZ_QUESTIONS.length}
                        </span>
                      </div>

                      {/* Question Text */}
                      <h3 className="font-extrabold text-sm text-white leading-snug mb-3">
                        {SETTINGS_QUIZ_QUESTIONS[quizIndex].question[language]}
                      </h3>

                      {/* Multiple Choice Options */}
                      <div className="space-y-2">
                        {SETTINGS_QUIZ_QUESTIONS[quizIndex].options[language].map((opt, optIdx) => {
                          const isCorrect = optIdx === SETTINGS_QUIZ_QUESTIONS[quizIndex].correctIndex;
                          const isChosen = selectedAnswer === optIdx;

                          let btnStyle = 'bg-slate-800 hover:bg-slate-700/80 text-slate-200 border-slate-700';
                          if (showExplanation) {
                            if (isCorrect) {
                              btnStyle = 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold';
                            } else if (isChosen) {
                              btnStyle = 'bg-rose-600/30 border-rose-500 text-rose-200';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleAnswerQuiz(optIdx)}
                              className={`w-full p-2.5 rounded-xl border text-left text-xs transition cursor-pointer flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {showExplanation && isCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation Box */}
                      {showExplanation && (
                        <div className="mt-3 p-3 bg-blue-950/60 border border-blue-800/80 rounded-xl text-xs text-blue-200 animate-fade-in">
                          <span className="font-bold text-blue-300 block mb-0.5">
                            {t('Explanation:', 'விளக்கம்:', 'स्पष्टीकरण:')}
                          </span>
                          <span>{SETTINGS_QUIZ_QUESTIONS[quizIndex].explanation[language]}</span>
                        </div>
                      )}
                    </div>

                    {showExplanation && (
                      <div className="pt-3">
                        <button
                          onClick={handleNextQuizQuestion}
                          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>{t('Continue', 'அடுத்து', 'आगे बढ़ें')}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  // Quiz Certificate Celebration
                  <div className="flex-1 flex flex-col justify-between text-center py-2">
                    <div>
                      <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-400 flex items-center justify-center mx-auto mb-2 shadow-lg">
                        <Award className="w-8 h-8" />
                      </div>

                      <h3 className="font-black text-lg text-white">
                        {t('Settings Master Certificate!', 'ஸ்மார்ட்போன் அமைப்புகள் சான்றிதழ்!', 'स्मार्टफोन सेटिंग्स प्रमाण पत्र!')}
                      </h3>

                      <p className="text-xs text-slate-400 mt-1">
                        {t(
                          `You scored ${quizScore}/5 and learned all 5 core phone settings!`,
                          `நீங்கள் 5க்கு ${quizScore} மதிப்பெண் பெற்று 5 முக்கிய அமைப்புகளையும் கற்றுக்கொண்டீர்கள்!`,
                          `आपने 5 में से ${quizScore} अंक प्राप्त करके सभी 5 महत्वपूर्ण सेटिंग्स सीख लीं!`
                        )}
                      </p>

                      {/* Certificate Box */}
                      <div className="mt-4 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 border-2 border-amber-400/80 rounded-2xl p-4 shadow-xl text-left">
                        <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2">
                          <span className="font-extrabold text-[11px] text-amber-300 uppercase tracking-wider">
                            FirstTap Digital Literacy
                          </span>
                          <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                            Verified ✓
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 mb-1">
                          {t('Certified Skill: ', 'கற்ற திறன்: ', 'प्रमाणित कौशल: ')}
                          <b className="text-white">Android Quick Settings Master</b>
                        </p>
                        <p className="text-[11px] text-slate-400">
                          ✓ Mobile Data (4G/5G) • ✓ Flashlight Torch • ✓ Wi-Fi • ✓ Hotspot • ✓ Sound/Silent
                        </p>

                        <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                          <span>100% In-Browser Simulation</span>
                          <span className="text-emerald-400 font-bold">100% Confident</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-3">
                      <button
                        onClick={() => {
                          settingsVoice.playSound('click');
                          settingsVoice.stop();
                          onComplete?.();
                          if (onSwitchToWhatsApp) {
                            onSwitchToWhatsApp();
                          } else if (onBackToMainMenu) {
                            onBackToMainMenu();
                          }
                        }}
                        className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-xl transition cursor-pointer flex items-center justify-center gap-2 active:scale-95 border-2 border-emerald-400"
                      >
                        <Check className="w-4 h-4 text-emerald-200" />
                        <span>{t('Continue to WhatsApp Lessons (W0) →', 'அடுத்த பாடம்: வாட்ஸ்அப் பயணம் தொடங்க →', 'अगला पाठ: व्हाट्सएप एडवेंचर शुरू करें →')}</span>
                      </button>

                      {onBackToMainMenu && (
                        <button
                          onClick={() => {
                            settingsVoice.stop();
                            onComplete?.();
                            onBackToMainMenu();
                          }}
                          className="w-full py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition cursor-pointer"
                        >
                          {t('Back to Learning Path', 'கற்றல் பாதைக்குத் திரும்பு', 'लर्निंग पाथ पर वापस')}
                        </button>
                      )}

                      <button
                        onClick={() => {
                          settingsVoice.playSound('click');
                          setActiveLessonId(1);
                          setCurrentStepIndex(0);
                          setIsPracticeMode(false);
                          setPracticePassed(false);
                        }}
                        className="w-full py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold text-xs border border-slate-800 transition cursor-pointer"
                      >
                        {t('Restart All Lessons', 'அனைத்துப் பாடங்களையும் மீண்டும் பார்க்க', 'सभी पाठ दोबारा देखें')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ------------------------------------------------------------------ */
              /* VIEW B: REALISTIC SMARTPHONE SCREEN WITH SWIPE-DOWN QUICK SETTINGS */
              /* ------------------------------------------------------------------ */
              <div className="flex-1 flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950">
                {/* 1. TOP STATUS BAR SWIPE HANDLE TRIGGER */}
                <div
                  id="quick-settings-handle"
                  onClick={handleToggleQuickSettings}
                  className={`w-full py-2 px-3 flex flex-col items-center justify-center cursor-pointer transition select-none z-20 ${
                    currentStep?.expectedAction === 'SWIPE_DOWN'
                      ? 'bg-blue-600/30 border-b-2 border-blue-400 animate-pulse'
                      : 'bg-black/40 hover:bg-black/60 border-b border-white/10'
                  }`}
                  title="Swipe down or tap to open Quick Settings"
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-200">
                    {phoneState.isQuickSettingsOpen ? (
                      <>
                        <ChevronUp className="w-4 h-4 text-blue-400" />
                        <span>{t('Tap to close Quick Settings', 'மூட தொடவும்', 'बंद करने के लिए टैप करें')}</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 text-blue-400 animate-bounce" />
                        <span>
                          {currentStep?.expectedAction === 'SWIPE_DOWN'
                            ? `👇 ${t('SWIPE DOWN / TAP HERE', 'மேலிருந்து கீழே இழுக்கவும்', 'यहाँ नीचे खींचें')}`
                            : t('Quick Settings (Swipe Down)', 'விரைவு அமைப்புகள் (கீழே இழுக்கவும்)', 'त्वरित सेटिंग्स (नीचे खींचें)')}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="w-12 h-1 bg-white/30 rounded-full mt-1" />
                </div>

                {/* 2. QUICK SETTINGS TRAY (SLIDES DOWN OVER HOME SCREEN) */}
                {phoneState.isQuickSettingsOpen ? (
                  <div className="flex-1 bg-slate-900/95 backdrop-blur-md p-3 flex flex-col justify-between overflow-y-auto text-left z-10 animate-fade-in border-b border-slate-700">
                    <div>
                      {/* Tray Header: Clock & Brightness Slider */}
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs text-slate-300">
                        <span className="font-bold">10:30 AM • Wed, Oct 14</span>
                        <div className="flex items-center gap-1.5">
                          <Sun className="w-3.5 h-3.5 text-amber-400" />
                          <input
                            type="range"
                            min="20"
                            max="100"
                            value={phoneState.brightness}
                            onChange={(e) =>
                              setPhoneState({ ...phoneState, brightness: Number(e.target.value) })
                            }
                            className="w-20 h-1.5 bg-slate-700 rounded-lg accent-amber-400 cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Quick Settings Toggle Tiles Grid (2x3) */}
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {/* TILE 1: MOBILE DATA */}
                        <button
                          id="tile-mobile-data"
                          onClick={handleToggleMobileData}
                          className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition cursor-pointer border relative ${
                            phoneState.mobileDataEnabled
                              ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/30'
                              : 'bg-slate-800/80 text-slate-400 border-slate-700'
                          } ${
                            currentStep?.expectedAction === 'TOGGLE_DATA' ||
                            (isPracticeMode && currentLesson?.practiceTask.targetSetting === 'data')
                              ? 'ring-4 ring-blue-400/80 animate-pulse'
                              : ''
                          }`}
                        >
                          <Radio className="w-5 h-5" />
                          <span className="text-[11px] font-bold">
                            {t('Mobile Data', 'மொபைல் டேட்டா', 'मोबाइल डेटा')}
                          </span>
                          <span className="text-[9px] font-semibold opacity-80">
                            {phoneState.mobileDataEnabled ? 'Jio 4G (ON)' : 'OFF'}
                          </span>
                        </button>

                        {/* TILE 2: TORCH / FLASHLIGHT */}
                        <button
                          id="tile-torch"
                          onClick={handleToggleTorch}
                          className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition cursor-pointer border relative ${
                            phoneState.torchEnabled
                              ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/40 font-extrabold'
                              : 'bg-slate-800/80 text-slate-400 border-slate-700'
                          } ${
                            currentStep?.expectedAction === 'TOGGLE_TORCH' ||
                            (isPracticeMode && currentLesson?.practiceTask.targetSetting === 'torch')
                              ? 'ring-4 ring-amber-400/80 animate-pulse'
                              : ''
                          }`}
                        >
                          <Flashlight className={`w-5 h-5 ${phoneState.torchEnabled ? 'animate-bounce' : ''}`} />
                          <span className="text-[11px] font-bold">
                            {t('Flashlight', 'டார்ச்', 'टॉर्च')}
                          </span>
                          <span className="text-[9px] font-semibold opacity-90">
                            {phoneState.torchEnabled ? 'ON (Bright)' : 'OFF'}
                          </span>
                        </button>

                        {/* TILE 3: WI-FI */}
                        <button
                          id="tile-wifi"
                          onClick={handleToggleWifi}
                          className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition cursor-pointer border relative ${
                            phoneState.wifiEnabled
                              ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/30'
                              : 'bg-slate-800/80 text-slate-400 border-slate-700'
                          } ${
                            currentStep?.expectedAction === 'TOGGLE_WIFI' ||
                            (isPracticeMode && currentLesson?.practiceTask.targetSetting === 'wifi')
                              ? 'ring-4 ring-blue-400/80 animate-pulse'
                              : ''
                          }`}
                        >
                          {phoneState.wifiEnabled ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                          <span className="text-[11px] font-bold">
                            {t('Wi-Fi', 'வைஃபை', 'वाई-फाई')}
                          </span>
                          <span className="text-[9px] font-semibold opacity-80 truncate max-w-full px-1">
                            {phoneState.wifiEnabled
                              ? phoneState.connectedWifi
                                ? 'Connected'
                                : 'ON (Scanning)'
                              : 'OFF'}
                          </span>
                        </button>

                        {/* TILE 4: HOTSPOT */}
                        <button
                          id="tile-hotspot"
                          onClick={handleToggleHotspot}
                          className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition cursor-pointer border relative ${
                            phoneState.hotspotEnabled
                              ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/30'
                              : 'bg-slate-800/80 text-slate-400 border-slate-700'
                          } ${
                            currentStep?.expectedAction === 'TOGGLE_HOTSPOT' ||
                            (isPracticeMode && currentLesson?.practiceTask.targetSetting === 'hotspot')
                              ? 'ring-4 ring-indigo-400/80 animate-pulse'
                              : ''
                          }`}
                        >
                          <Share2 className="w-5 h-5" />
                          <span className="text-[11px] font-bold">
                            {t('Hotspot', 'ஹாட்ஸ்பாட்', 'हॉटस्पॉट')}
                          </span>
                          <span className="text-[9px] font-semibold opacity-80">
                            {phoneState.hotspotEnabled ? '1 Connected' : 'OFF'}
                          </span>
                        </button>

                        {/* TILE 5: SOUND / VIBRATE / SILENT MODE */}
                        <button
                          id="tile-sound"
                          onClick={handleCycleSoundMode}
                          className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition cursor-pointer border relative ${
                            phoneState.soundMode === 'sound'
                              ? 'bg-emerald-600 text-white border-emerald-400'
                              : phoneState.soundMode === 'vibrate'
                              ? 'bg-amber-600 text-white border-amber-400'
                              : 'bg-rose-700 text-white border-rose-400'
                          } ${
                            currentStep?.expectedAction === 'CYCLE_SOUND' ||
                            (isPracticeMode && currentLesson?.practiceTask.targetSetting === 'sound')
                              ? 'ring-4 ring-emerald-300 animate-pulse'
                              : ''
                          }`}
                        >
                          {phoneState.soundMode === 'sound' && <Volume2 className="w-5 h-5" />}
                          {phoneState.soundMode === 'vibrate' && <Vibrate className="w-5 h-5 animate-pulse" />}
                          {phoneState.soundMode === 'silent' && <VolumeX className="w-5 h-5" />}
                          <span className="text-[11px] font-bold">
                            {phoneState.soundMode === 'sound'
                              ? t('Sound', 'ஒலி', 'साउंड')
                              : phoneState.soundMode === 'vibrate'
                              ? t('Vibrate', 'அதிர்வு', 'वाइब्रेट')
                              : t('Silent', 'அமைதி', 'साइलेंट')}
                          </span>
                          <span className="text-[9px] font-semibold opacity-90">
                            {t('Tap to change', 'மாற்ற தொடவும்', 'बदलने के लिए टैप करें')}
                          </span>
                        </button>

                        {/* TILE 6: AIRPLANE MODE (FOR REALISM) */}
                        <div className="p-3 rounded-2xl bg-slate-800/40 text-slate-500 border border-slate-700/60 flex flex-col items-center justify-center gap-1.5 opacity-60">
                          <Plane className="w-5 h-5" />
                          <span className="text-[11px] font-bold">{t('Aeroplane', 'விமானம்', 'एरोप्लेन')}</span>
                          <span className="text-[9px]">OFF</span>
                        </div>
                      </div>

                      {/* CONTEXTUAL DETAIL DRAWER (Wi-Fi Networks / Hotspot Details / Torch status) */}
                      {phoneState.wifiEnabled && (
                        <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800 mb-2">
                          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[11px] text-slate-400 font-bold mb-2">
                            <span>{t('Available Wi-Fi Networks', 'கிடைக்கும் வைஃபை இணைப்புகள்', 'उपलब्ध वाई-फाई नेटवर्क')}</span>
                            <span className="text-blue-400 animate-pulse">● Scanning</span>
                          </div>

                          <div className="space-y-1.5">
                            {/* Network 1: Home_Fiber_5G */}
                            <button
                              id="network-home-fiber"
                              onClick={() => handleConnectWifi('Home_Fiber_5G')}
                              className={`w-full p-2 rounded-xl flex items-center justify-between text-xs transition cursor-pointer border ${
                                phoneState.connectedWifi === 'Home_Fiber_5G'
                                  ? 'bg-blue-600/30 border-blue-400 text-blue-200 font-bold'
                                  : 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300'
                              } ${
                                currentStep?.expectedAction === 'CONNECT_WIFI'
                                  ? 'ring-2 ring-blue-400 animate-pulse'
                                  : ''
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Wifi className="w-4 h-4 text-blue-400" />
                                <span>Home_Fiber_5G</span>
                              </div>
                              {phoneState.connectedWifi === 'Home_Fiber_5G' ? (
                                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                                  ✓ Connected, Secured
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400">{t('Tap to Connect', 'இணைக்க', 'जोड़ें')}</span>
                              )}
                            </button>

                            {/* Network 2: Sharma_Stores_Free */}
                            <button
                              onClick={() => handleConnectWifi('Sharma_Stores_Free')}
                              className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 flex items-center justify-between text-xs transition cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <Wifi className="w-4 h-4 text-slate-500" />
                                <span>Sharma_Stores_Free</span>
                              </div>
                              <span className="text-[10px] text-slate-500">Secured</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Hotspot details banner */}
                      {phoneState.hotspotEnabled && (
                        <div className="bg-indigo-950/60 rounded-2xl p-3 border border-indigo-800/80 mb-2 text-xs">
                          <div className="flex items-center justify-between font-bold text-indigo-300 mb-1">
                            <span>{t('Hotspot Sharing Active', 'ஹாட்ஸ்பாட் இயங்குகிறது', 'हॉटस्पॉट शेयरिंग चालू')}</span>
                            <span className="text-emerald-400 text-[10px]">1 Device</span>
                          </div>
                          <p className="text-[11px] text-slate-300">
                            {t('Network Name: ', 'பெயர்: ', 'नाम: ')}
                            <b>MyPhone_Hotspot</b> • {t('Password: ', 'கடவுச்சொல்: ', 'पासवर्ड: ')}
                            <b>kanna1234</b>
                          </p>
                          <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-indigo-200 bg-indigo-900/40 p-1.5 rounded-lg border border-indigo-700/50">
                            <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Connected: <b>Priya's Tablet</b> (Sharing 1.2 MB data)</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Pull Up To Close Quick Settings Handle */}
                    <div
                      onClick={handleToggleQuickSettings}
                      className="py-2 text-center text-xs text-slate-400 hover:text-white cursor-pointer border-t border-slate-800 flex items-center justify-center gap-1"
                    >
                      <ChevronUp className="w-4 h-4" />
                      <span>{t('Close Quick Settings', 'அமைப்புகளை மூடு', 'सेटिंग्स बंद करें')}</span>
                    </div>
                  </div>
                ) : (
                  /* ------------------------------------------------------------- */
                  /* SIMULATED ANDROID PHONE HOME SCREEN */
                  /* ------------------------------------------------------------- */
                  <div className="flex-1 p-4 flex flex-col justify-between text-center relative">
                    {/* Clock & Date Widget */}
                    <div className="pt-6">
                      <div className="text-4xl font-light tracking-tight text-white drop-shadow-md">
                        10:30
                      </div>
                      <div className="text-xs text-slate-300 mt-1 font-medium">
                        Wednesday, October 14
                      </div>

                      {/* Status pill on Home screen */}
                      <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs text-slate-200">
                        {phoneState.mobileDataEnabled || phoneState.connectedWifi ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>
                              {phoneState.connectedWifi
                                ? `Wi-Fi: ${phoneState.connectedWifi}`
                                : 'Mobile Data: Jio 4G Active'}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 rounded-full bg-rose-400" />
                            <span>{t('Offline (No Internet)', 'ஆஃப்லைன் (இன்டர்நெட் இல்லை)', 'ऑफ़लाइन (इंटरनेट नहीं है)')}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Google Search Widget */}
                    <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 flex items-center justify-between text-xs text-slate-300 mx-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-400">G</span>
                        <span>{t('Search apps & web', 'செயலிகளைத் தேடவும்', 'ऐप्स खोजें')}</span>
                      </div>
                      <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                    </div>

                    {/* App Grid on Home Screen */}
                    <div className="grid grid-cols-4 gap-4 pb-4 px-1">
                      {/* App 1: Phone */}
                      <div
                        onClick={() => handleTestAppClick('Phone Calls')}
                        className="flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-md">
                          <Phone className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] text-slate-300">Phone</span>
                      </div>

                      {/* App 2: WhatsApp */}
                      <div
                        onClick={() => handleTestAppClick('WhatsApp')}
                        className="flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md relative">
                          <MessageSquare className="w-5 h-5" />
                          {!(phoneState.mobileDataEnabled || phoneState.connectedWifi) && (
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                              !
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-300">WhatsApp</span>
                      </div>

                      {/* App 3: Camera */}
                      <div
                        onClick={() => handleTestAppClick('Camera')}
                        className="flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-slate-700 text-white flex items-center justify-center shadow-md">
                          <Camera className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] text-slate-300">Camera</span>
                      </div>

                      {/* App 4: YouTube */}
                      <div
                        onClick={() => handleTestAppClick('YouTube')}
                        className="flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md relative">
                          <Play className="w-5 h-5" />
                          {!(phoneState.mobileDataEnabled || phoneState.connectedWifi) && (
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                              !
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-300">YouTube</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Android Navigation Bar (Back, Home, Recent) */}
          <div className="h-6 flex items-center justify-around px-12 shrink-0 z-30 pt-1">
            <button
              onClick={() => {
                settingsVoice.playSound('click');
                if (phoneState.isQuickSettingsOpen) {
                  setPhoneState({ ...phoneState, isQuickSettingsOpen: false });
                } else {
                  handleBackStepOrLesson();
                }
              }}
              className="text-slate-400 hover:text-white"
            >
              ◀
            </button>
            <button
              onClick={() => {
                settingsVoice.playSound('click');
                setPhoneState({ ...phoneState, isQuickSettingsOpen: false });
              }}
              className="text-slate-400 hover:text-white text-xs font-bold"
            >
              ●
            </button>
            <button
              onClick={() => {
                settingsVoice.playSound('click');
                handleToggleQuickSettings();
              }}
              className="text-slate-400 hover:text-white"
            >
              ■
            </button>
          </div>
        </div>
      </div>

      {/* Ask Selvi Out-of-the-box LLM Doubt Modal */}
      <AskSelviModal
        isOpen={isAskSelviOpen}
        onClose={() => setIsAskSelviOpen(false)}
        language={language}
        lessonId={`SETTINGS_${activeLessonId}`}
        lessonTitle={currentLesson ? currentLesson.title[language] : 'Smartphone Basics Quiz'}
        currentStepInstruction={
          currentStep ? currentStep.subtitles[language] : 'Practicing smartphone settings and quick toggles'
        }
        contextPrompt={`Smartphone Settings Lesson: ${
          currentLesson ? currentLesson.title[language] : 'Basics Review'
        }. Wi-Fi, Mobile Data, Hotspot, Torch, Sound Modes.`}
      />
    </div>
  );
};
