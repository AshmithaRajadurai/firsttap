export type LanguageCode = 'en' | 'ta' | 'hi';

export type MapMode = 'CHOICE' | 'SHOP' | 'HOME';

export type SimulationScreen =
  | 'PHONE_HOME'
  | 'MAP_MAIN'
  | 'CHOICE_MODAL'
  // Shop Flow
  | 'SHOP_FORM_NAME'
  | 'SHOP_FORM_CATEGORY'
  | 'SHOP_FORM_ADDRESS'
  | 'SHOP_PIN_CONFIRM'
  | 'SHOP_EXTRA_DETAILS'
  | 'SHOP_REVIEW_SUBMIT'
  | 'SHOP_SUCCESS'
  // Home Flow
  | 'HOME_PRIVACY_EXPLANATION'
  | 'HOME_SAVED_MENU'
  | 'HOME_SET_PIN'
  | 'HOME_SUCCESS';

export interface TrilingualText {
  en: string;
  ta: string;
  hi: string;
}

export interface SimulationStepData {
  id: string;
  screen: SimulationScreen;
  mode: MapMode;
  stepNumber: number;
  totalSteps: number;
  title: TrilingualText;
  instruction: TrilingualText;
  voiceScript: TrilingualText;
  tip?: TrilingualText;
  targetId?: string;
}
