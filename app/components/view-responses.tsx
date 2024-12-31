"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserResponse, Topic } from "@/lib/types";
import { formatTopicName, getAllTopics } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  const [expandedResponses, setExpandedResponses] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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
    // Search filter
    if (
      searchQuery &&
      !response.question.question_text
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

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

  const toggleExpand = (index: number) => {
    setExpandedResponses((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

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
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Response History</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <input
              type="search"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 border rounded-md p-2 dark:bg-gray-800 bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={selectedTopic}
              onChange={(e) =>
                setSelectedTopic(e.target.value as Topic | "all")
              }
              className="w-full sm:w-auto border rounded-md p-2 dark:bg-gray-800 bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full sm:w-auto border rounded-md p-2 dark:bg-gray-800 bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <AnimatePresence>
            {responsesWithAttempts.map((response, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
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
                      className={`ml-4 text-2xl ${
                        response.isCorrect
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {response.isCorrect ? "✓" : "✗"}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    onClick={() => toggleExpand(index)}
                    className="w-full flex justify-between items-center"
                  >
                    <span>
                      {expandedResponses.includes(index) ? "Hide" : "Show"}{" "}
                      Details
                    </span>
                    {expandedResponses.includes(index) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>

                  <AnimatePresence>
                    {expandedResponses.includes(index) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
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
                                    : key ===
                                        response.question.correct_answer &&
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}
