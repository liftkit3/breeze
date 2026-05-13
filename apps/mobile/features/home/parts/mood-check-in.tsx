import { useEffect, useRef } from "react";
import {
  AccessibilityInfo,
  Animated,
  Pressable,
  StyleSheet,
  Text as RNText,
  View,
} from "react-native";
import { glass, palette } from "@breeze/design-tokens";
import { Text } from "@/components/Text";
import { GlassSurface } from "@/components/GlassSurface";
import type { MoodKey } from "../hero-copy";

/**
 * MoodCheckIn — 4-button row inside a glass card.
 *
 * Idle: low-alpha white tint, dim emoji, stone label.
 * Selected: coral bg, scale 1.04, bright emoji, white label.
 * Honors prefers-reduced-motion (skips the scale anim).
 */

type MoodSpec = { key: MoodKey; emoji: string; label: string };

// 4-button valence scale, worst → best. Short single-word labels keep the
// row aligned across small screens (previous 5-button version wrapped
// "cansada" to two lines and broke the grid).
const MOODS: readonly MoodSpec[] = [
  { key: "bad", emoji: "😔", label: "mal" },
  { key: "ok", emoji: "🙂", label: "ok" },
  { key: "good", emoji: "😌", label: "bien" },
  { key: "great", emoji: "🤩", label: "genial" },
];

export function MoodCheckIn({
  selected,
  onSelect,
}: {
  selected: MoodKey | null;
  onSelect: (k: MoodKey) => void;
}) {
  return (
    <GlassSurface
      radius={22}
      contentStyle={{ paddingVertical: 14, paddingHorizontal: 16 }}
    >
      <View style={styles.headerRow}>
        <Text variant="bodySm" weight="semibold" color="text">
          ¿Cómo llegas?
        </Text>
        <Text variant="caption" color="muted">
          solo para ti
        </Text>
      </View>
      <View style={styles.buttonRow}>
        {MOODS.map((m) => (
          <MoodButton
            key={m.key}
            spec={m}
            selected={selected === m.key}
            onPress={() => onSelect(m.key)}
          />
        ))}
      </View>
    </GlassSurface>
  );
}

function MoodButton({
  spec,
  selected,
  onPress,
}: {
  spec: MoodSpec;
  selected: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(selected ? 1.04 : 1)).current;
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      reduceMotionRef.current = v;
    });
  }, []);

  useEffect(() => {
    if (reduceMotionRef.current) {
      scale.setValue(selected ? 1.04 : 1);
      return;
    }
    Animated.timing(scale, {
      toValue: selected ? 1.04 : 1,
      duration: 120,
      useNativeDriver: true,
    }).start();
  }, [selected, scale]);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`Me siento ${spec.label}`}
      style={{ flex: 1 }}
    >
      <Animated.View
        style={[
          styles.button,
          selected ? styles.buttonSelected : styles.buttonIdle,
          { transform: [{ scale }] },
        ]}
      >
        <RNText
          style={[
            styles.emoji,
            selected ? styles.emojiOn : styles.emojiOff,
          ]}
        >
          {spec.emoji}
        </RNText>
        <Text
          variant="caption"
          weight="semibold"
          color={selected ? "inverse" : "muted"}
          numberOfLines={1}
        >
          {spec.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 10,
  },
  button: {
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 4,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  buttonIdle: {
    backgroundColor: glass.tint.idle,
    borderWidth: 1,
    borderColor: palette.stone[200],
  },
  buttonSelected: {
    backgroundColor: palette.coral[500],
    shadowColor: palette.coral[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 18,
    elevation: 6,
  },
  emoji: {
    fontSize: 22,
    lineHeight: 26,
  },
  emojiOff: {
    opacity: 0.55,
  },
  emojiOn: {
    opacity: 1,
  },
});
