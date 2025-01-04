"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { UserResponse, Topic } from "@/lib/types";
import { formatTopicName, getAllTopics, calculateAccuracy } from "@/lib/utils";
import { useResponses } from "@/hooks/use-responses";
import { useQuestions } from "@/hooks/use-questions";
import { useState } from "react";
import {
  BookOpen,
  Target,
  Trophy,
  BarChart,
  TrendingDown,
  Check,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

function calculateTopicStats(
  responses: UserResponse[],
  topic: Topic,
  attempt?: number
) {
  const topicResponses = responses.filter((r) => {
    if (r.question.topic !== topic) return false;

    if (attempt !== undefined) {
      const questionAttempts = responses.filter(
        (resp) => resp.question.question_text === r.question.question_text
      );
      const responseAttempt =
        questionAttempts.findIndex((resp) => resp.timestamp === r.timestamp) +
        1;
      return responseAttempt === attempt;
    }

    return true;
  });

  return {
    total: topicResponses.length,
    correct: topicResponses.filter((r) => r.isCorrect).length,
  };
}

function calculateTopicProgress(
  responses: UserResponse[],
  questions: any[],
  topic: Topic
) {
  const topicQuestions = questions.filter((q) => q.topic === topic);
  const uniqueAnsweredQuestions = new Set(
    responses
      .filter((r) => r.question.topic === topic)
      .map((r) => r.question.question_text)
  );

  return {
    total: uniqueAnsweredQuestions.size,
    available: topicQuestions.length,
    percentage: Math.round(
      (uniqueAnsweredQuestions.size / topicQuestions.length) * 100
    ),
  };
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <Card className="col-span-1 dark:bg-gray-800 bg-background">
      <CardContent className="flex flex-col items-center p-4 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 mb-2">
          {icon}
        </div>
        <p className="text-xs font-medium text-muted-foreground mb-1">
          {title}
        </p>
        <p className="text-sm font-bold">{value}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}

function TopicCard({
  mode,
  topicData,
}: {
  mode: "progress" | "performance";
  topicData: any;
}) {
  const value =
    mode === "progress"
      ? topicData.progress.percentage
      : topicData.performance.accuracy;

  const hasData =
    mode === "progress"
      ? topicData.progress.answered > 0
      : topicData.performance.total > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-row justify-between items-start sm:items-center">
        <h3 className="text-lg font-semibold">{topicData.displayName}</h3>
        <span className="text-sm font-medium mt-1 sm:mt-0">{value}%</span>
      </div>

      {hasData && <Progress value={value} className="h-2" />}

      <div className="flex flex-wrap items-center gap-4 text-sm">
        {mode === "progress" ? (
          <div className="flex items-center bg-secondary rounded-full px-3 py-1">
            <span>
              {topicData.progress.answered}/{topicData.progress.total}
            </span>
          </div>
        ) : (
          <>
            <div className="flex items-center bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full px-3 py-1">
              <Check className="w-4 h-4 mr-2 dark:text-green-200" />
              <span>{topicData.performance.correct}</span>
            </div>
            <div className="flex items-center bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full px-3 py-1">
              <X className="w-4 h-4 mr-2 dark:text-red-200" />
              <span>
                {topicData.performance.total - topicData.performance.correct}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function ProgressDisplay() {
  const { user } = useAuth();
  const { responses, isLoading: responsesLoading } = useResponses(
    user?.id ?? null
  );
  const { questions, loading: questionsLoading } = useQuestions();
  const [selectedAttempt, setSelectedAttempt] = useState<number | undefined>(
    undefined
  );
  const [activeTab, setActiveTab] = useState<"progress" | "performance">(
    "progress"
  );

  // Don't render anything if either questions or responses are loading
  if (responsesLoading || questionsLoading || !questions) {
    return (
      <Card className="w-full dark:bg-gray-900 bg-background">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <h3 className="text-lg font-semibold mb-2">Loading Progress</h3>
          <p className="text-sm text-muted-foreground text-center">
            Please wait while the progress data is being loaded.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate overall statistics
  const allTopics = getAllTopics();
  const totalQuestions = questions.length;
  const totalAnswered = new Set(responses.map((r) => r.question.question_text))
    .size;
  const totalCorrect = responses.filter((r) => r.isCorrect).length;
  const overallAccuracy = calculateAccuracy(responses.length, totalCorrect);

  // Find best and worst performing topics
  const topicPerformance = allTopics
    .map((topic) => {
      const stats = calculateTopicStats(responses, topic);
      return {
        topic: formatTopicName(topic),
        accuracy: calculateAccuracy(stats.total, stats.correct),
        total: stats.total,
      };
    })
    .filter((t) => t.total > 0);

  const bestTopic =
    topicPerformance.length > 0
      ? topicPerformance.reduce((a, b) => (a.accuracy > b.accuracy ? a : b))
      : { topic: "-", accuracy: 0 };

  const worstTopic =
    topicPerformance.length > 0
      ? topicPerformance.reduce((a, b) => (a.accuracy < b.accuracy ? a : b))
      : { topic: "-", accuracy: 0 };

  // Calculate max attempts
  const maxAttempt = responses.reduce((max, response) => {
    const attemptNumber = responses.filter(
      (r) => r.question.question_text === response.question.question_text
    ).length;
    return Math.max(max, attemptNumber);
  }, 0);

  const attemptOptions = [
    { value: undefined, label: "All Attempts" },
    ...Array.from({ length: maxAttempt }, (_, i) => ({
      value: i + 1,
      label: `Attempt ${i + 1}`,
    })),
  ];

  const topicsData = getAllTopics()
    .map((topic) => {
      const performanceStats = calculateTopicStats(
        responses,
        topic,
        selectedAttempt
      );
      const progressStats = calculateTopicProgress(responses, questions, topic);

      return {
        topic,
        displayName: formatTopicName(topic),
        performance: {
          total: performanceStats.total,
          correct: performanceStats.correct,
          accuracy: calculateAccuracy(
            performanceStats.total,
            performanceStats.correct
          ),
        },
        progress: {
          answered: progressStats.total,
          total: progressStats.available,
          percentage: progressStats.percentage,
        },
      };
    })
    .filter((topic) => {
      if (activeTab === "performance") {
        return topic.performance.total > 0;
      } else {
        return topic.progress.answered > 0;
      }
    })
    .sort((a, b) =>
      activeTab === "performance"
        ? b.performance.total - a.performance.total
        : b.progress.percentage - a.progress.percentage
    );

  if (topicsData.length === 0) {
    return (
      <Card className="w-full dark:bg-gray-900 bg-background">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <h3 className="text-lg font-semibold mb-2">No Progress Yet</h3>
          <p className="text-sm text-muted-foreground text-center">
            Start practicing questions to see your progress and performance.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="w-full dark:bg-gray-900 bg-background">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold">
            Overall Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              icon={<BarChart className="h-4 w-4" />}
              title="Progress"
              value={`${Math.round((totalAnswered / totalQuestions) * 100)}%`}
              subtitle={`${totalAnswered}/${totalQuestions} questions`}
            />
            <StatCard
              icon={<Target className="h-4 w-4" />}
              title="Accuracy"
              value={`${overallAccuracy}%`}
              subtitle={`${totalCorrect}/${responses.length} correct`}
            />
            <StatCard
              icon={<Trophy className="h-4 w-4" />}
              title="Best Topic"
              value={bestTopic.topic}
            />
            <StatCard
              icon={<TrendingDown className="h-4 w-4" />}
              title="Worst Topic"
              value={worstTopic.topic}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="w-full dark:bg-gray-900 bg-background">
        <CardHeader className="flex flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
          <CardTitle className="text-xl font-bold mt-4">
            Topic Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "progress" | "performance")
            }
          >
            <TabsList className="grid w-full grid-cols-2 dark:bg-gray-800 bg-gray-900">
              <TabsTrigger
                className="data-[state=active]:dark:bg-gray-600"
                value="progress"
              >
                Progress
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:dark:bg-gray-600"
                value="performance"
              >
                Performance
              </TabsTrigger>
            </TabsList>
            <div className="mt-4">
              {activeTab === "performance" && (
                <select
                  value={selectedAttempt?.toString() ?? ""}
                  onChange={(e) =>
                    setSelectedAttempt(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="w-full sm:w-[180px] mb-4 border rounded p-2 dark:bg-gray-800 bg-background"
                >
                  {attemptOptions.map((option) => (
                    <option
                      key={option.value?.toString() ?? "all"}
                      value={option.value?.toString() ?? ""}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
              <div className="space-y-6">
                {topicsData.map((topicData, index) => (
                  <div key={topicData.topic}>
                    <TopicCard mode={activeTab} topicData={topicData} />
                    {index < topicsData.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
