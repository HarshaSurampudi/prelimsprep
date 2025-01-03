"use client";

import { useQuery } from "@tanstack/react-query";
import { questionsApi } from "@/lib/api/questions";
import { useQuestionsStore } from "@/store/questions";
import { useEffect } from "react";
import { Topic } from "@/lib/types";

export function useQuestions(topic?: Topic) {
  const { questions, setQuestions } = useQuestionsStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["questions", topic],
    queryFn: () =>
      topic
        ? questionsApi.getQuestionsByTopic(topic)
        : questionsApi.getQuestions(),
    staleTime: 60 * 60 * 1000, // Cache for 1 hour
  });

  useEffect(() => {
    if (data) {
      console.log(`Loaded ${data.length} questions`);
      setQuestions(data);
    }
  }, [data, setQuestions]);

  return {
    questions,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
  };
}
