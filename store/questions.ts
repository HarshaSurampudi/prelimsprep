import { create } from "zustand";
import { Question, Topic } from "@/lib/types";

interface QuestionsState {
  questions: Question[];
  selectedTopic: Topic | null;
  setQuestions: (questions: Question[]) => void;
  setSelectedTopic: (topic: Topic | null) => void;
  getQuestionById: (id: number) => Question | undefined;
  getQuestionsByTopic: (topic: Topic) => Question[];
}

export const useQuestionsStore = create<QuestionsState>((set, get) => ({
  questions: [],
  selectedTopic: null,
  setQuestions: (questions) => set({ questions }),
  setSelectedTopic: (topic) => set({ selectedTopic: topic }),
  getQuestionById: (id) => get().questions.find((q) => q.id === id),
  getQuestionsByTopic: (topic) =>
    get().questions.filter((q) => q.topic === topic),
}));
