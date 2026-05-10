import Svg, { Rect, Text as SvgText } from "react-native-svg";
import { palette } from "@breeze/design-tokens";

/**
 * Breeze Logo — 3 ascending rounded bars (sage muted → sage primary → coral).
 *
 * Liftkit-inspired geometric mark. SVG is hardcoded (canonical brand asset).
 * Only `light` and `withWordmark` props are exposed. Color customization NOT allowed
 * — the brand mark is canonical.
 */
export type LogoProps = {
  size?: number;
  withWordmark?: boolean;
  light?: boolean;
};

export function Logo({ size = 32, withWordmark = false, light = false }: LogoProps) {
  const wordColor = light ? palette.white : palette.stone[900];

  if (!withWordmark) {
    return (
      <Svg width={size} height={size} viewBox="0 0 40 40">
        <Rect x="0" y="22" width="11" height="18" rx="3" fill={palette.sage[300]} />
        <Rect x="14" y="12" width="11" height="28" rx="3" fill={palette.sage[500]} />
        <Rect x="28" y="2" width="12" height="38" rx="3" fill={palette.coral[500]} />
      </Svg>
    );
  }

  return (
    <Svg width={size * 6} height={size * 1.6} viewBox="0 0 240 64">
      <Rect x="4" y="35" width="18" height="29" rx="5" fill={palette.sage[300]} />
      <Rect x="26" y="19" width="18" height="45" rx="5" fill={palette.sage[500]} />
      <Rect x="48" y="3" width="19" height="61" rx="5" fill={palette.coral[500]} />
      <SvgText
        x="80"
        y="48"
        fontFamily="System"
        fontWeight="800"
        fontSize="38"
        fill={wordColor}
      >
        Breeze
      </SvgText>
    </Svg>
  );
}
