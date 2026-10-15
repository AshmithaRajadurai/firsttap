import { SupportedLanguage, LearningGoal } from '@/types';

export type UserIntent =
  | { type: 'SELECT_LANGUAGE'; language: SupportedLanguage }
  | { type: 'PROVIDE_NAME'; name: string }
  | { type: 'SELECT_GOAL'; goal: LearningGoal }
  | { type: 'AFFIRMATIVE' }
  | { type: 'NEGATIVE' }
  | { type: 'REPEAT' }
  | { type: 'HELP' }
  | { type: 'GO_BACK' }
  | { type: 'SKIP' }
  | { type: 'NEXT' }
  | { type: 'ASK_QUESTION'; rawText: string }
  | { type: 'UNCLEAR'; rawText: string };

export function matchLanguageIntent(text: string): SupportedLanguage | null {
  if (!text) return null;
  const cleaned = text
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, ' ')
    .trim()
    .toLowerCase();

  if (!cleaned) return null;

  // Exact word boundary checks or substring checks
  // 1. Tamil checks: 'தமிழ்', 'தமிழில்', 'tamil', 'thamizh', 'tamizh', 'thamil', 'dhamil'
  if (
    cleaned.includes('தமிழ்') ||
    cleaned.includes('தமிழில்') ||
    cleaned.includes('தமிள்') ||
    cleaned.includes('tamil') ||
    cleaned.includes('thamizh') ||
    cleaned.includes('tamizh') ||
    cleaned.includes('thamil') ||
    cleaned.includes('dhamil') ||
    cleaned === 'ta'
  ) {
    return 'ta-IN';
  }

  // 2. English checks: 'english', 'ஆங்கிலம்', 'अंग्रेजी', 'अंग्रेज़ी', 'angrezi', 'inglis', 'inglish'
  if (
    cleaned.includes('english') ||
    cleaned.includes('inglish') ||
    cleaned.includes('englesh') ||
    cleaned.includes('ஆங்கிலம்') ||
    cleaned.includes('angilam') ||
    cleaned.includes('अंग्रेजी') ||
    cleaned.includes('अंग्रेज़ी') ||
    cleaned.includes('angrezi') ||
    cleaned.includes('inglis') ||
    cleaned === 'en'
  ) {
    return 'en-IN';
  }

  // 3. Hindi checks: 'हिंदी', 'हिन्दी', 'hindi', 'hindustani'
  if (
    cleaned.includes('हिंदी') ||
    cleaned.includes('हिन्दी') ||
    cleaned.includes('hindi') ||
    cleaned.includes('hindustani') ||
    cleaned.includes('hinde') ||
    cleaned === 'hi'
  ) {
    return 'hi-IN';
  }

  return null;
}

export function extractNameIntent(text: string): string | null {
  const cleaned = text
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, '')
    .trim();

  if (!cleaned) return null;

  // Patterns for Tamil: "என் பெயர் [பெயர்]", "என் பேரு [பெயர்]", "நான் [பெயர்]"
  const tamilMatch = cleaned.match(/(?:என்\s+(?:பெயர்|பேரு|பேர்)|நான்)\s+(.+)/i);
  if (tamilMatch && tamilMatch[1]) {
    const raw = tamilMatch[1].trim().split(/\s+/)[0];
    if (raw && raw.length >= 2) return capitalizeFirst(raw);
  }

  // Patterns for Hindi: "मेरा नाम [नाम] है", "मैं [नाम] हूँ"
  const hindiMatch = cleaned.match(/(?:मेरा\s+नाम|मैं)\s+([^\s]+)(?:\s+हूँ|\s+है)?/i);
  if (hindiMatch && hindiMatch[1]) {
    const raw = hindiMatch[1].trim();
    if (raw && raw.length >= 2) return capitalizeFirst(raw);
  }

  // Patterns for English: "my name is [name]", "i am [name]", "call me [name]"
  const englishMatch = cleaned.match(/(?:my\s+name\s+is|i\s+am|call\s+me)\s+([a-zA-Z]+)/i);
  if (englishMatch && englishMatch[1]) {
    const raw = englishMatch[1].trim();
    if (raw && raw.length >= 2) return capitalizeFirst(raw);
  }

  // If user just spoke a single or two words (e.g. "Arul", "Priya Sharma", "அருள்", "राहुल")
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length <= 3) {
    // Filter out common stopwords if present
    const stopWords = ['yes', 'no', 'hello', 'hi', 'வணக்கம்', 'नमस्ते', 'பெயர்', 'नाम', 'my', 'name', 'என்', 'பேர்'];
    const candidates = words.filter((w) => !stopWords.includes(w.toLowerCase()));
    if (candidates.length > 0) {
      return capitalizeFirst(candidates[0]);
    }
  }

  return null;
}

