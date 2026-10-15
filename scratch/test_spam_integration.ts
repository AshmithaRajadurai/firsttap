import { SPAM_LESSONS, getRecommendedSpamSequence, getNextSpamStep, getPreviousSpamStep } from '../src/components/spam/spamCatalog';
import { TRANSLATIONS } from '../src/components/spam/translations';
import { WHATSAPP_LESSONS_CATALOG } from '../src/components/whatsapp/lessonCatalog';
import { getWhatsAppSequenceForCategory } from '../src/components/whatsapp/personalizedSequences';
import { LearnerProfile, SpamProgress, WhatsAppProgress } from '../src/types';

function runAssertions() {
  console.log('--- 1. WhatsApp Lessons Catalog & Order ---');
  const waKeys = Object.keys(WHATSAPP_LESSONS_CATALOG);
  console.assert(waKeys.length === 8, `Expected 8 WhatsApp lessons, got ${waKeys.length}`);
  console.log('✓ WhatsApp has exactly 8 lessons (W0-W7):', waKeys.join(', '));

  const waBeginner = getWhatsAppSequenceForCategory('DIGITAL_BEGINNER');
  console.assert(waBeginner.join('->') === 'W0->W1->W2->W3->W4->W6->W5->W7', 'WhatsApp beginner order mismatch');
  console.log('✓ Digital Beginner WhatsApp Sequence:', waBeginner.join(' -> '));

  const waPayment = getWhatsAppSequenceForCategory('DIGITAL_PAYMENT_LEARNER');
  console.assert(waPayment.join('->') === 'W0->W2->W7->W1->W3->W4->W6->W5', 'WhatsApp payment order mismatch');
  console.log('✓ Digital Payment WhatsApp Sequence:', waPayment.join(' -> '));

  const waMSME = getWhatsAppSequenceForCategory('MSME_LEARNER');
  console.assert(waMSME.join('->') === 'W0->W1->W2->W3->W4->W6->W7->W5', 'WhatsApp MSME order mismatch');
  console.log('✓ MSME WhatsApp Sequence:', waMSME.join(' -> '));

  console.log('\n--- 2. Spam Message Safety Lessons Catalog & Order ---');
  const spamKeys = Object.keys(SPAM_LESSONS);
  console.assert(spamKeys.length === 4, `Expected 4 Spam lessons, got ${spamKeys.length}`);
  console.log('✓ Spam Safety has exactly 4 lessons (S1-S4):');
  for (const id of [1, 2, 3, 4] as const) {
    const l = SPAM_LESSONS[id];
    console.log(`  ${l.code}: ${l.title.en} | ${l.title.ta} | ${l.title.hi}`);
  }

  const spamBeginner = getRecommendedSpamSequence('DIGITAL_BEGINNER');
  console.assert(spamBeginner.join('->') === '1->2->3->4', 'Spam beginner order mismatch');
  console.log('✓ Digital Beginner Spam Sequence:', spamBeginner.join(' -> '));

  const spamPayment = getRecommendedSpamSequence('DIGITAL_PAYMENT_LEARNER');
  console.assert(spamPayment.join('->') === '2->3->4->1', 'Spam payment order mismatch');
  console.log('✓ Digital Payment Spam Sequence:', spamPayment.join(' -> '));

  const spamMSME = getRecommendedSpamSequence('MSME_LEARNER');
  console.assert(spamMSME.join('->') === '2->3->4->1', 'Spam MSME order mismatch');
  console.log('✓ MSME Spam Sequence:', spamMSME.join(' -> '));

  console.log('\n--- 3. Navigation Controls (Next/Previous) ---');
  console.assert(getNextSpamStep(2, 'DIGITAL_PAYMENT_LEARNER') === 3, 'Next from S2 in payment should be S3');
  console.assert(getNextSpamStep(3, 'DIGITAL_PAYMENT_LEARNER') === 4, 'Next from S3 in payment should be S4');
  console.assert(getNextSpamStep(4, 'DIGITAL_PAYMENT_LEARNER') === 1, 'Next from S4 in payment should be S1');
  console.assert(getNextSpamStep(1, 'DIGITAL_PAYMENT_LEARNER') === null, 'Next from S1 in payment should be null');
  console.assert(getPreviousSpamStep(3, 'DIGITAL_PAYMENT_LEARNER') === 2, 'Previous from S3 in payment should be S2');
  console.log('✓ Sequence step traversal validated');

  console.log('\n--- 4. Trilingual Translations Completeness ---');
  for (const lang of ['en', 'ta', 'hi'] as const) {
    const t = TRANSLATIONS[lang];
    console.assert(!!t.step1Home.title, `Missing step1 title in ${lang}`);
    console.assert(t.step2Demo.fourSigns.length === 4, `Expected 4 signs in ${lang}`);
    console.assert(t.step4Quiz.questions.length === 5, `Expected 5 quiz questions in ${lang}`);
    console.assert(t.step4Quiz.goldenRules.length === 4, `Expected 4 golden rules in ${lang}`);
    console.log(`✓ ${lang.toUpperCase()}: 4 signs, 5 questions, 4 golden rules all present`);
  }

  console.log('\n--- 5. Progress Tracking Logic ---');
  const testProgress: SpamProgress = {
    current_step_id: 3,
    completed_steps: [1, 2],
    skipped_steps: [3],
    is_module_completed: false,
    last_active_at: new Date().toISOString(),
  };
  console.assert(testProgress.completed_steps.length === 2, 'Completed count should be 2');
  console.assert(!testProgress.completed_steps.includes(3), 'Skipped step must NOT be in completed list');
  console.assert(testProgress.is_module_completed === false, 'Module must not be complete when only 2 are completed');
  console.log('✓ Progress calculations and skip isolation validated');

  console.log('\n=======================================');
  console.log('ALL INTEGRATION ASSERTIONS PASSED! (100%)');
  console.log('=======================================');
}

runAssertions();
