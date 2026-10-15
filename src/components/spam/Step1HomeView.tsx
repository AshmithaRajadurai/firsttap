import React from 'react';
import { AppTranslation } from './types';
import { Smartphone, BellRing, ArrowRight, ShieldCheck } from 'lucide-react';

interface Step1HomeViewProps {
  content: AppTranslation['step1Home'];
  nav: AppTranslation['nav'];
  onOpenMessages: () => void;
  onNext?: () => void;
}

export const Step1HomeView: React.FC<Step1HomeViewProps> = ({
  content,
  nav,
  onOpenMessages,
  onNext,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title & Subtitle */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-lg mb-2">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Step 1: Smartphone Home Screen</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          {content.title}
        </h2>
        <p className="text-base text-slate-600 leading-relaxed">
          {content.subtitle}
        </p>
      </div>

      {/* Simulated Notification Callout Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase pb-2 border-b border-slate-100">
          <BellRing className="w-4 h-4 text-amber-500 animate-bounce" />
          <span>New Notification Arrived on Phone</span>
        </div>

        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
          <div className="text-xs font-bold text-amber-950 flex items-center justify-between">
            <span>{content.notificationTitle}</span>
            <span className="text-[10px] text-amber-800 font-semibold">Normal SMS</span>
          </div>
          <p className="text-sm font-semibold text-slate-900">
            {content.notificationBody}
          </p>
        </div>

        <div className="flex items-start gap-3 bg-teal-50/80 p-3.5 rounded-xl border border-teal-200 text-xs sm:text-sm text-teal-950">
          <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Instructions:</span>
            <span>{content.phoneInstruction}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex flex-wrap items-center gap-3">
        <button
          onClick={onOpenMessages}
          className="w-full sm:w-auto px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-base rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer"
        >
          <span>{nav.openMessages}</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {onNext && (
          <button
            onClick={onNext}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{nav.next}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
