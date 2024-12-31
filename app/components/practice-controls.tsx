"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { X } from "lucide-react";

interface PracticeControlsProps {
  startTime: Date;
  questionsAnswered: number;
}

export function PracticeControls({
  startTime,
  questionsAnswered,
}: PracticeControlsProps) {
  const [elapsedTime, setElapsedTime] = useState("00:00");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diffInSeconds = Math.floor(
        (now.getTime() - startTime.getTime()) / 1000
      );
      const minutes = Math.floor(diffInSeconds / 60);
      const seconds = diffInSeconds % 60;
      setElapsedTime(
        `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  return (
    <div className="grid grid-cols-3 items-center mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="text-sm">
        <span className="font-medium">Time:</span>
        <span className="ml-2">{elapsedTime}</span>
      </div>
      <div className="text-sm text-center">
        <span className="font-medium">Questions:</span>
        <span className="ml-2">{questionsAnswered}</span>
      </div>
      <div className="flex justify-end">
        <Link href="/">
          <Button variant="destructive" size="sm" className="gap-2">
            <X className="h-4 w-4" />
            End
          </Button>
        </Link>
      </div>
    </div>
  );
}
