import React from 'react';
import { AppTranslation } from './types';
import { 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft,
  ShieldAlert, 
  Trash2 
} from 'lucide-react';

interface Step3PracticeViewProps {
  content: AppTranslation['step3Practice'];
  nav: AppTranslation['nav'];
  onSafeAction: () => void;
  onUnsafeAction: () => void;
  onTakeQuiz: () => void;
  onPrevious: () => void;
  practiceStatus: 'idle' | 'unsafe' | 'safe';
  onResetPractice: () => void;
}

export const Step3PracticeView: React.FC<Step3PracticeViewProps> = ({
  content,
  nav,
  onSafeAction,
  onUnsafeAction,
  onTakeQuiz,
  onPrevious,
  practiceStatus,
  onResetPractice,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title & Subtitle */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-lg mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Step 3: Interactive Practice</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          {content.title}
        </h2>
        <p className="text-base text-slate-600 leading-relaxed">
          {content.subtitle}
        </p>
      </div>

      {/* Practice Task Prompt Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 leading-snug">
          {content.taskPrompt}
        </h3>

        {/* Message Content on Practice */}
        <div className="p-4 bg-rose-50/70 border border-rose-300 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-rose-900">
            <span>From: {content.practiceSender}</span>
            <span className="text-[10px] text-rose-700 bg-white px-2 py-0.5 rounded border border-rose-200">
              Normal SMS
            </span>
          </div>
          <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
            "{content.practiceSmsBody}"
          </p>
          <div className="text-xs font-mono text-blue-600 underline bg-white p-2.5 rounded-lg border border-rose-200 break-all">
            {content.practiceSmsLink}
          </div>
        </div>

        {/* Dynamic Feedback Banner */}
        {practiceStatus === 'unsafe' && (
          <div className="p-4 bg-rose-100 border border-rose-300 rounded-xl text-xs sm:text-sm text-rose-950 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 font-bold text-rose-900">
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>Unsafe Choice Detected</span>
            </div>
            <p className="leading-relaxed">{content.unsafeAttemptWarning}</p>
            <button
              onClick={onResetPractice}
              className="mt-1 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{content.tryAgainLabel}</span>
            </button>
          </div>
        )}

        {practiceStatus === 'safe' && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs sm:text-sm text-emerald-950 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Safe Action Accomplished!</span>
            </div>
            <p className="leading-relaxed">{content.safeActionSuccess}</p>
            <p className="text-xs text-emerald-800 font-medium">💡 {content.safeActionTip}</p>
          </div>
        )}

        {/* Action Choice Buttons */}
        <div className="pt-2 space-y-2.5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Choose an action to handle this message:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Safe Action: Block & Report */}
            <button
              onClick={onSafeAction}
              className={`p-3.5 rounded-xl border font-bold text-xs sm:text-sm text-left flex items-center gap-3 transition-all cursor-pointer ${
                practiceStatus === 'safe'
                  ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400 text-emerald-900 shadow-sm'
                  : 'bg-white border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/40 text-slate-800'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span>{content.blockActionLabel}</span>
            </button>

            {/* Safe Action: Ignore & Delete */}
            <button
              onClick={onSafeAction}
              className={`p-3.5 rounded-xl border font-bold text-xs sm:text-sm text-left flex items-center gap-3 transition-all cursor-pointer ${
                practiceStatus === 'safe'
                  ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400 text-emerald-900 shadow-sm'
                  : 'bg-white border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/40 text-slate-800'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <Trash2 className="w-4 h-4" />
              </div>
              <span>{content.ignoreActionLabel}</span>
            </button>

            {/* Unsafe Action: Tap Link (Test) */}
            <button
              onClick={onUnsafeAction}
              className={`p-3.5 rounded-xl border font-bold text-xs sm:text-sm text-left flex items-center gap-3 transition-all sm:col-span-2 cursor-pointer ${
                practiceStatus === 'unsafe'
                  ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-400 text-rose-900'
                  : 'bg-white border-slate-200 hover:border-rose-400 hover:bg-rose-50/30 text-slate-600'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span>{content.tapLinkActionLabel}</span>
                <span className="block text-[11px] font-normal text-slate-500">
                  See what happens if a learner touches the link
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="pt-2 flex flex-wrap items-center gap-3">
        <button
          onClick={onTakeQuiz}
          className="px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-base rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-[0.98] cursor-pointer"
        >
          <span>{nav.takeQuiz}</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={onPrevious}
          className="px-5 py-3.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-sm rounded-2xl transition-all flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{nav.previous}</span>
        </button>
      </div>
    </div>
  );
};
