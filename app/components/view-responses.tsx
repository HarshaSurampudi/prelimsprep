"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserResponse, Topic } from "@/lib/types";
import { formatTopicName, getAllTopics } from "@/lib/utils";

export function ViewResponses({
  responses,
  isLoading,
}: {
  responses: UserResponse[];
  isLoading: boolean;
}) {
  const [selectedTopic, setSelectedTopic] = useState<Topic | "all">("all");
  const [selectedAttempt, setSelectedAttempt] = useState<number | undefined>(
    undefined
  );

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

  // Filter responses by topic and attempt
  const filteredResponses = responses.filter((response) => {
    // Topic filter
    if (selectedTopic !== "all" && response.question.topic !== selectedTopic) {
      return false;
    }

    // Attempt filter
    if (selectedAttempt !== undefined) {
      const questionAttempts = responses.filter(
        (r) => r.question.question_text === response.question.question_text
      );
      const responseAttempt =
        questionAttempts.findIndex((r) => r.timestamp === response.timestamp) +
        1;
      return responseAttempt === selectedAttempt;
    }

    return true;
  });

  const sortedResponses = [...filteredResponses].sort(
    (a, b) => b.timestamp - a.timestamp
  );

  if (responses.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-lg text-gray-500 dark:text-gray-400">
          No responses recorded yet. Start practicing to see your history!
        </p>
      </div>
    );
  }

  // Calculate attempt numbers for each response
  const responsesWithAttempts = sortedResponses.map((response) => {
    const attemptNumber = responses.filter(
      (r) =>
        r.question.question_text === response.question.question_text &&
        r.timestamp <= response.timestamp
    ).length;
    return { ...response, attemptNumber };
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-xl font-semibold">Response History</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <select
              value={selectedTopic}
              onChange={(e) =>
                setSelectedTopic(e.target.value as Topic | "all")
              }
              className="w-full sm:w-auto border rounded p-2 dark:bg-gray-800 bg-background"
            >
              <option value="all">All Topics</option>
              {getAllTopics().map((topic) => (
                <option key={topic} value={topic}>
                  {formatTopicName(topic)}
                </option>
              ))}
            </select>
            <select
              value={selectedAttempt?.toString() ?? ""}
              onChange={(e) =>
                setSelectedAttempt(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-full sm:w-auto border rounded p-2 dark:bg-gray-800 bg-background"
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
        </div>

        <div className="space-y-6">
          {responsesWithAttempts.map((response, index) => (
            <div
              key={index}
              className="border-t first:border-t-0 pt-6 first:pt-0"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-lg font-medium">
                      {response.question.question_text}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Topic: {formatTopicName(response.question.topic)}
                      <span className="ml-4">
                        Attempt: {response.attemptNumber}
                      </span>
                    </p>
                  </div>
                  <span
                    className={`ml-4 ${
                      response.isCorrect
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {response.isCorrect ? "✓" : "✗"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(response.question.options).map(
                    ([key, value]) => (
                      <Button
                        key={key}
                        variant="outline"
                        className={`justify-start h-auto py-3 px-4 whitespace-normal text-left ${
                          key === response.userAnswer
                            ? response.isCorrect
                              ? "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20"
                              : "border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20"
                            : key === response.question.correct_answer &&
                              !response.isCorrect
                            ? "border-green-500 dark:border-green-400"
                            : ""
                        }`}
                        disabled
                      >
                        <span className="font-medium mr-2 shrink-0">
                          {key.toUpperCase()}.
                        </span>
                        <span className="text-left">{value}</span>
                      </Button>
                    )
                  )}
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mt-4">
                  <p className="font-medium mb-2">Explanation:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {response.question.explanation}
                  </p>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(response.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
