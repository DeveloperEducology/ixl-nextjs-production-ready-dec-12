"use client";
import React, { useState } from "react";
import { Check } from "lucide-react";
import { Question } from "./types";

interface MultipleChoiceProps {
  question: Question;
  onAnswerChange: (answer: string[]) => void;
  disabled?: boolean;
}

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  question,
  onAnswerChange,
  disabled,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleOption = (id: string) => {
    if (disabled) return;

    let newSelection = [];
    if (question.multiSelect) {
      newSelection = selectedIds.includes(id)
        ? selectedIds.filter((item) => item !== id)
        : [...selectedIds, id];
    } else {
      newSelection = [id];
    }

    setSelectedIds(newSelection);
    onAnswerChange(newSelection);
  };

  return (
    <div className="w-full">
      {/* Layout:
        - Uses Grid to force items into rows.
        - 'grid-cols-2 md:grid-cols-4': 2 per row on mobile, 4 per row on desktop.
        - You can adjust grid-cols based on how many items you typically have.
      */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {question.options?.map((option) => {
          const isSelected = selectedIds.includes(option.id);

          return (
            <div
              key={option.id}
              onClick={() => toggleOption(option.id)}
              className={`
                relative group flex flex-col items-center justify-center 
                p-4 min-h-[100px] rounded-xl border-2 cursor-pointer transition-all duration-200 ease-in-out select-none
                ${
                  isSelected
                    ? "border-[#0074e8] bg-[#f0f7ff] shadow-[0_0_0_2px_rgba(0,116,232,0.2)]"
                    : "border-gray-200 bg-white hover:border-[#a0cdf9] hover:bg-gray-50 hover:shadow-sm"
                }
                ${disabled ? "opacity-60 cursor-not-allowed grayscale" : ""}
              `}
            >
              {/* Optional: Small badge in corner to confirm selection without a radio button */}
              {isSelected && (
                <div className="absolute top-2 right-2 bg-[#0074e8] rounded-full p-0.5 animate-in fade-in zoom-in duration-200">
                  <Check size={12} className="text-white" strokeWidth={3} />
                </div>
              )}

              {/* Image Support - Centered */}
              {option.image && (
                <img
                  src={option.image}
                  alt={option.content}
                  className="w-full h-24 object-contain mb-3 rounded-md"
                />
              )}

              {/* Text Content - Centered */}
              <span
                className={`text-center font-semibold text-lg leading-tight
                  ${isSelected ? "text-[#0056b3]" : "text-gray-700 group-hover:text-gray-900"}
                `}
              >
                {option.content}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Helper text for Multi-select */}
      {question.multiSelect && (
        <p className="text-center text-xs text-gray-400 mt-3 font-medium uppercase tracking-wide">
          Select all that apply
        </p>
      )}
    </div>
  );
};