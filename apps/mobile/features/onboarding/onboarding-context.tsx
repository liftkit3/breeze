import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../auth/auth-context";

/**
 * OnboardingContext — shared state across the 3 onboarding screens.
 *
 * Lifetime: mounted at `app/(onboarding)/_layout.tsx`, so it lives only while
 * the user is inside the onboarding stack. State resets implicitly when the
 * stack unmounts (replace into /main or back into /welcome).
 *
 * Selection rules (enforced here, mirrored visually by HobbyTile dimmed state):
 *   - hobbies capped at 3 total (predefined + custom)
 *   - customHobbies has its own independent ceiling of 3
 *   - removeCustomHobby() also removes it from the selection (no orphans)
 *
 * Persistence (`save`): writes hobbies + default_context to `profiles`.
 *   - hobbies → text[] of keys ("music", "reading", custom labels…)
 *   - default_context → "pomodoro" | "calendar"
 *   - calendarConnected is NOT persisted yet — the schema's `calendar_token`
 *     is pgcrypto-encrypted and only filled in M1 S7 with the real refresh
 *     token. Onboarding intent is captured via default_context = "calendar".
 */

export const MAX_HOBBIES = 3;
export const MAX_CUSTOM_HOBBIES = 3;

export type Trigger = "pomodoro" | "calendar";

export type CustomHobby = {
  key: string;
  label: string;
  emoji: "✨";
};

type OnboardingState = {
  hobbies: string[];
  customHobbies: CustomHobby[];
  trigger: Trigger | null;
  calendarConnected: boolean;
};

type OnboardingContextValue = OnboardingState & {
  toggleHobby: (key: string) => void;
  addCustomHobby: (label: string) => void;
  removeCustomHobby: (key: string) => void;
  setTrigger: (t: Trigger) => void;
  setCalendarConnected: (connected: boolean) => void;
  reset: () => void;
  save: () => Promise<void>;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

const INITIAL_STATE: OnboardingState = {
  hobbies: [],
  customHobbies: [],
  trigger: null,
  calendarConnected: false,
};

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [state, setState] = useState<OnboardingState>(INITIAL_STATE);

  const toggleHobby = useCallback((key: string) => {
    setState((prev) => {
      const isSelected = prev.hobbies.includes(key);
      if (isSelected) {
        return { ...prev, hobbies: prev.hobbies.filter((k) => k !== key) };
      }
      if (prev.hobbies.length >= MAX_HOBBIES) return prev; // cap reached — no-op
      return { ...prev, hobbies: [...prev.hobbies, key] };
    });
  }, []);

  const addCustomHobby = useCallback((label: string) => {
    setState((prev) => {
      if (prev.customHobbies.length >= MAX_CUSTOM_HOBBIES) return prev;
      if (prev.hobbies.length >= MAX_HOBBIES) return prev;
      const key = `custom:${Date.now()}`;
      const custom: CustomHobby = { key, label, emoji: "✨" };
      return {
        ...prev,
        customHobbies: [...prev.customHobbies, custom],
        hobbies: [...prev.hobbies, key],
      };
    });
  }, []);

  const removeCustomHobby = useCallback((key: string) => {
    setState((prev) => ({
      ...prev,
      customHobbies: prev.customHobbies.filter((h) => h.key !== key),
      hobbies: prev.hobbies.filter((k) => k !== key),
    }));
  }, []);

  const setTrigger = useCallback((t: Trigger) => {
    setState((prev) => ({
      ...prev,
      trigger: t,
      // Switching away from "calendar" clears the connected flag so the user
      // can't end up in an inconsistent (trigger=pomodoro + connected=true) state.
      calendarConnected: t === "calendar" ? prev.calendarConnected : false,
    }));
  }, []);

  const setCalendarConnected = useCallback((connected: boolean) => {
    setState((prev) => ({ ...prev, calendarConnected: connected }));
  }, []);

  const reset = useCallback(() => setState(INITIAL_STATE), []);

  const save = useCallback(async () => {
    const userId = session?.user.id;
    if (!userId) throw new Error("No hay sesión activa para guardar onboarding.");

    // Materialize the selection into the labels we want to persist. For
    // predefined hobbies the key IS the label; for custom hobbies we resolve
    // the user-typed label so the saved row reads naturally.
    const customByKey = new Map(state.customHobbies.map((c) => [c.key, c.label]));
    const hobbyLabels = state.hobbies.map((k) => customByKey.get(k) ?? k);

    const { error } = await supabase
      .from("profiles")
      .update({
        hobbies: hobbyLabels,
        default_context: state.trigger,
      })
      .eq("id", userId);

    if (error) throw error;
  }, [session, state]);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      ...state,
      toggleHobby,
      addCustomHobby,
      removeCustomHobby,
      setTrigger,
      setCalendarConnected,
      reset,
      save,
    }),
    [
      state,
      toggleHobby,
      addCustomHobby,
      removeCustomHobby,
      setTrigger,
      setCalendarConnected,
      reset,
      save,
    ],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used inside <OnboardingProvider>");
  return ctx;
}
