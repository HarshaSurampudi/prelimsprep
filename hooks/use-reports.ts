import { useState } from "react";
import { reportsApi } from "@/lib/api/reports";
import { toast } from "@/hooks/use-toast";

export function useReports(userId: string | null) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportIssue = async ({
    questionId,
    issueType,
    description,
  }: {
    questionId: number | null;
    issueType: string;
    description: string;
  }) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to report issues",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await reportsApi.reportIssue({
        userId,
        questionId,
        issueType,
        description,
      });
      toast({
        title: "Issue Reported",
        description: "Thank you for helping improve the questions.",
      });
      return true;
    } catch (error) {
      console.error("Failed to report issue:", error);
      toast({
        title: "Error",
        description: "Failed to report issue. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    reportIssue,
    isSubmitting,
  };
}
