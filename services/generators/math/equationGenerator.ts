import { SeededRandom } from '../../../utils/SeededRandom';
import { Question } from '../../../types';

export function generateEquationQuestion(topicId: string, difficulty = "medium", seed: number | null = null): Question {
  const random = new SeededRandom(seed || Date.now());

  // Generate random coefficients for format: ax + b = c
  const x = random.int(1, 15); // The solution
  const a = random.int(2, 9);  // Coefficient
  const b = random.int(1, 20); // Constant
  const c = (a * x) + b;       // Result

  return {
    id: `EQ_${Date.now()}`,
    skillId: topicId,
    type: 'equation',
    difficultyLevel: difficulty,
    prompt: {
      text: `Solve for x:\n${a}x + ${b} = ${c}`
    },
    explanation: {
      text: `Subtract ${b} from both sides, then divide by ${a}.`,
      steps: [
        `${a}x = ${c - b}`,
        `x = ${x}`
      ]
    },
    correctAnswer: x.toString(),
    acceptableAnswers: [
      x.toString(),
      `x=${x}`,
      `x = ${x}`
    ]
  };
}