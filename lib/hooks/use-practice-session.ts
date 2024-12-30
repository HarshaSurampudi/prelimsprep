"use client";

import { useState, useEffect } from "react";
import { Question, UserResponse } from "@/lib/types";
import { selectNextQuestion } from "@/lib/question-selection";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";

export function usePracticeSession(questions: Question[]) {
  const [responses, setResponses, isLoading] = useLocalStorage<UserResponse[]>(
    "responses",
    []
  );
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (!isLoading && !currentQuestion && !showExplanation) {
      const nextQuestion = selectNextQuestion(questions);
      if (nextQuestion) {
        setCurrentQuestion(nextQuestion);
      }
    }
  }, [questions, currentQuestion, showExplanation, isLoading]);

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return;

    const attemptNumber =
      responses.filter(
        (r) => r.question.question_text === currentQuestion.question_text
      ).length + 1;

    const response: UserResponse = {
      question: currentQuestion,
      userAnswer: answer,
      isCorrect: answer === currentQuestion.correct_answer,
      timestamp: Date.now(),
    };

    const newResponses = [...responses, response];
    setResponses(newResponses);
    localStorage.setItem("responses", JSON.stringify(newResponses));
    setShowExplanation(true);

    console.log(`Answered question on attempt ${attemptNumber}`);
  };

  const handleNext = () => {
    setShowExplanation(false);
    const nextQuestion = selectNextQuestion(questions);
    setCurrentQuestion(nextQuestion);
  };

  return {
    currentQuestion,
    showExplanation,
    handleAnswer,
    handleNext,
  };
}
