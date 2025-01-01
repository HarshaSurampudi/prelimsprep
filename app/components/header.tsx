"use client";

import { HeaderMenu } from "@/app/components/header-menu";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/hooks/use-auth";

export function Header() {
  const { user } = useAuth(false);
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center space-x-3 transition-colors hover:opacity-90"
        >
          <BookOpen className="h-6 w-6 sm:h-7 sm:w-7" />
          <span className=" font-bold text-xl">PrelimsPrep</span>
        </Link>
        <div className="flex items-center space-x-2">
          {user && <HeaderMenu />}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
