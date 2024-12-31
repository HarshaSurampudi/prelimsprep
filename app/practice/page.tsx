"use client";

import { useQuestions } from "@/lib/hooks/use-questions";
import { usePracticeSession } from "@/lib/hooks/use-practice-session";
import { QuestionCard } from "@/app/components/question-card";
import { PracticeControls } from "@/app/components/practice-controls";
import { QuestionSkeleton } from "@/app/components/skeletons/question-skeleton";
import { useAuth } from "@/lib/context/auth-context";
import { useEffect, useState } from "react";
import { Question, UserResponse } from "@/lib/types";
import { getUserResponses, saveUserResponses } from "@/lib/firebase/storage";

export default function PracticePage() {
  const { user } = useAuth();
  const { questions, loading, error } = useQuestions();
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionStartTime] = useState<Date>(new Date());
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  useEffect(() => {
    async function loadResponses() {
      if (user) {
        const userResponses = await getUserResponses(user.uid);
        setResponses(userResponses);
      }
      setIsLoading(false);
    }
    loadResponses();
  }, [user]);

  const { currentQuestion, showExplanation, handleAnswer, handleNext } =
    usePracticeSession(questions, responses);

  const handleQuestionAnswer = async (selectedAnswer: string) => {
    if (!currentQuestion || !user) return;
    const response: UserResponse = {
      question: currentQuestion,
      userAnswer: selectedAnswer,
      isCorrect: selectedAnswer === currentQuestion.correct_answer,
      timestamp: Date.now(),
    };
    const newResponses = [...responses, response];
    await saveUserResponses(user.uid, newResponses);
    setResponses(newResponses);
    await handleAnswer(selectedAnswer);
    setQuestionsAnswered((prev) => prev + 1);
  };

  if (isLoading || loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-2 mt-12">
        <div className="max-w-4xl mx-auto">
          <PracticeControls
            startTime={sessionStartTime}
            questionsAnswered={questionsAnswered}
          />
          <QuestionSkeleton />
        </div>
      </main>
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

  const calculateAttemptNumber = (
    question: Question,
    responses: UserResponse[]
  ) => {
    const previousResponses = showExplanation
      ? responses.slice(0, -1) // Exclude the current attempt if showing explanation
      : responses;
    return (
      previousResponses.filter(
        (r: UserResponse) => r.question.question_text === question.question_text
      ).length + 1
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <PracticeControls
          startTime={sessionStartTime}
          questionsAnswered={questionsAnswered}
        />
        <QuestionCard
          question={currentQuestion}
          onAnswer={handleQuestionAnswer}
          showExplanation={showExplanation}
          onNext={handleNext}
          attemptNumber={calculateAttemptNumber(currentQuestion, responses)}
        />
      </div>
    </main>
  );
}
