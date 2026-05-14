import Svg, { Path } from "react-native-svg";

type Props = { size?: number; color?: string };

export function SparkleIcon({ size = 16, color = "currentColor" }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 1.5l1.5 4 4 1.5-4 1.5L8 12.5 6.5 8.5l-4-1.5 4-1.5L8 1.5z"
        fill={color}
      />
      <Path d="M13 11.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6.6-1.4z" fill={color} opacity={0.6} />
    </Svg>
  );
}
