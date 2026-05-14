import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { MOOD_KEYS, type MoodKey } from "./hero-copy";

/**
 * useMood — daily mood selection, persisted with local-midnight expiry.
 *
 * Backed by a Zustand store so EVERY consumer subscribes to a single source
 * of truth. Without this, each `useMood()` call had its own React state and
 * a mood change on Home wouldn't propagate to PickerSheet (or anywhere else
 * the picker is mounted).
 *
 * Hydration runs once per process on first subscription. AsyncStorage writes
 * are best-effort; in-memory store wins for the current session.
 */

const STORAGE_KEY = "breeze.mood.today";

export type Mood = {
  key: MoodKey;
  setAt: string; // ISO
};

type MoodStore = {
  mood: Mood | null;
  hydrated: boolean;
  setMood: (key: MoodKey) => Promise<void>;
  hydrate: () => Promise<void>;
};

const VALID_KEYS: ReadonlySet<string> = new Set(MOOD_KEYS);

function isToday(iso: string): boolean {
  const setAt = new Date(iso);
  const now = new Date();
  return (
    setAt.getFullYear() === now.getFullYear() &&
    setAt.getMonth() === now.getMonth() &&
    setAt.getDate() === now.getDate()
  );
}

let hydratePromise: Promise<void> | null = null;

const useMoodStore = create<MoodStore>((set) => ({
  mood: null,
  hydrated: false,
  setMood: async (key) => {
    const next: Mood = { key, setAt: new Date().toISOString() };
    set({ mood: next });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage failure is non-fatal — in-memory store wins for this session.
    }
  },
  hydrate: () => {
    if (hydratePromise) return hydratePromise;
    hydratePromise = (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) {
          set({ hydrated: true });
          return;
        }
        const parsed = JSON.parse(raw) as Mood;
        if (
          parsed?.setAt &&
          isToday(parsed.setAt) &&
          VALID_KEYS.has(parsed.key)
        ) {
          set({ mood: parsed, hydrated: true });
        } else {
          await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
          set({ hydrated: true });
        }
      } catch {
        await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
        set({ hydrated: true });
      }
    })();
    return hydratePromise;
  },
}));

export function useMood() {
  const mood = useMoodStore((s) => s.mood);
  const hydrated = useMoodStore((s) => s.hydrated);
  const setMood = useMoodStore((s) => s.setMood);
  const hydrate = useMoodStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return { mood, setMood, hydrated };
}
