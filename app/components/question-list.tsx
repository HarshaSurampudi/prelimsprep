"use client";

import { Question } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { formatTopicName } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";

interface QuestionListProps {
  questions: Question[];
  bookmarkedQuestions: number[];
  onToggleBookmark: (questionId: number) => void;
}

export function QuestionList({
  questions,
  bookmarkedQuestions,
  onToggleBookmark,
}: QuestionListProps) {
  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <Card key={question.id} className="p-4 dark:bg-gray-900 bg-background">
          <div className="flex justify-between items-start gap-4 mb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {formatTopicName(question.topic)}
                </Badge>
                {question.collection && (
                  <Badge variant="outline">{question.collection}</Badge>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleBookmark(question.id)}
              className="h-8 w-8 p-0"
            >
              <Bookmark
                className={`h-4 w-4 ${
                  bookmarkedQuestions.includes(question.id)
                    ? "fill-current text-yellow-500"
                    : ""
                }`}
              />
            </Button>
          </div>

          <div className="space-y-4">
            <p className="text-lg whitespace-pre-wrap">
              {question.question_text}
            </p>

            <div className="grid grid-cols-1 gap-2">
              {Object.entries(question.options).map(([key, value]) => (
                <div
                  key={key}
                  className={`p-3 rounded-md border ${
                    key === question.correct_answer
                      ? "border-green-500 dark:border-green-400"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <span className="font-medium mr-2">{key.toUpperCase()}.</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>

            {question.explanation && (
              <div className="mt-4 p-4 rounded-md bg-gray-50 dark:bg-gray-800">
                <p className="font-semibold mb-2">Explanation:</p>
                <p className="whitespace-pre-wrap">{question.explanation}</p>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
