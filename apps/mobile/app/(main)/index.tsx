import { useState } from "react";
import { Alert, Pressable, Text as RNText, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as Notifications from "expo-notifications";
import { ScreenFrame } from "@/components/ScreenFrame";
import { Stack } from "@/components/Stack";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";

/**
 * Main / Home — placeholder for logged-in state.
 *
 * Onboarding adds one additive concern: when arriving with `notifBanner=1`
 * (permission was denied or skipped), render a honey-tinted nudge with an
 * "Activar" inline action that re-prompts the OS dialog. The banner hides
 * itself once permission is granted, or stays put until next launch.
 *
 * The actual Home (streak / today / pausa CTA) ships in M1 S9.
 */
export default function HomeScreen() {
  const params = useLocalSearchParams<{ notifBanner?: string }>();
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const showBanner = params.notifBanner === "1" && !bannerDismissed;

  const handleActivate = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === "granted") setBannerDismissed(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No pudimos solicitar permisos.";
      Alert.alert("Error", msg);
    }
  };

  return (
    <ScreenFrame>
      <View className="flex-1 pt-md">
        {showBanner ? <NotifBanner onActivate={handleActivate} /> : null}

        <View className="flex-1 items-center justify-center">
          <Stack gap="md" align="center">
            <Text variant="display">🌬️</Text>
            <Text variant="h1" color="primary">
              Breeze
            </Text>
            <Text variant="bodySm" color="muted">
              Pausa. Recarga. Vuelve.
            </Text>

            <Stack gap="sm" className="mt-xl">
              <Text variant="caption" color="muted" align="center">
                Tokens + primitives wired ✓
              </Text>
              <Button variant="primary" onPress={() => {}}>
                Token check
              </Button>
            </Stack>
          </Stack>
        </View>
      </View>
    </ScreenFrame>
  );
}

function NotifBanner({ onActivate }: { onActivate: () => void }) {
  return (
    <View
      className="flex-row items-center bg-honey-100 mt-md"
      style={{
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 14,
        columnGap: 10,
      }}
    >
      <RNText style={{ fontSize: 18 }}>🔔</RNText>
      <Text
        variant="bodySm"
        className="flex-1 text-honey-800 leading-snug"
      >
        Activa las notis para no perderte tu pausa.
      </Text>
      <Pressable
        onPress={onActivate}
        accessibilityRole="button"
        accessibilityLabel="Activar notificaciones"
        hitSlop={8}
      >
        <Text variant="bodySm" weight="bold" className="text-honey-800">
          Activar
        </Text>
      </Pressable>
    </View>
  );
}
