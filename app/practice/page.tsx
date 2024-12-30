"use client";

import { useQuestions } from "@/lib/hooks/use-questions";
import { usePracticeSession } from "@/lib/hooks/use-practice-session";
import { QuestionCard } from "@/app/components/question-card";
import { PracticeControls } from "@/app/components/practice-controls";

export default function PracticePage() {
  const { questions, loading, error } = useQuestions();
  const { currentQuestion, showExplanation, handleAnswer, handleNext } =
    usePracticeSession(questions);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">No questions available.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <PracticeControls />
        <QuestionCard
          question={currentQuestion}
          onAnswer={handleAnswer}
          showExplanation={showExplanation}
          onNext={handleNext}
        />
      </div>
    </main>
  );
}
