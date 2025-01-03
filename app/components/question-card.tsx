"use client";

import { Question, UserResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatTopicName } from "@/lib/utils";
import { useState, useRef, TouchEvent, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Flag, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useReports } from "@/hooks/use-reports";
import { useAuth } from "@/hooks/use-auth";

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
  showExplanation: boolean;
  showDifficultyRating: boolean;
  onNext: () => void;
  onDifficultyRating: (rating: number) => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export function QuestionCard({
  question,
  onAnswer,
  showExplanation,
  showDifficultyRating,
  onNext,
  onDifficultyRating,
  isBookmarked,
  onToggleBookmark,
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const isCorrect = selectedAnswer === question.correct_answer;

  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const minSwipeDistance = 50;
  const maxSwipeOffset = 200;

  const { user } = useAuth(false);
  const { reportIssue, isSubmitting } = useReports(user?.id ?? null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportType, setReportType] = useState<string>("");
  const [reportDescription, setReportDescription] = useState("");

  useEffect(() => {
    setSelectedAnswer(null);
    setIsExiting(false);
  }, [question.question_text]);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!showExplanation) return;

    touchEndX.current = e.touches[0].clientX;
    const diff = touchEndX.current - touchStartX.current;
    if (diff < 0) {
      const offset = Math.max(diff, -maxSwipeOffset);
      (e.currentTarget as HTMLElement).style.transform = `translateX(${offset}px)`;
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const swipeDistance = touchEndX.current - touchStartX.current;

    if (
      showExplanation &&
      Math.abs(swipeDistance) > minSwipeDistance &&
      swipeDistance < 0
    ) {
      setIsExiting(true);
      setTimeout(onNext, 300);
    } else {
      (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
    }
  };

  const handleReportSubmit = async () => {
    const success = await reportIssue({
      questionId: question.id,
      issueType: reportType,
      description: reportDescription,
    });

    if (success) {
      setIsReportDialogOpen(false);
      setReportType("");
      setReportDescription("");
    }
  };

  if (showDifficultyRating) {
    return (
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30,
          opacity: { duration: 0.2 }
        }}
      >
        <Card className="p-6 dark:bg-gray-900 bg-background">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Rate This Question</h3>
              <p className="text-gray-500 dark:text-gray-400">
                How difficult was this question for you?
              </p>
            </div>

            <div className="space-y-4">
              {[
                { rating: 1, label: "Very Easy" },
                { rating: 2, label: "Easy" },
                { rating: 3, label: "Moderate" },
                { rating: 4, label: "Difficult" },
                { rating: 5, label: "Very Difficult" },
              ].map(({ rating, label }) => (
                <Button
                  key={rating}
                  variant="outline"
                  className="w-full justify-between h-auto py-4 px-4 bg-background dark:bg-gray-800"
                  onClick={() => {
                    setIsExiting(true);
                    setTimeout(() => onDifficultyRating(rating), 300);
                  }}
                >
                  <span>{label}</span>
                  <span className="text-lg font-semibold">{rating}</span>
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30,
          opacity: { duration: 0.2 }
        }}
      >
        <Card
          className="p-4 sm:p-6 transition-all duration-200 dark:bg-gray-900 bg-background"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex justify-between items-start gap-4 mb-6">
            <div className="space-y-1.5">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Collection: {question.collection}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Topic: {formatTopicName(question.topic)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={`shrink-0 ${
                  question.attempts && question.attempts > 0
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                }`}
              >
                {question.attempts && question.attempts > 0
                  ? `Attempt #${showExplanation ? question.attempts : question.attempts + 1}`
                  : "First Attempt"}
              </Badge>

              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleBookmark}
                className="h-8 w-8 p-0"
              >
                <Bookmark
                  className={`h-4 w-4 ${
                    isBookmarked ? "fill-current text-yellow-500" : ""
                  }`}
                />
              </Button>

              <Dialog
                open={isReportDialogOpen}
                onOpenChange={setIsReportDialogOpen}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DialogTrigger asChild>
                      <DropdownMenuItem>
                        <Flag className="h-4 w-4 mr-2" />
                        Report Issue
                      </DropdownMenuItem>
                    </DialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Report an Issue</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <RadioGroup value={reportType} onValueChange={setReportType}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="incorrect_answer"
                          id="incorrect_answer"
                        />
                        <Label htmlFor="incorrect_answer">Incorrect Answer</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="unclear_question"
                          id="unclear_question"
                        />
                        <Label htmlFor="unclear_question">Unclear Question</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other">Other</Label>
                      </div>
                    </RadioGroup>

                    <Textarea
                      placeholder="Describe the issue..."
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                    />

                    <Button
                      onClick={handleReportSubmit}
                      disabled={!reportType || !reportDescription || isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Report"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-lg font-medium whitespace-pre-wrap">
              {question.question_text}
            </p>

            <div className="grid grid-cols-1 gap-3">
              {Object.entries(question.options).map(([key, value]) => (
                <Button
                  key={key}
                  variant="outline"
                  className={`w-full h-auto py-3 px-4 justify-start text-left whitespace-normal dark:bg-gray-800 bg-background ${
                    showExplanation
                      ? key === question.correct_answer
                        ? "border-green-500 dark:border-green-400"
                        : key === selectedAnswer
                        ? "border-red-500 dark:border-red-400"
                        : ""
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedAnswer(key);
                    onAnswer(key);
                  }}
                  disabled={showExplanation}
                >
                  <span className="font-medium mr-2 shrink-0">{key.toUpperCase()}.</span>
                  <span>{value}</span>
                </Button>
              ))}
            </div>

            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  opacity: { duration: 0.3 },
                  y: { type: "spring", stiffness: 300, damping: 25 }
                }}
                className="mt-6"
              >
                <div
                  className={`p-4 rounded-lg mb-4 ${
                    isCorrect
                      ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                      : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                  }`}
                >
                  <p className="font-semibold mb-2">
                    {isCorrect ? "Correct!" : "Incorrect"}
                  </p>
                  <p className="whitespace-pre-wrap">{question.explanation}</p>
                </div>
                <Button
                  className="w-full dark:bg-gray-600 bg-background dark:text-white"
                  onClick={() => {
                    setIsExiting(true);
                    setTimeout(onNext, 300);
                  }}
                >
                  Continue
                </Button>
              </motion.div>
            )}
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}