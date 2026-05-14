import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { glass, palette } from "@breeze/design-tokens";
import { Text } from "@/components/Text";
import { GlassSurface } from "@/components/GlassSurface";
import { useMood } from "@/features/home/use-mood";
import { useHomeData } from "@/features/home/use-home-data";
import { usePickerStore } from "./use-picker-store";
import { usePauseSession } from "./use-pause-session";
import { DurationGrid, type Duration } from "./parts/DurationGrid";
import { HobbyGrid } from "./parts/HobbyGrid";
import { AIHintCard } from "./parts/AIHintCard";
import { EmpezarButton } from "./parts/EmpezarButton";

/**
 * PickerSheet — bottom-sheet entry to a Pause.
 *
 * Two entry points: BottomNav coral FAB + Home hero CTA both call
 * `usePickerStore.open()`. Sheet is mounted in `(main)/_layout.tsx` so it
 * overlays the whole main route group.
 *
 * Per S10 build decisions (vs PAUSE_PICKER_SPEC.md §1.3):
 *  - Drag-to-dismiss: DEFERRED. react-native-gesture-handler isn't in deps,
 *    and the other 2 dismiss paths (scrim tap, Android hardware back via
 *    Modal.onRequestClose) cover all real users.
 *  - Animation curve: RN Modal `animationType="slide"` instead of the
 *    spec's custom cubic-bezier. Spec curve needs Reanimated + a custom
 *    Modal — gold-plating for v1.
 *  - Focus trap: RN Modal traps touches naturally; explicit screen-reader
 *    focus management is iOS VoiceOver territory, deferred.
 */
export function PickerSheet() {
  const isOpen = usePickerStore((s) => s.isOpen);
  const close = usePickerStore((s) => s.close);
  const { mood } = useMood();
  const { data } = useHomeData();
  // Destructure stable refs out of the session wrapper. The wrapper object
  // itself is recreated each render, but `start`/`reset` are stable from
  // useMutation — depending on them (not the wrapper) is what prevents the
  // infinite render loop.
  const { start, reset, isPending, error } = usePauseSession();

  const hobbies = data?.hobbies ?? [];
  const topHobbyKey = hobbies[0]?.key ?? "";

  const [duration, setDuration] = useState<Duration>(5);
  const [hobbyKey, setHobbyKey] = useState<string>(topHobbyKey);

  // Reset selections every time the sheet opens. Defaults are static 5min +
  // top hobby for v1; switch to `profile.last_pause_*` once persisted.
  useEffect(() => {
    if (isOpen) {
      setDuration(5);
      setHobbyKey(topHobbyKey);
    }
  }, [isOpen, topHobbyKey]);

  const selectedHobby =
    hobbies.find((h) => h.key === hobbyKey) ?? hobbies[0];

  const handleClose = () => {
    if (isPending) return;
    reset();
    close();
  };

  const handleEmpezar = () => {
    if (!selectedHobby) return;
    start({
      mood: mood?.key ?? null,
      duration,
      hobby: selectedHobby.key,
      hobbyLabel: selectedHobby.name,
    });
  };

  return (
    <Modal
      visible={isOpen}
      onRequestClose={handleClose}
      transparent
      animationType="slide"
      statusBarTranslucent
    >
      <Pressable
        onPress={handleClose}
        accessibilityLabel="Cerrar"
        style={styles.scrim}
      >
        {/* Inner Pressable swallows touches so taps inside don't dismiss */}
        <Pressable
          onPress={() => {}}
          accessibilityRole="none"
          style={styles.sheetWrap}
        >
          <GlassSurface
            radius={28}
            tint="sheet"
            shadow="sheet"
            intensity={60}
            contentStyle={styles.sheetContent}
          >
            <View style={styles.handle} />

            <View style={styles.section}>
              <Text variant="h2" weight="extrabold" color="text">
                Una pausa, ahora.
              </Text>
              <View style={{ height: 4 }} />
              <Text variant="bodySm" color="muted">
                Elige el tiempo y desde dónde quieres llegar.
              </Text>
            </View>

            <DurationGrid value={duration} onChange={setDuration} />

            {hobbies.length > 0 ? (
              <HobbyGrid
                hobbies={hobbies}
                selectedKey={selectedHobby?.key ?? topHobbyKey}
                onChange={setHobbyKey}
              />
            ) : null}

            <AIHintCard
              mood={mood?.key ?? null}
              duration={duration}
              hobbyLabel={selectedHobby?.name ?? ""}
            />

            {error ? (
              <Text variant="caption" color="muted">
                {error === "Sin sesión activa"
                  ? error
                  : "No pudimos preparar tu pausa. Intenta de nuevo."}
              </Text>
            ) : null}

            <EmpezarButton
              duration={duration}
              hobbyLabel={selectedHobby?.name ?? ""}
              onPress={handleEmpezar}
              isPending={isPending}
            />
          </GlassSurface>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: glass.scrim.modal,
    justifyContent: "flex-end",
  },
  sheetWrap: {
    // The GlassSurface owns its own background + shadow.
  },
  sheetContent: {
    paddingTop: 14,
    paddingHorizontal: 20,
    paddingBottom: 50,
    rowGap: 18,
  },
  handle: {
    alignSelf: "center",
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.stone[300],
    marginBottom: 4,
  },
  section: {
    // Just groups title + sub
  },
});
