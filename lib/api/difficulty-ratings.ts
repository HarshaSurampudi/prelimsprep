import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const difficultyRatingsApi = {
  async saveDifficultyRating({
    userId,
    questionId,
    attemptNumber,
    rating,
  }: {
    userId: string;
    questionId: number;
    attemptNumber: number;
    rating: number;
  }) {
    const { error } = await supabase.from("difficulty_ratings").insert({
      user_id: userId,
      question_id: questionId,
      attempt_number: attemptNumber,
      difficulty_rating: rating,
    });

    if (error) throw error;
  },
}; 