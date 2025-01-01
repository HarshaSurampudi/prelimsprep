"use client";

import { Card } from "@/components/ui/card";
import { Timer, CircleIcon } from "lucide-react";

interface SessionStatsProps {
  formattedTime: string;
  questionsAnswered: number;
}

export function SessionStats({
  formattedTime,
  questionsAnswered,
}: SessionStatsProps) {
  return (
    <Card className="p-4 mb-6 flex items-center justify-between bg-white/50 dark:bg-gray-800/50 backdrop-blur">
      <div className="flex items-center gap-2">
        <Timer className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {formattedTime}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <CircleIcon className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {questionsAnswered} question{questionsAnswered !== 1 ? "s" : ""}{" "}
          answered
        </span>
      </div>
    </Card>
  );
}
