import React, { useEffect, useState, useRef, useCallback } from 'react';
import { MousePointerClick, Volume2, RotateCcw } from 'lucide-react';
import { LanguageCode } from './types';
import { voiceManager } from './voice';

interface PracticeSpotlightOverlayProps {
  language: LanguageCode;
  targetId: string;
  instructionText: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  failedAttempts: number;
  onCorrectTap: () => void;
  onWrongTap: () => void;
  onReplayDemo: () => void;
}

export const PracticeSpotlightOverlay: React.FC<PracticeSpotlightOverlayProps> = ({
  language,
  targetId,
  instructionText,
  containerRef,
  failedAttempts,
  onCorrectTap,
  onWrongTap,
  onReplayDemo,
}) => {
  const [targetRect, setTargetRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  // Measure target element position relative to container
  const updateRect = useCallback(() => {
    if (!containerRef.current) return;
    const targetEl = containerRef.current.querySelector(
      `[data-demo-id="${targetId}"]`
    ) as HTMLElement;

    if (!targetEl) {
      setTargetRect(null);
      return;
    }

    const containerR = containerRef.current.getBoundingClientRect();
    const elR = targetEl.getBoundingClientRect();

    if (elR.width === 0 || elR.height === 0) {
      setTargetRect(null);
      return;
    }

    setTargetRect({
      top: elR.top - containerR.top,
      left: elR.left - containerR.left,
      width: elR.width,
      height: elR.height,
    });
  }, [containerRef, targetId]);

  useEffect(() => {
    updateRect();
    const interval = setInterval(updateRect, 100);
    window.addEventListener('resize', updateRect);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateRect);
    };
  }, [updateRect]);

  // Capture-phase click listener on phone root:
  // If tap is NOT inside the current target, preventDefault and stopPropagation!
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleCaptureClick = (e: MouseEvent) => {
      const targetEl = container.querySelector(`[data-demo-id="${targetId}"]`);
      if (!targetEl) return;

      const clickTarget = e.target as Node;
      const isInside = targetEl.contains(clickTarget);

      if (!isInside) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        // Shake target
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);

        voiceManager.speak(
          language === 'ta'
            ? 'ஒளிரும் பொத்தானைத் தொடவும்.' // REVIEW by native speaker
            : language === 'hi'
            ? 'चमकते हुए बटन पर टैप करें।' // REVIEW by native speaker
            : 'Tap the glowing button.',
          language
        );

        onWrongTap();
      } else {
        onCorrectTap();
      }
    };

    container.addEventListener('click', handleCaptureClick, true);
    return () => {
      container.removeEventListener('click', handleCaptureClick, true);
    };
  }, [containerRef, targetId, language, onCorrectTap, onWrongTap]);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 select-none overflow-hidden">
      {/* Top Banner indicating PRACTICE Phase */}
      <div className="absolute top-2 left-2 right-2 pointer-events-auto z-40 animate-in slide-in-from-top-2 duration-200">
        <div className="bg-emerald-900/95 text-white p-2.5 rounded-2xl shadow-xl border border-emerald-400/50 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                {language === 'ta'
                  ? 'பயிற்சி (PRACTICE) – உங்கள் முறை'
                  : language === 'hi'
                  ? 'अभ्यास (PRACTICE) – आपकी बारी'
                  : 'PRACTICE – YOUR TURN'}
              </span>
              <p className="text-xs font-semibold text-white line-clamp-1">
                {instructionText}
              </p>
            </div>
          </div>

          <button
            onClick={onReplayDemo}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-teal-800 text-teal-100 hover:bg-teal-700 text-[11px] font-bold transition cursor-pointer border border-teal-600/40 shrink-0"
          >
            <RotateCcw className="w-3 h-3 text-amber-300" />
            <span>{language === 'ta' ? 'செய்து காட்டு' : 'Watch Again'}</span>
          </button>
        </div>
      </div>

      {/* Dimmed backdrop with spotlight cutout if targetRect is available */}
      {targetRect && (
        <>
          {/* Spotlight Pulsing Ring and Pointer on target */}
          <div
            style={{
              position: 'absolute',
              top: `${targetRect.top - 4}px`,
              left: `${targetRect.left - 4}px`,
              width: `${targetRect.width + 8}px`,
              height: `${targetRect.height + 8}px`,
            }}
            className={`rounded-2xl pointer-events-none ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-900 shadow-2xl transition-all duration-200 ${
              isShaking ? 'animate-bounce ring-red-500' : 'animate-pulse'
            }`}
          >
            {/* Animated pointing finger icon */}
            <div className="absolute -top-11 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
              <div className="w-9 h-9 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-xl border-2 border-white">
                <MousePointerClick className="w-5 h-5 fill-slate-950" />
              </div>
              <span className="text-[9px] font-bold bg-slate-950 text-amber-300 px-2 py-0.5 rounded-full shadow-md mt-0.5">
                இங்கே தொடவும்
              </span>
            </div>
          </div>
        </>
      )}

      {/* Bottom prompt caption */}
      <div className="absolute bottom-3 left-3 right-3 pointer-events-auto z-40">
        <div className="bg-slate-950/95 text-white p-3 rounded-2xl shadow-xl border border-teal-500/40 flex items-center gap-2.5">
          <Volume2 className="w-4 h-4 text-amber-300 shrink-0" />
          <p className="text-xs font-semibold leading-relaxed">
            {instructionText}
          </p>
        </div>
      </div>
    </div>
  );
};
