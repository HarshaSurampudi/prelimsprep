"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserResponse, Topic } from "@/lib/types";
import { formatTopicName, getAllTopics, calculateAccuracy } from "@/lib/utils";
import { useStorage } from "@/lib/hooks/use-storage";
import Link from "next/link";
import { useState } from "react";

function calculateTopicStats(
  responses: UserResponse[],
  topic: Topic,
  attempt?: number
) {
  const topicResponses = responses.filter((r) => {
    if (r.question.topic !== topic) return false;

    if (attempt !== undefined) {
      const questionAttempts = responses.filter(
        (resp) => resp.question.question_text === r.question.question_text
      );
      const responseAttempt =
        questionAttempts.findIndex((resp) => resp.timestamp === r.timestamp) +
        1;
      return responseAttempt === attempt;
    }

    return true;
  });

  return {
    total: topicResponses.length,
    correct: topicResponses.filter((r) => r.isCorrect).length,
  };
}

export function ProgressDisplay() {
  const [responses, _, isLoading] = useStorage<UserResponse[]>("responses", []);
  const [selectedAttempt, setSelectedAttempt] = useState<number | undefined>(
    undefined
  );
  const [showStats, setShowStats] = useState(false);

  if (isLoading) return null;

  // Calculate max attempts across all questions
  const maxAttempt = responses.reduce((max, response) => {
    const attemptNumber = responses.filter(
      (r) => r.question.question_text === response.question.question_text
    ).length;
    return Math.max(max, attemptNumber);
  }, 0);

  // Create attempt options
  const attemptOptions = [
    { value: undefined, label: "All Attempts" },
    ...Array.from({ length: maxAttempt }, (_, i) => ({
      value: i + 1,
      label: `Attempt ${i + 1}`,
    })),
  ];

  const answeredTopics = getAllTopics()
    .map((topic) => {
      const stats = calculateTopicStats(responses, topic, selectedAttempt);
      return {
        topic,
        displayName: formatTopicName(topic),
        total: stats.total,
        correct: stats.correct,
        accuracy: calculateAccuracy(stats.total, stats.correct),
      };
    })
    .filter((topic) => topic.total > 0)
    .sort((a, b) => b.total - a.total);

  if (answeredTopics.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold">Your Progress</h2>
          <select
            value={selectedAttempt?.toString() ?? ""}
            onChange={(e) =>
              setSelectedAttempt(
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            className="border rounded p-2 dark:bg-gray-800 bg-background"
          >
            {attemptOptions.map((option) => (
              <option
                key={option.value?.toString() ?? "all"}
                value={option.value?.toString() ?? ""}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <Link href="/responses">
          <Button variant="outline">View Response History</Button>
        </Link>
      </div>

      <div className="space-y-6">
        {answeredTopics.map(
          ({ topic, displayName, total, correct, accuracy }) => (
            <div key={topic} className="space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <span className="font-medium">{displayName}</span>
                <div className="text-sm text-gray-500 space-x-4">
                  <span className="text-green-600 dark:text-green-400">
                    ✓ {correct}
                  </span>
                  <span className="text-red-600 dark:text-red-400">
                    ✗ {total - correct}
                  </span>
                  <span>({accuracy}%)</span>
                </div>
              </div>

              <div className="flex h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                <div
                  className="bg-green-500 transition-all duration-300"
                  style={{ width: `${accuracy}%` }}
                />
                <div
                  className="bg-red-500 transition-all duration-300"
                  style={{ width: `${100 - accuracy}%` }}
                />
              </div>
            </div>
          )
        )}
      </div>
    </Card>
  );
}
