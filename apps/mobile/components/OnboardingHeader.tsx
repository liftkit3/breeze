import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { Text } from "./Text";

/**
 * OnboardingHeader — step pill + back/exit action + progress bar + h1 title.
 *
 * Used by the 3 onboarding screens (hobbies / trigger / notifications).
 *
 * Back/exit behavior:
 *   step 1  → "Salir" → `router.replace("/(auth)/welcome")` (the auth stack is
 *             unmounted by the time we're here; back() would no-op)
 *   step >1 → "‹ Atrás" → `router.back()`
 *
 * Override either by passing `onBack`.
 */
export type OnboardingHeaderProps = {
  step: 1 | 2 | 3;
  title: string;
  onBack?: () => void;
};

const TOTAL_STEPS = 3;

export function OnboardingHeader({ step, title, onBack }: OnboardingHeaderProps) {
  const isFirstStep = step === 1;
  const actionLabel = isFirstStep ? "Salir" : "‹ Atrás";

  const handleBack = () => {
    if (onBack) return onBack();
    if (isFirstStep) router.replace("/(auth)/welcome");
    else router.back();
  };

  return (
    <View>
      {/* Row: step pill + back/exit action */}
      <View className="flex-row items-center justify-between">
        <Text variant="label" color="muted">
          Paso {step} de {TOTAL_STEPS}
        </Text>
        <Pressable
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          hitSlop={8}
        >
          <Text variant="bodySm" weight="semibold" color="muted">
            {actionLabel}
          </Text>
        </Pressable>
      </View>

      {/* Progress bar — 3 flex-1 segments, 6px gap */}
      <View
        className="flex-row mt-1"
        style={{ columnGap: 6 }}
      >
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
          const filled = i < step;
          return (
            <View
              key={i}
              className={`flex-1 rounded-full ${filled ? "bg-sage-500" : "bg-stone-200"}`}
              style={{ height: 3 }}
            />
          );
        })}
      </View>

      {/* Screen title */}
      <Text variant="h1" className="mt-lg">
        {title}
      </Text>
    </View>
  );
}
