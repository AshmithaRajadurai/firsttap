/**
 * Unified Female Voice Selector & Speech Synthesis Utility
 *
 * Ensures consistent, friendly female voice (Selvi) across all FirstTap modules:
 * - Sarvam AI Bulbul TTS (speaker: 'ishita')
 * - Multilingual audio fallback (female)
 * - Browser Web Speech API fallback (strict female voice filter & pitch calibration)
 */

export const CANONICAL_FEMALE_SPEAKER = 'ishita';

const FEMALE_VOICE_KEYWORDS = [
  'female',
  'zira',
  'heera',
  'veena',
  'kalpana',
  'neerja',
  'kavya',
  'priya',
  'sangeeta',
  'shreya',
  'ishita',
  'geeta',
  'ananya',
  'samantha',
  'victoria',
  'karen',
  'moira',
  'tessa',
  'fiona',
  'zoe',
  'ava',
  'allison',
  'serena',
  'leela',
  'swara',
  'google हिन्दी',
  'google தமிழ்',
  'google us english',
  'google uk english female',
];

const MALE_VOICE_KEYWORDS = [
  'david',
  'mark',
  'george',
  'ravi',
  'valluvar',
  'male',
  'guy',
  'stefan',
  'richard',
  'daniel',
  'oliver',
  'thomas',
  'alex',
  'fred',
  'bruce',
  'junior',
  'google uk english male',
];

/**
 * Filter and pick the most natural female voice available in the client browser
 */
export function findBestFemaleVoice(
  voices: SpeechSynthesisVoice[],
  lang: string
): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  const normalizedLang = lang.toLowerCase().replace('_', '-');
  const langPrefix = normalizedLang.split('-')[0]; // 'ta', 'hi', 'en'

  const isExplicitlyMale = (voice: SpeechSynthesisVoice) => {
    const name = voice.name.toLowerCase();
    return MALE_VOICE_KEYWORDS.some((m) => name.includes(m));
  };

  const isExplicitlyFemale = (voice: SpeechSynthesisVoice) => {
    const name = voice.name.toLowerCase();
    return FEMALE_VOICE_KEYWORDS.some((f) => name.includes(f));
  };

  // 1. Language matching + Explicitly female
  const langFemale = voices.find((v) => {
    const vLang = v.lang.toLowerCase().replace('_', '-');
    return (vLang === normalizedLang || vLang.startsWith(langPrefix)) && isExplicitlyFemale(v);
  });
  if (langFemale) return langFemale;

  // 2. Language matching + Not male
  const langNonMale = voices.find((v) => {
    const vLang = v.lang.toLowerCase().replace('_', '-');
    return (vLang === normalizedLang || vLang.startsWith(langPrefix)) && !isExplicitlyMale(v);
  });
  if (langNonMale) return langNonMale;

  // 3. For English: prefer Indian English female (e.g. Heera/Veena), then Zira/Samantha
  if (langPrefix === 'en') {
    const indianEnFemale = voices.find(
      (v) =>
        v.lang.toLowerCase().includes('in') &&
        isExplicitlyFemale(v)
    );
    if (indianEnFemale) return indianEnFemale;

    const anyEnFemale = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith('en') &&
        isExplicitlyFemale(v)
    );
    if (anyEnFemale) return anyEnFemale;
  }

  // 4. Any female voice on the system
  const anyFemale = voices.find((v) => isExplicitlyFemale(v));
  if (anyFemale) return anyFemale;

  // 5. Any voice that is not explicitly male
  const anyNonMale = voices.find((v) => !isExplicitlyMale(v));
  if (anyNonMale) return anyNonMale;

  // Never fall back to explicitly male voices (e.g. David, Mark, Ravi, Valluvar)
  return null;
}

/**
 * Configure a SpeechSynthesisUtterance with guaranteed female voice characteristics
 */
export function configureFemaleUtterance(
  utterance: SpeechSynthesisUtterance,
  lang: string,
  voices: SpeechSynthesisVoice[]
): SpeechSynthesisUtterance {
  const normalizedLang = lang.toLowerCase().replace('_', '-');
  const langPrefix = normalizedLang.split('-')[0];

  utterance.lang = langPrefix === 'ta' ? 'ta-IN' : langPrefix === 'hi' ? 'hi-IN' : 'en-IN';

  const femaleVoice = findBestFemaleVoice(voices, utterance.lang);
  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }

  // Feminine formant tuning: slightly higher pitch (1.08 - 1.12) & clear, gentle rate (0.92)
  utterance.pitch = 1.1;
  utterance.rate = langPrefix === 'en' ? 0.94 : 0.88;

  return utterance;
}
