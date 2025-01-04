import { useState, useEffect } from "react";
import { Step } from "react-joyride";

const TOUR_KEY = "app_tour_completed";

export function useTour() {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const tourCompleted = localStorage.getItem(TOUR_KEY);
    if (!tourCompleted) {
      setRun(true);
    }
  }, []);

  const steps: Step[] = [
    {
      target: ".practice-button",
      content:
        "Start practicing here. The adaptive algorithm will help you focus on your weak areas by selecting topics and tuning the difficulty of questions based on your performance.",
      disableBeacon: true,
    },
    {
      target: ".topic-grid",
      content:
        "Or choose a specific topic to practice. Still the adaptive algorithm will tune the difficulty of questions based on your performance.",
    },
    {
      target: ".streak-display",
      content:
        "Track your daily practice streak. Consistent practice is key to success!",
    },
    {
      target: ".progress-display",
      content:
        "Monitor your performance across different topics and identify areas that need more attention.",
    },
    {
      target: ".bookmarks-button",
      content: "View the questions you have bookmarked here.",
    },
    {
      target: ".history-button",
      content: "View the questions you have answered here.",
    },
    {
      target: ".reported-issues-button",
      content:
        "Report any issues or suggestions to help in improving the app. You can also view the list of issues you have reported and their status.",
    },
  ];

  const handleJoyrideCallback = (data: any) => {
    const { status, type } = data;
    const finishedStatuses: string[] = ["finished", "skipped"];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem(TOUR_KEY, "true");
    }

    if (type === "step:after") {
      setStepIndex(stepIndex + 1);
    }
  };

  return {
    run,
    steps,
    stepIndex,
    handleJoyrideCallback,
  };
}
