"use client";

import { Card } from "@/components/ui/card";
import { ResetData } from "@/app/components/reset-data";
import { useTargetQuestions } from "@/hooks/use-target-questions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function SettingsPage() {
  const { targetQuestions, saveTargetQuestions } = useTargetQuestions({
    initialTargetQuestions: 5,
  });
  const [tempTarget, setTempTarget] = useState(targetQuestions.toString());

  const handleSaveTarget = () => {
    const newTarget = parseInt(tempTarget);
    if (!isNaN(newTarget) && newTarget > 0) {
      saveTargetQuestions(newTarget);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Daily Target</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-500">
                  Number of questions to maintain streak
                </label>
                <div className="flex gap-4">
                  <Input
                    type="number"
                    min="1"
                    value={tempTarget}
                    onChange={(e) => setTempTarget(e.target.value)}
                    className="max-w-[120px]"
                  />
                  <Button onClick={handleSaveTarget}>Save Target</Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Data Management</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  This will permanently delete all your practice history and
                  progress.
                </p>
                <ResetData />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
