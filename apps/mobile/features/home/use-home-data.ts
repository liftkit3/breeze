import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth/auth-context";
import { supabase } from "../../lib/supabase";
import type { IconName } from "../../components/Icon";

/**
 * useHomeData — fetches everything the Home screen renders in one go.
 *
 * Source: `profiles` row (hobbies, streak_count, last_pause_at, default_context)
 * plus Supabase session metadata (firstName from user_metadata.full_name).
 *
 * Not yet sourced (returned as null until their owning stories ship):
 *   - nextPauseAt: needs S7 (calendar gaps) or S8 (scheduler heuristic)
 *   - per-hobby pause count: needs S10 content library OR a `hobby` column
 *     on pauses (currently the spec's "{n} pausas" line is replaced with
 *     "Explora" in HobbiesGrid until real data exists)
 */

export type HomeHobby = {
  key: string;
  name: string;
  icon: IconName;
};

export type HomeData = {
  firstName: string;
  todayLabel: string;
  streakDays: number;
  hobbies: HomeHobby[];
  nextPauseAt: string | null;
  lastPauseAt: string | null;
};

const HOBBY_META: Record<string, { name: string; icon: IconName }> = {
  music: { name: "Música", icon: "guitar" },
  reading: { name: "Lectura", icon: "book" },
  sports: { name: "Deporte", icon: "running" },
  gaming: { name: "Videojuegos", icon: "writing" }, // fallback icon
  art: { name: "Arte", icon: "art" },
  meditation: { name: "Meditación", icon: "meditation" },
};

function deriveFirstName(input: {
  fullName?: string | null;
  name?: string | null;
  email?: string | null;
}): string {
  const candidate = input.fullName ?? input.name ?? "";
  if (candidate) {
    const first = candidate.split(/\s+/)[0];
    if (first) return first;
  }
  const emailLocal = (input.email ?? "").split("@")[0] ?? "";
  if (!emailLocal) return "amiga";
  return emailLocal.charAt(0).toUpperCase() + emailLocal.slice(1);
}

function formatTodayLabel(date: Date): string {
  const fmt = new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
  const parts = fmt.formatToParts(date);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const day = parts.find((p) => p.type === "day")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const cap = (s: string) =>
    s.length === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1);
  // Some locales include "de" / trailing dots — keep just the core tokens.
  return `${cap(weekday)} · ${day} ${month.replace(/\.$/, "")}`;
}

function mapHobby(stored: string): HomeHobby {
  const meta = HOBBY_META[stored];
  if (meta) return { key: stored, name: meta.name, icon: meta.icon };
  // Custom hobby — the stored value IS the user-typed label.
  return { key: stored, name: stored, icon: "writing" };
}

export function useHomeData() {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery<HomeData>({
    queryKey: ["home", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) throw new Error("No active session");

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("hobbies, streak_count, last_pause_at, default_context")
        .eq("id", userId)
        .single();

      if (error) throw error;

      const metadata = session?.user.user_metadata ?? {};
      const firstName = deriveFirstName({
        fullName: typeof metadata.full_name === "string" ? metadata.full_name : null,
        name: typeof metadata.name === "string" ? metadata.name : null,
        email: session?.user.email,
      });

      const hobbies = (profile.hobbies ?? []).slice(0, 3).map(mapHobby);

      return {
        firstName,
        todayLabel: formatTodayLabel(new Date()),
        streakDays: profile.streak_count ?? 0,
        hobbies,
        nextPauseAt: null, // S7/S8 territory
        lastPauseAt: profile.last_pause_at ?? null,
      };
    },
  });
}
