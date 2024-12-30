import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Topic, UserResponse } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTopicName(topic: Topic): string {
  return topic
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function calculateTopicStats(responses: UserResponse[], topic: Topic) {
  const topicResponses = responses.filter((r) => r.question.topic === topic);
  return {
    total: topicResponses.length,
    correct: topicResponses.filter((r) => r.isCorrect).length,
    responses: topicResponses,
  };
}

export function calculateAccuracy(total: number, correct: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function getAllTopics(): Topic[] {
  return [
    "Polity",
    "History",
    "Economics",
    "Environment and Ecology",
    "Science & Technology",
    "Geography",
    "Current Events",
  ];
}
