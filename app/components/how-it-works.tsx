"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

export function HowItWorks() {
  const [showStats, setShowStats] = useState(false);

  return (
    <Card className="w-full max-w-4xl mx-auto mt-4 bg-background dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">How it works</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold mb-2">
            Practice with previous year questions
          </h3>
          <p className="mb-4">
            Get immediate feedback and explanations for each question you
            attempt.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowStats(!showStats)}
            className="mb-4 bg-background dark:bg-gray-900"
          >
            {showStats ? "Hide coverage" : "View coverage"}
            {showStats ? (
              <ChevronUp className="h-4 w-4 ml-2" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-2" />
            )}
          </Button>
          {showStats && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Topic-wise Distribution</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Topic</TableHead>
                      <TableHead className="text-right">
                        Question Count
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topicStats.map((stat) => (
                      <TableRow key={stat.topic}>
                        <TableCell>{stat.topic}</TableCell>
                        <TableCell className="text-right">
                          {stat.count} ({stat.percentage.toFixed(1)}%)
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Year-wise Coverage</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead className="text-right">
                        Question Count
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {yearStats.map((stat) => (
                      <TableRow key={stat.year}>
                        <TableCell>{stat.year}</TableCell>
                        <TableCell className="text-right">
                          {stat.count}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </section>

        <Separator />

        <section>
          <h3 className="text-lg font-semibold mb-2">
            Daily practice and streaks
          </h3>
          <p>
            Practice the target number of questions daily to maintain your
            streak. Consistent practice is key to improving your performance.
          </p>
        </section>

        <Separator />

        <section>
          <h3 className="text-lg font-semibold mb-2">
            Adaptive learning algorithm
          </h3>
          <p>
            The algorithm adapts to your performance, focusing on topics where
            you need more practice. The initial 40 questions are evenly
            distributed across all topics to establish a baseline.
          </p>
        </section>

        <Separator />
      </CardContent>
    </Card>
  );
}
