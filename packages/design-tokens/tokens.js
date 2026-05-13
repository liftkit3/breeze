// ╔════════════════════════════════════════════════════════════════╗
// ║  Breeze Design Tokens — SINGLE SOURCE OF TRUTH                 ║
// ║                                                                ║
// ║  This file is the canonical source for ALL visual decisions.   ║
// ║  Every other file (tailwind config, app code, ESLint allowlist)║
// ║  derives from here. NEVER hardcode colors/spacing/etc anywhere.║
// ║                                                                ║
// ║  Spec: /Stopit/output/2026-05-05-breeze-tokens.spec.md         ║
// ║  Brand: /Stopit/output/2026-05-05-breeze-brand-brief.md        ║
// ╚════════════════════════════════════════════════════════════════╝

// CommonJS module — consumed by tailwind.config.js (no TS transform).
// Re-exported as TypeScript via index.ts for app code.

// ─── Raw color palettes (escape hatch — prefer semantic) ────────────────
const palette = {
  sage: {
    50: "#F0FAF3",
    100: "#DCEEE2",
    200: "#BBDDC8",
    300: "#94CCAD",
    400: "#7DC399",
    500: "#6DBF8A",
    600: "#5BAA77",
    700: "#498864",
    800: "#386750",
    900: "#244635",
  },
  coral: {
    50: "#FFF7F5",
    100: "#FFEAE6",
    200: "#FFD0CB",
    300: "#FFB1A8",
    400: "#FF9684",
    500: "#FF8474",
    600: "#FF6B59",
    700: "#DC4A38",
    800: "#B73828",
    900: "#8C2A1F",
  },
  honey: {
    50: "#FFFAF0",
    100: "#FFF1D6",
    200: "#FCE3AC",
    300: "#F9D17E",
    400: "#F6C054",
    500: "#F4B860",
    600: "#DA9C42",
    700: "#B47B2E",
    800: "#8B5C1F",
    900: "#6B4517",
  },
  stone: {
    50: "#F9F7F2",
    100: "#F4F1EB",
    200: "#E8E3D9",
    300: "#D5CFC1",
    400: "#ACA396",
    500: "#8A8378",
    600: "#6B6359",
    700: "#4F4942",
    800: "#383229",
    900: "#2D2A26",
    950: "#1A1814",
  },
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
};

// ─── Semantic colors (USE THESE in app code) ─────────────────────────────
// Tailwind: `bg-primary` → DEFAULT · `bg-primary-light` → light · etc.
const colors = {
  primary: {
    DEFAULT: palette.sage[500],
    hover: palette.sage[600],
    pressed: palette.sage[700],
    light: palette.sage[100],
    muted: palette.sage[300],
    fg: palette.white,
  },
  accent: {
    DEFAULT: palette.coral[500],
    hover: palette.coral[600],
    pressed: palette.coral[700],
    light: palette.coral[100],
    muted: palette.coral[300],
    fg: palette.white,
  },
  celebration: {
    DEFAULT: palette.honey[500],
    hover: palette.honey[600],
    light: palette.honey[100],
    fg: palette.stone[900],
  },
  bg: {
    DEFAULT: palette.stone[50],     // warm cream — the page background
    surface: palette.white,         // cards, sheets, raised surfaces
    muted: palette.stone[100],      // alt surface (input bg, etc.)
    inverse: palette.stone[900],    // dark surface (login hero)
  },
  text: {
    DEFAULT: palette.stone[900],
    muted: palette.stone[500],
    inverse: palette.white,
    onPrimary: palette.white,
    onAccent: palette.white,
  },
  border: {
    DEFAULT: palette.stone[200],
    strong: palette.stone[300],
    subtle: palette.stone[100],
  },
  status: {
    error: "#E07856",
    success: palette.sage[500],
    warning: palette.honey[500],
    info: "#7BA5C7",
  },

  // Raw palettes still accessible (escape hatch)
  sage: palette.sage,
  coral: palette.coral,
  honey: palette.honey,
  stone: palette.stone,
  white: palette.white,
  black: palette.black,
  transparent: palette.transparent,
};

