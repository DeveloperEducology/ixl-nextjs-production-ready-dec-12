"use client";
import React, { useState, useRef, useEffect } from "react";
import { Question } from "./types";

interface NumberLineProps {
  question: Question;
  onAnswerChange: (value: number) => void;
  disabled?: boolean;
}

export const NumberLine: React.FC<NumberLineProps> = ({
  question,
  onAnswerChange,
  disabled,
}) => {
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    min = 0,
    max = 10,
    step = 1,
    labels,
  } = question.numberLineConfig || {};

  // Reset local state when question changes
  useEffect(() => {
    setSelectedValue(null);
  }, [question.id]);

  const handleInteract = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX =
      "touches" in e
        ? e.touches[0].clientX
        : (e as React.MouseEvent).clientX;

    const relativeX = Math.max(
      0,
      Math.min(1, (clientX - rect.left) / rect.width)
    );

    // 1. Calculate raw value
    const rawValue = min + relativeX * (max - min);

    // 2. Snap to step
    const snappedUnfixed = Math.round(rawValue / step) * step;

    // 3. FIX: Correct floating point precision
    // Count how many decimals are in the 'step' (e.g. 0.1 => 1 decimal)
    const decimals = step.toString().split(".")[1]?.length || 0;
    
    // .toFixed() returns a string string with exact decimals, Number() converts it back
    // e.g. "1.90000001" -> "1.9" -> 1.9
    const finalValue = Number(snappedUnfixed.toFixed(decimals));

    setSelectedValue(finalValue);
    onAnswerChange(finalValue);
  };

  return (
    <div className="w-full pt-8 pb-4 px-4 select-none touch-none">
      <div
        ref={containerRef}
        className={`relative h-12 flex items-center ${
          !disabled && "cursor-pointer"
        }`}
        onClick={handleInteract}
        onTouchStart={handleInteract}
        onTouchMove={handleInteract}
      >
        {/* The Main Gray Line */}
        <div className="absolute w-full h-1 bg-gray-300 rounded-full" />

        {/* Ticks and Labels */}
        {Array.from({ length: Math.round((max - min) / step) + 1 }).map(
          (_, i) => {
            // FIX: Ensure ticks don't suffer from floating point errors too
            const decimalCount = step.toString().split(".")[1]?.length || 0;
            const rawVal = min + i * step;
            const val = Number(rawVal.toFixed(decimalCount));

            const leftPercent = ((val - min) / (max - min)) * 100;
            const isMajor = labels ? labels.includes(val) : i % 1 === 0;

            // Only render label if it's "Major" or specifically in the labels list
            // If no 'labels' provided, default to showing integers only if step < 1
            const showLabel = labels
              ? labels.includes(val)
              : step >= 1
              ? true
              : Number.isInteger(val);

            return (
              <div
                key={val}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${leftPercent}%`,
                  transform: "translateX(-50%)",
                }}
              >
                <div
                  className={`w-0.5 bg-gray-400 ${
                    showLabel ? "h-4 mt-[-6px]" : "h-2 mt-[-2px]"
                  }`}
                />
                <span className="mt-2 text-xs font-medium text-gray-500 select-none">
                  {showLabel ? val : ""}
                </span>
              </div>
            );
          }
        )}

        {/* The Dragged Handle */}
        {selectedValue !== null && (
          <div
            className="absolute top-1/2 w-6 h-6 bg-[#0074e8] rounded-full shadow-md border-2 border-white transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out z-10"
            style={{
              left: `${((selectedValue - min) / (max - min)) * 100}%`,
            }}
          >
            {/* Value Tooltip */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs font-bold py-1.5 px-3 rounded shadow-lg whitespace-nowrap">
              {selectedValue}
              {/* Little triangle pointer for the tooltip */}
              <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};