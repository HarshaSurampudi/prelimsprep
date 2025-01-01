"use client";

import { useState, useEffect } from "react";

export function useSessionStats() {
  const [startTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [questionsAnswered, setQuestionsAnswered] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
    parts.push(`${remainingSeconds}s`);

    return parts.join(" ");
  };

  const incrementQuestionsAnswered = () => {
    setQuestionsAnswered((prev) => prev + 1);
  };

  return {
    elapsedTime,
    formattedTime: formatTime(elapsedTime),
    questionsAnswered,
    incrementQuestionsAnswered,
  };
}
