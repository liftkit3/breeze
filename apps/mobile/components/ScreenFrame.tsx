import { View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, type Edges } from "react-native-safe-area-context";
import { palette } from "@breeze/design-tokens";
import { Icon, type IconName } from "./Icon";

/**
 * ScreenFrame — full-screen wrapper with safe area + variant background.
 *
 * Variants:
 *   `default`    cream bg, top safe area only (used for all in-app screens)
 *   `dark-hero`  full-bleed dark background — minimal sage glow centered,
 *                6 floating hobby SVGs at 22% opacity, strong bottom vignette.
 *                Used by Login (cosmic-pill design).
 *
 * The `dark-hero` decoration is INTERNAL — not customizable via props.
 * If you need a different hero, add a new variant; do NOT override.
 */

export type ScreenFrameVariant = "default" | "dark-hero";

export type ScreenFrameProps = {
  variant?: ScreenFrameVariant;
  children: React.ReactNode;
};

// Floating hobby decoration — positioned absolutely, sized in px.
const FLOATING_ICONS: { name: IconName; topPct: number; leftPct?: number; rightPct?: number; sizePx: number }[] = [
  { name: "guitar",     topPct: 0.06, leftPct: 0.10, sizePx: 44 },
  { name: "book",       topPct: 0.14, rightPct: 0.12, sizePx: 40 },
  { name: "running",    topPct: 0.30, leftPct: 0.18, sizePx: 38 },
  { name: "art",        topPct: 0.24, rightPct: 0.08, sizePx: 46 },
  { name: "meditation", topPct: 0.42, leftPct: 0.06, sizePx: 42 },
  { name: "writing",    topPct: 0.46, rightPct: 0.16, sizePx: 40 },
];

export function ScreenFrame({ variant = "default", children }: ScreenFrameProps) {
  if (variant === "dark-hero") return <DarkHeroFrame>{children}</DarkHeroFrame>;
  return <DefaultFrame>{children}</DefaultFrame>;
}

function DefaultFrame({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView edges={["top"] as Edges} className="flex-1 bg-bg">
      <View className="flex-1 px-lg">{children}</View>
    </SafeAreaView>
  );
}

function DarkHeroFrame({ children }: { children: React.ReactNode }) {
  const { height } = useWindowDimensions();

  return (
    <View className="flex-1 bg-bg-inverse">
      {/* Base layered gradient: stone-900 → stone-800 → stone-900 */}
      <LinearGradient
        colors={["rgba(45,42,38,0.7)", "rgba(56,50,41,0.7)", "rgba(45,42,38,0.7)"] as const}
        locations={[0, 0.6, 1]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Single sage glow centered (minimal palette per cosmic spec) */}
      <View
        style={{
          position: "absolute",
          top: height * 0.30,
          left: "50%",
          marginLeft: -160,
          width: 320,
          height: 320,
          borderRadius: 160,
          backgroundColor: palette.sage[500],
          opacity: 0.18,
        }}
      />

      {/* Floating hobby icons — static positioning. Animation TODO. */}
      {FLOATING_ICONS.map((f, i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            top: height * f.topPct,
            left: f.leftPct !== undefined ? `${f.leftPct * 100}%` : undefined,
            right: f.rightPct !== undefined ? `${f.rightPct * 100}%` : undefined,
            opacity: 0.22,
          }}
        >
          <Icon name={f.name} size={f.sizePx} color="inverse" />
        </View>
      ))}

      {/* Strong bottom vignette — starts at 45% to keep mid-screen open */}
      <LinearGradient
        colors={["transparent", "transparent", "rgba(45,42,38,0.92)"] as const}
        locations={[0, 0.45, 1]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Content */}
      <SafeAreaView edges={["top", "bottom"] as Edges} className="flex-1">
        <View className="flex-1 px-lg pb-lg">{children}</View>
      </SafeAreaView>
    </View>
  );
}
