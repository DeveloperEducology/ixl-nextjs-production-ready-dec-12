// types.ts

// 1. The Question Type Enum
// Added: 'graphing', 'number-line', 'equation', 'fill-in-blank'
export type QuestionType = 
  | 'multiple-choice' 
  | 'text-input' 
  | 'fill-in-blank'
  | 'sorting' 
  | 'graphing' 
  | 'number-line' 
  | 'equation'
  | 'vertical-equation' // <--- NEW TYPE
  | 'vertical-multiplication' // NEW: For Long Multiplication (Screenshot 3)
  | 'fill_blank'; // <--- NEW TYPE


  // Structure for the Fill In Blank content
export interface FillBlankContent {
  prompt: string;
  instructions: string;
  stimulus: {
    type: string;
    content: string; // The text with placeholders like [blank1]
  };
  blanks: Array<{ id: string; position: number; length: number; hint?: string }>;
}

  // Configuration for vertical math problems
export interface VerticalConfig {
  top: string;    // e.g. "110709"
  bottom: string; // e.g. "7452"
  operator: '+' | '-' | '×';
  showPlaceholders?: boolean; // If true, shows empty boxes for all digits
}

// 2. Options for Multiple Choice
export interface QuestionOption {
  id: string;
  content: string; // Text label
  isCorrect: boolean;
  image?: string; // NEW: Support for image-based choices
}

// 3. Items for Sorting / Drag & Drop
export interface SortingItem {
  id: string;
  content: string;
  image?: string; // NEW: Visual sorting tiles
}

// 4. NEW: Configuration for Graphing Questions
export interface GraphConfig {
  xRange: [number, number]; // e.g., [-10, 10]
  yRange: [number, number]; // e.g., [-10, 10]
  gridStep: number;         // e.g., 1
  targetType: 'point' | 'line' | 'bar'; // Defines the interaction mode
  correctPoints?: { x: number; y: number }[]; // Validation data
}

// 5. NEW: Configuration for Number Line Questions
export interface NumberLineConfig {
  min: number;
  max: number;
  step: number;
  labels?: number[]; // Specific numbers to show text labels for
  correctValue?: number; // The target value
  tolerance?: number; // Optional: Allow close answers (e.g., 0.1)
}

// Configuration for Multi-Step Vertical problems
export interface VerticalMultiStepConfig {
  operands: [string, string]; // e.g., ["48", "37"]
  operator: '×';
  // Define each row in the calculation grid
  rows: Array<{
    type: 'static' | 'input' | 'separator';
    value?: string;   // The number to validate against (e.g. "336")
    label?: string;   // Optional label like "+"
    indent?: number;  // Visual indentation from right
    isPlaceholder?: boolean; // For the trailing '0' in multiplication
  }>;
}

// 6. The Unified Question Interface
export interface Question {
  id: string;
  skillId: string;
  type: QuestionType;
  difficultyLevel?: string;
  
  prompt: {
    text: string;
    image?: string;
    audio?: string;
  };

  // Flexible explanation structure
  explanation: {
    text?: string;
    steps?: string[];
    image?: string;
  };

  // --- Type-Specific Data ---
  content?: FillBlankContent; 
  answerConfig?: {
    expectedAnswers: Array<{ id: string; value: number; tolerance?: string }>;
  };

  // For Multiple Choice
  options?: QuestionOption[]; 
  multiSelect?: boolean; // NEW: Allow selecting more than one option

  // For Text Input / Equation / Fill-in-Blank
  correctAnswer?: string; // Used for simple text comparison
  acceptableAnswers?: string[]; // Flexible text matching (e.g., ["0.5", "1/2"])
  unit?: string; 
  placeholder?: string; 
  
  // For Sorting
  items?: SortingItem[]; 
  correctOrder?: string[]; 
  sortingLayout?: 'row' | 'column';

  // For Graphing (NEW)
  graphConfig?: GraphConfig;

  // For Number Line (NEW)
  numberLineConfig?: NumberLineConfig;
  verticalConfig?: VerticalConfig; // <--- ADD THIS
    verticalMultiStepConfig?: VerticalMultiStepConfig;

}

// --- Hierarchy Interfaces (Unchanged but preserved) ---

export interface SkillData {
  id: string;
  name: string;
  description: string;
  questions?: Question[];
}

export interface CategoryData {
  name: string;
  skills: SkillData[];
}

export interface GradeData {
  id: string;
  label: string;
  categories: CategoryData[];
}

export interface LessonData {
  subject: string;
  grade: string;
  category: string;
  skill: SkillData;
}

export type Subject = 'Math' | 'Language Arts' | 'Science' | 'Social Studies';

