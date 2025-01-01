"use client";

import { useState, useEffect } from "react";
import { Question, Topic } from "@/lib/types";
import { selectNextQuestion } from "@/hooks/question-selection";
import { useResponses } from "@/hooks/use-responses";

export function usePracticeSession(
  questions: Question[],
  userId: string | null,
  selectedTopic?: Topic
) {
  const { responses, saveResponse, isLoading } = useResponses(userId);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (!isLoading && !currentQuestion && !showExplanation && userId) {
      const nextQuestion = selectNextQuestion(questions, selectedTopic);
      if (nextQuestion) {
        setCurrentQuestion(nextQuestion);
      }
    }
  }, [
    questions,
    currentQuestion,
    showExplanation,
    isLoading,
    userId,
    selectedTopic,
  ]);

  const handleAnswer = async (answer: string) => {
    if (!currentQuestion || !userId) return;

    try {
      await saveResponse({
        question: currentQuestion,
        userAnswer: answer,
        isCorrect: answer === currentQuestion.correct_answer,
      });
      setShowExplanation(true);
    } catch (error) {
      console.error("Failed to save response:", error);
      // Handle error appropriately
    }
  };

  const handleNext = () => {
    setShowExplanation(false);
    const nextQuestion = selectNextQuestion(questions, selectedTopic);
    setCurrentQuestion(nextQuestion);
  };

  return {
    currentQuestion,
    showExplanation,
    handleAnswer,
    handleNext,
  };
}
