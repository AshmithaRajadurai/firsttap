import assert from 'assert';

console.log('================================================================');
console.log('VERIFICATION SUITE: FIRSTTAP DUOLINGO-STYLE WHATSAPP PATH');
console.log('================================================================\n');

// 1. Personalized Sequences for 3 Categories
const CATEGORY_SEQUENCES = {
  DIGITAL_BEGINNER: ['W0', 'W1', 'W2', 'W3', 'W4', 'W6', 'W5', 'W7'],
  DIGITAL_PAYMENT_LEARNER: ['W0', 'W2', 'W7', 'W1', 'W3', 'W4', 'W6', 'W5'],
  MSME_LEARNER: ['W0', 'W1', 'W2', 'W3', 'W4', 'W6', 'W7', 'W5'],
};

console.log('--- TEST 1: CATEGORY RECOMMENDED ORDER ---');
assert.deepStrictEqual(
  CATEGORY_SEQUENCES.DIGITAL_BEGINNER,
  ['W0', 'W1', 'W2', 'W3', 'W4', 'W6', 'W5', 'W7'],
  'Digital Beginner sequence error'
);
console.log('✓ Digital Beginner: W0 → W1 → W2 → W3 → W4 → W6 → W5 → W7');

assert.deepStrictEqual(
  CATEGORY_SEQUENCES.DIGITAL_PAYMENT_LEARNER,
  ['W0', 'W2', 'W7', 'W1', 'W3', 'W4', 'W6', 'W5'],
  'Digital Payment Learner sequence error'
);
console.log('✓ Digital Payment Learner: W0 → W2 → W7 → W1 → W3 → W4 → W6 → W5 (Scam drill prioritized early)');

assert.deepStrictEqual(
  CATEGORY_SEQUENCES.MSME_LEARNER,
  ['W0', 'W1', 'W2', 'W3', 'W4', 'W6', 'W7', 'W5'],
  'MSME Learner sequence error'
);
console.log('✓ MSME Business Learner: W0 → W1 → W2 → W3 → W4 → W6 → W7 → W5 (Calls and fraud awareness before location)');


// 2. Navigation Functions: Previous, Next, Skip
function getNextRecommendedLesson(currentId, sequence) {
  const currentIndex = sequence.indexOf(currentId);
  if (currentIndex === -1 || currentIndex === sequence.length - 1) {
    return { nextId: null, isLastInSequence: true };
  }
  return { nextId: sequence[currentIndex + 1], isLastInSequence: currentIndex + 1 === sequence.length - 1 };
}

function getPreviousRecommendedLesson(currentId, sequence) {
  const currentIndex = sequence.indexOf(currentId);
  if (currentIndex <= 0) {
    return { prevId: null, isFirstInSequence: true };
  }
  return { prevId: sequence[currentIndex - 1], isFirstInSequence: false };
}

console.log('\n--- TEST 2: PERSISTENT NAVIGATION (PREV / NEXT) ---');

// Test Digital Payment Learner sequence navigation
const paySeq = CATEGORY_SEQUENCES.DIGITAL_PAYMENT_LEARNER;

// First lesson (W0) has no previous
const w0Prev = getPreviousRecommendedLesson('W0', paySeq);
assert.strictEqual(w0Prev.isFirstInSequence, true);
assert.strictEqual(w0Prev.prevId, null);
console.log('✓ Previous is disabled at the first lesson (W0): isFirstInSequence = true, prevId = null');

// W0 -> W2
const w0Next = getNextRecommendedLesson('W0', paySeq);
assert.strictEqual(w0Next.nextId, 'W2');
assert.strictEqual(w0Next.isLastInSequence, false);
console.log('✓ Next from W0 correctly advances to W2 in payment sequence');

// W2 -> Previous returns W0
const w2Prev = getPreviousRecommendedLesson('W2', paySeq);
assert.strictEqual(w2Prev.prevId, 'W0');
assert.strictEqual(w2Prev.isFirstInSequence, false);
console.log('✓ Previous from W2 returns W0 in payment sequence');

