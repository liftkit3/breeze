import {
  Alert,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import { router } from "expo-router";
import { glass, palette } from "@breeze/design-tokens";
import { Icon, type IconName, type IconColor } from "./Icon";
import { Text } from "./Text";
import { GlassSurface } from "./GlassSurface";

/**
 * BottomNav — floating glass nav with 4 tab slots + 1 coral FAB in the middle.
 *
 * Mounted inside `(main)/_layout.tsx` so it persists across main routes.
 * The FAB and HomeScreen's hero CTA share a single destination — both kick
 * off the "default mood-adapted pause" (currently routes to the S10 stub).
 *
 * Tabs other than Inicio show a "Próximamente" alert until their stories
 * ship (Biblioteca, Sonidos, Tú are M2/M3 work).
 */

type SlotKey = "home" | "library" | "sounds" | "profile";

type Slot = {
  key: SlotKey;
  label: string;
  icon: IconName;
};

const SLOTS: readonly Slot[] = [
  { key: "home", label: "Inicio", icon: "home" },
  { key: "library", label: "Biblioteca", icon: "library" },
  { key: "sounds", label: "Sonidos", icon: "sounds" },
  { key: "profile", label: "Tú", icon: "profile" },
];

/** Height including FAB halo + nav padding. Screens reserve this much
 *  bottom space so content isn't covered. */
export const BOTTOM_NAV_RESERVED_HEIGHT = 110;

export function BottomNav() {
  // Only "Inicio" is wired today. Active state stays on Inicio since the
  // other tabs alert "Próximamente" instead of routing anywhere.
  const activeKey: SlotKey = "home";

  const onTab = (slot: Slot) => {
    if (slot.key === "home") {
      router.replace("/");
      return;
    }
    Alert.alert(
      "Próximamente",
      `${slot.label} se habilita en una próxima versión de Breeze.`,
    );
  };

  const onFab = () => {
    router.push("/pause-coming-soon");
  };

  return (
    <View pointerEvents="box-none" style={styles.layer}>
      <GlassSurface
        radius={28}
        shadow="nav"
        contentStyle={styles.navContent}
        style={styles.navOuter}
      >
        <View style={styles.row}>
          <Tab
            slot={SLOTS[0]}
            active={activeKey === SLOTS[0].key}
            onPress={() => onTab(SLOTS[0])}
          />
          <Tab
            slot={SLOTS[1]}
            active={activeKey === SLOTS[1].key}
            onPress={() => onTab(SLOTS[1])}
          />
          <View style={styles.fabSlot} />
          <Tab
            slot={SLOTS[2]}
            active={activeKey === SLOTS[2].key}
            onPress={() => onTab(SLOTS[2])}
          />
          <Tab
            slot={SLOTS[3]}
            active={activeKey === SLOTS[3].key}
            onPress={() => onTab(SLOTS[3])}
          />
        </View>
      </GlassSurface>

      <View pointerEvents="box-none" style={styles.fabAnchor}>
        <Fab onPress={onFab} />
      </View>
    </View>
  );
}

function Tab({
  slot,
  active,
  onPress,
}: {
  slot: Slot;
  active: boolean;
  onPress: () => void;
}) {
  const color: IconColor = active ? "text" : "muted";
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={slot.label}
      style={styles.tab}
      hitSlop={6}
    >
      <Icon name={slot.icon} size={22} color={color} />
      <Text variant="caption" weight="semibold" color={active ? "text" : "muted"}>
        {slot.label}
      </Text>
    </Pressable>
  );
}

function Fab({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Empezar pausa ahora"
      hitSlop={8}
    >
      <View style={styles.fabHalo}>
        <View style={styles.fabCircle}>
          <Icon name="pause" size={28} color="inverse" />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 16,
  },
  navOuter: {
    // GlassSurface owns the shadow; we just position.
  },
  navContent: {
    paddingTop: 10,
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  fabSlot: {
    width: 64,
  },
  fabAnchor: {
    position: "absolute",
    top: -30,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  } satisfies ViewStyle,
  fabHalo: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: glass.tint.halo,
    alignItems: "center",
    justifyContent: "center",
  },
  fabCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: palette.coral[500],
    alignItems: "center",
    justifyContent: "center",
    shadowColor: palette.coral[500],
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 10,
  },
});
