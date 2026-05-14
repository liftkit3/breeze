import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/features/auth/auth-context";
import { useActivePauseStore } from "./use-active-pause-store";
import { usePickerStore } from "./use-picker-store";

export type PauseInputs = {
  mood: "bad" | "ok" | "good" | "great" | null;
  duration: 5 | 10 | 15;
  hobby: string;
  hobbyLabel: string;
};

type Activity = {
  emoji: string;
  title: string;
  sub: string;
  motivation: string;
};

const RECENT_FEEDBACK_LIMIT = 5;

// Gemini 2.5 Flash's structured output occasionally returns "" for short
// required string fields (the empty value still satisfies the schema). When
// that happens, fall back to the picked hobby's canonical emoji so the active
// pause screen never renders a blank slot.
const HOBBY_EMOJI_FALLBACK: Record<string, string> = {
  music: "🎸",
  reading: "📚",
  sports: "🏃",
  gaming: "🎮",
  art: "🎨",
  meditation: "🧘",
};

function resolveEmoji(modelEmoji: string, hobbyKey: string): string {
  const trimmed = (modelEmoji ?? "").trim();
  if (trimmed.length > 0) return trimmed;
  return HOBBY_EMOJI_FALLBACK[hobbyKey] ?? "✨";
}

// generate-activity returns { error, upstream? } on non-2xx. Map the upstream
// HTTP code (or our own error string) to a Spanish copy the picker can show.
async function readFnError(fnErr: unknown): Promise<string> {
  const ctx = (fnErr as { context?: unknown }).context;
  if (!ctx || typeof (ctx as Response).text !== "function") {
    return "No pudimos preparar tu pausa. Intenta de nuevo.";
  }
  const r = ctx as Response;
  let body: { error?: string; upstream?: number } = {};
  try {
    body = JSON.parse(r.bodyUsed ? "{}" : await r.text());
  } catch {
    // non-JSON body — fall through to generic
  }
  if (body.upstream === 429 || r.status === 429) {
    return "Demasiadas pausas en poco tiempo. Espera un minuto e intenta de nuevo.";
  }
  if (body.upstream === 503 || r.status === 503) {
    return "El servicio está saturado. Intenta de nuevo en un momento.";
  }
  return "No pudimos preparar tu pausa. Intenta de nuevo.";
}

export function usePauseSession() {
  const { session } = useAuth();
  const setActivity = useActivePauseStore((s) => s.setActivity);
  const closePicker = usePickerStore((s) => s.close);

  const mutation = useMutation({
    mutationFn: async (input: PauseInputs): Promise<{ pauseId: string }> => {
      if (!session?.user?.id) {
        throw new Error("Sin sesión activa");
      }

      const { data: recent, error: recentErr } = await supabase
        .from("pauses")
        .select("feeling_rating, duration_minutes")
        .eq("user_id", session.user.id)
        .eq("status", "completed")
        .not("feeling_rating", "is", null)
        .order("completed_at", { ascending: false })
        .limit(RECENT_FEEDBACK_LIMIT);
      if (recentErr) throw new Error(recentErr.message);

      const recentFeedback = (recent ?? []).map((p) => ({
        rating: p.feeling_rating as number,
        duration: p.duration_minutes,
      }));

      const { data: activity, error: fnErr } =
        await supabase.functions.invoke<Activity>("generate-activity", {
          body: {
            mood: input.mood,
            duration: input.duration,
            hobby: input.hobby,
            hobbyLabel: input.hobbyLabel,
            recentFeedback,
          },
        });
      if (fnErr) {
        throw new Error(await readFnError(fnErr));
      }
      if (!activity) throw new Error("Sin respuesta del modelo");

      const emoji = resolveEmoji(activity.emoji, input.hobby);

      const { data: pause, error: insertErr } = await supabase
        .from("pauses")
        .insert({
          user_id: session.user.id,
          duration_minutes: input.duration,
          trigger_type: "manual",
          activity_emoji: emoji,
          activity_title: activity.title,
          activity_motivation: activity.motivation,
          status: "pending",
        })
        .select("id")
        .single();
      if (insertErr || !pause) {
        throw new Error(insertErr?.message ?? "No pudimos guardar tu pausa");
      }

      setActivity({
        emoji,
        title: activity.title,
        sub: activity.sub,
        motivation: activity.motivation,
        durationMinutes: input.duration,
      });

      return { pauseId: pause.id };
    },
    onSuccess: ({ pauseId }) => {
      closePicker();
      router.push(`/pause/active/${pauseId}`);
    },
  });

  return {
    start: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error ? (mutation.error as Error).message : null,
    reset: mutation.reset,
  };
}
