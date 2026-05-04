export type { Database } from "./database";

export type HobbySlug =
  | "reading"
  | "music"
  | "drawing"
  | "walking"
  | "stretching"
  | "meditation"
  | "cooking"
  | "gaming"
  | "photography"
  | "writing"
  | "puzzles"
  | "plants";

export type PauseDuration = 5 | 10 | 15;

export type PauseStatus = "active" | "completed" | "skipped";

export type PauseTriggerType = "calendar_gap" | "pomodoro" | "manual";

export type PauseMechanism =
  | "mystery"
  | "challenge"
  | "micro_skill"
  | "reflection"
  | "energy";

export type SubscriptionStatus = "trial" | "active" | "canceled" | "expired";

export type RouteResult = "onboarding" | "waitlist" | "cap_full";

export interface Activity {
  emoji: string;
  title: string;
  motivation: string;
  duration: PauseDuration;
  mechanism: PauseMechanism;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  hobbies: HobbySlug[];
  default_context: string | null;
  push_token: string | null;
  streak_count: number;
  company_id: string | null;
  subscription_status: SubscriptionStatus;
  trial_ends_at: string | null;
  created_at: string;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  hr_admin_email: string;
  employee_count: number;
  plan_status: "active" | "inactive";
  created_at: string;
}

export interface Pause {
  id: string;
  user_id: string;
  duration: PauseDuration;
  status: PauseStatus;
  trigger_type: PauseTriggerType;
  mechanism: PauseMechanism | null;
  activity: Activity | null;
  feedback_emoji: string | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}
