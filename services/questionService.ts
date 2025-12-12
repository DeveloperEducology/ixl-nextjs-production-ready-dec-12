import { generateAdditionQuestion } from './generators/math/addition';
import { generateNumberPlaceValueQuestion } from './generators/math/numberPlaceValue';
import { 
  generateRepeatedAdditionQuestion,
  generateTimesTableQuestion,
  generateMultiplyingNumbersQuestion,
  generateMultiplicationWordProblem,
  generateMultiplicationPropertyQuestion
} from './generators/math/multiplication';
import { generateSortingQuestion } from './generators/math/sorting';
import { generateGeometryQuestion } from './generators/math/geometryGenerator'; 
import { generateNumberLineQuestion } from './generators/math/numberLineGenerator';
import { generateEquationQuestion } from './generators/math/equationGenerator'; 
import { generateVerticalMathQuestion } from './generators/math/verticalGenerator';
import { generatePatternMultiplicationQuestion } from './generators/math/patternMultiplication';
// NEW IMPORT
import { generateFillBlankQuestion } from './generators/math/fillBlankGenerator'; 
import { generateMultiplicationStepsQuestion } from './generators/math/multiplicationSteps';

import { Question } from '../types';

export const QUESTION_GENERATORS: Record<string, (difficulty: string, seed: number | null) => Question> = {
    // ------------------------------------
    // NEW: Fill in the Blank Variations
    // ------------------------------------
    "fib-math-pattern": (diff, seed) => generateFillBlankQuestion("fib-math-pattern", diff, seed),
    "fib-equation": (diff, seed) => generateFillBlankQuestion("fib-equation", diff, seed),
    "fib-word-problem": (diff, seed) => generateFillBlankQuestion("fib-word-problem", diff, seed),
    "fib-sentence": (diff, seed) => generateFillBlankQuestion("fib-sentence", diff, seed),
    // vertical-multiplication
"g4-mul-steps": (diff, seed) => generateMultiplicationStepsQuestion("g4-mul-steps", diff, seed),
    // ------------------------------------
    // Geometry & Graphing
    // ------------------------------------
    "geo-plot-points": (diff, seed) => generateGeometryQuestion("geo-plot-points", diff, seed),
    "geo-reflection": (diff, seed) => generateGeometryQuestion("geo-reflection", diff, seed),
    "geo-translation": (diff, seed) => generateGeometryQuestion("geo-translation", diff, seed),
    "geo-coordinates": (diff, seed) => generateGeometryQuestion("geo-coordinates", diff, seed),

    // ------------------------------------
    // Vertical Math & Patterns
    // ------------------------------------
    "mul-pattern-powers": (diff, seed) => generatePatternMultiplicationQuestion("mul-pattern-powers", diff, seed),
    "v-add-whole": (diff, seed) => generateVerticalMathQuestion("v-add-whole", diff, seed),
    "v-sub-whole": (diff, seed) => generateVerticalMathQuestion("v-sub-whole", diff, seed),

    // ------------------------------------
    // Algebra / Equations
    // ------------------------------------
    "alg-basic-eq": (diff, seed) => generateEquationQuestion("alg-basic-eq", diff, seed),

    // ------------------------------------
    // Number Lines
    // ------------------------------------
    "nl-find-integer": (diff, seed) => generateNumberLineQuestion("nl-find-integer", diff, seed),
    "nl-decimals": (diff, seed) => generateNumberLineQuestion("nl-decimals", diff, seed),

    // ------------------------------------
    // Multiplication
    // ------------------------------------
    "g1-mul-repeated-addition": (diff, seed) => generateRepeatedAdditionQuestion(1, diff, seed),
    "g2-mul-repeated-addition": (diff, seed) => generateRepeatedAdditionQuestion(2, diff, seed),
    "g3-mul-repeated-addition": (diff, seed) => generateRepeatedAdditionQuestion(3, diff, seed),
    "g4-mul-repeated-addition": (diff, seed) => generateRepeatedAdditionQuestion(4, diff, seed),
    
    "g2-mul-tables": (diff, seed) => generateTimesTableQuestion(2, diff, seed),
    "g3-mul-tables": (diff, seed) => generateTimesTableQuestion(3, diff, seed),
    "g4-mul-tables": (diff, seed) => generateTimesTableQuestion(4, diff, seed),
    
    "g3-mul-numbers": (diff, seed) => generateMultiplyingNumbersQuestion(3, diff, seed),
    "g4-mul-numbers": (diff, seed) => generateMultiplyingNumbersQuestion(4, diff, seed),
    
    "g2-mul-word": (diff, seed) => generateMultiplicationWordProblem(2, diff, seed),
    "g3-mul-word": (diff, seed) => generateMultiplicationWordProblem(3, diff, seed),
    
    "g3-mul-properties": (diff, seed) => generateMultiplicationPropertyQuestion(3, diff, seed),

    // ------------------------------------
    // Addition
    // ------------------------------------
    "g1-add-pictures": (diff, seed) => generateAdditionQuestion("g1-add-pictures", diff, seed),
    "g1-add-single-digit": (diff, seed) => generateAdditionQuestion("g1-add-single-digit", diff, seed),
    "g1-add-making-10": (diff, seed) => generateAdditionQuestion("g1-add-making-10", diff, seed),
    "g1-add-word": (diff, seed) => generateAdditionQuestion("g1-add-word", diff, seed),

    "g2-add-single-digit": (diff, seed) => generateAdditionQuestion("g2-add-single-digit", diff, seed),
    "g2-add-2digit-1digit": (diff, seed) => generateAdditionQuestion("g2-add-2digit-1digit", diff, seed),
    "g2-add-two-2digit": (diff, seed) => generateAdditionQuestion("g2-add-two-2digit", diff, seed),
    "g2-add-making-100": (diff, seed) => generateAdditionQuestion("g2-add-making-100", diff, seed),
    "g2-add-word": (diff, seed) => generateAdditionQuestion("g2-add-word", diff, seed),

    "g3-add-3digit-3digit": (diff, seed) => generateAdditionQuestion("g3-add-3digit-3digit", diff, seed),
    "g3-add-with-regrouping": (diff, seed) => generateAdditionQuestion("g3-add-with-regrouping", diff, seed),
    "g3-add-estimate": (diff, seed) => generateAdditionQuestion("g3-add-estimate", diff, seed),

    "g4-add-multi-digit": (diff, seed) => generateAdditionQuestion("g4-add-multi-digit", diff, seed),
    "g4-add-round-and-add": (diff, seed) => generateAdditionQuestion("g4-add-round-and-add", diff, seed),
    
    "g5-add-decimal": (diff, seed) => generateAdditionQuestion("g5-add-decimal", diff, seed),
    "g5-add-fractions-like": (diff, seed) => generateAdditionQuestion("g5-add-fractions-like", diff, seed),

    // ------------------------------------
    // Number Place Value
    // ------------------------------------
    "npv-number-recognition": (diff, seed) => generateNumberPlaceValueQuestion("npv-number-recognition", diff, seed),
    "npv-counting-forward": (diff, seed) => generateNumberPlaceValueQuestion("npv-counting-forward", diff, seed),
    "npv-counting-backward": (diff, seed) => generateNumberPlaceValueQuestion("npv-counting-backward", diff, seed),
    "npv-comparing": (diff, seed) => generateNumberPlaceValueQuestion("npv-comparing", diff, seed),
    "npv-place-value": (diff, seed) => generateNumberPlaceValueQuestion("npv-place-value", diff, seed),
    "npv-expanded-form": (diff, seed) => generateNumberPlaceValueQuestion("npv-expanded-form", diff, seed),
    "npv-even-odd": (diff, seed) => generateNumberPlaceValueQuestion("npv-even-odd", diff, seed),

    // ------------------------------------
    // Sorting / Ordering
    // ------------------------------------
    "g1-order-numbers": (diff, seed) => generateSortingQuestion("g1-order-numbers", diff, seed),
    "g3-order-decimals": (diff, seed) => generateSortingQuestion("g3-order-decimals", diff, seed),
    "g4-order-numbers-large": (diff, seed) => generateSortingQuestion("g4-order-numbers-large", diff, seed),
    "g4-order-fractions-like": (diff, seed) => generateSortingQuestion("g4-order-fractions-like", diff, seed),
    "g5-order-fractions-unlike": (diff, seed) => generateSortingQuestion("g5-order-fractions-unlike", diff, seed),
    "g6-order-integers": (diff, seed) => generateSortingQuestion("g6-order-integers", diff, seed),
};

export function generateQuestion(topicId: string, difficulty: string = "medium", seed: number | null = null): Question {
    const generator = QUESTION_GENERATORS[topicId];
    if (generator) {
        return generator(difficulty, seed);
    }
    // Fallback or explicit error handling
    console.warn(`No generator found for topic: ${topicId}. Ensure the ID in your database matches a key in QUESTION_GENERATORS.`);
    throw new Error(`No generator found for topic: ${topicId}`);
}