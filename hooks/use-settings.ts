"use client";

import { useEffect, useState } from "react";

interface Settings {
  targetQuestions: number;
  showDifficultyRating: boolean;
}

export function useSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window === "undefined") {
      return {
        targetQuestions: 10,
        showDifficultyRating: true,
      };
    }
    const savedSettings = localStorage.getItem("settings");
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          targetQuestions: 10,
          showDifficultyRating: true,
        };
  });

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const saveSettings = (newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    if (typeof window !== "undefined") {
      localStorage.setItem("settings", JSON.stringify(updatedSettings));
    }
  };

  return {
    settings,
    saveSettings,
    isLoading,
  };
} 