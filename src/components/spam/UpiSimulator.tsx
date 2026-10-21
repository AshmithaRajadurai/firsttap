'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  CreditCard,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Ban,
  Check,
  MousePointer,
  KeyRound,
  X,
  HelpCircle,
  TrendingDown,
  Info,
} from 'lucide-react';
import { SpamCallLesson, SpamLanguageCode } from './types';
import { FRAUD_PRACTICE_TASKS } from './fraudCurriculum';
import { spamVoiceManager } from './voice';

interface UpiSimulatorProps {
  lesson: SpamCallLesson;
  language: SpamLanguageCode;
  onLessonComplete: () => void;
  onNextLesson: () => void;
  onBackToPath: () => void;
}

const UI_TEXT = {
  en: {
    appTitle: 'UPI Payment Request',
    collectWarning: '⚠️ High Risk Request · Unverified Beneficiary',
    requestHeader: 'Payment Collect Request',
    requesterName: 'Ramesh Buyer (Unverified Account)',
    amountLabel: 'AMOUNT TO PAY',
    deceptiveNoteTitle: 'NOTE FROM SENDER:',
    dangerNotice: 'DANGER: Money will LEAVE your account if you enter your PIN!',
    payBtn: 'Pay ₹4,500 (Enter UPI PIN)',
    declineBtn: 'Decline Request (நிராகரி)',
    declineSuccess: '✓ Request Rejected & Reported as Fraud',
    demoBadge: '📹 Phase 1: Demo',
    practiceBadge: '✍️ Phase 2: Practice',
    successBadge: '🎉 Completed',
    replayDemo: 'Replay demo',
    skipToPractice: 'Skip to practice',
    practiceAgain: 'Practice again',
    nextLesson: 'Next Lesson',
    backToPath: 'Back to Learning Path',
    selviMentor: 'SELVI, YOUR SECURITY MENTOR',
    pinTrapAlert: '🚨 STOP! DANGER! You are PAYING ₹4,500! Real banks NEVER require a PIN to receive money or cashback! Tap Decline Request immediately!',
    goldenRulesTitle: 'The Golden Rule of UPI Payments',
    rule1: 'PIN is ONLY to SEND: You ONLY enter your UPI PIN to transfer money OUT of your bank account.',
    rule2: 'Receiving Requires NO PIN: Receiving money happens automatically without touching your phone.',
    rule3: 'Never Scan QR to Receive: Scanning a QR code or accepting collect requests will debit your account.',
    enterPinPrompt: 'Enter 6-digit UPI PIN to send ₹4,500',
  },
  ta: {
    appTitle: 'யுபிஐ (UPI) பணக் கோரிக்கை',
    collectWarning: '⚠️ அதிக ஆபத்துள்ள கோரிக்கை · சரிபார்க்கப்படாத கணக்கு',
    requestHeader: 'பணம் செலுத்தக் கோரிக்கை (Collect Request)',
    requesterName: 'ரமேஷ் வாங்குபவர் (போலி கணக்கு)',
    amountLabel: 'நீங்கள் செலுத்த வேண்டிய தொகை',
    deceptiveNoteTitle: 'அனுப்பியவரின் குறிப்பு:',
    dangerNotice: 'ஆபத்து: பின் போட்டால் உங்கள் கணக்கிலிருந்து பணம் சென்றுவிடும்!',
    payBtn: '₹4,500 செலுத்து (யுபிஐ பின் போடு)',
    declineBtn: 'கோரிக்கையை நிராகரி (Decline)',
    declineSuccess: '✓ மோசடிக் கோரிக்கை நிராகரிக்கப்பட்டது',
    demoBadge: '📹 நிலை 1: மாதிரி வழிகாட்டல்',
    practiceBadge: '✍️ நிலை 2: உங்கள் பயிற்சி',
    successBadge: '🎉 வெற்றி',
    replayDemo: 'மீண்டும் செய்முறையைப் பார்',
    skipToPractice: 'பயிற்சிக்குச் செல்',
    practiceAgain: 'மீண்டும் பயிற்சி செய்',
    nextLesson: 'அடுத்த பாடம்',
    backToPath: 'பயிற்சிப் பாதைக்குத் திரும்பு',
    selviMentor: 'செல்வி, உங்கள் பாதுகாப்பு வழிகாட்டி',
    pinTrapAlert: '🚨 ஆபத்து! நீங்கள் ₹4,500 பணம் செலுத்தப் போகிறீர்கள்! பணம் பெற ஒருபோதும் யுபிஐ பின் தேவையில்லை! உடனே Decline Request தொட்டு நிராகரியுங்கள்!',
    goldenRulesTitle: 'யுபிஐ பரிவர்த்தனையின் தங்க விதி',
    rule1: 'பணம் அனுப்ப மட்டுமே பின்: உங்கள் கணக்கிலிருந்து பணம் போகும்போது மட்டுமே யுபிஐ பின் போட வேண்டும்.',
    rule2: 'பணம் பெற பின் தேவையில்லை: உங்கள் கணக்கிற்கு பணம் வர எவ்வித பின்னும் தேவையில்லை, தானாகவே வரும்.',
    rule3: 'க்யூஆர் ஸ்கேன் செய்து பின் போடாதீர்: க்யூஆர் ஸ்கேன் செய்து பின் போட்டால் உங்கள் பணம் பறிபோகும்.',
    enterPinPrompt: '₹4,500 அனுப்ப உங்கள் 6 இலக்க யுபிஐ பின் உள்ளிடவும்',
  },
  hi: {
    appTitle: 'यूपीआई भुगतान रिक्वेस्ट',
    collectWarning: '⚠️ उच्च जोखिम वाली मांग · अनजान खाता',
    requestHeader: 'पेमेंट कलेक्ट रिक्वेस्ट',
    requesterName: 'रमेश खरीदार (असत्यापित खाता)',
    amountLabel: 'भुगतान की जाने वाली राशि',
    deceptiveNoteTitle: 'भेजने वाले का नोट:',
    dangerNotice: 'खतरा: पिन डालते ही आपके खाते से पैसे कट जाएंगे!',
    payBtn: '₹4,500 भुगतान करें (पिन डालें)',
    declineBtn: 'रिक्वेस्ट अस्वीकार करें (Decline)',
    declineSuccess: '✓ फर्जी रिक्वेस्ट खारिज व रिपोर्ट की गई',
    demoBadge: '📹 चरण 1: डेमो',
    practiceBadge: '✍️ चरण 2: अभ्यास',
    successBadge: '🎉 पूर्ण हुआ',
    replayDemo: 'डेमो दोबारा देखें',
    skipToPractice: 'सीधे अभ्यास करें',
    practiceAgain: 'पुनः अभ्यास करें',
    nextLesson: 'अगला पाठ',
    backToPath: 'लर्निंग पाथ पर वापस जाएं',
    selviMentor: 'सेल्वी, आपकी सुरक्षा सलाहकार',
    pinTrapAlert: '🚨 रुकिए! खतरा! आप ₹4,500 भेज रहे हैं! पैसे पाने के लिए कभी यूपीआई पिन नहीं लगता! तुरंत Decline बटन दबाएं!',
    goldenRulesTitle: 'यूपीआई का सबसे महत्वपूर्ण सुनहरा नियम',
    rule1: 'पिन सिर्फ पैसे भेजने के लिए: यूपीआई पिन केवल तब डाला जाता है जब पैसे आपके खाते से जा रहे हों।',
    rule2: 'पैसे आने पर कोई पिन नहीं: किसी से पैसे लेने के लिए कोई पिन डालने की जरूरत नहीं होती।',
    rule3: 'पैसे पाने हेतु क्यूआर स्कैन न करें: क्यूआर स्कैन करके पिन डालने से पैसे कट जाते हैं।',
    enterPinPrompt: '₹4,500 भेजने के लिए 6 अंकों का यूपीआई पिन डालें',
  },
};

