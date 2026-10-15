import { PrimaryCategory } from '@/types';
import { SpamStepId, SpamLanguageCode } from './types';
import { SPAM_PATH_LESSON_METAS } from './fraudCurriculum';

export interface SpamCatalogMeta {
  id: SpamStepId;
  code: string; // 'S1' to 'S8'
  title: Record<SpamLanguageCode, string>;
  subtitle: Record<SpamLanguageCode, string>;
  badge: Record<SpamLanguageCode, string>;
  durationMinutes: number;
}

export const SPAM_LESSONS: Record<SpamStepId, SpamCatalogMeta> = {
  1: {
    id: 1,
    code: 'S1',
    title: SPAM_PATH_LESSON_METAS[1].title,
    subtitle: SPAM_PATH_LESSON_METAS[1].description,
    badge: SPAM_PATH_LESSON_METAS[1].badge,
    durationMinutes: 3,
  },
  2: {
    id: 2,
    code: 'S2',
    title: SPAM_PATH_LESSON_METAS[2].title,
    subtitle: SPAM_PATH_LESSON_METAS[2].description,
    badge: SPAM_PATH_LESSON_METAS[2].badge,
    durationMinutes: 3,
  },
  3: {
    id: 3,
    code: 'S3',
    title: SPAM_PATH_LESSON_METAS[3].title,
    subtitle: SPAM_PATH_LESSON_METAS[3].description,
    badge: SPAM_PATH_LESSON_METAS[3].badge,
    durationMinutes: 3,
  },
  4: {
    id: 4,
    code: 'S4',
    title: SPAM_PATH_LESSON_METAS[4].title,
    subtitle: SPAM_PATH_LESSON_METAS[4].description,
    badge: SPAM_PATH_LESSON_METAS[4].badge,
    durationMinutes: 3,
  },
  5: {
    id: 5,
    code: 'S5',
    title: SPAM_PATH_LESSON_METAS[5].title,
    subtitle: SPAM_PATH_LESSON_METAS[5].description,
    badge: SPAM_PATH_LESSON_METAS[5].badge,
    durationMinutes: 3,
  },
  6: {
    id: 6,
    code: 'S6',
    title: SPAM_PATH_LESSON_METAS[6].title,
    subtitle: SPAM_PATH_LESSON_METAS[6].description,
    badge: SPAM_PATH_LESSON_METAS[6].badge,
    durationMinutes: 3,
  },
  7: {
    id: 7,
    code: 'S7',
    title: SPAM_PATH_LESSON_METAS[7].title,
    subtitle: SPAM_PATH_LESSON_METAS[7].description,
    badge: SPAM_PATH_LESSON_METAS[7].badge,
    durationMinutes: 3,
  },
  8: {
    id: 8,
    code: 'S8',
    title: SPAM_PATH_LESSON_METAS[8].title,
    subtitle: SPAM_PATH_LESSON_METAS[8].description,
    badge: SPAM_PATH_LESSON_METAS[8].badge,
    durationMinutes: 5,
  },
};

export const SPAM_RECOMMENDED_SEQUENCES: Record<PrimaryCategory, SpamStepId[]> = {
  DIGITAL_BEGINNER: [1, 2, 3, 4, 5, 6, 7, 8],
  EVERYDAY_DIGITAL_LEARNER: [1, 2, 5, 3, 4, 6, 7, 8],
  DIGITAL_PAYMENT_LEARNER: [6, 1, 2, 5, 3, 4, 7, 8],
  MSME_LEARNER: [6, 1, 2, 4, 5, 7, 3, 8],
};

export function getRecommendedSpamSequence(category?: PrimaryCategory): SpamStepId[] {
  if (!category || !SPAM_RECOMMENDED_SEQUENCES[category]) {
    return [1, 2, 3, 4, 5, 6, 7, 8];
  }
  return SPAM_RECOMMENDED_SEQUENCES[category];
}

export function getNextSpamStep(
  currentStep: SpamStepId,
  category?: PrimaryCategory
): SpamStepId | null {
  const sequence = getRecommendedSpamSequence(category);
  const currentIndex = sequence.indexOf(currentStep);
  if (currentIndex === -1 || currentIndex === sequence.length - 1) {
    return null;
  }
  return sequence[currentIndex + 1];
}

export function getPreviousSpamStep(
  currentStep: SpamStepId,
  category?: PrimaryCategory
): SpamStepId | null {
  const sequence = getRecommendedSpamSequence(category);
  const currentIndex = sequence.indexOf(currentStep);
  if (currentIndex <= 0) {
    return null;
  }
  return sequence[currentIndex - 1];
}
