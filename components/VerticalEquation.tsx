"use client";
import React, { useState, useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { Question } from "../types";

interface VerticalEquationProps {
  question: Question;
  onAnswerChange: (val: string) => void;
  disabled?: boolean;
}

export const VerticalEquation: React.FC<VerticalEquationProps> = ({
  question,
  onAnswerChange,
  disabled,
}) => {
  const { top, bottom, operator } = question.verticalConfig || {
    top: "0",
    bottom: "0",
    operator: "+",
  };

  // 1. Determine Grid Size
  // If we have a correct answer, use its length. Otherwise, assume max length + 1 for potential carry.
  const maxLength = question.correctAnswer
    ? question.correctAnswer.length
    : Math.max(top.length, bottom.length) + 1;

  // 2. Pad numbers with empty strings so they align to the right
  // e.g. if Max is 5, and Top is "123", we get ["", "", "1", "2", "3"]
  const padNumber = (str: string, length: number) => {
    const arr = str.split("");
    while (arr.length < length) arr.unshift("");
    return arr;
  };

  const topDigits = padNumber(top, maxLength);
  const bottomDigits = padNumber(bottom, maxLength);

  // 3. State
  const [userDigits, setUserDigits] = useState<string[]>(Array(maxLength).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 4. Focus the right-most input (Ones place) on mount
  useEffect(() => {
    if (!disabled && inputRefs.current[maxLength - 1]) {
      inputRefs.current[maxLength - 1]?.focus();
    }
  }, [disabled, maxLength]);

  // 5. Handlers
  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return; // Numbers only

    const newDigits = [...userDigits];
    newDigits[index] = val.slice(-1); // Take last char
    setUserDigits(newDigits);

    // Join and clean for submission
    // We join all digits, then parse Int to remove leading zeros (e.g. "015" -> "15")
    const rawAnswer = newDigits.join("");
    // If empty, don't submit "0", just submit empty
    if (rawAnswer.trim() === "") {
        onAnswerChange("");
    } else {
        onAnswerChange(String(parseInt(rawAnswer) || ""));
    }

    // AUTO-MOVE: Right-to-Left (Standard Math Solving Order)
    // If value entered, move to index - 1 (Left)
    if (val && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Backspace Logic
    if (e.key === "Backspace") {
      if (!userDigits[index] && index < maxLength - 1) {
        // If empty, move Right (to previous place value)
        e.preventDefault();
        inputRefs.current[index + 1]?.focus();
      }
    }
    // Arrow Key Navigation
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < maxLength - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 select-none animate-in fade-in slide-in-from-bottom-2">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 inline-block">
        
        {/* THE GRID */}
        {/* We use grid-cols with fit-content to tightly pack numbers */}
        <div 
            className="grid gap-x-2 gap-y-1" 
            style={{ gridTemplateColumns: `auto repeat(${maxLength}, minmax(40px, auto))` }}
        >
          {/* --- Row 1: Top Number --- */}
          <div className="col-start-1"></div> {/* Spacer for operator column */}
          {topDigits.map((d, i) => (
            <div key={`t-${i}`} className="text-4xl font-mono font-medium text-gray-700 text-center w-12 h-12 flex items-center justify-center">
              {d}
            </div>
          ))}

          {/* --- Row 2: Bottom Number & Operator --- */}
          <div className="text-3xl font-bold text-gray-800 flex items-center justify-center pb-2 border-b-4 border-black">
            {operator}
          </div>
          {bottomDigits.map((d, i) => (
            <div key={`b-${i}`} className="text-4xl font-mono font-medium text-gray-700 text-center w-12 h-12 flex items-center justify-center border-b-4 border-black pb-2">
              {d}
            </div>
          ))}

          {/* --- Row 3: Inputs --- */}
          <div className="col-start-1"></div> {/* Spacer */}
          {userDigits.map((digit, i) => {
            // Logic for comma visibility (every 3rd digit from right, but not at start)
            const reverseIndex = maxLength - 1 - i;
            const showComma = reverseIndex > 0 && reverseIndex % 3 === 0;

            return (
              <div key={`in-${i}`} className="relative flex justify-center pt-2">
                <input
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  disabled={disabled}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  placeholder={disabled ? "" : ""} // Optional placeholder
                  className={`
                    w-12 h-14 text-center text-3xl font-bold rounded-lg outline-none transition-all shadow-sm
                    ${
                      disabled
                        ? "bg-gray-50 text-gray-400 border border-gray-200"
                        : "bg-white text-blue-600 border-2 border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:z-10"
                    }
                  `}
                />
                
                {/* Visual Comma */}
                {showComma && (
                    <div className="absolute -right-2 bottom-3 text-2xl text-gray-400 pointer-events-none font-serif">,</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {!disabled && (
        <div className="mt-6 flex items-center gap-2 text-sm text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
            <ArrowUp size={14} />
            <span>Type from right to left</span>
        </div>
      )}
    </div>
  );
};