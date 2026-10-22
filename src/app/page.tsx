'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FirstTapFSM, FSMTransitionResult } from '@/lib/fsm/machine';
import { VoiceEngine } from '@/lib/voice/engine';
import {
  FSMState,
  MascotMood,
  SupportedLanguage,
  VoiceEngineState,
  LearnerProfile,
  WhatsAppSegmentId,
  SpamStepId,
  BusinessLessonId,
} from '@/types';
import { Mascot } from '@/components/Mascot';
import { VoiceVisualizer } from '@/components/VoiceVisualizer';
import { Captions } from '@/components/Captions';
import { Header } from '@/components/Header';
import { ControlBar } from '@/components/ControlBar';
import { PermissionModal } from '@/components/PermissionModal';
import {
  Sparkles,
  Trophy,
  CheckCircle,
  AlertTriangle,
  Globe,
  ShieldCheck,
  Smartphone,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Store,
  Briefcase,
  Compass,
  Star,
  Crown,
  Play,
  Award,
  CheckCircle2,
  Volume2,
} from 'lucide-react';
import { FirstTapWhatsApp, WhatsAppPathScreen, AskSelviModal } from '@/components/whatsapp';
import { FirstTapSpamModule, SpamPathScreen } from '@/components/spam';
import {
  BusinessPathScreen,
  WhatsAppBusinessSimulatorScreen,
  GoogleMapsSimulatorScreen,
} from '@/components/business';
import { saveLearnerProfileToFirestore, getLearnerProfileFromFirestore } from '@/lib/firebase';
import { PhoneSettingsSimulatorScreen } from '@/components/phone-settings';
import { UI_TRANSLATIONS } from '@/lib/i18n/translations';
import { CATEGORIES_META, LEARNING_PATHS_META } from '@/lib/lessons/catalog';
import { logger } from '@/lib/logger';

