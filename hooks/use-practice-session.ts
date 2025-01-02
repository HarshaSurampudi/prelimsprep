"use client";

import { useState, useEffect } from "react";
import { Question, Topic, UserResponse } from "@/lib/types";
import { selectNextQuestion } from "@/hooks/question-selection";
import { useResponses } from "@/hooks/use-responses";
import { useToast } from "@/hooks/use-toast";
import { difficultyRatingsApi } from "@/lib/api/difficulty-ratings";
import { useSettings } from "@/hooks/use-settings";

export function usePracticeSession(
  questions: Question[],
  userId: string | null,
  selectedTopic?: Topic
) {
  const { settings } = useSettings();
  const { responses, saveResponse, isLoading } = useResponses(userId);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showDifficultyRating, setShowDifficultyRating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !currentQuestion && !showExplanation && userId && questions.length > 0) {
      const nextQuestion = selectNextQuestion(questions, responses, selectedTopic);
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

  useEffect(() => {
    if (currentQuestion) {
      currentQuestion.attempts = responses.filter(
        (r) => r.question.question_text === currentQuestion.question_text
      ).length;
    }
  }, [currentQuestion, responses]);

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
      toast({
        title: "Failed to save response",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleDifficultyRating = async (rating: number) => {
    if (!currentQuestion || !userId) return;

    try {
      // Get the current attempt number for this question
      const attemptNumber = responses.filter(
        (r) => r.question.question_text === currentQuestion.question_text
      ).length;

      // Save the difficulty rating
      await difficultyRatingsApi.saveDifficultyRating({
        userId,
        questionId: currentQuestion.id,
        attemptNumber,
        rating,
      });

      // Move to next question
      setShowDifficultyRating(false);
      setShowExplanation(false);
      const nextQuestion = selectNextQuestion(questions, responses, selectedTopic);
      setCurrentQuestion(nextQuestion);
    } catch (error) {
      console.error("Failed to save difficulty rating:", error);
      toast({
        title: "Failed to save rating",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleNext = () => {
    if (settings.showDifficultyRating) {
      setShowDifficultyRating(true);
    } else {
      setShowExplanation(false);
      const nextQuestion = selectNextQuestion(questions, responses, selectedTopic);
      setCurrentQuestion(nextQuestion);
    }
  };

  return {
    currentQuestion,
    showExplanation,
    showDifficultyRating,
    handleAnswer,
    handleNext,
    handleDifficultyRating,
  };
}
