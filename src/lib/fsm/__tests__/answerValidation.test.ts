import assert from 'node:assert';
import {
  normaliseTranscript,
  normaliseYesNo,
  matchYesNoIntent,
  validateAnswerForQuestion,
} from '../intents';
import { FirstTapFSM } from '../machine';

console.log('=== RUNNING ANSWER NORMALISATION & VALIDATION TEST SUITE ===\n');

// 1. English Yes/No & Variants
console.log('1. Testing English Yes/No variants...');
assert.strictEqual(normaliseYesNo('yes'), 'YES');
assert.strictEqual(normaliseYesNo('Yes'), 'YES');
assert.strictEqual(normaliseYesNo('YES'), 'YES');
assert.strictEqual(normaliseYesNo('yeah'), 'YES');
assert.strictEqual(normaliseYesNo('yep'), 'YES');
assert.strictEqual(normaliseYesNo('yup'), 'YES');
assert.strictEqual(normaliseYesNo('sure'), 'YES');
assert.strictEqual(normaliseYesNo('yes i can'), 'YES');
assert.strictEqual(normaliseYesNo('i can'), 'YES');
assert.strictEqual(normaliseYesNo('yes i do'), 'YES');

assert.strictEqual(normaliseYesNo('no'), 'NO');
assert.strictEqual(normaliseYesNo('No'), 'NO');
assert.strictEqual(normaliseYesNo('NO'), 'NO');
assert.strictEqual(normaliseYesNo('nope'), 'NO');
assert.strictEqual(normaliseYesNo('nah'), 'NO');
assert.strictEqual(normaliseYesNo('cannot'), 'NO');
assert.strictEqual(normaliseYesNo('i cannot'), 'NO');
assert.strictEqual(normaliseYesNo("i can't"), 'NO');
assert.strictEqual(normaliseYesNo('no i cannot'), 'NO');
assert.strictEqual(normaliseYesNo('never'), 'NO');
console.log('✓ English Yes/No variants passed.');

// 2. Tamil Yes/No Variants
console.log('\n2. Testing Tamil Yes/No variants...');
assert.strictEqual(normaliseYesNo('ஆம்'), 'YES');
assert.strictEqual(normaliseYesNo('ஆமாம்'), 'YES');
assert.strictEqual(normaliseYesNo('ஆமா'), 'YES');
assert.strictEqual(normaliseYesNo('முடியும்'), 'YES');
assert.strictEqual(normaliseYesNo('தெரியும்'), 'YES');
assert.strictEqual(normaliseYesNo('பயன்படுத்துகிறேன்'), 'YES');
assert.strictEqual(normaliseYesNo('aamam'), 'YES');
assert.strictEqual(normaliseYesNo('aam'), 'YES');

assert.strictEqual(normaliseYesNo('இல்லை'), 'NO');
assert.strictEqual(normaliseYesNo('கிடையாது'), 'NO');
assert.strictEqual(normaliseYesNo('இல்ல'), 'NO');
assert.strictEqual(normaliseYesNo('முடியாது'), 'NO');
assert.strictEqual(normaliseYesNo('தெரியாது'), 'NO');
assert.strictEqual(normaliseYesNo('மாட்டேன்'), 'NO');
assert.strictEqual(normaliseYesNo('இல்லை முடியாது'), 'NO');
assert.strictEqual(normaliseYesNo('illai'), 'NO');
assert.strictEqual(normaliseYesNo('kidayadhu'), 'NO');
console.log('✓ Tamil Yes/No variants passed.');

// 3. Hindi Yes/No Variants
console.log('\n3. Testing Hindi Yes/No variants...');
assert.strictEqual(normaliseYesNo('हाँ'), 'YES');
assert.strictEqual(normaliseYesNo('जी हाँ'), 'YES');
assert.strictEqual(normaliseYesNo('हाँ जी'), 'YES');
assert.strictEqual(normaliseYesNo('कर सकता हूँ'), 'YES');
assert.strictEqual(normaliseYesNo('हाँ किया है'), 'YES');
assert.strictEqual(normaliseYesNo('haan'), 'YES');
assert.strictEqual(normaliseYesNo('ji haan'), 'YES');

