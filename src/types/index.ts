export type SupportedLanguage = 'ta-IN' | 'en-IN' | 'hi-IN';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  voiceSample: string;
}

export type MascotMood =
  | 'idle'
  | 'welcome'
  | 'waving'
  | 'speaking'
  | 'listening'
  | 'thinking'
  | 'happy'
  | 'encouraging'
  | 'celebrating'
  | 'concerned'
  | 'retry'
  | 'explaining'
  | 'language_selection'
  | 'waiting';

export type VoiceEngineState =
  | 'IDLE'
  | 'PLAYING_LANGUAGE_OPTIONS'
  | 'WAITING_FOR_AUDIO_TO_FINISH'
  | 'STARTING_MICROPHONE'
  | 'LISTENING'
  | 'STOPPING_RECORDING'
  | 'TRANSCRIBING'
  | 'DETECTING_LANGUAGE'
  | 'LANGUAGE_CONFIRMED'
  | 'SPEAKING'
  | 'UNDERSTANDING'
  | 'RESPONDING'
  | 'RETRY'
  | 'ERROR';

// Module 1 User Classification & Paths
export type PrimaryCategory =
  | 'DIGITAL_BEGINNER'
  | 'EVERYDAY_DIGITAL_LEARNER'
  | 'DIGITAL_PAYMENT_LEARNER'
  | 'MSME_LEARNER';

export type LearningGoal =
  | 'EVERYDAY_DIGITAL_SKILLS'
  | 'DIGITAL_PAYMENTS'
  | 'MSME_BUSINESS_SKILLS';

export type StartingLearningPath =
  | 'SMARTPHONE_BASICS'
  | 'INTERNET_COMMUNICATION_BASICS'
  | 'EVERYDAY_DIGITAL_SERVICES'
  | 'DIGITAL_PAYMENTS_BASICS'
  | 'PAYMENT_VERIFICATION_AND_SAFETY'
  | 'DIGITAL_BUSINESS_BASICS'
  | 'DIGITAL_BOOKKEEPING_AND_BUSINESS_TOOLS';

export type WhatsAppSegmentId = 'W0' | 'W1' | 'W2' | 'W3' | 'W4' | 'W5' | 'W6' | 'W7';

export interface WhatsAppStepAttempt {
  step_id: string;
  module_id: 'message' | 'pay' | 'creyo' | string;
  correct: boolean;
  hesitation_ms: number;
  attempt_number: number;
  timestamp: number;
}

export interface WhatsAppProgress {
  current_segment_id: WhatsAppSegmentId;
  completed_segments: WhatsAppSegmentId[];
  skipped_segments: WhatsAppSegmentId[];
  attempts: WhatsAppStepAttempt[];
  is_module_completed: boolean;
  last_active_at: string;
}

export type SpamStepId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface SpamProgress {
  current_step_id: SpamStepId;
  completed_steps: SpamStepId[];
  skipped_steps: SpamStepId[];
  quiz_score?: number;
  quiz_total?: number;
  is_module_completed: boolean;
  last_active_at: string;
}

export type BusinessLessonId = 'wa_business' | 'google_maps';

export interface BusinessProgress {
  current_lesson_id?: BusinessLessonId;
  completed_lessons?: BusinessLessonId[];
  skipped_lessons?: BusinessLessonId[];
  current_step_id?: number | string;
  completed_steps?: (number | string)[];
  skipped_steps?: (number | string)[];
  is_module_completed?: boolean;
  last_active_at?: string;
}

export interface PhoneSettingsProgress {
  completed: boolean;
  score?: number;
  completed_lessons?: (number | string)[];
  last_active_at?: string;
}

export interface LearnerProfile {
  name: string;
  preferred_language: SupportedLanguage;
  phone_independent: boolean;
  learning_goal: LearningGoal | null;
  primary_category: PrimaryCategory;
  starting_learning_path: StartingLearningPath;
  assessment_status: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED';
  assessment_completed_at: string;
  completion_reason?: 'FOUNDATION_PATH' | 'BRANCH_ASSESSMENT_COMPLETED';
  whatsapp_progress?: WhatsAppProgress;
  spam_progress?: SpamProgress;
  business_progress?: BusinessProgress;
  phone_settings_progress?: PhoneSettingsProgress;
}

