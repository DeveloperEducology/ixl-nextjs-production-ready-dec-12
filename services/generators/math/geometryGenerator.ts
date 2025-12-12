import { SeededRandom } from '../../../utils/SeededRandom';
import { Question } from '../../../types';

// --- Helper: Get a safe coordinate that isn't too close to the edge ---
function getSafeCoord(random: SeededRandom, range: number): number {
  // Avoid 0 to make quadrants clear, keep within range - 1 to avoid edge clipping
  let n = random.int(-(range - 2), range - 2);
  return n === 0 ? 1 : n;
}

// --- Generator 1: Simple Point Plotting ---
function genPlotPoints(random: SeededRandom, difficulty: string, topicId: string): Question {
  const limit = difficulty === 'hard' ? 15 : 10;
  // Generate 2 random points
  const p1 = { x: getSafeCoord(random, limit), y: getSafeCoord(random, limit) };
  const p2 = { x: getSafeCoord(random, limit), y: getSafeCoord(random, limit) };

  return {
    id: `GEO_${topicId}_${Date.now()}`,
    skillId: topicId,
    type: 'graphing',
    difficultyLevel: difficulty,
    prompt: {
      text: `Plot the following points on the coordinate plane: (${p1.x}, ${p1.y}) and (${p2.x}, ${p2.y}).`
    },
    explanation: {
      text: `For (${p1.x}, ${p1.y}), start at the origin. Move ${Math.abs(p1.x)} units ${p1.x > 0 ? 'right' : 'left'} and ${Math.abs(p1.y)} units ${p1.y > 0 ? 'up' : 'down'}. Repeat for the second point.`
    },
    graphConfig: {
      xRange: [-limit, limit],
      yRange: [-limit, limit],
      gridStep: 1,
      targetType: 'point',
      correctPoints: [p1, p2]
    }
  };
}

// --- Generator 2: Reflection over Axis ---
function genReflection(random: SeededRandom, difficulty: string, topicId: string): Question {
  const limit = 10;
  const start = { x: getSafeCoord(random, limit), y: getSafeCoord(random, limit) };
  const axis = random.choice(['x', 'y']);
  
  // Calculate reflection
  const target = axis === 'x' 
    ? { x: start.x, y: -start.y } 
    : { x: -start.x, y: start.y };

  const axisName = axis === 'x' ? 'x-axis' : 'y-axis';

  return {
    id: `GEO_${topicId}_${Date.now()}`,
    skillId: topicId,
    type: 'graphing',
    difficultyLevel: difficulty,
    prompt: {
      text: `Point A is located at (${start.x}, ${start.y}). Plot the reflection of Point A across the ${axisName}.`
    },
    explanation: {
      text: `To reflect over the ${axisName}, you invert the ${axis === 'x' ? 'y' : 'x'}-coordinate. The new point is (${target.x}, ${target.y}).`
    },
    graphConfig: {
      xRange: [-limit, limit],
      yRange: [-limit, limit],
      gridStep: 1,
      targetType: 'point',
      correctPoints: [target]
    }
  };
}

// --- Generator 3: Translations (Shifting) ---
function genTranslation(random: SeededRandom, difficulty: string, topicId: string): Question {
  const limit = 10;
  // Ensure start point allows for room to shift without going off grid
  const startX = random.int(-5, 5);
  const startY = random.int(-5, 5);
  
  const dx = random.int(-4, 4) || 2; // Avoid 0 shift
  const dy = random.int(-4, 4) || -2;

  const target = { x: startX + dx, y: startY + dy };

  const dirX = dx > 0 ? 'right' : 'left';
  const dirY = dy > 0 ? 'up' : 'down';

  return {
    id: `GEO_${topicId}_${Date.now()}`,
    skillId: topicId,
    type: 'graphing',
    difficultyLevel: difficulty,
    prompt: {
      text: `Start at point (${startX}, ${startY}). Translate this point ${Math.abs(dx)} units ${dirX} and ${Math.abs(dy)} units ${dirY}. Plot the final position.`
    },
    explanation: {
      text: `Add ${dx} to the x-coordinate and ${dy} to the y-coordinate: (${startX} + ${dx}, ${startY} + ${dy}) = (${target.x}, ${target.y}).`
    },
    graphConfig: {
      xRange: [-limit, limit],
      yRange: [-limit, limit],
      gridStep: 1,
      targetType: 'point',
      correctPoints: [target]
    }
  };
}

// --- Generator 4: Identify Quadrant Locations ---
// This asks the user to plot *any* point in a specific quadrant
// Note: This requires the validation logic in your component to check bounds, not just exact equality.
// For now, let's keep it strict: We ask them to plot a specific calculated point derived from a clue.
function genQuadrantCalculation(random: SeededRandom, difficulty: string, topicId: string): Question {
  const limit = 10;
  const x = random.int(1, 5) * (random.bool() ? 1 : -1);
  const y = random.int(1, 5) * (random.bool() ? 1 : -1);
  
  return {
    id: `GEO_${topicId}_${Date.now()}`,
    skillId: topicId,
    type: 'graphing',
    difficultyLevel: difficulty,
    prompt: {
      text: `Plot the point where x = ${x} and y = ${y}.`
    },
    explanation: {
      text: `Find ${x} on the horizontal axis and ${y} on the vertical axis.`
    },
    graphConfig: {
      xRange: [-limit, limit],
      yRange: [-limit, limit],
      gridStep: 1,
      targetType: 'point',
      correctPoints: [{ x, y }]
    }
  };
}

// --- Main Export Function ---
export function generateGeometryQuestion(topicId: string, difficulty = "medium", seed: number | null = null): Question {
  const random = new SeededRandom(seed || Date.now());
  
  const map: any = {
    "geo-plot-points": genPlotPoints,
    "geo-reflection": genReflection,
    "geo-translation": genTranslation,
    "geo-coordinates": genQuadrantCalculation
  };

  const gen = map[topicId];
  // Default to plotting points if topic not found
  if (!gen) return genPlotPoints(random, difficulty, topicId);
  
  return gen(random, difficulty, topicId);
}