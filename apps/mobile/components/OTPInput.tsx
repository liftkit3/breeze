import { useEffect, useRef, useState } from "react";
import { Pressable, TextInput as RNTextInput, View } from "react-native";
import { palette } from "@breeze/design-tokens";
import { cn } from "../lib/cn";
import { Text } from "./Text";

/**
 * OTPInput — N-digit code entry.
 *
 * Implementation:
 *   - One hidden <TextInput> off-screen captures keystrokes.
 *   - Each visible box is a <Pressable> that explicitly focuses the input.
 *   - We don't rely on RN's autoFocus (races with navigation animations) or on
 *     stacking an opacity-0 input over the boxes (tap-to-focus is unreliable
 *     when the input has zero alpha).
 *
 * Behavior (all derived from controlled value):
 *   - Auto-advance — typing extends the string, next box fills.
 *   - Backspace — RN reports the new full string; rightmost digit disappears.
 *   - Paste — onChangeText receives the full string; we slice to length.
 *   - onComplete fires once digits.length === length.
 */
export type OTPInputProps = {
  length?: number;
  onComplete: (code: string) => void;
  onChange?: (code: string) => void;
};

const FOCUS_DELAY_MS = 200;

export function OTPInput({ length = 6, onComplete, onChange }: OTPInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<RNTextInput>(null);

  const focusInput = () => inputRef.current?.focus();

  // Defer initial focus so the navigation push animation settles first —
  // otherwise iOS occasionally swallows the keyboard show event.
  useEffect(() => {
    const t = setTimeout(focusInput, FOCUS_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, length);
    setValue(digits);
    onChange?.(digits);
    if (digits.length === length) onComplete(digits);
  };

  return (
    <View>
      {/* Off-screen input — receives keystrokes once focused. Not tappable. */}
      <RNTextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={length}
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        caretHidden
        selectionColor={palette.transparent}
        style={{
          position: "absolute",
          left: -9999,
          width: 1,
          height: 1,
          opacity: 0,
        }}
      />

      {/* Visible boxes — each Pressable focuses the off-screen input. */}
      <View className="flex-row justify-between">
        {Array.from({ length }).map((_, i) => {
          const filled = i < value.length;
          const digit = value[i] ?? "";
          return (
            <Pressable
              key={i}
              onPress={focusInput}
              accessibilityRole="button"
              accessibilityLabel={`Dígito ${i + 1}`}
              className={cn(
                "w-12 h-14 rounded-md items-center justify-center bg-white/[0.06] border",
                filled ? "border-sage-300" : "border-white/[0.18]",
              )}
            >
              <Text variant="h2" color="inverse">
                {digit}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
