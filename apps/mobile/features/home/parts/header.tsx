import { View } from "react-native";
import { Text } from "@/components/Text";
import { StreakChip } from "./streak-chip";

/**
 * Header — date eyebrow + greeting on the left, optional StreakChip on the right.
 *
 * Greeting size (28/700 per spec) sits between h2 (24) and h1 (32) tokens.
 * Using h2 + weight=bold reads close enough at device sizes; if/when we add
 * a 28pt token to the type scale, this stays right.
 */

export function Header({
  todayLabel,
  firstName,
  streakDays,
  onStreakPress,
}: {
  todayLabel: string;
  firstName: string;
  streakDays: number;
  onStreakPress?: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text variant="label" color="muted">
          {todayLabel}
        </Text>
        <View style={{ height: 4 }} />
        <Text variant="h2" weight="bold" color="text">
          Hola, {firstName}
        </Text>
      </View>

      {streakDays > 0 ? (
        <StreakChip days={streakDays} onPress={onStreakPress} />
      ) : null}
    </View>
  );
}
