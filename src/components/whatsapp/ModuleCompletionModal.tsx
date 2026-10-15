import React, { useEffect } from 'react';
import { Trophy, CheckCircle2, RotateCcw, ArrowRight, BookOpen, Sparkles, SkipForward } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LanguageCode } from './types';
import { WhatsAppSegmentId } from '@/types';

interface ModuleCompletionModalProps {
  isOpen: boolean;
  language: LanguageCode;
  completedSegments: WhatsAppSegmentId[];
  skippedSegments: WhatsAppSegmentId[];
  onRevisitSkipped: () => void;
  onOpenMenu: () => void;
  onReturnToDashboard: () => void;
}

export const ModuleCompletionModal: React.FC<ModuleCompletionModalProps> = ({
  isOpen,
  language,
  completedSegments,
  skippedSegments,
  onRevisitSkipped,
  onOpenMenu,
  onReturnToDashboard,
}) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore if canvas-confetti unsupported
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const total = 8;
  const completedCount = completedSegments.length;
  const skippedCount = skippedSegments.length;

  return (
    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border-2 border-emerald-400 dark:border-emerald-500 text-center space-y-4">
        {/* Trophy Header */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-950 flex items-center justify-center mx-auto shadow-xl ring-4 ring-amber-300/60 animate-bounce">
          <Trophy className="w-10 h-10 fill-amber-500" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            {language === 'ta'
              ? 'வாழ்த்துக்கள்!'
              : language === 'hi'
              ? 'बधाई हो!'
              : 'Congratulations!'}
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
            {language === 'ta'
              ? 'வாட்ஸ்அப் பாடம் நிறைவடைந்தது'
              : language === 'hi'
              ? 'व्हाट्सएप मॉड्यूल पूर्ण हुआ'
              : 'WhatsApp Module Completed'}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {language === 'ta'
              ? 'நீங்கள் அனைத்து வாட்ஸ்அப் பாட வரிசைகளையும் வெற்றிகரமாக முடித்துள்ளீர்கள்.'
              : language === 'hi'
              ? 'आपने सभी व्हाट्सएप अभ्यास सफलतापूर्वक पूरे कर लिए हैं।'
              : 'You have navigated through your personalized WhatsApp learning path.'}
          </p>
        </div>

        {/* Stats Pill */}
        <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
            <div className="flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{completedCount}/{total}</span>
            </div>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block mt-0.5">
              {language === 'ta' ? 'முடிந்தது' : 'Completed'}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            <div className="flex items-center justify-center gap-1">
              <SkipForward className="w-3.5 h-3.5" />
              <span>{skippedCount}</span>
            </div>
            <span className="text-[10px] text-slate-600 dark:text-slate-400 block mt-0.5">
              {language === 'ta' ? 'தவிர்க்கப்பட்டது' : 'Skipped'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          {skippedCount > 0 && (
            <button
              onClick={onRevisitSkipped}
              className="w-full min-h-[46px] py-2.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>
                {language === 'ta'
                  ? 'தவிர்த்த பாடங்களை முடிக்கவும் (Revisit Skipped)'
                  : 'Complete Skipped Lessons'}
              </span>
            </button>
          )}

          <button
            onClick={onOpenMenu}
            className="w-full min-h-[44px] py-2 px-4 rounded-2xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-800 dark:text-teal-300 font-bold text-xs border border-teal-200 dark:border-teal-800 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>
              {language === 'ta' ? 'அனைத்து பாடங்கள் பட்டியல்' : 'Review All Lessons'}
            </span>
          </button>

          <button
            onClick={onReturnToDashboard}
            className="w-full min-h-[48px] py-3 px-4 rounded-2xl bg-[#0D5C63] hover:bg-[#09454A] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>
              {language === 'ta' ? 'முதன்மை பக்கத்திற்கு செல் (Dashboard)' : 'Return to FirstTap Dashboard'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
