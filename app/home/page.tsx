"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Rocket, Bookmark } from "lucide-react";
import { StreakDisplay } from "@/app/components/streak-display";
import { ProgressDisplay } from "@/app/components/progress-display";
import { HowItWorks } from "@/app/components/how-it-works";
import { getAllTopics, formatTopicName } from "@/lib/utils";

export default function HomePage() {
  return (
    <main className="py-8 sm:py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <StreakDisplay />

        {/* Main Practice Button */}
        <div className="mb-6">
          <Link href="/practice">
            <Button
              size="lg"
              className="w-full dark:bg-green-900 dark:text-white flex items-center justify-center gap-2"
            >
              Start Practice
              <Rocket className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Topic Selection Grid */}
        <div className="mb-6">
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
        <div className="flex gap-2 mb-6">
          <Link href="/bookmarks" className="flex-1">
            <Button
              variant="outline"
              size="lg"
              className="w-full dark:bg-gray-900 dark:text-white flex items-center justify-center gap-2"
            >
              <Bookmark className="h-5 w-5" />
              Bookmarks
            </Button>
          </Link>
          <Link href="/responses" className="flex-1">
            <Button
              variant="outline"
              size="lg"
              className="w-full dark:bg-gray-900 dark:text-white"
            >
              View History
            </Button>
          </Link>
        </div>

        <ProgressDisplay />
        <HowItWorks />
      </div>
    </main>
  );
}
