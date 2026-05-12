import Svg, { Rect } from "react-native-svg";

export function PauseIcon({ size = 24, color = "#FFFFFF" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={6} y={5} width={4} height={14} rx={1.5} fill={color} />
      <Rect x={14} y={5} width={4} height={14} rx={1.5} fill={color} />
    </Svg>
  );
}
