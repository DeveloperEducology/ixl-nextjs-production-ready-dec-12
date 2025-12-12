import { LessonData, GradeData, Subject, SkillData, CategoryData } from './types';

// The "Real" playable skill (Mock fallback)
const EQUIVALENT_FRACTIONS_SKILL: SkillData = {
  id: "M.5.3",
  name: "Equivalent Fractions",
  description: "Find fractions that are equivalent to the given shape or number.",
  questions: [
    {
      id: "q_101",
      skillId: "M.5.3",
      difficultyLevel: "1",
      type: 'multiple-choice',
      prompt: {
        text: "Which fraction is equivalent to the shaded area?",
        image: "https://picsum.photos/300/200?random=1"
      },
      options: [
        { id: "A", content: "2/4", isCorrect: true },
        { id: "B", content: "1/3", isCorrect: false },
        { id: "C", content: "3/5", isCorrect: false },
        { id: "D", content: "1/5", isCorrect: false }
      ],
      correctAnswer: "2/4",
      explanation: {
        steps: [
          "Count the total number of parts in the circle. Assume there are 2 main parts visually.",
          "Count the shaded parts. There is 1 shaded part.",
          "The fraction is 1/2.",
          "Look at the options. 2/4 reduces to 1/2 (divide top and bottom by 2).",
          "Therefore, 2/4 is equivalent."
        ]
      }
    }
  ]
};

export const SUBJECTS: Subject[] = ['Math', 'Language Arts', 'Science', 'Social Studies'];

export const GRADES = [
  { id: '1', label: 'First grade' },
  { id: '2', label: 'Second grade' },
  { id: '3', label: 'Third grade' },
  { id: '4', label: 'Fourth grade' },
  { id: '5', label: 'Fifth grade' },
];

