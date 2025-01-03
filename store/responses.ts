import { create } from "zustand";
import { UserResponse } from "@/lib/types";

interface ResponsesState {
  responses: UserResponse[];
  setResponses: (responses: UserResponse[]) => void;
  addResponse: (response: UserResponse) => void;
  clearResponses: () => void;
}

export const useResponsesStore = create<ResponsesState>((set) => ({
  responses: [],
  setResponses: (responses) => set({ responses }),
  addResponse: (response) =>
    set((state) => ({ responses: [...state.responses, response] })),
  clearResponses: () => set({ responses: [] }),
}));
