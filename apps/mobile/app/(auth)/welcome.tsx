import { router } from "expo-router";
import { View } from "react-native";
import { ScreenFrame } from "@/components/ScreenFrame";
import { Stack } from "@/components/Stack";
import { Spacer } from "@/components/Spacer";
import { Logo } from "@/components/Logo";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { TaglineRotator } from "@/components/TaglineRotator";

/**
 * Welcome (Login) — cosmic-pill design.
 *
 * Pure composition of primitives. Zero hardcoded colors, zero inline styles
 * (except for the disclaimer opacity tint, an accepted exception).
 *
 * Layout:
 *   - Wordmark centered, height ~64
 *   - Rotating tagline (3 strings, 4.2s interval)
 *   - Spacer flex pushes buttons to bottom
 *   - 3 OAuth pill buttons (Google / Apple / email) glass tone
 *   - Footer disclaimer (Términos & Política de privacidad)
 */
export default function WelcomeScreen() {
  // Email is wired (S3 Email OTP flow). Apple/Google still pending.
  const handleApple = () => router.replace("/(main)" as never);
  const handleGoogle = () => router.replace("/(main)" as never);
  const handleEmail = () => router.push("/(auth)/email");

  return (
    <ScreenFrame variant="dark-hero">
      <Stack flex justify="center" align="center" gap="md">
        <Logo size={40} withWordmark light />

        <View className="opacity-80">
          <TaglineRotator
            items={[
              "Pausa. Recarga. Vuelve.",
              "Pausas que recargan, no que distraen.",
              "5 minutos para ti. El resto, después.",
            ]}
            intervalMs={4200}
            textVariant="tagline"
            textColor="inverse"
          />
        </View>
      </Stack>

      <Spacer flex />

      <Stack gap="sm">
        <Button
          variant="oauth-glass"
          fullWidth
          iconLeft={<Icon name="google" />}
          onPress={handleGoogle}
        >
          Continúa con Google
        </Button>

        <Button
          variant="oauth-glass"
          fullWidth
          iconLeft={<Icon name="apple" color="inverse" />}
          onPress={handleApple}
        >
          Continúa con Apple
        </Button>

        <Button
          variant="oauth-glass"
          fullWidth
          iconLeft={<Icon name="mail" color="inverse" />}
          onPress={handleEmail}
        >
          Continúa con email
        </Button>

        <View className="mt-md opacity-60">
          <Text variant="caption" color="inverse" align="center">
            Al continuar aceptas los Términos{"\n"}y la Política de privacidad.
          </Text>
        </View>
      </Stack>
    </ScreenFrame>
  );
}
