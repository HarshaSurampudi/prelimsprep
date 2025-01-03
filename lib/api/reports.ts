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
    questionId: number | null;
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

  async getReportedIssues(userId: string) {
    // First get the reported issues
    const { data: reportedIssues, error: reportError } = await supabase
      .from("reported_issues")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (reportError) throw reportError;

    // Then fetch the associated questions for issues that have question_id
    const questionIds = reportedIssues
      .filter((issue) => issue.question_id !== null)
      .map((issue) => issue.question_id);

    let questions: any[] = [];
    if (questionIds.length > 0) {
      const { data: questionData, error: questionsError } = await supabase
        .from("questions")
        .select("id, question_text, topic, explanation")
        .in("id", questionIds);

      if (questionsError) throw questionsError;
      questions = questionData;
    }

    // Combine the data
    const combinedData = reportedIssues.map((issue) => ({
      ...issue,
      questions: issue.question_id
        ? questions.find((q) => q.id === issue.question_id) || null
        : null,
    }));

    return combinedData;
  },
};
