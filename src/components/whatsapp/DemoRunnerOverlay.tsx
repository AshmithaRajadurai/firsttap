import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Volume2,
  X,
  CheckCircle2,
  MousePointerClick,
  Sparkles,
} from 'lucide-react';
import { LanguageCode, Step, Lesson } from './types';
import { voiceManager } from './voice';

interface DemoRunnerOverlayProps {
  language: LanguageCode;
  lesson: Lesson;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isActive: boolean;
  onDemoComplete: () => void;
  onStopLetMeTry: () => void;
  onSkip?: () => void;
  isExternalPaused?: boolean;
  onStepProgress?: (stepIndex: number, step: Step, caption: string) => void;
}

export const DemoRunnerOverlay: React.FC<DemoRunnerOverlayProps> = ({
  language,
  lesson,
  containerRef,
  isActive,
  onDemoComplete,
  onStopLetMeTry,
  onSkip,
  isExternalPaused = false,
  onStepProgress,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speedMode, setSpeedMode] = useState<'slow' | 'normal'>('slow');
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isRippling, setIsRippling] = useState<boolean>(false);
  const [ripplePos, setRipplePos] = useState<{ x: number; y: number } | null>(null);
  const [currentCaption, setCurrentCaption] = useState<string>('');

  const abortControllerRef = useRef<boolean>(false);
  const isPausedRef = useRef<boolean>(false);
  const isExternalPausedRef = useRef<boolean>(false);
  const speedRef = useRef<'slow' | 'normal'>('slow');
  const lessonRef = useRef(lesson);
  lessonRef.current = lesson;
  const onDemoCompleteRef = useRef(onDemoComplete);
  onDemoCompleteRef.current = onDemoComplete;
  const languageRef = useRef(language);
  languageRef.current = language;
  const lastSpokenKeyRef = useRef<string>('');

  isPausedRef.current = isPaused;
  isExternalPausedRef.current = isExternalPaused;
  speedRef.current = speedMode;

  // Sleep utility with cancellation and pause handling
  const sleep = useCallback(async (ms: number): Promise<void> => {
    const adjustedMs = speedRef.current === 'normal' ? ms * 0.65 : ms;
    const interval = 50;
    let elapsed = 0;

    while (elapsed < adjustedMs) {
      if (abortControllerRef.current) return;
      if (!isPausedRef.current && !isExternalPausedRef.current) {
        elapsed += interval;
      }
      await new Promise((r) => setTimeout(r, interval));
    }
  }, []);

  // Poll every 50 ms for document.querySelector([data-demo-id="${id}"]) with width > 0
  const waitFor = useCallback(
    async (id: string, timeout = 3500): Promise<HTMLElement | null> => {
      const startTime = Date.now();
      while (Date.now() - startTime < timeout) {
        if (abortControllerRef.current) return null;
        if (!isPausedRef.current && !isExternalPausedRef.current) {
          const el = document.querySelector(`[data-demo-id="${id}"]`) as HTMLElement;
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              return el;
            }
          }
        }
        await new Promise((r) => setTimeout(r, 50));
      }
      return null;
    },
    []
  );

  // Smoothly move the pointer to element coordinates inside phone container
  const movePointerTo = useCallback(
    async (el: HTMLElement): Promise<void> => {
      if (!containerRef.current || abortControllerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();

      const x = ((elRect.left + elRect.width / 2 - containerRect.left) / containerRect.width) * 100;
      const y = ((elRect.top + elRect.height / 2 - containerRect.top) / containerRect.height) * 100;

      const clampedX = Math.min(95, Math.max(5, x));
      const clampedY = Math.min(95, Math.max(5, y));

      setPointerPos({ x: clampedX, y: clampedY });
      await sleep(speedRef.current === 'normal' ? 350 : 500);
    },
    [containerRef, sleep]
  );

  // Trigger ripple animation on target
  const triggerRipple = useCallback(
    async (): Promise<void> => {
      if (abortControllerRef.current) return;
      setIsRippling(true);
      await sleep(150);
      setIsRippling(false);
    },
    [sleep]
  );

  // Demo tap on element with stable data-demo-id
  const demoTap = useCallback(
    async (id: string): Promise<void> => {
      if (abortControllerRef.current) return;
      const el = await waitFor(id);
      if (!el) {
        console.warn(`[demo] missing target: ${id}`);
        return;
      }

      console.log(`[demo] tap ${id}`);
      await movePointerTo(el);
      await triggerRipple();

      // Action boundary before click
      while ((isPausedRef.current || isExternalPausedRef.current) && !abortControllerRef.current) {
        await new Promise((r) => setTimeout(r, 100));
      }

      if (abortControllerRef.current) return;
      // Programmatic click triggers exact same event handler as real user
      el.click();
      await sleep(450);
    },
    [waitFor, movePointerTo, triggerRipple, sleep]
  );

  // Demo type: for each char, demoTap('key-' + char)
  const demoType = useCallback(
    async (text: string): Promise<void> => {
      console.log(`[demo] type ${text}`);
      for (const char of text.split('')) {
        if (abortControllerRef.current) return;
        await demoTap(`key-${char}`);
        // Action boundary after each typed character
        while ((isPausedRef.current || isExternalPausedRef.current) && !abortControllerRef.current) {
          await new Promise((r) => setTimeout(r, 100));
        }
        await sleep(350);
      }
    },
    [demoTap, sleep]
  );

  // Speak with speech completion wait and once-per-step guard
  const speakStep = useCallback(
    async (step: Step, stepIndex: number, currentLessonId: string): Promise<void> => {
      const currentLang = languageRef.current;
      const line = step.say[currentLang] || step.say.en;
      setCurrentCaption(line);

      const stepKey = `${currentLessonId}_${stepIndex}`;
      if (lastSpokenKeyRef.current !== stepKey) {
        lastSpokenKeyRef.current = stepKey;
        // Wait for speech utterance onend with 6s timeout on last step so it never hangs
        const isLastStep = stepIndex === lessonRef.current.steps.length - 1;
        await voiceManager.speakAsync(line, currentLang, { fallbackTimeoutMs: isLastStep ? 6000 : 15000 });
      }

      // Natural pause of about 1 second after voice finishes before action
      await sleep(1000);
    },
    [sleep]
  );

  // Main Demo Runner loop: only runs when isActive or lesson.id changes!
  useEffect(() => {
    if (!isActive) return;

    abortControllerRef.current = false;
    lastSpokenKeyRef.current = '';
    let isSubscribed = true;

    const runDemo = async () => {
      const activeLesson = lessonRef.current;
      console.log(`[demo] Starting ${activeLesson.id}`);
      await sleep(400);

      for (let i = 0; i < activeLesson.steps.length; i++) {
        if (abortControllerRef.current || !isSubscribed) return;

        const step = activeLesson.steps[i];
        setCurrentStepIndex(i);
        const line = step.say[languageRef.current] || step.say.en;
        onStepProgress?.(i, step, line);

        // Pause boundary: wait before speaking if paused
        while ((isPausedRef.current || isExternalPausedRef.current) && !abortControllerRef.current) {
          await new Promise((r) => setTimeout(r, 100));
        }

        // Speak step instruction line only once for this step
        await speakStep(step, i, activeLesson.id);
        if (abortControllerRef.current || !isSubscribed) return;

        // Pause boundary: wait after speaking before executing action
        while ((isPausedRef.current || isExternalPausedRef.current) && !abortControllerRef.current) {
          await new Promise((r) => setTimeout(r, 100));
        }

        if (step.do === 'point') {
          if (step.target) {
            console.log(`[demo] point ${step.target}`);
            const el = await waitFor(step.target);
            if (el) {
              await movePointerTo(el);
            }
          }
          await sleep(step.duration ? step.duration * 0.7 : 1800);
        } else if (step.do === 'tap') {
          if (step.target) {
            await demoTap(step.target);
          }
        } else if (step.do === 'type') {
          if (step.text) {
            await demoType(step.text);
          }
        } else if (step.do === 'hold') {
          if (step.target) {
            console.log(`[demo] hold ${step.target}`);
            const el = await waitFor(step.target);
            if (el) {
              await movePointerTo(el);
              setIsRippling(true);
              el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
              const holdTime = step.duration || 3000;
              await sleep(holdTime);
              el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
              setIsRippling(false);
            }
          }
        }

        if (abortControllerRef.current || !isSubscribed) return;

        // Pause boundary: wait between steps if paused
        while ((isPausedRef.current || isExternalPausedRef.current) && !abortControllerRef.current) {
          await new Promise((r) => setTimeout(r, 100));
        }

        await sleep(600);
      }

      if (isSubscribed && !abortControllerRef.current) {
        console.log(`[demo] Completed ${activeLesson.id}`);
        // Pause 2 seconds on the success screen before finishing
        await sleep(2000);
        onDemoCompleteRef.current();
      }
    };

    runDemo();

    return () => {
      isSubscribed = false;
      abortControllerRef.current = true;
      voiceManager.stop();
    };
  }, [isActive, lesson.id, speakStep, demoTap, demoType, movePointerTo, waitFor, sleep]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden select-none">
      {/* 
        Transparent overlay covering the phone screen BELOW the top control bar.
        pointer-events-auto ensures touching the simulator screen during DEMO does nothing!
        Top control bar sits above top-[82px] so Back/Exit and Menu are ALWAYS clickable!
      */}
      <div className="absolute top-[82px] inset-x-0 bottom-0 bg-slate-900/20 backdrop-blur-[0.5px] pointer-events-auto" />

      {/* Top Demo Bar with interactive controls - positioned below Top Control Bar so Back/Exit is never occluded */}
      <div className="absolute top-[88px] left-2 right-2 pointer-events-auto z-40 animate-in slide-in-from-top-2 duration-300">
        <div className="bg-[#0D5C63] text-white p-2.5 rounded-2xl shadow-2xl border border-teal-400/40 flex items-center justify-between gap-2">
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                {language === 'ta'
                  ? 'மாதிரி செயல்முறை (DEMO)'
                  : language === 'hi'
                  ? 'डेमो देखें (DEMO)'
                  : 'DEMO MODE'}
              </span>
              <span className="text-xs font-semibold text-white line-clamp-1">
                {currentStepIndex + 1}/{lesson.steps.length}: {lesson.title[language] || lesson.title.en}
              </span>
            </div>
          </div>

          {/* Clickable Controls: Pause/Resume, Speed (Slow/Normal), Skip, Stop */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Speed Toggle: Slow (default) vs Normal */}
            <button
              onClick={() => {
                const next = speedMode === 'slow' ? 'normal' : 'slow';
                setSpeedMode(next);
                console.log(`[demo] Speed set to ${next}`);
              }}
              className="px-2 py-1 rounded-lg bg-teal-800/90 hover:bg-teal-700 text-[11px] font-bold text-amber-200 transition cursor-pointer border border-teal-600/40"
              title="Toggle Speed"
            >
              {speedMode === 'slow'
                ? language === 'ta'
                  ? 'மெதுவாக (Slow)'
                  : language === 'hi'
                  ? 'धीमी गति (Slow)'
                  : 'Slow Speed'
                : language === 'ta'
                ? 'சாதாரணம் (Normal)'
                : language === 'hi'
                ? 'सामान्य गति (Normal)'
                : 'Normal Speed'}
            </button>

            {/* Pause / Resume */}
            <button
              onClick={() => {
                const next = !isPaused;
                setIsPaused(next);
                if (next) voiceManager.stop();
                console.log(`[demo] ${next ? 'Paused' : 'Resumed'}`);
              }}
              className="p-1.5 rounded-lg bg-teal-800/90 hover:bg-teal-700 text-white transition cursor-pointer border border-teal-600/40"
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 fill-white" /> : <Pause className="w-3.5 h-3.5" />}
            </button>

            {/* Stop - Let me try button */}
            <button
              onClick={() => {
                console.log('[demo] User pressed Stop - let me try');
                abortControllerRef.current = true;
                voiceManager.stop();
                onStopLetMeTry();
              }}
              className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-md cursor-pointer transition active:scale-95 ml-1 border border-amber-300"
            >
              {language === 'ta' ? 'நானே செய்கிறேன்' : language === 'hi' ? 'खुद करें' : 'Stop - let me try'}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Animated Gliding Finger Pointer */}
      <div
        className="absolute transition-all duration-500 ease-out z-70 pointer-events-none"
        style={{
          left: `${pointerPos.x}%`,
          top: `${pointerPos.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Pulsing Tap Ripple */}
        {isRippling && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="w-16 h-16 rounded-full bg-amber-400/60 animate-ping" />
            <span className="w-8 h-8 rounded-full bg-teal-400/80 animate-pulse" />
          </div>
        )}

        {/* Hand Pointer Icon */}
        <div className={`flex flex-col items-center transition-transform duration-150 ${isRippling ? 'scale-90 translate-y-1' : 'scale-100'}`}>
          <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl border-2 border-white ring-4 ring-teal-500/40">
            <MousePointerClick className="w-6 h-6 fill-slate-950 text-white" />
          </div>

          <div className="mt-1 px-2.5 py-0.5 rounded-full bg-slate-950/90 text-amber-300 text-[10px] font-bold shadow-lg border border-amber-400/40 whitespace-nowrap">
            {isRippling
              ? language === 'ta'
                ? 'தட்டவும்!'
                : language === 'hi'
                ? 'टैप करें!'
                : 'Tap here!'
              : language === 'ta'
              ? 'செல்வி'
              : language === 'hi'
              ? 'सेल्वी'
              : 'Selvi'}
          </div>
        </div>
      </div>

      {/* Large Visible Caption Box at Bottom (Always shown even if speech is muted/absent) */}
      <div className="absolute bottom-4 left-3 right-3 pointer-events-auto z-60 animate-in slide-in-from-bottom-2 duration-300">
        <div className="bg-slate-950/95 text-white p-3.5 rounded-2xl shadow-2xl border-2 border-amber-400/70 flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-teal-500/30 text-amber-300 flex items-center justify-center shrink-0 border border-teal-400/40">
            <Volume2 className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
              {language === 'ta'
                ? 'செல்வி வழிகாட்டல் (Selvi):'
                : language === 'hi'
                ? 'सेल्वी का मार्गदर्शन (Selvi):'
                : "Selvi's Guidance:"}
            </span>
            <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed mt-0.5">
              {currentCaption}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
