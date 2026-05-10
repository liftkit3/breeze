import { View } from "react-native";
import { router } from "expo-router";
import { ScreenFrame } from "@/components/ScreenFrame";
import { Stack } from "@/components/Stack";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";

const HERO_SIZE = 72;

export default function VerifiedScreen() {
  // TODO(M1 S5): /(onboarding)/hobbies route does not exist yet — pressing
  // "Empezar" before S5 ships will throw. Spec calls this destination.
  const handleStart = () => router.replace("/(onboarding)/hobbies" as never);

  return (
    <ScreenFrame variant="dark-hero">
      <Spacer flex />

      <Stack gap="lg" align="center">
        <View
          className="bg-primary rounded-full items-center justify-center shadow-primary"
          style={{ width: HERO_SIZE, height: HERO_SIZE, elevation: 8 }}
        >
          <Icon name="check" size="xl" color="inverse" />
        </View>

        <Text variant="h1" color="inverse" align="center">
          Listo. Bienvenido.
        </Text>

        <View className="max-w-[280]">
          <Text variant="body" color="inverse" align="center" className="opacity-60">
            Vamos a configurar tu primera pausa.
          </Text>
        </View>
      </Stack>

      <Spacer flex />

      <Button variant="primary-pill" fullWidth onPress={handleStart}>
        Empezar
      </Button>
    </ScreenFrame>
  );
}
