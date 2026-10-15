export type LanguageCode = 'ta' | 'hi' | 'en';

export type LessonId = 1 | 2 | 3 | 4 | 5 | 'quiz';

export type SoundMode = 'sound' | 'vibrate' | 'silent';

export interface PhoneSettingsState {
  mobileDataEnabled: boolean;
  torchEnabled: boolean;
  wifiEnabled: boolean;
  connectedWifi: string | null;
  hotspotEnabled: boolean;
  connectedDevices: string[];
  soundMode: SoundMode;
  isQuickSettingsOpen: boolean;
  quickSettingsExpanded: boolean;
  brightness: number;
}

export interface StepContent {
  id: string;
  title: Record<LanguageCode, string>;
  voicePrompt: Record<LanguageCode, string>;
  subtitles: Record<LanguageCode, string>;
  actionBadge: Record<LanguageCode, string>;
  tip: Record<LanguageCode, string>;
  targetElement?: string;
  expectedAction:
    | 'SWIPE_DOWN'
    | 'TOGGLE_DATA'
    | 'TOGGLE_TORCH'
    | 'TOGGLE_WIFI'
    | 'CONNECT_WIFI'
    | 'TOGGLE_HOTSPOT'
    | 'CYCLE_SOUND'
    | 'CLOSE_SETTINGS'
    | 'NEXT';
}

export interface LessonDefinition {
  id: LessonId;
  number: number;
  icon: string;
  title: Record<LanguageCode, string>;
  shortDescription: Record<LanguageCode, string>;
  learnSteps: StepContent[];
  practiceTask: {
    prompt: Record<LanguageCode, string>;
    successMessage: Record<LanguageCode, string>;
    targetSetting: 'data' | 'torch' | 'wifi' | 'hotspot' | 'sound';
    desiredValue: any;
  };
}

export interface QuizQuestion {
  id: number;
  question: Record<LanguageCode, string>;
  options: Record<LanguageCode, string[]>;
  correctIndex: number;
  explanation: Record<LanguageCode, string>;
}