export default function FirstTapApp() {
  const [fsm] = useState(() => new FirstTapFSM());
  const [fsmState, setFsmState] = useState<FSMState>('GREETING');
  const [voiceState, setVoiceState] = useState<VoiceEngineState>('IDLE');
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en-IN');

  // Global "Ask Selvi" LLM Modal State (available across assessment & all simulation paths)
  const [isGlobalAskSelviOpen, setIsGlobalAskSelviOpen] = useState(false);
  const [globalAskSelviContext, setGlobalAskSelviContext] = useState<string>('FirstTap Digital Literacy');
  const [globalAskSelviLessonId, setGlobalAskSelviLessonId] = useState<string>('OVERVIEW');
  const [globalAskSelviTitle, setGlobalAskSelviTitle] = useState<string>('Ask Selvi');
  const [mascotMood, setMascotMood] = useState<MascotMood>('welcome');
  const [audioAmplitude, setAudioAmplitude] = useState<number>(0);

  const [mascotSpeech, setMascotSpeech] = useState<string>('');
  const [recognizedUserSpeech, setRecognizedUserSpeech] = useState<string>('');
  const [captionsEnabled, setCaptionsEnabled] = useState<boolean>(true);
  const [isApiMode, setIsApiMode] = useState<boolean>(false);
  const [consecutiveRetries, setConsecutiveRetries] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [audioStatus, setAudioStatus] = useState<'idle' | 'preparing' | 'speaking' | 'blocked' | 'error' | 'replay'>('idle');

  // Profile save state
  const [learnerProfile, setLearnerProfile] = useState<LearnerProfile | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);
  const [selectedWhatsAppSegmentId, setSelectedWhatsAppSegmentId] = useState<WhatsAppSegmentId | undefined>(undefined);
  const [selectedSpamStepId, setSelectedSpamStepId] = useState<SpamStepId | undefined>(undefined);
  const [selectedBusinessLessonId, setSelectedBusinessLessonId] = useState<BusinessLessonId | undefined>(undefined);

  const voiceEngineRef = useRef<VoiceEngine | null>(null);
  const isProcessingRef = useRef<boolean>(false);

  // Restore saved learner profile and support query param state & browser history navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const stateParam = params.get('state');
        if (stateParam) {
          setFsmState(stateParam as FSMState);
          setHasStarted(true);
        }

        const savedLang = localStorage.getItem('firsttap_preferred_language');
        if (savedLang && (savedLang === 'ta-IN' || savedLang === 'hi-IN' || savedLang === 'en-IN')) {
          setCurrentLanguage(savedLang as SupportedLanguage);
          fsm.setSession({ language: savedLang as SupportedLanguage });
        }

        const saved = localStorage.getItem('firsttap_learner_profile');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed) {
            setLearnerProfile(parsed);
            if (parsed.preferred_language) {
              setCurrentLanguage(parsed.preferred_language);
              fsm.setSession({ language: parsed.preferred_language });
              localStorage.setItem('firsttap_preferred_language', parsed.preferred_language);
            }
          }
        } else {
          // Attempt recovery from Cloud Firestore
          getLearnerProfileFromFirestore().then((cloudProfile) => {
            if (cloudProfile) {
              setLearnerProfile(cloudProfile);
              if (cloudProfile.preferred_language) {
                setCurrentLanguage(cloudProfile.preferred_language);
                fsm.setSession({ language: cloudProfile.preferred_language });
              }
              if (typeof window !== 'undefined') {
                localStorage.setItem('firsttap_learner_profile', JSON.stringify(cloudProfile));
              }
            }
          });
        }
      } catch (err) {
        console.warn('[FirstTap] Could not restore profile or state from URL:', err);
      }
    }

    const handlePopState = (event: PopStateEvent) => {
      voiceEngineRef.current?.stopSpeaking();
      voiceEngineRef.current?.stopListening();

      const stateFromHistory = event.state?.state;
      if (stateFromHistory) {
        setFsmState(stateFromHistory as FSMState);
      } else {
        const params = new URLSearchParams(window.location.search);
        const stateParam = params.get('state');
        if (stateParam) {
          setFsmState(stateParam as FSMState);
        } else {
          setFsmState('GREETING');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Persist learner profile to backend API, localStorage, and Cloud Firestore
  const persistLearnerProfile = useCallback(async (profile: LearnerProfile) => {
    setIsSavingProfile(true);
    setSaveStatus(null);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('firsttap_learner_profile', JSON.stringify(profile));
      }

      // Sync to Firebase Cloud Firestore
      saveLearnerProfileToFirestore(profile);

      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });

      if (res.ok) {
        setSaveStatus('success');
      } else {
        console.warn('[FirstTap] Backend profile save returned non-200');
        setSaveStatus('error');
      }
    } catch (err) {
      console.error('[FirstTap] Profile persistence error:', err);
      setSaveStatus('error');
    } finally {
      setIsSavingProfile(false);
    }
  }, []);

  // Keep learnerProfile.preferred_language synchronized with currentLanguage if a profile exists
  useEffect(() => {
    if (learnerProfile && learnerProfile.preferred_language !== currentLanguage) {
      const updatedProfile = { ...learnerProfile, preferred_language: currentLanguage };
      setLearnerProfile(updatedProfile);
      persistLearnerProfile(updatedProfile);
    }
  }, [currentLanguage]);

  // Synchronize state and trigger voice output
  const executeTransition = useCallback(
    (transition: FSMTransitionResult) => {
      setFsmState(transition.nextState);
      const session = transition.updatedSession;
      if (session.language) {
        setCurrentLanguage(session.language);
        if (learnerProfile && learnerProfile.preferred_language !== session.language) {
          setLearnerProfile((prev) => (prev ? { ...prev, preferred_language: session.language } : null));
        }
      }
      setConsecutiveRetries(session.consecutiveRetries);
      logger.logFSMState(transition.nextState, transition.expectedInputType || 'none');

      // Clear previous question's recognized transcript when moving to a new question prompt
      if (
        transition.nextState === 'ASKING_NAME' ||
        transition.nextState === 'ASKING_PHONE_INDEPENDENCE' ||
        transition.nextState === 'ASKING_LEARNING_GOAL' ||
        transition.nextState === 'ASKING_BRANCH_QUESTION' ||
        transition.nextState === 'GREETING' ||
        transition.nextState === 'LANGUAGE_OPTIONS'
      ) {
        setRecognizedUserSpeech('');
      }

      if (session.learnerProfile) {
        setLearnerProfile(session.learnerProfile);
        if (transition.nextState === 'ASSESSMENT_COMPLETE') {
          persistLearnerProfile(session.learnerProfile);
        }
      }

      if (transition.suggestedMood) {
        setMascotMood(transition.suggestedMood);
      } else if (transition.action === 'CELEBRATE') {
        setMascotMood('happy');
      }

      // Check if multi-lingual speech sequence is specified (e.g. for language selection)
      if (transition.speechSequence && transition.speechSequence.length > 0) {
        setMascotSpeech(transition.speechToSpeak);

        if (voiceEngineRef.current) {
          voiceEngineRef.current.speakSequence(
            transition.speechSequence,
            () => {
              // Sequence finished: transition to WAITING_FOR_LANGUAGE and start listening
              fsm.setState('WAITING_FOR_LANGUAGE');
              setFsmState('WAITING_FOR_LANGUAGE');
              triggerListening(session.language, true);
            }
          );
        }
      } else if (transition.speechToSpeak) {
        setMascotSpeech(transition.speechToSpeak);

        // Character speaks the speech
        if (voiceEngineRef.current) {
          voiceEngineRef.current.speak(
            transition.speechToSpeak,
            session.language,
            () => {
              // After speech completes, determine next automatic voice behavior
              if (
                transition.nextState === 'GREETING' ||
                transition.nextState === 'APP_START'
              ) {
                // Auto move to language options
                const langPrompt = fsm.moveToLanguageSelect();
                executeTransition(langPrompt);
              } else if (transition.nextState === 'ASKING_NAME') {
                fsm.setState('WAITING_FOR_NAME');
                setFsmState('WAITING_FOR_NAME');
                setMascotMood('waiting');
                triggerListening(session.language, false);
              } else if (transition.nextState === 'ASKING_PHONE_INDEPENDENCE') {
                fsm.setState('WAITING_FOR_PHONE_ANSWER');
                setFsmState('WAITING_FOR_PHONE_ANSWER');
                setMascotMood('waiting');
                triggerListening(session.language, false);
              } else if (transition.nextState === 'ASKING_LEARNING_GOAL') {
                fsm.setState('WAITING_FOR_LEARNING_GOAL');
                setFsmState('WAITING_FOR_LEARNING_GOAL');
                setMascotMood('waiting');
                triggerListening(session.language, false);
              } else if (transition.nextState === 'ASKING_BRANCH_QUESTION') {
                fsm.setState('WAITING_FOR_BRANCH_ANSWER');
                setFsmState('WAITING_FOR_BRANCH_ANSWER');
                setMascotMood('waiting');
                triggerListening(session.language, false);
              } else if (transition.expectedInputType !== 'none') {
                setMascotMood('waiting');
                triggerListening(
                  session.language,
                  transition.expectedInputType === 'language'
                );
              }
            }
          );
        }
      }
    },
    [fsm, persistLearnerProfile]
  );

  // Start listening for user speech
  const triggerListening = useCallback(
    (lang: SupportedLanguage, isLanguageSelect: boolean = false) => {
      if (!voiceEngineRef.current) return;

      const mode = isLanguageSelect ? 'language' : 'normal';
      const targetLang = isLanguageSelect ? 'en-IN' : lang;

      voiceEngineRef.current.startListening(mode, targetLang, (transcribedText) => {
        setRecognizedUserSpeech(transcribedText);

        if (!transcribedText || transcribedText.trim() === '') {
          // Empty or silence -> process empty input for polite encouraging retry
          setMascotMood('retry');
          const retryRes = fsm.processInput('');
          executeTransition(retryRes);
          return;
        }

        // Process recognized speech through FSM
        setMascotMood('thinking');
        handleUserSpokenInput(transcribedText);
      });
    },
    [fsm, executeTransition]
  );

  // Handles transcribed text through FSM
  const handleUserSpokenInput = useCallback(
    (text: string) => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      try {
        const result = fsm.processInput(text);
        executeTransition(result);
      } finally {
        setTimeout(() => {
          isProcessingRef.current = false;
        }, 300);
      }
    },
    [fsm, executeTransition]
  );

  // Expose test hook for voice simulation testing in headless/browser environments
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__firstTapSimulateVoiceInput = (text: string) => {
        setRecognizedUserSpeech(text);
        handleUserSpokenInput(text);
      };
      (window as any).__firstTapGetFSM = () => fsm;
      (window as any).__firstTapSpeak = (text: string, lang?: SupportedLanguage) => {
        voiceEngineRef.current?.speak(text, lang || currentLanguage);
      };
      (window as any).__firstTapPlayTamil = () => {
        voiceEngineRef.current?.speak('வணக்கம்! நாம் தமிழில் தொடர்ந்து கற்கலாம். மிக்க மகிழ்ச்சி! உங்கள் பெயர் என்ன?', 'ta-IN');
      };
      (window as any).__firstTapSetSpeaker = (speaker: string) => {
        voiceEngineRef.current?.setSpeaker(speaker);
        console.log('[FirstTap] Active speaker set to:', speaker);
      };
      (window as any).__firstTapSetState = (st: any) => {
        setFsmState(st);
      };
    }
  }, [handleUserSpokenInput, fsm]);

  // Initialize VoiceEngine on mount
  useEffect(() => {
    const engine = new VoiceEngine({
      onStateChange: (newState) => {
        setVoiceState(newState);
        if (
          newState === 'SPEAKING' ||
          newState === 'PLAYING_LANGUAGE_OPTIONS' ||
          newState === 'WAITING_FOR_AUDIO_TO_FINISH'
        ) {
          setMascotMood('speaking');
        } else if (
          newState === 'STARTING_MICROPHONE' ||
          newState === 'STOPPING_RECORDING' ||
          newState === 'TRANSCRIBING' ||
          newState === 'DETECTING_LANGUAGE' ||
          newState === 'UNDERSTANDING'
        ) {
          setMascotMood('thinking');
        } else if (newState === 'LISTENING') {
          setMascotMood('listening');
        } else if (newState === 'LANGUAGE_CONFIRMED') {
          setMascotMood('happy');
        } else if (newState === 'RETRY') {
          setMascotMood('retry');
        } else if (newState === 'IDLE' && fsm.getState() !== 'ASSESSMENT_COMPLETE') {
          setMascotMood('idle');
        }
      },
      onAudioAmplitude: (amp) => {
        setAudioAmplitude(amp);
      },
      onTranscriptionComplete: (text, isMock) => {
        setRecognizedUserSpeech(text);
        setIsApiMode(!isMock);
      },
      onSpeechStarted: () => {
        setMascotMood('speaking');
      },
      onSpeechEnded: () => {
        setAudioAmplitude(0);
      },
      onError: (errMsg) => {
        console.warn('Voice Engine Error:', errMsg);
      },
      onAudioStatusChange: (status) => {
        setAudioStatus(status);
      },
    });

    voiceEngineRef.current = engine;

    return () => {
      engine.cleanup();
    };
  }, [fsm]);

  // Handle Initial User Click on "Start FirstTap" Modal
  const handleStartApp = async () => {
    setHasStarted(true);
    setMascotMood('welcome');
    if (voiceEngineRef.current) {
      await voiceEngineRef.current.initializeMicrophone();
    }
    const startRes = fsm.startApp();
    executeTransition(startRes);
  };

  // Manual Microphone Button Click (toggle listening / speaking)
  const handleMicClick = () => {
    if (!voiceEngineRef.current) return;

    if (voiceState === 'LISTENING') {
      voiceEngineRef.current.stopListening();
      setMascotMood('idle');
    } else if (voiceState === 'SPEAKING') {
      voiceEngineRef.current.stopSpeaking();
      triggerListening(currentLanguage);
    } else {
      triggerListening(currentLanguage);
    }
  };

  // Stop speaking
  const handleStopSpeaking = () => {
    if (voiceEngineRef.current) {
      voiceEngineRef.current.stopSpeaking();
    }
  };

  // Repeat current prompt
  const handleRepeatPrompt = () => {
    setMascotMood('speaking');
    const repeatRes = fsm.processInput('repeat');
    executeTransition(repeatRes);
  };

  // Ask question / doubt - opens LLM powered Ask Selvi modal
  const handleAskQuestion = (context?: string, lessonId?: string, title?: string) => {
    if (voiceEngineRef.current) {
      voiceEngineRef.current.cancelListening();
      voiceEngineRef.current.stopSpeaking();
    }
    setGlobalAskSelviContext(context || `FirstTap voice session: ${fsmState}`);
    setGlobalAskSelviLessonId(lessonId || 'DOUBT');
    setGlobalAskSelviTitle(title || 'Ask Selvi');
    setIsGlobalAskSelviOpen(true);
  };

  // Manual language switch from header or module
  const handleManualLanguageChange = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('firsttap_preferred_language', lang);
    }
    if (learnerProfile) {
      const updatedProfile: LearnerProfile = { ...learnerProfile, preferred_language: lang };
      setLearnerProfile(updatedProfile);
      persistLearnerProfile(updatedProfile);
    }
    const res = fsm.setLanguageManually(lang);
    executeTransition(res);
  };

  // Manual option selection (accessible button click fallback & text input during assessment)
  const handleSelectOptionManually = (text: string) => {
    // 1. Immediately abort active microphone recording and cancel timers so silent audio NEVER triggers "I can't hear you"
    if (voiceEngineRef.current) {
      voiceEngineRef.current.cancelListening();
      voiceEngineRef.current.stopSpeaking();
    }
    isProcessingRef.current = false;

    if (
      fsmState === 'WAITING_FOR_LANGUAGE' ||
      fsmState === 'LANGUAGE_OPTIONS' ||
      fsmState === 'LANGUAGE_SELECT'
    ) {
      let selectedLang: SupportedLanguage = 'en-IN';
      if (text.includes('தமிழ்') || text.toLowerCase().includes('tamil')) {
        selectedLang = 'ta-IN';
      } else if (text.includes('हिंदी') || text.toLowerCase().includes('hindi')) {
        selectedLang = 'hi-IN';
      } else if (text.toLowerCase().includes('english')) {
        selectedLang = 'en-IN';
      }
      setCurrentLanguage(selectedLang);
      if (typeof window !== 'undefined') {
        localStorage.setItem('firsttap_preferred_language', selectedLang);
      }
      fsm.setSession({ language: selectedLang });
      if (learnerProfile) {
        const updated = { ...learnerProfile, preferred_language: selectedLang };
        setLearnerProfile(updated);
        persistLearnerProfile(updated);
      }
    }
    setRecognizedUserSpeech(text);
    handleUserSpokenInput(text);
  };

  // Navigation helper supporting browser history Back/Forward
  const navigateToState = useCallback((nextState: FSMState, replace = false) => {
    voiceEngineRef.current?.stopSpeaking();
    voiceEngineRef.current?.stopListening();

    setFsmState(nextState);
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('state', nextState);
        if (replace) {
          window.history.replaceState({ state: nextState }, '', url.toString());
        } else {
          window.history.pushState({ state: nextState }, '', url.toString());
        }
      } catch (err) {
        console.warn('[FirstTap] Could not pushState:', err);
      }
    }
  }, []);

  // Category-based recommendation logic based on learner profile
  const recommendedPath: 'WHATSAPP' | 'SPAM' | 'BUSINESS' = React.useMemo(() => {
    if (!learnerProfile) return 'WHATSAPP';
    const cat = learnerProfile.primary_category;
    const goal = learnerProfile.learning_goal;
    const starting = learnerProfile.starting_learning_path;

    if (
      cat === 'MSME_LEARNER' ||
      goal === 'MSME_BUSINESS_SKILLS' ||
      starting === 'DIGITAL_BUSINESS_BASICS' ||
      starting === 'DIGITAL_BOOKKEEPING_AND_BUSINESS_TOOLS'
    ) {
      return 'BUSINESS';
    }

    if (
      cat === 'DIGITAL_PAYMENT_LEARNER' ||
      goal === 'DIGITAL_PAYMENTS' ||
      starting === 'DIGITAL_PAYMENTS_BASICS' ||
      starting === 'PAYMENT_VERIFICATION_AND_SAFETY'
    ) {
      return 'SPAM';
    }

    return 'WHATSAPP';
  }, [learnerProfile]);

  // Single source of truth for effective language: active session language takes precedence
  const effectiveLanguage: SupportedLanguage = currentLanguage || learnerProfile?.preferred_language || 'en-IN';

  // Exact personalized catchphrase specified in Part 1
  const recommendationGreeting = React.useMemo(() => {
    const name = learnerProfile?.name || (effectiveLanguage === 'ta-IN' ? 'கற்பவரே' : effectiveLanguage === 'hi-IN' ? 'शिक्षार्थी' : 'Learner');
    if (recommendedPath === 'BUSINESS') {
      return effectiveLanguage === 'ta-IN'
        ? `வணக்கம் ${name}! டிஜிட்டல் திறன்களுடன் உங்கள் வணிகத்தை வளர்ப்போம்!`
        : effectiveLanguage === 'hi-IN'
        ? `नमस्ते ${name}! आइए डिजिटल कौशल से अपने व्यवसाय को आगे बढ़ाएं!`
        : `Hello ${name}! Let's grow your business with digital skills!`;
    }
    if (recommendedPath === 'SPAM') {
      return effectiveLanguage === 'ta-IN'
        ? `வணக்கம் ${name}! மோசடிகளைக் கண்டறிந்து உங்கள் பணத்தைப் பாதுகாக்கக் கற்போம்!`
        : effectiveLanguage === 'hi-IN'
        ? `नमस्ते ${name}! आइए धोखाधड़ी पहचानना और अपने पैसे सुरक्षित रखना सीखें!`
        : `Hello ${name}! Let's learn to spot scams and protect your money!`;
    }
    const isBeginner = !learnerProfile?.primary_category || learnerProfile.primary_category === 'DIGITAL_BEGINNER';
    const isPhoneBasicsDone = Boolean(learnerProfile?.phone_settings_progress?.completed);

    if (isBeginner) {
      if (!isPhoneBasicsDone) {
        return effectiveLanguage === 'ta-IN'
          ? `வணக்கம் ${name}! உங்கள் போனிலிருந்து தொடங்குவோம்! வாட்ஸ்அப்பிற்குச் செல்வதற்கு முன் வைஃபை, மொபைல் இன்டர்நெட், ஹாட்ஸ்பாட் மற்றும் டார்ச் பற்றி அறிந்துகொள்ளுங்கள்.`
          : effectiveLanguage === 'hi-IN'
          ? `नमस्ते ${name}! आइए आपके फोन से शुरुआत करें! व्हाट्सएप पर जाने से पहले वाई-फाई, मोबाइल इंटरनेट, हॉटस्पॉट और टॉर्च सीखें।`
          : `Hello ${name}! Let's start with your phone! Learn Wi-Fi, mobile internet, hotspot and torch before moving on to WhatsApp.`;
      } else {
        return effectiveLanguage === 'ta-IN'
          ? `வணக்கம் ${name}! போன் அமைப்புகளை வெற்றிகரமாகக் கற்றுவிட்டீர்கள்! இப்போது வாட்ஸ்அப் முகப்புப் பக்கப் பயணத்தைத் தொடங்குவோம்!`
          : effectiveLanguage === 'hi-IN'
          ? `नमस्ते ${name}! आपने फोन सेटिंग्स सीख ली हैं! अब आइए व्हाट्सएप होम पेज टूर शुरू करें!`
          : `Hello ${name}! You mastered phone settings! Now let's continue to WhatsApp Home Page Tour (W0)!`;
      }
    }

    return effectiveLanguage === 'ta-IN'
      ? `வணக்கம் ${name}! போன் அமைப்புகள் மற்றும் அன்றாட தொடர்பு திறன்களைக் கற்போம்!`
      : effectiveLanguage === 'hi-IN'
      ? `नमस्ते ${name}! आइए फोन बेसिक्स और संचार कौशल सीखें, एक समय में एक कदम!`
      : `Hello ${name}! Let's learn smartphone basics and communication, one simple step at a time!`;
  }, [learnerProfile, recommendedPath, effectiveLanguage]);

  const t = UI_TRANSLATIONS[effectiveLanguage] || UI_TRANSLATIONS['en-IN'];

  const isDedicatedLearningModule =
    fsmState === 'PHONE_SETTINGS_MODULE' ||
    fsmState === 'WHATSAPP_PATH' ||
    fsmState === 'WHATSAPP_MODULE' ||
    fsmState === 'SPAM_PATH' ||
    fsmState === 'SPAM_MODULE' ||
    fsmState === 'BUSINESS_PATH' ||
    fsmState === 'BUSINESS_WA_MODULE' ||
    fsmState === 'BUSINESS_MAPS_MODULE';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EE] to-[#F5ECE0] flex flex-col justify-between font-sans selection:bg-amber-200">
      {/* 1. Header (Hidden during dedicated learning modules) */}
      {!isDedicatedLearningModule && (
        <Header
          currentLanguage={effectiveLanguage}
          onLanguageChange={handleManualLanguageChange}
          isApiMode={isApiMode}
        />
      )}

      {/* 2. Main Character & Interactive Stage */}
      <main
        className={
          isDedicatedLearningModule
            ? 'flex-1 w-full p-0 max-w-none'
            : 'flex-1 flex flex-col items-center justify-center p-3 sm:p-5 max-w-xl mx-auto w-full'
        }
      >
        {/* State Banner */}
        {!isDedicatedLearningModule && (
          <div className="mb-2 text-center">
            <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-slate-800/90 border border-amber-200/80 dark:border-slate-700 text-teal-800 dark:text-teal-300 shadow-sm backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-current" />
              <span>
                {t.stateBanners[fsmState] || t.stateBanners.APP_START}
              </span>
            </span>
          </div>
        )}

        {/* Mascot Centerpiece (Friendly Teacher) */}
        {!isDedicatedLearningModule && (
          <div className="my-1">
            <Mascot
              mood={mascotMood}
              isSpeaking={
                voiceState === 'SPEAKING' ||
                voiceState === 'PLAYING_LANGUAGE_OPTIONS' ||
                voiceState === 'WAITING_FOR_AUDIO_TO_FINISH'
              }
              isListening={voiceState === 'LISTENING'}
              amplitude={audioAmplitude}
              language={effectiveLanguage}
              audioStatus={audioStatus}
              onResumeAutoplay={() => voiceEngineRef.current?.resumeBlockedAudio()}
              onReplayPrompt={handleRepeatPrompt}
            />
          </div>
        )}

        {/* Spoken Speech Bubble directly under Teacher */}
        {mascotSpeech && fsmState !== 'ASSESSMENT_COMPLETE' && !isDedicatedLearningModule && (
          <div className="relative max-w-md w-full mx-auto mt-2 px-5 py-3.5 bg-white/95 dark:bg-slate-900/95 rounded-2xl border-2 border-amber-200/90 dark:border-slate-700 shadow-md backdrop-blur-sm text-center">
            <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 leading-snug">
              &ldquo;{mascotSpeech}&rdquo;
            </p>
          </div>
        )}

        {/* Audio Visualizer Waveform */}
        {fsmState !== 'ASSESSMENT_COMPLETE' && !isDedicatedLearningModule && (
          <VoiceVisualizer
            amplitude={audioAmplitude}
            isListening={voiceState === 'LISTENING'}
            isSpeaking={
              voiceState === 'SPEAKING' ||
              voiceState === 'PLAYING_LANGUAGE_OPTIONS' ||
              voiceState === 'WAITING_FOR_AUDIO_TO_FINISH'
            }
          />
        )}

        {/* Captions Subtitles */}
        {fsmState !== 'ASSESSMENT_COMPLETE' && !isDedicatedLearningModule && (
          <Captions
            mascotText={mascotSpeech}
            recognizedText={recognizedUserSpeech}
            enabled={captionsEnabled}
            onToggle={() => setCaptionsEnabled((prev) => !prev)}
            isTranscribing={
              voiceState === 'TRANSCRIBING' ||
              voiceState === 'STOPPING_RECORDING' ||
              voiceState === 'DETECTING_LANGUAGE'
            }
            language={effectiveLanguage}
          />
        )}

        {/* Module 1: Assessment Completion & Learner Profile Summary Card */}
        {fsmState === 'ASSESSMENT_COMPLETE' && (
          <div className="w-full max-w-xl mx-auto p-4 sm:p-6 mt-2 rounded-3xl bg-white/95 dark:bg-slate-900/95 border-2 border-amber-300 dark:border-slate-700 shadow-2xl space-y-5 text-slate-900 dark:text-slate-100 backdrop-blur-md">
            {/* Header Badge */}
            <div className="text-center space-y-1">
              <div className="inline-flex p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mb-1 shadow-sm">
                <Trophy className="w-8 h-8 fill-amber-400" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {t.assessmentSummary.heading}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {t.assessmentSummary.description}
              </p>
            </div>

            {/* Personalized Selvi Mentor Speech Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-teal-500/10 to-amber-500/10 border-2 border-amber-300/80 dark:border-amber-600/50 flex items-start space-x-3.5 shadow-sm">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-amber-100 dark:bg-slate-800 shrink-0 border border-amber-300 shadow-xs">
                <img
                  src="/selvi_avatar.png"
                  alt="Selvi Mascot"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to emoji if image fails to load
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-xl">👩‍🏫</span>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-teal-800 dark:text-teal-300">
                    {effectiveLanguage === 'ta-IN' ? 'செல்வி வழிகாட்டி' : effectiveLanguage === 'hi-IN' ? 'सेल्वी मेंटॉर' : 'Selvi Mentor'}
                  </span>
                  <button
                    onClick={() => {
                      voiceEngineRef.current?.speak(recommendationGreeting, effectiveLanguage);
                    }}
                    title={effectiveLanguage === 'ta-IN' ? 'கேட்க அழுத்தவும்' : 'Listen'}
                    className="p-1 rounded-lg bg-white/80 dark:bg-slate-800 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-snug">
                  &ldquo;{recommendationGreeting}&rdquo;
                </p>
              </div>
            </div>

            {/* Learner Profile Details Summary */}
            {learnerProfile && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 dark:bg-slate-800/60 border border-amber-200/60 dark:border-slate-700">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                    <span className="font-semibold text-slate-600 dark:text-slate-400">
                      {t.assessmentSummary.nameLabel}
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {learnerProfile.name}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 dark:bg-slate-800/60 border border-amber-200/60 dark:border-slate-700">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                    <span className="font-semibold text-slate-600 dark:text-slate-400">
                      {t.assessmentSummary.languageLabel}
                    </span>
                  </div>
                  <span className="font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[11px]">
                    {learnerProfile.preferred_language === 'ta-IN'
                      ? 'தமிழ்'
                      : learnerProfile.preferred_language === 'hi-IN'
                      ? 'हिंदी'
                      : 'English'}
                  </span>
                </div>

                <div className="sm:col-span-2 p-2.5 rounded-xl bg-amber-50/70 dark:bg-slate-800/60 border border-amber-200/60 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                    <span className="font-semibold text-slate-600 dark:text-slate-400">
                      {t.assessmentSummary.categoryLabel}:
                    </span>
                  </div>
                  <span className="font-bold px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-[11px]">
                    {CATEGORIES_META[learnerProfile.primary_category]?.title[effectiveLanguage] ||
                      learnerProfile.primary_category}
                  </span>
                </div>
              </div>
            )}

            {/* PART 1: ONE PROMINENT RECOMMENDED PATH HERO CARD */}
            <div className="pt-2">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400 animate-pulse" />
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  {effectiveLanguage === 'ta-IN'
                    ? 'உங்களுக்கான பரிந்துரைக்கப்பட்ட கற்றல் பயணம்'
                    : effectiveLanguage === 'hi-IN'
                    ? 'आपके लिए विशेष अनुशंसित लर्निंग एडवेंचर'
                    : 'Recommended Learning Adventure For You'}
                </h4>
              </div>

              {/* RECOMMENDED PATH 1: WHATSAPP / SMARTPHONE BASICS (Digital Beginners) */}
              {recommendedPath === 'WHATSAPP' && (() => {
                const isBeginner = !learnerProfile?.primary_category || learnerProfile.primary_category === 'DIGITAL_BEGINNER';
                const isPhoneBasicsDone = Boolean(learnerProfile?.phone_settings_progress?.completed);
                const completedSegments = learnerProfile?.whatsapp_progress?.completed_segments || [];
                const completedTotal = (isPhoneBasicsDone ? 1 : 0) + completedSegments.length;

                return (
                  <div className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-teal-50 via-emerald-50 to-teal-100/60 dark:from-teal-950/60 dark:via-emerald-950/50 dark:to-teal-900/40 border-3 border-teal-500 shadow-xl space-y-3.5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center font-bold shadow-md shadow-teal-500/20">
                          <Smartphone className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-500 text-white shadow-xs mb-1">
                            {effectiveLanguage === 'ta-IN' ? 'தொடங்க வேண்டிய பாதை' : effectiveLanguage === 'hi-IN' ? 'प्राथमिक पाथ' : 'Primary Path'}
                          </span>
                          <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                            {effectiveLanguage === 'ta-IN'
                              ? 'டிஜிட்டல் தொடக்கநிலை சாகசம் (9 பயிற்சிகள்)'
                              : effectiveLanguage === 'hi-IN'
                              ? 'डिजिटल बिगिनर एडवेंचर (9 पाठ)'
                              : 'Digital Beginner Adventure (9 Modules)'}
                          </h4>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                      {effectiveLanguage === 'ta-IN'
                        ? 'உங்கள் போனிலிருந்து தொடங்குவோம்! வைஃபை, மொபைல் இன்டர்நெட், ஹாட்ஸ்பாட், டார்ச் மற்றும் அன்றாட தொடர்பு பயிற்சிகளை எளிதாகக் கற்றுக்கொள்ளுங்கள்.'
                        : effectiveLanguage === 'hi-IN'
                        ? 'स्मार्टफोन बेसिक्स (वाई-फाई, मोबाइल डेटा, टॉर्च) और बातचीत के जरूरी टूल्स (मैसेज, वॉयस नोट्स, लोकेशन, कॉल्स) सीखें।'
                        : "Let's start with your phone! Learn Wi-Fi, mobile internet, hotspot and torch before moving on to everyday communication."}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300">
                        {completedTotal >= 9
                          ? (effectiveLanguage === 'ta-IN' ? '✅ முழுமையாக முடிந்தது' : effectiveLanguage === 'hi-IN' ? '✅ पूरा हो गया' : '✅ Completed')
                          : `${completedTotal} / 9 ${effectiveLanguage === 'ta-IN' ? 'முடிக்கப்பட்டது' : effectiveLanguage === 'hi-IN' ? 'पूर्ण' : 'Completed'}`}
                      </span>
                      <button
                        onClick={() => {
                          if (isBeginner && !isPhoneBasicsDone) {
                            navigateToState('PHONE_SETTINGS_MODULE');
                          } else {
                            navigateToState('WHATSAPP_PATH');
                          }
                        }}
                        className="min-h-[44px] py-2.5 px-6 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-teal-600/30 transition flex items-center justify-center space-x-2 cursor-pointer hover:scale-102 active:scale-98"
                      >
                        <span>
                          {isBeginner && !isPhoneBasicsDone
                            ? effectiveLanguage === 'ta-IN'
                              ? 'ஸ்மார்ட்போன் அடிப்படைகளைத் தொடங்கு'
                              : effectiveLanguage === 'hi-IN'
                              ? 'स्मार्टफोन बेसिक्स शुरू करें'
                              : 'Start Smartphone Basics'
                            : completedTotal > 0
                            ? effectiveLanguage === 'ta-IN'
                              ? 'பயணத்தை தொடரவும்'
                              : 'Continue Adventure'
                            : effectiveLanguage === 'ta-IN'
                            ? 'சாகசத்தை தொடங்கு'
                            : 'Start Adventure'}
                        </span>
                        <ArrowRight className="w-4 h-4 text-teal-100" />
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* RECOMMENDED PATH 2: SPAM & DIGITAL FRAUD (Digital Safety) */}
              {recommendedPath === 'SPAM' && (
                <div className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-red-50 via-amber-50 to-red-100/60 dark:from-red-950/60 dark:via-amber-950/50 dark:to-red-900/40 border-3 border-red-500 shadow-xl space-y-3.5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-red-500/20">
                        <ShieldAlert className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-600 text-white shadow-xs mb-1">
                          {effectiveLanguage === 'ta-IN' ? 'தொடங்க வேண்டிய பாதை' : effectiveLanguage === 'hi-IN' ? 'प्राथमिक पाथ' : 'Primary Path'}
                        </span>
                        <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                          {effectiveLanguage === 'ta-IN'
                            ? 'டிஜிட்டல் பாதுகாப்பு பயணம் (8 பயிற்சிகள்)'
                            : effectiveLanguage === 'hi-IN'
                            ? 'डिजिटल सुरक्षा क्वेस्ट (8 पाठ)'
                            : 'Digital Safety Quest (8 Lessons)'}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                    {effectiveLanguage === 'ta-IN'
                      ? 'போலி வங்கி அழைப்புகள், ஏடிஎம் பின் திருட்டு, லாட்டரி பொறிகள், எஸ்.எம்.எஸ் லிங்க், யுபிஐ க்யூஆர் மோசடி மற்றும் வாடிக்கையாளர் சேவை ஆள்மாறாட்ட பாதுகாப்புப் பயிற்சிகள்.'
                      : effectiveLanguage === 'hi-IN'
                      ? 'फर्जी बैंक कॉल, एटीएम पिन चोरी, लॉटरी फ्रॉड, एसएमएस लिंक, यूपीआई क्यूआर और बिजली बिल फ्रॉड से बचाव का संपूर्ण अभ्यास।'
                      : 'ATM PIN theft, OTP scams, fake lottery, screen share apps, suspicious links, UPI PIN fraud, and power cutoff impersonation.'}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-bold text-red-800 dark:text-red-300">
                      {learnerProfile?.spam_progress?.is_module_completed
                        ? effectiveLanguage === 'ta-IN'
                          ? '✅ முழுமையாக முடிந்தது'
                          : '✅ Completed'
                        : `${(learnerProfile?.spam_progress?.completed_steps || []).length} / 8 ${
                            effectiveLanguage === 'ta-IN' ? 'முடிக்கப்பட்டது' : 'Completed'
                          }`}
                    </span>
                    <button
                      onClick={() => {
                        navigateToState('SPAM_PATH');
                      }}
                      className="min-h-[44px] py-2.5 px-6 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-red-600/30 transition flex items-center justify-center space-x-2 cursor-pointer hover:scale-102 active:scale-98"
                    >
                      <span>
                        {(learnerProfile?.spam_progress?.completed_steps || []).length > 0
                          ? effectiveLanguage === 'ta-IN'
                            ? 'பயணத்தை தொடரவும்'
                            : 'Continue Quest'
                          : effectiveLanguage === 'ta-IN'
                          ? 'பாதுகாப்புப் பயணத்தை தொடங்கு'
                          : 'Start Safety Quest'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-amber-100" />
                    </button>
                  </div>
                </div>
              )}

              {/* RECOMMENDED PATH 3: MSME / BUSINESS GROWTH JOURNEY */}
              {recommendedPath === 'BUSINESS' && (
                <div className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100/60 dark:from-indigo-950/60 dark:via-purple-950/50 dark:to-indigo-900/40 border-3 border-indigo-500 shadow-xl space-y-3.5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20">
                        <Store className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-600 text-white shadow-xs mb-1">
                          {effectiveLanguage === 'ta-IN' ? 'தொடங்க வேண்டிய பாதை' : effectiveLanguage === 'hi-IN' ? 'प्राथमिक पाथ' : 'Primary Path'}
                        </span>
                        <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                          {effectiveLanguage === 'ta-IN'
                            ? 'வணிக வளர்ச்சிப் பயணம் (MSME)'
                            : effectiveLanguage === 'hi-IN'
                            ? 'व्यापार विकास यात्रा (MSME)'
                            : 'Business Growth Journey (MSME)'}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                    {effectiveLanguage === 'ta-IN'
                      ? 'உங்கள் வணிகம் வளர உதவும் எளிய டிஜிட்டல் திறன்களைக் கற்றுக்கொள்ளுங்கள்.'
                      : effectiveLanguage === 'hi-IN'
                      ? 'अपने व्यवसाय को बढ़ाने में मदद के लिए सरल डिजिटल कौशल सीखें।'
                      : 'Learn simple digital skills to help your business grow.'}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
                      🚀 {(learnerProfile?.business_progress?.completed_lessons || []).length}/2 {effectiveLanguage === 'ta-IN' ? 'முடிந்தது' : 'Completed'}
                    </span>
                    <button
                      onClick={() => {
                        navigateToState('BUSINESS_PATH');
                      }}
                      className="min-h-[44px] py-2.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2 cursor-pointer hover:scale-102 active:scale-98"
                    >
                      <span>
                        {effectiveLanguage === 'ta-IN' ? 'வணிகப் பயணத்தைத் தொடங்கு' : effectiveLanguage === 'hi-IN' ? 'व्यापार यात्रा शुरू करें' : 'Start Business Journey'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-indigo-100" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* PART 1: EXPLORE OTHER LEARNING QUESTS (Separate and Optional) */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Compass className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    {effectiveLanguage === 'ta-IN'
                      ? 'பிற கற்றல் பாதைகள் (விரும்பினால்)'
                      : effectiveLanguage === 'hi-IN'
                      ? 'अन्य लर्निंग पाथ्स (वैकल्पिक)'
                      : 'Explore Other Learning Quests (Optional)'}
                  </h4>
                </div>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                  {effectiveLanguage === 'ta-IN' ? 'உங்கள் விருப்பப்படி' : 'At your own pace'}
                </span>
              </div>

              <div className="space-y-2.5">
                {/* Secondary Option: Digital Beginner Adventure if not primary */}
                {recommendedPath !== 'WHATSAPP' && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:border-teal-300 dark:hover:border-teal-700 transition">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                          {effectiveLanguage === 'ta-IN'
                            ? 'டிஜிட்டல் தொடக்கநிலை சாகசம்'
                            : effectiveLanguage === 'hi-IN'
                            ? 'डिजिटल बिगिनर एडवेंचर'
                            : 'Digital Beginner Adventure'}
                        </h5>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                          {(learnerProfile?.phone_settings_progress?.completed ? 1 : 0) + (learnerProfile?.whatsapp_progress?.completed_segments || []).length}/9 {effectiveLanguage === 'ta-IN' ? 'முடிந்தது' : 'Completed'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigateToState('WHATSAPP_PATH')}
                      className="py-1.5 px-3 rounded-lg bg-teal-100 hover:bg-teal-200 dark:bg-teal-950 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-200 text-xs font-bold transition cursor-pointer flex items-center space-x-1"
                    >
                      <span>{effectiveLanguage === 'ta-IN' ? 'தொடங்கு' : 'Explore'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Secondary Option: Spam & Fraud if not primary */}
                {recommendedPath !== 'SPAM' && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:border-red-300 dark:hover:border-red-700 transition">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                          {effectiveLanguage === 'ta-IN'
                            ? 'டிஜிட்டல் பாதுகாப்பு பயணம்'
                            : effectiveLanguage === 'hi-IN'
                            ? 'डिजिटल सुरक्षा क्वेस्ट'
                            : 'Digital Safety Quest'}
                        </h5>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                          {(learnerProfile?.spam_progress?.completed_steps || []).length}/8 {effectiveLanguage === 'ta-IN' ? 'முடிந்தது' : 'Completed'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigateToState('SPAM_PATH')}
                      className="py-1.5 px-3 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-950 dark:hover:bg-red-900 text-red-800 dark:text-red-200 text-xs font-bold transition cursor-pointer flex items-center space-x-1"
                    >
                      <span>{effectiveLanguage === 'ta-IN' ? 'தொடங்கு' : 'Explore'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Secondary Option: MSME / Business if not primary */}
                {recommendedPath !== 'BUSINESS' && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        <Store className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                          {effectiveLanguage === 'ta-IN'
                            ? 'வணிக வளர்ச்சிப் பயணம் (MSME)'
                            : effectiveLanguage === 'hi-IN'
                            ? 'व्यापार विकास यात्रा (MSME)'
                            : 'Business Growth Journey (MSME)'}
                        </h5>
                        <span className="text-[10px] text-indigo-700 dark:text-indigo-400 block font-medium">
                          {(learnerProfile?.business_progress?.completed_lessons || []).length}/2 {effectiveLanguage === 'ta-IN' ? 'முடிந்தது' : 'Completed'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigateToState('BUSINESS_PATH')}
                      className="py-1.5 px-3 rounded-lg bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs font-bold transition cursor-pointer flex items-center space-x-1"
                    >
                      <span>{effectiveLanguage === 'ta-IN' ? 'காண்க' : 'Preview'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Persistence Status */}
            <div className="flex items-center justify-center space-x-1.5 text-[11px] font-medium pt-1">
              {isSavingProfile ? (
                <span className="text-amber-600 dark:text-amber-400 animate-pulse">
                  ⏳ {t.assessmentSummary.savingProfile}
                </span>
              ) : saveStatus === 'success' ? (
                <span className="text-emerald-700 dark:text-emerald-400 inline-flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{t.assessmentSummary.savedSuccess}</span>
                </span>
              ) : saveStatus === 'error' ? (
                <span className="text-rose-600 dark:text-rose-400 inline-flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{t.assessmentSummary.saveFailed}</span>
                </span>
              ) : null}
            </div>

            {/* Restart Button */}
            <button
              onClick={() => {
                setLearnerProfile(null);
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('firsttap_learner_profile');
                }
                const restartRes = fsm.startApp(currentLanguage);
                executeTransition(restartRes);
              }}
              className="w-full py-2.5 px-6 rounded-2xl bg-slate-950 dark:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md hover:bg-slate-900 dark:hover:bg-slate-700 transition-all cursor-pointer text-center"
            >
              {t.assessmentSummary.startAgainButton}
            </button>
          </div>
        )}

        {/* Module 1: Dedicated Smartphone Basics Simulation (Module 1 for Digital Beginners) */}
        {fsmState === 'PHONE_SETTINGS_MODULE' && (
          <div className="w-full min-h-screen flex flex-col items-center py-2 animate-in fade-in duration-200">
            {/* Prominent Sticky Back to Learning Path Button */}
            <div className="w-full max-w-4xl mx-auto mb-2 px-2 flex items-center justify-between">
              <button
                data-demo-id="global-back-to-phone-settings-path-btn"
                onClick={() => {
                  navigateToState('WHATSAPP_PATH');
                  setMascotMood('idle');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white text-xs sm:text-sm font-black shadow-lg border border-blue-500 cursor-pointer active:scale-95 transition min-h-[44px]"
                title="Return to Digital Beginner Learning Path"
              >
                <ArrowLeft className="w-4 h-4 text-amber-300" />
                <span>
                  {effectiveLanguage === 'ta-IN'
                    ? '← கற்றல் பாதைக்கு திரும்பு'
                    : effectiveLanguage === 'hi-IN'
                    ? '← लर्निंग पाथ पर वापस'
                    : '← Back to Learning Path'}
                </span>
              </button>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {effectiveLanguage === 'ta-IN'
                  ? 'ஸ்மார்ட்போன் அமைப்புகள் பாடம்'
                  : effectiveLanguage === 'hi-IN'
                  ? 'स्मार्टफोन सेटिंग्स पाठ'
                  : 'Smartphone Basics Lesson'}
              </span>
            </div>

            <PhoneSettingsSimulatorScreen
              language={effectiveLanguage === 'ta-IN' ? 'ta' : effectiveLanguage === 'hi-IN' ? 'hi' : 'en'}
              onBackToMainMenu={() => {
                navigateToState('WHATSAPP_PATH');
                setMascotMood('idle');
              }}
              onSwitchToWhatsApp={() => {
                setSelectedWhatsAppSegmentId('W0');
                navigateToState('WHATSAPP_MODULE');
              }}
              onSwitchToMaps={() => {
                setSelectedBusinessLessonId('google_maps');
                navigateToState('BUSINESS_MAPS_MODULE');
              }}
              onComplete={() => {
                if (learnerProfile) {
                  const updatedProfile: LearnerProfile = {
                    ...learnerProfile,
                    phone_settings_progress: {
                      completed: true,
                      last_active_at: new Date().toISOString(),
                    },
                  };
                  setLearnerProfile(updatedProfile);
                  persistLearnerProfile(updatedProfile);
                }
              }}
            />
          </div>
        )}

        {/* Module 2: Dedicated WhatsApp Learning Path Screen (Duolingo Style) */}
        {fsmState === 'WHATSAPP_PATH' && (
          <div className="w-full animate-in fade-in duration-200">
            <WhatsAppPathScreen
              language={effectiveLanguage}
              category={learnerProfile?.primary_category || 'DIGITAL_BEGINNER'}
              progress={learnerProfile?.whatsapp_progress}
              completedSegments={learnerProfile?.whatsapp_progress?.completed_segments || []}
              skippedSegments={learnerProfile?.whatsapp_progress?.skipped_segments || []}
              currentSegmentId={
                selectedWhatsAppSegmentId || learnerProfile?.whatsapp_progress?.current_segment_id
              }
              isPhoneBasicsCompleted={Boolean(learnerProfile?.phone_settings_progress?.completed)}
              learnerName={learnerProfile?.name}
              onSelectLesson={(lessonId) => {
                if (lessonId === 'phone_basics') {
                  navigateToState('PHONE_SETTINGS_MODULE');
                } else {
                  setSelectedWhatsAppSegmentId(lessonId as WhatsAppSegmentId);
                  navigateToState('WHATSAPP_MODULE');
                }
              }}
              onBack={() => {
                navigateToState('ASSESSMENT_COMPLETE');
                setMascotMood('idle');
              }}
              onOpenDoubt={() => {
                handleAskQuestion(
                  'Digital Beginner Adventure trail overview (Phone basics & communication)',
                  'BEGINNER_TRAIL',
                  'Digital Beginner Adventure'
                );
              }}
            />
          </div>
        )}

        {/* Module 2: Interactive WhatsApp Learning Simulator */}
        {fsmState === 'WHATSAPP_MODULE' && (
          <div className="w-full min-h-screen flex flex-col items-center py-2 animate-in fade-in duration-200">
            {/* Prominent Sticky Back to Learning Path Button */}
            <div className="w-full max-w-md mx-auto mb-2 px-2 flex items-center justify-between">
              <button
                data-demo-id="global-back-to-path-btn"
                onClick={() => {
                  navigateToState('WHATSAPP_PATH');
                  setMascotMood('idle');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-teal-800 hover:bg-teal-700 text-white text-xs sm:text-sm font-black shadow-lg border border-teal-500 cursor-pointer active:scale-95 transition"
                title="Return to WhatsApp Learning Path"
              >
                <ArrowLeft className="w-4 h-4 text-amber-300" />
                <span>
                  {effectiveLanguage === 'ta-IN'
                    ? '← கற்றல் பாதைக்கு திரும்பு'
                    : effectiveLanguage === 'hi-IN'
                    ? '← लर्निंग पाथ पर वापस'
                    : '← Back to Learning Path'}
                </span>
              </button>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {effectiveLanguage === 'ta-IN' ? 'வாட்ஸ்அப் பாடம்' : effectiveLanguage === 'hi-IN' ? 'व्हाट्सएप पाठ' : 'WhatsApp Lesson'}
              </span>
            </div>

            <FirstTapWhatsApp
              language={effectiveLanguage === 'ta-IN' ? 'ta' : effectiveLanguage === 'hi-IN' ? 'hi' : 'en'}
              category={learnerProfile?.primary_category || 'DIGITAL_BEGINNER'}
              initialSegmentId={
                selectedWhatsAppSegmentId || learnerProfile?.whatsapp_progress?.current_segment_id
              }
              completedSegments={learnerProfile?.whatsapp_progress?.completed_segments}
              skippedSegments={learnerProfile?.whatsapp_progress?.skipped_segments}
              onProgressUpdate={(progress) => {
                if (learnerProfile) {
                  const updatedProfile: LearnerProfile = {
                    ...learnerProfile,
                    whatsapp_progress: progress,
                  };
                  setLearnerProfile(updatedProfile);
                  persistLearnerProfile(updatedProfile);
                }
              }}
              onFinishModule={() => {
                if (learnerProfile) {
                  const updatedProfile: LearnerProfile = {
                    ...learnerProfile,
                    whatsapp_progress: {
                      ...(learnerProfile.whatsapp_progress || {
                        current_segment_id: 'W7',
                        completed_segments: ['W0', 'W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'],
                        skipped_segments: [],
                        attempts: [],
                        last_active_at: new Date().toISOString(),
                      }),
                      is_module_completed: true,
                    },
                  };
                  setLearnerProfile(updatedProfile);
                  persistLearnerProfile(updatedProfile);
                }
                navigateToState('WHATSAPP_PATH');
              }}
              onExit={() => {
                navigateToState('WHATSAPP_PATH');
                setMascotMood('idle');
              }}
            />
          </div>
        )}

        {/* Module 3: Dedicated Spam Message Safety Path Screen (Duolingo Style) */}
        {fsmState === 'SPAM_PATH' && (
          <div className="w-full animate-in fade-in duration-200">
            <SpamPathScreen
              language={effectiveLanguage}
              category={learnerProfile?.primary_category || 'DIGITAL_BEGINNER'}
              progress={learnerProfile?.spam_progress}
              completedSteps={learnerProfile?.spam_progress?.completed_steps || []}
              skippedSteps={learnerProfile?.spam_progress?.skipped_steps || []}
              currentStepId={
                selectedSpamStepId || learnerProfile?.spam_progress?.current_step_id
              }
              learnerName={learnerProfile?.name}
              onSelectStep={(stepId) => {
                setSelectedSpamStepId(stepId);
                navigateToState('SPAM_MODULE');
              }}
              onBack={() => {
                navigateToState('ASSESSMENT_COMPLETE');
                setMascotMood('idle');
              }}
            />
          </div>
        )}

        {/* Module 3: Interactive Spam Message Safety Simulator */}
        {fsmState === 'SPAM_MODULE' && (
          <div className="w-full min-h-screen flex flex-col items-center animate-in fade-in duration-200">
            <FirstTapSpamModule
              language={effectiveLanguage === 'ta-IN' ? 'ta' : effectiveLanguage === 'hi-IN' ? 'hi' : 'en'}
              category={learnerProfile?.primary_category || 'DIGITAL_BEGINNER'}
              initialStepId={
                selectedSpamStepId || learnerProfile?.spam_progress?.current_step_id || 1
              }
              completedSteps={learnerProfile?.spam_progress?.completed_steps || []}
              skippedSteps={learnerProfile?.spam_progress?.skipped_steps || []}
              onProgressUpdate={(progress) => {
                if (learnerProfile) {
                  const updatedProfile: LearnerProfile = {
                    ...learnerProfile,
                    spam_progress: progress,
                  };
                  setLearnerProfile(updatedProfile);
                  persistLearnerProfile(updatedProfile);
                }
              }}
              onFinishModule={() => {
                if (learnerProfile) {
                  const updatedProfile: LearnerProfile = {
                    ...learnerProfile,
                    spam_progress: {
                      ...(learnerProfile.spam_progress || {
                        current_step_id: 8,
                        completed_steps: [1, 2, 3, 4, 5, 6, 7, 8],
                        skipped_steps: [],
                        is_module_completed: true,
                        last_active_at: new Date().toISOString(),
                      }),
                      is_module_completed: true,
                    },
                  };
                  setLearnerProfile(updatedProfile);
                  persistLearnerProfile(updatedProfile);
                }
                navigateToState('SPAM_PATH');
              }}
              onExit={() => {
                navigateToState('SPAM_PATH');
                setMascotMood('idle');
              }}
              onOpenDoubt={() => {
                handleAskQuestion(
                  'Spam Call & Fraud Defense interactive practice screen',
                  'SPAM_DRILL',
                  'Digital Safety Simulation'
                );
              }}
            />
          </div>
        )}

        {/* Module 4: Dedicated Business Learning Path Screen */}
        {fsmState === 'BUSINESS_PATH' && (
          <div className="w-full animate-in fade-in duration-200">
            <BusinessPathScreen
              language={effectiveLanguage}
              category={learnerProfile?.primary_category || 'MSME_LEARNER'}
              progress={learnerProfile?.business_progress}
              completedLessons={learnerProfile?.business_progress?.completed_lessons || []}
              skippedLessons={learnerProfile?.business_progress?.skipped_lessons || []}
              currentLessonId={selectedBusinessLessonId || learnerProfile?.business_progress?.current_lesson_id}
              learnerName={learnerProfile?.name}
              onSelectLesson={(lessonId) => {
                setSelectedBusinessLessonId(lessonId);
                if (lessonId === 'wa_business') {
                  navigateToState('BUSINESS_WA_MODULE');
                } else if (lessonId === 'google_maps') {
                  navigateToState('BUSINESS_MAPS_MODULE');
                }
              }}
              onBack={() => {
                navigateToState('ASSESSMENT_COMPLETE');
                setMascotMood('idle');
              }}
              onOpenDoubt={() => {
                handleAskQuestion(
                  'Business Growth Journey for MSME (WhatsApp Business & Google Maps shop listing)',
                  'BUSINESS_GROWTH',
                  'Business Growth Journey'
                );
              }}
            />
          </div>
        )}

        {/* Module 4: Interactive WhatsApp Business Simulator */}
        {fsmState === 'BUSINESS_WA_MODULE' && (
          <div className="w-full min-h-screen flex flex-col items-center py-2 animate-in fade-in duration-200">
            {/* Prominent Sticky Back to Learning Path Button */}
            <div className="w-full max-w-4xl mx-auto mb-2 px-2 flex items-center justify-between">
              <button
                data-demo-id="global-back-to-business-path-btn"
                onClick={() => {
                  navigateToState('BUSINESS_PATH');
                  setMascotMood('idle');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-indigo-900 hover:bg-indigo-800 text-white text-xs sm:text-sm font-black shadow-lg border border-indigo-500 cursor-pointer active:scale-95 transition min-h-[44px]"
                title="Return to Business Growth Journey"
              >
                <ArrowLeft className="w-4 h-4 text-amber-300" />
                <span>
                  {effectiveLanguage === 'ta-IN'
                    ? '← வணிகப் பாதைக்கு திரும்பு'
                    : effectiveLanguage === 'hi-IN'
                    ? '← व्यापार पाथ पर वापस'
                    : '← Back to Learning Path'}
                </span>
              </button>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {effectiveLanguage === 'ta-IN'
                  ? 'வாட்ஸ்அப் வணிகப் பாடம்'
                  : effectiveLanguage === 'hi-IN'
                  ? 'व्हाट्सएप बिजनेस पाठ'
                  : 'WhatsApp Business Lesson'}
              </span>
            </div>

            <WhatsAppBusinessSimulatorScreen
              language={effectiveLanguage === 'ta-IN' ? 'ta' : effectiveLanguage === 'hi-IN' ? 'hi' : 'en'}
              onBackToMainMenu={() => {
                navigateToState('BUSINESS_PATH');
                setMascotMood('idle');
              }}
              onSwitchToMaps={() => {
                setSelectedBusinessLessonId('google_maps');
                navigateToState('BUSINESS_MAPS_MODULE');
              }}
              onSwitchToSpamCall={() => {
                navigateToState('SPAM_MODULE');
              }}
              onComplete={() => {
                if (learnerProfile) {
                  const currentCompleted = learnerProfile.business_progress?.completed_lessons || [];
                  const newCompleted = currentCompleted.includes('wa_business')
                    ? currentCompleted
                    : [...currentCompleted, 'wa_business' as BusinessLessonId];
                  const updatedProfile: LearnerProfile = {
                    ...learnerProfile,
                    business_progress: {
                      ...(learnerProfile.business_progress || {}),
                      current_lesson_id: 'google_maps',
                      completed_lessons: newCompleted,
                      completed_steps: newCompleted,
                      is_module_completed: newCompleted.length >= 2,
                      last_active_at: new Date().toISOString(),
                    },
                  };
                  setLearnerProfile(updatedProfile);
                  persistLearnerProfile(updatedProfile);
                }
              }}
            />
          </div>
        )}

        {/* Module 4: Interactive Google Maps Location Simulator */}
        {fsmState === 'BUSINESS_MAPS_MODULE' && (
          <div className="w-full min-h-screen flex flex-col items-center py-2 animate-in fade-in duration-200">
            {/* Prominent Sticky Back to Learning Path Button */}
            <div className="w-full max-w-4xl mx-auto mb-2 px-2 flex items-center justify-between">
              <button
                data-demo-id="global-back-to-maps-path-btn"
                onClick={() => {
                  navigateToState('BUSINESS_PATH');
                  setMascotMood('idle');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white text-xs sm:text-sm font-black shadow-lg border border-blue-500 cursor-pointer active:scale-95 transition min-h-[44px]"
                title="Return to Business Growth Journey"
              >
                <ArrowLeft className="w-4 h-4 text-amber-300" />
                <span>
                  {effectiveLanguage === 'ta-IN'
                    ? '← வணிகப் பாதைக்கு திரும்பு'
                    : effectiveLanguage === 'hi-IN'
                    ? '← व्यापार पाथ पर वापस'
                    : '← Back to Learning Path'}
                </span>
              </button>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {effectiveLanguage === 'ta-IN'
                  ? 'கூகுள் மேப்ஸ் பாடம்'
                  : effectiveLanguage === 'hi-IN'
                  ? 'गूगल मैप्स पाठ'
                  : 'Google Maps Lesson'}
              </span>
            </div>

            <GoogleMapsSimulatorScreen
              language={effectiveLanguage === 'ta-IN' ? 'ta' : effectiveLanguage === 'hi-IN' ? 'hi' : 'en'}
              onBackToMainMenu={() => {
                navigateToState('BUSINESS_PATH');
                setMascotMood('idle');
              }}
              onSwitchToWhatsApp={() => {
                setSelectedBusinessLessonId('wa_business');
                navigateToState('BUSINESS_WA_MODULE');
              }}
              onSwitchToSpamCall={() => {
                navigateToState('SPAM_MODULE');
              }}
              onComplete={() => {
                if (learnerProfile) {
                  const currentCompleted = learnerProfile.business_progress?.completed_lessons || [];
                  const newCompleted = currentCompleted.includes('google_maps')
                    ? currentCompleted
                    : [...currentCompleted, 'google_maps' as BusinessLessonId];
                  const updatedProfile: LearnerProfile = {
                    ...learnerProfile,
                    business_progress: {
                      ...(learnerProfile.business_progress || {}),
                      current_lesson_id: 'google_maps',
                      completed_lessons: newCompleted,
                      completed_steps: newCompleted,
                      is_module_completed: newCompleted.length >= 2,
                      last_active_at: new Date().toISOString(),
                    },
                  };
                  setLearnerProfile(updatedProfile);
                  persistLearnerProfile(updatedProfile);
                }
              }}
            />
          </div>
        )}
      </main>

      {/* 3. Bottom Controls */}
      {fsmState !== 'WHATSAPP_MODULE' && fsmState !== 'WHATSAPP_PATH' && fsmState !== 'SPAM_MODULE' && fsmState !== 'SPAM_PATH' && fsmState !== 'BUSINESS_PATH' && fsmState !== 'BUSINESS_WA_MODULE' && fsmState !== 'BUSINESS_MAPS_MODULE' && fsmState !== 'PHONE_SETTINGS_MODULE' && (
        <footer className="w-full">
          <ControlBar
            voiceState={voiceState}
            fsmState={fsmState}
            language={effectiveLanguage}
            consecutiveRetries={consecutiveRetries}
            onMicClick={handleMicClick}
            onStopSpeaking={handleStopSpeaking}
            onRepeatPrompt={handleRepeatPrompt}
            onAskQuestion={handleAskQuestion}
            onSelectOptionManually={handleSelectOptionManually}
          />
        </footer>
      )}

      {/* 4. Initial Permission Modal */}
      {!hasStarted && <PermissionModal onStart={handleStartApp} />}

      {/* 5. Global "Ask Selvi" LLM Powered Doubt Resolver Modal */}
      <AskSelviModal
        isOpen={isGlobalAskSelviOpen}
        onClose={() => setIsGlobalAskSelviOpen(false)}
        language={effectiveLanguage === 'ta-IN' ? 'ta' : effectiveLanguage === 'hi-IN' ? 'hi' : 'en'}
        lessonId={globalAskSelviLessonId}
        lessonTitle={globalAskSelviTitle}
        contextPrompt={globalAskSelviContext}
      />
    </div>
  );
}
