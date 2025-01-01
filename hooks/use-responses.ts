"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { responsesApi } from "@/lib/api/responses";
import { useResponsesStore } from "@/store/responses";
import { useEffect } from "react";
import { UserResponse } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

export function useResponses(userId: string | null) {
  const queryClient = useQueryClient();
  const { responses, setResponses, addResponse, clearResponses } =
    useResponsesStore();

  // Fetch responses
  const { data, isLoading, error } = useQuery({
    queryKey: ["responses", userId],
    queryFn: async () => {
      if (!userId) return [];
      return responsesApi.getResponses(userId);
    },
    staleTime: 1000 * 60, // Cache for 1 minute
    enabled: !!userId, // Only run query if userId exists
  });

  // Add response mutation
  const mutation = useMutation({
    mutationFn: ({
      questionId,
      userAnswer,
      isCorrect,
    }: {
      questionId: number;
      userAnswer: string;
      isCorrect: boolean;
    }) => {
      if (!userId) throw new Error("User not authenticated");
      return responsesApi.addResponse(
        userId,
        questionId,
        userAnswer,
        isCorrect
      );
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["responses", userId] });
      }
    },
  });

  // Delete all responses mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("User not authenticated");
      return responsesApi.deleteAllResponses(userId);
    },
    onSuccess: () => {
      // Clear local state
      clearResponses();
      // Invalidate queries
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["responses", userId] });
      }
      toast({
        title: "Progress Reset",
        description: "Your practice history has been cleared successfully.",
      });
    },
    onError: (error) => {
      console.error("Failed to reset data:", error);
      toast({
        title: "Error",
        description: "Failed to reset progress. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (data) {
      setResponses(data);
    }
  }, [data, setResponses]);

  const saveResponse = async (response: Omit<UserResponse, "timestamp">) => {
    if (!userId) throw new Error("User not authenticated");

    try {
      await mutation.mutateAsync({
        questionId: response.question.id,
        userAnswer: response.userAnswer,
        isCorrect: response.isCorrect,
      });

      // Add to local state immediately for optimistic updates
      addResponse({
        ...response,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Failed to save response:", error);
      throw error;
    }
  };

  return {
    responses,
    isLoading,
    error: error instanceof Error ? error.message : null,
    saveResponse,
    deleteAllResponses: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
