import { useEffect, useRef } from "react";
import {
  AccessibilityInfo,
  Animated,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { glass, palette } from "@breeze/design-tokens";
import { Icon } from "@/components/Icon";
import { Text } from "@/components/Text";
import { GlassSurface } from "@/components/GlassSurface";
import { getHeroCopy, type MoodKey } from "../hero-copy";

/**
 * PauseHero — primary glass card that drives the single coral CTA.
 *
 * Composes:
 *   - Top row: ClockPill (next pause time, optional) + TimePill (duration)
 *   - Title (24/700) — copy derived from mood × top hobby
 *   - Sub (13/400 stone.600)
 *   - PauseHeroBtn — full-width coral CTA
 */

function formatTime(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

export function PauseHero({
  mood,
  topHobby,
  nextPauseAt,
  onStart,
}: {
  mood: MoodKey | null;
  topHobby: string | null;
  nextPauseAt: string | null;
  onStart: () => void;
}) {
  const copy = getHeroCopy(mood, topHobby);
  const nextLabel = formatTime(nextPauseAt);

  return (
    <GlassSurface
      radius={24}
      contentStyle={{ padding: 18 }}
    >
      <View style={styles.pillRow}>
        {nextLabel ? (
          <View style={[styles.pill, styles.pillWithIcon]}>
            <Icon name="clock" size={12} color="muted" />
            <Text variant="caption" weight="semibold" color="muted">
              Próxima · {nextLabel}
            </Text>
          </View>
        ) : null}
        <View style={styles.pill}>
          <Text variant="caption" weight="semibold" color="muted">
            {copy.time}
          </Text>
        </View>
      </View>

      <View style={{ height: 14 }} />

      <HeroCopyBlock title={copy.title} sub={copy.sub} signature={mood ?? ""} />

      <View style={{ height: 16 }} />

      <PauseHeroBtn onPress={onStart} timeLabel={copy.time} />
    </GlassSurface>
  );
}

/**
 * Title + sub with a 200ms opacity cross-fade when the signature (mood) changes.
 * Reduces to no animation under prefers-reduced-motion.
 */
function HeroCopyBlock({
  title,
  sub,
  signature,
}: {
  title: string;
  sub: string;
  signature: string;
}) {
  const opacity = useRef(new Animated.Value(1)).current;
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      reduceMotionRef.current = v;
    });
  }, []);

  useEffect(() => {
    if (reduceMotionRef.current) return;
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [signature, opacity]);

  return (
    <Animated.View style={{ opacity }}>
      <Text variant="h2" weight="bold" color="text">
        {title}
      </Text>
      <View style={{ height: 6 }} />
      <Text variant="bodySm" color="muted">
        {sub}
      </Text>
    </Animated.View>
  );
}

function PauseHeroBtn({
  onPress,
  timeLabel,
}: {
  onPress: () => void;
  timeLabel: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Empezar pausa de ${timeLabel}`}
    >
      <View style={styles.ctaOuter}>
        <View style={styles.ctaPlayCircle}>
          <Icon name="play" size={22} color="inverse" />
        </View>
        <View style={styles.ctaMiddle}>
          <Text variant="body" weight="bold" color="inverse">
            Empezar ahora
          </Text>
          <View style={{ opacity: 0.85 }}>
            <Text variant="caption" color="inverse">
              Toca para iniciar
            </Text>
          </View>
        </View>
        <Icon name="arrow-right" size={18} color="inverse" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pillRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 9999,
    backgroundColor: glass.tint.pill,
    borderWidth: 1,
    borderColor: palette.stone[200],
  },
  pillWithIcon: {
    gap: 6,
  },
  ctaOuter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.coral[500],
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    shadowColor: palette.coral[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 6,
  },
  ctaPlayCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: glass.tint.inner,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaMiddle: {
    flex: 1,
  },
});
