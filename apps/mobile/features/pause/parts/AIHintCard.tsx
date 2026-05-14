import { StyleSheet, View } from "react-native";
import { glass, palette } from "@breeze/design-tokens";
import { Icon } from "@/components/Icon";
import { Text } from "@/components/Text";
import type { MoodKey } from "@/features/home/hero-copy";
import type { Duration } from "./DurationGrid";

const MOOD_LABEL: Record<MoodKey, { emoji: string; label: string }> = {
  bad: { emoji: "😔", label: "mal" },
  ok: { emoji: "🙂", label: "ok" },
  good: { emoji: "😌", label: "bien" },
  great: { emoji: "🤩", label: "genial" },
};

export function AIHintCard({
  mood,
  duration,
  hobbyLabel,
}: {
  mood: MoodKey | null;
  duration: Duration;
  hobbyLabel: string;
}) {
  const body = composeBody(mood, duration, hobbyLabel);
  return (
    <View style={styles.card}>
      <View style={{ marginTop: 2 }}>
        <Icon name="sparkle" size={16} color="subtle" />
      </View>
      <View style={{ flex: 1, rowGap: 3 }}>
        <Text variant="caption" weight="bold" color="text">
          Te elegimos el contenido
        </Text>
        <Text variant="caption" color="muted">
          {body}
        </Text>
      </View>
    </View>
  );
}

function composeBody(
  mood: MoodKey | null,
  duration: Duration,
  hobbyLabel: string,
): string {
  if (mood === null) {
    return `${duration} min y ${hobbyLabel.toLowerCase()}. Te elegimos algo suave.`;
  }
  const m = MOOD_LABEL[mood];
  return `Según tu mood (${m.emoji} ${m.label}), ${duration} min y ${hobbyLabel.toLowerCase()}.`;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    columnGap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: glass.tint.base,
    borderWidth: 1,
    borderColor: palette.stone[200],
  },
});
