"use client";

import { UserMenu } from "@/app/components/auth/user-menu";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center space-x-3 transition-colors hover:opacity-90"
        >
          <BookOpen className="h-6 w-6 sm:h-7 sm:w-7" />
          <span className=" font-bold text-xl">PrelimsPrep</span>
        </Link>

        <UserMenu />
      </div>
    </header>
  );
}
