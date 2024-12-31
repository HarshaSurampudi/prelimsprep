"use client";

import { useState, useEffect, useCallback } from "react";
import { Question, UserResponse } from "@/lib/types";
import { selectNextQuestion } from "@/lib/question-selection";
import { saveUserResponses } from "@/lib/firebase/storage";
import { useAuth } from "@/lib/context/auth-context";

export function usePracticeSession(
  questions: Question[],
  responses: UserResponse[]
) {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Memoize the next question selection
  useEffect(() => {
    if (!currentQuestion && !showExplanation) {
      const nextQuestion = selectNextQuestion(questions, responses);
      if (nextQuestion) {
        setCurrentQuestion(nextQuestion);
      }
    }
  }, [questions, currentQuestion, showExplanation, responses]);

  const handleAnswer = useCallback(
    async (answer: string) => {
      if (!currentQuestion || !user) return;
      setShowExplanation(true);
    },
    [currentQuestion, user]
  );

  const handleNext = useCallback(() => {
    setShowExplanation(false);
    setCurrentQuestion(null);
  }, []);

  return {
    currentQuestion,
    showExplanation,
    handleAnswer,
    handleNext,
  };
}
