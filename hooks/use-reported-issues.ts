import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "@/lib/api/reports";
import { toast } from "@/hooks/use-toast";

export function useReportedIssues(userId: string | null) {
  const {
    data: reportedIssues = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reported-issues", userId],
    queryFn: async () => {
      if (!userId) return [];
      return reportsApi.getReportedIssues(userId);
    },
    enabled: !!userId,
  });

  return {
    reportedIssues,
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
}
