import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MOOD_KEYS, type MoodKey } from "./hero-copy";

const VALID_KEYS: ReadonlySet<string> = new Set(MOOD_KEYS);

/**
 * useMood — daily mood selection, persisted with local-midnight expiry.
 *
 * Spec (HOME_FLOW.md §3.3):
 *   "Store in localStorage `breeze.mood.today` with {key, setAt}.
 *    Expires at next local midnight. Show the most recent selection on reopen."
 *
 * Implementation: a single AsyncStorage row. On read, if `setAt` is before
 * the start of today (local), the value is treated as null and cleared.
 */

const STORAGE_KEY = "breeze.mood.today";

export type Mood = {
  key: MoodKey;
  setAt: string; // ISO
};

function isToday(iso: string): boolean {
  const setAt = new Date(iso);
  const now = new Date();
  return (
    setAt.getFullYear() === now.getFullYear() &&
    setAt.getMonth() === now.getMonth() &&
    setAt.getDate() === now.getDate()
  );
}

export function useMood() {
  const [mood, setMoodState] = useState<Mood | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!alive) return;
        if (!raw) {
          setHydrated(true);
          return;
        }
        const parsed = JSON.parse(raw) as Mood;
        // Validate setAt freshness AND that the stored key still exists in
        // the current MoodKey set — keys can shift between releases (the
        // 5→4 mood collapse, for example), so old values get cleared.
        if (
          parsed?.setAt &&
          isToday(parsed.setAt) &&
          VALID_KEYS.has(parsed.key)
        ) {
          setMoodState(parsed);
        } else {
          await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
        }
      } catch {
        // Corrupt value or parse failure — treat as no mood, clear quietly.
        await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
      } finally {
        if (alive) setHydrated(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const setMood = useCallback(async (key: MoodKey) => {
    const next: Mood = { key, setAt: new Date().toISOString() };
    setMoodState(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage failure is non-fatal — in-memory state is the source of truth
      // for this session. Mood resets on next cold start instead of midnight.
    }
  }, []);

  return { mood, setMood, hydrated };
}
