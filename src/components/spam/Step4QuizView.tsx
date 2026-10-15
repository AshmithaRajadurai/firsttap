import React, { useState } from 'react';
import { AppTranslation, QuizQuestion } from './types';
import { 
  CheckCircle2, 
  XCircle, 
  Award, 
  ArrowRight, 
  ArrowLeft,
  RotateCcw, 
  ShieldCheck, 
  Sparkles,
  Home
} from 'lucide-react';

interface Step4QuizViewProps {
  content: AppTranslation['step4Quiz'];
  nav: AppTranslation['nav'];
  onRestartLesson: () => void;
  onPrevious: () => void;
  onQuizCompleted?: (score: number, total: number) => void;
  onFinishModule?: () => void;
}

export const Step4QuizView: React.FC<Step4QuizViewProps> = ({
  content,
  nav,
  onRestartLesson,
  onPrevious,
  onQuizCompleted,
  onFinishModule,
}) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const currentQ: QuizQuestion = content.questions[currentQuestionIdx];
  const selectedOptionId = selectedAnswers[currentQ?.id];

  const handleSelectOption = (optId: string) => {
    if (!isSubmitted) {
      setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: optId }));
    }
  };

  const handleCheck = () => {
    if (!selectedOptionId) return;
    setIsSubmitted(true);

    const chosenOption = currentQ.options.find((o: any) => o.id === selectedOptionId);
    if (chosenOption && chosenOption.isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < content.questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setIsSubmitted(false);
    } else {
      setQuizFinished(true);
      // Final question answered, notify completion
      const finalChosen = currentQ.options.find((o: any) => o.id === selectedOptionId);
      const finalScore = finalChosen && finalChosen.isCorrect ? score : score;
      if (onQuizCompleted) {
        onQuizCompleted(finalScore, content.questions.length);
      }
    }
  };

  const handleRetryQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-4">
      {/* Title & Subtitle */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-lg mb-2">
          <Award className="w-3.5 h-3.5" />
          <span>Step 4: Safety Quiz & Golden Rules</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          {content.title}
        </h2>
        <p className="text-base text-slate-600 leading-relaxed">
          {content.subtitle}
        </p>
      </div>

      {!quizFinished ? (
        /* Quiz in progress */
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-bold">
            <span className="text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
              Question {currentQuestionIdx + 1} of {content.questions.length}
            </span>
            <span className="text-slate-500">
              {nav.score}: <strong className="text-teal-700 font-mono text-sm">{score}</strong> / {content.questions.length}
            </span>
          </div>

          {/* Question Text */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt: any) => {
              const isSelected = selectedOptionId === opt.id;
              const showOutcome = isSubmitted;

              let cardStyle = 'bg-white border-slate-200 hover:border-teal-400 hover:bg-slate-50/50';
              if (isSelected && !showOutcome) {
                cardStyle = 'bg-teal-50 border-teal-500 ring-2 ring-teal-400';
              } else if (showOutcome && opt.isCorrect) {
                cardStyle = 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400 text-emerald-950';
              } else if (showOutcome && isSelected && !opt.isCorrect) {
                cardStyle = 'bg-rose-50 border-rose-400 ring-2 ring-rose-400 text-rose-950';
              }

              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`p-3.5 sm:p-4 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 ${cardStyle}`}
                >
                  <div className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center shrink-0 text-xs ${
                    isSelected ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {opt.id.toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold leading-snug">
                      {opt.text}
                    </p>
                  </div>

                  {showOutcome && opt.isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  {showOutcome && isSelected && !opt.isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Explanation after checking */}
          {isSubmitted && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-1 animate-in fade-in duration-200">
              <span className="font-bold block text-slate-900">Why this matters:</span>
              <p className="leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Quiz Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {!isSubmitted ? (
              <button
                onClick={handleCheck}
                disabled={!selectedOptionId}
                className={`px-7 py-3 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer ${
                  selectedOptionId
                    ? 'bg-teal-600 hover:bg-teal-700 text-white active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {nav.checkAnswer}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-7 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>
                  {currentQuestionIdx < content.questions.length - 1
                    ? 'Next Question'
                    : 'View Final Score'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onPrevious}
              className="px-5 py-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{nav.previous}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Quiz Completion Card */
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-teal-700 via-teal-800 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden text-center sm:text-left">
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center shrink-0 shadow-inner">
                <Award className="w-10 h-10 text-amber-300 mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-100">Certified</span>
              </div>

              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-200 bg-white/10 px-3 py-1 rounded-full mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Module Completed</span>
                </div>
                <h3 className="text-2xl font-extrabold tracking-tight mb-2">
                  {content.quizCompletedTitle}
                </h3>
                <p className="text-sm text-teal-100/90 leading-relaxed max-w-xl">
                  {content.quizCompletedDesc}
                </p>
              </div>

              {/* Score Display */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center min-w-[120px]">
                <span className="text-[11px] uppercase tracking-wider text-teal-200 font-semibold block mb-1">
                  {nav.score}
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold text-amber-300 font-mono">
                  {score}/{content.questions.length}
                </span>
              </div>
            </div>
          </div>

          {/* Golden Rules of SMS Safety */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-700" />
              <span>Key Safety Rules to Always Remember</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {content.goldenRules.map((rule: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3"
                >
                  <div className="w-7 h-7 rounded-xl bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 mb-0.5">{rule.title}</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">{rule.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {onFinishModule && (
              <button
                onClick={onFinishModule}
                className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Return to Learning Dashboard</span>
              </button>
            )}

            <button
              onClick={handleRetryQuiz}
              className="px-6 py-3.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-sm rounded-xl shadow-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>

            <button
              onClick={onRestartLesson}
              className="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{nav.restartLesson}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
