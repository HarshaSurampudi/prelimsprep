"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StreakSkeleton() {
  return (
    <Card className="p-4 mb-6">
      <Skeleton className="h-10 w-40" />
    </Card>
  );
}
