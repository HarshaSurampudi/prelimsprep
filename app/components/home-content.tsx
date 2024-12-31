"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ProgressDisplay } from "./progress-display";
import { StreakDisplay } from "./streak-display";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/context/auth-context";
import { UserResponse } from "@/lib/types";
import { LoggedOutView } from "./logged-out-view";
import {
  getUserResponses,
  getUserPreferences,
  saveUserPreferences,
} from "@/lib/firebase/storage";

type TopicStats = {
  topic: string;
  count: number;
  percentage: number;
};

type YearStats = {
  year: string;
  count: number;
};

const topicStats: TopicStats[] = [
  { topic: "Indian Polity", count: 290, percentage: 20.8 },
  { topic: "History", count: 240, percentage: 17.2 },
  { topic: "Indian Economy", count: 238, percentage: 17.1 },
  { topic: "Environment and Ecology", count: 226, percentage: 16.2 },
  { topic: "Science & Technology", count: 177, percentage: 12.7 },
  { topic: "Geography", count: 169, percentage: 12.1 },
  { topic: "Current Events", count: 55, percentage: 3.9 },
];

const yearStats: YearStats[] = [
  { year: "2024", count: 100 },
  { year: "2023", count: 99 },
  { year: "2022", count: 98 },
  { year: "2021", count: 100 },
  { year: "2020", count: 100 },
  { year: "2019", count: 100 },
  { year: "2018", count: 100 },
  { year: "2017", count: 99 },
  { year: "2016", count: 100 },
  { year: "2015", count: 100 },
  { year: "2014", count: 100 },
  { year: "2013", count: 100 },
  { year: "2012", count: 100 },
  { year: "2011", count: 99 },
];

function LoggedInView({
  responses,
  isLoading,
  isLoaded,
  targetQuestions,
  showStats,
  setShowStats,
}: {
  responses: UserResponse[];
  isLoading: boolean;
  isLoaded: boolean;
  targetQuestions: number;
  showStats: boolean;
  setShowStats: (show: boolean) => void;
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-center text-gray-900 dark:text-gray-50">
        PrelimsPrep
      </h1>

      <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-center text-gray-600 dark:text-gray-300">
        Master UPSC Prelims GS1 with intelligent, personalized practice on 1000+
        PYQs
      </p>

      <StreakDisplay
        responses={responses}
        targetQuestions={targetQuestions}
        isLoading={isLoading}
        isLoaded={isLoaded}
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Link href="/practice" className="w-full">
          <Button size="lg" className="w-full">
            Start Practice
          </Button>
        </Link>
      </div>

      <ProgressDisplay
        responses={responses}
        isLoading={isLoading}
        isLoaded={isLoaded}
      />

      <Card className="p-4 sm:p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          How it works
        </h2>
        <ul className="space-y-3 sm:space-y-4 mb-6 text-gray-600 dark:text-gray-300">
          <li className="space-y-2">
            <div className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span>
                Practice with previous year questions and get immediate feedback
                and explanations
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="ml-1 inline-flex items-center text-primary hover:text-primary/80 text-sm font-medium"
                >
                  <span className="underline">View coverage</span>
                  {showStats ? (
                    <ChevronUp className="h-4 w-4 ml-0.5" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-0.5" />
                  )}
                </button>
              </span>
            </div>

            {showStats && (
              <div className="ml-6 mt-2 text-sm bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-3">
                <div>
                  <h3 className="font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    Topic-wise Distribution
                  </h3>
                  <div className="space-y-1">
                    {topicStats.map((stat) => (
                      <div
                        key={stat.topic}
                        className="flex justify-between text-gray-600 dark:text-gray-400"
                      >
                        <span>{stat.topic}</span>
                        <span>
                          {stat.count} ({stat.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    Year-wise Coverage
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 text-gray-600 dark:text-gray-400">
                    {yearStats.map((stat) => (
                      <div key={stat.year}>
                        {stat.year}: {stat.count}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </li>

          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">•</span>
            <span>
              The algorithm adapts to your performance, focusing on topics where
              you need more practice. The initial 40 questions are evenly
              distributed across all topics
            </span>
          </li>

          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">•</span>
            <span>
              Practice the target number of questions daily to maintain your
              streak
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">•</span>
            <span>
              Your data is securely stored in the cloud and synced across your
              devices. You can access your progress from anywhere by signing in
              with your Google account.
            </span>
          </li>
        </ul>
      </Card>

      <div className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
        Version 0.1.10
      </div>
    </div>
  );
}

export function HomeContent() {
  const { user, loading: authLoading } = useAuth();
  const [showStats, setShowStats] = useState(false);
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [targetQuestions, setTargetQuestions] = useState(5);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (user) {
        setIsLoading(true);
        const [userResponses, preferences] = await Promise.all([
          getUserResponses(user.uid),
          getUserPreferences(user.uid),
        ]);
        setResponses(userResponses);
        setTargetQuestions(preferences.targetQuestions ?? 5);
      }
      setIsLoading(false);
      setIsLoaded(true);
    }
    loadData();
  }, [user]);

  const handleSaveTarget = async (newTarget: number) => {
    if (user) {
      await saveUserPreferences(user.uid, {
        targetQuestions: newTarget,
      });
      setTargetQuestions(newTarget);
    }
  };

  if (authLoading) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 sm:py-12">
      {!user ? (
        <LoggedOutView />
      ) : (
        <LoggedInView
          responses={responses}
          isLoading={isLoading}
          isLoaded={isLoaded}
          targetQuestions={targetQuestions}
          showStats={showStats}
          setShowStats={setShowStats}
        />
      )}
    </main>
  );
}
