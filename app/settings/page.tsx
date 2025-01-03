"use client";

import { Card } from "@/components/ui/card";
import { ResetData } from "@/app/components/reset-data";
import { useSettings } from "@/hooks/use-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function SettingsPage() {
  const { settings, saveSettings } = useSettings();
  const [tempTarget, setTempTarget] = useState(settings.targetQuestions.toString());

  const handleSaveTarget = () => {
    const newTarget = parseInt(tempTarget);
    if (!isNaN(newTarget) && newTarget > 0) {
      saveSettings({ targetQuestions: newTarget });
    }
  };

  return (
    <main className="p-4 bg-background dark:bg-gray-800 mb-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <div className="space-y-6">
          <Card className="p-6 bg-background dark:bg-gray-900">
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
                    className="max-w-[120px] bg-background dark:bg-gray-800"
                  />
                  <Button onClick={handleSaveTarget} variant="outline" className="bg-background dark:bg-gray-800">
                    Save Target
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-background dark:bg-gray-900">
            <h2 className="text-xl font-semibold mb-4">Practice Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">
                    Difficulty Rating
                  </label>
                  <p className="text-sm text-gray-500">
                    Ask for difficulty rating after each question
                  </p>
                </div>
                <Switch
                  checked={settings.showDifficultyRating}
                  onCheckedChange={(checked) =>
                    saveSettings({ showDifficultyRating: checked })
                  }
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-background dark:bg-gray-900">
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
