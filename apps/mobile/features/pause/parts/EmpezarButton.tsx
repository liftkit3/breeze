import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { palette } from "@breeze/design-tokens";
import { Icon } from "@/components/Icon";
import { Text } from "@/components/Text";
import type { Duration } from "./DurationGrid";

export function EmpezarButton({
  duration,
  hobbyLabel,
  onPress,
  isPending,
}: {
  duration: Duration;
  hobbyLabel: string;
  onPress: () => void;
  isPending: boolean;
}) {
  return (
    <Pressable
      onPress={isPending ? undefined : onPress}
      accessibilityRole="button"
      accessibilityLabel={`Empezar pausa de ${duration} minutos de ${hobbyLabel.toLowerCase()}`}
      accessibilityState={{ disabled: isPending, busy: isPending }}
      style={({ pressed }) => [
        styles.btn,
        pressed && !isPending ? styles.btnPressed : null,
      ]}
    >
      <View style={styles.row}>
        {isPending ? (
          <ActivityIndicator color={palette.white} size="small" />
        ) : (
          <Icon name="play" size={16} color="inverse" />
        )}
        <Text variant="bodySm" weight="bold" color="inverse">
          {isPending ? "Preparando…" : "Empezar pausa"}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: palette.coral[500],
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 9999,
    shadowColor: palette.coral[500],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.42,
    shadowRadius: 22,
    elevation: 10,
  },
  btnPressed: {
    transform: [{ scale: 0.97 }],
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 10,
  },
});
