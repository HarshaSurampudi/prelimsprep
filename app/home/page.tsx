"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Rocket, Bookmark, Flag, Clock } from "lucide-react";
import { StreakDisplay } from "@/app/components/streak-display";
import { ProgressDisplay } from "@/app/components/progress-display";
import { HowItWorks } from "@/app/components/how-it-works";
import { getAllTopics, formatTopicName } from "@/lib/utils";
import Joyride from "react-joyride";
import { useTour } from "@/hooks/use-tour";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { run, steps, stepIndex, handleJoyrideCallback } = useTour();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="py-8 sm:py-12">
      {mounted && (
        <Joyride
          run={run}
          steps={steps}
          stepIndex={stepIndex}
          callback={handleJoyrideCallback}
          continuous
          hideCloseButton
          showProgress
          showSkipButton
          styles={{
            options: {
              zIndex: 10000,
              primaryColor: "#22c55e",
            },
          }}
        />
      )}

      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="streak-display">
          <StreakDisplay />
        </div>

        {/* Main Practice Button */}
        <div className="mb-6">
          <Link href="/practice">
            <Button
              size="lg"
              className="practice-button w-full dark:bg-green-900 dark:text-white flex items-center justify-center gap-2"
            >
              Start Practice
              <Rocket className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Topic Selection Grid */}
        <div className="topic-grid mb-6">
          <h2 className="text-lg font-semibold mb-3">Practice by Topic</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {getAllTopics().map((topic) => (
              <Link
                key={topic}
                href={`/practice?topic=${encodeURIComponent(topic)}`}
              >
                <Button
                  variant="outline"
                  className="w-full h-auto py-4 px-3 flex flex-col items-center justify-center gap-2 text-center bg-gray-900 text-white"
                >
                  <span className="text-xs font-medium">
                    {formatTopicName(topic)}
                  </span>
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Additional Navigation */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <Link href="/bookmarks" className="sm:flex-1">
            <Button
              variant="outline"
              size="lg"
              className="bookmarks-button w-full dark:bg-gray-900 dark:text-white flex items-center justify-center gap-2"
            >
              <Bookmark className="h-5 w-5" />
              Bookmarks
            </Button>
          </Link>
          <Link href="/responses" className="sm:flex-1">
            <Button
              variant="outline"
              size="lg"
              className="history-button w-full dark:bg-gray-900 dark:text-white flex items-center justify-center gap-2"
            >
              <Clock className="h-5 w-5" />
              View History
            </Button>
          </Link>
          <Link href="/reports" className="sm:flex-1">
            <Button
              variant="outline"
              size="lg"
              className="w-full dark:bg-gray-900 dark:text-white flex items-center justify-center gap-2 reported-issues-button"
            >
              <Flag className="h-5 w-5" />
              Reported Issues
            </Button>
          </Link>
        </div>

        <div className="progress-display">
          <ProgressDisplay />
        </div>
        <HowItWorks />
      </div>
    </main>
  );
}
