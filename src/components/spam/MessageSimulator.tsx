'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Ban,
  Trash2,
  ExternalLink,
  Check,
  MousePointer,
  Info,
} from 'lucide-react';
import { SpamCallLesson, SpamLanguageCode } from './types';
import { FRAUD_PRACTICE_TASKS } from './fraudCurriculum';
import { spamVoiceManager } from './voice';

interface MessageSimulatorProps {
  lesson: SpamCallLesson;
  language: SpamLanguageCode;
  onLessonComplete: () => void;
  onNextLesson: () => void;
  onBackToPath: () => void;
}

const UI_TEXT = {
  en: {
    appTitle: 'Messages',
    phishingWarning: 'Suspected Phishing Link · Reported by 950+ Users',
    unverifiedHeader: 'Unverified 10-digit number (Not official)',
    linkTrapWarning: '🚨 DANGER: Never tap unknown links in SMS! Real government portals end with .gov.in, NOT .xyz. Tap Block & Report Spam immediately!',
    blockBtn: 'Block & Report Spam',
    deleteBtn: 'Delete Message',
    blockedSuccess: '✓ Sender Blocked & Reported',
    demoBadge: '📹 Phase 1: Demo',
    practiceBadge: '✍️ Phase 2: Practice',
    successBadge: '🎉 Completed',
    stepCounter: 'Step {step} of {total}',
    replayDemo: 'Replay demo',
    skipToPractice: 'Skip to practice',
    practiceAgain: 'Practice again',
    nextLesson: 'Next Lesson',
    backToPath: 'Back to Learning Path',
    selviMentor: 'SELVI, YOUR SECURITY MENTOR',
    goldenRulesTitle: '3 Golden Rules for SMS & WhatsApp Safety',
    rule1: 'Never Click Unknown Links: Fraudulent links steal passwords and install spyware.',
    rule2: 'Inspect Sender Header: Official institutions use 6-character names (e.g. VK-SBIINB), never personal 10-digit mobile numbers.',
    rule3: 'Beware of Fake Urgency: Messages saying "within 12 hours" or "account suspended" are designed to create panic.',
    linkClickAlert: 'STOP! Do not click this link!',
  },
  ta: {
    appTitle: 'செய்திகள் (Messages)',
    phishingWarning: 'மோசடி லிங்க் எச்சரிக்கை · 950+ பயனர்களால் புகாரளிக்கப்பட்டது',
    unverifiedHeader: 'சரிபார்க்கப்படாத 10 இலக்க எண் (அரசு எண் அல்ல)',
    linkTrapWarning: '🚨 ஆபத்து: எஸ்.எம்.எஸ் அல்லது வாட்ஸ்அப் லிங்குகளைத் தொடாதீர்கள்! அரசு இணையதளங்கள் .gov.in என்று முடியும், .xyz அல்ல. உடனே Block & Report செய்யுங்கள்!',
    blockBtn: 'பிளாக் செய்து புகாரளி (Block & Report)',
    deleteBtn: 'செய்தியை நீக்கு (Delete)',
    blockedSuccess: '✓ எண் பிளாக் செய்யப்பட்டது',
    demoBadge: '📹 நிலை 1: மாதிரி வழிகாட்டல்',
    practiceBadge: '✍️ நிலை 2: உங்கள் பயிற்சி',
    successBadge: '🎉 வெற்றி',
    stepCounter: 'படி {step} / {total}',
    replayDemo: 'மீண்டும் செய்முறையைப் பார்',
    skipToPractice: 'பயிற்சிக்குச் செல்',
    practiceAgain: 'மீண்டும் பயிற்சி செய்',
    nextLesson: 'அடுத்த பாடம்',
    backToPath: 'பயிற்சிப் பாதைக்குத் திரும்பு',
    selviMentor: 'செல்வி, உங்கள் பாதுகாப்பு வழிகாட்டி',
    goldenRulesTitle: 'எஸ்.எம்.எஸ் மற்றும் வாட்ஸ்அப் செய்திகளுக்கான 3 தங்க விதிகள்',
    rule1: 'அறியப்படாத லிங்குகளைத் தொடாதீர்கள்: போலி லிங்குகள் உங்கள் பாஸ்வேர்டுகளைத் திருடும்.',
    rule2: 'அனுப்பியவரின் பெயரைப் பாருங்கள்: அரசு மற்றும் வங்கிகள் 10 இலக்க போன் நம்பரிலிருந்து லிங்க் அனுப்பாது.',
    rule3: 'அவசர மிரட்டல்களை நம்பாதீர்கள்: "12 மணி நேரத்தில் முடங்கும்" என்ற மிரட்டல்கள் யோசிக்கவிடாமல் செய்ய வைக்கப்படும் வலை.',
    linkClickAlert: 'நில்லுங்கள்! இந்த லிங்கைத் தொடாதீர்கள்!',
  },
  hi: {
    appTitle: 'मैसेज (Messages)',
    phishingWarning: 'संदिग्ध लिंक चेतावनी · 950+ लोगों द्वारा रिपोर्टेड',
    unverifiedHeader: 'अनजान 10 अंकों का नंबर (आधिकारिक नहीं)',
    linkTrapWarning: '🚨 खतरा: मैसेज में आए लिंक पर कभी क्लिक न करें! सरकारी वेबसाइटें .gov.in से समाप्त होती हैं, .xyz से नहीं। तुरंत Block & Report करें!',
    blockBtn: 'ब्लॉक और रिपोर्ट करें (Block & Report)',
    deleteBtn: 'मैसेज हटाएं (Delete)',
    blockedSuccess: '✓ नंबर ब्लॉक और रिपोर्ट हुआ',
    demoBadge: '📹 चरण 1: डेमो',
    practiceBadge: '✍️ चरण 2: अभ्यास',
    successBadge: '🎉 पूर्ण हुआ',
    stepCounter: 'कदम {step} / {total}',
    replayDemo: 'डेमो दोबारा देखें',
    skipToPractice: 'सीधे अभ्यास करें',
    practiceAgain: 'पुनः अभ्यास करें',
    nextLesson: 'अगला पाठ',
    backToPath: 'लर्निंग पाथ पर वापस जाएं',
    selviMentor: 'सेल्वी, आपकी सुरक्षा सलाहकार',
    goldenRulesTitle: 'एसएमएस और व्हाट्सएप सुरक्षा के 3 सुनहरे नियम',
    rule1: 'अनजान लिंक कभी न छुएं: फर्जी लिंक पासवर्ड चुराने और वायरस डालने के लिए होते हैं।',
    rule2: 'भेजने वाले का नाम जांचें: बैंक या सरकारी विभाग 10 अंकों के निजी मोबाइल नंबर से लिंक नहीं भेजते।',
    rule3: 'झूठी जल्दबाजी से बचें: "12 घंटे में ब्लॉक" जैसे संदेश डर पैदा करने के लिए भेजे जाते हैं।',
    linkClickAlert: 'रुकें! यह लिंक खतरनाक है!',
  },
};

