import { UserMenu } from "@/components/auth/user-menu";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6" />
          <span className="font-bold">PrelimsPrep</span>
        </Link>
        <UserMenu />
      </div>
    </header>
  );
}
