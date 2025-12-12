import { SeededRandom } from '../../../utils/SeededRandom';
import { Question } from '../../../types';

export function generateVerticalMathQuestion(topicId: string, difficulty = "medium", seed: number | null = null): Question {
  const random = new SeededRandom(seed || Date.now());
  
  const isSubtraction = topicId.includes("sub");
  
  let a, b;
  
  if (difficulty === "easy") {
    // 3 digits
    a = random.int(100, 999);
    b = random.int(10, 99); 
  } else if (difficulty === "medium") {
    // 4 digits (like screenshot 2)
    a = random.int(1000, 9999);
    b = random.int(1000, 8999);
  } else {
    // 5-6 digits (like screenshot 3: 110,709)
    a = random.int(10000, 999999);
    b = random.int(10000, 99999);
  }

  // Ensure A > B for subtraction
  if (isSubtraction && b > a) { 
      const temp = a; a = b; b = temp; 
  }

  const result = isSubtraction ? a - b : a + b;
  const operator = isSubtraction ? '-' : '+';

  // Format prompt nicely
  const promptText = isSubtraction ? "Subtract." : "Add.";

  return {
    id: `VM_${topicId}_${Date.now()}`,
    skillId: topicId,
    type: 'vertical-equation',
    difficultyLevel: difficulty,
    prompt: {
      text: promptText
    },
    explanation: {
      text: `Start from the ones place on the right. ${isSubtraction ? 'Subtract' : 'Add'} the digits column by column.`,
      steps: [
        `${a} ${operator} ${b} = ${result}`
      ]
    },
    correctAnswer: result.toString(),
    verticalConfig: {
      top: a.toString(),
      bottom: b.toString(),
      operator: operator as '+' | '-'
    }
  };
}