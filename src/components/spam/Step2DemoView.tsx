import React from 'react';
import { AppTranslation } from './types';
import { 
  Trophy, 
  UserX, 
  Link2Off, 
  Clock, 
  ArrowRight, 
  AlertTriangle,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';

interface Step2DemoViewProps {
  content: AppTranslation['step2Demo'];
  nav: AppTranslation['nav'];
  onStartPractice: () => void;
  onPrevious: () => void;
}

export const Step2DemoView: React.FC<Step2DemoViewProps> = ({
  content,
  nav,
  onStartPractice,
  onPrevious,
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'prize':
        return <Trophy className="w-5 h-5 text-amber-600" />;
      case 'sender':
        return <UserX className="w-5 h-5 text-rose-600" />;
      case 'link':
        return <Link2Off className="w-5 h-5 text-purple-600" />;
      case 'urgency':
        return <Clock className="w-5 h-5 text-red-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title & Subtitle */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg mb-2">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          <span>Step 2: Demonstration with Voice Guide</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          {content.title}
        </h2>
        <p className="text-base text-slate-600 leading-relaxed">
          {content.subtitle}
        </p>
      </div>

      {/* Received SMS Breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
            {content.suspiciousBadge}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            From: <strong className="text-slate-700">{content.smsSender}</strong>
          </span>
        </div>

        {/* Message Bubble Preview */}
        <div className="p-4 bg-amber-50/70 border border-amber-300 rounded-xl space-y-2">
          <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
            "{content.smsBody}"
          </p>
          <div className="text-xs font-mono text-blue-600 underline bg-white p-2.5 rounded-lg border border-amber-200 break-all">
            {content.smsLink}
          </div>
        </div>

        {/* 4 Warning Signs Grid */}
        <div className="pt-2">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-3">
            {content.fourSignsTitle}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {content.fourSigns.map((sign: any) => (
              <div
                key={sign.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:border-teal-300 transition-colors flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-white shadow-xs flex items-center justify-center shrink-0 border border-slate-200">
                  {getIcon(sign.id)}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-0.5 leading-tight">
                    {sign.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-snug">
                    {sign.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-2 flex flex-wrap items-center gap-3">
        <button
          onClick={onStartPractice}
          className="px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-base rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-[0.98] cursor-pointer"
        >
          <span>{nav.startPractice}</span>
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
