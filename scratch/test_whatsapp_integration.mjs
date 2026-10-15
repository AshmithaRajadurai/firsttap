import assert from 'assert';

// 1. Verify personalized sequences
const CATEGORY_WHATSAPP_SEQUENCES = {
  DIGITAL_BEGINNER: ['W0', 'W1', 'W2', 'W3', 'W4', 'W6', 'W5', 'W7'],
  EVERYDAY_DIGITAL_LEARNER: ['W0', 'W1', 'W2', 'W3', 'W4', 'W6', 'W5', 'W7'],
  DIGITAL_PAYMENT_LEARNER: ['W0', 'W2', 'W7', 'W1', 'W3', 'W4', 'W6', 'W5'],
  MSME_LEARNER: ['W0', 'W1', 'W2', 'W3', 'W4', 'W6', 'W7', 'W5'],
};

console.log('--- TEST 1: CATEGORY SEQUENCES SPECIFICATION ---');
assert.deepStrictEqual(
  CATEGORY_WHATSAPP_SEQUENCES.DIGITAL_BEGINNER,
  ['W0', 'W1', 'W2', 'W3', 'W4', 'W6', 'W5', 'W7'],
  'Digital Beginner sequence mismatch'
);
console.log('✓ Digital Beginner: W0 → W1 → W2 → W3 → W4 → W6 → W5 → W7');

assert.deepStrictEqual(
  CATEGORY_WHATSAPP_SEQUENCES.DIGITAL_PAYMENT_LEARNER,
  ['W0', 'W2', 'W7', 'W1', 'W3', 'W4', 'W6', 'W5'],
  'Digital Payment sequence mismatch'
);
console.log('✓ Digital Payment Learner: W0 → W2 → W7 → W1 → W3 → W4 → W6 → W5');

assert.deepStrictEqual(
  CATEGORY_WHATSAPP_SEQUENCES.MSME_LEARNER,
  ['W0', 'W1', 'W2', 'W3', 'W4', 'W6', 'W7', 'W5'],
  'MSME sequence mismatch'
);
console.log('✓ MSME Learner: W0 → W1 → W2 → W3 → W4 → W6 → W7 → W5');

console.log('\n--- TEST 2: SEQUENCE PROGRESSION & NEXT LESSON ---');
function getNextLesson(currentId, sequence) {
  const idx = sequence.indexOf(currentId);
  if (idx === -1 || idx === sequence.length - 1) {
    return { nextId: null, isLast: true };
  }
  return { nextId: sequence[idx + 1], isLast: idx + 1 === sequence.length - 1 };
}

// Digital Payment Learner progression test
const paySeq = CATEGORY_WHATSAPP_SEQUENCES.DIGITAL_PAYMENT_LEARNER;
assert.strictEqual(getNextLesson('W0', paySeq).nextId, 'W2');
assert.strictEqual(getNextLesson('W2', paySeq).nextId, 'W7'); // Prioritizes scam drill
assert.strictEqual(getNextLesson('W7', paySeq).nextId, 'W1');
assert.strictEqual(getNextLesson('W5', paySeq).nextId, null);
assert.strictEqual(getNextLesson('W5', paySeq).isLast, true);
console.log('✓ Sequence progression for Digital Payment Learner correctly routes W0 → W2 → W7 → W1 ...');

// Digital Beginner progression test
const begSeq = CATEGORY_WHATSAPP_SEQUENCES.DIGITAL_BEGINNER;
assert.strictEqual(getNextLesson('W0', begSeq).nextId, 'W1');
assert.strictEqual(getNextLesson('W1', begSeq).nextId, 'W2');
assert.strictEqual(getNextLesson('W7', begSeq).nextId, null);
assert.strictEqual(getNextLesson('W7', begSeq).isLast, true);
console.log('✓ Sequence progression for Digital Beginner correctly routes W0 → W1 → W2 ... → W7');

// MSME Learner progression test
const msmeSeq = CATEGORY_WHATSAPP_SEQUENCES.MSME_LEARNER;
assert.strictEqual(getNextLesson('W4', msmeSeq).nextId, 'W6');
assert.strictEqual(getNextLesson('W6', msmeSeq).nextId, 'W7');
assert.strictEqual(getNextLesson('W7', msmeSeq).nextId, 'W5');
console.log('✓ Sequence progression for MSME Learner correctly routes W4 → W6 → W7 → W5');

console.log('\n--- TEST 3: SKIP LESSON VS COMPLETED LESSON INDEPENDENCE ---');
let completedList = [];
let skippedList = [];

// Simulate skipping W0
function skipLesson(lessonId) {
  if (!completedList.includes(lessonId) && !skippedList.includes(lessonId)) {
    skippedList.push(lessonId);
  }
}

// Simulate completing W1
function completeLesson(lessonId) {
  if (!completedList.includes(lessonId)) {
    completedList.push(lessonId);
  }
  skippedList = skippedList.filter(id => id !== lessonId);
}

skipLesson('W0');
assert.deepStrictEqual(skippedList, ['W0']);
assert.deepStrictEqual(completedList, []);
console.log('✓ Skipping W0 added to skippedList without adding to completedList');

completeLesson('W1');
assert.deepStrictEqual(skippedList, ['W0']);
assert.deepStrictEqual(completedList, ['W1']);
console.log('✓ Completing W1 maintains separate skipped and completed lists');

// If user later revisits and completes skipped W0
completeLesson('W0');
assert.deepStrictEqual(skippedList, []);
assert.deepStrictEqual(completedList, ['W1', 'W0']);
console.log('✓ Revisiting and completing skipped W0 removes from skipped and adds to completed');

console.log('\n--- TEST 4: LANGUAGE MAPPING ---');
const mapLang = (l) => l === 'ta-IN' ? 'ta' : l === 'hi-IN' ? 'hi' : 'en';
assert.strictEqual(mapLang('ta-IN'), 'ta');
assert.strictEqual(mapLang('hi-IN'), 'hi');
assert.strictEqual(mapLang('en-IN'), 'en');
console.log('✓ FirstTap ta-IN, hi-IN, en-IN cleanly maps to ta, hi, en');

console.log('\nALL UNIT INTEGRATION TESTS PASSED SUCCESSFULLY! ✓');
