"use client";
import React, { useState, useEffect } from "react";
import { Question } from "../types";

interface FillInBlankPatternProps {
  question: Question;
  onAnswerChange: (answer: Record<string, string>) => void;
  disabled?: boolean;
}

export const FillInBlankPattern: React.FC<FillInBlankPatternProps> = ({
  question,
  onAnswerChange,
  disabled,
}) => {
  // State to hold values for all blanks: { "blank1": "3", "blank2": "30" }
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const { content } = question;
  if (!content) return <div>Missing content configuration.</div>;

  const rawText = content.stimulus.content; // The text with [blankX] placeholders

  const handleChange = (blankId: string, val: string) => {
    // 1. CHECK QUESTION TYPE OR CONFIG BEFORE BLOCKING TEXT
    // If the question is math, keep this. If it's language, remove it.
    const isMath = question.skillId.startsWith('math') || question.skillId.startsWith('g');
    
    if (isMath && !/^\d*$/.test(val)) return; 

    const newAnswers = { ...answers, [blankId]: val };
    setAnswers(newAnswers);
    onAnswerChange(newAnswers);
  };

  // Helper to parse a single line like: "[blank1] x 4 = 12"
  const renderLine = (line: string, lineIdx: number) => {
    // Split by the placeholder pattern [blankID]
    // The capturing group () keeps the delimiter in the result array so we can replace it
    const parts = line.split(/(\[blank\d+\])/g);

    return (
      <div key={lineIdx} className="flex items-center gap-3 text-2xl md:text-3xl font-medium text-gray-800 mb-4 font-sans flex-wrap">
        {parts.map((part, i) => {
          // Check if this string segment is a placeholder
          const match = part.match(/\[(blank\d+)\]/);
          
          if (match) {
            const blankId = match[1];
            // Find metadata for this blank (optional, to set width/hints)
            const blankMeta = content.blanks.find((b) => b.id === blankId);
            const widthClass = blankMeta && blankMeta.length > 3 ? "w-32" : "w-24";

            return (
              <input
                key={`${lineIdx}-${i}`}
                type="text"
                inputMode="numeric"
                disabled={disabled}
                placeholder="?"
                value={answers[blankId] || ""}
                onChange={(e) => handleChange(blankId, e.target.value)}
                className={`
                  ${widthClass} h-12 text-center border-2 rounded-md mx-1 outline-none transition-all shadow-sm
                  ${disabled 
                    ? "bg-gray-100 border-gray-200 text-gray-500" 
                    : "border-blue-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white text-blue-800"
                  }
                `}
              />
            );
          }
          
          // Otherwise, it's just static text (e.g. " x 4 = 12")
          // We trim slightly to avoid huge gaps if the split leaves whitespace
          if (!part.trim()) return null; 
          return <span key={i}>{part}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 select-none animate-in fade-in">
      <div className="bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gray-100 inline-block">
        {/* Render line by line based on newlines in the generator output */}
        {rawText.split('\n').map((line, idx) => renderLine(line, idx))}
      </div>
    </div>
  );
};