// ─── Spacing (8pt grid) ──────────────────────────────────────────────────
const spacing = {
  0: 0,
  px: 1,
  0.5: 2,
  1: 4,
  xs: 4,
  2: 8,
  sm: 8,
  3: 12,
  4: 16,
  md: 16,
  5: 20,
  6: 24,
  lg: 24,
  7: 28,
  8: 32,
  xl: 32,
  10: 40,
  12: 48,
  "2xl": 48,
  14: 56,
  16: 64,
  "3xl": 64,
  20: 80,
  24: 96,
};

// ─── Border radius ───────────────────────────────────────────────────────
const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 40,
  full: 9999,
};

// ─── Border width ────────────────────────────────────────────────────────
const borderWidth = {
  0: 0,
  DEFAULT: 1,
  2: 2,
  4: 4,
};

// ─── Typography ──────────────────────────────────────────────────────────
const typography = {
  fontFamily: {
    sans: ["Plus Jakarta Sans", "System", "sans-serif"],
    mono: ["JetBrains Mono", "monospace"],
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
    "5xl": 48,
    "6xl": 60,
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },
  lineHeight: {
    none: 1.0,
    tight: 1.2,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.625,
    loose: 1.75,
  },
  letterSpacing: {
    tighter: -0.04,
    tight: -0.02,
    normal: 0,
    wide: 0.02,
    wider: 0.04,
    widest: 0.08,
  },
};

// ─── Shadows / elevation (warm — not pure black) ─────────────────────────
const shadow = {
  none: "0 0 0 transparent",
  sm: "0 1px 2px rgba(45,42,38,0.04)",
  md: "0 4px 12px rgba(45,42,38,0.06)",
  lg: "0 12px 24px rgba(45,42,38,0.08)",
  xl: "0 20px 40px rgba(45,42,38,0.10)",
  primary: "0 8px 20px rgba(109,191,138,0.30)",
  accent: "0 8px 20px rgba(255,132,116,0.30)",
};

// ─── Glass surfaces (Home screen aesthetic — alphas) ──────────────────────
// Centralizes every semi-transparent value used by GlassSurface, AmbientGlow,
// BottomNav, FAB, PauseHero. Keeps tsx files token-pure (ESLint forbids rgba).
const glass = {
  // White tint overlays (sit on top of BlurView)
  tint: {
    base: "rgba(255,255,255,0.55)",      // standard glass card
    idle: "rgba(255,255,255,0.50)",      // mood idle button bg
    pill: "rgba(255,255,255,0.60)",      // hero pill bg
    inner: "rgba(255,255,255,0.22)",     // play circle inside coral CTA
    halo: "rgba(255,255,255,0.50)",      // FAB outer white halo
    insetLight: "rgba(255,255,255,0.40)",// FAB inset top highlight
  },
  // Borders (the inset that creates "thickness")
  border: {
    highlight: "rgba(255,255,255,0.60)", // top glass highlight
    seal: "rgba(45,42,38,0.04)",         // bottom glass seal
  },
  // Shadows for glass elements (pre-baked rgba so RN shadowColor works)
  shadow: {
    lift: "rgba(45,42,38,0.07)",         // standard glass card lift
    nav: "rgba(45,42,38,0.10)",          // bottom nav (deeper)
    insetDark: "rgba(0,0,0,0.08)",       // FAB inset shadow
  },
};

