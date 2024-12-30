"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { UserResponse } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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

export function StreakDisplay() {
  const [targetQuestions, setTargetQuestions, targetLoading] =
    useLocalStorage<number>("targetQuestions", 5);
  const [responses, _, responsesLoading] = useLocalStorage<UserResponse[]>(
    "responses",
    []
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tempTarget, setTempTarget] = useState(targetQuestions.toString());

  // Don't render anything while loading to prevent hydration mismatch
  if (targetLoading || responsesLoading) {
    return null;
  }

  const streak = calculateStreak(responses, targetQuestions);

  // Get today's progress
  const today = new Date().toISOString().split("T")[0];
  const todayResponses = responses.filter(
    (r) => new Date(r.timestamp).toISOString().split("T")[0] === today
  ).length;

  const handleSaveTarget = () => {
    const newTarget = parseInt(tempTarget);
    if (!isNaN(newTarget) && newTarget > 0) {
      setTargetQuestions(newTarget);
      setIsDialogOpen(false);
    }
  };

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Set Target
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Daily Question Target</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-500">
                  Number of questions to maintain streak
                </label>
                <Input
                  type="number"
                  min="1"
                  value={tempTarget}
                  onChange={(e) => setTempTarget(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button onClick={handleSaveTarget} className="w-full">
                Save Target
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}
