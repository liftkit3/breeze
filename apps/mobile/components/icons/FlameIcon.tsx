import Svg, { Path } from "react-native-svg";

export function FlameIcon({ size = 24, color = "#FF6B59" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2c1 3 4 4 4 8a4 4 0 0 1-8 0c0-1 .5-2 1-2.5C9 9 9 7.5 9.5 6 10.5 7 11.5 7 12 2z"
        fill={color}
      />
      <Path
        d="M12 22a6 6 0 0 0 6-6c0-2-1-3.5-2.5-4.5.3 1.2-.2 2.2-1.2 2.7C13 14 12.5 12.5 12 11c-.5 1.5-1 3-2.3 3.2-1-.5-1.5-1.5-1.2-2.7C7 12.5 6 14 6 16a6 6 0 0 0 6 6z"
        fill={color}
      />
    </Svg>
  );
}
