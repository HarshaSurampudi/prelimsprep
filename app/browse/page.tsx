"use client";

import { useQuestions } from "@/lib/hooks/use-questions";
import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Question } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { debounce } from "lodash";

export default function BrowsePage() {
  const { questions: originalQuestions, loading, error } = useQuestions();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize edited questions when original questions load
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

  const handleQuestionUpdate = (index: number, updatedQuestion: Question) => {
    const newQuestions = [...questions];
    newQuestions[
      questions.findIndex(
        (q) => q.question_text === filteredQuestions[index].question_text
      )
    ] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const downloadQuestions = () => {
    const questionsJson = JSON.stringify({ questions }, null, 2);
    const blob = new Blob([questionsJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "questions.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <Input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md"
            />
            <Button
              onClick={downloadQuestions}
              className="gap-2"
              variant="outline"
            >
              <Download className="h-4 w-4" />
              Download JSON
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Found {filteredQuestions.length} questions
          </p>
        </div>

        <div className="space-y-6">
          {filteredQuestions.map((question, index) => (
            <QuestionDisplay
              key={index}
              question={question}
              onUpdate={(updatedQuestion) =>
                handleQuestionUpdate(index, updatedQuestion)
              }
            />
          ))}
        </div>
      </div>
    </main>
  );
}

function QuestionDisplay({
  question,
  onUpdate,
}: {
  question: Question;
  onUpdate: (question: Question) => void;
}) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [editedText, setEditedText] = useState(question.question_text);

  // Debounced autosave function
  const debouncedSave = useCallback(
    debounce((text: string) => {
      onUpdate({
        ...question,
        question_text: text,
      });
    }, 1000),
    [question, onUpdate]
  );

  // Handle text changes with autosave
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setEditedText(newText);
    debouncedSave(newText);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="mb-4 flex justify-between items-start gap-4">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Year: {question.year}
          </span>
          <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Topic: {question.topic.replace(/-/g, " ")}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <Textarea
          value={editedText}
          onChange={handleTextChange}
          className="min-h-[200px] font-medium text-base"
          rows={8}
        />
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
