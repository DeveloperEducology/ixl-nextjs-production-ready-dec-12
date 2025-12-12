import { SeededRandom } from '../../../utils/SeededRandom';
import { Question } from '../../../types';

function fillBlankTemplate({
  topicId,
  prompt,
  stimulus,
  blanks,
  expectedAnswers,
  difficulty,
}: any): Question {
  return {
    id: `FIB_${topicId}_${Date.now()}`,
    skillId: topicId,
    type: 'fill_blank',
    prompt: { text: prompt },
    content: {
      prompt,
      instructions: 'Fill each blank with the correct number.',
      stimulus,
      blanks,
    },
    answerConfig: {
      expectedAnswers,
    },
    explanation: {
        text: "Notice how the answer grows by adding a zero each time? That's the power of 10! When you multiply by 10, the digit moves one place to the left."
    }
  } as Question;
}

function formatNumber(n: number) {
  return n.toLocaleString('en-US');
}

function genPatternMultiplication(
  random: SeededRandom,
  difficulty: string,
  topicId: string
) {
  // 1. Randomize the Multiplier Base (2 to 9)
  // Previously hardcoded to 4. Now it could be 3, 6, 8, etc.
  const multiplierBase = random.int(2, 9);
  
  // 2. Generate the sequence: [3, 30, 300, 3000]
  const multipliers = [
    multiplierBase, 
    multiplierBase * 10, 
    multiplierBase * 100, 
    multiplierBase * 1000
  ];
  
  // 3. Randomize the User's Answer (The "Base")
  // easy: single digit answer (e.g., 5 x 40)
  // medium: larger single digit or small double
  let base: number; 
  if (difficulty === 'easy') {
      base = random.int(2, 5);
  } else {
      // Avoid picking the same number as the multiplierBase to prevent confusion
      do {
        base = random.int(3, 9);
      } while (base === multiplierBase);
  }

  const answers = multipliers.map((m) => base * m);

  // 4. Build the text pattern
  const stimulusText = multipliers
    .map((m, idx) => `[blank${idx + 1}] × ${formatNumber(m)} = ${formatNumber(answers[idx])}`)
    .join('\n');

  // 5. Define expected answers
  const expectedAnswers = multipliers.map((_, idx) => ({
    id: `blank${idx + 1}`,
    value: base, 
  }));

  const blanks = multipliers.map((_, idx) => ({
    id: `blank${idx + 1}`,
    position: idx,
    length: String(base).length, // Adjust input width to fit the answer
  }));

  return fillBlankTemplate({
    topicId,
    prompt: 'Complete the pattern:',
    stimulus: {
      type: 'text',
      content: stimulusText,
    },
    blanks,
    expectedAnswers,
    difficulty,
  });
}

export function generatePatternMultiplicationQuestion(
  topicId: string = 'mul-pattern-powers',
  difficulty: string = 'medium',
  seed: number | null = null
): Question {
  const random = new SeededRandom(seed ?? Date.now());
  return genPatternMultiplication(random, difficulty, topicId);
}