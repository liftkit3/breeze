import { ScreenFrame } from "@/components/ScreenFrame";
import { Stack } from "@/components/Stack";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";

/**
 * Main / Home — placeholder for logged-in state.
 * Will be replaced with real Home screen in a later stage.
 */
export default function HomeScreen() {
  return (
    <ScreenFrame>
      <Stack flex justify="center" align="center" gap="md">
        <Text variant="display">🌬️</Text>
        <Text variant="h1" color="primary">Breeze</Text>
        <Text variant="bodySm" color="muted">Pausa. Recarga. Vuelve.</Text>

        <Stack gap="sm" className="mt-xl">
          <Text variant="caption" color="muted" align="center">
            Tokens + primitives wired ✓
          </Text>
          <Button variant="primary" onPress={() => {}}>
            Token check
          </Button>
        </Stack>
      </Stack>
    </ScreenFrame>
  );
}
