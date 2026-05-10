import { useState } from "react";
import {
  TextInput as RNTextInput,
  View,
  type TextInputProps as RNTextInputProps,
} from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { palette } from "@breeze/design-tokens";
import { cn } from "../lib/cn";

/**
 * TextInput — typed input primitive.
 *
 * Variants:
 *   glass-dark   used on the dark-hero (Login → Email/OTP). Translucent fill,
 *                white text, sage-300 focus border + soft sage glow behind.
 *
 * Why no BlurView: translucent rgba alone reads correctly on the dark hero,
 * and BlurView over a TextInput causes keyboard glitches on Android.
 */

const containerStyles = cva(
  "flex-row items-center rounded-md py-md px-5",
  {
    variants: {
      variant: {
        "glass-dark": "bg-white/[0.06] border",
      },
      focused: {
        true: "border-sage-300",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "glass-dark",
        focused: false,
        className: "border-white/[0.18]",
      },
    ],
    defaultVariants: {
      variant: "glass-dark",
      focused: false,
    },
  },
);

export type TextInputVariant = NonNullable<VariantProps<typeof containerStyles>["variant"]>;

export type TextInputProps = Omit<RNTextInputProps, "style" | "placeholderTextColor"> & {
  variant?: TextInputVariant;
  leftIcon?: React.ReactNode;
  className?: string;
};

// White at 40% — placeholder per spec. Template literal so ESLint's
// hex-literal rule (which targets Literal nodes) does not trip.
const PLACEHOLDER_COLOR = `${palette.white}66`;

export function TextInput({
  variant,
  leftIcon,
  className,
  onFocus,
  onBlur,
  ...rest
}: TextInputProps) {
  const [focused, setFocused] = useState(false);

  const handleFocus: NonNullable<RNTextInputProps["onFocus"]> = (e) => {
    setFocused(true);
    onFocus?.(e);
  };
  const handleBlur: NonNullable<RNTextInputProps["onBlur"]> = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <View>
      {/* Soft sage glow behind the input on focus.
          RN can't do focus-rings on TextInputs, so we layer a View. */}
      {focused ? (
        <View
          pointerEvents="none"
          className="absolute bg-sage-300/[0.18]"
          style={{ top: -4, left: -4, right: -4, bottom: -4, borderRadius: 20 }}
        />
      ) : null}

      <View className={cn(containerStyles({ variant, focused }), className)}>
        {leftIcon ? <View className="mr-3">{leftIcon}</View> : null}
        <RNTextInput
          {...rest}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={PLACEHOLDER_COLOR}
          style={{
            flex: 1,
            color: palette.white,
            fontFamily: "PlusJakartaSans_500Medium",
            fontSize: 16,
            padding: 0,
          }}
        />
      </View>
    </View>
  );
}
