"use client";

import { Question, UserResponse } from "./types";

function calculateTopicWeights(
  responses: UserResponse[]
): Record<string, number> {
  // Group responses by topic
  const topicStats = responses.reduce((acc, response) => {
    const topic = response.question.topic;
    if (!acc[topic]) {
      acc[topic] = { total: 0, correct: 0 };
    }
    acc[topic].total++;
    if (response.isCorrect) acc[topic].correct++;
    return acc;
  }, {} as Record<string, { total: number; correct: number }>);

  // Calculate weights based on accuracy and frequency
  const weights: Record<string, number> = {};
  Object.entries(topicStats).forEach(([topic, stats]) => {
    const accuracy = stats.total === 0 ? 0 : stats.correct / stats.total;
    weights[topic] = (1 - accuracy) * 2 + 1;
    console.log(
      `Topic: ${topic}, Accuracy: ${(accuracy * 100).toFixed(
        1
      )}%, Weight: ${weights[topic].toFixed(2)}`
    );
  });

  return weights;
}

export function selectNextQuestion(
  questions: Question[],
  responses: UserResponse[]
): Question | null {
  // Calculate attempt numbers for each question
  const questionAttempts = responses.reduce((acc, response) => {
    const key = response.question.question_text;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get the current attempt number (1-based)
  let currentAttempt = 1;
  const attemptCounts = questions.map(
    (q) => questionAttempts[q.question_text] || 0
  );

  if (attemptCounts.some((count) => count > 0)) {
    const maxAttempts = Math.max(...Object.values(questionAttempts), 0);
    const incompleteCounts = attemptCounts.filter(
      (attempts) => attempts < maxAttempts
    );

    if (incompleteCounts.length > 0) {
      currentAttempt = Math.min(...incompleteCounts) + 1;
    } else {
      currentAttempt = maxAttempts + 1;
    }
  }

  // Filter questions based on current attempt
  const availableQuestions = questions.filter(
    (q) => (questionAttempts[q.question_text] || 0) === currentAttempt - 1
  );

  return availableQuestions.length > 0
    ? availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
    : null;
}
