import Svg, { Path } from "react-native-svg";

export function MailIcon({ size = 18, color = "#2D2A26" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 7l9 6 9-6M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
