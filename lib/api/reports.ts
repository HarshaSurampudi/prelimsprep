import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const reportsApi = {
  async reportIssue({
    userId,
    questionId,
    issueType,
    description,
  }: {
    userId: string;
    questionId: number;
    issueType: string;
    description: string;
  }) {
    const { error } = await supabase.from("reported_issues").insert({
      user_id: userId,
      question_id: questionId,
      issue_type: issueType,
      description,
    });

    if (error) throw error;
  },
};
