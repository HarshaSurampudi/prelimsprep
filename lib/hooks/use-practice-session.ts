"use client";

import { useState, useEffect, useCallback } from "react";
import { Question, UserResponse } from "@/lib/types";
import { selectNextQuestion } from "@/lib/question-selection";
import { useStorage } from "@/lib/hooks/use-storage";

export function usePracticeSession(questions: Question[]) {
  const [responses, setResponses, isLoading] = useStorage<UserResponse[]>(
    "responses",
    []
  );
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Memoize the next question selection
  useEffect(() => {
    if (!isLoading && !currentQuestion && !showExplanation) {
      const nextQuestion = selectNextQuestion(questions, responses);
      if (nextQuestion) {
        setCurrentQuestion(nextQuestion);
      }
    }
  }, [questions, currentQuestion, showExplanation, isLoading, responses]);

  const handleAnswer = useCallback(
    (answer: string) => {
      if (!currentQuestion) return;

      const response: UserResponse = {
        question: currentQuestion,
        userAnswer: answer,
        isCorrect: answer === currentQuestion.correct_answer,
        timestamp: Date.now(),
      };

      setResponses((prev: UserResponse[]) => [...prev, response]);
      setShowExplanation(true);
    },
    [currentQuestion, setResponses]
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
