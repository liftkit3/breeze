import { useEffect, useRef, useState } from "react";
import { Animated, AppState, type AppStateStatus } from "react-native";
import { Text, type TextVariant, type TextColor } from "./Text";
import { motion } from "@breeze/design-tokens";

/**
 * TaglineRotator — cycles through strings on an interval with fade transition.
 *
 * - Pauses when app loses foreground (battery)
 * - Fade transition between items
 * - Always shows items[0] immediately on mount
 *
 * @example
 *   <TaglineRotator
 *     items={["First.", "Second."]}
 *     intervalMs={4000}
 *     textVariant="h2"
 *     textColor="inverse"
 *   />
 */
export type TaglineRotatorProps = {
  items: string[];
  intervalMs?: number;
  textVariant?: TextVariant;
  textColor?: TextColor;
  align?: "left" | "center" | "right";
};

export function TaglineRotator({
  items,
  intervalMs = 4000,
  textVariant = "h2",
  textColor = "inverse",
  align = "center",
}: TaglineRotatorProps) {
  const [index, setIndex] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;
  const isActiveRef = useRef(true);

  // Pause on app blur (battery)
  useEffect(() => {
    const sub = AppState.addEventListener("change", (status: AppStateStatus) => {
      isActiveRef.current = status === "active";
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;

    const tick = () => {
      if (!isActiveRef.current) return;

      Animated.timing(opacity, {
        toValue: 0,
        duration: motion.duration.base,
        useNativeDriver: true,
      }).start(() => {
        setIndex((i) => (i + 1) % items.length);
        Animated.timing(opacity, {
          toValue: 1,
          duration: motion.duration.base,
          useNativeDriver: true,
        }).start();
      });
    };

    const interval = setInterval(tick, intervalMs);
    return () => clearInterval(interval);
  }, [items.length, intervalMs, opacity]);

  return (
    <Animated.View style={{ opacity }}>
      <Text variant={textVariant} color={textColor} align={align}>
        {items[index]}
      </Text>
    </Animated.View>
  );
}
