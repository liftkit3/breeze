import { View } from "react-native";
import { router } from "expo-router";
import { ScreenFrame } from "@/components/ScreenFrame";
import { OnboardingHeader } from "@/components/OnboardingHeader";
import { TriggerCard } from "@/components/TriggerCard";
import { GoogleConnectRow } from "@/components/GoogleConnectRow";
import { Button } from "@/components/Button";
import { Stack } from "@/components/Stack";
import { Spacer } from "@/components/Spacer";
import { useOnboarding } from "@/features/onboarding/onboarding-context";

/**
 * Step 2 — pick how Breeze should trigger pauses.
 *
 * Two options modelled as TriggerCards:
 *   Pomodoro            fires every 90 min of active app time (no infra needed)
 *   Entre reuniones     reads Google Calendar and fires in calendar gaps
 *
 * Choosing "calendar" reveals a GoogleConnectRow under the card; CTA stays
 * disabled until the user completes the Calendar OAuth (stubbed here — S7
 * wires the real `expo-auth-session` + calendar.readonly scope handshake).
 */

const CALENDAR_OAUTH_STUB_MS = 1200;

export default function TriggerScreen() {
  const {
    trigger,
    calendarConnected,
    setTrigger,
    setCalendarConnected,
  } = useOnboarding();

  const canContinue =
    trigger === "pomodoro" || (trigger === "calendar" && calendarConnected);

  const handleConnectCalendar = async () => {
    // TODO(M1 S7): replace this stub with the real Google OAuth call.
    // Requires Calendar API enabled in Google Cloud Console + calendar.readonly
    // scope added to the existing OAuth client + token encryption via pgcrypto
    // into profiles.calendar_token. None of that exists yet — for S5 we just
    // pretend the handshake succeeded so the UI state machine is testable.
    await new Promise((r) => setTimeout(r, CALENDAR_OAUTH_STUB_MS));
    setCalendarConnected(true);
  };

  const handleContinue = () => {
    if (!canContinue) return;
    router.push("/(onboarding)/notifications");
  };

  return (
    <ScreenFrame>
      <View className="flex-1 pt-md pb-xl">
        <OnboardingHeader step={2} title="¿Cómo quieres que te avisemos?" />

        <View className="mt-lg" style={{ rowGap: 12 }}>
          <TriggerCard
            emoji="⏱"
            title="Pomodoro"
            subtitle="Cada 90 min mientras trabajas"
            selected={trigger === "pomodoro"}
            onPress={() => setTrigger("pomodoro")}
          />
          <TriggerCard
            emoji="📅"
            title="Entre reuniones"
            subtitle="Lee tu Google Calendar y te avisa en huecos"
            selected={trigger === "calendar"}
            onPress={() => setTrigger("calendar")}
          />

          {trigger === "calendar" ? (
            <View className="mt-1">
              <GoogleConnectRow
                connected={calendarConnected}
                onConnect={handleConnectCalendar}
              />
            </View>
          ) : null}
        </View>

        <Spacer flex />

        <Stack gap="md">
          <Button
            variant={canContinue ? "primary-pill" : "neutral-pill"}
            fullWidth
            onPress={handleContinue}
          >
            Continuar
          </Button>
        </Stack>
      </View>
    </ScreenFrame>
  );
}
