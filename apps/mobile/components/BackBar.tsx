import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { Icon } from "./Icon";

/**
 * BackBar — top-left chevron for auth/onboarding screens.
 *
 * 40×40 hit target, white inverse icon at 80% opacity, sits above page content
 * inside ScreenFrame's safe-area. Calls router.back() by default; override via
 * `onPress` if a screen needs custom back behavior (e.g. clearing OTP state).
 */
export type BackBarProps = {
  onPress?: () => void;
  accessibilityLabel?: string;
};

export function BackBar({ onPress, accessibilityLabel = "Atrás" }: BackBarProps) {
  return (
    <View className="flex-row">
      <Pressable
        onPress={onPress ?? (() => router.back())}
        className="w-10 h-10 items-center justify-center opacity-80"
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        hitSlop={8}
      >
        <Icon name="chevron-left" size="lg" color="inverse" />
      </Pressable>
    </View>
  );
}
