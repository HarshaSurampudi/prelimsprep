"use client";

import { Card } from "@/components/ui/card";
import { LandingSignIn } from "./landing-sign-in";
import { BookOpen, BarChart, Brain, Target, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Previous Year Questions",
    description:
      "Practice with real UPSC Prelims questions from past years with explanations.",
    icon: BookOpen,
  },
  {
    title: "Progress Tracking",
    description: "See how you're doing and stay motivated.",
    icon: BarChart,
  },
  {
    title: "Adaptive Learning Algorithm",
    description: "Practice more questions on topics you're weak in.",
    icon: Brain,
  },
  {
    title: "Daily Goal and Streak",
    description:
      "Set daily goals and maintain streak by answering questions daily.",
    icon: Target,
  },
  {
    title: "More Features Coming Soon",
    description: "More features coming soon to help you prepare better.",
    icon: Rocket,
  },
];

const topics = [
  { name: "Indian Polity", count: 290 },
  { name: "History", count: 240 },
  { name: "Indian Economy", count: 238 },
  { name: "Environment", count: 226 },
  { name: "Science & Tech", count: 177 },
  { name: "Geography", count: 169 },
  { name: "Current Events", count: 55 },
];

export function LoggedOutView() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center items-center px-4 py-6">
      <div className="w-full max-w-3xl">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-gray-900 dark:text-white">
            PrelimsPrep
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-2">
            Practice platform for UPSC Prelims with 1000+ previous year
            questions from 2011-2024
          </p>
          <LandingSignIn />
        </motion.div>

        {/* Features */}
        <motion.div
          className="grid gap-4 mb-2 sm:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="p-4 bg-white dark:bg-gray-800 border-none shadow-sm"
              >
                <div className="flex gap-3 items-start">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </motion.div>

        {/* Topic Coverage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-6 bg-white dark:bg-gray-800 border-none shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              PYQs by Topic
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {topics.map((topic) => (
                <div key={topic.name} className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {topic.count}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {topic.name}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2024 PrelimsPrep</p>
        </footer>
      </div>
    </div>
  );
}
