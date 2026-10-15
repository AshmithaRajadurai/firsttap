export type SpamLanguageCode = 'en' | 'ta' | 'hi';

export type SpamStepId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type InstructorPose =
  | 'welcome'
  | 'pointing'
  | 'warning'
  | 'explaining'
  | 'celebrating'
  | 'inspecting';

export type LessonType = 'CALL' | 'MESSAGE' | 'UPI' | 'CHALLENGE';

export interface SpamLessonStep {
  id: string;
  caption: Record<SpamLanguageCode, string>;
  targetId: string;
  action: 'wait' | 'tap' | 'type' | 'point';
  textToType?: string;
  guideText: Record<SpamLanguageCode, string>;
  screen: string;
  waitMs?: number;
}

export interface SpamCallLesson {
  id: number;
  code: string;
  type: LessonType;
  title: Record<SpamLanguageCode, string>;
  shortTitle: Record<SpamLanguageCode, string>;
  description: Record<SpamLanguageCode, string>;
  callerName: string;
  callerNumber: string;
  callerOrg: Record<SpamLanguageCode, string>;
  fraudType: 'ATM_PIN' | 'OTP' | 'LOTTERY' | 'SCREEN_SHARE' | 'CUSTOMER_CARE' | 'SMS_LINK' | 'UPI_QR' | 'CHALLENGE';
  scammerSpeech: Record<SpamLanguageCode, string>;
  redFlagNote: Record<SpamLanguageCode, string>;
  goldenRule: Record<SpamLanguageCode, string>;
  successMessage: Record<SpamLanguageCode, string>;
  steps: SpamLessonStep[];
}

export interface PracticeStep {
  id: string;
  targetId: string;
  instruction: Record<SpamLanguageCode, string>;
  guideText: Record<SpamLanguageCode, string>;
  actionType: 'tap' | 'type';
  expectedScreen: string;
}

export interface PracticeTask {
  lessonId: number;
  title: Record<SpamLanguageCode, string>;
  description: Record<SpamLanguageCode, string>;
}

export interface ChallengeScenario {
  id: number;
  type: 'CALL' | 'SMS' | 'UPI' | 'REMOTE';
  title: Record<SpamLanguageCode, string>;
  scenarioPrompt: Record<SpamLanguageCode, string>;
  senderOrCaller: string;
  badge: Record<SpamLanguageCode, string>;
  contentPreview: Record<SpamLanguageCode, string>;
  options: {
    id: 'A' | 'B';
    text: Record<SpamLanguageCode, string>;
    isSafe: boolean;
    explanation: Record<SpamLanguageCode, string>;
  }[];
}

export interface SpamLessonMeta {
  id: SpamStepId;
  code: string;
  type: LessonType;
  title: Record<SpamLanguageCode, string>;
  shortTitle: Record<SpamLanguageCode, string>;
  description: Record<SpamLanguageCode, string>;
  badge: Record<SpamLanguageCode, string>;
  estimatedMinutes: number;
  iconName: string;
  goldenRule: Record<SpamLanguageCode, string>;
}

export type AppTranslation = any;
export type QuizQuestion = any;
