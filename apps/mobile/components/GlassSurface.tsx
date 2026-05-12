import { type ReactNode } from "react";
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { BlurView } from "expo-blur";
import { glass, palette } from "@breeze/design-tokens";

/**
 * GlassSurface — frosted-glass card primitive.
 *
 * Composition:
 *   outer (shadow lift) → clip (rounded overflow:hidden) →
 *     [ BlurView backdrop · white tint overlay · 1px highlight border · children ]
 *
 * Tunable per element via `radius` (14 / 18 / 22 / 24 / 28 per home flow spec).
 *
 * Children render inside the rounded clip — pass padding via `contentStyle`.
 */

export type GlassSurfaceProps = {
  children?: ReactNode;
  radius?: number;
  /** BlurView intensity 0–100. 40 ≈ the spec's blur(20px) saturate(160%). */
  intensity?: number;
  /** Tint variant. Defaults to `tint.base` (0.55). Use `tint.idle` for mood idle. */
  tint?: "base" | "idle" | "pill";
  /** Shadow profile. `card` for hero/mood, `nav` for bottom nav. */
  shadow?: "card" | "nav" | "none";
  className?: string;
  /** Style on the outer (shadow) wrapper — use for margin, position. */
  style?: StyleProp<ViewStyle>;
  /** Style on the inner content layer — use for padding. */
  contentStyle?: StyleProp<ViewStyle>;
};

export function GlassSurface({
  children,
  radius = 22,
  intensity = 40,
  tint = "base",
  shadow = "card",
  className,
  style,
  contentStyle,
}: GlassSurfaceProps) {
  const tintColor = glass.tint[tint];
  const shadowProps = shadow === "none" ? null : SHADOW[shadow];

  return (
    <View
      className={className}
      style={[
        { borderRadius: radius },
        shadowProps,
        style,
      ]}
    >
      <View style={[styles.clip, { borderRadius: radius }]}>
        <BlurView
          tint="light"
          intensity={intensity}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={[StyleSheet.absoluteFill, { backgroundColor: tintColor }]}
        />
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            {
              borderRadius: radius,
              borderWidth: 1,
              borderColor: glass.border.highlight,
            },
          ]}
        />
        <View style={contentStyle}>{children}</View>
      </View>
    </View>
  );
}

const SHADOW = {
  card: {
    shadowColor: palette.stone[900],
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.07,
    shadowRadius: 28,
    elevation: 6,
  } satisfies ViewStyle,
  nav: {
    shadowColor: palette.stone[900],
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 12,
  } satisfies ViewStyle,
} as const;

const styles = StyleSheet.create({
  clip: {
    overflow: "hidden",
  },
});
