import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, Rocket } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/home");
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-4 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex justify-center items-center mb-6">
          <BookOpen className="h-12 w-12 text-primary mr-2" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            PrelimsPrep
          </h1>
        </div>

        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Practice UPSC Prelims GS Paper 1 with a comprehensive collection of
          previous year questions
        </p>

        <ul className="space-y-2 mb-8 text-left max-w-md mx-auto">
          {[
            "1000+ previous year questions (2011-2023)",
            "Practice regularly and maintain a streak",
            "Adaptive learning algorithm that lets you focus on your weaknesses",
            "Track your progress",
          ].map((feature, index) => (
            <li
              key={index}
              className="flex items-center text-gray-700 dark:text-gray-300"
            >
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
          <li className="flex items-center text-gray-700 dark:text-gray-300">
            <Rocket className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
            <span>More features coming soon!</span>
          </li>
        </ul>

        <Link href="/login">
          <Button size="lg" className="w-full sm:w-auto">
            Start Practice
          </Button>
        </Link>
      </div>
    </main>
  );
}
