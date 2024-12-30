"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { X } from "lucide-react";

export function PracticeControls() {
  return (
    <div className="flex justify-end mb-6">
      <Link href="/">
        <Button variant="destructive" className="gap-2">
          <X className="h-4 w-4" />
          End Practice
        </Button>
      </Link>
    </div>
  );
}
