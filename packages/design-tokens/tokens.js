// Plain JS — consumed by tailwind.config.js (Node.js, no TS transform)

const colors = {
  primary: {
    50: "#EEF2FF",
    100: "#E0E7FF",
    200: "#C7D2FE",
    300: "#A5B4FC",
    400: "#818CF8",
    500: "#6366F1",
    600: "#4F46E5",
    700: "#4338CA",
    800: "#3730A3",
    900: "#312E81",
  },
  accent: {
    50: "#FFF7ED",
    100: "#FFEDD5",
    200: "#FED7AA",
    300: "#FDBA74",
    400: "#FB923C",
    500: "#F97316",
    600: "#EA580C",
  },
  sage: {
    50: "#F0FDF4",
    100: "#DCFCE7",
    200: "#BBF7D0",
    300: "#86EFAC",
    400: "#4ADE80",
    500: "#22C55E",
    600: "#16A34A",
    700: "#15803D",
  },
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },
  white: "#FFFFFF",
  background: "#FAFAF9",
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
};

const borderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

const typography = {
  fontFamily: {
    sans: ["System", "sans-serif"],
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },
};

// Shape that tailwind.config.js can spread into theme.extend
const tailwindTheme = {
  colors,
  borderRadius: {
    sm: `${borderRadius.sm}px`,
    md: `${borderRadius.md}px`,
    lg: `${borderRadius.lg}px`,
    xl: `${borderRadius.xl}px`,
    full: `${borderRadius.full}px`,
  },
  fontFamily: typography.fontFamily,
  fontSize: Object.fromEntries(
    Object.entries(typography.fontSize).map(([k, v]) => [k, `${v}px`])
  ),
};

module.exports = { colors, spacing, borderRadius, typography, tailwindTheme };
