import React from 'react';
import { X, CheckCircle2, Play, SkipForward, Sparkles, BookOpen, ChevronRight } from 'lucide-react';
import { LanguageCode } from './types';
import { PrimaryCategory, WhatsAppSegmentId } from '@/types';
import { CHAT_SEGMENTS } from './chatLessonTracks';
import {
  getWhatsAppSequenceForCategory,
  SEQUENCE_RATIONALE,
} from './personalizedSequences';

interface LessonMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  category?: PrimaryCategory | null;
  currentSegmentId: WhatsAppSegmentId;
  completedSegments: WhatsAppSegmentId[];
  skippedSegments: WhatsAppSegmentId[];
  onSelectLesson: (id: WhatsAppSegmentId) => void;
}

export const LessonMenuModal: React.FC<LessonMenuModalProps> = ({
  isOpen,
  onClose,
  language,
  category,
  currentSegmentId,
  completedSegments,
  skippedSegments,
  onSelectLesson,
}) => {
  if (!isOpen) return null;

  const sequence = getWhatsAppSequenceForCategory(category);
  const rationale = category && SEQUENCE_RATIONALE[category]
    ? SEQUENCE_RATIONALE[category][language]
    : SEQUENCE_RATIONALE.DIGITAL_BEGINNER[language];

  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full shadow-2xl border-2 border-teal-500/50 flex flex-col max-h-[88vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {language === 'ta'
                  ? 'பாடங்கள் பட்டியல் (8 பாடங்கள்)'
                  : language === 'hi'
                  ? 'पाठ सूची (8 पाठ)'
                  : 'WhatsApp Lessons (8 Tracks)'}
              </h3>
              <p className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
                {completedSegments.length}/8 {language === 'ta' ? 'முடிந்தது' : 'Completed'}
                {skippedSegments.length > 0 && ` • ${skippedSegments.length} ${language === 'ta' ? 'தவிர்க்கப்பட்டது' : 'Skipped'}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Personalized Rationale Note */}
        <div className="bg-teal-50/80 dark:bg-teal-950/40 p-2.5 rounded-2xl border border-teal-200/80 dark:border-teal-800/60 my-2 text-[11px] text-teal-900 dark:text-teal-200 flex items-start gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
          <span>{rationale}</span>
        </div>

        {/* Lesson Items List in Personalized Recommended Order */}
        <div className="flex-1 overflow-y-auto space-y-2 py-1 pr-0.5">
          {sequence.map((segId, orderIndex) => {
            const seg = CHAT_SEGMENTS.find((s) => s.id === segId) || CHAT_SEGMENTS[0];
            const isCompleted = completedSegments.includes(segId);
            const isSkipped = skippedSegments.includes(segId);
            const isCurrent = currentSegmentId === segId;

            return (
              <button
                key={segId}
                onClick={() => {
                  onSelectLesson(segId);
                  onClose();
                }}
                className={`w-full text-left p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-2.5 ${
                  isCurrent
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-500 shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                    : isSkipped
                    ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700'
                    : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-teal-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Status Indicator Icon */}
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isSkipped
                        ? 'bg-slate-400 text-white'
                        : isCurrent
                        ? 'bg-amber-500 text-slate-950 font-black ring-2 ring-amber-300'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isSkipped ? (
                      <SkipForward className="w-3.5 h-3.5" />
                    ) : (
                      <span>{orderIndex + 1}</span>
                    )}
                  </div>

                  {/* Title & Code */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                        {seg.code}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase">
                          {language === 'ta' ? 'தற்போது' : 'Current'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {seg.title[language] || seg.title.en}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {isCompleted ? (
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                      {language === 'ta' ? 'முடிந்தது' : 'Done'}
                    </span>
                  ) : isSkipped ? (
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      {language === 'ta' ? 'தவிர்க்கப்பட்டது' : 'Skipped'}
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-950 dark:bg-slate-800 text-white font-bold text-xs shadow-xs transition cursor-pointer text-center"
          >
            {language === 'ta' ? 'மூடு (Close)' : 'Close Menu'}
          </button>
        </div>
      </div>
    </div>
  );
};
