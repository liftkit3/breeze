import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  TextInput as RNTextInput,
  View,
} from "react-native";
import { palette } from "@breeze/design-tokens";
import { Button } from "./Button";
import { Text } from "./Text";

/**
 * BottomSheet — "+ Otro" custom hobby input.
 *
 * Lightweight bottom-anchored modal. Solid stone scrim (no blur — solid is
 * fine on cream per spec). The screen that owns this sheet must wrap itself
 * in <KeyboardAvoidingView behavior="padding"> so the sheet floats above the
 * keyboard (wrapping the sheet itself is the wrong layer).
 *
 * The input is rendered inline (raw RN TextInput) rather than via our shared
 * TextInput primitive because the only TextInput variant we ship today is
 * `glass-dark` (login-flow dark hero). The sheet sits on a white card and
 * needs a distinct, lighter treatment.
 */
export type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  onAdd: (label: string) => void;
};

const MAX_LABEL_LENGTH = 30;

export function BottomSheet({ visible, onClose, onAdd }: BottomSheetProps) {
  const [value, setValue] = useState("");
  const trimmed = value.trim();
  const canSubmit = trimmed.length > 0;

  // Reset the input each time the sheet opens so a stale draft doesn't appear.
  useEffect(() => {
    if (visible) setValue("");
  }, [visible]);

  const handleAdd = () => {
    if (!canSubmit) return;
    onAdd(trimmed);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      transparent
      animationType="slide"
      statusBarTranslucent
    >
      {/* Backdrop — tap to dismiss */}
      <Pressable
        accessibilityLabel="Cerrar"
        onPress={onClose}
        className="flex-1 justify-end bg-stone-900/[0.45]"
      >
        {/* Container — Pressable swallows touches so taps inside don't close */}
        <Pressable
          onPress={() => {}}
          className="bg-white"
          style={{
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingTop: 24,
            paddingRight: 24,
            paddingBottom: 32,
            paddingLeft: 24,
            rowGap: 16,
          }}
        >
          {/* Drag handle */}
          <View
            className="self-center bg-stone-200"
            style={{ width: 36, height: 4, borderRadius: 2 }}
          />

          <Text variant="h2" weight="extrabold">
            Agrega un hobby
          </Text>

          <Text variant="bodySm" color="muted">
            Una palabra o dos. Lo que disfrutes hacer fuera del trabajo.
          </Text>

          {/* Input — light card style, rendered inline (see file comment) */}
          <View
            className="bg-stone-50 border-[1.5px] border-stone-200"
            style={{
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderRadius: 14,
            }}
          >
            <RNTextInput
              value={value}
              onChangeText={setValue}
              onSubmitEditing={handleAdd}
              placeholder="ej. cocinar, escalar, jardín…"
              placeholderTextColor={palette.stone[500]}
              maxLength={MAX_LABEL_LENGTH}
              autoFocus
              returnKeyType="done"
              style={{
                color: palette.stone[900],
                fontFamily: "PlusJakartaSans_400Regular",
                fontSize: 16,
                padding: 0,
              }}
            />
          </View>

          {/* Buttons row — gap 10 per spec, both flex-1 */}
          <View className="flex-row" style={{ columnGap: 10 }}>
            <View className="flex-1">
              <Button variant="secondary-pill" fullWidth onPress={onClose}>
                Cancelar
              </Button>
            </View>
            <View className="flex-1">
              <Button
                variant="primary-pill"
                fullWidth
                disabled={!canSubmit}
                onPress={handleAdd}
              >
                Agregar
              </Button>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
