"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";
import { UserResponse } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { StreakSkeleton } from "./skeletons/streak-skeleton";

function calculateStreak(
  responses: UserResponse[],
  targetQuestions: number
): number {
  if (!responses.length || !targetQuestions) return 0;

  // Group responses by date (YYYY-MM-DD)
  const responsesByDate = responses.reduce((acc, response) => {
    const date = new Date(response.timestamp).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get dates that met the target
  const validDates = Object.entries(responsesByDate)
    .filter(([_, count]) => count >= targetQuestions)
    .map(([date]) => date)
    .sort();

  if (!validDates.length) return 0;

  // Calculate current streak
  let streak = 0;
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // Check if today's target is met
  if (responsesByDate[today] >= targetQuestions) {
    streak = 1;
    let currentDate = yesterday;

    // Count backwards until streak breaks
    while (validDates.includes(currentDate)) {
      streak++;
      currentDate = new Date(new Date(currentDate).getTime() - 86400000)
        .toISOString()
        .split("T")[0];
    }
  }
  // If today's target isn't met, check if yesterday's was and if we can still maintain streak
  else if (responsesByDate[yesterday] >= targetQuestions) {
    streak = 1;
    let currentDate = new Date(new Date(yesterday).getTime() - 86400000)
      .toISOString()
      .split("T")[0];

    // Count backwards until streak breaks
    while (validDates.includes(currentDate)) {
      streak++;
      currentDate = new Date(new Date(currentDate).getTime() - 86400000)
        .toISOString()
        .split("T")[0];
    }
  }

  return streak;
}

export function StreakDisplay({
  responses,
  targetQuestions,
  isLoading,
  isLoaded,
}: {
  responses: UserResponse[];
  targetQuestions: number;
  isLoading: boolean;
  isLoaded: boolean;
}) {
  const streak = calculateStreak(responses, targetQuestions);

  // Get today's progress
  const today = new Date().toISOString().split("T")[0];
  const todayResponses = responses.filter(
    (r) => new Date(r.timestamp).toISOString().split("T")[0] === today
  ).length;

  if (isLoading || !isLoaded) {
    return <StreakSkeleton />;
  }

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Flame
            className={`h-6 w-6 ${
              streak > 0 ? "text-orange-500" : "text-gray-400"
            }`}
          />
          <span className="text-2xl font-bold">{streak}</span>
        </div>
        <div className="text-sm text-gray-500">
          {todayResponses}/{targetQuestions} questions today
        </div>
      </div>
    </Card>
  );
}
