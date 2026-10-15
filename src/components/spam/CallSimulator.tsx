'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Phone,
  PhoneOff,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  KeyRound,
  Ban,
  Check,
  MousePointer,
} from 'lucide-react';
import { SpamCallLesson, SpamLanguageCode } from './types';
import { FRAUD_PRACTICE_TASKS } from './fraudCurriculum';
import { spamVoiceManager } from './voice';

interface CallSimulatorProps {
  lesson: SpamCallLesson;
  language: SpamLanguageCode;
  onLessonComplete: () => void;
  onNextLesson: () => void;
  onBackToPath: () => void;
}

export const CallSimulator: React.FC<CallSimulatorProps> = ({
  lesson,
  language = 'en',
  onLessonComplete,
  onNextLesson,
  onBackToPath,
}) => {
  const [phase, setPhase] = useState<'DEMO' | 'PRACTICE' | 'SUCCESS'>('DEMO');
  const [screen, setScreen] = useState<'SPAM_INCOMING' | 'SPAM_CALL_ACTIVE' | 'SPAM_BLOCKED'>('SPAM_INCOMING');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [practiceStepIndex, setPracticeStepIndex] = useState<number>(0);
  const [isTargetGlowing, setIsTargetGlowing] = useState<boolean>(false);
  const [wrongTapMessage, setWrongTapMessage] = useState<string | null>(null);
  const [isWrongTargetShaking, setIsWrongTargetShaking] = useState<boolean>(false);

  // Keypad trap state
  const [spamAttemptedPin, setSpamAttemptedPin] = useState<string>('');
  const [spamWarningAlert, setSpamWarningAlert] = useState<string | null>(null);
  const [isSpamReported, setIsSpamReported] = useState<boolean>(false);

  // Demo cursor animation
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number }>({ x: 50, y: 70 });
  const [pointerVisible, setPointerVisible] = useState<boolean>(false);
  const [isRippling, setIsRippling] = useState<boolean>(false);
  const [demoCaption, setDemoCaption] = useState<string>('');

  const phoneRef = useRef<HTMLDivElement | null>(null);
  const abortDemoRef = useRef<boolean>(false);
  const practiceTask = FRAUD_PRACTICE_TASKS[lesson.id] || FRAUD_PRACTICE_TASKS[1];

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

  // Reset simulator
  const resetToPhase = useCallback(
    (targetPhase: 'DEMO' | 'PRACTICE') => {
      spamVoiceManager.stop();
      abortDemoRef.current = true;

      setPhase(targetPhase);
      setCurrentStepIndex(0);
      setPracticeStepIndex(0);
      setScreen('SPAM_INCOMING');
      setSpamAttemptedPin('');
      setSpamWarningAlert(null);
      setIsSpamReported(false);
      setWrongTapMessage(null);
      setIsWrongTargetShaking(false);
      setIsTargetGlowing(false);
      setPointerVisible(false);

      if (targetPhase === 'PRACTICE') {
        const firstStep = practiceTask.steps[0];
        if (firstStep) {
          setTimeout(() => {
            spamVoiceManager.speak(firstStep.instruction[language], language);
          }, 300);
        }
      }
    },
    [practiceTask, language]
  );

  // DEMO LOOP
  useEffect(() => {
    if (phase !== 'DEMO') return;

    abortDemoRef.current = false;
    let isSubscribed = true;

    const runDemo = async () => {
      await sleep(350);

      for (let i = 0; i < lesson.steps.length; i++) {
        if (abortDemoRef.current || !isSubscribed) return;

        const step = lesson.steps[i];
        setCurrentStepIndex(i);
        setDemoCaption(step.caption[language]);
        setScreen(step.screen as any);

        await spamVoiceManager.speakAsync(step.caption[language], language, {
          fallbackTimeoutMs: 12000,
        });

        await sleep(600);
        if (abortDemoRef.current || !isSubscribed) return;

        if (step.action === 'tap') {
          const targetEl = await waitForEl(step.targetId);
          if (targetEl && !abortDemoRef.current) {
            await movePointerTo(targetEl);
            setIsRippling(true);
            await sleep(180);
            setIsRippling(false);

            targetEl.click();
            await sleep(800);
          }
        } else if (step.action === 'point') {
          const targetEl = await waitForEl(step.targetId);
          if (targetEl && !abortDemoRef.current) {
            await movePointerTo(targetEl);
            await sleep(1200);
          }
        } else if (step.action === 'wait' && step.waitMs) {
          setPointerVisible(false);
          await sleep(step.waitMs);
        }

        if (abortDemoRef.current || !isSubscribed) return;
        await sleep(500);
      }

      if (isSubscribed && !abortDemoRef.current) {
        setPointerVisible(false);
        const transitionNotice =
          language === 'ta'
            ? 'இப்போது உங்கள் முறை. நீங்களே செய்து பழகுங்கள்!'
            : language === 'hi'
            ? 'अब आपकी बारी है। खुद करके अभ्यास करें!'
            : "Now it's your turn. Try it yourself!";
        setDemoCaption(transitionNotice);
        await spamVoiceManager.speakAsync(transitionNotice, language, { fallbackTimeoutMs: 6000 });
        await sleep(600);

        if (isSubscribed && !abortDemoRef.current) {
          resetToPhase('PRACTICE');
        }
      }
    };

    runDemo();

    return () => {
      isSubscribed = false;
      abortDemoRef.current = true;
      spamVoiceManager.stop();
    };
  }, [phase, lesson, language, resetToPhase]);

  // Advance practice step
  const advancePractice = (options?: { skipAutoVoice?: boolean }) => {
    if (phase !== 'PRACTICE') return;

    const nextIndex = practiceStepIndex + 1;
    if (nextIndex >= practiceTask.steps.length) {
      setPhase('SUCCESS');
      onLessonComplete();
      spamVoiceManager.speak(lesson.successMessage[language], language);
    } else {
      setPracticeStepIndex(nextIndex);
      const nextStep = practiceTask.steps[nextIndex];
      if (nextStep && !options?.skipAutoVoice) {
        spamVoiceManager.speak(nextStep.instruction[language], language);
      }
    }
  };

  // Wrong tap handler
  const handlePhoneContainerClickCapture = (e: React.MouseEvent) => {
    if (phase !== 'PRACTICE') return;

    const currentStep = practiceTask.steps[practiceStepIndex];
    if (!currentStep) return;

    const clickTarget = e.target as HTMLElement;
    const targetEl = phoneRef.current?.querySelector(`[data-demo-id="${currentStep.targetId}"]`);

    if (!targetEl) return;

    const isInsideTarget = targetEl.contains(clickTarget);

    if (!isInsideTarget) {
      // Allow keypad clicks to trigger safety warning
      if (clickTarget.closest('.keypad-btn')) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      setIsWrongTargetShaking(true);
      setIsTargetGlowing(true);
      const warnMsg =
        language === 'ta'
          ? 'இங்கு தொடாதீர்கள், ஒளிரும் பொத்தானைத் தொடவும்!'
          : language === 'hi'
          ? 'यहाँ नहीं, चमकते हुए बटन को दबाएं!'
          : 'Not this one, tap the glowing button';
      setWrongTapMessage(warnMsg);

      setTimeout(() => setIsWrongTargetShaking(false), 500);
      setTimeout(() => setWrongTapMessage(null), 2500);
    }
  };

  // Phone Call Actions
  const handleAnswerCall = () => {
    setScreen('SPAM_CALL_ACTIVE');
    setSpamAttemptedPin('');
    setSpamWarningAlert(null);
    const targetNextStep = practiceTask.steps[practiceStepIndex + 1];
    advancePractice({ skipAutoVoice: true });

    if (phase === 'PRACTICE') {
      // First let the scammer dialogue speak naturally, then seamlessly deliver Selvi's safety guidance
      spamVoiceManager.speak(lesson.scammerSpeech[language], language, () => {
        if (targetNextStep) {
          spamVoiceManager.speak(targetNextStep.instruction[language], language);
        }
      });
    }
  };

  const handleHangupCall = () => {
    setScreen('SPAM_BLOCKED');
    setSpamWarningAlert(null);
    const targetNextStep = practiceTask.steps[practiceStepIndex + 1];
    advancePractice({ skipAutoVoice: true });

    if (phase === 'PRACTICE') {
      const hangupVoice =
        language === 'ta'
          ? 'மிகச் சிறப்பு! இணைப்பைத் துண்டித்துவிட்டீர்கள். இப்போது இந்த எண்ணை பிளாக் செய்யுங்கள்.'
          : language === 'hi'
          ? 'शाबाश! आपने कॉल काट दिया। अब इस नंबर को ब्लॉक और रिपोर्ट करें।'
          : 'Great move! You hung up on the fraudster. Now block and report this number.';
      const fullNotice = targetNextStep ? `${hangupVoice} ${targetNextStep.instruction[language]}` : hangupVoice;
      spamVoiceManager.speak(fullNotice, language);
    }
  };

  const handleBlockReport = () => {
    setIsSpamReported(true);
    advancePractice();
  };

  const handleKeypadPress = (digit: string) => {
    setSpamAttemptedPin((prev) => (prev.length < 4 ? prev + digit : prev));
    const alertMsg =
      language === 'ta'
        ? '🚨 நிறுத்துங்கள்! ஏடிஎம் பின் அல்லது OTP-ஐ ஒருபோதும் உள்ளிடாதீர்கள்! உடனே சிவப்பு HANG UP பொத்தானைத் தொடவும்!'
        : language === 'hi'
        ? '🚨 रुकिए! कभी भी एटीएम पिन या ओटीपी न डालें! तुरंत लाल HANG UP बटन दबाएं!'
        : '🚨 STOP! NEVER ENTER OR SHARE YOUR ATM PIN! Real banks NEVER ask for your PIN. Tap red HANG UP!';
    setSpamWarningAlert(alertMsg);
    setIsWrongTargetShaking(true);
    setIsTargetGlowing(true);

    spamVoiceManager.speak(alertMsg, language);

    setTimeout(() => setIsWrongTargetShaking(false), 600);
    setTimeout(() => setSpamWarningAlert(null), 4000);
  };

  const currentPracticeStep = practiceTask.steps[practiceStepIndex];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Phase Header Bar */}
      <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800 text-xs">
        <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
          <span>{lesson.shortTitle[language]}</span>
        </span>
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
            phase === 'DEMO'
              ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
              : phase === 'PRACTICE'
              ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 animate-pulse'
              : 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200'
          }`}
        >
          {phase === 'DEMO'
            ? language === 'ta'
              ? '📹 செயல்விளக்கம்'
              : '📹 Phase 1: Demo'
            : phase === 'PRACTICE'
            ? language === 'ta'
              ? '✍️ பயிற்சி'
              : '✍️ Phase 2: Practice'
            : '🎉 Completed'}
        </span>
      </div>

      {/* Smartphone Frame Canvas */}
      <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[360px] lg:max-w-[380px] select-none font-sans">
        <div className="relative bg-slate-900 p-3 sm:p-3.5 lg:p-4 rounded-[42px] lg:rounded-[46px] shadow-2xl border-4 border-slate-700/80 ring-1 ring-slate-900/50">
          <div
            ref={phoneRef}
            onClickCapture={handlePhoneContainerClickCapture}
            className="relative bg-slate-950 rounded-[32px] lg:rounded-[34px] overflow-hidden flex flex-col h-[520px] sm:h-[560px] lg:h-[600px] shadow-inner text-white"
          >
            {/* Top Phone Cutout */}
            <div className="bg-slate-900 text-white px-5 pt-2 pb-1.5 flex items-center justify-between text-[11px] font-medium tracking-tight z-20">
              <span>10:45 AM</span>
              <div className="w-3.5 h-3.5 bg-black rounded-full ring-2 ring-slate-800 flex items-center justify-center">
                <div className="w-1 h-1 bg-slate-700 rounded-full" />
              </div>
              <span className="text-[10px] text-slate-300">Jio 4G</span>
            </div>

            {/* Fraud Environment Banner */}
            <div className="bg-red-950/90 border-b border-red-800/80 px-3 py-1 flex items-center justify-center text-[10px] font-bold text-red-200 z-30 shrink-0">
              <span>🚨 Cyber Fraud Simulator — Safe Practice</span>
            </div>

            {/* ================= SCREEN A: INCOMING CALL ================= */}
            {screen === 'SPAM_INCOMING' && (
              <div className="flex-1 flex flex-col justify-between p-4 relative overflow-hidden text-center">
                <div className="bg-red-500/20 border border-red-500/60 text-red-300 text-[10px] font-bold py-1 px-2.5 rounded-xl flex items-center justify-center gap-1.5 animate-pulse shrink-0">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                  <span>Suspected Fraud · 1,420+ Reports</span>
                </div>

                <div className="my-auto space-y-2.5 py-4">
                  <div className="relative inline-block mx-auto">
                    <div className="absolute inset-0 -m-3 rounded-full bg-red-600/30 animate-ping duration-1000" />
                    <div className="w-20 h-20 rounded-full bg-red-700 text-white flex items-center justify-center shadow-2xl border-4 border-red-400 relative z-10 mx-auto">
                      <ShieldAlert className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-white">{lesson.callerName}</h3>
                    <p className="text-xs text-red-300 font-mono font-semibold">{lesson.callerNumber}</p>
                    <p className="text-[10px] text-slate-400">{lesson.callerOrg[language]}</p>
                  </div>
                </div>

                {/* Call Action Buttons */}
                <div className="space-y-2 pb-4 shrink-0">
                  <div className="flex justify-around items-center">
                    {/* Decline */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={handleHangupCall}
                        className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-xl active:scale-95 transition cursor-pointer"
                        title="Decline"
                      >
                        <PhoneOff className="w-6 h-6" />
                      </button>
                      <span className="text-[10px] font-bold text-red-300">
                        {language === 'ta' ? 'நிராகரி' : 'Decline'}
                      </span>
                    </div>

                    {/* Answer */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        data-demo-id="spam-answer-call-btn"
                        onClick={handleAnswerCall}
                        className={`w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xl active:scale-95 transition cursor-pointer ring-4 ring-emerald-500/40 ${
                          phase === 'PRACTICE' && currentPracticeStep?.targetId === 'spam-answer-call-btn'
                            ? 'ring-4 ring-amber-400 animate-bounce'
                            : ''
                        }`}
                        title="Answer"
                      >
                        <Phone className="w-6 h-6" />
                      </button>
                      <span className="text-[10px] font-bold text-emerald-300">
                        {language === 'ta' ? 'ஏற்றுக்கொள்' : 'Answer'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SCREEN B: ACTIVE CALL ================= */}
            {screen === 'SPAM_CALL_ACTIVE' && (
              <div className="flex-1 flex flex-col justify-between p-3 relative overflow-y-auto text-left">
                {/* Header */}
                <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-xl px-2.5 py-1 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="text-[10px] font-bold text-red-400">Connected: 00:08</span>
                  </div>
                  <span className="text-[9px] bg-red-950 border border-red-700 text-red-300 font-bold px-1.5 py-0.5 rounded-full">
                    ⚠️ SUSPECTED FRAUD
                  </span>
                </div>

                {/* Scammer Speech Box */}
                <div
                  data-demo-id="spam-scam-dialogue-box"
                  className="bg-red-950/80 border-2 border-red-500/80 rounded-2xl p-2.5 shadow-xl my-1.5 space-y-1 shrink-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span className="text-[10px] font-extrabold text-red-300 uppercase">
                        {language === 'ta' ? 'அழைப்பாளர் பேச்சு' : 'Caller Dialogue'}
                      </span>
                    </div>
                    <span className="text-[9px] bg-red-900 text-red-100 px-1 rounded font-mono">Live</span>
                  </div>
                  <p className="text-[11px] text-red-100 leading-snug font-medium bg-red-900/40 p-2 rounded-xl border border-red-800/60">
                    &ldquo;{lesson.scammerSpeech[language]}&rdquo;
                  </p>
                  <div className="text-[10px] text-amber-300 font-bold flex items-center gap-1 pt-0.5">
                    <AlertTriangle className="w-3 h-3 shrink-0 text-amber-400" />
                    <span>{lesson.redFlagNote[language]}</span>
                  </div>
                </div>

                {/* Keypad Trap: ATM PIN / OTP Demand */}
                <div className="bg-slate-900/90 rounded-2xl p-2 border border-slate-800 my-1 text-center shrink-0">
                  <div className="flex items-center justify-center gap-1 text-[11px] text-slate-300 mb-1">
                    <KeyRound className="w-3 h-3 text-amber-400" />
                    <span className="font-bold">
                      {lesson.fraudType === 'OTP'
                        ? 'Caller demands 6-digit OTP'
                        : 'Caller demands 4-digit ATM PIN'}
                    </span>
                  </div>

                  {/* Masked PIN Boxes */}
                  <div className="flex justify-center gap-1.5 mb-1.5">
                    {[0, 1, 2, 3].map((idx) => (
                      <div
                        key={idx}
                        className={`w-7 h-8 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-xs ${
                          spamAttemptedPin.length > idx
                            ? 'border-red-500 bg-red-950/80 text-red-400'
                            : 'border-slate-700 bg-slate-950 text-slate-500'
                        }`}
                      >
                        {spamAttemptedPin.length > idx ? '•' : ''}
                      </div>
                    ))}
                  </div>

                  {/* Keypad */}
                  <div className="grid grid-cols-3 gap-1 max-w-[180px] mx-auto">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
                      <button
                        key={k}
                        onClick={() => handleKeypadPress(k)}
                        className="keypad-btn py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer active:scale-95"
                      >
                        {k}
                      </button>
                    ))}
                  </div>

                  {spamWarningAlert && (
                    <div className="mt-1 p-1 rounded-lg bg-red-600 text-white font-extrabold text-[10px] leading-tight animate-bounce">
                      {spamWarningAlert}
                    </div>
                  )}
                </div>

                {/* The Safe Action: Hang Up Button */}
                <div className="pt-1 pb-1 shrink-0 flex flex-col items-center">
                  <button
                    data-demo-id="spam-hangup-btn"
                    onClick={handleHangupCall}
                    className={`w-full py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-2xl flex items-center justify-center gap-2 cursor-pointer transition active:scale-95 border border-red-400 ${
                      phase === 'PRACTICE' && currentPracticeStep?.targetId === 'spam-hangup-btn'
                        ? 'ring-4 ring-amber-400 animate-pulse'
                        : ''
                    }`}
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>
                      {language === 'ta'
                        ? 'அழைப்பை துண்டி (Hang Up Immediately)'
                        : 'Hang Up Immediately'}
                    </span>
                  </button>
                  <span className="text-[9px] text-slate-400 mt-0.5">Refuse demand · Hang up now</span>
                </div>
              </div>
            )}

            {/* ================= SCREEN C: BLOCKED ================= */}
            {screen === 'SPAM_BLOCKED' && (
              <div className="flex-1 flex flex-col justify-between p-3.5 text-left overflow-y-auto">
                <div className="text-center pt-2 space-y-1 shrink-0">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-xl">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="font-extrabold text-sm text-white">Call Terminated & Protected!</h3>
                  <p className="text-[10px] text-emerald-300">You successfully refused the fraud demand.</p>
                </div>

                {/* 3 Golden Rules */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 space-y-1.5 my-2 shrink-0">
                  <span className="text-[10px] font-extrabold text-amber-300 uppercase block">
                    {language === 'ta' ? 'பாதுகாப்பு விதிகள்' : 'Security Golden Rules'}
                  </span>
                  <div className="space-y-1 text-[10px] text-slate-300">
                    <p>• <strong>Never Share PIN/OTP:</strong> Real bank officials NEVER ask for PINs or OTPs.</p>
                    <p>• <strong>Ignore Panic Threats:</strong> Threatening immediate freeze is a scammer trick.</p>
                    <p>• <strong>Verify Directly:</strong> Visit your branch or call the number on your card.</p>
                  </div>
                </div>

                {/* Block Button */}
                <div className="pb-2 shrink-0">
                  <button
                    data-demo-id="spam-block-report-btn"
                    onClick={handleBlockReport}
                    className={`w-full py-2.5 rounded-2xl font-bold text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer transition active:scale-95 border ${
                      isSpamReported
                        ? 'bg-slate-800 text-slate-400 border-slate-700'
                        : 'bg-red-600 hover:bg-red-700 text-white border-red-400 ring-2 ring-red-400'
                    }`}
                  >
                    <Ban className="w-4 h-4 text-white" />
                    <span>
                      {isSpamReported
                        ? `✓ Blocked & Reported (${lesson.callerNumber})`
                        : `Block & Report Spam (${lesson.callerNumber})`}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* DEMO POINTER OVERLAY */}
            {phase === 'DEMO' && (
              <div className="absolute inset-0 z-50 pointer-events-none">
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
                    <div className="w-9 h-9 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl border-2 border-white drop-shadow-lg">
                      <MousePointer className="w-4 h-4 fill-slate-950" />
                    </div>
                  </div>
                )}

                <div className="absolute bottom-2 left-2 right-2 pointer-events-auto z-50">
                  <div className="bg-slate-950/95 backdrop-blur-md text-white p-2 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      <span>{demoCaption || 'Demo playing...'}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => resetToPhase('DEMO')}
                        className="px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3 text-amber-400" />
                        <span>Replay</span>
                      </button>
                      <button
                        onClick={() => resetToPhase('PRACTICE')}
                        className="px-2.5 py-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                      >
                        <span>Practice</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PRACTICE HIGHLIGHT ERROR BANNER */}
            {phase === 'PRACTICE' && wrongTapMessage && (
              <div className="absolute top-16 left-3 right-3 z-50 p-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow-2xl text-center border border-white animate-in fade-in">
                {wrongTapMessage}
              </div>
            )}

            {/* SUCCESS CELEBRATION OVERLAY */}
            {phase === 'SUCCESS' && (
              <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-sm p-4 flex flex-col items-center justify-center text-center text-white animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-2xl border-4 border-emerald-400 mb-3">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>

                <h3 className="text-base font-extrabold text-white mb-1">
                  {lesson.successMessage[language]}
                </h3>
                <p className="text-[11px] text-slate-300 max-w-xs mb-4">
                  {lesson.goldenRule[language]}
                </p>

                <div className="w-full max-w-xs space-y-2">
                  <button
                    onClick={onNextLesson}
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xl flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Next Lesson</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => resetToPhase('PRACTICE')}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer border border-slate-700"
                  >
                    <RotateCcw className="w-3 h-3 text-amber-400" />
                    <span>Practice again</span>
                  </button>

                  <button
                    onClick={onBackToPath}
                    className="w-full py-1 text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    Back to Learning Path
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
