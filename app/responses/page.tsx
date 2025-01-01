"use client";

import { ViewResponses } from "@/app/components/view-responses";
import { PracticeControls } from "@/app/components/practice-controls";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
export default function ResponsesPage() {
  return (
    <main className="min-h-screen p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-4">
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="w-full dark:bg-gray-900 dark:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        <ViewResponses />
      </div>
    </main>
  );
}
