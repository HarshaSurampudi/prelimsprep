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

export function selectNextQuestion(questions: Question[]): Question | null {
  // Get responses from localStorage
  const savedResponses = localStorage.getItem("responses");
  const responses: UserResponse[] = savedResponses
    ? JSON.parse(savedResponses)
    : [];

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

  if (availableQuestions.length === 0) {
    console.log("No available questions remaining for attempt", currentAttempt);
    return null;
  }

  // For the first attempt, ensure even distribution of 5 questions per topic for first 40 questions
  if (currentAttempt === 1 && responses.length < 40) {
    // Group questions by topic
    const questionsByTopic = availableQuestions.reduce((acc, q) => {
      if (!acc[q.topic]) acc[q.topic] = [];
      acc[q.topic].push(q);
      return acc;
    }, {} as Record<string, Question[]>);

    // Count questions answered per topic
    const answeredByTopic = responses.reduce((acc, r) => {
      acc[r.question.topic] = (acc[r.question.topic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Find topics that haven't reached 5 questions yet
    const eligibleTopics = Object.entries(questionsByTopic)
      .filter(([topic]) => (answeredByTopic[topic] || 0) < 5)
      .map(([topic]) => topic);

    if (eligibleTopics.length > 0) {
      // Select a random topic from eligible topics
      const randomTopic =
        eligibleTopics[Math.floor(Math.random() * eligibleTopics.length)];
      const topicQuestions = questionsByTopic[randomTopic];
      const randomIndex = Math.floor(Math.random() * topicQuestions.length);

      console.log(
        `First 40 questions: Topic ${randomTopic} (${
          answeredByTopic[randomTopic] || 0
        }/5)`
      );
      return topicQuestions[randomIndex];
    }
  }

  // Calculate weights based on past performance
  const weights = calculateTopicWeights(responses);

  // Group questions by topic (only including topics that have questions)
  const questionsByTopic = availableQuestions.reduce((acc, q) => {
    if (!acc[q.topic]) acc[q.topic] = [];
    acc[q.topic].push(q);
    return acc;
  }, {} as Record<string, Question[]>);

  // Calculate total weight only for topics that have questions
  const totalWeight = Object.entries(questionsByTopic).reduce(
    (sum, [topic, questions]) => sum + (weights[topic] || 1) * questions.length,
    0
  );

  // Log available questions and their probabilities
  console.log("\nAvailable questions by topic:");
  Object.entries(questionsByTopic).forEach(([topic, questions]) => {
    const topicWeight = weights[topic] || 1;
    const probability = ((questions.length * topicWeight) / totalWeight) * 100;
    console.log(
      `${topic}: ${questions.length} questions, ${probability.toFixed(
        1
      )}% chance`
    );
  });

  // Select topic first using weights
  let random = Math.random() * totalWeight;
  const originalRandom = random;
  let selectedTopic: string | null = null;

  for (const [topic, questions] of Object.entries(questionsByTopic)) {
    const topicWeight = (weights[topic] || 1) * questions.length;
    random -= topicWeight;
    if (random <= 0) {
      selectedTopic = topic;
      break;
    }
  }

  // Fallback in case of rounding errors
  if (!selectedTopic) {
    const topics = Object.keys(questionsByTopic);
    selectedTopic = topics[topics.length - 1];
  }

  // Then randomly select a question from that topic
  const topicQuestions = questionsByTopic[selectedTopic];
  const selectedQuestion =
    topicQuestions[Math.floor(Math.random() * topicQuestions.length)];

  // Log the selected question
  if (selectedQuestion) {
    console.log(`\nSelected question:
    Topic: ${selectedQuestion.topic}
    Random value: ${originalRandom.toFixed(2)}/${totalWeight.toFixed(2)}
    Question: ${selectedQuestion.question_text.slice(0, 100)}...`);
  }

  return selectedQuestion;
}