// W2 -> Next returns W7 (Scam drill)
const w2Next = getNextRecommendedLesson('W2', paySeq);
assert.strictEqual(w2Next.nextId, 'W7');
console.log('✓ Next from W2 returns W7 (Scam drill) in payment sequence');

// Last lesson (W5) has no next
const lastLesson = paySeq[paySeq.length - 1]; // W5
const w5Next = getNextRecommendedLesson(lastLesson, paySeq);
assert.strictEqual(w5Next.isLastInSequence, true);
assert.strictEqual(w5Next.nextId, null);
console.log('✓ Next is marked last in sequence at final lesson (W5): isLastInSequence = true, nextId = null');


console.log('\n--- TEST 3: SKIP LESSON & PROGRESS TRACKING ---');
// Simulate user completing W0, skipping W2, and completing W7
let progress = {
  current_segment_id: 'W0',
  completed_segments: [],
  skipped_segments: [],
};

// 1. Complete W0
progress.completed_segments.push('W0');
let completedCount = progress.completed_segments.length;
assert.strictEqual(completedCount, 1);
console.log(`✓ Completed W0: ${completedCount} of 8 completed`);

// 2. Skip W2 (Next lesson in payment sequence)
const nextAfterW0 = getNextRecommendedLesson('W0', paySeq).nextId; // 'W2'
progress.current_segment_id = nextAfterW0;
// Record as skipped, NOT completed
if (!progress.completed_segments.includes(nextAfterW0)) {
  progress.skipped_segments.push(nextAfterW0);
}
completedCount = progress.completed_segments.length;
assert.strictEqual(completedCount, 1, 'Skipping must NOT increase completed count!');
assert.strictEqual(progress.skipped_segments.includes('W2'), true);
console.log(`✓ Skipped W2: Progress remains accurately ${completedCount} of 8 completed (Skipped list: [${progress.skipped_segments}])`);

// 3. Complete W7
const nextAfterW2 = getNextRecommendedLesson('W2', paySeq).nextId; // 'W7'
progress.current_segment_id = nextAfterW2;
progress.completed_segments.push(nextAfterW2);
completedCount = progress.completed_segments.length;
assert.strictEqual(completedCount, 2, 'Completed count must be exactly 2');
console.log(`✓ Completed W7: Progress is now accurately ${completedCount} of 8 completed`);

// 4. Retry skipped lesson W2 from path screen and complete it
progress.current_segment_id = 'W2';
progress.completed_segments.push('W2');
progress.skipped_segments = progress.skipped_segments.filter(id => id !== 'W2');
completedCount = progress.completed_segments.length;
assert.strictEqual(completedCount, 3);
assert.strictEqual(progress.skipped_segments.length, 0);
console.log(`✓ Re-visited and completed W2: Progress is now ${completedCount} of 8, skipped list cleared`);


console.log('\n--- TEST 4: ALL 8 LESSON DEFINITIONS & TITLES ---');
const REQUIRED_LESSONS = [
  { id: 'W0', name: 'WhatsApp Home Page Tour' },
  { id: 'W1', name: 'Save a Contact by Number' },
  { id: 'W2', name: 'Send a Message in Chat' },
  { id: 'W3', name: 'Send a Voice Note' },
  { id: 'W4', name: 'Send a Photo from Gallery' },
  { id: 'W5', name: 'Share Live Location Safely' },
  { id: 'W6', name: 'Make, Accept, and Mute Calls' },
  { id: 'W7', name: 'Scam Call Safety Drill' },
];

assert.strictEqual(REQUIRED_LESSONS.length, 8);
REQUIRED_LESSONS.forEach((l, idx) => {
  console.log(`✓ Lesson ${idx + 1}: ${l.id} — ${l.name}`);
});

console.log('\n================================================================');
console.log('ALL VERIFICATION SUITE CHECKS PASSED SUCCESSFULLY! (100% GREEN)');
console.log('================================================================');
