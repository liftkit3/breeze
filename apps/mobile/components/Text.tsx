import { Text as RNText, type TextProps as RNTextProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/**
 * Text — typed text primitive.
 *
 * Consumes textStyles composite tokens from @breeze/design-tokens.
 * NEVER pass raw fontSize/fontWeight/lineHeight as props — use `variant`.
 *
 * @example
 *   <Text variant="h1">Hello</Text>
 *   <Text variant="bodySm" color="muted">Subtitle</Text>
 */

// Each weight ships as its own font file from @expo-google-fonts/plus-jakarta-sans
// and is registered under its canonical name. RN cannot resolve a single family
// across weights, so each variant binds to its specific font name.
const VARIANT_TO_FONT_FAMILY = {
  display: "PlusJakartaSans_800ExtraBold",
  h1:      "PlusJakartaSans_800ExtraBold",
  h2:      "PlusJakartaSans_700Bold",
  h3:      "PlusJakartaSans_700Bold",
  bodyLg:  "PlusJakartaSans_400Regular",
  body:    "PlusJakartaSans_400Regular",
  bodySm:  "PlusJakartaSans_400Regular",
  caption: "PlusJakartaSans_500Medium",
  label:   "PlusJakartaSans_600SemiBold",
  tagline: "PlusJakartaSans_500Medium",
} as const;

// Optional weight override — re-binds fontFamily to the matching PJS file AND
// applies the corresponding Tailwind class so leading/spacing remain consistent.
// Use when a screen needs a weight that doesn't match the variant's default
// (e.g., body @ 700 for card titles, bodySm @ 600 for connect row title).
const WEIGHT_TO_FONT_FAMILY = {
  normal:    "PlusJakartaSans_400Regular",
  medium:    "PlusJakartaSans_500Medium",
  semibold:  "PlusJakartaSans_600SemiBold",
  bold:      "PlusJakartaSans_700Bold",
  extrabold: "PlusJakartaSans_800ExtraBold",
} as const;

const WEIGHT_TO_CLASS = {
  normal:    "font-normal",
  medium:    "font-medium",
  semibold:  "font-semibold",
  bold:      "font-bold",
  extrabold: "font-extrabold",
} as const;

export type TextWeight = keyof typeof WEIGHT_TO_FONT_FAMILY;

const textStyles = cva("font-sans", {
  variants: {
    variant: {
      display:  "text-5xl font-extrabold leading-none tracking-tight",
      h1:       "text-4xl font-extrabold leading-tight tracking-tight",
      h2:       "text-2xl font-bold leading-tight",
      h3:       "text-xl font-bold leading-snug",
      bodyLg:   "text-lg font-normal leading-normal",
      body:     "text-base font-normal leading-normal",
      bodySm:   "text-sm font-normal leading-normal",
      caption:  "text-xs font-medium leading-snug",
      label:    "text-xs font-semibold leading-none tracking-wider uppercase",
      tagline:  "text-base font-medium leading-snug tracking-wide",
    },
    color: {
      text:      "text-text",
      muted:     "text-text-muted",
      inverse:   "text-text-inverse",
      onPrimary: "text-text-onPrimary",
      onAccent:  "text-text-onAccent",
      primary:   "text-primary",
      accent:    "text-accent",
    },
    align: {
      left:   "text-left",
      center: "text-center",
      right:  "text-right",
    },
  },
  defaultVariants: {
    variant: "body",
    color: "text",
    align: "left",
  },
});

export type TextVariant = NonNullable<VariantProps<typeof textStyles>["variant"]>;
export type TextColor = NonNullable<VariantProps<typeof textStyles>["color"]>;

export type TextProps = VariantProps<typeof textStyles> &
  Omit<RNTextProps, "style"> & {
    children: React.ReactNode;
    className?: string;
    weight?: TextWeight;
  };

export function Text({
  variant,
  color,
  align,
  weight,
  className,
  children,
  ...rest
}: TextProps) {
  const resolvedVariant: TextVariant = variant ?? "body";
  const fontFamily = weight
    ? WEIGHT_TO_FONT_FAMILY[weight]
    : VARIANT_TO_FONT_FAMILY[resolvedVariant];
  return (
    <RNText
      style={{ fontFamily }}
      className={cn(
        textStyles({ variant, color, align }),
        weight && WEIGHT_TO_CLASS[weight],
        className,
      )}
      {...rest}
    >
      {children}
    </RNText>
  );
}
