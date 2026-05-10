/**
 * Hobby icons used as floating decoration in ScreenFrame `dark-hero` variant.
 * Minimal, monochromatic SVGs — sized at 56px in usage, rendered at 25% opacity.
 */

import Svg, { Path, Circle } from "react-native-svg";

type HobbyIconProps = { size?: number; color?: string };

export function GuitarIcon({ size = 56, color = "currentColor" }: HobbyIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 4l4 4M14 4l-2 2M18 8l-2 2M9.5 14a3.5 3.5 0 11-3.5 3.5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path d="M16 6L11 11" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M9 13l-3 3" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

export function BookIcon({ size = 56, color = "currentColor" }: HobbyIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function RunningIcon({ size = 56, color = "currentColor" }: HobbyIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="13" cy="4" r="2" stroke={color} strokeWidth={1.5} />
      <Path
        d="M5 22l4-7 3-3-2-4 4 2 3 3 4 1M9 12l-2-3"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ArtIcon({ size = 56, color = "currentColor" }: HobbyIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.1 0 2-.9 2-2 0-.51-.2-.97-.51-1.32-.32-.36-.51-.83-.51-1.34 0-1.1.9-2 2-2h2.36c2.84 0 5.17-2.32 5.17-5.17C22 6.04 17.52 2 12 2z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <Circle cx="6.5" cy="11.5" r="1.5" fill={color} />
      <Circle cx="9.5" cy="7.5" r="1.5" fill={color} />
      <Circle cx="14.5" cy="7.5" r="1.5" fill={color} />
      <Circle cx="17.5" cy="11.5" r="1.5" fill={color} />
    </Svg>
  );
}

export function MeditationIcon({ size = 56, color = "currentColor" }: HobbyIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="6" r="2" stroke={color} strokeWidth={1.5} />
      <Path
        d="M12 9v6M5 19c0-3 3-5 7-5s7 2 7 5M3 19l5-2M21 19l-5-2"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function WritingIcon({ size = 56, color = "currentColor" }: HobbyIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 19l7-7 3 3-7 7-3-3z M18 13l-1.5-7.5L2 2l3.5 14.5L13 18M2 2l7.586 7.586M11 11a2 2 0 100-4 2 2 0 000 4z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
