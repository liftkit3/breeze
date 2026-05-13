// TypeScript re-export of @breeze/design-tokens
//
// Consumed by app code (typed). The CommonJS source lives in tokens.js
// so tailwind.config.js can require() it without TS transform.
//
// Usage in app code:
//   import { colors, spacing, textStyles } from "@breeze/design-tokens";
//   <View style={{ backgroundColor: colors.primary.DEFAULT, padding: spacing.md }} />

const tokens = require("./tokens") as typeof import("./tokens");

export const palette = tokens.palette;
export const colors = tokens.colors;
export const spacing = tokens.spacing;
export const borderRadius = tokens.borderRadius;
export const borderWidth = tokens.borderWidth;
export const typography = tokens.typography;
export const shadow = tokens.shadow;
export const glass = tokens.glass;
export const motion = tokens.motion;
export const zIndex = tokens.zIndex;
export const size = tokens.size;
export const opacity = tokens.opacity;
export const textStyles = tokens.textStyles;
export const breakpoints = tokens.breakpoints;
export const tailwindTheme = tokens.tailwindTheme;

// ─── Type exports (for primitive prop typing) ────────────────────────────
export type Palette = typeof tokens.palette;
export type Colors = typeof tokens.colors;
export type Spacing = typeof tokens.spacing;
export type BorderRadius = typeof tokens.borderRadius;
export type BorderWidth = typeof tokens.borderWidth;
export type Typography = typeof tokens.typography;
export type Shadow = typeof tokens.shadow;
export type Glass = typeof tokens.glass;
export type Motion = typeof tokens.motion;
export type ZIndex = typeof tokens.zIndex;
export type Size = typeof tokens.size;
export type Opacity = typeof tokens.opacity;
export type TextStyles = typeof tokens.textStyles;
export type Breakpoints = typeof tokens.breakpoints;

// ─── Token-key unions (use these to constrain primitive props) ──────────
// Example:  type ButtonSize = SpacingKey;  // forces gap to be a token alias
export type SpacingKey = keyof Spacing;
export type RadiusKey = keyof BorderRadius;
export type ColorKey = keyof Colors;
export type SemanticColor =
  | "primary"
  | "accent"
  | "celebration"
  | "bg"
  | "text"
  | "border";
export type TextStyleKey = keyof TextStyles;
export type ShadowKey = keyof Shadow;
export type MotionDurationKey = keyof Motion["duration"];
export type MotionEasingKey = keyof Motion["easing"];
