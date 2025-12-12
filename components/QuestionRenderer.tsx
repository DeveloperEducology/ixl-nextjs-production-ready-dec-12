"use client";
import React from "react";
import { Question } from "../types"; // Adjust path as needed
import { MultipleChoice } from "./MultipleChoice";
import { SortableList } from "./SortableList";
import { CoordinateGrid } from "./CoordinateGrid";
import { NumberLine } from "./NumberLine";
import { EquationEditor } from "./EquationEditor";
import { VerticalEquation } from "./VerticalEquation"; // Import the new component
import { FillInBlankPattern } from "./FillInBlankPattern"; // Import the new component
import { VerticalMultiplication } from "./VerticalMultiplication";

interface QuestionRendererProps {
  question: Question;
  onAnswerSubmit: (answer: any) => void;
  isSubmitting: boolean;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onAnswerSubmit,
  isSubmitting,
}) => {
  const [currentAnswer, setCurrentAnswer] = React.useState<any>(null);

  // Wrapper to sync local state before submission
  const handleAnswerChange = (val: any) => {
    setCurrentAnswer(val);
  };

  const handleSubmit = () => {
    if (currentAnswer) {
      onAnswerSubmit(currentAnswer);
    }
  };

  const renderContent = () => {
    switch (question.type) {
      case "multiple-choice":
        return (
          <MultipleChoice
            question={question}
            onAnswerChange={handleAnswerChange}
            disabled={isSubmitting}
          />
        );
      case "sorting":
        return (
          <SortableList
            question={question}
            onAnswerChange={handleAnswerChange}
            disabled={isSubmitting}
            layout={question.sortingLayout || "row"}
          />
        );
      case "graphing":
        return (
          <CoordinateGrid
            question={question}
            onAnswerChange={handleAnswerChange}
            disabled={isSubmitting}
          />
        );
      case "number-line":
        return (
          <NumberLine
            question={question}
            onAnswerChange={handleAnswerChange}
            disabled={isSubmitting}
          />
        );
      case "equation":
        return (
          <EquationEditor
            onAnswerChange={handleAnswerChange}
            disabled={isSubmitting}
          />
        );
        case "vertical-equation":
  return (
    <VerticalEquation
      question={question}
      onAnswerChange={handleAnswerChange}
      disabled={isSubmitting}
    />
  );
  case "fill_blank":
  return (
    <FillInBlankPattern
      question={question}
      onAnswerChange={handleAnswerChange} // handleAnswerChange accepts 'any' so it works with the object
      disabled={isSubmitting}
    />
  );
  case "vertical-multiplication":
  return (
    <VerticalMultiplication
      question={question}
      onAnswerChange={handleAnswerChange} // Validation is same as 'fill_blank' (object compare)
      disabled={isSubmitting}
    />
  );
      case "text-input":
      case "fill-in-blank":
        return (
          <div className="flex justify-center py-4 items-center gap-2">
             <input
              type="text"
              placeholder={question.placeholder || "Type answer..."}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="border-b-2 border-gray-300 text-xl p-2 text-center focus:border-[#0074e8] outline-none bg-transparent transition-colors w-full max-w-xs"
            />
            {question.unit && <span className="text-gray-500 font-medium">{question.unit}</span>}
          </div>
        );
      default:
        return <div className="p-4 text-red-500">Unknown Question Type</div>;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      
      {/* --- FIX START: Handle Prompt Object Correctly --- */}
      <div className="mb-6">
        {/* 1. Render Prompt Text */}
        <h2 className="text-xl font-bold text-gray-900 leading-snug">
          {/* {question.prompt.text} */}
        </h2>

        {/* 2. Render Prompt Image (Optional) */}
        {question.prompt.image && (
          <div className="mt-4">
            <img 
              src={question.prompt.image} 
              alt="Question Context" 
              className="rounded-lg max-h-64 object-contain mx-auto border border-gray-200"
            />
          </div>
        )}

        {/* 3. Render Prompt Audio (Optional) */}
        {question.prompt.audio && (
          <div className="mt-3">
            <audio controls src={question.prompt.audio} className="w-full h-8" />
          </div>
        )}
      </div>
      {/* --- FIX END --- */}

      {renderContent()}

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!currentAnswer || isSubmitting}
          className={`
            px-8 py-3 rounded-lg font-semibold transition-all
            ${!currentAnswer || isSubmitting 
              ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
              : "bg-[#0074e8] text-white hover:bg-[#0063c7] shadow-lg hover:shadow-xl translate-y-0 hover:-translate-y-0.5"
            }
          `}
        >
          {isSubmitting ? "Submitting..." : "Submit Answer"}
        </button>
      </div>
    </div>
  );
};