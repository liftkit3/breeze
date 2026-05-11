import { useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { palette } from "@breeze/design-tokens";
import { cn } from "../lib/cn";
import { Icon } from "./Icon";
import { Text } from "./Text";

/**
 * GoogleConnectRow — conditional row shown under TriggerCard when "calendar"
 * trigger is selected. Two visual states:
 *
 *   "not connected"  white card, G logo, title + subtitle + chevron.
 *   "connected"      sage-tinted card, check badge, title only, non-pressable.
 *
 * Tap behavior: in spec, opens the system Google OAuth flow via
 * `expo-auth-session` (Calendar read-only scope) and flips `connected = true`
 * on success.
 *
 * TODO(M1 S7 — Calendar OAuth): replace `onConnect` with the real OAuth call
 * + scope `calendar.readonly`. Right now the parent simulates success after a
 * short delay so we can validate the UI state machine end-to-end without the
 * Google Cloud Console + token-encryption work (which is S7's pre-flight).
 */
export type GoogleConnectRowProps = {
  connected: boolean;
  onConnect: () => Promise<void> | void;
};

export function GoogleConnectRow({ connected, onConnect }: GoogleConnectRowProps) {
  const [busy, setBusy] = useState(false);

  const handlePress = async () => {
    if (connected || busy) return;
    setBusy(true);
    try {
      await onConnect();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Pressable
      onPress={connected ? undefined : handlePress}
      disabled={connected || busy}
      accessibilityRole="button"
      accessibilityLabel={connected ? "Calendar conectado" : "Conectar Google Calendar"}
      accessibilityState={{ disabled: connected || busy }}
      className={cn(
        "flex-row items-center rounded-md border",
        connected ? "bg-sage-100 border-sage-300" : "bg-white border-stone-200",
      )}
      style={{ paddingVertical: 14, paddingHorizontal: 16, columnGap: 12 }}
    >
      {/* 32×32 leading circle: G logo when idle, check on sage when connected */}
      <View
        className={cn(
          "w-8 h-8 rounded-full items-center justify-center",
          connected ? "bg-sage-500" : "bg-white border border-stone-200",
        )}
      >
        {connected ? (
          <Icon name="check" size={16} color="inverse" />
        ) : (
          <Icon name="google" size={18} />
        )}
      </View>

      {/* Title + subtitle */}
      <View className="flex-1">
        <Text
          variant="bodySm"
          weight="semibold"
          className={connected ? "text-sage-700" : ""}
        >
          {connected ? "Calendar conectado" : "Conectar Google Calendar"}
        </Text>
        {!connected ? (
          <Text variant="caption" color="muted" className="mt-0.5">
            Solo lectura. Puedes desconectar luego.
          </Text>
        ) : null}
      </View>

      {/* Trailing affordance: spinner while connecting, chevron when idle, hidden when done */}
      {!connected ? (
        busy ? (
          <ActivityIndicator color={palette.stone[500]} />
        ) : (
          <Text variant="body" color="muted" weight="medium">
            ›
          </Text>
        )
      ) : null}
    </Pressable>
  );
}