/**
 * Normalises an incoming speech transcript:
 * - Normalises Unicode (NFC)
 * - Strips Western punctuation (.,/#!$%^&*;:{}=\-_`~()?), Indic dandas (।॥), Unicode quotes (“”‘’«»), and ellipsis (…).
 * - Normalises whitespace and trims
 */
export function normaliseTranscript(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFC')
    .replace(/['’]/g, '')
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?।॥“”«»…]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export type YesNoResult = 'YES' | 'NO' | 'UNKNOWN';

/**
 * Dedicated, testable Yes/No normaliser for English, Tamil, and Hindi.
 * Handles:
 * - Whitespace, case, and punctuation removal
 * - Multi-word phrases ("yes i can", "no i cannot", "இல்லை முடியாது", "नहीं कर सकता")
 * - Single-word affirmations/negations
 * - Prevents arbitrary substring matches (e.g. "piano", "now", "notice")
 */
export function normaliseYesNo(text: string): YesNoResult {
  const norm = normaliseTranscript(text);
  if (!norm) return 'UNKNOWN';

  const lower = norm.toLowerCase();

  // Multi-word negative phrases
  const negativePhrases = [
    // English
    'no i cannot',
    'no i can not',
    'no i cant',
    'no i dont',
    'no i do not',
    'i cannot',
    'i can not',
    'i cant',
    'i dont',
    'i do not',
    'cannot do it',
    'cant do it',
    'not yet',
    'not at all',
    'no nope',
    'no thanks',
    'no thank you',
    // Tamil
    'இல்லை முடியாது',
    'இல்லவே இல்லை',
    'முடியவே முடியாது',
    'தெரியவே தெரியாது',
    'பயன்படுத்துவது இல்லை',
    'பயன்படுத்துவதில்லை',
    'செய்வதில்லை',
    'செய்ததில்லை',
    // Hindi
    'नहीं कर सकता',
    'नहीं कर सकती',
    'नहीं चला सकता',
    'नहीं आता',
    'नहीं किया है',
    'नहीं करते',
    'पता नहीं',
    'बिल्कुल नहीं',
    'जी नहीं',
    'ji nahi',
    'ji nahin',
    'nahi aata',
  ];

  for (const phrase of negativePhrases) {
    if (lower === phrase || lower.startsWith(phrase + ' ') || lower.endsWith(' ' + phrase) || lower.includes(` ${phrase} `)) {
      return 'NO';
    }
  }

  // Multi-word affirmative phrases
  const affirmativePhrases = [
    // English
    'yes i can',
    'yes i do',
    'yes i have',
    'i can',
    'i do',
    'i have',
    'of course',
    'sure i can',
    'yes please',
    // Tamil
    'பயன்படுத்த முடியும்',
    'பயன்படுத்துகிறேன்',
    'செய்திருக்கிறேன்',
    'ஆமாம் முடியும்',
    'ஆம் முடியும்',
    // Hindi
    'हाँ कर सकता हूँ',
    'हाँ कर सकती हूँ',
    'कर सकता हूँ',
    'कर सकती हूँ',
    'चला सकता हूँ',
    'हाँ किया है',
    'किया है',
    'मालूम है',
    'पता है',
    'जी हाँ',
    'हाँ जी',
    'हाँ है',
    'ji haan',
    'haan kar sakta hoon',
  ];

  for (const phrase of affirmativePhrases) {
    if (lower === phrase || lower.startsWith(phrase + ' ') || lower.endsWith(' ' + phrase) || lower.includes(` ${phrase} `)) {
      return 'YES';
    }
  }

  // Single-word negative keywords
  const negativeWords = new Set([
    // English
    'no',
    'nope',
    'nah',
    'cannot',
    'cant',
    'dont',
    'never',
    'false',
    // Tamil
    'இல்லை',
    'கிடையாது',
    'இல்ல',
    'முடியாது',
    'தெரியாது',
    'மாட்டேன்',
    'illai',
    'kidayadhu',
    'illa',
    'mudiyadhu',
    'theriyadhu',
    'maatten',
    // Hindi
    'नहीं',
    'ना',
    'nahi',
    'nahin',
    'na',
  ]);

  // Single-word affirmative keywords
  const affirmativeWords = new Set([
    // English
    'yes',
    'yeah',
    'yep',
    'yup',
    'sure',
    'correct',
    'true',
    'okay',
    'ok',
    'fine',
    // Tamil
    'ஆம்',
    'ஆமாம்',
    'ஆமா',
    'முடியும்',
    'தெரியும்',
    'செய்வேன்',
    'இருக்கு',
    'இருக்கிறது',
    'சரி',
    'ஓகே',
    'புரிகிறது',
    'aamam',
    'aam',
    'aama',
    'mudiyum',
    'theriyum',
    'irukku',
    'irukkiradhu',
    'sari',
    // Hindi
    'हाँ',
    'बिल्कुल',
    'haan',
    'ha',
    'bilkul',
    'theek',
    'thik',
  ]);

  // Exact single match
  if (negativeWords.has(lower)) return 'NO';
  if (affirmativeWords.has(lower)) return 'YES';

  // Token analysis (e.g. "yes please", "sure thing", "no thanks", "ஆம் நிச்சயம்")
  const tokens = lower.split(' ').filter(Boolean);
  if (tokens.length > 0) {
    const first = tokens[0];
    if (negativeWords.has(first)) return 'NO';
    if (affirmativeWords.has(first)) {
      // Guard against contradictory phrases like "sure not", "yes no"
      if (!tokens.includes('not') && !tokens.includes('no') && !tokens.includes('illai') && !tokens.includes('nahi')) {
        return 'YES';
      }
    }
  }

  return 'UNKNOWN';
}

/**
 * Backward compatibility wrapper returning 'yes' | 'no' | null
 */
export function matchYesNoIntent(text: string): 'yes' | 'no' | null {
  const res = normaliseYesNo(text);
  if (res === 'YES') return 'yes';
  if (res === 'NO') return 'no';
  return null;
}

export function matchLearningGoalIntent(text: string): LearningGoal | null {
  if (!text) return null;
  const cleaned = text
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, ' ')
    .trim()
    .toLowerCase();

  if (!cleaned) return null;

  // 1. Direct number or ordinal mentions
  if (
    cleaned === '1' ||
    cleaned === 'one' ||
    cleaned === 'first' ||
    cleaned === 'option 1' ||
    cleaned === 'option one' ||
    cleaned === 'number 1' ||
    cleaned === 'number one' ||
    cleaned === 'ஒன்று' ||
    cleaned === 'முதல்' ||
    cleaned === 'ஒன்னு' ||
    cleaned === 'ஒன்னாவது' ||
    cleaned === 'ஒரு' ||
    cleaned === 'एक' ||
    cleaned === 'पहला' ||
    cleaned === 'नंबर एक' ||
    cleaned === 'पहिला'
  ) {
    return 'EVERYDAY_DIGITAL_SKILLS';
  }

  if (
    cleaned === '2' ||
    cleaned === 'two' ||
    cleaned === 'second' ||
    cleaned === 'option 2' ||
    cleaned === 'option two' ||
    cleaned === 'number 2' ||
    cleaned === 'number two' ||
    cleaned === 'இரண்டு' ||
    cleaned === 'ரெண்டு' ||
    cleaned === 'இரண்டாவது' ||
    cleaned === 'ரெண்டாவது' ||
    cleaned === 'दो' ||
    cleaned === 'दूसरा' ||
    cleaned === 'नंबर दो'
  ) {
    return 'DIGITAL_PAYMENTS';
  }

  if (
    cleaned === '3' ||
    cleaned === 'three' ||
    cleaned === 'third' ||
    cleaned === 'option 3' ||
    cleaned === 'option three' ||
    cleaned === 'number 3' ||
    cleaned === 'number three' ||
    cleaned === 'மூன்று' ||
    cleaned === 'மூணு' ||
    cleaned === 'மூன்றாவது' ||
    cleaned === 'तीन' ||
    cleaned === 'तीसरा' ||
    cleaned === 'नंबर तीन'
  ) {
    return 'MSME_BUSINESS_SKILLS';
  }

  // 2. Keyword scoring across the 3 categories
  let everydayScore = 0;
  let paymentScore = 0;
  let businessScore = 0;

  const everydayKeywords = [
    'everyday',
    'daily',
    'general',
    'internet',
    'phone and internet',
    'calling',
    'messaging',
    'whatsapp',
    'youtube',
    'browsing',
    'normal use',
    'daily use',
    'regular phone',
    'அன்றாட',
    'தினசரி',
    'இணையம்',
    'இன்டர்நெட்',
    'போன் பயன்பாடு',
    'பொதுவான',
    'செய்தி',
    'வாட்ஸ்அப்',
    'யூடியூப்',
    'रोज़मर्रा',
    'रोजमर्रा',
    'रोजाना',
    'दैनिक',
    'इंटरनेट',
    'सामान्य',
    'फोन इस्तेमाल',
    'व्हाट्सएप',
    'यूट्यूब',
  ];

  const paymentKeywords = [
    'digital payments',
    'digital payment',
    'payments',
    'payment',
    'online services',
    'upi',
    'gpay',
    'google pay',
    'phonepe',
    'paytm',
    'money transfer',
    'send money',
    'transfer money',
    'bill payment',
    'டிஜிட்டல் பணப் பரிவர்த்தனை',
    'டிஜிட்டல் கட்டணம்',
    'பணம் செலுத்த',
    'பணம் அனுப்ப',
    'பணப் பரிவர்த்தனை',
    'பணப்பரிவர்த்தனை',
    'பேமெண்ட்',
    'யூபிஐ',
    'கூகுள் பே',
    'போன்பே',
    'பேடிஎம்',
    'ஆன்லைன் சேவை',
    'डिजिटल भुगतान',
    'भुगतान',
    'पेमेंट',
    'पैसे भेजना',
    'ऑनलाइन सेवाएं',
    'यूपीआई',
    'गूगल पे',
    'फोनपे',
    'पेटीएम',
    'लेन-देन',
  ];

  const businessKeywords = [
    'business',
    'small business',
    'shop',
    'store',
    'kirana',
    'trade',
    'trader',
    'vendor',
    'digital tools',
    'tools for shop',
    'sales',
    'expenses',
    'khata',
    'bookkeeping',
    'msme',
    'கடை',
    'வணிகம்',
    'வியாபாரம்',
    'சிறு வணிகம்',
    'தொழில்',
    'விற்பனை',
    'செலவு',
    'காதா',
    'கணக்கு',
    'दुकान',
    'व्यवसाय',
    'व्यापार',
    'छोटा व्यापार',
    'किराना',
    'बिजनेस',
    'बिक्री',
    'खर्च',
    'बहीखाता',
    'खाता',
    'दुकानदार',
    'एमएसएमई',
  ];

  for (const kw of everydayKeywords) {
    if (cleaned.includes(kw)) everydayScore += kw.length > 5 ? 2 : 1;
  }
  for (const kw of paymentKeywords) {
    if (cleaned.includes(kw)) paymentScore += kw.length > 5 ? 2 : 1;
  }
  for (const kw of businessKeywords) {
    if (cleaned.includes(kw)) businessScore += kw.length > 5 ? 2 : 1;
  }

  // Ambiguity check: user must have a clear winning score
  const scores = [
    { goal: 'EVERYDAY_DIGITAL_SKILLS' as const, score: everydayScore },
    { goal: 'DIGITAL_PAYMENTS' as const, score: paymentScore },
    { goal: 'MSME_BUSINESS_SKILLS' as const, score: businessScore },
  ].sort((a, b) => b.score - a.score);

  if (scores[0].score > 0 && scores[0].score > scores[1].score) {
    return scores[0].goal;
  }

  return null;
}

export function matchCommandIntent(text: string): UserIntent | null {
  const norm = text.toLowerCase().trim();

  // Repeat
  if (
    norm.includes('repeat') ||
    norm.includes('again') ||
    norm.includes('மீண்டும்') ||
    norm.includes('மறுபடியும்') ||
    norm.includes('இன்னொரு முறை') ||
    norm.includes('फिर से') ||
    norm.includes('दोबारा')
  ) {
    return { type: 'REPEAT' };
  }

  // Help
  if (
    norm.includes('help') ||
    norm.includes('உதவி') ||
    norm.includes('புரியவில்லை') ||
    norm.includes('மदद') ||
    norm.includes('मदद') ||
    norm.includes('सहायता')
  ) {
    return { type: 'HELP' };
  }

  // Go back
  if (
    norm.includes('back') ||
    norm.includes('பின்னே') ||
    norm.includes('முந்தைய') ||
    norm.includes('पीछे') ||
    norm.includes('वापस')
  ) {
    return { type: 'GO_BACK' };
  }

  // Skip
  if (
    norm.includes('skip') ||
    norm.includes('தவிர்') ||
    norm.includes('छोड़ो')
  ) {
    return { type: 'SKIP' };
  }

  // Next / Continue
  if (
    norm.includes('next') ||
    norm.includes('continue') ||
    norm.includes('அடுத்தது') ||
    norm.includes('தொடர்') ||
    norm.includes('आगे') ||
    norm.includes('अगला')
  ) {
    return { type: 'NEXT' };
  }

  // Doubt / Question detection
  if (
    norm.includes('question') ||
    norm.includes('doubt') ||
    norm.includes('கேள்வி') ||
    norm.includes('சந்தேகம்') ||
    norm.includes('सवाल') ||
    norm.includes('what is') ||
    norm.includes('why') ||
    norm.includes('என்றால் என்ன') ||
    norm.includes('ஏன்') ||
    norm.includes('क्या है') ||
    norm.includes('क्यों')
  ) {
    return { type: 'ASK_QUESTION', rawText: text };
  }

  return null;
}

function capitalizeFirst(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export type AnswerValidationResult =
  | { status: 'EMPTY' }
  | { status: 'VALID_YES_NO'; value: 'yes' | 'no'; rawText: string; normalisedText: string }
  | { status: 'VALID_GOAL'; value: LearningGoal; rawText: string; normalisedText: string }
  | { status: 'VALID_NAME'; value: string; rawText: string }
  | { status: 'VALID_LANGUAGE'; value: SupportedLanguage; rawText: string }
  | { status: 'YES_NO_WHEN_GOAL_EXPECTED'; rawText: string; value: 'yes' | 'no' }
  | { status: 'UNRECOGNISED'; rawText: string; normalisedText: string };

/**
 * Validates a recognised speech transcript against the current active question state.
 * Implements the required pipeline:
 * LISTENING ➔ TRANSCRIPT_RECEIVED ➔ NORMALISE_TRANSCRIPT ➔ VALIDATE_FOR_CURRENT_QUESTION ➔ ACCEPT_ANSWER ➔ ADVANCE_STATE
 */
export function validateAnswerForQuestion(
  questionType: 'phone_independence' | 'learning_goal' | 'branch_question' | 'name' | 'language',
  rawText: string
): AnswerValidationResult {
  const trimmed = (rawText || '').trim();
  if (!trimmed) {
    return { status: 'EMPTY' };
  }

  const normalised = normaliseTranscript(trimmed);
  if (!normalised) {
    return { status: 'EMPTY' };
  }

  switch (questionType) {
    case 'language': {
      const lang = matchLanguageIntent(trimmed);
      if (lang) {
        return { status: 'VALID_LANGUAGE', value: lang, rawText: trimmed };
      }
      return { status: 'UNRECOGNISED', rawText: trimmed, normalisedText: normalised };
    }

    case 'name': {
      const name = extractNameIntent(trimmed);
      if (name && name.length >= 2) {
        return { status: 'VALID_NAME', value: name, rawText: trimmed };
      }
      return { status: 'UNRECOGNISED', rawText: trimmed, normalisedText: normalised };
    }

    case 'phone_independence':
    case 'branch_question': {
      const yesNoRes = normaliseYesNo(trimmed);
      if (yesNoRes === 'YES') {
        return { status: 'VALID_YES_NO', value: 'yes', rawText: trimmed, normalisedText: normalised };
      }
      if (yesNoRes === 'NO') {
        return { status: 'VALID_YES_NO', value: 'no', rawText: trimmed, normalisedText: normalised };
      }
      return { status: 'UNRECOGNISED', rawText: trimmed, normalisedText: normalised };
    }

    case 'learning_goal': {
      // First check if user gave a Yes/No answer instead of choosing a goal
      const yesNoCheck = normaliseYesNo(trimmed);
      if (yesNoCheck === 'YES' || yesNoCheck === 'NO') {
        return {
          status: 'YES_NO_WHEN_GOAL_EXPECTED',
          rawText: trimmed,
          value: yesNoCheck === 'YES' ? 'yes' : 'no',
        };
      }

      // Check if it matches one of the three goals
      const goal = matchLearningGoalIntent(trimmed);
      if (goal) {
        return { status: 'VALID_GOAL', value: goal, rawText: trimmed, normalisedText: normalised };
      }

      return { status: 'UNRECOGNISED', rawText: trimmed, normalisedText: normalised };
    }

    default:
      return { status: 'UNRECOGNISED', rawText: trimmed, normalisedText: normalised };
  }
}

