import React from 'react';
import { CheckCircle2, RotateCcw, ArrowRight, List } from 'lucide-react';
import { LanguageCode } from './types';

interface SegmentDoneCardProps {
  language: LanguageCode;
  title: string;
  onNext: () => void;
  onDoAgain: () => void;
  onMenu: () => void;
}

export const SegmentDoneCard: React.FC<SegmentDoneCardProps> = ({
  language,
  title,
  onNext,
  onDoAgain,
  onMenu,
}) => {
  return (
    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border-2 border-emerald-400 text-center space-y-4">
        {/* Animated Celebration Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
            {language === 'ta'
              ? 'வெற்றிகரமாக முடித்தீர்கள்!'
              : language === 'hi'
              ? 'सफलतापूर्वक पूरा हुआ!'
              : 'Completed!'}
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
            {title}
          </h3>
        </div>

        {/* 3 Buttons: Next / Do it again / Menu */}
        <div className="space-y-2 pt-2">
          {/* 1. Next */}
          <button
            onClick={onNext}
            className="w-full min-h-[52px] py-3.5 px-4 rounded-2xl bg-[#0D5C63] hover:bg-[#09454A] text-white font-bold text-sm shadow-md active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer border border-teal-500/40"
          >
            <span>{language === 'ta' ? 'அடுத்த பாடம் (Next)' : 'Next Lesson'}</span>
            <ArrowRight className="w-4 h-4 text-teal-200" />
          </button>

          {/* 2. Do it again */}
          <button
            onClick={onDoAgain}
            className="w-full min-h-[48px] py-3 px-4 rounded-2xl bg-teal-50 hover:bg-teal-100 text-[#0D5C63] font-bold text-xs shadow-xs active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer border border-teal-200"
          >
            <RotateCcw className="w-4 h-4 text-teal-700" />
            <span>{language === 'ta' ? 'மீண்டும் பயிற்சி செய் (Do it again)' : 'Do it again'}</span>
          </button>

          {/* 3. Menu */}
          <button
            onClick={onMenu}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-600 font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
          >
            <List className="w-4 h-4 text-slate-500" />
            <span>{language === 'ta' ? 'பாடங்கள் பட்டியல் (Menu)' : 'All Lessons Menu'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
