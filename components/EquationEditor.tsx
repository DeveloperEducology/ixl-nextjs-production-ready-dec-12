"use client";
import React, { useState } from "react";
import { Delete } from "lucide-react";

interface EquationEditorProps {
  onAnswerChange: (val: string) => void;
  disabled?: boolean;
}

// 1. Group keys by functionality
const NUMBERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"];

const VARIABLES = [
  { label: "x", val: "x" },
  { label: "y", val: "y" },
  { label: "( )", val: "()" }, // Inserts both parens for convenience
];

// 2. Specialized Math Keys
const MATH_OPS = [
  { label: "x²", val: "^2", desc: "Square" },      // Inserts power of 2
  { label: "½", val: "/", desc: "Fraction" },      // Visual cue for division/fraction
  { label: "√", val: "sqrt(", desc: "Root" },
];

const BASIC_OPS = [
  { label: "+", val: "+" },
  { label: "-", val: "-" },
  { label: "×", val: "*" },
  { label: "=", val: "=" },
];

export const EquationEditor: React.FC<EquationEditorProps> = ({ onAnswerChange, disabled }) => {
  const [value, setValue] = useState("");

  const handleInput = (char: string) => {
    if (disabled) return;
    setValue((prev) => {
      const newVal = prev + char;
      onAnswerChange(newVal);
      return newVal;
    });
  };

  const handleBackspace = () => {
    if (disabled) return;
    setValue((prev) => {
      const newVal = prev.slice(0, -1);
      onAnswerChange(newVal);
      return newVal;
    });
  };

  // Allow typing from physical keyboard
  const handlePhysicalInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const val = e.target.value;
    setValue(val);
    onAnswerChange(val);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-50 p-4 rounded-xl border border-gray-200">
      
      {/* Display Area */}
      <div className="bg-white border-2 border-gray-300 rounded-lg mb-4 flex items-center overflow-hidden focus-within:border-[#0074e8] focus-within:ring-1 focus-within:ring-[#0074e8] transition-all shadow-inner">
        <input 
            type="text"
            value={value}
            onChange={handlePhysicalInput}
            disabled={disabled}
            className="w-full text-right text-2xl font-mono tracking-widest p-4 outline-none text-gray-800 bg-transparent placeholder-gray-300"
            placeholder="Type equation..."
            autoComplete="off"
        />
      </div>

      <div className="flex gap-2">
        {/* LEFT COLUMN: Numbers & Variables */}
        <div className="grid grid-cols-3 gap-2 flex-[2]">
            {/* Numbers 1-9 */}
            {NUMBERS.slice(0, 9).map((num) => (
              <button
                key={num}
                onClick={() => handleInput(num)}
                disabled={disabled}
                className="h-12 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-blue-50 active:translate-y-0.5 text-xl font-bold text-gray-700 transition-all"
              >
                {num}
              </button>
            ))}
            
            {/* Bottom Row: . 0 Backspace-Alternative? */}
            <button
               onClick={() => handleInput(".")}
               disabled={disabled}
               className="h-12 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-blue-50 text-xl font-bold text-gray-700 pb-2"
            >
              .
            </button>
            <button
               onClick={() => handleInput("0")}
               disabled={disabled}
               className="h-12 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-blue-50 text-xl font-bold text-gray-700"
            >
              0
            </button>
            
            {/* Variables Row */}
            {VARIABLES.map((v) => (
              <button
                key={v.label}
                onClick={() => handleInput(v.val)}
                disabled={disabled}
                className="h-12 bg-gray-100 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-200 text-lg font-serif italic text-gray-800"
              >
                {v.label}
              </button>
            ))}
        </div>

        {/* RIGHT COLUMN: Advanced Math & Ops */}
        <div className="flex flex-col gap-2 flex-1">
           {/* Backspace */}
           <button
            onClick={handleBackspace}
            disabled={disabled}
            className="h-12 bg-red-50 border border-red-100 rounded-lg text-red-600 flex items-center justify-center hover:bg-red-100 active:translate-y-0.5 transition-all"
          >
            <Delete size={20} />
          </button>

          {/* Advanced Math Row (Fraction / Square) */}
          <div className="grid grid-cols-2 gap-2">
            {MATH_OPS.map((op) => (
              <button
                key={op.label}
                onClick={() => handleInput(op.val)}
                disabled={disabled}
                title={op.desc}
                className="h-12 bg-indigo-50 border border-indigo-100 rounded-lg shadow-sm hover:bg-indigo-100 text-sm font-bold text-indigo-700 flex items-center justify-center"
              >
                {/* Render Fraction Icon nicely */}
                {op.label === "½" ? (
                   <span className="flex flex-col leading-none text-xs">
                     <span className="border-b border-indigo-700 pb-[1px] mb-[1px]">◻</span>
                     <span>◻</span>
                   </span>
                ) : (
                  op.label
                )}
              </button>
            ))}
          </div>

          {/* Basic Operators */}
          <div className="grid grid-cols-2 gap-2">
            {BASIC_OPS.map((op) => (
              <button
                key={op.label}
                onClick={() => handleInput(op.val)}
                disabled={disabled}
                className="h-12 bg-blue-50 border border-blue-100 rounded-lg shadow-sm hover:bg-blue-100 text-xl font-medium text-blue-700"
              >
                {op.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};