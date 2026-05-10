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
  };

export function Text({
  variant,
  color,
  align,
  className,
  children,
  ...rest
}: TextProps) {
  return (
    <RNText
      className={cn(textStyles({ variant, color, align }), className)}
      {...rest}
    >
      {children}
    </RNText>
  );
}
