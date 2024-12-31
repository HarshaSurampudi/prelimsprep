"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  BookOpen,
  ArrowRight,
  Target,
  Zap,
  Trophy,
  Clock,
} from "lucide-react";
import { UserResponse, Topic, Question } from "@/lib/types";
import { formatTopicName, getAllTopics, calculateAccuracy } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { ProgressSkeleton } from "./skeletons/progress-skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useQuestions } from "@/lib/hooks/use-questions";

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
  topic: Topic,
  allQuestions: Question[]
) {
  // Get all questions for this topic
  const allQuestionsForTopic = allQuestions.filter((q) => q.topic === topic);

  // Get unique questions attempted for this topic
  const uniqueQuestionsAttempted = new Set(
    responses
      .filter((r) => r.question.topic === topic)
      .map((r) => r.question.question_text)
  );

  return {
    attempted: uniqueQuestionsAttempted.size,
    total: allQuestionsForTopic.length,
    percentage:
      allQuestionsForTopic.length > 0
        ? Math.round(
            (uniqueQuestionsAttempted.size / allQuestionsForTopic.length) * 100
          )
        : 0,
  };
}

export function ProgressDisplay({
  responses,
  isLoading,
  isLoaded,
}: {
  responses: UserResponse[];
  isLoading: boolean;
  isLoaded: boolean;
}) {
  const [selectedAttempt, setSelectedAttempt] = useState<number | undefined>(
    undefined
  );
  const [view, setView] = useState<"performance" | "progress">("performance");
  const { questions, loading: questionsLoading } = useQuestions();

  // Calculate overall statistics
  const uniqueQuestions = new Set(
    responses.map((r) => r.question.question_text)
  );
  const totalAttempted = uniqueQuestions.size;
  const overallCorrect = responses.filter((r) => r.isCorrect).length;
  const overallAccuracy = calculateAccuracy(responses.length, overallCorrect);

  // Calculate current streak
  const sortedResponses = [...responses].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  let currentStreak = 0;
  for (const response of sortedResponses) {
    if (response.isCorrect) currentStreak++;
    else break;
  }

  if (isLoading || !isLoaded || questionsLoading) {
    return <ProgressSkeleton />;
  }

  // Calculate max attempts across all questions
  const maxAttempt = responses.reduce((max, response) => {
    const attemptNumber = responses.filter(
      (r) => r.question.question_text === response.question.question_text
    ).length;
    return Math.max(max, attemptNumber);
  }, 0);

  // Create attempt options
  const attemptOptions = [
    { value: "all", label: "All Attempts" },
    ...Array.from({ length: maxAttempt }, (_, i) => ({
      value: (i + 1).toString(),
      label: `Attempt ${i + 1}`,
    })),
  ];

  const topics = getAllTopics();
  const topicsData = topics
    .map((topic) => {
      const stats = calculateTopicStats(responses, topic, selectedAttempt);
      const progress = calculateTopicProgress(responses, topic, questions);
      return {
        topic,
        displayName: formatTopicName(topic),
        performance: {
          total: stats.total,
          correct: stats.correct,
          accuracy: calculateAccuracy(stats.total, stats.correct),
        },
        progress,
      };
    })
    .filter((topic) =>
      view === "performance"
        ? topic.performance.total > 0
        : topic.progress.attempted > 0
    )
    .sort((a, b) =>
      view === "performance"
        ? b.performance.total - a.performance.total
        : b.progress.percentage - a.progress.percentage
    );

  if (topicsData.length === 0 && isLoaded) {
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      <CardHeader className="pb-2">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              {view === "performance" ? "Your Performance" : "Your Progress"}
            </CardTitle>
            <Link href="/responses">
              <Button variant="outline" size="sm" className="whitespace-nowrap">
                View History
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="relative overflow-hidden transition-all hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-950/50" />
            <div className="relative p-6 flex flex-col items-center justify-center text-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {totalAttempted}
              </div>
              <div className="text-sm font-medium text-blue-600/80 dark:text-blue-400/80">
                Questions Attempted
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden transition-all hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-transparent dark:from-yellow-950/50" />
            <div className="relative p-6 flex flex-col items-center justify-center text-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-full">
                <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {overallAccuracy}%
              </div>
              <div className="text-sm font-medium text-yellow-600/80 dark:text-yellow-400/80">
                Overall Accuracy
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden transition-all hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-950/50" />
            <div className="relative p-6 flex flex-col items-center justify-center text-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {currentStreak}
              </div>
              <div className="text-sm font-medium text-purple-600/80 dark:text-purple-400/80">
                Question Streak
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden transition-all hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent dark:from-green-950/50" />
            <div className="relative p-6 flex flex-col items-center justify-center text-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full">
                <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {responses.length}
              </div>
              <div className="text-sm font-medium text-green-600/80 dark:text-green-400/80">
                Total Attempts
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as "performance" | "progress")}
            className="w-full sm:w-[200px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>
          </Tabs>
          {view === "performance" && (
            <Select
              value={selectedAttempt?.toString() ?? "all"}
              onValueChange={(value) =>
                setSelectedAttempt(value === "all" ? undefined : Number(value))
              }
            >
              <SelectTrigger className="w-full sm:w-[130px]">
                <SelectValue placeholder="Select attempt" />
              </SelectTrigger>
              <SelectContent>
                {attemptOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="grid gap-6">
          {topicsData.map(({ topic, displayName, performance, progress }) => (
            <div key={topic} className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{displayName}</span>
                </div>
                {view === "performance" ? (
                  <div className="flex items-center space-x-2 text-sm">
                    <Badge variant="secondary" className="font-mono">
                      {performance.accuracy}%
                    </Badge>
                    <span className="text-green-600 dark:text-green-400 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {performance.correct}
                    </span>
                    <span className="text-red-600 dark:text-red-400 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" />
                      {performance.total - performance.correct}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-sm">
                    <Badge variant="secondary" className="font-mono">
                      {progress.percentage}%
                    </Badge>
                    <span className="text-muted-foreground">
                      {progress.attempted}/{progress.total} questions attempted
                    </span>
                  </div>
                )}
              </div>
              <Progress
                value={
                  view === "performance"
                    ? performance.accuracy
                    : progress.percentage
                }
                className="h-2"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
