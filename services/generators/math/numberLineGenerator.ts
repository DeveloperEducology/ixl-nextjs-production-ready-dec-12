import { SeededRandom } from '../../../utils/SeededRandom';
import { Question } from '../../../types';

// --- Helper: Generate Integer Question (0 to 100) ---
function genFindInteger(random: SeededRandom, difficulty: string, topicId: string): Question {
  let min, max, step;

  // Configure difficulty ranges
  if (difficulty === "easy") {
    min = 0; max = 10; step = 1;
  } else if (difficulty === "medium") {
    min = 10; max = 50; step = 1; // Random start point e.g., 20 to 30
  } else {
    min = 0; max = 100; step = 2; // Harder steps
  }

  // Pick a random target
  const target = random.int(min + 1, max - 1); 
  
  // Calculate labels (e.g., show labels every 5 or 10 units)
  const labelStep = (max - min) <= 20 ? 5 : 10;
  const labels = [];
  for (let i = min; i <= max; i += step) {
    if (i % labelStep === 0 || i === min || i === max) labels.push(i);
  }

  return {
    id: `NL_${topicId}_${Date.now()}`,
    skillId: topicId,
    type: 'number-line',
    difficultyLevel: difficulty,
    prompt: {
      text: `Locate the number ${target} on the number line.`
    },
    explanation: {
      text: `The number ${target} is between ${Math.floor(target/10)*10} and ${Math.ceil(target/10)*10}.`
    },
    numberLineConfig: {
      min,
      max,
      step,
      correctValue: target,
      labels
    }
  };
}

// --- Helper: Generate Decimal Question (0.0 to 1.0) ---
function genFindDecimal(random: SeededRandom, difficulty: string, topicId: string): Question {
  const min = 0;
  const max = 2; // Small range for decimals
  const step = 0.1; // Snap to 0.1
  
  // Pick random target like 0.4, 1.2
  // random.int(1, 19) gives 1 to 19, divide by 10 to get 0.1 to 1.9
  const rawTarget = random.int(1, (max * 10) - 1);
  const target = rawTarget / 10;

  return {
    id: `NL_${topicId}_${Date.now()}`,
    skillId: topicId,
    type: 'number-line',
    difficultyLevel: difficulty,
    prompt: {
      text: `Find ${target} on the number line.`
    },
    explanation: {
      text: `${target} represents ${rawTarget} tenths.`
    },
    numberLineConfig: {
      min,
      max,
      step,
      correctValue: target,
      labels: [0, 0.5, 1, 1.5, 2] // Major markers
    }
  };
}

// --- Main Export ---
export function generateNumberLineQuestion(topicId: string, difficulty = "medium", seed: number | null = null): Question {
  const random = new SeededRandom(seed || Date.now());

  if (topicId === 'nl-decimals') {
    return genFindDecimal(random, difficulty, topicId);
  }
  
  // Default to Integers
  return genFindInteger(random, difficulty, topicId);
}