export const getCurriculumForGrade = (gradeId: string, subject: Subject): CategoryData[] => {
  
  // =========================================================
  // MATH SUBJECT
  // =========================================================
  if (subject === 'Math') {
      
      // ----------------------------------------------------------------------
      // GRADE 1
      // ----------------------------------------------------------------------
      if (gradeId === '1') {
          return [
              { name: "P. Patterns", skills: [
                  // NEW: Fill-in-Blank Pattern
                  { id: "fib-math-pattern", name: "Number Patterns", description: "Complete the sequence (e.g., 2, 4, __, 8)." }
              ]},
              { name: "A. Addition", skills: [
                  // NEW: Fill-in-Blank Equation
                  { id: "fib-equation", name: "Find missing number", description: "Solve for the missing part (e.g., 5 + __ = 9)." },
                  { id: "g1-add-pictures", name: "Add with pictures", description: "Use pictures to add numbers." },
                  { id: "g1-add-single-digit", name: "Add single digits", description: "Add two single-digit numbers." },
                  { id: "g1-add-making-10", name: "Making 10", description: "Find the missing number to make 10." },
                  { id: "g1-add-word", name: "Addition word problems", description: "Solve simple addition word problems." }
              ]},
              { name: "N. Numbers", skills: [
                  { id: "npv-number-recognition", name: "Number Recognition", description: "Identify numbers." },
                  { id: "npv-counting-forward", name: "Counting Forward", description: "Continue the sequence." },
                  { id: "g1-order-numbers", name: "Order Numbers", description: "Arrange numbers from least to greatest." }
              ]}
          ];
      }

      // ----------------------------------------------------------------------
      // GRADE 2
      // ----------------------------------------------------------------------
      if (gradeId === '2') {
          return [
              { name: "W. Word Problems", skills: [
                  // NEW: Fill-in-Blank Word Problem
                  { id: "fib-word-problem", name: "Simple Word Problems", description: "Read and solve simple math scenarios." }
              ]},
              { name: "A. Addition", skills: [
                  { id: "g2-add-single-digit", name: "Add one-digit numbers", description: "Add single digit numbers." },
                  { id: "g2-add-2digit-1digit", name: "Add 2-digit and 1-digit", description: "Add a two-digit number and a one-digit number." },
                  { id: "g2-add-two-2digit", name: "Add two 2-digit numbers", description: "Add two two-digit numbers without regrouping." }
              ]},
              { name: "M. Multiplication", skills: [
                  { id: "g2-mul-tables", name: "Times tables", description: "Introduction to multiplication tables." },
                  { id: "g2-mul-word", name: "Multiplication word problems", description: "Simple multiplication scenarios." }
              ]},
              { name: "L. Number Lines", skills: [
                  { id: "nl-find-integer", name: "Integers on Number Line", description: "Find the position of numbers up to 100." }
              ]}
          ];
      }

      // ----------------------------------------------------------------------
      // GRADE 3
      // ----------------------------------------------------------------------
      if (gradeId === '3') {
          return [
              { name: "M. Multiplication", skills: [
                  { id: "g3-mul-repeated-addition", name: "Repeated Addition", description: "Relate addition to multiplication." },
                  { id: "g3-mul-tables", name: "Multiplication Facts", description: "Practice times tables up to 12." },
                  { id: "g3-mul-numbers", name: "Multiply numbers", description: "Multiply larger numbers." },
                  { id: "g3-mul-properties", name: "Properties", description: "Commutative, Associative, and Distributive properties." }
              ]},
              { name: "B. Addition", skills: [
                   { id: "g3-add-3digit-3digit", name: "Add 3-digit numbers", description: "Add two 3-digit numbers." },
                   { id: "g3-add-estimate", name: "Estimate sums", description: "Round and add." }
              ]},
              { name: "O. Ordering", skills: [
                  { id: "g3-order-decimals", name: "Order Decimals", description: "Arrange decimals from least to greatest." }
              ]}
          ];
      }

      // ----------------------------------------------------------------------
      // GRADE 4
      // ----------------------------------------------------------------------
      if (gradeId === '4') {
          return [
              { name: "M. Multiplication", skills: [
                  { id: "g4-mul-tables", name: "Multiplication facts", description: "Master multiplication facts." },
                  { id: "g4-mul-numbers", name: "Multiply 1-digit by 2-digit", description: "Multiply larger numbers." },
                  { id: "mul-pattern-powers", name: "Multiplication Patterns", description: "Multiply by 10, 100, 1000 (e.g. 8 × 800)." },
                  { id: "g4-mul-steps", name: "Multiply 2-digit numbers", description: "Complete the missing steps." }
              ]},
              { name: "B. Addition", skills: [
                   { id: "g4-add-multi-digit", name: "Add multi-digit numbers", description: "Add numbers with 4 or more digits." }
              ]},
              { name: "O. Ordering", skills: [
                   { id: "g4-order-numbers-large", name: "Order Large Numbers", description: "Sort numbers up to 1,000." },
                   { id: "g4-order-fractions-like", name: "Order Fractions (Like)", description: "Sort fractions with same denominators." }
              ]},
              { name: "G. Geometry & Graphing", skills: [
                   { id: "geo-plot-points", name: "Plot points", description: "Graph points on a coordinate plane." },
                   { id: "geo-coordinates", name: "Coordinate meaning", description: "Understand x and y coordinates." }
              ]},
              { name: "L. Number Lines", skills: [
                   { id: "nl-find-integer", name: "Integers on Number Line", description: "Locate whole numbers on a line." }
              ]}
          ];
      }

      // ----------------------------------------------------------------------
      // GRADE 5
      // ----------------------------------------------------------------------
      if (gradeId === '5') {
          return [
              { name: "B. Operations", skills: [
                  // NEW: Vertical Math Components
                  { id: "v-add-whole", name: "Add whole numbers", description: "Add numbers with up to 6 digits." },
                  { id: "v-sub-whole", name: "Subtract whole numbers", description: "Subtract numbers with regrouping." }
              ]},
              { name: "A. Algebra", skills: [
                   // NEW: Equation Editor
                   { id: "alg-basic-eq", name: "Solve Equations", description: "Solve for x in simple equations (e.g., 3x + 4 = 19)." }
              ]},
              { name: "D. Decimals", skills: [
                  { id: "g5-add-decimal", name: "Add decimals", description: "Add decimal numbers." }
              ]},
              { name: "F. Fractions", skills: [
                  { id: "g5-add-fractions-like", name: "Add fractions", description: "Add fractions with like denominators." }
              ]},
              { name: "M. Multiplication", skills: [
                   { id: "g5-mul-numbers", name: "Multiply multi-digit numbers", description: "Challenge zone multiplication." }
              ]},
              { name: "O. Ordering", skills: [
                   { id: "g5-order-fractions-unlike", name: "Order Fractions (Unlike)", description: "Sort fractions with different denominators." },
                   { id: "g6-order-integers", name: "Order Integers", description: "Sort positive and negative numbers." }
              ]},
              { name: "G. Geometry & Graphing", skills: [
                   { id: "geo-reflection", name: "Reflections", description: "Reflect points across x and y axes." },
                   { id: "geo-translation", name: "Translations", description: "Shift points up, down, left, and right." }
              ]},
              { name: "L. Number Lines", skills: [
                   { id: "nl-decimals", name: "Decimals on Number Line", description: "Locate decimals (0.1, 0.5) on a line." }
              ]}
          ];
      }
  }

  // =========================================================
  // LANGUAGE ARTS SUBJECT
  // =========================================================
  if (subject === 'Language Arts') {
      return [
          { name: "V. Vocabulary", skills: [
              // NEW: Fill-in-Blank Sentence
              { id: "fib-sentence", name: "Antonyms", description: "Complete the sentence with the opposite word." }
          ]}
      ];
  }

  // Fallback
  return [
    {
      name: "G. General Practice",
      skills: [EQUIVALENT_FRACTIONS_SKILL]
    }
  ];
};