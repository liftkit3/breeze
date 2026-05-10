import { Pressable, View, type GestureResponderEvent } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { Text, type TextColor } from "./Text";

/**
 * Button — pressable primitive with bundled visual + interaction.
 *
 * Locked variants (CVA enforced): each variant bundles bg + text color +
 * border + shadow. Children are TEXT only — Button enforces text content.
 *
 * SHAPE BY VARIANT:
 *   primary / secondary           → rounded-md (16px) — standard buttons
 *   oauth-light / oauth-outline   → rounded-full (9999px) — pill, used on dark-hero
 *   oauth-glass                   → rounded-full + semi-transparent — Login cosmic-pill style
 */

const buttonContainerStyles = cva(
  "flex-row items-center justify-center",
  {
    variants: {
      variant: {
        primary:        "bg-primary rounded-md",
        secondary:      "bg-bg-surface border border-border rounded-md",
        // OAuth variants are pill-shaped with longer padding (Login spec)
        "oauth-light":  "bg-bg-surface rounded-full",
        "oauth-outline": "border border-text-inverse/30 rounded-full",
        "oauth-glass":  "bg-white/10 border border-white/20 rounded-full",
      },
      size: {
        sm: "py-sm px-md",
        md: "py-md px-md",
        lg: "py-md px-lg",
        oauth: "py-md px-lg", // tuned for pill OAuth (16px vertical, 24px horizontal)
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      disabled: {
        true: "opacity-40",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
      disabled: false,
    },
  }
);

// Map variant → Text color (passed to children Text)
const variantToTextColor: Record<NonNullable<VariantProps<typeof buttonContainerStyles>["variant"]>, TextColor> = {
  primary: "onPrimary",
  secondary: "text",
  "oauth-light": "text",
  "oauth-outline": "inverse",
  "oauth-glass": "inverse",
};

export type ButtonVariant = NonNullable<VariantProps<typeof buttonContainerStyles>["variant"]>;

export type ButtonProps = VariantProps<typeof buttonContainerStyles> & {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  onPress: (event: GestureResponderEvent) => void;
  /** Button content — text only. */
  children: string;
  className?: string;
};

export function Button({
  variant,
  size,
  fullWidth,
  disabled,
  iconLeft,
  iconRight,
  loading,
  onPress,
  children,
  className,
}: ButtonProps) {
  const resolvedVariant: ButtonVariant = variant ?? "primary";
  const textColor = variantToTextColor[resolvedVariant];
  const isInactive = disabled || loading;
  const isOAuth = resolvedVariant.startsWith("oauth");
  const resolvedSize = size ?? (isOAuth ? "oauth" : "md");

  return (
    <Pressable
      onPress={isInactive ? undefined : onPress}
      disabled={isInactive ?? false}
      className={cn(
        buttonContainerStyles({ variant, size: resolvedSize, fullWidth, disabled }),
        // shadows: oauth-light gets a soft shadow; primary gets colored shadow
        resolvedVariant === "oauth-light" && "shadow-md",
        resolvedVariant === "primary" && "shadow-primary",
        className
      )}
      style={({ pressed }) => ({
        transform: [{ scale: pressed && !isInactive ? 0.97 : 1 }],
      })}
      accessibilityRole="button"
      accessibilityState={{ disabled: isInactive ?? false }}
    >
      {iconLeft ? <View className="mr-sm">{iconLeft}</View> : null}
      <Text variant="body" color={textColor} className="font-semibold">
        {children}
      </Text>
      {iconRight ? <View className="ml-sm">{iconRight}</View> : null}
    </Pressable>
  );
}
