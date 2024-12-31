"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/context/auth-context";
import {
  getUserPreferences,
  saveUserPreferences,
  saveUserResponses,
} from "@/lib/firebase/storage";

export default function SettingsPage() {
  const { user } = useAuth();
  const [targetQuestions, setTargetQuestions] = useState(5);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    async function loadPreferences() {
      if (user) {
        const preferences = await getUserPreferences(user.uid);
        setTargetQuestions(preferences.targetQuestions ?? 5);
      }
      setIsLoading(false);
    }
    loadPreferences();
  }, [user]);

  const handleSaveTarget = async () => {
    if (user) {
      setIsSaving(true);
      try {
        await saveUserPreferences(user.uid, {
          targetQuestions: targetQuestions,
        });
        toast({
          title: "Settings saved",
          description: "Your preferences have been updated successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save settings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleReset = async () => {
    if (user) {
      setIsResetting(true);
      try {
        await saveUserResponses(user.uid, []);
        setIsResetDialogOpen(false);
        toast({
          title: "Data reset",
          description: "All your data has been reset successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to reset data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsResetting(false);
      }
    }
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">
          Settings
        </h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Preferences</CardTitle>
              <CardDescription>
                Customize your learning experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="target-questions">Daily Target Questions</Label>
                <Input
                  id="target-questions"
                  type="number"
                  min="1"
                  value={targetQuestions}
                  onChange={(e) => setTargetQuestions(Number(e.target.value))}
                  className="max-w-[200px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Manage your account data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog
                open={isResetDialogOpen}
                onOpenChange={setIsResetDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Reset All Data
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reset All Data</DialogTitle>
                    <DialogDescription>
                      This will permanently delete all your progress and
                      statistics. This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsResetDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleReset}
                      disabled={isResetting}
                    >
                      {isResetting ? "Resetting..." : "Reset All Data"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveTarget} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
