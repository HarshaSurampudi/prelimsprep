import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const bookmarksApi = {
  async getBookmarks(userId: string) {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("question_id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map((b) => b.question_id);
  },

  async toggleBookmark(userId: string, questionId: number) {
    // First check if bookmark exists
    const { data, error: fetchError } = await supabase
      .from("bookmarks")
      .select()
      .eq("user_id", userId)
      .eq("question_id", questionId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (fetchError) throw fetchError;

    // If bookmark exists, delete it
    if (data && data.length > 0) {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", userId)
        .eq("question_id", questionId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;
      return false;
    }

    // If bookmark doesn't exist, create it
    const { error } = await supabase
      .from("bookmarks")
      .insert({ user_id: userId, question_id: questionId });

    if (error) throw error;
    return true;
  },
};
