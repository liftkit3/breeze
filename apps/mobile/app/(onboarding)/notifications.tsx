import { useState } from "react";
import { Alert, Pressable, Text as RNText, View } from "react-native";
import { router, type Href } from "expo-router";
import * as Notifications from "expo-notifications";
import { ScreenFrame } from "@/components/ScreenFrame";
import { OnboardingHeader } from "@/components/OnboardingHeader";
import { Button } from "@/components/Button";
import { Stack } from "@/components/Stack";
import { Text } from "@/components/Text";
import { useOnboarding } from "@/features/onboarding/onboarding-context";

/**
 * Step 3 — request push permission, then commit the onboarding state.
 *
 * Both CTAs persist the OnboardingContext draft to the `profiles` row first
 * (`save()`), so the user can never reach Home with hobbies/trigger lost.
 *
 *   Activar notificaciones → OS prompt → granted: /main · denied: /main?notifBanner=1
 *   Ahora no              → same banner path as "denied"
 *
 * The system permission dialog is rendered by iOS/Android natively — there's
 * no in-app mocked dialog (the prototype's mock was a web prototype hint only).
 */
export default function NotificationsScreen() {
  const { save } = useOnboarding();
  const [submitting, setSubmitting] = useState(false);

  const goToHome = (withBanner: boolean) => {
    const href: Href = withBanner
      ? { pathname: "/(main)", params: { notifBanner: "1" } }
      : ("/(main)" as Href);
    router.replace(href);
  };

  const handleEnable = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await save();
      const { status } = await Notifications.requestPermissionsAsync();
      goToHome(status !== "granted");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No pudimos guardar tu onboarding.";
      Alert.alert("Error", msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await save();
      goToHome(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No pudimos guardar tu onboarding.";
      Alert.alert("Error", msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenFrame>
      <View className="flex-1 pt-md pb-xl">
        <OnboardingHeader step={3} title="Las pausas llegan como sorpresas." />

        {/* Centered body — bell + caption */}
        <View
          className="flex-1 justify-center items-center"
          style={{ rowGap: 20, paddingHorizontal: 8 }}
        >
          <RNText style={{ fontSize: 64 }}>🔔</RNText>
          <Text
            variant="body"
            align="center"
            className="text-stone-700 leading-normal max-w-[280]"
          >
            Para que funcione, necesitamos enviarte una notificación cuando sea
            el momento.
          </Text>
        </View>

        <Stack gap="sm">
          <Button
            variant="primary-pill"
            fullWidth
            loading={submitting}
            onPress={handleEnable}
          >
            Activar notificaciones
          </Button>

          {/* "Ahora no" — text-only secondary, no background */}
          <Pressable
            onPress={handleSkip}
            disabled={submitting}
            accessibilityRole="button"
            accessibilityLabel="Ahora no"
            className="self-center"
            style={{ padding: 12 }}
            hitSlop={8}
          >
            <Text variant="bodySm" weight="semibold" color="muted" align="center">
              Ahora no
            </Text>
          </Pressable>
        </Stack>
      </View>
    </ScreenFrame>
  );
}
