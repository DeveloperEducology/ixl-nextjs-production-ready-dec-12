import React from "react";
import type { Metadata } from "next";
import QuizClient from "./QuizClient"; // Import the client component
import { generateQuestion, QUESTION_GENERATORS } from "@/services/questionService";

interface PageProps {
  params: { skillId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// 1. Dynamic SEO Metadata
export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const skillId = params.skillId;
  const skillName = (searchParams.name as string) || skillId;
  const gradeLabel = (searchParams.gradeLabel as string) || "Grade School";
  
  return {
    title: `Practice ${skillName} | ${gradeLabel} Math | SkillMaster`,
    description: `Master ${skillName} with interactive questions, step-by-step explanations, and instant feedback. Perfect for ${gradeLabel} students.`,
    openGraph: {
        title: `Master ${skillName} on SkillMaster`,
        description: `Interactive ${gradeLabel} practice for ${skillName}.`,
    }
  };
}

// 2. Server Component
export default function QuizPage({ params, searchParams }: PageProps) {
  const { skillId } = params;
  
  // Extract query params for display
  const subject = (searchParams.subject as string) || "Math";
  const gradeLabel = (searchParams.gradeLabel as string) || "Grade";
  const skillName = (searchParams.name as string) || skillId;
  const skillDesc = (searchParams.desc as string) || "Practice your skills";

  // 3. GENERATE FIRST QUESTION ON SERVER
  // This ensures Google sees a real math problem, not a loading spinner.
  let initialQuestion = null;
  try {
    if (QUESTION_GENERATORS[skillId]) {
      // Generate with 'medium' difficulty for the landing view
      initialQuestion = generateQuestion(skillId, "medium");
    }
  } catch (e) {
    console.error("Server-side generation error:", e);
  }

  // 4. Pass data to Client Component
  return (
    <QuizClient
      skillId={skillId}
      skillName={skillName}
      skillDesc={skillDesc}
      subject={subject}
      gradeLabel={gradeLabel}
      initialQuestion={initialQuestion}
    />
  );
}
