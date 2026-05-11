import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { ScreenFrame } from "@/components/ScreenFrame";
import { OnboardingHeader } from "@/components/OnboardingHeader";
import { HobbyTile } from "@/components/HobbyTile";
import { BottomSheet } from "@/components/BottomSheet";
import { Button } from "@/components/Button";
import { Stack } from "@/components/Stack";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Text";
import {
  MAX_HOBBIES,
  MAX_CUSTOM_HOBBIES,
  useOnboarding,
} from "@/features/onboarding/onboarding-context";

/**
 * Step 1 — pick up to 3 hobbies.
 *
 * Grid: 2 columns, each tile is 48% wide with aspectRatio 1.4.
 * Render order: 6 predefined → user's custom → "+ Otro" add tile.
 *
 * The 3-cap is enforced by OnboardingContext (toggling a 4th is a no-op);
 * unselected tiles show a dimmed visual once the cap is reached so the
 * user understands why a tap did nothing.
 */

type PredefinedHobby = {
  key: string;
  emoji: string;
  label: string;
};

const PREDEFINED_HOBBIES: readonly PredefinedHobby[] = [
  { key: "music",      emoji: "🎸", label: "Música" },
  { key: "reading",    emoji: "📚", label: "Lectura" },
  { key: "sports",     emoji: "🏃", label: "Deporte" },
  { key: "gaming",     emoji: "🎮", label: "Videojuegos" },
  { key: "art",        emoji: "🎨", label: "Arte" },
  { key: "meditation", emoji: "🧘", label: "Meditación" },
] as const;

export default function HobbiesScreen() {
  const {
    hobbies,
    customHobbies,
    toggleHobby,
    addCustomHobby,
    removeCustomHobby,
  } = useOnboarding();
  const [sheetOpen, setSheetOpen] = useState(false);

  const selectedCount = hobbies.length;
  const atCap = selectedCount >= MAX_HOBBIES;
  const canAddCustom = customHobbies.length < MAX_CUSTOM_HOBBIES && !atCap;

  const customLabel =
    customHobbies.length > 0
      ? `Otro (${customHobbies.length}/${MAX_CUSTOM_HOBBIES})`
      : "+ Otro";

  const continueLabel =
    selectedCount > 0 ? `Continuar (${selectedCount})` : "Continuar";

  const handleContinue = () => {
    if (selectedCount < 1) return;
    router.push("/(onboarding)/trigger");
  };

  return (
    <ScreenFrame>
      <View className="flex-1 pt-md pb-xl">
        <OnboardingHeader
          step={1}
          title="¿Qué te gusta hacer cuando no trabajas?"
        />

        <Text variant="bodySm" color="muted" className="mt-2">
          Elige hasta {MAX_HOBBIES} · {selectedCount}/{MAX_HOBBIES}
        </Text>

        {/* Grid — flex-wrap row with 12px gap; tiles are 48% wide */}
        <View
          className="flex-row flex-wrap mt-lg"
          style={{ gap: 12 }}
        >
          {PREDEFINED_HOBBIES.map((h) => {
            const selected = hobbies.includes(h.key);
            return (
              <HobbyTile
                key={h.key}
                kind="predefined"
                emoji={h.emoji}
                label={h.label}
                selected={selected}
                dimmed={atCap}
                onPress={() => toggleHobby(h.key)}
              />
            );
          })}

          {customHobbies.map((h) => (
            <HobbyTile
              key={h.key}
              kind="custom"
              emoji={h.emoji}
              label={h.label}
              onRemove={() => removeCustomHobby(h.key)}
            />
          ))}

          <HobbyTile
            kind="add"
            label={customLabel}
            disabled={!canAddCustom}
            onPress={() => setSheetOpen(true)}
          />
        </View>

        <Spacer flex />

        <Stack gap="md">
          <Button
            variant={selectedCount > 0 ? "primary-pill" : "neutral-pill"}
            fullWidth
            onPress={handleContinue}
          >
            {continueLabel}
          </Button>
        </Stack>
      </View>

      <BottomSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onAdd={addCustomHobby}
      />
    </ScreenFrame>
  );
}
