"use client";

import { Question, UserResponse } from "@/lib/types";
import { useQuestionState } from "@/lib/hooks/use-question-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatTopicName } from "@/lib/utils";
import { useState, useRef, TouchEvent } from "react";
import { Badge } from "@/components/ui/badge";

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
  showExplanation: boolean;
  onNext: () => void;
}

export function QuestionCard({
  question,
  onAnswer,
  showExplanation,
  onNext,
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const isCorrect = selectedAnswer === question.correct_answer;

  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const minSwipeDistance = 50;
  const maxSwipeOffset = 100; // Maximum visual offset during swipe

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!showExplanation) return;

    touchEndX.current = e.touches[0].clientX;
    const diff = touchEndX.current - touchStartX.current;

    // Only allow right-to-left swipe and limit the offset
    if (diff < 0) {
      setSwipeOffset(Math.max(diff, -maxSwipeOffset));
    }
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchEndX.current - touchStartX.current;

    if (
      showExplanation &&
      Math.abs(swipeDistance) > minSwipeDistance &&
      swipeDistance < 0
    ) {
      onNext();
    }

    // Reset the swipe offset
    setSwipeOffset(0);
  };

  // Calculate the attempt number before the user answers
  const savedResponses = localStorage.getItem("responses");
  const responses: UserResponse[] = savedResponses
    ? JSON.parse(savedResponses)
    : [];

  const attemptNumber =
    responses.filter((r) => r.question.question_text === question.question_text)
      .length + (showExplanation ? 0 : 1);

  return (
    <Card
      className="p-4 sm:p-6 transition-transform"
      style={{ transform: `translateX(${swipeOffset}px)` }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex justify-between items-start gap-4 mb-6">
        <div className="space-y-1.5">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Year: {question.year}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Topic: {formatTopicName(question.topic)}
          </p>
        </div>
        <Badge
          variant="secondary"
          className={`shrink-0 ${
            attemptNumber > 1
              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
          }`}
        >
          {attemptNumber === 1 ? "First Attempt" : `Attempt #${attemptNumber}`}
        </Badge>
      </div>

      <div className="space-y-6">
        <p className="text-lg font-medium whitespace-pre-wrap">
          {question.question_text}
        </p>

        <div className="grid grid-cols-1 gap-3">
          {Object.entries(question.options).map(([key, value]) => (
            <Button
              key={key}
              variant="outline"
              className={`w-full h-auto py-3 px-4 justify-start text-left whitespace-normal ${
                showExplanation
                  ? key === question.correct_answer
                    ? "border-green-500 dark:border-green-400"
                    : key === selectedAnswer
                    ? "border-red-500 dark:border-red-400"
                    : ""
                  : ""
              }`}
              onClick={() => {
                setSelectedAnswer(key);
                onAnswer(key);
              }}
              disabled={showExplanation}
            >
              <span className="font-medium mr-2 shrink-0">
                {key.toUpperCase()}.
              </span>
              <span>{value}</span>
            </Button>
          ))}
        </div>

        {showExplanation && (
          <div className="mt-6">
            <div
              className={`p-4 rounded-lg mb-4 ${
                isCorrect
                  ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                  : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300"
              }`}
            >
              <p className="font-semibold mb-2">
                {isCorrect ? "Correct!" : "Incorrect"}
              </p>
              <p className="whitespace-pre-wrap">{question.explanation}</p>
            </div>
            <Button className="w-full" onClick={onNext}>
              Next Question
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
