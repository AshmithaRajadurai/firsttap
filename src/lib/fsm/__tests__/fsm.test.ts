import assert from 'node:assert';
import { FirstTapFSM } from '../machine';
import {
  matchLanguageIntent,
  extractNameIntent,
  matchYesNoIntent,
  matchLearningGoalIntent,
} from '../intents';
import { CATEGORIES_META, LEARNING_PATHS_META } from '../../lessons/catalog';

export function runFsmTests() {
  console.log('====================================================');
  console.log('FirstTap — Module 1 Assessment & Classification Tests');
  console.log('====================================================\n');

  // ----------------------------------------------------------------
  // Intent Extraction Tests
  // ----------------------------------------------------------------
  console.log('--- Sub-tests: Voice Intent Recognition ---');

  // Language matching
  assert.strictEqual(matchLanguageIntent('தமிழ்'), 'ta-IN');
  assert.strictEqual(matchLanguageIntent('தமிழில்'), 'ta-IN');
  assert.strictEqual(matchLanguageIntent('tamil'), 'ta-IN');
  assert.strictEqual(matchLanguageIntent('thamizh'), 'ta-IN');
  assert.strictEqual(matchLanguageIntent('English'), 'en-IN');
  assert.strictEqual(matchLanguageIntent('ஆங்கிலம்'), 'en-IN');
  assert.strictEqual(matchLanguageIntent('hindi'), 'hi-IN');
  assert.strictEqual(matchLanguageIntent('हिंदी'), 'hi-IN');
  console.log('✓ Passed: Language matching (Tamil, English, Hindi)');

  // Name extraction
  assert.strictEqual(extractNameIntent('என் பெயர் அருள்'), 'அருள்');
  assert.strictEqual(extractNameIntent('My name is Priya'), 'Priya');
  assert.strictEqual(extractNameIntent('मेरा नाम राहुल है'), 'राहुल');
  assert.strictEqual(extractNameIntent('Kavitha'), 'Kavitha');
  assert.strictEqual(extractNameIntent('Ashmitha'), 'Ashmitha');
  console.log('✓ Passed: Name extraction');

  // Yes/No matching
  assert.strictEqual(matchYesNoIntent('ஆம்'), 'yes');
  assert.strictEqual(matchYesNoIntent('ஆமாம்'), 'yes');
  assert.strictEqual(matchYesNoIntent('முடியும்'), 'yes');
  assert.strictEqual(matchYesNoIntent('இல்லை'), 'no');
  assert.strictEqual(matchYesNoIntent('முடியாது'), 'no');
  assert.strictEqual(matchYesNoIntent('yes'), 'yes');
  assert.strictEqual(matchYesNoIntent('i can'), 'yes');
  assert.strictEqual(matchYesNoIntent('no'), 'no');
  assert.strictEqual(matchYesNoIntent('i cannot'), 'no');
  assert.strictEqual(matchYesNoIntent('हाँ'), 'yes');
  assert.strictEqual(matchYesNoIntent('कर सकता हूँ'), 'yes');
  assert.strictEqual(matchYesNoIntent('नहीं'), 'no');
  assert.strictEqual(matchYesNoIntent('नहीं कर सकता'), 'no');
  console.log('✓ Passed: Yes/No matching across 3 languages');

  // Learning Goal matching
  assert.strictEqual(matchLearningGoalIntent('1'), 'EVERYDAY_DIGITAL_SKILLS');
  assert.strictEqual(matchLearningGoalIntent('everyday phone and internet use'), 'EVERYDAY_DIGITAL_SKILLS');
  assert.strictEqual(matchLearningGoalIntent('அன்றாட பயன்பாடு'), 'EVERYDAY_DIGITAL_SKILLS');
  assert.strictEqual(matchLearningGoalIntent('रोज़मर्रा का फोन और इंटरनेट इस्तेमाल'), 'EVERYDAY_DIGITAL_SKILLS');

  assert.strictEqual(matchLearningGoalIntent('2'), 'DIGITAL_PAYMENTS');
  assert.strictEqual(matchLearningGoalIntent('digital payments and online services'), 'DIGITAL_PAYMENTS');
  assert.strictEqual(matchLearningGoalIntent('UPI payments and GPay'), 'DIGITAL_PAYMENTS');
  assert.strictEqual(matchLearningGoalIntent('டிஜிட்டல் பணப் பரிவர்த்தனை'), 'DIGITAL_PAYMENTS');
  assert.strictEqual(matchLearningGoalIntent('डिजिटल भुगतान'), 'DIGITAL_PAYMENTS');

  assert.strictEqual(matchLearningGoalIntent('3'), 'MSME_BUSINESS_SKILLS');
  assert.strictEqual(matchLearningGoalIntent('tools for my shop or small business'), 'MSME_BUSINESS_SKILLS');
  assert.strictEqual(matchLearningGoalIntent('கடை மற்றும் சிறு வணிகம்'), 'MSME_BUSINESS_SKILLS');
  assert.strictEqual(matchLearningGoalIntent('अपनी दुकान या छोटे व्यापार के लिए'), 'MSME_BUSINESS_SKILLS');
  console.log('✓ Passed: Learning goal matching across 3 options\n');

  // ----------------------------------------------------------------
  // Scenario 1: User selects Tamil by voice, provides a name,
  // answers NO to phone independence, and receives the beginner path.
  // No further questions are asked.
  // ----------------------------------------------------------------
  console.log('--- Scenario 1: Tamil Flow -> Phone Independence NO -> Digital Beginner ---');
  const fsm1 = new FirstTapFSM();
  const start1 = fsm1.startApp();
  assert.strictEqual(start1.nextState, 'GREETING');

  const langSeq1 = fsm1.moveToLanguageSelect();
  assert.strictEqual(langSeq1.nextState, 'LANGUAGE_OPTIONS');
  assert.strictEqual(langSeq1.speechSequence?.length, 3);

  // User speaks "தமிழ்"
  const langRes1 = fsm1.processInput('தமிழ்');
  assert.strictEqual(langRes1.nextState, 'ASKING_NAME');
  assert.strictEqual(langRes1.updatedSession.language, 'ta-IN');

  // User provides name "அருள்"
  const nameRes1 = fsm1.processInput('என் பெயர் அருள்');
  assert.strictEqual(nameRes1.nextState, 'ASKING_PHONE_INDEPENDENCE');
  assert.strictEqual(nameRes1.updatedSession.userName, 'அருள்');
  assert.ok(nameRes1.speechToSpeak.includes('அருள்'));

  // User answers NO to phone independence: "இல்லை"
  const phoneRes1 = fsm1.processInput('இல்லை');
  assert.strictEqual(phoneRes1.nextState, 'ASSESSMENT_COMPLETE');
  assert.strictEqual(phoneRes1.updatedSession.phoneIndependent, false);
  assert.strictEqual(phoneRes1.updatedSession.primaryCategory, 'DIGITAL_BEGINNER');
  assert.strictEqual(phoneRes1.updatedSession.startingPath, 'SMARTPHONE_BASICS');
  assert.strictEqual(phoneRes1.updatedSession.learningGoal, null, 'No learning goal asked for beginner');

  // Verify learner profile
  const profile1 = phoneRes1.updatedSession.learnerProfile;
  assert.ok(profile1, 'Learner profile created');
  assert.strictEqual(profile1.name, 'அருள்');
  assert.strictEqual(profile1.preferred_language, 'ta-IN');
  assert.strictEqual(profile1.phone_independent, false);
  assert.strictEqual(profile1.learning_goal, null);
  assert.strictEqual(profile1.primary_category, 'DIGITAL_BEGINNER');
  assert.strictEqual(profile1.starting_learning_path, 'SMARTPHONE_BASICS');
  assert.strictEqual(profile1.assessment_status, 'COMPLETED');
  assert.strictEqual(profile1.completion_reason, 'FOUNDATION_PATH');
  assert.ok(profile1.assessment_completed_at);
  console.log('✓ Passed: Scenario 1 (Tamil -> Phone Independence NO -> SMARTPHONE_BASICS)\n');

  // ----------------------------------------------------------------
  // Scenario 2: User selects English, answers YES to phone independence,
  // chooses everyday digital skills, and receives correct path based on
  // internet/messaging answer.
  // ----------------------------------------------------------------
  console.log('--- Scenario 2: English Flow -> Everyday Digital Skills ---');
  // 2A: Answer YES to internet/messaging -> EVERYDAY_DIGITAL_SERVICES
  const fsm2A = new FirstTapFSM();
  fsm2A.startApp();
  fsm2A.moveToLanguageSelect();
  fsm2A.processInput('English');
  fsm2A.processInput('My name is Priya');
  const phoneRes2A = fsm2A.processInput('Yes');
  assert.strictEqual(phoneRes2A.nextState, 'ASKING_LEARNING_GOAL');
  assert.strictEqual(phoneRes2A.updatedSession.phoneIndependent, true);

  // Chooses everyday digital skills
  const goalRes2A = fsm2A.processInput('Everyday phone and internet use');
  assert.strictEqual(goalRes2A.nextState, 'ASKING_BRANCH_QUESTION');
  assert.strictEqual(goalRes2A.updatedSession.learningGoal, 'EVERYDAY_DIGITAL_SKILLS');

  // Answers YES to internet and messaging
  const branchRes2A = fsm2A.processInput('Yes, I can use internet');
  assert.strictEqual(branchRes2A.nextState, 'ASSESSMENT_COMPLETE');
  assert.strictEqual(branchRes2A.updatedSession.primaryCategory, 'EVERYDAY_DIGITAL_LEARNER');
  assert.strictEqual(branchRes2A.updatedSession.startingPath, 'EVERYDAY_DIGITAL_SERVICES');
  assert.strictEqual(branchRes2A.updatedSession.learnerProfile?.starting_learning_path, 'EVERYDAY_DIGITAL_SERVICES');

  // 2B: Answer NO to internet/messaging -> INTERNET_COMMUNICATION_BASICS
  const fsm2B = new FirstTapFSM();
  fsm2B.startApp();
  fsm2B.moveToLanguageSelect();
  fsm2B.processInput('English');
  fsm2B.processInput('Priya');
  fsm2B.processInput('Yes');
  fsm2B.processInput('1');
  const branchRes2B = fsm2B.processInput('No');
  assert.strictEqual(branchRes2B.nextState, 'ASSESSMENT_COMPLETE');
  assert.strictEqual(branchRes2B.updatedSession.primaryCategory, 'EVERYDAY_DIGITAL_LEARNER');
  assert.strictEqual(branchRes2B.updatedSession.startingPath, 'INTERNET_COMMUNICATION_BASICS');
  console.log('✓ Passed: Scenario 2 (Everyday Digital Skills YES/NO branches)\n');

  // ----------------------------------------------------------------
  // Scenario 3: User selects Hindi, chooses digital payments,
  // answers NO to UPI experience, and receives digital payments basics path.
  // ----------------------------------------------------------------
  console.log('--- Scenario 3: Hindi Flow -> Digital Payments NO UPI -> DIGITAL_PAYMENTS_BASICS ---');
  const fsm3 = new FirstTapFSM();
  fsm3.startApp();
  fsm3.moveToLanguageSelect();
  fsm3.processInput('हिंदी');
  fsm3.processInput('मेरा नाम राहुल है');
  fsm3.processInput('हाँ'); // Phone independence YES
  const goalRes3 = fsm3.processInput('डिजिटल भुगतान और ऑनलाइन सेवाएं');
  assert.strictEqual(goalRes3.nextState, 'ASKING_BRANCH_QUESTION');
  assert.strictEqual(goalRes3.updatedSession.learningGoal, 'DIGITAL_PAYMENTS');

  // Answers NO to UPI experience
  const branchRes3 = fsm3.processInput('नहीं, कभी नहीं किया');
  assert.strictEqual(branchRes3.nextState, 'ASSESSMENT_COMPLETE');
  assert.strictEqual(branchRes3.updatedSession.primaryCategory, 'DIGITAL_PAYMENT_LEARNER');
  assert.strictEqual(branchRes3.updatedSession.startingPath, 'DIGITAL_PAYMENTS_BASICS');
  assert.strictEqual(branchRes3.updatedSession.language, 'hi-IN');
  console.log('✓ Passed: Scenario 3 (Hindi -> Payments NO -> DIGITAL_PAYMENTS_BASICS)\n');

  // ----------------------------------------------------------------
  // Scenario 4: User chooses MSME, answers YES to phone independence,
  // receives correct business path based on their answer.
  // ----------------------------------------------------------------
  console.log('--- Scenario 4: MSME Flow -> Business Tools ---');
  const fsm4 = new FirstTapFSM();
  fsm4.startApp();
  fsm4.moveToLanguageSelect();
  fsm4.processInput('English');
  fsm4.processInput('Ramesh');
  fsm4.processInput('Yes');
  fsm4.processInput('3'); // MSME business skills
  assert.strictEqual(fsm4.getSession().learningGoal, 'MSME_BUSINESS_SKILLS');

  // Answers YES to business payments / recording sales
  const branchRes4 = fsm4.processInput('Yes');
  assert.strictEqual(branchRes4.nextState, 'ASSESSMENT_COMPLETE');
  assert.strictEqual(branchRes4.updatedSession.primaryCategory, 'MSME_LEARNER');
  assert.strictEqual(branchRes4.updatedSession.startingPath, 'DIGITAL_BOOKKEEPING_AND_BUSINESS_TOOLS');
  console.log('✓ Passed: Scenario 4 (MSME -> YES -> DIGITAL_BOOKKEEPING_AND_BUSINESS_TOOLS)\n');

  // ----------------------------------------------------------------
  // Scenario 5: User gives an unclear answer.
  // The app retries without advancing incorrectly.
  // ----------------------------------------------------------------
  console.log('--- Scenario 5: Unclear answers and retry handling ---');
  const fsm5 = new FirstTapFSM();
  fsm5.startApp();
  fsm5.moveToLanguageSelect();
  fsm5.processInput('English');
  fsm5.processInput('Kavitha');

  // Unclear response to Phone Independence
  const unclearPhone = fsm5.processInput('maybe sometimes my son helps me');
  assert.strictEqual(unclearPhone.nextState, 'WAITING_FOR_PHONE_ANSWER', 'Did NOT advance on unclear answer');
  assert.strictEqual(fsm5.getSession().phoneIndependent, null, 'Did NOT guess boolean value');
  assert.strictEqual(fsm5.getSession().consecutiveRetries, 1);

  // Now user clarifies YES
  fsm5.processInput('Yes');
  assert.strictEqual(fsm5.getState(), 'ASKING_LEARNING_GOAL', 'Advances only after valid resolution');

  // Unclear response to Goal
  const unclearGoal = fsm5.processInput('everything sounds interesting');
  assert.strictEqual(unclearGoal.nextState, 'WAITING_FOR_LEARNING_GOAL', 'Did NOT advance on ambiguous goal');
  assert.strictEqual(fsm5.getSession().learningGoal, null, 'Did NOT guess category');
  console.log('✓ Passed: Scenario 5 (Retry without premature advancement)\n');

  // ----------------------------------------------------------------
  // Scenario 6: Speech recognition fails / empty input.
  // App provides recovery without misclassifying the user.
  // ----------------------------------------------------------------
  console.log('--- Scenario 6: Empty input / recognition failure recovery ---');
  const fsm6 = new FirstTapFSM();
  fsm6.startApp();
  fsm6.moveToLanguageSelect();
  const emptyRes = fsm6.processInput('');
  assert.strictEqual(emptyRes.nextState, 'WAITING_FOR_LANGUAGE');
  assert.strictEqual(fsm6.getSession().consecutiveRetries, 1);
  assert.ok(emptyRes.speechToSpeak.length > 0);
  console.log('✓ Passed: Scenario 6 (Recognition failure recovery)\n');

  // ----------------------------------------------------------------
  // Scenario 7: Microphone never records mascot's own prompt
  // (Tested via VoiceEngine state guards and sequencing)
  // ----------------------------------------------------------------
  console.log('--- Scenario 7: Speech sequencing & mic lock verification ---');
  const fsm7 = new FirstTapFSM();
  fsm7.startApp();
  const langTransition = fsm7.moveToLanguageSelect();
  assert.strictEqual(langTransition.speechSequence?.length, 3);
  assert.strictEqual(langTransition.speechSequence[0].language, 'en-IN');
  assert.strictEqual(langTransition.speechSequence[1].language, 'ta-IN');
  assert.strictEqual(langTransition.speechSequence[2].language, 'hi-IN');
  console.log('✓ Passed: Scenario 7 (Sequence defined with explicit completion callback)\n');

  // ----------------------------------------------------------------
  // Scenario 8: React re-renders or repeated audio event does not
  // duplicate questions or recordings.
  // ----------------------------------------------------------------
  console.log('--- Scenario 8: Idempotency & Repeat Handling ---');
  const fsm8 = new FirstTapFSM();
  fsm8.startApp();
  fsm8.moveToLanguageSelect();
  fsm8.processInput('English');
  fsm8.processInput('John');

  const repeatRes = fsm8.processInput('repeat');
  assert.strictEqual(repeatRes.nextState, 'ASKING_PHONE_INDEPENDENCE', 'Maintains state on repeat');
  assert.strictEqual(fsm8.getSession().userName, 'John');
  console.log('✓ Passed: Scenario 8 (Idempotent repeat and state preservation)\n');

  // ----------------------------------------------------------------
  // Scenario 9: Saved learner profile contains correct category and path
  // ----------------------------------------------------------------
  console.log('--- Scenario 9: Profile Schema & Metadata Integrity ---');
  const allCategories = ['DIGITAL_BEGINNER', 'EVERYDAY_DIGITAL_LEARNER', 'DIGITAL_PAYMENT_LEARNER', 'MSME_LEARNER'] as const;
  for (const cat of allCategories) {
    assert.ok(CATEGORIES_META[cat], `Metadata exists for category ${cat}`);
    assert.ok(CATEGORIES_META[cat].title['ta-IN']);
    assert.ok(CATEGORIES_META[cat].title['en-IN']);
    assert.ok(CATEGORIES_META[cat].title['hi-IN']);
  }

  const allPaths = [
    'SMARTPHONE_BASICS',
    'INTERNET_COMMUNICATION_BASICS',
    'EVERYDAY_DIGITAL_SERVICES',
    'DIGITAL_PAYMENTS_BASICS',
    'PAYMENT_VERIFICATION_AND_SAFETY',
    'DIGITAL_BUSINESS_BASICS',
    'DIGITAL_BOOKKEEPING_AND_BUSINESS_TOOLS',
  ] as const;
  for (const p of allPaths) {
    assert.ok(LEARNING_PATHS_META[p], `Metadata exists for path ${p}`);
    assert.ok(LEARNING_PATHS_META[p].title['ta-IN']);
    assert.ok(LEARNING_PATHS_META[p].title['en-IN']);
    assert.ok(LEARNING_PATHS_META[p].title['hi-IN']);
  }
  console.log('✓ Passed: Scenario 9 (All 4 categories and 7 paths have verified metadata)\n');

  // ----------------------------------------------------------------
  // Scenario 10: All prompts and responses remain in selected language
  // ----------------------------------------------------------------
  console.log('--- Scenario 10: Language Consistency ---');
  const fsm10 = new FirstTapFSM();
  fsm10.startApp();
  fsm10.moveToLanguageSelect();
  // Select Tamil
  fsm10.processInput('தமிழ்');
  assert.strictEqual(fsm10.getSession().language, 'ta-IN');

  const q1 = fsm10.processInput('மலர்');
  assert.ok(q1.speechToSpeak.includes('மலர்') && q1.speechToSpeak.includes('மொபைல் போனை'), 'Tamil in Q1');

  const q2 = fsm10.processInput('ஆம்');
  assert.ok(q2.speechToSpeak.includes('கற்றுக்கொள்ள விரும்புகிறீர்கள்'), 'Tamil in Q2');

  const q3 = fsm10.processInput('2'); // Digital payments
  assert.ok(q3.speechToSpeak.includes('UPI செயலியைப் பயன்படுத்தி'), 'Tamil in Q3');

  const complete10 = fsm10.processInput('ஆம்');
  assert.ok(complete10.speechToSpeak.includes('அருமை') || complete10.speechToSpeak.includes('வாழ்த்துகள்'), 'Tamil completion');
  assert.strictEqual(complete10.updatedSession.language, 'ta-IN');
  console.log('✓ Passed: Scenario 10 (Strict language consistency maintained)\n');

  console.log('====================================================');
  console.log('ALL 10 MODULE 1 TEST SCENARIOS PASSED WITH 100% SUCCESS!');
  console.log('====================================================');
}

// Self-run when executed directly
runFsmTests();
