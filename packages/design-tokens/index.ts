// TypeScript re-export — consumed by app code (typed)
export const {
  colors,
  spacing,
  borderRadius,
  typography,
  tailwindTheme,
} = require("./tokens") as typeof import("./tokens");

export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Typography = typeof typography;
