"use client";

import { useQuestions } from "@/hooks/use-questions";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useAuth } from "@/hooks/use-auth";
import { QuestionList } from "@/app/components/question-list";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BookmarksPage() {
  const { user } = useAuth(true);
  const { questions, loading: questionsLoading } = useQuestions();
  const {
    bookmarkedQuestions,
    toggleBookmark,
    isLoading: bookmarksLoading,
  } = useBookmarks(user?.id ?? null);

  const bookmarkedQuestionsList = questions.filter((q) =>
    bookmarkedQuestions.includes(q.id)
  );

  if (!user || questionsLoading || bookmarksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Bookmarked Questions</h1>
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {bookmarkedQuestionsList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No bookmarked questions yet. Start bookmarking questions during
              practice!
            </p>
          </div>
        ) : (
          <QuestionList
            questions={bookmarkedQuestionsList}
            bookmarkedQuestions={bookmarkedQuestions}
            onToggleBookmark={toggleBookmark}
          />
        )}
      </div>
    </main>
  );
}
