"use client";

import { useSearchParams } from "next/navigation";
import { useQuestions } from "@/hooks/use-questions";
import { usePracticeSession } from "@/hooks/use-practice-session";
import { useSessionStats } from "@/hooks/use-session-stats";
import { QuestionCard } from "@/app/components/question-card";
import { PracticeControls } from "@/app/components/practice-controls";
import { useAuth } from "@/hooks/use-auth";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { Topic } from "@/lib/types";

export default function PracticePage() {
  const searchParams = useSearchParams();
  const topicParam = searchParams.get("topic") as Topic | null;

  const { user } = useAuth(true);
  const { bookmarkedQuestions, toggleBookmark } = useBookmarks(
    user?.id ?? null
  );
  const {
    questions,
    loading: questionsLoading,
    error: questionsError,
  } = useQuestions();

  const { currentQuestion, showExplanation, handleAnswer, handleNext } =
    usePracticeSession(questions, user?.id ?? null, topicParam ?? undefined);
  const { formattedTime, questionsAnswered, incrementQuestionsAnswered } =
    useSessionStats();

  const handleQuestionAnswer = (answer: string) => {
    handleAnswer(answer);
    incrementQuestionsAnswered();
  };

  if (!user || questionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (questionsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">{questionsError}</p>
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
    <main className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <PracticeControls
          elapsedTime={formattedTime}
          questionsAnswered={questionsAnswered}
        />
        <QuestionCard
          question={currentQuestion}
          onAnswer={handleQuestionAnswer}
          showExplanation={showExplanation}
          onNext={handleNext}
          isBookmarked={bookmarkedQuestions.includes(currentQuestion.id)}
          onToggleBookmark={() => toggleBookmark(currentQuestion.id)}
        />
      </div>
    </main>
  );
}
