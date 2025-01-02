"use client";

import { Question, Topic, UserResponse } from "@/lib/types";

export interface TopicStats {
  mastery: number;       // 0..1 fraction
  questionCount: number; // total attempts in that topic
  lastAttempt: number;   // largest index among attempts, or -1 if none
}

export interface QuestionHistory {
  attempts: {
    isCorrect: boolean;
    attemptNumber: number; // index in the responses array
  }[];
  recentSuccess: number;   // fraction correct in the last N attempts (e.g., 3)
  overallSuccess: number;  // fraction correct among all attempts
  lastAttempt: number;     // index of the most recent attempt, or -1 if none
}

export function getTopicStats(
  responses: UserResponse[]
): Record<Topic, TopicStats> {
  const tally: Record<Topic, { correct: number; total: number; lastAttempt: number }> = {} as any;

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
    // Keep track of the last attempt
    if (i > tally[t].lastAttempt) {
      tally[t].lastAttempt = i;
    }
  }

  // Convert raw tallies into TopicStats
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

/**
 * If no `targetTopic` is given, this function picks the "most needed" topic 
 * based on (1 - mastery), spacing, coverage, etc.
 * 
 * - mastery: if user is weak in that topic, we pick it more
 * - lastAttempt: if we haven't done it in a while, we pick it more
 * - coverage: if user rarely answered that topic, we boost it
 */
export function selectTopic(
  questions: Question[],
  responses: UserResponse[],
  topicStats: Record<Topic, TopicStats>
): Topic {
  // 1) Gather all unique topics from *all* questions
  const uniqueTopics = new Set<Topic>();
  questions.forEach(q => uniqueTopics.add(q.topic));

  // If no topics exist, Error
  if (uniqueTopics.size === 0) {
    throw new Error("No topics found");
  }

  // 2) For the *initial stages* (first 40 attempts), pick randomly
  const totalResponses = responses.length;
  if (totalResponses < 40) {
    const allTopics = Array.from(uniqueTopics);
    const randomIndex = Math.floor(Math.random() * allTopics.length);
    return allTopics[randomIndex];
  }

  // 3) If we have at least 40 responses, do the "smart" selection
  let bestTopic: Topic = Array.from(uniqueTopics)[0];
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const topic of Array.from(uniqueTopics)) {
    // Grab topic stats if they exist, else default
    const stats = topicStats[topic] || {
      mastery: 0,
      questionCount: 0,
      lastAttempt: -1
    };

    // measure how many questions since we last practiced this topic
    const spacing = (stats.lastAttempt === -1)
      ? (totalResponses + 1)  // never attempted => big spacing
      : (totalResponses - stats.lastAttempt);

    // coverage factor => fewer attempts => higher priority
    const coverageFactor = (stats.questionCount === 0)
      ? 1
      : (1 / stats.questionCount);

    // mastery factor => lower mastery => higher priority
    const masteryFactor = (1 - stats.mastery);

    const needScore = 
      masteryFactor * 1.0 +
      Math.log(spacing + 1) * 0.5 +  // spacing grows with log
      coverageFactor * 0.3;

    if (needScore > bestScore) {
      bestScore = needScore;
      bestTopic = topic;
    }
  }

  return bestTopic;
}

/**
 * For a given question ID, find all attempts in `responses`.
 * Return recentSuccess and overallSuccess, plus lastAttempt.
 */
export function getQuestionHistory(
  questionId: number,
  responses: UserResponse[],
  recentWindow: number = 3
): QuestionHistory {
  const attempts = [];
  
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
    // No attempts for this question
    return {
      attempts: [],
      recentSuccess: 0,
      overallSuccess: 0,
      lastAttempt: -1,
    };
  }

  // overall success
  const overallCorrect = attempts.filter(a => a.isCorrect).length;
  const overallSuccess = overallCorrect / attempts.length;

  // recent success: last 'recentWindow' attempts
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

/**
 * We compute how urgently the user "needs" to see a question again.
 * This is a combination of recent & overall success, plus how long 
 * since last attempt, plus how many attempts they've made, etc.
 */
export function calculateRepetitionWeight(
  history: QuestionHistory,
  totalResponses: number
): number {
  // If never attempted, give a higher base boost
  if (history.attempts.length === 0) {
    return 5.0;
  }

  // Start with a base weight
  let weight = 1.0;

  // Factor 1: recent performance
  weight *= Math.exp(-history.recentSuccess * 2.0);

  // Factor 2: overall performance
  weight *= Math.exp(-history.overallSuccess * 1.0);

  // Factor 3: spacing since last attempt
  const spacing = totalResponses - history.lastAttempt;
  // Add a strong penalty for very recent questions
  if (spacing < 20) {
    weight *= 0.1;  // 90% reduction for recently seen questions
  }
  // Then apply normal spacing growth
  weight *= Math.exp(spacing * 0.05);

  // Factor 4: attempt count penalty
  const attemptCount = history.attempts.length;
  // Stronger penalty for high attempt counts
  const attemptPenalty = Math.exp(-attemptCount * 0.3);
  const penaltyReduction = (1 - history.recentSuccess);
  weight *= (attemptPenalty + penaltyReduction) / 2;

  return weight;
}

/**
 * Standard weighted random selection from an array of items.
 */
export function weightedRandomSelect<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((sum, w) => sum + w, 0);
  if (total <= 0) {
    // fallback if all weights are zero or negative
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
  // fallback, shouldn't happen if above logic is correct
  return items[items.length - 1];
}

/**
 * Main function:
 *  1) Build topic stats from the responses
 *  2) Determine which topic to pick (or use the targetTopic if provided)
 *  3) Filter questions by that topic
 *  4) Calculate a final weight for each question
 *  5) Weighted random pick
 */
export function selectNextQuestion(
  questions: Question[],
  responses: UserResponse[],
  targetTopic?: Topic
): Question | null {
  // 1) Build topic stats from these responses
  const topicStats = getTopicStats(responses);
  console.log("topicStats", topicStats);

  // 2) Choose topic (unless a specific topic is requested)
  const chosenTopic = targetTopic || selectTopic(questions, responses, topicStats);
  console.log("chosenTopic", chosenTopic);
  // Filter to questions in that topic
  const available = questions.filter(q => q.topic === chosenTopic);
  if (available.length === 0) return null;
  // 3) For each question, combine difficulty alignment + repetition weighting
  const topicLevel = topicStats[chosenTopic]?.mastery ?? 0; 
  // We'll treat topicLevel as 0..1, but question difficulty is 1..5
  console.log("topicLevel", topicLevel);
  const totalResponses = responses.length;

  const weights = available.map(q => {
    // a) Difficulty alignment: we want questions near the user’s mastery
    //    If mastery=0.5 => equivalent to difficulty=3. 
    //    So let's do: exp(-|q.difficulty - (topicLevel * 5)|)
    const diffCenter = topicLevel * 5;
    let difficulty = q.difficulty ?? 3;
    const diffDiff = Math.abs(difficulty - diffCenter);
    let weight = Math.exp(-diffDiff);

    // b) Repetition weighting
    const qHistory = getQuestionHistory(q.id, responses);
    weight *= calculateRepetitionWeight(qHistory, totalResponses);

    return weight;
  });

  // 4) Weighted random selection
  return weightedRandomSelect(available, weights);
}
