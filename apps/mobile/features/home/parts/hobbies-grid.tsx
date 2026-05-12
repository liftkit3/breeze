import { Pressable, StyleSheet, View } from "react-native";
import { Icon } from "@/components/Icon";
import { Text } from "@/components/Text";
import { GlassSurface } from "@/components/GlassSurface";
import type { HomeHobby } from "../use-home-data";

/**
 * HobbiesGrid — 3-cell glass grid of the user's onboarding hobbies.
 *
 * Spec says "{n} pausas" as the meta line — that count needs a content
 * library which doesn't exist yet (no `hobby` column on pauses, no S10
 * content). Meta is "Explora" until real data lands; swap when ready.
 *
 * If user picked fewer than 3 hobbies, we render only those (no padding
 * "+ Agregar" placeholder — that lives in Editar, per spec §3.5).
 */

export function HobbiesGrid({
  hobbies,
  onEdit,
  onHobbyPress,
}: {
  hobbies: HomeHobby[];
  onEdit?: () => void;
  onHobbyPress?: (key: string) => void;
}) {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text variant="bodySm" weight="semibold" color="text">
          Tus hobbies
        </Text>
        <Pressable
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel="Editar hobbies"
          hitSlop={8}
        >
          <Text variant="caption" weight="semibold" color="muted">
            Editar
          </Text>
        </Pressable>
      </View>

      <View style={styles.grid}>
        {hobbies.map((h) => (
          <Pressable
            key={h.key}
            style={styles.cellWrapper}
            onPress={() => onHobbyPress?.(h.key)}
            accessibilityRole="button"
            accessibilityLabel={`Pausas para ${h.name}`}
          >
            <GlassSurface
              radius={18}
              contentStyle={{ paddingVertical: 14, paddingHorizontal: 12 }}
            >
              <Icon name={h.icon} size={20} color="subtle" />
              <View style={{ height: 8 }} />
              <Text variant="bodySm" weight="semibold" color="text">
                {h.name}
              </Text>
              <View style={{ height: 2 }} />
              <Text variant="caption" color="muted">
                Explora
              </Text>
            </GlassSurface>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    gap: 8,
  },
  cellWrapper: {
    flex: 1,
  },
});
