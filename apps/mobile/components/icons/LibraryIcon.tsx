import Svg, { Path } from "react-native-svg";

export function LibraryIcon({ size = 24, color = "#4F4942" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 4h4v16H4zM10 4h4v16h-4zM16.5 4.5l3.5 1-3.5 14.5-3.5-1z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
