export type LanguageCode = 'ta' | 'hi' | 'en';

export type SimulatorPart = 'PART1_ACCOUNT' | 'PART2_CATALOGUE' | 'PART3_PRACTICE';

export interface BusinessProfileData {
  shopName: string;
  category: string;
  photoUrl: string;
  description: string;
  address: string;
  phone: string;
  isVerified?: boolean;
}

export interface CatalogueProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  productCode: string;
  imageUrl: string;
  category: string;
  inStock?: boolean;
}

export interface StepInstruction {
  id: string;
  title: Record<LanguageCode, string>;
  voiceText: Record<LanguageCode, string>;
  subtitles: Record<LanguageCode, string>;
  tip: Record<LanguageCode, string>;
  targetElementId?: string;
  actionPrompt: Record<LanguageCode, string>;
}

export interface PracticeEvaluation {
  isComplete: boolean;
  hasErrors: boolean;
  errors: string[];
  feedbackMessage: Record<LanguageCode, string>;
  score: number;
}
