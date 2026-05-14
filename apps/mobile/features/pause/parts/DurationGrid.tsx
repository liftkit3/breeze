import { Pressable, StyleSheet, View } from "react-native";
import { glass, palette } from "@breeze/design-tokens";
import { Text } from "@/components/Text";

export type Duration = 5 | 10 | 15;

type Cell = { value: Duration; label: string; sub: string };

const CELLS: readonly Cell[] = [
  { value: 5, label: "5 min", sub: "corta" },
  { value: 10, label: "10 min", sub: "media" },
  { value: 15, label: "15 min", sub: "larga" },
];

export function DurationGrid({
  value,
  onChange,
}: {
  value: Duration;
  onChange: (v: Duration) => void;
}) {
  return (
    <View>
      <Text variant="label" color="muted">
        Cuánto tiempo
      </Text>
      <View style={{ height: 8 }} />
      <View style={styles.row}>
        {CELLS.map((c) => {
          const selected = c.value === value;
          return (
            <Pressable
              key={c.value}
              onPress={() => onChange(c.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={`${c.label} ${c.sub}`}
              style={[
                styles.cell,
                selected ? styles.cellSelected : styles.cellIdle,
              ]}
            >
              <Text
                variant="bodySm"
                weight="bold"
                color={selected ? "inverse" : "text"}
              >
                {c.label}
              </Text>
              <View style={{ height: 2 }} />
              <Text
                variant="caption"
                color={selected ? "inverse" : "muted"}
              >
                {c.sub}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    columnGap: 8,
  },
  cell: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 14,
    alignItems: "flex-start",
  },
  cellIdle: {
    backgroundColor: glass.tint.pill,
    borderWidth: 1,
    borderColor: palette.stone[200],
  },
  cellSelected: {
    backgroundColor: palette.stone[900],
    shadowColor: palette.stone[900],
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 6,
  },
});
