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
} from '@/types';
import { Mascot } from '@/components/Mascot';
import { VoiceVisualizer } from '@/components/VoiceVisualizer';
import { Captions } from '@/components/Captions';
import { Header } from '@/components/Header';
import { ControlBar } from '@/components/ControlBar';
import { PermissionModal } from '@/components/PermissionModal';
import { Sparkles, Trophy, CheckCircle, AlertTriangle, Globe, ShieldCheck, Smartphone } from 'lucide-react';
import { UI_TRANSLATIONS } from '@/lib/i18n/translations';
import { CATEGORIES_META, LEARNING_PATHS_META } from '@/lib/lessons/catalog';
import { logger } from '@/lib/logger';

export default function FirstTapApp() {
  const [fsm] = useState(() => new FirstTapFSM());
  const [fsmState, setFsmState] = useState<FSMState>('GREETING');
  const [voiceState, setVoiceState] = useState<VoiceEngineState>('IDLE');
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('ta-IN');
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

  const voiceEngineRef = useRef<VoiceEngine | null>(null);
  const isProcessingRef = useRef<boolean>(false);

  // Persist learner profile to backend API and localStorage
  const persistLearnerProfile = useCallback(async (profile: LearnerProfile) => {
    setIsSavingProfile(true);
    setSaveStatus(null);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('firsttap_learner_profile', JSON.stringify(profile));
      }

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

  // Synchronize state and trigger voice output
  const executeTransition = useCallback(
    (transition: FSMTransitionResult) => {
      setFsmState(transition.nextState);
      const session = transition.updatedSession;
      setCurrentLanguage(session.language);
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

  // Ask question / doubt
  const handleAskQuestion = () => {
    triggerListening(currentLanguage);
  };

  // Manual language switch from header
  const handleManualLanguageChange = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    const res = fsm.setLanguageManually(lang);
    executeTransition(res);
  };

  // Manual option selection (accessible button click fallback)
  const handleSelectOptionManually = (text: string) => {
    if (
      fsmState === 'WAITING_FOR_LANGUAGE' ||
      fsmState === 'LANGUAGE_OPTIONS' ||
      fsmState === 'LANGUAGE_SELECT'
    ) {
      if (text.includes('தமிழ்') || text.toLowerCase().includes('tamil')) {
        setCurrentLanguage('ta-IN');
      } else if (text.includes('हिंदी') || text.toLowerCase().includes('hindi')) {
        setCurrentLanguage('hi-IN');
      } else if (text.toLowerCase().includes('english')) {
        setCurrentLanguage('en-IN');
      }
    }
    setRecognizedUserSpeech(text);
    handleUserSpokenInput(text);
  };

  const t = UI_TRANSLATIONS[currentLanguage];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EE] to-[#F5ECE0] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col justify-between font-sans selection:bg-amber-200">
      {/* 1. Header */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={handleManualLanguageChange}
        isApiMode={isApiMode}
      />

      {/* 2. Main Character & Interactive Stage */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-5 max-w-xl mx-auto w-full">
        {/* State Banner */}
        <div className="mb-2 text-center">
          <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-slate-800/90 border border-amber-200/80 dark:border-slate-700 text-teal-800 dark:text-teal-300 shadow-sm backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <span>
              {t.stateBanners[fsmState] || t.stateBanners.APP_START}
            </span>
          </span>
        </div>

        {/* Mascot Centerpiece (Friendly Teacher) */}
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
            language={currentLanguage}
            audioStatus={audioStatus}
            onResumeAutoplay={() => voiceEngineRef.current?.resumeBlockedAudio()}
            onReplayPrompt={handleRepeatPrompt}
          />
        </div>

        {/* Spoken Speech Bubble directly under Teacher */}
        {mascotSpeech && fsmState !== 'ASSESSMENT_COMPLETE' && (
          <div className="relative max-w-md w-full mx-auto mt-2 px-5 py-3.5 bg-white/95 dark:bg-slate-900/95 rounded-2xl border-2 border-amber-200/90 dark:border-slate-700 shadow-md backdrop-blur-sm text-center">
            <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 leading-snug">
              &ldquo;{mascotSpeech}&rdquo;
            </p>
          </div>
        )}

        {/* Audio Visualizer Waveform */}
        {fsmState !== 'ASSESSMENT_COMPLETE' && (
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
        {fsmState !== 'ASSESSMENT_COMPLETE' && (
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
            language={currentLanguage}
          />
        )}

        {/* Module 1: Assessment Completion & Learner Profile Summary Card */}
        {fsmState === 'ASSESSMENT_COMPLETE' && learnerProfile && (
          <div className="w-full max-w-md mx-auto p-5 mt-2 rounded-3xl bg-white/95 dark:bg-slate-900/95 border-2 border-amber-300 dark:border-slate-700 shadow-2xl space-y-4 text-slate-900 dark:text-slate-100 backdrop-blur-md">
            {/* Header Badge */}
            <div className="text-center space-y-1">
              <div className="inline-flex p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mb-1">
                <Trophy className="w-8 h-8 fill-amber-400" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {t.assessmentSummary.heading}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {t.assessmentSummary.description}
              </p>
            </div>

            {/* Profile Info Items */}
            <div className="space-y-2.5 pt-1">
              {/* 1. Name */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/70 dark:bg-slate-800/60 border border-amber-200/60 dark:border-slate-700">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {t.assessmentSummary.nameLabel}
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {learnerProfile.name}
                </span>
              </div>

              {/* 2. Preferred Language */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/70 dark:bg-slate-800/60 border border-amber-200/60 dark:border-slate-700">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {t.assessmentSummary.languageLabel}
                  </span>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                  {learnerProfile.preferred_language === 'ta-IN'
                    ? 'தமிழ் (Tamil)'
                    : learnerProfile.preferred_language === 'hi-IN'
                    ? 'हिंदी (Hindi)'
                    : 'English'}
                </span>
              </div>

              {/* 3. Primary User Category */}
              <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-slate-800/60 border border-amber-200/60 dark:border-slate-700 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {t.assessmentSummary.categoryLabel}
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                    {CATEGORIES_META[learnerProfile.primary_category]?.title[currentLanguage] ||
                      learnerProfile.primary_category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-6 leading-tight">
                  {CATEGORIES_META[learnerProfile.primary_category]?.description[currentLanguage]}
                </p>
              </div>

              {/* 4. Recommended Starting Learning Path */}
              <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                      {t.assessmentSummary.pathLabel}
                    </span>
                  </div>
                  {learnerProfile.completion_reason === 'FOUNDATION_PATH' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                      {t.assessmentSummary.foundationBadge}
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200 pl-6">
                  {LEARNING_PATHS_META[learnerProfile.starting_learning_path]?.title[currentLanguage] ||
                    learnerProfile.starting_learning_path}
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 pl-6 leading-tight">
                  {LEARNING_PATHS_META[learnerProfile.starting_learning_path]?.description[currentLanguage]}
                </p>
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
                const restartRes = fsm.startApp();
                executeTransition(restartRes);
              }}
              className="w-full py-2.5 px-6 rounded-2xl bg-slate-950 dark:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md hover:bg-slate-900 dark:hover:bg-slate-700 transition-all cursor-pointer text-center"
            >
              {t.assessmentSummary.startAgainButton}
            </button>
          </div>
        )}
      </main>

      {/* 3. Bottom Controls */}
      <footer className="w-full">
        <ControlBar
          voiceState={voiceState}
          fsmState={fsmState}
          language={currentLanguage}
          consecutiveRetries={consecutiveRetries}
          onMicClick={handleMicClick}
          onStopSpeaking={handleStopSpeaking}
          onRepeatPrompt={handleRepeatPrompt}
          onAskQuestion={handleAskQuestion}
          onSelectOptionManually={handleSelectOptionManually}
        />
      </footer>

      {/* 4. Initial Permission Modal */}
      {!hasStarted && <PermissionModal onStart={handleStartApp} />}
    </div>
  );
}
