import { SeededRandom } from '../../../utils/SeededRandom'; // Adjusted path for generators/math/
import { Question } from '../../../types';

// --- Helper: Safe Array Choice ---
// Use this instead of random.choice() to avoid errors if your utility lacks it
function pickRandom<T>(random: SeededRandom, arr: T[]): T {
  if (!arr || arr.length === 0) return undefined as any;
  const idx = random.int(0, arr.length - 1);
  return arr[idx];
}

// ----------------------------------------------------------------------
// 1. SHARED TEMPLATE BUILDER
// ----------------------------------------------------------------------
function fillBlankTemplate({
  topicId,
  prompt,
  stimulusText,
  blanks,
  expectedAnswers,
  difficulty,
  explanationText
}: any): Question {
  return {
    id: `FIB_${topicId}_${Date.now()}`,
    skillId: topicId,
    type: 'fill_blank',
    difficultyLevel: difficulty,
    prompt: { text: prompt },
    content: {
      prompt,
      instructions: 'Fill in the missing values.',
      stimulus: {
        type: 'text',
        content: stimulusText || "Missing content", // Fallback to prevent null
      },
      blanks: blanks || [],
    },
    answerConfig: {
      expectedAnswers: expectedAnswers || [],
    },
    explanation: {
      text: explanationText || "Review the pattern to find the missing value."
    }
  } as Question;
}

// ----------------------------------------------------------------------
// 2. GENERATOR: MATH PATTERNS
// ----------------------------------------------------------------------
function genMathPattern(random: SeededRandom, difficulty: string, topicId: string) {
  const start = random.int(1, 20);
  const step = random.int(2, 10);
  const length = 5; 
  
  const sequence = Array.from({ length }, (_, i) => start + (i * step));

  const hiddenIndices = difficulty === 'easy' 
    ? [random.int(1, length - 1)] 
    : [random.int(1, 2), random.int(3, 4)];

  let blankCounter = 1;
  const stimulusParts = sequence.map((val, idx) => {
    if (hiddenIndices.includes(idx)) {
      const tag = `[blank${blankCounter}]`;
      blankCounter++;
      return tag;
    }
    return val;
  });
  const stimulusText = stimulusParts.join(', ');

  blankCounter = 1;
  const expectedAnswers = [];
  const blanks = [];
  
  for (let idx = 0; idx < sequence.length; idx++) {
    if (hiddenIndices.includes(idx)) {
      const id = `blank${blankCounter}`;
      expectedAnswers.push({ id, value: sequence[idx] });
      blanks.push({ id, position: idx, length: String(sequence[idx]).length });
      blankCounter++;
    }
  }

  return fillBlankTemplate({
    topicId,
    prompt: "Complete the number pattern:",
    stimulusText,
    blanks,
    expectedAnswers,
    difficulty,
    explanationText: `The pattern increases by ${step} each time.`
  });
}

// ----------------------------------------------------------------------
// 3. GENERATOR: EQUATION BLANKS
// ----------------------------------------------------------------------
function genEquationBlank(random: SeededRandom, difficulty: string, topicId: string) {
  const a = random.int(1, 20);
  const b = random.int(1, 20);
  const sum = a + b;

  const type = random.int(0, 2); // 0, 1, or 2

  let stimulusText = "";
  let answerVal = 0;

  if (type === 0) {
    stimulusText = `${a} + [blank1] = ${sum}`;
    answerVal = b;
  } else if (type === 1) {
    stimulusText = `[blank1] + ${b} = ${sum}`;
    answerVal = a;
  } else {
    stimulusText = `${a} + ${b} = [blank1]`;
    answerVal = sum;
  }

  return fillBlankTemplate({
    topicId,
    prompt: "Fill in the missing number:",
    stimulusText,
    blanks: [{ id: "blank1", length: String(answerVal).length }],
    expectedAnswers: [{ id: "blank1", value: answerVal }],
    difficulty,
    explanationText: `Subtract the known part from the total to find the missing part.`
  });
}

// ----------------------------------------------------------------------
// 4. GENERATOR: WORD PROBLEM
// ----------------------------------------------------------------------
function genWordProblem(random: SeededRandom, difficulty: string, topicId: string) {
  const names = ["Alex", "Sam", "Jordan", "Taylor", "Casey"];
  const items = ["apples", "books", "pencils", "coins", "stars"];
  
  // Use safe picker instead of random.choice
  const name = pickRandom(random, names);
  const item = pickRandom(random, items);
  
  const start = random.int(5, 15);
  const add = random.int(3, 10);
  const total = start + add;

  const stimulusText = `${name} had ${start} ${item}.\nThen ${name} bought ${add} more.\nNow ${name} has [blank1] ${item}.`;

  return fillBlankTemplate({
    topicId,
    prompt: "Solve the word problem:",
    stimulusText,
    blanks: [{ id: "blank1", length: String(total).length }],
    expectedAnswers: [{ id: "blank1", value: total }],
    difficulty,
    explanationText: `Start with ${start} and add ${add} to get ${total}.`
  });
}

// ----------------------------------------------------------------------
// 5. GENERATOR: SENTENCE COMPLETION
// ----------------------------------------------------------------------
function genSentenceCompletion(random: SeededRandom, difficulty: string, topicId: string) {
  const pairs = [
    { word: "hot", opposite: "cold" },
    { word: "up", opposite: "down" },
    { word: "fast", opposite: "slow" },
    { word: "happy", opposite: "sad" },
    { word: "day", opposite: "night" }
  ];

  const pair = pickRandom(random, pairs);

  const stimulusText = `The opposite of ${pair.word} is [blank1].`;

  return fillBlankTemplate({
    topicId,
    prompt: "Complete the sentence:",
    stimulusText,
    blanks: [{ id: "blank1", length: pair.opposite.length + 2 }],
    // Note: QuizClient needs update to validate strings if you use this!
    expectedAnswers: [{ id: "blank1", value: pair.opposite }], 
    difficulty,
    explanationText: `${pair.opposite} is the antonym of ${pair.word}.`
  });
}

// ----------------------------------------------------------------------
// MAIN EXPORT
// ----------------------------------------------------------------------
export function generateFillBlankQuestion(
  topicId: string, 
  difficulty: string = "medium", 
  seed: number | null = null
): Question {
  const random = new SeededRandom(seed || Date.now());

  switch (topicId) {
    case "fib-math-pattern":
      return genMathPattern(random, difficulty, topicId);
      
    case "fib-equation":
      return genEquationBlank(random, difficulty, topicId);
      
    case "fib-word-problem":
      return genWordProblem(random, difficulty, topicId);
      
    case "fib-sentence":
      return genSentenceCompletion(random, difficulty, topicId);
      
    default:
      // Fallback prevents "null" return if ID is wrong
      console.warn(`Unknown topicId: ${topicId}, falling back to math pattern.`);
      return genMathPattern(random, difficulty, topicId);
  }
}