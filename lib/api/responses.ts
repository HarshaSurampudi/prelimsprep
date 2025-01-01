import { UserResponse } from "@/lib/types";
import { createClient } from "@/utils/supabase/client";

export const responsesApi = {
  getResponses: async (userId: string): Promise<UserResponse[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("user_responses")
      .select(
        `
        *,
        question:questions(*)
      `
      )
      .eq("user_id", userId)
      .order("timestamp", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data.map((r) => ({
      question: {
        ...r.question,
        options: r.question.options as {
          a: string;
          b: string;
          c: string;
          d: string;
        },
      },
      userAnswer: r.user_answer,
      isCorrect: r.is_correct,
      timestamp: new Date(r.timestamp).getTime(),
    }));
  },

  addResponse: async (
    userId: string,
    questionId: number,
    userAnswer: string,
    isCorrect: boolean
  ): Promise<void> => {
    const supabase = createClient();
    const { error } = await supabase.from("user_responses").insert({
      user_id: userId,
      question_id: questionId,
      user_answer: userAnswer,
      is_correct: isCorrect,
    });

    if (error) {
      throw new Error(error.message);
    }
  },

  deleteAllResponses: async (userId: string): Promise<void> => {
    const supabase = createClient();
    const { error } = await supabase
      .from("user_responses")
      .delete()
      .eq("user_id", userId);

    if (error) {
      throw new Error(error.message);
    }
  },
};
