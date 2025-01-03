"use client";

import { Question, Topic, UserResponse } from "@/lib/types";

export interface TopicStats {
  mastery: number;        // 0..1 fraction
  questionCount: number;  // total attempts in that topic
  lastAttempt: number;    // largest index among attempts, or -1 if none
}

export interface QuestionHistory {
  attempts: {
    isCorrect: boolean;
    attemptNumber: number;  // index in the responses array
  }[];
  recentSuccess: number;    // fraction correct in the last N attempts
  overallSuccess: number;   // fraction correct among all attempts
  lastAttempt: number;      // index of the most recent attempt, or -1 if none
}

export function getTopicStats(
  responses: UserResponse[]
): Record<Topic, TopicStats> {
  const tally: Record<Topic, { 
    correct: number; 
    total: number; 
    lastAttempt: number 
  }> = {} as any;

  // Process each response to build topic statistics
  for (let i = 0; i < responses.length; i++) {
    const r = responses[i];
    const t = r.question.topic;
    if (!(t in tally)) {
      tally[t] = { correct: 0, total: 0, lastAttempt: -1 };
    }
    tally[t].total += 1;
    if (r.isCorrect) {
      tally[t].correct += 1;
    }
    if (i > tally[t].lastAttempt) {
      tally[t].lastAttempt = i;
    }
  }

  // Convert tallies into TopicStats
  const stats: Record<Topic, TopicStats> = {} as any;
  for (const topic in tally) {
    const data = tally[topic as Topic];
    stats[topic as Topic] = {
      mastery: data.total > 0 ? data.correct / data.total : 0,
      questionCount: data.total,
      lastAttempt: data.lastAttempt,
    };
  }
  return stats;
}

export function selectTopic(
  questions: Question[],
  responses: UserResponse[],
  topicStats: Record<Topic, TopicStats>
): Topic {
  const uniqueTopics = new Set<Topic>();
  questions.forEach(q => uniqueTopics.add(q.topic));

  if (uniqueTopics.size === 0) {
    throw new Error("No topics found");
  }

  // For initial stages (first 40 attempts), ensure balanced coverage
  const totalResponses = responses.length;
  if (totalResponses < 40) {
    const allTopics = Array.from(uniqueTopics);
    
    // Count attempts per topic
    const topicCounts = new Map<Topic, number>();
    allTopics.forEach(t => topicCounts.set(t, 0));
    responses.forEach(r => {
      const topic = r.question.topic;
      topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
    });
    
    // Find topics with minimum attempts
    const minAttempts = Math.min(...Array.from(topicCounts.values()));
    const leastAttemptedTopics = allTopics.filter(t => 
      topicCounts.get(t) === minAttempts
    );
    
    // Among least attempted topics, avoid the last topic if possible
    const lastTopic = responses.length > 0 ? responses[responses.length - 1].question.topic : null;
    const availableTopics = leastAttemptedTopics.filter(t => t !== lastTopic);
    const topicsToChooseFrom = availableTopics.length > 0 ? availableTopics : leastAttemptedTopics;
    
    return topicsToChooseFrom[Math.floor(Math.random() * topicsToChooseFrom.length)];
  }

  let bestTopic: Topic = Array.from(uniqueTopics)[0];
  let bestScore = Number.NEGATIVE_INFINITY;

  // Get last N topics to implement a sliding window
  const recentTopics = responses.slice(-5).map(r => r.question.topic);
  const topicFrequency = new Map<Topic, number>();
  recentTopics.forEach(t => topicFrequency.set(t, (topicFrequency.get(t) || 0) + 1));

  for (const topic of Array.from(uniqueTopics)) {
    const stats = topicStats[topic] || {
      mastery: 0,
      questionCount: 0,
      lastAttempt: -1
    };

    const spacing = (stats.lastAttempt === -1)
      ? (totalResponses + 1)
      : (totalResponses - stats.lastAttempt);

    const coverageFactor = (stats.questionCount === 0)
      ? 2.0  // Boost for never-seen topics
      : (1 / Math.sqrt(stats.questionCount));

    const masteryFactor = (1 - stats.mastery);

    // Strong penalty for recently used topics
    const recentUsePenalty = 1.0 / (Math.pow(topicFrequency.get(topic) || 0, 2) + 1);

    const needScore = 
      masteryFactor * 1.0 +
      Math.log(spacing + 1) * 0.8 +
      coverageFactor * 0.5 +
      recentUsePenalty * 1.5;  // Increased weight for topic diversity

    if (needScore > bestScore) {
      bestScore = needScore;
      bestTopic = topic;
    }
  }

  return bestTopic;
}

