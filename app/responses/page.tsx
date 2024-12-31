"use client";

import { ViewResponses } from "@/app/components/view-responses";
import { ResponsesSkeleton } from "@/app/components/skeletons/responses-skeleton";
import { UserResponse } from "@/lib/types";
import { getUserResponses } from "@/lib/firebase/storage";
import { useAuth } from "@/lib/context/auth-context";
import { useEffect, useState } from "react";

export default function ResponsesPage() {
  const { user } = useAuth();
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadResponses() {
      if (user) {
        const userResponses = await getUserResponses(user.uid);
        setResponses(userResponses);
      }
      setIsLoading(false);
    }
    loadResponses();
  }, [user]);

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
