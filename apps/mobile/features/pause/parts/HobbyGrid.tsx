import { Pressable, StyleSheet, View } from "react-native";
import { glass, palette } from "@breeze/design-tokens";
import { Icon } from "@/components/Icon";
import { Text } from "@/components/Text";
import type { HomeHobby } from "@/features/home/use-home-data";

export function HobbyGrid({
  hobbies,
  selectedKey,
  onChange,
}: {
  hobbies: HomeHobby[];
  selectedKey: string;
  onChange: (key: string) => void;
}) {
  return (
    <View>
      <Text variant="label" color="muted">
        Desde qué hobby
      </Text>
      <View style={{ height: 8 }} />
      <View style={styles.row}>
        {hobbies.map((h) => {
          const selected = h.key === selectedKey;
          return (
            <Pressable
              key={h.key}
              onPress={() => onChange(h.key)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={h.name}
              style={[
                styles.cell,
                selected ? styles.cellSelected : styles.cellIdle,
              ]}
            >
              <Icon
                name={h.icon}
                size={20}
                color={selected ? "accent-strong" : "subtle"}
              />
              <View style={{ height: 8 }} />
              <Text variant="bodySm" weight="bold" color="text">
                {h.name}
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
    paddingTop: 14,
    paddingHorizontal: 10,
    paddingBottom: 12,
    borderRadius: 16,
    alignItems: "flex-start",
  },
  cellIdle: {
    backgroundColor: glass.tint.pill,
    borderWidth: 1,
    borderColor: palette.stone[200],
  },
  cellSelected: {
    backgroundColor: palette.white,
    borderWidth: 2,
    borderColor: palette.coral[500],
    shadowColor: palette.coral[500],
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 6,
  },
});
