import { palette } from "@breeze/design-tokens";
import { AppleIcon } from "./icons/AppleIcon";
import { GoogleIcon } from "./icons/GoogleIcon";
import { MailIcon } from "./icons/MailIcon";
import {
  GuitarIcon,
  BookIcon,
  RunningIcon,
  ArtIcon,
  MeditationIcon,
  WritingIcon,
} from "./icons/HobbyIcons";

/**
 * Icon — registry of inline SVG icons.
 *
 * To add a new icon:
 *   1. Create the SVG component in `icons/`
 *   2. Import and register it below in REGISTRY
 *   3. Add its name to the IconName union
 *
 * Multicolor brand icons (google) IGNORE the `color` prop — they ship in their
 * brand colors regardless. This is intentional (brand integrity).
 */

const SIZES = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  "2xl": 48,
} as const;

const COLORS = {
  text: palette.stone[900],
  muted: palette.stone[500],
  inverse: palette.white,
  primary: palette.sage[500],
  accent: palette.coral[500],
} as const;

export type IconName =
  | "apple"
  | "google"
  | "mail"
  | "guitar"
  | "book"
  | "running"
  | "art"
  | "meditation"
  | "writing";

export type IconSize = keyof typeof SIZES;
export type IconColor = keyof typeof COLORS;

export type IconProps = {
  name: IconName;
  size?: IconSize | number;
  color?: IconColor;
};

export function Icon({ name, size = "md", color = "text" }: IconProps) {
  const px = typeof size === "number" ? size : SIZES[size];
  const hex = COLORS[color];

  switch (name) {
    case "apple":
      return <AppleIcon size={px} color={hex} />;
    case "google":
      return <GoogleIcon size={px} />;
    case "mail":
      return <MailIcon size={px} color={hex} />;
    case "guitar":
      return <GuitarIcon size={px} color={hex} />;
    case "book":
      return <BookIcon size={px} color={hex} />;
    case "running":
      return <RunningIcon size={px} color={hex} />;
    case "art":
      return <ArtIcon size={px} color={hex} />;
    case "meditation":
      return <MeditationIcon size={px} color={hex} />;
    case "writing":
      return <WritingIcon size={px} color={hex} />;
    default: {
      const _exhaustive: never = name;
      return null;
    }
  }
}
