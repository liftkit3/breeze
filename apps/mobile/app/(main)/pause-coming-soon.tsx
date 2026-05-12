import { View } from "react-native";
import { router } from "expo-router";
import { ScreenFrame } from "@/components/ScreenFrame";
import { Stack } from "@/components/Stack";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { BackBar } from "@/components/BackBar";

/**
 * Stub for the pause flow. Both the Home hero CTA and the BottomNav FAB
 * route here until M1 S10 ships `generate-activity` + the pause active
 * screen. When that lands, replace this file with `pause/active/[id].tsx`
 * (and adjust the navigation in HomeScreen + BottomNav).
 */

export default function PauseComingSoon() {
  return (
    <ScreenFrame>
      <BackBar onPress={() => router.back()} />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Stack gap="md" align="center">
          <Text variant="display">✨</Text>
          <Text variant="h2" weight="bold" align="center">
            Estamos cocinando la pausa
          </Text>
          <Text variant="bodySm" color="muted" align="center">
            La actividad personalizada llega en M1 S10. Por ahora, gracias por
            esperar la magia.
          </Text>
          <View style={{ height: 24 }} />
          <Button variant="primary-pill" onPress={() => router.back()}>
            Volver al inicio
          </Button>
        </Stack>
      </View>
    </ScreenFrame>
  );
}
