import { StyleSheet, View } from "react-native";
import { palette } from "@breeze/design-tokens";

/**
 * AmbientGlow — three colored blobs rendered behind the scroll container.
 *
 * Position is fixed (absolute, page-level) so the glass surfaces refract a
 * *different slice* of color as they scroll over the page background.
 *
 * Note: React Native has no `filter: blur(80px)` for arbitrary views, so the
 * blobs are large soft-tinted circles. BlurView on top of glass cards still
 * provides the bulk of the dreamy effect when content scrolls over them.
 * If we ever want crisper blob blur, drop in react-native-skia later.
 */

export function AmbientGlow() {
  return (
    <View pointerEvents="none" style={styles.layer}>
      <View
        style={[
          styles.blob,
          {
            top: -80,
            right: -60,
            width: 280,
            height: 280,
            borderRadius: 140,
            backgroundColor: palette.coral[200],
            opacity: 0.55,
          },
        ]}
      />
      <View
        style={[
          styles.blob,
          {
            top: 240,
            left: -100,
            width: 260,
            height: 260,
            borderRadius: 130,
            backgroundColor: palette.sage[200],
            opacity: 0.45,
          },
        ]}
      />
      <View
        style={[
          styles.blob,
          {
            bottom: -60,
            right: -40,
            width: 260,
            height: 260,
            borderRadius: 130,
            backgroundColor: palette.honey[200],
            opacity: 0.4,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
  },
  blob: {
    position: "absolute",
  },
});
