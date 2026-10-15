import { PrimaryCategory, WhatsAppSegmentId } from '@/types';

export const WHATSAPP_ALL_SEGMENT_IDS: WhatsAppSegmentId[] = [
  'W0',
  'W1',
  'W2',
  'W3',
  'W4',
  'W5',
  'W6',
  'W7',
];

/**
 * 3 Personalized Lesson Sequences per user category:
 * A. Digital Beginner: W0 → W1 → W2 → W3 → W4 → W6 → W5 → W7
 * B. Digital Payment Learner: W0 → W2 → W7 → W1 → W3 → W4 → W6 → W5
 * C. MSME Business Learner: W0 → W1 → W2 → W3 → W4 → W6 → W7 → W5
 */
export const CATEGORY_WHATSAPP_SEQUENCES: Record<PrimaryCategory, WhatsAppSegmentId[]> = {
  DIGITAL_BEGINNER: ['W0', 'W1', 'W2', 'W3', 'W4', 'W6', 'W5', 'W7'],
  EVERYDAY_DIGITAL_LEARNER: ['W0', 'W1', 'W2', 'W3', 'W4', 'W6', 'W5', 'W7'],
  DIGITAL_PAYMENT_LEARNER: ['W0', 'W2', 'W7', 'W1', 'W3', 'W4', 'W6', 'W5'],
  MSME_LEARNER: ['W0', 'W1', 'W2', 'W3', 'W4', 'W6', 'W7', 'W5'],
};

export const SEQUENCE_RATIONALE: Record<
  PrimaryCategory,
  { en: string; ta: string; hi: string }
> = {
  DIGITAL_BEGINNER: {
    en: 'Foundational step-by-step track from basics to voice, photos, and safety.',
    ta: 'அடிப்படைகள், குரல் குறிப்புகள் மற்றும் புகைப்படங்கள் வழியே படிப்படியாக கற்றல்.',
    hi: 'मूल बातों से लेकर वॉयस नोट्स और फोटो शेयरिंग तक चरणबद्ध क्रम।',
  },
  EVERYDAY_DIGITAL_LEARNER: {
    en: 'Foundational everyday communication track for family, friends, and calls.',
    ta: 'குடும்பத்தினர் மற்றும் நண்பர்களுடன் எளிதாக பேச உதவும் அன்றாடப் பயிற்சி.',
    hi: 'परिवार और दोस्तों से बातचीत के लिए दैनिक संचार क्रम।',
  },
  DIGITAL_PAYMENT_LEARNER: {
    en: 'Early scam detection (W7) prioritized after messaging (W2) for safety.',
    ta: 'செய்தி அனுப்பிய பின் உடனே போலி மோசடி அழைப்புகளை (W7) தவிர்க்கும் பாதுகாப்பு பயிற்சி.',
    hi: 'संदेश भेजने के तुरंत बाद फर्जी कॉल और स्कैम से बचाव (W7) पर जोर।',
  },
  MSME_LEARNER: {
    en: 'Product sharing, customer messaging, calling, and business scam awareness.',
    ta: 'வாடிக்கையாளர் தொடர்பு, பொருள் புகைப்படங்கள் மற்றும் வணிக மோசடி விழிப்புணர்வு.',
    hi: 'ग्राहकों से बातचीत, सामान की तस्वीरें, कॉल्स और व्यापार सुरक्षा।',
  },
};

export type BeginnerTrailSegmentId = 'phone_basics' | WhatsAppSegmentId;

/**
 * Returns the recommended sequence for a given category.
 * Defaults to Digital Beginner sequence if category is undefined.
 */
export function getWhatsAppSequenceForCategory(
  category?: PrimaryCategory | null
): WhatsAppSegmentId[] {
  if (!category || !CATEGORY_WHATSAPP_SEQUENCES[category]) {
    return CATEGORY_WHATSAPP_SEQUENCES.DIGITAL_BEGINNER;
  }
  return [...CATEGORY_WHATSAPP_SEQUENCES[category]];
}

/**
 * Returns the full learning trail sequence for the category.
 * For DIGITAL_BEGINNER, prepends 'phone_basics' as Module 1, giving 9 total modules.
 */
export function getTrailSequenceForCategory(
  category?: PrimaryCategory | null
): BeginnerTrailSegmentId[] {
  const waSeq = getWhatsAppSequenceForCategory(category);
  if (!category || category === 'DIGITAL_BEGINNER') {
    return ['phone_basics', ...waSeq];
  }
  return waSeq;
}

/**
 * Finds the next uncompleted lesson in the sequence.
 */
export function getNextRecommendedLesson(
  currentId: WhatsAppSegmentId,
  category?: PrimaryCategory | null,
  _completedIds: WhatsAppSegmentId[] = [],
  _skippedIds: WhatsAppSegmentId[] = []
): { nextId: WhatsAppSegmentId | null; isLastInSequence: boolean } {
  const sequence = getWhatsAppSequenceForCategory(category);
  const currentIndex = sequence.indexOf(currentId);

  if (currentIndex === -1 || currentIndex === sequence.length - 1) {
    return { nextId: null, isLastInSequence: true };
  }

  const nextId = sequence[currentIndex + 1];
  return { nextId, isLastInSequence: currentIndex + 1 === sequence.length - 1 };
}

/**
 * Finds the previous lesson in the sequence.
 */
export function getPreviousRecommendedLesson(
  currentId: WhatsAppSegmentId,
  category?: PrimaryCategory | null
): { prevId: WhatsAppSegmentId | null; isFirstInSequence: boolean } {
  const sequence = getWhatsAppSequenceForCategory(category);
  const currentIndex = sequence.indexOf(currentId);

  if (currentIndex <= 0) {
    return { prevId: null, isFirstInSequence: true };
  }

  const prevId = sequence[currentIndex - 1];
  return { prevId, isFirstInSequence: false };
}

/**
 * Gets sequence index (1-based, e.g. 1 to 8) for a lesson given a learner category.
 */
export function getSequenceIndexForLesson(
  lessonId: WhatsAppSegmentId,
  category?: PrimaryCategory | null
): number {
  const sequence = getWhatsAppSequenceForCategory(category);
  const idx = sequence.indexOf(lessonId);
  return idx >= 0 ? idx + 1 : 1;
}

