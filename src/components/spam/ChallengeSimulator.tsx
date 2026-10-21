'use client';

import React, { useState, useEffect } from 'react';
import {
  Award,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Check,
  X,
  Phone,
  MessageSquare,
  CreditCard,
  Smartphone,
  Trophy,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { SpamLanguageCode } from './types';
import { FINAL_CHALLENGE_SCENARIOS } from './fraudCurriculum';
import { spamVoiceManager } from './voice';

interface ChallengeSimulatorProps {
  language: SpamLanguageCode;
  onComplete: (score: number) => void;
  onBackToPath: () => void;
}

const UI_TEXT = {
  en: {
    title: 'Cyber Defense Exam',
    scenarioCounter: 'Scenario {current} of {total}',
    scoreBadge: 'Score: {score} / {total}',
    promptHeader: 'WHAT IS THE SAFEST ACTION?',
    correctBanner: '✓ SAFE & CORRECT DECISION!',
    unsafeBanner: '⚠️ DANGEROUS CHOICE!',
    nextBtn: 'Next Scenario',
    finishBtn: 'View Final Result',
    retryQuestion: 'Retry this question',
    tryAgainFull: 'Retry Full Challenge',
    completePathBtn: 'Complete Learning Path',
    backToPath: 'Back to Learning Path',
    selviMentor: 'SELVI, YOUR SECURITY MENTOR',
    finalTitle: 'Final Cyber Safety Exam Result',
    masteryNotice: 'You have proven your ability to identify and neutralize cyber fraud in real-world scenarios.',
    skillsEarnedTitle: 'Skills Mastered in This Path:',
    skill1: 'Refused ATM PIN & OTP requests on phone calls',
    skill2: 'Avoided tapping suspicious phishing links in SMS & WhatsApp',
    skill3: 'Enforced the UPI rule: PIN is ONLY to send money',
    skill4: 'Denied remote-access screen sharing apps (AnyDesk/QuickSupport)',
  },
  ta: {
    title: 'இறுதி சைபர் பாதுகாப்பு தேர்வு',
    scenarioCounter: 'சூழ்நிலை {current} / {total}',
    scoreBadge: 'மதிப்பெண்: {score} / {total}',
    promptHeader: 'இதில் நீங்கள் எடுக்க வேண்டிய மிகச் சரியான முடிவு எது?',
    correctBanner: '✓ மிகச் சரியான & பாதுகாப்பான முடிவு!',
    unsafeBanner: '⚠️ ஆபத்தான முடிவு!',
    nextBtn: 'அடுத்த சூழ்நிலை',
    finishBtn: 'இறுதி முடிவைப் பார்',
    retryQuestion: 'மீண்டும் முயற்சி செய்',
    tryAgainFull: 'முழு தேர்வையும் மீண்டும் எழுது',
    completePathBtn: 'பாதுகாப்புப் பாதையை முடி',
    backToPath: 'பயிற்சிப் பாதைக்குத் திரும்பு',
    selviMentor: 'செல்வி, உங்கள் பாதுகாப்பு வழிகாட்டி',
    finalTitle: 'இறுதி பாதுகாப்புத் தேர்வு முடிவுகள்',
    masteryNotice: 'நிஜ வாழ்க்கையில் வரும் டிஜிட்டல் மோசடிகளைத் துணிவுடன் எதிர்கொள்ளும் திறமையை நீங்கள் பெற்றுவிட்டீர்கள்.',
    skillsEarnedTitle: 'நீங்கள் தேர்ச்சி பெற்ற 4 பாதுகாப்புத் திறன்கள்:',
    skill1: 'போனில் ஏடிஎம் பின் மற்றும் OTP கேட்கும் அழைப்புகளைத் துண்டித்தல்',
    skill2: 'எஸ்.எம்.எஸ் மற்றும் வாட்ஸ்அப் போலி லிங்குகளைத் தொடாமல் தடுத்தல்',
    skill3: 'யுபிஐ தங்க விதி: பணம் அனுப்ப மட்டுமே பின்; பெற ஒருபோதும் இல்லை',
    skill4: 'AnyDesk போன்ற ஆபத்தான திரைப் பகிர்வு செயலிகளை நிராகரித்தல்',
  },
  hi: {
    title: 'अंतिम साइबर सुरक्षा परीक्षा',
    scenarioCounter: 'केस {current} / {total}',
    scoreBadge: 'स्कोर: {score} / {total}',
    promptHeader: 'सबसे सुरक्षित कदम क्या होगा?',
    correctBanner: '✓ बिल्कुल सही व सुरक्षित फैसला!',
    unsafeBanner: '⚠️ खतरनाक फैसला!',
    nextBtn: 'अगला केस',
    finishBtn: 'अंतिम परिणाम देखें',
    retryQuestion: 'दोबारा प्रयास करें',
    tryAgainFull: 'पूरी परीक्षा फिर से दें',
    completePathBtn: 'लर्निंग पाथ पूरा करें',
    backToPath: 'लर्निंग पाथ पर वापस जाएं',
    selviMentor: 'सेल्वी, आपकी सुरक्षा सलाहकार',
    finalTitle: 'साइबर सुरक्षा परीक्षा परिणाम',
    masteryNotice: 'आपने वास्तविक डिजिटल घोटालों को पहचानने और सुरक्षित रहने की क्षमता साबित कर दी है।',
    skillsEarnedTitle: 'आपने जो 4 मुख्य सुरक्षा कौशल सीखे:',
    skill1: 'फोन कॉल पर एटीएम पिन व ओटीपी देने से साफ इनकार करना',
    skill2: 'एसएमएस या व्हाट्सएप पर आए फर्जी लिंक पर क्लिक न करना',
    skill3: 'यूपीआई नियम: पिन सिर्फ पैसे भेजने के लिए होता है, पाने के लिए नहीं',
    skill4: 'AnyDesk जैसे रिमोट ऐप डाउनलोड करने से मना करना',
  },
};

export const ChallengeSimulator: React.FC<ChallengeSimulatorProps> = ({
  language = 'en',
  onComplete,
  onBackToPath,
}) => {
  const [scenarioIndex, setScenarioIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<'A' | 'B' | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [scores, setScores] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const t = UI_TEXT[language] || UI_TEXT.en;
  const currentScenario = FINAL_CHALLENGE_SCENARIOS[scenarioIndex];

  // Speak scenario prompt on step change
  useEffect(() => {
    if (!isFinished && currentScenario) {
      const promptText = currentScenario.scenarioPrompt[language] || currentScenario.scenarioPrompt.en;
      spamVoiceManager.speak(promptText, language);
    }
    return () => {
      spamVoiceManager.stop();
    };
  }, [scenarioIndex, language, isFinished, currentScenario]);

  // Handle option selection
  const handleSelectOption = (optionId: 'A' | 'B') => {
    if (hasAnswered) return;

    setSelectedOptionId(optionId);
    setHasAnswered(true);

    const chosenOption = currentScenario.options.find((opt) => opt.id === optionId);
    const isSafe = chosenOption?.isSafe ?? false;

    setScores((prev) => ({
      ...prev,
      [currentScenario.id]: isSafe,
    }));

    const explanation = chosenOption?.explanation[language] || chosenOption?.explanation.en || '';
    spamVoiceManager.speak(explanation, language);
  };

  // Next Question
  const handleNext = () => {
    if (scenarioIndex < FINAL_CHALLENGE_SCENARIOS.length - 1) {
      setScenarioIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setHasAnswered(false);
    } else {
      setIsFinished(true);
      const totalScore = Object.values(scores).filter(Boolean).length;
      onComplete(totalScore);

      const celebrationSpeech =
        language === 'ta'
          ? 'வாழ்த்துகள்! 8 சைபர் மோசடி பாதுகாப்புப் பாடங்களையும் நீங்கள் வெற்றிகரமாக முடித்துவிட்டீர்கள்!'
          : language === 'hi'
          ? 'बधाई हो! आपने सभी 8 डिजिटल सुरक्षा पाठ सफलतापूर्वक पूरे कर लिए हैं!'
          : 'Congratulations! You have successfully mastered all 8 Spam & Digital Fraud Safety lessons!';
      spamVoiceManager.speak(celebrationSpeech, language);
    }
  };

  // Retry this question
  const handleRetryCurrent = () => {
    setSelectedOptionId(null);
    setHasAnswered(false);
    const promptText = currentScenario.scenarioPrompt[language] || currentScenario.scenarioPrompt.en;
    spamVoiceManager.speak(promptText, language);
  };

  // Full retry
  const handleFullRetry = () => {
    setScenarioIndex(0);
    setSelectedOptionId(null);
    setHasAnswered(false);
    setScores({});
    setIsFinished(false);
  };

  const currentScore = Object.values(scores).filter(Boolean).length;
  const chosenOption = currentScenario?.options.find((opt) => opt.id === selectedOptionId);

  return (
    <div className="relative w-full max-w-[390px] h-[600px] sm:h-[640px] bg-slate-950 rounded-[44px] shadow-2xl overflow-hidden border-[10px] border-slate-900 flex flex-col select-none ring-1 ring-slate-800">
      {/* Phone Cutout */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-slate-900 z-50 flex items-center justify-center">
        <div className="w-24 h-4 bg-black rounded-b-xl flex items-center justify-center">
          <div className="w-10 h-1 bg-slate-800 rounded-full" />
        </div>
      </div>

      {/* Simulator Warning Banner */}
      <div className="bg-red-950/80 border-b border-red-800/60 px-3 py-1 flex items-center justify-between text-[11px] font-bold text-red-200 z-40 mt-6 shrink-0">
        <span className="flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.title}</span>
        </span>
        <span className="text-amber-300">
          {t.scoreBadge
            .replace('{score}', String(currentScore))
            .replace('{total}', String(FINAL_CHALLENGE_SCENARIOS.length))}
        </span>
      </div>

      {/* Main Content Area */}
      {!isFinished ? (
        <div className="flex-1 flex flex-col justify-between p-3.5 bg-slate-950 text-white overflow-y-auto">
          {/* Scenario Counter & Badge */}
          <div className="flex items-center justify-between text-xs pb-1 shrink-0">
            <span className="text-slate-400 font-semibold">
              {t.scenarioCounter
                .replace('{current}', String(scenarioIndex + 1))
                .replace('{total}', String(FINAL_CHALLENGE_SCENARIOS.length))}
            </span>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-bold">
              {currentScenario.badge[language] || currentScenario.badge.en}
            </span>
          </div>

          {/* Scenario Simulation Preview Box */}
          <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-3 space-y-2 text-left shadow-xl shrink-0">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 border-b border-slate-800 pb-1.5">
              {currentScenario.type === 'CALL' && <Phone className="w-4 h-4 text-emerald-400" />}
              {currentScenario.type === 'SMS' && <MessageSquare className="w-4 h-4 text-sky-400" />}
              {currentScenario.type === 'UPI' && <CreditCard className="w-4 h-4 text-purple-400" />}
              {currentScenario.type === 'REMOTE' && <Smartphone className="w-4 h-4 text-amber-400" />}
              <span className="truncate">{currentScenario.senderOrCaller}</span>
            </div>

            {/* Preview speech / message quote */}
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-[11px] font-sans text-slate-200 italic leading-snug">
              {currentScenario.contentPreview[language] || currentScenario.contentPreview.en}
            </div>

            {/* Scenario Question Prompt */}
            <p className="text-xs font-extrabold text-white leading-snug pt-1">
              {currentScenario.scenarioPrompt[language] || currentScenario.scenarioPrompt.en}
            </p>
          </div>

          {/* Options Section */}
          <div className="space-y-2 py-2 shrink-0">
            <span className="text-[9px] font-extrabold text-amber-300 uppercase tracking-wider block text-left">
              {t.promptHeader}
            </span>

            {currentScenario.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const isSafe = opt.isSafe;

              let btnStyle = 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200';
              if (hasAnswered) {
                if (isSafe) {
                  btnStyle = 'border-emerald-500 bg-emerald-950/70 text-emerald-100 ring-2 ring-emerald-500';
                } else if (isSelected && !isSafe) {
                  btnStyle = 'border-red-500 bg-red-950/70 text-red-100 ring-2 ring-red-500 animate-bounce';
                } else {
                  btnStyle = 'border-slate-800 bg-slate-900/50 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={hasAnswered}
                  className={`w-full p-2.5 rounded-2xl border-2 text-left transition cursor-pointer flex items-start gap-2 text-xs font-semibold active:scale-98 shadow-md ${btnStyle}`}
                >
                  <span
                    className={`w-6 h-6 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isSelected
                        ? isSafe
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {opt.id}
                  </span>
                  <span className="leading-snug">
                    {opt.text[language] || opt.text.en}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Explanation Card upon answering */}
          {hasAnswered && chosenOption && (
            <div
              className={`p-2.5 rounded-2xl border-2 text-left space-y-1 shrink-0 animate-in zoom-in-95 duration-200 ${
                chosenOption.isSafe
                  ? 'border-emerald-500 bg-emerald-950/80 text-emerald-100 shadow-xl'
                  : 'border-red-500 bg-red-950/80 text-red-100 shadow-xl'
              }`}
            >
              <div className="flex items-center gap-1.5 font-extrabold text-[11px]">
                {chosenOption.isSafe ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t.correctBanner}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{t.unsafeBanner}</span>
                  </>
                )}
              </div>
              <p className="text-[11px] leading-snug">
                {chosenOption.explanation[language] || chosenOption.explanation.en}
              </p>
            </div>
          )}

          {/* Action buttons at bottom */}
          <div className="pt-2 pb-2 shrink-0">
            {hasAnswered ? (
              <div className="flex gap-2">
                {!chosenOption?.isSafe && (
                  <button
                    onClick={handleRetryCurrent}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.retryQuestion}</span>
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95"
                >
                  <span>
                    {scenarioIndex < FINAL_CHALLENGE_SCENARIOS.length - 1
                      ? t.nextBtn
                      : t.finishBtn}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="p-2 text-center text-[10px] text-slate-400 italic">
                Choose Option A or Option B above to test your safety reaction.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Final Exam Celebration & Results Screen */
        <div className="flex-1 flex flex-col justify-between p-4 bg-slate-950 text-white overflow-y-auto animate-in zoom-in-95 duration-200">
          <div className="pt-4 space-y-2 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-300 flex items-center justify-center mx-auto shadow-2xl">
              <Trophy className="w-9 h-9 text-amber-400" />
            </div>

            <h3 className="text-lg font-extrabold text-white">
              {t.finalTitle}
            </h3>
            <p className="text-xs text-amber-300 font-bold">
              {currentScore === 4
                ? '🏆 100% Cyber Defense Champion! (4/4 Scams Neutralized)'
                : `🛡️ ${currentScore} of 4 Scenarios Successfully Defeated!`}
            </p>
            <p className="text-[11px] text-slate-300 max-w-xs mx-auto">
              {t.masteryNotice}
            </p>
          </div>

          {/* 4 Core Skills Awarded */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-left space-y-2 my-2">
            <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wide block">
              {t.skillsEarnedTitle}
            </span>
            <ul className="text-[11px] text-slate-200 space-y-2">
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{t.skill1}</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{t.skill2}</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{t.skill3}</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{t.skill4}</span>
              </li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="space-y-2 pb-2">
            <button
              onClick={onBackToPath}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t.completePathBtn}</span>
            </button>

            <button
              onClick={handleFullRetry}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.tryAgainFull}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
