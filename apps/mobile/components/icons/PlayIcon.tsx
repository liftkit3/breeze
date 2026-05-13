import Svg, { Path } from "react-native-svg";

export function PlayIcon({ size = 24, color = "#FFFFFF" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M8 5.5v13l11-6.5z" fill={color} />
    </Svg>
  );
}