export const MessageSimulator: React.FC<MessageSimulatorProps> = ({
  lesson,
  language = 'en',
  onLessonComplete,
  onNextLesson,
  onBackToPath,
}) => {
  const [phase, setPhase] = useState<'DEMO' | 'PRACTICE' | 'SUCCESS'>('DEMO');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [practiceStepIndex, setPracticeStepIndex] = useState<number>(0);
  const [isTargetGlowing, setIsTargetGlowing] = useState<boolean>(false);
  const [isWrongTargetShaking, setIsWrongTargetShaking] = useState<boolean>(false);
  const [linkWarningAlert, setLinkWarningAlert] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  // Demo cursor state
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number }>({ x: 50, y: 70 });
  const [pointerVisible, setPointerVisible] = useState<boolean>(false);
  const [isRippling, setIsRippling] = useState<boolean>(false);
  const [demoCaption, setDemoCaption] = useState<string>('');

  const phoneRef = useRef<HTMLDivElement | null>(null);
  const abortDemoRef = useRef<boolean>(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const t = UI_TEXT[language] || UI_TEXT.en;
  const practiceTask = FRAUD_PRACTICE_TASKS[lesson.id] || FRAUD_PRACTICE_TASKS[5];

  const sleep = (ms: number) =>
    new Promise((resolve) => {
      const start = Date.now();
      const interval = setInterval(() => {
        if (abortDemoRef.current || Date.now() - start >= ms) {
          clearInterval(interval);
          resolve(true);
        }
      }, 30);
    });

  const waitForEl = async (id: string, timeout = 3500): Promise<HTMLElement | null> => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (abortDemoRef.current) return null;
      if (phoneRef.current) {
        const el = phoneRef.current.querySelector(`[data-demo-id="${id}"]`) as HTMLElement;
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) return el;
        }
      }
      await new Promise((r) => setTimeout(r, 40));
    }
    return null;
  };

  const movePointerTo = async (el: HTMLElement) => {
    if (!phoneRef.current || abortDemoRef.current) return;
    const phoneRect = phoneRef.current.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    const x = ((elRect.left + elRect.width / 2 - phoneRect.left) / phoneRect.width) * 100;
    const y = ((elRect.top + elRect.height / 2 - phoneRect.top) / phoneRect.height) * 100;

    setPointerPos({ x: Math.min(94, Math.max(6, x)), y: Math.min(94, Math.max(6, y)) });
    setPointerVisible(true);
    await sleep(650);
  };

  const resetToPhase = useCallback(
    (targetPhase: 'DEMO' | 'PRACTICE') => {
      spamVoiceManager.stop();
      abortDemoRef.current = true;
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

      setPhase(targetPhase);
      setCurrentStepIndex(0);
      setPracticeStepIndex(0);
      setIsBlocked(false);
      setLinkWarningAlert(null);
      setIsWrongTargetShaking(false);
      setIsTargetGlowing(false);
      setPointerVisible(false);

      if (targetPhase === 'PRACTICE') {
        const firstPracticeStep = practiceTask.steps[0];
        const instruction = firstPracticeStep.instruction[language] || firstPracticeStep.instruction.en;
        spamVoiceManager.speak(instruction, language);
        idleTimerRef.current = setTimeout(() => {
          setIsTargetGlowing(true);
        }, 4000);
      }
    },
    [language, practiceTask]
  );

  // DEMO LOOP
  useEffect(() => {
    if (phase !== 'DEMO') return;

    abortDemoRef.current = false;
    let isSubscribed = true;

    const runDemoLoop = async () => {
      await sleep(400);

      for (let i = 0; i < lesson.steps.length; i++) {
        if (abortDemoRef.current || !isSubscribed) return;

        const step = lesson.steps[i];
        setCurrentStepIndex(i);
        const caption = step.caption[language] || step.caption.en;
        setDemoCaption(caption);

        await spamVoiceManager.speakAsync(caption, language, {
          fallbackTimeoutMs: 12000,
        });
        await sleep(600);

        if (abortDemoRef.current || !isSubscribed) return;

        if (step.action === 'tap') {
          const targetEl = await waitForEl(step.targetId);
          if (targetEl && !abortDemoRef.current) {
            await movePointerTo(targetEl);
            setIsRippling(true);
            await sleep(200);
            setIsRippling(false);
            targetEl.click();
            await sleep(800);
          }
        } else if (step.action === 'point') {
          const targetEl = await waitForEl(step.targetId);
          if (targetEl && !abortDemoRef.current) {
            await movePointerTo(targetEl);
            await sleep(1400);
          }
        } else if (step.action === 'wait') {
          setPointerVisible(false);
          if (step.waitMs) await sleep(step.waitMs);
        }

        if (abortDemoRef.current || !isSubscribed) return;
        await sleep(600);
      }

      if (isSubscribed && !abortDemoRef.current) {
        await sleep(800);
        setPointerVisible(false);
        const promptText =
          language === 'ta'
            ? 'இப்போது உங்கள் முறை. நீங்களே செய்து பாருங்கள்.'
            : language === 'hi'
            ? 'अब आपकी बारी है। स्वयं करके देखें।'
            : "Now it's your turn. Try it yourself.";
        setDemoCaption(promptText);
        await spamVoiceManager.speakAsync(promptText, language, { fallbackTimeoutMs: 8000 });
        await sleep(500);

        if (isSubscribed && !abortDemoRef.current) {
          resetToPhase('PRACTICE');
        }
      }
    };

    runDemoLoop();

    return () => {
      isSubscribed = false;
      abortDemoRef.current = true;
      spamVoiceManager.stop();
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [phase, lesson, language, resetToPhase]);

  // Handle clicking suspicious link
  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsWrongTargetShaking(true);
    setIsTargetGlowing(true);
    setLinkWarningAlert(t.linkTrapWarning);

    spamVoiceManager.speak(t.linkTrapWarning, language);

    setTimeout(() => {
      setIsWrongTargetShaking(false);
    }, 600);

    setTimeout(() => {
      setLinkWarningAlert(null);
    }, 6000);
  };

  // Safe action: Block sender
  const handleBlockSender = () => {
    setIsBlocked(true);
    setLinkWarningAlert(null);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    if (phase === 'PRACTICE') {
      setPhase('SUCCESS');
      const successMsg = lesson.successMessage[language] || lesson.successMessage.en;
      spamVoiceManager.speak(successMsg, language);
      onLessonComplete();
    }
  };

  // Safe action: Delete message
  const handleDeleteMessage = () => {
    handleBlockSender();
  };

  const currentStep = lesson.steps[currentStepIndex] || lesson.steps[0];
  const currentGuideText =
    phase === 'DEMO'
      ? demoCaption || currentStep.caption[language] || currentStep.caption.en
      : practiceTask.steps[practiceStepIndex]?.instruction[language] ||
        practiceTask.steps[practiceStepIndex]?.instruction.en;

  return (
    <div className="relative w-full max-w-[390px] h-[600px] sm:h-[640px] bg-slate-950 rounded-[44px] shadow-2xl overflow-hidden border-[10px] border-slate-900 flex flex-col select-none ring-1 ring-slate-800">
      {/* Top Phone Cutout */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-slate-900 z-50 flex items-center justify-center">
        <div className="w-24 h-4 bg-black rounded-b-xl flex items-center justify-center">
          <div className="w-10 h-1 bg-slate-800 rounded-full" />
        </div>
      </div>

      {/* Simulator Warning Banner */}
      <div className="bg-amber-950/80 border-b border-amber-800/60 px-3 py-1 flex items-center justify-center text-[11px] font-bold text-amber-200 z-40 mt-6 shrink-0">
        <span>🛡️ Cyber Fraud Simulator — Message Safety Drill</span>
      </div>

      {/* App Header */}
      <div
        data-demo-id="sms-sender-header"
        className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between z-30 shrink-0"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs">
            {lesson.callerName.charAt(0)}
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-white leading-tight flex items-center gap-1.5">
              <span>{lesson.callerName}</span>
              <span className="text-[9px] bg-red-950 text-red-300 px-1.5 py-0.2 rounded border border-red-800">
                Spam
              </span>
            </h4>
            <p className="text-[10px] text-red-300 font-mono">{lesson.callerNumber} · {t.unverifiedHeader}</p>
          </div>
        </div>

        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-medium">
          SMS
        </span>
      </div>

      {/* Main Message Thread View */}
      <div
        ref={phoneRef}
        className="flex-1 flex flex-col justify-between p-3.5 bg-slate-950 text-white overflow-y-auto relative"
      >
        {/* Phishing warning banner */}
        <div className="bg-red-950/90 border border-red-700/80 rounded-xl p-2 flex items-center gap-2 text-left mb-2 animate-pulse shrink-0">
          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
          <span className="text-[10px] text-red-200 font-bold leading-tight">
            {t.phishingWarning}
          </span>
        </div>

        {/* Message Bubble Card */}
        <div className="space-y-3 shrink-0">
          <div className="flex justify-center">
            <span className="text-[10px] text-slate-500 bg-slate-900/80 px-2.5 py-0.5 rounded-full">
              Today · 11:42 AM
            </span>
          </div>

          <div
            className={`bg-slate-900 border-2 rounded-2xl p-3 text-left space-y-2.5 shadow-xl transition-all duration-300 ${
              isWrongTargetShaking ? 'border-red-500 animate-bounce' : 'border-slate-800'
            }`}
          >
            {/* Scammer message text */}
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              "{lesson.scammerSpeech[language] || lesson.scammerSpeech.en}"
            </p>

            {/* Suspicious Link Card */}
            <div
              data-demo-id="sms-link-preview"
              onClick={handleLinkClick}
              className={`p-2.5 rounded-xl border-2 transition cursor-pointer flex flex-col gap-1 active:scale-95 ${
                isTargetGlowing
                  ? 'border-red-500 bg-red-950/40 animate-pulse ring-2 ring-red-400'
                  : 'border-red-900/80 bg-red-950/20 hover:bg-red-950/30'
              }`}
            >
              <div className="flex items-center justify-between text-red-400">
                <span className="text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>SUSPICIOUS .XYZ DOMAIN</span>
                </span>
                <ExternalLink className="w-3 h-3 text-red-400" />
              </div>
              <p className="text-xs text-red-300 font-mono underline break-all font-semibold">
                http://indiapost-parcel-update.xyz/login
              </p>
              <span className="text-[9px] text-slate-400">
                ⚠️ Click to view warning (Never tap unknown links)
              </span>
            </div>
          </div>

          {/* Link Warning Toast */}
          {linkWarningAlert && (
            <div className="p-2.5 rounded-xl bg-red-600 text-white font-bold text-[11px] leading-snug shadow-2xl border-2 border-white animate-in zoom-in-95 duration-200 text-left flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0 text-white" />
              <span>{linkWarningAlert}</span>
            </div>
          )}

          {/* Red Flag Explainer */}
          <div className="bg-amber-950/50 border border-amber-800/60 rounded-xl p-2 text-left space-y-1">
            <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wide flex items-center gap-1">
              <Info className="w-3 h-3" />
              <span>Red Flags in this Message:</span>
            </span>
            <ul className="text-[10px] text-amber-100 space-y-0.5 list-disc pl-3.5">
              <li>10-digit mobile number ({lesson.callerNumber}) instead of official sender</li>
              <li>Fake urgency ("within 12 hours or returned")</li>
              <li>Untrusted ".xyz" web address instead of ".gov.in"</li>
            </ul>
          </div>
        </div>

        {/* Selvi Mentor Guidance Box */}
        <div className="my-2 shrink-0">
          <div className="bg-white rounded-2xl p-2.5 border-2 border-amber-600 shadow-xl flex flex-col text-left">
            <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider mb-0.5">
              {t.selviMentor}
            </span>
            <p className="text-xs font-semibold text-slate-900 leading-snug">
              {currentGuideText}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-2 pb-4 pt-1 shrink-0">
          <button
            data-demo-id="sms-block-btn"
            onClick={handleBlockSender}
            className={`w-full py-3 rounded-2xl font-bold text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer transition active:scale-95 border ${
              isBlocked
                ? 'bg-slate-800 text-emerald-400 border-slate-700'
                : 'bg-red-600 hover:bg-red-700 text-white border-red-400 ring-2 ring-red-500/40'
            }`}
          >
            <Ban className="w-4 h-4" />
            <span>{isBlocked ? t.blockedSuccess : t.blockBtn}</span>
          </button>

          <button
            onClick={handleDeleteMessage}
            className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] font-medium flex items-center justify-center gap-1.5 border border-slate-800 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.deleteBtn}</span>
          </button>
        </div>

        {/* Demo Cursor Overlay */}
        {phase === 'DEMO' && (
          <div className="absolute inset-0 z-50 pointer-events-none select-none">
            <div className="absolute inset-0 pointer-events-auto cursor-default" />

            {pointerVisible && (
              <div
                style={{
                  left: `${pointerPos.x}%`,
                  top: `${pointerPos.y}%`,
                  transform: 'translate(-50%, -50%)',
                  transition: 'left 0.65s cubic-bezier(0.25, 1, 0.5, 1), top 0.65s cubic-bezier(0.25, 1, 0.5, 1)',
                }}
                className="absolute pointer-events-none z-50 flex flex-col items-center"
              >
                {isRippling && (
                  <div className="absolute w-12 h-12 -top-2 -left-2 rounded-full border-4 border-red-400 bg-red-400/30 animate-ping pointer-events-none" />
                )}
                <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl border-2 border-white drop-shadow-lg">
                  <MousePointer className="w-5 h-5 fill-slate-950" />
                </div>
              </div>
            )}

            <div className="absolute bottom-2 left-2 right-2 pointer-events-auto z-50">
              <div className="bg-slate-950/90 backdrop-blur-md text-white p-2 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>{t.demoBadge}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => resetToPhase('DEMO')}
                    className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition"
                  >
                    <RotateCcw className="w-3 h-3 text-amber-400" />
                    <span>{t.replayDemo}</span>
                  </button>
                  <button
                    onClick={() => resetToPhase('PRACTICE')}
                    className="px-3 py-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition shadow-xs"
                  >
                    <span>{t.skipToPractice}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Overlay */}
        {phase === 'SUCCESS' && (
          <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-sm p-5 flex flex-col items-center justify-between text-center text-white animate-in zoom-in-95 duration-200">
            <div className="pt-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-2xl border-4 border-emerald-400 mx-auto">
                <ShieldCheck className="w-9 h-9 stroke-[2.5]" />
              </div>

              <h3 className="text-lg font-extrabold text-white">
                {lesson.successMessage[language] || lesson.successMessage.en}
              </h3>
              <p className="text-xs text-slate-300">
                You successfully detected the fraudulent link and blocked the spammer without risking your personal data.
              </p>
            </div>

            {/* 3 Golden Rules */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-left space-y-2 w-full">
              <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wide block">
                {t.goldenRulesTitle}
              </span>
              <ul className="text-[10px] text-slate-200 space-y-1.5">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold shrink-0">1.</span>
                  <span>{t.rule1}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold shrink-0">2.</span>
                  <span>{t.rule2}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-red-400 font-bold shrink-0">3.</span>
                  <span>{t.rule3}</span>
                </li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="w-full space-y-2 pb-2">
              <button
                onClick={onNextLesson}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
              >
                <span>{t.nextLesson}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => resetToPhase('PRACTICE')}
                className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.practiceAgain}</span>
              </button>

              <button
                onClick={onBackToPath}
                className="w-full py-2 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
              >
                {t.backToPath}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
