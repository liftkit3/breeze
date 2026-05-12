import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text as RNText,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView, type Edges } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import { palette } from "@breeze/design-tokens";
import { Text } from "@/components/Text";
import { AmbientGlow } from "@/components/AmbientGlow";
import { BOTTOM_NAV_RESERVED_HEIGHT } from "@/components/BottomNav";
import { Header } from "@/features/home/parts/header";
import { MoodCheckIn } from "@/features/home/parts/mood-check-in";
import { PauseHero } from "@/features/home/parts/pause-hero";
import { HobbiesGrid } from "@/features/home/parts/hobbies-grid";
import { useHomeData } from "@/features/home/use-home-data";
import { useMood } from "@/features/home/use-mood";

/**
 * Home — pause-first content explorer (M1 S9).
 *
 * Layered:
 *   SafeArea (paper bg)
 *     └── AmbientGlow (3 fixed blurred-tone blobs behind everything)
 *     └── ScrollView (the content)
 *         └── Header / NotifBanner? / MoodCheckIn / PauseHero / HobbiesGrid
 *
 * NotifBanner additive concern (carried from S5): when arriving with
 * `?notifBanner=1` (denied/skipped notification permission), show a honey
 * nudge with inline "Activar". Hides on grant.
 *
 * Hero CTA + BottomNav FAB share a single destination — the M1 S10 stub at
 * /(main)/pause-coming-soon. Replace when S10 lands.
 */

export default function HomeScreen() {
  const params = useLocalSearchParams<{ notifBanner?: string }>();
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const showBanner = params.notifBanner === "1" && !bannerDismissed;

  const { data, isLoading } = useHomeData();
  const { mood, setMood } = useMood();

  const handleActivate = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === "granted") setBannerDismissed(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No pudimos solicitar permisos.";
      Alert.alert("Error", msg);
    }
  };

  const handleStartPause = () => {
    router.push("/pause-coming-soon");
  };

  const handleEditHobbies = () => {
    Alert.alert(
      "Próximamente",
      "Edición de hobbies se habilita junto con la pantalla de perfil (M1 S6).",
    );
  };

  return (
    <SafeAreaView
      edges={["top"] as Edges}
      style={{ flex: 1, backgroundColor: palette.stone[50] }}
    >
      <View style={{ flex: 1 }}>
        <AmbientGlow />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {isLoading || !data ? (
            <SkeletonHeader />
          ) : (
            <Header
              todayLabel={data.todayLabel}
              firstName={data.firstName}
              streakDays={data.streakDays}
              onStreakPress={() =>
                Alert.alert(
                  "Próximamente",
                  "El detalle de tu racha se habilita en una próxima versión.",
                )
              }
            />
          )}

          {showBanner ? (
            <>
              <View style={{ height: 16 }} />
              <NotifBanner onActivate={handleActivate} />
            </>
          ) : null}

          <View style={{ height: 22 }} />
          <MoodCheckIn selected={mood?.key ?? null} onSelect={setMood} />

          <View style={{ height: 22 }} />
          <PauseHero
            mood={mood?.key ?? null}
            topHobby={data?.hobbies[0]?.key ?? null}
            nextPauseAt={data?.nextPauseAt ?? null}
            onStart={handleStartPause}
          />

          {data && data.hobbies.length > 0 ? (
            <>
              <View style={{ height: 22 }} />
              <HobbiesGrid
                hobbies={data.hobbies}
                onEdit={handleEditHobbies}
                onHobbyPress={() =>
                  Alert.alert(
                    "Próximamente",
                    "El detalle por hobby llega con la biblioteca de pausas.",
                  )
                }
              />
            </>
          ) : null}

          <View style={{ height: BOTTOM_NAV_RESERVED_HEIGHT }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function SkeletonHeader() {
  return (
    <View>
      <View
        style={{
          width: 80,
          height: 12,
          borderRadius: 6,
          backgroundColor: palette.stone[200],
        }}
      />
      <View style={{ height: 8 }} />
      <View
        style={{
          width: 180,
          height: 28,
          borderRadius: 8,
          backgroundColor: palette.stone[200],
        }}
      />
    </View>
  );
}

function NotifBanner({ onActivate }: { onActivate: () => void }) {
  return (
    <View className="bg-honey-100" style={styles.banner}>
      <RNText style={{ fontSize: 18 }}>🔔</RNText>
      <View style={{ flex: 1 }}>
        <Text variant="bodySm" className="text-honey-800">
          Activa las notis para no perderte tu pausa.
        </Text>
      </View>
      <Pressable
        onPress={onActivate}
        accessibilityRole="button"
        accessibilityLabel="Activar notificaciones"
        hitSlop={8}
      >
        <Text variant="bodySm" weight="bold" className="text-honey-800">
          Activar
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
});
