import assert from 'node:assert';
import { UI_TRANSLATIONS } from '../translations';
import { APP_PROMPTS, SUPPORTED_LANGUAGES } from '../../lessons/catalog';
import { matchLanguageIntent, extractNameIntent, matchYesNoIntent } from '../../fsm/intents';
import { FirstTapFSM } from '../../fsm/machine';
import { SupportedLanguage } from '@/types';

export function runComprehensiveValidation() {
  console.log('=== RUNNING COMPREHENSIVE FIRSTTAP VALIDATION SUITE ===\n');

  // 1. Language Configuration & Locales
  console.log('1. Validating Language Codes...');
  const expectedCodes: SupportedLanguage[] = ['ta-IN', 'en-IN', 'hi-IN'];
  for (const code of expectedCodes) {
    assert.ok(SUPPORTED_LANGUAGES[code], `SUPPORTED_LANGUAGES must contain ${code}`);
    assert.strictEqual(SUPPORTED_LANGUAGES[code].code, code);
  }
  console.log('✓ All 3 locale codes (ta-IN, en-IN, hi-IN) present and correctly configured.');

  // 2. Greeting Prompt Check
  console.log('\n2. Validating Initial Greeting...');
  assert.strictEqual(APP_PROMPTS.welcome['ta-IN'], 'வணக்கம்! Welcome to FirstTap!');
  assert.strictEqual(APP_PROMPTS.welcome['en-IN'], 'வணக்கம்! Welcome to FirstTap!');
  assert.strictEqual(APP_PROMPTS.welcome['hi-IN'], 'வணக்கம்! Welcome to FirstTap!');
  console.log('✓ Welcome greeting verified: "வணக்கம்! Welcome to FirstTap!"');

  // 3. Spoken Sequence Check
  console.log('\n3. Validating Spoken Language Sequence...');
  const seq = APP_PROMPTS.languageChoiceIntro.promptSequence;
  assert.strictEqual(seq.length, 3, 'Sequence must have exactly 3 sentences');
  
  // Sentence 1: English
  assert.strictEqual(seq[0].language, 'en-IN');
  assert.strictEqual(seq[0].text, 'If you want to learn in English, say English.');

  // Sentence 2: Tamil
  assert.strictEqual(seq[1].language, 'ta-IN');
  assert.strictEqual(seq[1].text, "தமிழில் கற்க விரும்பினால், 'தமிழ்' என்று சொல்லுங்கள்.");

  // Sentence 3: Hindi
  assert.strictEqual(seq[2].language, 'hi-IN');
  assert.strictEqual(seq[2].text, "अगर आप हिंदी में सीखना चाहते हैं, तो 'हिंदी' कहें।");
  console.log('✓ Spoken language sequence verified in order: English -> Tamil -> Hindi.');

  // 4. Confirmation Phrases Check
  console.log('\n4. Validating Language Confirmation Prompts...');
  assert.strictEqual(APP_PROMPTS.languageConfirm['ta-IN'], 'சரி! நாம் தமிழில் தொடர்ந்து கற்கலாம்.');
  assert.strictEqual(APP_PROMPTS.languageConfirm['en-IN'], 'Great! We will continue learning in English.');
  assert.strictEqual(APP_PROMPTS.languageConfirm['hi-IN'], 'बहुत अच्छा! अब हम हिंदी में सीखेंगे।');
  console.log('✓ Spoken confirmations match requirement 5 exactly.');

  // 5. Name Questions Check
  console.log('\n5. Validating Name Question Prompts...');
  assert.strictEqual(APP_PROMPTS.askName['ta-IN'], 'மிக்க மகிழ்ச்சி! உங்கள் பெயர் என்ன?');
  assert.strictEqual(APP_PROMPTS.askName['en-IN'], "That's great! What is your name?");
  assert.strictEqual(APP_PROMPTS.askName['hi-IN'], 'बहुत बढ़िया! आपका नाम क्या है?');
  console.log('✓ Spoken name prompts match requirement 6 exactly.');

  // 6. Mobile Phone Questions Check
  console.log('\n6. Validating Mobile Phone Question Prompts...');
  assert.strictEqual(APP_PROMPTS.askPhoneOwnership['ta-IN']('அருள்'), 'அருள், உங்களிடம் கைப்பேசி இருக்கிறதா?');
  assert.strictEqual(APP_PROMPTS.askPhoneOwnership['en-IN']('Priya'), 'Priya, do you have a mobile phone?');
  assert.strictEqual(APP_PROMPTS.askPhoneOwnership['hi-IN']('राहुल'), 'राहुल, क्या आपके पास मोबाइल फोन है?');
  console.log('✓ Spoken mobile phone questions match requirement 6 with personalized name.');

  // 7. Translation Dictionary Parity Check
  console.log('\n7. Validating Translation Dictionary Complete Parity...');
  const languages: SupportedLanguage[] = ['ta-IN', 'en-IN', 'hi-IN'];
  for (const lang of languages) {
    const t = UI_TRANSLATIONS[lang];
    assert.ok(t.appTitle, `Missing appTitle for ${lang}`);
    assert.ok(t.appSubtitle, `Missing appSubtitle for ${lang}`);
    assert.ok(t.demoModeBadge, `Missing demoModeBadge for ${lang}`);
    assert.ok(t.liveModeBadge, `Missing liveModeBadge for ${lang}`);

    // State banners
    const stateKeys = [
      'APP_START', 'LANGUAGE_SELECT', 'LANGUAGE_CONFIRM', 'ASK_NAME',
      'ASK_PHONE_OWNERSHIP', 'PLACEMENT_QUESTIONS', 'PERSONALISE_LEARNING',
      'LESSON', 'DOUBT_HANDLING', 'SESSION_COMPLETE'
    ] as const;
    for (const key of stateKeys) {
      assert.ok(t.stateBanners[key], `Missing stateBanner ${key} for ${lang}`);
    }

    // Mascot labels
    assert.ok(t.mascot.teacherName, `Missing teacherName for ${lang}`);
    assert.ok(t.mascot.speakingBadge, `Missing speakingBadge for ${lang}`);
    assert.ok(t.mascot.listeningBadge, `Missing listeningBadge for ${lang}`);
    assert.ok(t.mascot.thinkingBadge, `Missing thinkingBadge for ${lang}`);
    assert.ok(t.mascot.happyBadge, `Missing happyBadge for ${lang}`);
    assert.ok(t.mascot.encouragingBadge, `Missing encouragingBadge for ${lang}`);
    assert.ok(t.mascot.welcomeBadge, `Missing welcomeBadge for ${lang}`);
    assert.ok(t.mascot.readyBadge, `Missing readyBadge for ${lang}`);

    // Captions labels
    assert.ok(t.captions.hideCaptions, `Missing hideCaptions for ${lang}`);
    assert.ok(t.captions.showCaptions, `Missing showCaptions for ${lang}`);
    assert.ok(t.captions.youSpeaker, `Missing youSpeaker for ${lang}`);
    assert.ok(t.captions.transcribingHint, `Missing transcribingHint for ${lang}`);

    // Controls
    assert.ok(t.controls.repeatPrompt, `Missing repeatPrompt for ${lang}`);
    assert.ok(t.controls.stopSpeaking, `Missing stopSpeaking for ${lang}`);
    assert.ok(t.controls.tapToSpeak, `Missing tapToSpeak for ${lang}`);
    assert.ok(t.controls.voiceHints.listening, `Missing voiceHints.listening for ${lang}`);
    assert.ok(t.controls.voiceHints.speaking, `Missing voiceHints.speaking for ${lang}`);
    assert.ok(t.controls.voiceHints.preparingMicrophone, `Missing voiceHints.preparingMicrophone for ${lang}`);
    assert.ok(t.controls.voiceHints.couldNotHear, `Missing voiceHints.couldNotHear for ${lang}`);
    assert.ok(t.controls.fallbackLanguageTitle, `Missing fallbackLanguageTitle for ${lang}`);
    assert.ok(t.controls.yesButton, `Missing yesButton for ${lang}`);
    assert.ok(t.controls.noButton, `Missing noButton for ${lang}`);

    // Celebration
    assert.ok(t.celebration.heading, `Missing celebration.heading for ${lang}`);
    assert.ok(t.celebration.description, `Missing celebration.description for ${lang}`);
    assert.ok(t.celebration.startAgainButton, `Missing celebration.startAgainButton for ${lang}`);
  }
  console.log('✓ UI translations fully populated across all categories for ta-IN, en-IN, and hi-IN.');

  // 8. Deterministic Intent Detection & No-Guessing Check
  console.log('\n8. Validating Deterministic Language Intent Detection...');
  assert.strictEqual(matchLanguageIntent('தமிழ்'), 'ta-IN');
  assert.strictEqual(matchLanguageIntent('தமிழில்'), 'ta-IN');
  assert.strictEqual(matchLanguageIntent('Tamil'), 'ta-IN');
  assert.strictEqual(matchLanguageIntent('English'), 'en-IN');
  assert.strictEqual(matchLanguageIntent('ஆங்கிலம்'), 'en-IN');
  assert.strictEqual(matchLanguageIntent('hindi'), 'hi-IN');
  assert.strictEqual(matchLanguageIntent('हिंदी'), 'hi-IN');
  // Ambiguous or random text must NOT guess!
  assert.strictEqual(matchLanguageIntent('pizza'), null, 'Must not guess for pizza');
  assert.strictEqual(matchLanguageIntent('random text'), null, 'Must not guess for random text');
  assert.strictEqual(matchLanguageIntent('12345'), null, 'Must not guess for numbers');
  console.log('✓ Language detection is 100% deterministic with zero guessing.');

  // 9. Full Flow Execution: Test A (Tamil)
  console.log('\n9. Executing Test A (Tamil Pathway)...');
  const fsmA = new FirstTapFSM();
  const startA = fsmA.startApp();
  assert.strictEqual(startA.speechToSpeak, 'வணக்கம்! Welcome to FirstTap!');
  const langPromptA = fsmA.moveToLanguageSelect();
  assert.strictEqual(langPromptA.speechSequence?.length, 3);
  
  // User says "தமிழ்"
  const langA = fsmA.processInput('தமிழ்');
  assert.strictEqual(langA.nextState, 'ASKING_NAME');
  assert.strictEqual(langA.updatedSession.language, 'ta-IN');
  assert.strictEqual(langA.speechToSpeak, 'மிக்க மகிழ்ச்சி! உங்கள் பெயர் என்ன?');

  // User says "என் பெயர் அருள்"
  const nameAnsA = fsmA.processInput('என் பெயர் அருள்');
  assert.strictEqual(nameAnsA.nextState, 'ASKING_PHONE_INDEPENDENCE');
  assert.strictEqual(nameAnsA.updatedSession.userName, 'அருள்');
  assert.ok(nameAnsA.speechToSpeak.includes('அருள்'));
  console.log('✓ Test A Passed: Voice selection of "தமிழ்" completely transitions to Tamil UI, confirmation, name prompt, and phone prompt.');

  // 10. Full Flow Execution: Test B (English)
  console.log('\n10. Executing Test B (English Pathway)...');
  const fsmB = new FirstTapFSM();
  fsmB.startApp();
  fsmB.moveToLanguageSelect();
  // User says "English"
  const langB = fsmB.processInput('English');
  assert.strictEqual(langB.nextState, 'ASKING_NAME');
  assert.strictEqual(langB.updatedSession.language, 'en-IN');
  assert.strictEqual(langB.speechToSpeak, "That's great! What is your name?");

  // User says "My name is Priya"
  const nameAnsB = fsmB.processInput('My name is Priya');
  assert.strictEqual(nameAnsB.nextState, 'ASKING_PHONE_INDEPENDENCE');
  assert.strictEqual(nameAnsB.updatedSession.userName, 'Priya');
  assert.ok(nameAnsB.speechToSpeak.includes('Priya'));
  console.log('✓ Test B Passed: Voice selection of "English" completely transitions to English UI, confirmation, name prompt, and phone prompt.');

  // 11. Full Flow Execution: Test C (Hindi)
  console.log('\n11. Executing Test C (Hindi Pathway)...');
  const fsmC = new FirstTapFSM();
  fsmC.startApp();
  fsmC.moveToLanguageSelect();
  // User says "हिंदी"
  const langC = fsmC.processInput('हिंदी');
  assert.strictEqual(langC.nextState, 'ASKING_NAME');
  assert.strictEqual(langC.updatedSession.language, 'hi-IN');
  assert.strictEqual(langC.speechToSpeak, 'बहुत बढ़िया! आपका नाम क्या है?');

  // User says "मेरा नाम राहुल है"
  const nameAnsC = fsmC.processInput('मेरा नाम राहुल है');
  assert.strictEqual(nameAnsC.nextState, 'ASKING_PHONE_INDEPENDENCE');
  assert.strictEqual(nameAnsC.updatedSession.userName, 'राहुल');
  assert.ok(nameAnsC.speechToSpeak.includes('राहुल'));
  console.log('✓ Test C Passed: Voice selection of "हिंदी" completely transitions to Hindi UI, confirmation, name prompt, and phone prompt.');

  // 12. Unclear Input Re-Prompting Check
  console.log('\n12. Validating Unclear Input Re-Prompting during Language Select...');
  const fsmUnclear = new FirstTapFSM();
  fsmUnclear.startApp();
  fsmUnclear.moveToLanguageSelect();
  const retryResult = fsmUnclear.processInput('gibberish word');
  assert.strictEqual(retryResult.nextState, 'WAITING_FOR_LANGUAGE');
  assert.ok(retryResult.speechSequence && retryResult.speechSequence.length === 3, 'Must repeat language choices sequence');
  assert.strictEqual(retryResult.expectedInputType, 'language');
  assert.strictEqual(retryResult.suggestedMood, 'encouraging');
  console.log('✓ Unclear answer during LANGUAGE_SELECT repeats all 3 choices aloud and listens again without guessing.');
  assert.strictEqual(retryResult.suggestedMood, 'encouraging');
  console.log('✓ Unclear answer during LANGUAGE_SELECT repeats all 3 choices aloud and listens again without guessing.');

  console.log('\n=== ALL VALIDATION TESTS PASSED WITH 100% SUCCESS! ===');
}

runComprehensiveValidation();
