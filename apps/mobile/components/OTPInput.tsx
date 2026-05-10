import { useRef, useState } from "react";
import { TextInput as RNTextInput, View } from "react-native";
import { palette } from "@breeze/design-tokens";
import { cn } from "../lib/cn";
import { Text } from "./Text";

/**
 * OTPInput — 6-digit code entry.
 *
 * Implementation:
 *   - One hidden full-width <TextInput> captures keystrokes (autoFocus,
 *     keyboardType=number-pad, textContentType=oneTimeCode, maxLength=length).
 *   - 6 visual boxes mirror the typed digits. Tapping anywhere focuses the
 *     hidden input (it sits on top of the boxes, opacity 0).
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

export function OTPInput({ length = 6, onComplete, onChange }: OTPInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<RNTextInput>(null);

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, length);
    setValue(digits);
    onChange?.(digits);
    if (digits.length === length) onComplete(digits);
  };

  return (
    <View className="relative">
      {/* Visual boxes — rendered first (behind), receive no taps. */}
      <View className="flex-row justify-between">
        {Array.from({ length }).map((_, i) => {
          const filled = i < value.length;
          const digit = value[i] ?? "";
          return (
            <View
              key={i}
              className={cn(
                "w-12 h-14 rounded-md items-center justify-center bg-white/[0.06] border",
                filled ? "border-sage-300" : "border-white/[0.18]",
              )}
            >
              <Text variant="h2" color="inverse">
                {digit}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Hidden input on top — captures taps + keystrokes. */}
      <RNTextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        autoFocus
        maxLength={length}
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        caretHidden
        selectionColor={palette.transparent}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0,
          fontSize: 1,
          color: palette.transparent,
        }}
      />
    </View>
  );
}
