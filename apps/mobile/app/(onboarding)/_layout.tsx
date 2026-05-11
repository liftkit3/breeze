import { Stack } from "expo-router";
import { OnboardingProvider } from "@/features/onboarding/onboarding-context";

/**
 * Onboarding stack — mounts the OnboardingProvider so hobbies/trigger/
 * notifications screens share state. The provider resets on remount, so
 * navigating away (replace into /main or /welcome) clears the draft.
 */
export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </OnboardingProvider>
  );
}
