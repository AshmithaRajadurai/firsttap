// ========================================================
// Standalone WhatsApp & FirstTap Message Learning Module
// ========================================================

// 1. Primary Component: FirstTap Message (W0 to W7)
export { FirstTapWhatsApp, FirstTapMessage } from './FirstTapWhatsApp';
export type { FirstTapWhatsAppProps } from './FirstTapWhatsApp';

// 2. Duolingo-style WhatsApp Learning Path Screen
export { WhatsAppPathScreen } from './WhatsAppPathScreen';
export { WHATSAPP_LESSONS_CATALOG } from './lessonCatalog';
export type { WhatsAppLessonMeta } from './lessonCatalog';

// 3. Interactive Overlays & Tools
export { DemoRunnerOverlay } from './DemoRunnerOverlay';
export { PracticeSpotlightOverlay } from './PracticeSpotlightOverlay';
export { SegmentDoneCard } from './SegmentDoneCard';
export { SimulatedKeyboard } from './SimulatedKeyboard';
export { AskSelviModal } from './AskSelviModal';
export { LessonMenuModal } from './LessonMenuModal';
export { ModuleCompletionModal } from './ModuleCompletionModal';
export {
  getWhatsAppSequenceForCategory,
  getNextRecommendedLesson,
  getPreviousRecommendedLesson,
  getSequenceIndexForLesson,
  CATEGORY_WHATSAPP_SEQUENCES,
  SEQUENCE_RATIONALE,
} from './personalizedSequences';

// 3. Lesson Curriculum Tracks (W0 to W7)
export { CHAT_SEGMENTS } from './chatLessonTracks';
export type { ChatSegment, ChatSegmentStep } from './chatLessonTracks';

// 4. Secondary Tutorial Screen (Standalone 5-Lesson Engine)
export { WhatsAppTutorialScreen } from './WhatsAppTutorialScreen';
export type { WhatsAppTutorialScreenProps } from './WhatsAppTutorialScreen';
export { WHATSAPP_LESSONS } from './whatsappLessons';
export type { WhatsAppLesson, LessonStep } from './whatsappLessons';

// 5. Speech / Voice Synthesis Engine (Web Speech API)
export { voiceManager } from './voice';

// 6. Types
export type { LanguageCode, StepAttempt, Step, Lesson } from './types';

// Default export
import { FirstTapWhatsApp } from './FirstTapWhatsApp';
export default FirstTapWhatsApp;
