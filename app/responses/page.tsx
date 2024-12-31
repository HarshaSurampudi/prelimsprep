"use client";

import { ViewResponses } from "@/app/components/view-responses";
import { ResponsesSkeleton } from "@/app/components/skeletons/responses-skeleton";
import { UserResponse } from "@/lib/types";
import { useStorage } from "@/lib/hooks/use-storage";

export default function ResponsesPage() {
  const [responses, _, isLoading] = useStorage<UserResponse[]>("responses", []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {isLoading ? (
          <ResponsesSkeleton />
        ) : (
          <ViewResponses responses={responses} isLoading={isLoading} />
        )}
      </div>
    </main>
  );
}
