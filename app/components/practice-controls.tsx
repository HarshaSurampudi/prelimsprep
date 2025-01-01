"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { X, Timer, CircleIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PracticeControlsProps {
  elapsedTime: string;
  questionsAnswered: number;
}

export function PracticeControls({
  elapsedTime,
  questionsAnswered,
}: PracticeControlsProps) {
  return (
    <Card className="mb-6 dark:bg-gray-900 bg-background">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {elapsedTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Questions: {questionsAnswered}
              </span>
            </div>
          </div>
          <Link href="/">
            <Button variant="destructive" size="sm" className="gap-2">
              <X className="h-4 w-4" />
              End
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
