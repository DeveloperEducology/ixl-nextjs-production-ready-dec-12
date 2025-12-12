"use client";
import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  rectSortingStrategy, // Best for wrapping rows/grids
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, GripHorizontal } from "lucide-react";
import { Question, SortingItem } from "./types";

// --- Sub Component ---
interface SortableItemProps {
  id: string;
  content: string;
  layout: "row" | "column";
}

const SortableItem = ({ id, content, layout }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
  };

  const isRow = layout === "row";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative bg-white border rounded-lg shadow-sm touch-none select-none transition-all
        ${isDragging ? "shadow-xl ring-2 ring-[#0074e8] opacity-90 z-50" : "border-gray-200 hover:border-[#0074e8]"}
        ${
          isRow
            ? "flex flex-col items-center justify-center p-4 w-32 h-32 text-center" // Box style for Row
            : "flex flex-row items-center p-4 w-full" // Bar style for Column
        }
      `}
    >
      {/* Handle Icon - Position changes based on layout */}
      <div
        {...attributes}
        {...listeners}
        className={`
          cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600
          ${isRow ? "mb-2" : "mr-3"}
        `}
      >
        {isRow ? <GripHorizontal size={20} /> : <GripVertical size={20} />}
      </div>

      <span className="font-medium text-gray-700 leading-tight select-none pointer-events-none">
        {content}
      </span>
    </div>
  );
};

// --- Main Component ---
interface SortableListProps {
  question: Question;
  onAnswerChange: (orderedIds: string[]) => void;
  disabled?: boolean;
  layout?: "row" | "column"; // New Prop
}

export const SortableList: React.FC<SortableListProps> = ({
  question,
  onAnswerChange,
  disabled,
  layout = "column", // Default to column if not specified
}) => {
  // Use state to track items. Sync with question.items on mount/change.
  const [items, setItems] = useState<SortingItem[]>([]);

  useEffect(() => {
    if (question.items) {
      setItems(question.items);
    }
  }, [question.items]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (disabled) return;
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      onAnswerChange(newItems.map((i) => i.id));
    }
  };

  // Choose strategy based on layout
  // 'rectSortingStrategy' is safer for rows because it handles line wrapping nicely on mobile
  const strategy =
    layout === "row" ? rectSortingStrategy : verticalListSortingStrategy;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((i) => i.id)} strategy={strategy}>
        <div
          className={`
            ${
              layout === "row"
                ? "flex flex-row flex-wrap gap-4 justify-center" // Row Layout
                : "flex flex-col gap-3" // Column Layout
            }
          `}
        >
          {items.map((item) => (
            <SortableItem
              key={item.id}
              id={item.id}
              content={item.content}
              layout={layout}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};