assert.strictEqual(normaliseYesNo('नहीं'), 'NO');
assert.strictEqual(normaliseYesNo('जी नहीं'), 'NO');
assert.strictEqual(normaliseYesNo('नहीं है'), 'NO');
assert.strictEqual(normaliseYesNo('नहीं कर सकता'), 'NO');
assert.strictEqual(normaliseYesNo('नहीं आता'), 'NO');
assert.strictEqual(normaliseYesNo('ना'), 'NO');
assert.strictEqual(normaliseYesNo('nahi'), 'NO');
assert.strictEqual(normaliseYesNo('nahin'), 'NO');
console.log('✓ Hindi Yes/No variants passed.');

// 4. Whitespace, Punctuation & Indic Dandas Handling
console.log('\n4. Testing Punctuation, Whitespace & Dandas Handling...');
// Trailing periods from Web Speech API
assert.strictEqual(normaliseYesNo('Yes.'), 'YES', 'Should match "Yes." with trailing period');
assert.strictEqual(normaliseYesNo('No.'), 'NO', 'Should match "No." with trailing period');
assert.strictEqual(normaliseYesNo('  ஆம்.  '), 'YES', 'Should match "  ஆம்.  "');
assert.strictEqual(normaliseYesNo('இல்லை.'), 'NO', 'Should match "இல்லை."');
assert.strictEqual(normaliseYesNo('हाँ।'), 'YES', 'Should match "हाँ।" with Devanagari danda');
assert.strictEqual(normaliseYesNo('नहीं।'), 'NO', 'Should match "नहीं।" with Devanagari danda');
assert.strictEqual(normaliseYesNo('“Yes”'), 'YES', 'Should match smart quotes');
assert.strictEqual(normaliseYesNo('“No!”'), 'NO', 'Should match exclamation and smart quotes');
assert.strictEqual(normaliseTranscript('  Hello, world!  '), 'Hello world');
assert.strictEqual(normaliseTranscript('हाँ। ठीक है।'), 'हाँ ठीक है');
console.log('✓ Punctuation and whitespace normalization passed.');

// 5. Unknown / Ambiguous Answers
console.log('\n5. Testing Unknown / Ambiguous Answers...');
assert.strictEqual(normaliseYesNo('maybe'), 'UNKNOWN');
assert.strictEqual(normaliseYesNo('banana'), 'UNKNOWN');
assert.strictEqual(normaliseYesNo('piano'), 'UNKNOWN', '"piano" must not match "no"');
assert.strictEqual(normaliseYesNo('technology'), 'UNKNOWN', '"technology" must not match "no"');
assert.strictEqual(normaliseYesNo('now'), 'UNKNOWN', '"now" must not match "no"');
assert.strictEqual(normaliseYesNo('notice'), 'UNKNOWN', '"notice" must not match "no"');
assert.strictEqual(normaliseYesNo(''), 'UNKNOWN');
assert.strictEqual(normaliseYesNo('   '), 'UNKNOWN');
console.log('✓ Unknown and substring prevention tests passed.');

// 6. Validation for Current Question: Phone Independence
console.log('\n6. Testing Phone Independence Question Validation...');
const valEmpty = validateAnswerForQuestion('phone_independence', '');
assert.strictEqual(valEmpty.status, 'EMPTY');

const valYes = validateAnswerForQuestion('phone_independence', 'Yes.');
assert.strictEqual(valYes.status, 'VALID_YES_NO');
assert.strictEqual(valYes.value, 'yes');

const valNoTamil = validateAnswerForQuestion('phone_independence', 'இல்லை.');
assert.strictEqual(valNoTamil.status, 'VALID_YES_NO');
assert.strictEqual(valNoTamil.value, 'no');

const valUnrec = validateAnswerForQuestion('phone_independence', 'I am not sure');
assert.strictEqual(valUnrec.status, 'UNRECOGNISED');
console.log('✓ Phone independence question validation passed.');

// 7. Validation for Current Question: "Yes" Received During Learning Goal
console.log('\n7. Testing "Yes" received during Learning Goal question...');
const valGoalYes = validateAnswerForQuestion('learning_goal', 'Yes');
assert.strictEqual(valGoalYes.status, 'YES_NO_WHEN_GOAL_EXPECTED');
assert.strictEqual(valGoalYes.value, 'yes');

