import Svg, { Circle, Path } from "react-native-svg";

export function ProfileIcon({ size = 24, color = "#4F4942" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={2} />
      <Path
        d="M4 21c0-4.5 3.5-7.5 8-7.5s8 3 8 7.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}
