import { Pressable, View } from "react-native";
import { Icon } from "@/components/Icon";
import { Text } from "@/components/Text";
import { GlassSurface } from "@/components/GlassSurface";

/**
 * StreakChip — small glass pill with a coral flame + day count.
 *
 * Always renders, including at days === 0. Spec §5 originally said to hide
 * the chip on day 0 ("not '0 días' — just absent"), but on real devices
 * the empty top-right read as a layout bug; showing "0 días" gives new
 * users an anchor for the streak concept.
 */

export function StreakChip({
  days,
  onPress,
}: {
  days: number;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${days} días de pausa, ver detalle`}
      hitSlop={6}
    >
      <GlassSurface
        radius={9999}
        intensity={30}
        contentStyle={{
          paddingVertical: 7,
          paddingHorizontal: 11,
          paddingLeft: 9,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Icon name="flame" size={14} color="accent-strong" />
        <View style={{ width: 6 }} />
        <Text variant="bodySm" weight="bold" color="text">
          {days}
        </Text>
        <View style={{ width: 4 }} />
        <Text variant="caption" color="muted">
          días
        </Text>
      </GlassSurface>
    </Pressable>
  );
}
