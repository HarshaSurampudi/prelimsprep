"use client";

import { useEffect, useState } from "react";
import { UserResponse } from "../lib/types";

export function useTargetQuestions({
  initialTargetQuestions = 5,
}: {
  initialTargetQuestions?: number;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [targetQuestions, setTargetQuestions] = useState<number>(() => {
    if (typeof window === "undefined") {
      return initialTargetQuestions;
    }
    const savedTargetQuestions = localStorage.getItem("targetQuestions");
    return savedTargetQuestions
      ? JSON.parse(savedTargetQuestions)
      : initialTargetQuestions;
  });

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const saveTargetQuestions = (targetQuestions: number) => {
    setTargetQuestions(targetQuestions);
    if (typeof window !== "undefined") {
      localStorage.setItem("targetQuestions", JSON.stringify(targetQuestions));
    }
  };

  return {
    targetQuestions,
    saveTargetQuestions,
    isLoading,
  };
}