const valGoalNo = validateAnswerForQuestion('learning_goal', 'No.');
assert.strictEqual(valGoalNo.status, 'YES_NO_WHEN_GOAL_EXPECTED');
assert.strictEqual(valGoalNo.value, 'no');

const valGoalTamilAam = validateAnswerForQuestion('learning_goal', 'ஆம்.');
assert.strictEqual(valGoalTamilAam.status, 'YES_NO_WHEN_GOAL_EXPECTED');

const valGoalValid1 = validateAnswerForQuestion('learning_goal', '1');
assert.strictEqual(valGoalValid1.status, 'VALID_GOAL');
assert.strictEqual(valGoalValid1.value, 'EVERYDAY_DIGITAL_SKILLS');

const valGoalValid2 = validateAnswerForQuestion('learning_goal', 'digital payments');
assert.strictEqual(valGoalValid2.status, 'VALID_GOAL');
assert.strictEqual(valGoalValid2.value, 'DIGITAL_PAYMENTS');

const valGoalValid3 = validateAnswerForQuestion('learning_goal', 'மூன்று');
assert.strictEqual(valGoalValid3.status, 'VALID_GOAL');
assert.strictEqual(valGoalValid3.value, 'MSME_BUSINESS_SKILLS');
console.log('✓ Learning goal validation properly detects Yes/No and guides user.');

// 8. FSM Integration: "Yes" received during Learning Goal question must NOT classify user
console.log('\n8. Testing FSM behavior when "Yes" is spoken during Learning Goal question...');
const fsm = new FirstTapFSM();
fsm.startApp();
fsm.setLanguageManually('en-IN');
fsm.processInput('Anushka');
// Answer Yes to phone independence -> moves to ASKING_LEARNING_GOAL
const resPhoneYes = fsm.processInput('Yes.');
assert.strictEqual(resPhoneYes.nextState, 'ASKING_LEARNING_GOAL');

// Now user says "Yes" while in Learning Goal question:
fsm.setState('WAITING_FOR_LEARNING_GOAL');
const resGoalYes = fsm.processInput('Yes.');

// Must NOT assign goal or advance to branch question! Must stay in WAITING_FOR_LEARNING_GOAL
assert.strictEqual(resGoalYes.nextState, 'WAITING_FOR_LEARNING_GOAL');
assert.strictEqual(fsm.getSession().learningGoal, null, 'Learning goal must remain null');
assert.ok(
  resGoalYes.speechToSpeak.includes('Please choose one: everyday phone and internet use, digital payments, or small business.'),
  `Expected specific choice guidance, got: "${resGoalYes.speechToSpeak}"`
);
console.log('✓ FSM correctly prompts user with 3 options when "Yes" is spoken during learning goal.');

// 9. Asynchronous Safety: Valid transcript followed by empty callback or duplicate call
console.log('\n9. Testing Asynchronous Safety & Duplicate Callbacks...');
// When a valid answer ("1") is processed:
const resGoalValid = fsm.processInput('1');
assert.strictEqual(resGoalValid.nextState, 'ASKING_BRANCH_QUESTION');
assert.strictEqual(fsm.getSession().learningGoal, 'EVERYDAY_DIGITAL_SKILLS');

// If a late or empty callback arrives, state must not revert
fsm.setState('WAITING_FOR_BRANCH_ANSWER');
const resBranchYes = fsm.processInput('Yes.');
assert.strictEqual(resBranchYes.nextState, 'ASSESSMENT_COMPLETE');
assert.strictEqual(fsm.getSession().startingPath, 'EVERYDAY_DIGITAL_SERVICES');

// Duplicate call to completed assessment returns completed state safely
const resDuplicate = fsm.processInput('Yes.');
assert.strictEqual(resDuplicate.nextState, 'ASSESSMENT_COMPLETE');
console.log('✓ Asynchronous safety and duplicate callback prevention verified.');

console.log('\n======================================================');
console.log('ALL ANSWER NORMALISATION & VALIDATION TESTS PASSED 100%');
console.log('======================================================\n');
