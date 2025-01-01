import { useState, useEffect } from "react";
import { bookmarksApi } from "@/lib/api/bookmarks";

export function useBookmarks(userId: string | null) {
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBookmarks() {
      if (!userId) return;
      try {
        const bookmarks = await bookmarksApi.getBookmarks(userId);
        setBookmarkedQuestions(bookmarks);
      } catch (error) {
        console.error("Failed to load bookmarks:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadBookmarks();
  }, [userId]);

  const toggleBookmark = async (questionId: number) => {
    if (!userId) return;
    try {
      const isBookmarked = await bookmarksApi.toggleBookmark(
        userId,
        questionId
      );
      setBookmarkedQuestions((prev) =>
        isBookmarked
          ? [...prev, questionId]
          : prev.filter((id) => id !== questionId)
      );
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    }
  };

  return {
    bookmarkedQuestions,
    toggleBookmark,
    isLoading,
  };
}
