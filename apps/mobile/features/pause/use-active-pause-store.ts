import { create } from "zustand";

/**
 * In-memory bridge between the Picker generation and the mocked active-pause
 * screen. The pauses table stores emoji+title+motivation but not `sub`, so we
 * keep the full 4-field activity in memory until S11 replaces this mock with
 * a real fetch-by-id flow (and likely a schema extension).
 */
export type ActivityPreview = {
  emoji: string;
  title: string;
  sub: string;
  motivation: string;
  durationMinutes: 5 | 10 | 15;
};

type Store = {
  activity: ActivityPreview | null;
  setActivity: (a: ActivityPreview) => void;
  clear: () => void;
};

export const useActivePauseStore = create<Store>((set) => ({
  activity: null,
  setActivity: (activity) => set({ activity }),
  clear: () => set({ activity: null }),
}));
