import { Question } from "@/lib/types";
import { createClient } from "@/utils/supabase/client";

export const questionsApi = {
  getQuestions: async (): Promise<Question[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .order("id");

    if (error) {
      console.error("Error fetching questions:", error);
      throw new Error(error.message);
    }

    console.log(`Fetched ${data.length} questions from API`);

    return data.map((q) => ({
      ...q,
      options: q.options as {
        a: string;
        b: string;
        c: string;
        d: string;
      },
    }));
  },

  getQuestionsByTopic: async (topic: string): Promise<Question[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("topic", topic)
      .order("id");

    if (error) {
      throw new Error(error.message);
    }

    return data.map((q) => ({
      ...q,
      options: q.options as {
        a: string;
        b: string;
        c: string;
        d: string;
      },
    }));
  },
};
