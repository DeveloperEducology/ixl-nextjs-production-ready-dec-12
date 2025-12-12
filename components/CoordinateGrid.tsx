"use client";
import React, { useState, useRef } from "react";
import { Question } from "./types";

interface CoordinateGridProps {
  question: Question;
  onAnswerChange: (points: { x: number; y: number }[]) => void;
  disabled?: boolean;
}

export const CoordinateGrid: React.FC<CoordinateGridProps> = ({
  question,
  onAnswerChange,
  disabled,
}) => {
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  // When the question ID changes, wipe the points array clean.
  React.useEffect(() => {
    setPoints([]);
  }, [question.id]);

  const {
    xRange = [-10, 10],
    yRange = [-10, 10],
    gridStep = 1,
  } = question.graphConfig || {};
  
  const width = 400;
  const height = 400;

  // --- Helpers: Coordinate Conversion ---
  const toPixelX = (x: number) =>
    ((x - xRange[0]) / (xRange[1] - xRange[0])) * width;
    
  const toPixelY = (y: number) =>
    height - ((y - yRange[0]) / (yRange[1] - yRange[0])) * height;

  const toMathX = (px: number) => {
    const raw = xRange[0] + (px / width) * (xRange[1] - xRange[0]);
    return Math.round(raw / gridStep) * gridStep;
  };

  const toMathY = (py: number) => {
    const raw = yRange[0] + ((height - py) / height) * (yRange[1] - yRange[0]);
    return Math.round(raw / gridStep) * gridStep;
  };

  // --- Interaction Handler ---
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const mathX = toMathX(clickX);
    const mathY = toMathY(clickY);

    // Toggle point logic
    const existingIndex = points.findIndex(
      (p) => p.x === mathX && p.y === mathY
    );
    let newPoints;

    if (existingIndex >= 0) {
      newPoints = points.filter((_, i) => i !== existingIndex);
    } else {
      newPoints = [...points, { x: mathX, y: mathY }];
    }

    setPoints(newPoints);
    onAnswerChange(newPoints);
  };

  // --- Determine Axis Locations (for label placement) ---
  // If the axis (0) is within view, place numbers there.
  // Otherwise, if the graph is just a quadrant (e.g. 0 to 10), stick labels to the edge.
  const yAxisXPos =
    xRange[0] <= 0 && xRange[1] >= 0 ? toPixelX(0) : toPixelX(xRange[0]);
  const xAxisYPos =
    yRange[0] <= 0 && yRange[1] >= 0 ? toPixelY(0) : toPixelY(yRange[0]);

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          onClick={handleClick}
          className={`cursor-crosshair ${
            disabled ? "pointer-events-none opacity-75" : ""
          }`}
        >
          {/* 1. Vertical Grid Lines & X-Axis Labels */}
          {Array.from({ length: (xRange[1] - xRange[0]) / gridStep + 1 }).map(
            (_, i) => {
              const xVal = xRange[0] + i * gridStep;
              const px = toPixelX(xVal);
              const isAxis = xVal === 0;

              return (
                <React.Fragment key={`v-${i}`}>
                  {/* Grid Line */}
                  <line
                    x1={px}
                    y1={0}
                    x2={px}
                    y2={height}
                    stroke={isAxis ? "#374151" : "#e5e7eb"} // Dark gray for axis, light for grid
                    strokeWidth={isAxis ? 2 : 1}
                  />
                  {/* Label (Skip 0 to avoid collision with Y-axis label, or handle specifically) */}
                  <text
                    x={px}
                    y={xAxisYPos + 18} // Offset below the X-axis
                    textAnchor="middle"
                    className="text-[10px] font-sans fill-gray-500 font-medium"
                    style={{ pointerEvents: "none" }}
                  >
                    {xVal}
                  </text>
                </React.Fragment>
              );
            }
          )}

          {/* 2. Horizontal Grid Lines & Y-Axis Labels */}
          {Array.from({ length: (yRange[1] - yRange[0]) / gridStep + 1 }).map(
            (_, i) => {
              const yVal = yRange[0] + i * gridStep;
              const py = toPixelY(yVal);
              const isAxis = yVal === 0;

              // Don't render "0" again on the Y loop to prevent overlap text
              if (yVal === 0) {
                 // We only render the line, not the text (X-loop handled the "0" text)
                 return (
                   <line
                    key={`h-${i}`}
                    x1={0}
                    y1={py}
                    x2={width}
                    y2={py}
                    stroke="#374151"
                    strokeWidth={2}
                  />
                 );
              }

              return (
                <React.Fragment key={`h-${i}`}>
                  {/* Grid Line */}
                  <line
                    x1={0}
                    y1={py}
                    x2={width}
                    y2={py}
                    stroke={isAxis ? "#374151" : "#e5e7eb"}
                    strokeWidth={isAxis ? 2 : 1}
                  />
                  {/* Label */}
                  <text
                    x={yAxisXPos - 8} // Offset to left of Y-axis
                    y={py + 4}        // Vertically centered
                    textAnchor="end"
                    className="text-[10px] font-sans fill-gray-500 font-medium"
                    style={{ pointerEvents: "none" }}
                  >
                    {yVal}
                  </text>
                </React.Fragment>
              );
            }
          )}

          {/* 3. Plotted Points (Rendered last to be on top) */}
          {points.map((p, idx) => (
            <g key={idx}>
              {/* Outer glow for better visibility */}
              <circle
                cx={toPixelX(p.x)}
                cy={toPixelY(p.y)}
                r={8}
                fill="rgba(0, 116, 232, 0.2)"
              />
              {/* The main point */}
              <circle
                cx={toPixelX(p.x)}
                cy={toPixelY(p.y)}
                r={5}
                fill="#0074e8"
                stroke="white"
                strokeWidth={2}
              />
            </g>
          ))}
        </svg>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Click intersections to plot points
      </p>
    </div>
  );
};