"use client";

import { ViewResponses } from "@/app/components/view-responses";
import { PracticeControls } from "@/app/components/practice-controls";

export default function ResponsesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <PracticeControls />
        <ViewResponses />
      </div>
    </main>
  );
}
