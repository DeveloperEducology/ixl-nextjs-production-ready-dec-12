"use client";

import React, { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { StatsPanel } from "@/components/StatsPanel";
import { QuestionRenderer } from "@/components/QuestionRenderer";
import { calculateSmartScore } from "@/services/scoringService";
import {
  generateQuestion,
  QUESTION_GENERATORS,
} from "@/services/questionService";
import { Question } from "@/types";
import {
  Lightbulb,
  Pencil,
  Menu,
  Search,
  ChevronDown,
  Check,
  ArrowLeft,
  Trophy,
  RefreshCw,
} from "lucide-react";

// Props passed from the Server Component
interface QuizClientProps {
  skillId: string;
  skillName: string;
  skillDesc: string;
  subject: string;
  gradeLabel: string;
  initialQuestion: Question | null;
}

export default function QuizClient({
  skillId,
  skillName,
  skillDesc,
  subject,
  gradeLabel,
  initialQuestion,
}: QuizClientProps) {
  const router = useRouter();

  const [sessionStart] = useState(Date.now());
  const [smartScore, setSmartScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [streak, setStreak] = useState(0);

  // Initialize with the Server-generated question
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(
    initialQuestion
  );

  console.log('currentQuestion', currentQuestion)

  // UI States
  const [feedbackState, setFeedbackState] = useState<
    "idle" | "correct" | "incorrect"
  >("idle");
  
  // Changed to 'any' to support complex types (Points[], string[], number)
  const [lastUserAnswer, setLastUserAnswer] = useState<any>(null);
  const [isExampleOpen, setIsExampleOpen] = useState(false);

  const solutionRef = useRef<HTMLDivElement>(null);
  const isChallengeZone = smartScore >= 90;
  const isMastered = smartScore >= 100;

  // --- LOGIC: Client-side generation for subsequent questions ---
  const loadNextQuestion = () => {
    let difficulty = "medium";
    if (smartScore < 40) difficulty = "easy";
    if (smartScore >= 80) difficulty = "hard";

    try {
      if (QUESTION_GENERATORS[skillId]) {
        // Generate new question on client
        const q = generateQuestion(skillId, difficulty);
        setCurrentQuestion(q);
      } else {
        console.error("No generator found for", skillId);
        // Fallback
        setCurrentQuestion({
          id: "error",
          skillId,
          type: "text-input",
          prompt: { text: "Generator not found." },
          explanation: { text: "Missing generator configuration." },
          correctAnswer: "skip",
        });
      }
    } catch (e) {
      console.error("Error generating question", e);
    }
  };

  const handleAnswerSubmit = useCallback(
    (answer: any) => {
      if (!currentQuestion) return;
      setLastUserAnswer(answer);

      let isCorrect = false;

      // --- VALIDATION LOGIC START ---
      switch (currentQuestion.type) {
        case "multiple-choice":
          // Handle Array (Multi-select) or String (Single)
          const correctOptions = currentQuestion.options
            ?.filter((o) => o.isCorrect)
            .map((o) => o.id);
            
          const userSelection = Array.isArray(answer) ? answer : [answer];
          
          if (correctOptions) {
             // Check if lengths match and every item matches
             isCorrect = correctOptions.length === userSelection.length && 
                         correctOptions.every(id => userSelection.includes(id));
          } else {
             // Fallback for simple string match
             isCorrect = answer === currentQuestion.correctAnswer;
          }
          break;

        case "sorting":
          // Compare two arrays of strings
          if (Array.isArray(answer) && Array.isArray(currentQuestion.correctOrder)) {
            isCorrect = JSON.stringify(answer) === JSON.stringify(currentQuestion.correctOrder);
          }
          break;

        case "graphing":
          // Compare arrays of Point objects {x, y}
          // We check if every correct point exists in the user's answer (Set equality)
          const correctPoints = currentQuestion.graphConfig?.correctPoints;
          const userPoints = answer as { x: number; y: number }[];
          
          if (correctPoints && Array.isArray(userPoints)) {
            if (correctPoints.length === userPoints.length) {
              isCorrect = correctPoints.every((cp) => 
                userPoints.some((up) => up.x === cp.x && up.y === cp.y)
              );
            }
          }
          break;

        case "number-line":
          // Compare numbers
          const targetVal = currentQuestion.numberLineConfig?.correctValue;
          if (typeof targetVal === 'number') {
            isCorrect = Number(answer) === targetVal;
          }
          break;
case "fill_blank":
    const expected = currentQuestion.answerConfig?.expectedAnswers;
    if (expected && typeof answer === "object") {
      // 1. Check if user answered ALL blanks
      const filledKeys = Object.keys(answer);
      const allFilled = expected.every(exp => filledKeys.includes(exp.id));
      
      if (!allFilled) {
        isCorrect = false;
      } else {
        // 2. Check if values match
        isCorrect = expected.every((exp) => {
            const userVal = answer[exp.id];
            return Number(userVal) === Number(exp.value);
        });
      }
    }
    break;
        case "text-input":
        case "fill-in-blank":
        case "equation":
        default:
          // String comparison with normalization
          const normalizedInput = String(answer).trim().toLowerCase();
          if (currentQuestion.acceptableAnswers) {
            isCorrect = currentQuestion.acceptableAnswers.some(
              (a) => a.toLowerCase() === normalizedInput
            );
          } else {
            isCorrect = normalizedInput === currentQuestion.correctAnswer?.toLowerCase();
          }
          break;
      }
      // --- VALIDATION LOGIC END ---

      if (isCorrect) {
        setFeedbackState("correct");
        setSmartScore((prev) => calculateSmartScore(prev, true, streak));
        setStreak((prev) => prev + 1);
        setQuestionCount((prev) => prev + 1);

        setTimeout(() => {
          setFeedbackState("idle");
          setLastUserAnswer(null);
          loadNextQuestion(); // Client generates next question
        }, 1500);
      } else {
        setFeedbackState("incorrect");
        setSmartScore((prev) => calculateSmartScore(prev, false, streak));
        setStreak(0);
        setQuestionCount((prev) => prev + 1);
        
        // Scroll to solution
        setTimeout(() => {
          solutionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    },
    [currentQuestion, streak]
  );

  const handleNextAfterIncorrect = () => {
    setFeedbackState("idle");
    setLastUserAnswer(null);
    loadNextQuestion();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRestart = () => {
    setSmartScore(0);
    setQuestionCount(0);
    setStreak(0);
    setFeedbackState("idle");
    loadNextQuestion();
  };

  const handleBack = () => router.back();

  // --- HELPERS ---
  const getPromptText = (q: Question | null) =>
    q &&
    (typeof q.prompt === "object" && "text" in q.prompt
      ? q.prompt.text
      : String(q.prompt));

  const getExplanationText = (q: Question | null) =>
    q && q.explanation
      ? typeof q.explanation === "object" && "text" in q.explanation
        ? q.explanation.text
        : String(q.explanation)
      : "Review the key concepts.";

  const getPromptImage = (q: Question | null) =>
    q && typeof q.prompt === "object" ? (q.prompt as any).image : null;

  // Helper to display the "Correct Answer" string nicely
  const getCorrectAnswerDisplay = (q: Question) => {
    if (q.type === "graphing") return "See the graph in the explanation below.";
    if (q.type === "sorting") return "See the correct order below.";
    if (q.type === "multiple-choice") {
       // Try to find content matching the ID
       const correctIds = q.options?.filter(o => o.isCorrect).map(o => o.content);
       return correctIds ? correctIds.join(", ") : q.correctAnswer;
    }
    if (q.type === "number-line") return q.numberLineConfig?.correctValue;
    return q.correctAnswer;
  };

  // --- SUB-COMPONENTS ---
  const MobileHeader = () => (
    <div className="bg-[#69a716] h-[50px] flex items-center justify-between px-3 md:hidden shadow-md z-50 shrink-0">
      <div className="bg-white px-2 py-0.5 rounded-[2px]">
        <span className="text-[#005e9e] font-extrabold text-xl tracking-tighter">
          SkillMaster
        </span>
      </div>
      <div className="flex items-center gap-4 text-white">
        <Search className="w-5 h-5" />
        <button className="bg-[#4a8a00] px-3 py-1 rounded-[3px] text-xs font-bold shadow-sm border-b border-[#3e7500]">
          Join now
        </button>
        <Menu className="w-6 h-6" />
      </div>
    </div>
  );

  const Breadcrumbs = () => (
    <div className="bg-[#f2f2f2] border-b border-[#dcdcdc] py-1.5 px-4 text-[13px] text-[#555] md:block shrink-0">
      <span
        className="cursor-pointer hover:underline hover:text-[#0077c8]"
        onClick={handleBack}
      >
        {gradeLabel}
      </span>
      <span className="mx-2 text-[#999]">&gt;</span>
      <span className="text-[#333] font-semibold">{skillName}</span>
    </div>
  );

  const LearnWithExamplePane = () => (
    <div className="animate-in fade-in slide-in-from-top-4 duration-300 pb-8">
      <div className="bg-[#eef7ff] border border-[#0077c8] p-6 rounded-[4px] mb-6">
        <h3 className="text-[#0077c8] font-bold text-lg mb-2 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" /> Example
        </h3>
        <p className="text-gray-800 mb-4 font-medium whitespace-pre-wrap">
          {getPromptText(currentQuestion)}
        </p>
        <div className="bg-white p-4 border border-gray-200 rounded">
          <span className="font-bold text-gray-600 text-sm uppercase">
            Key Idea:
          </span>
          <p className="mt-1 text-gray-800">
            {getExplanationText(currentQuestion)}
          </p>
        </div>
      </div>
      <div className="text-center">
        <button
          onClick={() => setIsExampleOpen(false)}
          className="text-[#0077c8] font-bold text-sm hover:underline flex items-center justify-center gap-1 mx-auto"
        >
          <ChevronDown className="w-4 h-4 rotate-180" /> Back to practice
        </button>
      </div>
    </div>
  );

  // --- RENDER ---
  if (isMastered) {
    return (
      <div className="flex h-screen bg-[#f3f9f9] font-sans">
        <div className="hidden md:block">
          <StatsPanel
            score={100}
            questionCount={questionCount}
            sessionStartTime={sessionStart}
          />
        </div>
        <main className="flex-1 overflow-y-auto p-4 md:p-12 flex flex-col items-center justify-center text-center">
          <div className="bg-white p-12 rounded-2xl shadow-xl max-w-lg w-full border-t-8 border-[#f5a623] animate-in zoom-in-50 duration-500">
            <div className="mx-auto bg-yellow-100 w-24 h-24 rounded-full flex items-center justify-center mb-6">
              <Trophy className="w-12 h-12 text-[#f5a623]" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
              Skill Mastered!
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              You achieved a SmartScore of 100 on <strong>{skillName}</strong>.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleBack}
                className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-4 rounded-lg font-bold text-lg hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" /> Back
              </button>
              <button
                onClick={handleRestart}
                className="flex items-center justify-center gap-2 bg-[#56a700] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors shadow-lg"
              >
                <RefreshCw className="w-5 h-5" /> Practice Again
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-b from-[#ddf1fa] to-[#d4eed6] font-sans flex flex-col overflow-hidden font-arial">
      <MobileHeader />
      <Breadcrumbs />

      <div className="md:hidden sticky top-0 z-40">
        <StatsPanel
          score={smartScore}
          questionCount={questionCount}
          sessionStartTime={sessionStart}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-3 md:p-8 scroll-smooth">
        <div className="flex justify-center items-start gap-8 max-w-[1100px] mx-auto w-full">
          <main className="bg-white rounded-[10px] shadow-[0_2px_4px_rgba(0,0,0,0.1)] w-full max-w-[700px] min-h-[500px] flex flex-col relative pb-12 transition-all">
            
            {/* Correct Status Banner (Top) */}
            {feedbackState === "correct" && (
              <div className="absolute top-0 left-0 right-0 bg-[#fff9c4] border-b-2 border-[#fff176] text-[#594c16] py-4 z-20 flex flex-col items-center justify-center animate-in slide-in-from-top-2 fade-in duration-300">
                <span className="text-2xl font-bold flex items-center gap-2">
                  <Check className="w-6 h-6 text-[#594c16]" /> Excellent!
                </span>
              </div>
            )}

            {/* Learn with Example Button */}
            {!isExampleOpen && feedbackState !== "incorrect" && (
              <div className="flex justify-center pt-2 relative">
                <button
                  onClick={() => setIsExampleOpen(true)}
                  className="flex items-center gap-2 text-[#0077c8] font-bold text-[13px] py-2 px-4 hover:bg-[#f5faff] rounded transition-colors mt-2"
                >
                  <div className="bg-[#5eb2e4] p-1 rounded-full">
                    <Lightbulb className="w-3 h-3 text-white" fill="currentColor" />
                  </div>{" "}
                  Learn with an example
                </button>
              </div>
            )}

            {/* Main Content Area */}
            <div className="px-6 md:px-12 py-4">
              {isExampleOpen ? (
                <LearnWithExamplePane />
              ) : (
                <>
                  {currentQuestion ? (
                    <>
                      {/* --- Question Prompt --- */}
                      <h2 className="text-[22px] md:text-[24px] text-black font-normal leading-snug mb-4 whitespace-pre-wrap">
                        {getPromptText(currentQuestion)}
                      </h2>
                      
                      {getPromptImage(currentQuestion) && (
                        <div className="flex justify-center my-6">
                          <img
                            src={getPromptImage(currentQuestion)}
                            alt="Problem"
                            className="max-h-60 rounded border border-gray-100 shadow-sm"
                          />
                        </div>
                      )}

                      {/* --- Incorrect Feedback View --- */}
                      {feedbackState === "incorrect" ? (
                        <div
                          ref={solutionRef}
                          className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 border-t border-gray-100 pt-6"
                        >
                          <div className="bg-[#fff5f5] border-l-4 border-[#d32f2f] p-6 mb-8 rounded-r-[4px] shadow-sm">
                            <h3 className="text-2xl font-bold text-[#d32f2f] mb-4">
                              Sorry, incorrect...
                            </h3>
                            <div className="mb-4">
                              <p className="text-[#555] font-bold text-[11px] uppercase tracking-wide mb-1">
                                The correct answer is:
                              </p>
                              <p className="text-xl text-[#333] font-medium">
                                {getCorrectAnswerDisplay(currentQuestion)}
                              </p>
                            </div>
                          </div>
                          <div className="mb-8">
                            <h4 className="text-[#333] font-bold text-lg mb-3 flex items-center gap-2">
                              <span className="bg-[#5eb2e4] text-white text-xs px-2 py-0.5 rounded uppercase">
                                Explanation
                              </span>
                            </h4>
                            <div className="text-[#333] text-[17px] leading-relaxed p-4 bg-[#f9f9f9] border border-[#e0e0e0] rounded-[4px]">
                              {getExplanationText(currentQuestion)}
                            </div>
                          </div>
                          <button
                            onClick={handleNextAfterIncorrect}
                            className="bg-[#69a716] text-white text-lg font-bold px-8 py-3 rounded-[4px] shadow-[0_2px_0_0_#4a8a00] hover:bg-[#5f9922] active:translate-y-[2px] active:shadow-none transition-all"
                          >
                            Got it
                          </button>
                        </div>
                      ) : (
                        // --- Active Question View ---
                        <div className="mt-4">
                          <QuestionRenderer
                          key={currentQuestion.id}  // <--- ADD THIS LINE
                            question={currentQuestion}
                            onAnswerSubmit={handleAnswerSubmit}
                            isSubmitting={feedbackState !== "idle"}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="p-12 text-center text-gray-400">
                      Loading Question...
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="absolute bottom-4 right-4 text-[#5eb2e4] cursor-pointer hover:scale-110 transition-transform">
              <Pencil className="w-6 h-6 fill-current" />
            </div>
          </main>

          {/* Desktop Stats Panel */}
          <div className="hidden md:block sticky top-8">
            <StatsPanel
              score={smartScore}
              questionCount={questionCount}
              sessionStartTime={sessionStart}
            />
          </div>
        </div>
      </div>
    </div>
  );
}