// ─── Motion ──────────────────────────────────────────────────────────────
const motion = {
  duration: {
    instant: 0,
    fast: 150,
    base: 200,
    slow: 300,
    slower: 500,
  },
  easing: {
    standard: "cubic-bezier(0.4, 0, 0.2, 1)",
    decelerate: "cubic-bezier(0, 0, 0.2, 1)",
    accelerate: "cubic-bezier(0.4, 0, 1, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
};

// ─── Z-index (layer stack) ───────────────────────────────────────────────
const zIndex = {
  base: 0,
  sticky: 10,
  dropdown: 20,
  modal: 30,
  toast: 40,
  tooltip: 50,
  debug: 100,
};

// ─── Sizing (canonical dimensions) ───────────────────────────────────────
const size = {
  icon: { xs: 12, sm: 16, md: 20, lg: 24, xl: 32, "2xl": 48 },
  avatar: { xs: 24, sm: 32, md: 40, lg: 56, xl: 80, "2xl": 128 },
  touch: 44, // iOS HIG minimum tap target
};

// ─── Opacity ─────────────────────────────────────────────────────────────
const opacity = {
  0: 0,
  20: 0.2,
  40: 0.4,
  60: 0.6,
  80: 0.8,
  100: 1,
  disabled: 0.4,
  muted: 0.6,
  full: 1,
};

// ─── Composite text styles (USE for typography in components) ───────────
// Each style bundles family + size + weight + lineHeight + letterSpacing.
const textStyles = {
  display: { fontFamily: "sans", fontSize: 48, fontWeight: "800", lineHeight: 1.0, letterSpacing: -0.02 },
  h1:      { fontFamily: "sans", fontSize: 32, fontWeight: "800", lineHeight: 1.2, letterSpacing: -0.02 },
  h2:      { fontFamily: "sans", fontSize: 24, fontWeight: "700", lineHeight: 1.2, letterSpacing: -0.01 },
  h3:      { fontFamily: "sans", fontSize: 20, fontWeight: "700", lineHeight: 1.3 },
  bodyLg:  { fontFamily: "sans", fontSize: 18, fontWeight: "400", lineHeight: 1.5 },
  body:    { fontFamily: "sans", fontSize: 16, fontWeight: "400", lineHeight: 1.5 },
  bodySm:  { fontFamily: "sans", fontSize: 14, fontWeight: "400", lineHeight: 1.5 },
  caption: { fontFamily: "sans", fontSize: 12, fontWeight: "500", lineHeight: 1.4 },
  label:   { fontFamily: "sans", fontSize: 11, fontWeight: "600", lineHeight: 1.0, letterSpacing: 0.04, textTransform: "uppercase" },
};

// ─── Breakpoints (web only — for HR dashboard) ──────────────────────────
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

// ─── Tailwind theme adapter (consumed by tailwind.config.js) ────────────
// Converts numeric tokens to "{n}px" strings since Tailwind expects strings.
const px = (v) => (typeof v === "number" ? `${v}px` : v);
const mapPx = (obj) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, px(v)]));

const tailwindTheme = {
  colors,
  spacing: mapPx(spacing),
  borderRadius: mapPx(borderRadius),
  borderWidth: mapPx(borderWidth),
  fontFamily: typography.fontFamily,
  fontSize: mapPx(typography.fontSize),
  fontWeight: typography.fontWeight,
  lineHeight: typography.lineHeight,
  letterSpacing: Object.fromEntries(
    Object.entries(typography.letterSpacing).map(([k, v]) => [k, `${v}em`])
  ),
  boxShadow: shadow,
  zIndex: Object.fromEntries(
    Object.entries(zIndex).map(([k, v]) => [k, String(v)])
  ),
  opacity: Object.fromEntries(
    Object.entries(opacity).map(([k, v]) => [k, String(v)])
  ),
  transitionDuration: Object.fromEntries(
    Object.entries(motion.duration).map(([k, v]) => [k, `${v}ms`])
  ),
  transitionTimingFunction: motion.easing,
  screens: mapPx(breakpoints),
};

module.exports = {
  // Raw building blocks
  palette,
  colors,
  spacing,
  borderRadius,
  borderWidth,
  typography,
  shadow,
  glass,
  motion,
  zIndex,
  size,
  opacity,
  textStyles,
  breakpoints,

  // Adapter for Tailwind
  tailwindTheme,
};
