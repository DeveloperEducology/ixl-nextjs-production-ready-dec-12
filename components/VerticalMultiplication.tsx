"use client";
import React, { useState, useRef } from "react";
import { Question } from "../types";

interface VerticalMultiplicationProps {
  question: Question;
  onAnswerChange: (answer: Record<string, string>) => void;
  disabled?: boolean;
}

export const VerticalMultiplication: React.FC<VerticalMultiplicationProps> = ({
  question,
  onAnswerChange,
  disabled,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const { rows, maxLength } = question.content as any;

  const handleChange = (id: string, val: string) => {
    if (!/^\d*$/.test(val)) return;

    const newAnswers = { ...answers, [id]: val.slice(-1) };
    setAnswers(newAnswers);
    onAnswerChange(newAnswers);

    // Auto-focus logic: Move left (Standard math entry direction)
    // Find current index in the result row
    const resultRow = rows[rows.length - 1];
    const currentIdx = resultRow.cells.findIndex((c: any) => c.id === id);
    if (val && currentIdx > 0) {
      const prevId = resultRow.cells[currentIdx - 1].id;
      inputRefs.current[prevId]?.focus();
    }
  };

  return (
    <div className="flex justify-center py-6 animate-in fade-in select-none">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 inline-block">
        <div className="flex flex-col items-end gap-1 font-mono text-3xl text-gray-800">
          
          {rows.map((row: any, rIdx: number) => (
            <div key={rIdx} className={`flex items-center justify-end w-full ${row.type.includes('result') ? 'border-t-4 border-black pt-2' : ''}`}>
              
              {/* Operator (x or +) displayed on the far left of the row */}
              {row.operator && (
                <div className="mr-4 font-bold text-2xl text-gray-600">{row.operator}</div>
              )}

              <div className="flex gap-2 justify-end min-w-[200px]">
                {row.cells.map((cell: any, cIdx: number) => {
                  if (cell.isInput) {
                    return (
                      <input
                        key={cell.id}
                        ref={(el) => { inputRefs.current[cell.id] = el; }}
                        type="text"
                        inputMode="numeric"
                        disabled={disabled}
                        value={answers[cell.id] || ""}
                        onChange={(e) => handleChange(cell.id, e.target.value)}
                        className={`
                          w-10 h-14 text-center text-2xl font-bold rounded border-2 outline-none transition-all
                          ${disabled 
                            ? "bg-gray-50 border-gray-200 text-gray-500" 
                            : "bg-white border-blue-300 text-blue-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                          }
                        `}
                      />
                    );
                  }
                  
                  // Static Digit
                  return (
                    <div key={cIdx} className={`w-10 h-12 flex items-center justify-center ${row.type === 'factor-operator' || row.type === 'partial-operator' ? 'border-b-4 border-black pb-1' : ''}`}>
                      {cell.val}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};