export const UpiSimulator: React.FC<UpiSimulatorProps> = ({
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
  const [pinTrapWarning, setPinTrapWarning] = useState<string | null>(null);
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [isDeclined, setIsDeclined] = useState<boolean>(false);

  // Demo cursor state
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number }>({ x: 50, y: 70 });
  const [pointerVisible, setPointerVisible] = useState<boolean>(false);
  const [isRippling, setIsRippling] = useState<boolean>(false);
  const [demoCaption, setDemoCaption] = useState<string>('');

  const phoneRef = useRef<HTMLDivElement | null>(null);
  const abortDemoRef = useRef<boolean>(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const t = UI_TEXT[language] || UI_TEXT.en;
  const practiceTask = FRAUD_PRACTICE_TASKS[lesson.id] || FRAUD_PRACTICE_TASKS[6];

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
      setShowPinModal(false);
      setEnteredPin('');
      setIsDeclined(false);
      setPinTrapWarning(null);
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

  // Trap: User taps "Pay ₹4,500"
  const handlePayClick = () => {
    setShowPinModal(true);
    triggerTrapAlert();
  };

  const triggerTrapAlert = () => {
    setIsWrongTargetShaking(true);
    setIsTargetGlowing(true);
    setPinTrapWarning(t.pinTrapAlert);
    spamVoiceManager.speak(t.pinTrapAlert, language);

    setTimeout(() => {
      setIsWrongTargetShaking(false);
    }, 600);

    setTimeout(() => {
      setPinTrapWarning(null);
    }, 6500);
  };

  // User tries to enter PIN on keypad trap
  const handleKeypadPress = (digit: string) => {
    setEnteredPin((prev) => (prev.length < 6 ? prev + digit : prev));
    triggerTrapAlert();
  };

  // Safe action: Decline Request
  const handleDeclineRequest = () => {
    setShowPinModal(false);
    setIsDeclined(true);
    setPinTrapWarning(null);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    if (phase === 'PRACTICE') {
      setPhase('SUCCESS');
      const successMsg = lesson.successMessage[language] || lesson.successMessage.en;
      spamVoiceManager.speak(successMsg, language);
      onLessonComplete();
    }
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
      <div className="bg-purple-950/80 border-b border-purple-800/60 px-3 py-1 flex items-center justify-center text-[11px] font-bold text-purple-200 z-40 mt-6 shrink-0">
        <span>💳 Cyber Fraud Simulator — UPI PIN Safety Drill</span>
      </div>

      {/* UPI App Header */}
      <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800 z-30 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-purple-600 text-white font-extrabold flex items-center justify-center text-xs shadow-md">
            ₹
          </div>
          <span className="text-xs font-bold text-white tracking-wide">
            {t.appTitle}
          </span>
        </div>
        <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 font-bold px-2 py-0.5 rounded-full">
          UPI Auto-Collect
        </span>
      </div>

      {/* Main View */}
      <div
        ref={phoneRef}
        className="flex-1 flex flex-col justify-between p-3.5 bg-slate-950 text-white overflow-y-auto relative"
      >
        {/* High Risk Warning */}
        <div className="bg-red-950/80 border border-red-700/80 rounded-xl p-2 flex items-center gap-2 text-left mb-1.5 shrink-0 animate-pulse">
          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
          <span className="text-[10px] text-red-200 font-bold leading-tight">
            {t.collectWarning}
          </span>
        </div>

        {/* Collect Request Card */}
        <div
          data-demo-id="upi-request-card"
          className={`bg-slate-900 border-2 rounded-2xl p-3.5 text-center space-y-2.5 shadow-2xl transition-all duration-300 ${
            isWrongTargetShaking ? 'border-red-500 animate-bounce' : 'border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
            <span>{t.requestHeader}</span>
            <span className="text-red-400 font-bold flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              Debit Request
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-red-400 uppercase tracking-widest block">
              {t.amountLabel}
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              ₹4,500<span className="text-lg text-slate-400">.00</span>
            </h2>
            <p className="text-[11px] text-slate-300 font-medium">
              Requested by: <strong className="text-white">{t.requesterName}</strong>
            </p>
          </div>

          {/* Deceptive Note */}
          <div className="bg-red-950/40 border border-red-800/80 rounded-xl p-2.5 text-left space-y-1">
            <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider block">
              {t.deceptiveNoteTitle}
            </span>
            <p className="text-[11px] text-red-200 font-sans italic leading-tight">
              "{lesson.scammerSpeech[language] || lesson.scammerSpeech.en}"
            </p>
          </div>

          {/* Golden Rule Warning Box */}
          <div className="bg-amber-400 text-slate-950 rounded-xl p-2 text-left flex items-start gap-2 shadow-md">
            <AlertTriangle className="w-4 h-4 text-slate-950 shrink-0 mt-0.5" />
            <div className="text-[10px] leading-tight font-bold">
              <span className="font-extrabold block">GOLDEN RULE:</span>
              You NEVER enter a UPI PIN to receive money! Entering PIN will DEDUCT ₹4,500!
            </div>
          </div>
        </div>

        {/* PIN Trap Warning Banner */}
        {pinTrapWarning && (
          <div className="my-1.5 p-2 rounded-xl bg-red-600 text-white font-extrabold text-[10px] leading-snug shadow-2xl border-2 border-white animate-bounce text-left flex items-start gap-1.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{pinTrapWarning}</span>
          </div>
        )}

        {/* Selvi Mentor Guidance Card */}
        <div className="my-1.5 shrink-0">
          <div className="bg-white rounded-2xl p-2 border-2 border-purple-600 shadow-xl flex flex-col text-left">
            <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-wider mb-0.5">
              {t.selviMentor}
            </span>
            <p className="text-xs font-semibold text-slate-900 leading-snug">
              {currentGuideText}
            </p>
          </div>
        </div>

        {/* Action Buttons: Pay (Trap) vs Decline (Safe) */}
        <div className="space-y-2 pb-3 pt-1 shrink-0">
          {/* Safe Action: Decline Request */}
          <button
            data-demo-id="upi-decline-btn"
            onClick={handleDeclineRequest}
            className={`w-full py-3.5 rounded-2xl font-extrabold text-xs shadow-2xl flex items-center justify-center gap-2 cursor-pointer transition active:scale-95 border-2 ${
              isDeclined
                ? 'bg-slate-800 text-emerald-400 border-slate-700'
                : 'bg-red-600 hover:bg-red-700 text-white border-red-400 ring-4 ring-red-500/30'
            }`}
          >
            <Ban className="w-4 h-4" />
            <span>{isDeclined ? t.declineSuccess : t.declineBtn}</span>
          </button>

          {/* Dangerous Action: Pay (Trap) */}
          <button
            onClick={handlePayClick}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-[11px] font-bold flex items-center justify-center gap-1.5 border border-slate-800 cursor-pointer active:scale-95"
          >
            <CreditCard className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.payBtn}</span>
          </button>
        </div>

        {/* Simulated PIN Keypad Modal (Trap Simulator) */}
        {showPinModal && (
          <div className="absolute inset-0 z-40 bg-slate-950/95 p-4 flex flex-col justify-between text-center animate-in zoom-in-95 duration-200">
            <div className="pt-2 flex justify-between items-center">
              <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                DANGER ZONE
              </span>
              <button
                onClick={() => setShowPinModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 my-auto">
              <div className="w-12 h-12 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center mx-auto text-red-400">
                <KeyRound className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="text-sm font-extrabold text-white">
                {t.enterPinPrompt}
              </h4>
              <p className="text-[10px] text-red-300 font-medium max-w-xs mx-auto">
                {t.dangerNotice}
              </p>

              {/* 6 PIN Dots */}
              <div className="flex justify-center gap-2 pt-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`w-7 h-8 rounded-lg border-2 flex items-center justify-center font-bold text-xs ${
                      enteredPin.length > i
                        ? 'border-red-500 bg-red-950 text-red-400'
                        : 'border-slate-700 bg-slate-900 text-slate-600'
                    }`}
                  >
                    {enteredPin.length > i ? '•' : ''}
                  </div>
                ))}
              </div>

              {/* Keypad */}
              <div className="grid grid-cols-3 gap-1.5 max-w-[200px] mx-auto pt-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '✓'].map((k) => (
                  <button
                    key={k}
                    onClick={() => {
                      if (k === 'C') setEnteredPin('');
                      else handleKeypadPress(k);
                    }}
                    className="py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer active:scale-95"
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>

            <div className="pb-3 space-y-2">
              <button
                onClick={handleDeclineRequest}
                className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-xl flex items-center justify-center gap-1.5"
              >
                <Ban className="w-4 h-4" />
                <span>Cancel & Decline Request Now</span>
              </button>
            </div>
          </div>
        )}

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
                You saved ₹4,500 by declining the fraudulent collect request. Your bank account remains completely secure!
              </p>
            </div>

            {/* Golden Rules Summary */}
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
