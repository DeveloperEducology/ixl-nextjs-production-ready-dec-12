import { SeededRandom } from '../../../utils/SeededRandom';
import { Question } from '../../../types';

export function generateMultiplicationStepsQuestion(
  topicId: string,
  difficulty: string = 'medium',
  seed: number | null = null
): Question {
  const random = new SeededRandom(seed || Date.now());

  // 1. Generate Numbers (2-digit x 2-digit)
  // Ensure they aren't too simple (like 10 or 20) for better practice
  const a = random.int(12, 99);
  const b = random.int(12, 99);

  // 2. Calculate Steps
  const b_ones = b % 10;
  const b_tens = Math.floor(b / 10) * 10; // e.g. 37 -> 30

  const partial1 = a * b_ones;       // 48 * 7 = 336
  const partial2 = a * b_tens;       // 48 * 30 = 1440
  const total = partial1 + partial2; // 1776

  // 3. Prepare Digits for Grid
  // We align everything to the right. Let's assume max width of 6 columns.
  const toDigits = (n: number | string) => n.toString().split('');

  // Define the rows. Each cell: { val: string, isInput: boolean, id?: string }
  const rows = [];
  const expectedAnswers = [];

  // --- Row 1: Top Factor ---
  rows.push({
    type: 'factor',
    cells: toDigits(a).map(d => ({ val: d, isInput: false }))
  });

  // --- Row 2: Bottom Factor ---
  rows.push({
    type: 'factor-operator',
    operator: '×',
    cells: toDigits(b).map(d => ({ val: d, isInput: false }))
  });

  // --- Row 3: Partial Product 1 ---
  // Difficulty Logic: Easy = Show All. Hard = Hide some digits.
  // For this specific screenshot request, we show these (isInput: false)
  rows.push({
    type: 'partial',
    cells: toDigits(partial1).map(d => ({ val: d, isInput: false }))
  });

  // --- Row 4: Partial Product 2 ---
  rows.push({
    type: 'partial-operator',
    operator: '+',
    cells: toDigits(partial2).map(d => ({ val: d, isInput: false }))
  });

  // --- Row 5: Final Result (The Inputs) ---
  const resultDigits = toDigits(total);
  const resultCells = resultDigits.map((d, idx) => {
    const id = `res-${idx}`;
    expectedAnswers.push({ id, value: d }); // Add to validation list
    return { val: "", isInput: true, id };  // Render empty box
  });

  rows.push({
    type: 'result',
    cells: resultCells
  });

  return {
    id: `VM_STEP_${Date.now()}`,
    skillId: topicId,
    type: 'vertical-multiplication', // New Type
    difficultyLevel: difficulty,
    prompt: {
      text: "Fill in the missing numbers to complete the multiplication."
    },
    // We pass the raw grid data to the component
    content: {
      rows, 
      maxLength: 6 // Used for grid column width
    },
    answerConfig: {
      expectedAnswers
    },
    explanation: {
      text: "Multiply the top number by the ones digit, then by the tens digit (don't forget the placeholder zero!), then add the partial products.",
      steps: [
        `${a} × ${b_ones} = ${partial1}`,
        `${a} × ${b_tens} = ${partial2}`,
        `${partial1} + ${partial2} = ${total}`
      ]
    }
  } as unknown as Question;
}