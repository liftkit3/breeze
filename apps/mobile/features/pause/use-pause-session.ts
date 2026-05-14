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
      if (fnErr) throw new Error(fnErr.message);
      if (!activity) throw new Error("Sin respuesta del modelo");

      const { data: pause, error: insertErr } = await supabase
        .from("pauses")
        .insert({
          user_id: session.user.id,
          duration_minutes: input.duration,
          trigger_type: "manual",
          activity_emoji: activity.emoji,
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
        emoji: activity.emoji,
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
