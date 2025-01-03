"use client";

import { useQuestions } from "@/hooks/use-questions";
import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Question } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function BrowsePage() {
  const { questions: originalQuestions, loading, error } = useQuestions();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize questions when original questions load
  useEffect(() => {
    if (originalQuestions.length > 0) {
      setQuestions(originalQuestions);
    }
  }, [originalQuestions]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  const filteredQuestions = questions.filter((question) =>
    question.question_text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="p-4 bg-background dark:bg-gray-800 mb-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 space-y-4 rounded-lg p-2">
          <Input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background dark:bg-gray-900 rounded-lg" 
          />
          <p className="text-sm text-muted-foreground">
            Found {filteredQuestions.length} questions
          </p>
        </div>

        <div className="space-y-6">
          {filteredQuestions.map((question, index) => (
            <QuestionDisplay key={index} question={question} />
          ))}
        </div>
      </div>
    </main>
  );
}

function QuestionDisplay({ question }: { question: Question }) {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="bg-background dark:bg-gray-900 rounded-lg shadow p-4">
      <div className="mb-4 flex justify-between items-start gap-4">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Year: {question.collection}
          </span>
          <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Topic: {question.topic.replace(/-/g, " ")}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <p className="font-medium text-base whitespace-pre-wrap">
          {question.question_text}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
        {Object.entries(question.options).map(([key, value]) => (
          <div
            key={key}
            className={`p-3 rounded-lg border ${
              key === question.correct_answer
                ? "border-green-500 dark:border-green-400"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <span className="font-medium mr-2">{key.toUpperCase()}.</span>
            {value}
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowExplanation(!showExplanation)}
        className="bg-background dark:bg-gray-900"
      >
        {showExplanation ? "Hide" : "Show"} Explanation
      </Button>

      {showExplanation && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="whitespace-pre-wrap">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