export function getQuestionHistory(
  questionId: number,
  responses: UserResponse[],
  recentWindow: number = 3
): QuestionHistory {
  const attempts = [];
  
  // Collect all attempts for this question
  for (let i = 0; i < responses.length; i++) {
    const r = responses[i];
    if (r.question.id === questionId) {
      attempts.push({
        isCorrect: r.isCorrect,
        attemptNumber: i,
      });
    }
  }

  if (attempts.length === 0) {
    return {
      attempts: [],
      recentSuccess: 0,
      overallSuccess: 0,
      lastAttempt: -1,
    };
  }

  // Calculate overall success rate
  const overallCorrect = attempts.filter(a => a.isCorrect).length;
  const overallSuccess = overallCorrect / attempts.length;

  // Calculate recent success rate
  const recent = attempts.slice(-recentWindow);
  const recentCorrect = recent.filter(a => a.isCorrect).length;
  const recentSuccess = recentCorrect / recent.length;

  return {
    attempts,
    recentSuccess,
    overallSuccess,
    lastAttempt: attempts[attempts.length - 1].attemptNumber,
  };
}

export function calculateRepetitionWeight(
  history: QuestionHistory,
  totalResponses: number
): number {
  // Highest boost for new questions
  if (history.attempts.length === 0) {
    return 10.0;
  }

  let weight = 1.0;

  // Recent performance factor - strongly boost questions with recent failures
  const recentFailureBoost = Math.exp((1 - history.recentSuccess) * 3.0);
  weight *= recentFailureBoost;

  // Overall performance factor - boost questions with poor overall performance
  const overallFailureBoost = Math.exp((1 - history.overallSuccess) * 1.5);
  weight *= overallFailureBoost;

  // Check if the last attempt was incorrect
  const lastAttemptWasIncorrect = history.attempts.length > 0 && 
    !history.attempts[history.attempts.length - 1].isCorrect;
  
  // Special handling for recently failed questions
  if (lastAttemptWasIncorrect) {
    const spacing = totalResponses - history.lastAttempt;
    
    // For recently failed questions, we want to revisit them after a short delay
    if (spacing >= 3 && spacing <= 8) {  // Sweet spot for review
      weight *= 3.0;  // Triple the priority in this window
    } else if (spacing < 3) {  // Too soon to review
      weight *= 0.1;  // Strong penalty for very recent attempts
    }
  } else {
    // Normal spacing rules for correctly answered questions
    const spacing = totalResponses - history.lastAttempt;
    if (spacing < 8) {
      weight *= Math.pow(0.1, (8 - spacing));
    }
    weight *= Math.exp(spacing * 0.08);
  }

  // Modified attempt count penalty - less aggressive for incorrect answers
  const attemptCount = history.attempts.length;
  const successRate = history.overallSuccess;
  const attemptPenalty = successRate * Math.exp(-attemptCount * 0.4) + 
                        (1 - successRate) * Math.exp(-attemptCount * 0.2);
                        
  weight *= attemptPenalty;

  return weight;
}

export function weightedRandomSelect<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((sum, w) => sum + w, 0);
  if (total <= 0) {
    // Fallback if all weights are zero or negative
    return items[Math.floor(Math.random() * items.length)];
  }

  const r = Math.random() * total;
  let acc = 0;
  for (let i = 0; i < items.length; i++) {
    acc += weights[i];
    if (acc >= r) {
      return items[i];
    }
  }
  
  // Fallback, shouldn't happen if above logic is correct
  return items[items.length - 1];
}

export function selectNextQuestion(
  questions: Question[],
  responses: UserResponse[],
  targetTopic?: Topic
): Question | null {
  // Build topic stats from responses
  const topicStats = getTopicStats(responses);
  console.log("topicStats", topicStats);

  // Choose topic (unless specific topic is requested)
  const chosenTopic = targetTopic || selectTopic(questions, responses, topicStats);
  console.log("chosenTopic", chosenTopic);
  // Get available questions for the topic
  const available = questions.filter(q => q.topic === chosenTopic);
  if (available.length === 0) return null;
  console.log("No available questions for chosenTopic", available.length);

  // Get recently used question IDs (last 10 questions)
  const recentQuestionIds = new Set(
    responses.slice(-10).map(r => r.question.id)
  );
  console.log("recentQuestionIds", recentQuestionIds);

  const topicLevel = topicStats[chosenTopic]?.mastery ?? 0;
  const totalResponses = responses.length;
  console.log("totalResponses", totalResponses);
  const weights = available.map(q => {
    // Start with repetition weight
    const qHistory = getQuestionHistory(q.id, responses);
    let weight = calculateRepetitionWeight(qHistory, totalResponses);

    // Apply difficulty alignment with reduced impact
    const diffCenter = topicLevel * 5;
    const difficulty = q.difficulty ?? 3;
    const diffDiff = Math.abs(difficulty - diffCenter);
    weight *= Math.exp(-diffDiff * 0.3); // Reduced from 1.0 to 0.3

    // Extra penalty for recently used questions
    if (recentQuestionIds.has(q.id)) {
      weight *= 0.01; // 99% reduction for recent questions
    }

    return weight;
  });

  // Normalize weights to prevent floating point issues
  const maxWeight = Math.max(...weights);
  const normalizedWeights = weights.map(w => w / maxWeight);
  
  return weightedRandomSelect(available, normalizedWeights);
}