export type FSMState =
  // Module 1 Core States
  | 'GREETING'
  | 'LANGUAGE_OPTIONS'
  | 'WAITING_FOR_LANGUAGE'
  | 'ASKING_NAME'
  | 'WAITING_FOR_NAME'
  | 'CONFIRMING_NAME'
  | 'ASKING_PHONE_INDEPENDENCE'
  | 'WAITING_FOR_PHONE_ANSWER'
  | 'ASKING_LEARNING_GOAL'
  | 'WAITING_FOR_LEARNING_GOAL'
  | 'ASKING_BRANCH_QUESTION'
  | 'WAITING_FOR_BRANCH_ANSWER'
  | 'SAVING_PROFILE'
  | 'ASSESSMENT_COMPLETE'
  | 'PHONE_SETTINGS_MODULE'
  | 'WHATSAPP_PATH'
  | 'WHATSAPP_MODULE'
  | 'SPAM_PATH'
  | 'SPAM_MODULE'
  | 'BUSINESS_PATH'
  | 'BUSINESS_WA_MODULE'
  | 'BUSINESS_MAPS_MODULE'
  | 'ERROR_RECOVERY'
  // Compatibility / Aliases
  | 'APP_START'
  | 'LANGUAGE_SELECT'
  | 'LANGUAGE_CONFIRM'
  | 'ASK_NAME'
  | 'ASK_PHONE_OWNERSHIP'
  | 'PLACEMENT_QUESTIONS'
  | 'PERSONALISE_LEARNING'
  | 'LESSON'
  | 'DOUBT_HANDLING'
  | 'RETRY'
  | 'SESSION_COMPLETE';

export type LiteracyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'SAFETY_READY';

export interface PlacementQuestion {
  id: string;
  prompts: Record<SupportedLanguage, string>;
  concept: string;
}

export interface LessonStep {
  id: string;
  title: Record<SupportedLanguage, string>;
  characterSpeech: Record<SupportedLanguage, string>;
  interactiveType: 'info' | 'tap_target' | 'voice_confirm' | 'otp_challenge';
  instructionText: Record<SupportedLanguage, string>;
  expectedAnswer?: 'yes' | 'no' | 'any';
  safetyTip?: Record<SupportedLanguage, string>;
}

export interface Lesson {
  id: string;
  title: Record<SupportedLanguage, string>;
  description: Record<SupportedLanguage, string>;
  category: 'smartphone_basics' | 'apps' | 'internet' | 'upi_payments' | 'online_safety';
  level: LiteracyLevel;
  steps: LessonStep[];
}

export interface SessionData {
  language: SupportedLanguage;
  userName: string;
  phoneIndependent: boolean | null;
  learningGoal: LearningGoal | null;
  branchAnswer: boolean | null;
  primaryCategory: PrimaryCategory | null;
  startingPath: StartingLearningPath | null;
  learnerProfile: LearnerProfile | null;
  isSavingProfile: boolean;
  profileSaveError: string | null;
  consecutiveRetries: number;
  lastRecognizedText: string;
  lastSpokenText: string;
  captionsEnabled: boolean;
  isApiMode: boolean;
  whatsapp_progress?: WhatsAppProgress;
  spam_progress?: SpamProgress;
  business_progress?: BusinessProgress;
  phone_settings_progress?: PhoneSettingsProgress;
  // Legacy fields preserved for compatibility
  hasPhone?: boolean | null;
  placementCurrentIndex?: number;
  placementAnswers?: Record<string, boolean>;
  assessedLevel?: LiteracyLevel | null;
  currentLessonId?: string;
  currentStepIndex?: number;
  previousStateBeforeDoubt?: FSMState | null;
  doubtContext?: {
    question: string;
    answer: string;
  };
}
