"use client";

import { useState, useEffect } from 'react';
import { Question } from '@/lib/types';

export function useQuestionState(question: Question) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // Reset selected answer when question changes
  useEffect(() => {
    setSelectedAnswer(null);
  }, [question.question_text]); // Use question text as dependency to detect changes

  const handleOptionClick = (
    option: string,
    showExplanation: boolean,
    onAnswer: (answer: string) => void
  ) => {
    if (showExplanation) return;
    setSelectedAnswer(option);
    onAnswer(option);
  };

  return {
    selectedAnswer,
    handleOptionClick,
  };
}