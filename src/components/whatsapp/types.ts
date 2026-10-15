export type LanguageCode = 'ta' | 'hi' | 'en';

export interface StepAttempt {
  step_id: string;
  module_id: 'message' | 'pay' | 'creyo';
  correct: boolean;
  hesitation_ms: number;
  attempt_number: number;
  timestamp: number;
}

export interface Step {
  id: string;
  say: {
    en: string;
    ta: string; // REVIEW by native speaker
    hi: string; // REVIEW by native speaker
  };
  do: 'point' | 'tap' | 'type' | 'hold';
  target?: string;
  text?: string;
  practiceText?: string;
  duration?: number;
}

export interface Lesson {
  id: string;
  title: {
    en: string;
    ta: string; // REVIEW by native speaker
    hi: string; // REVIEW by native speaker
  };
  steps: Step[];
}
