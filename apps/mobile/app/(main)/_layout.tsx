import { View } from "react-native";
import { Stack } from "expo-router";
import { BottomNav } from "@/components/BottomNav";

/**
 * (main) layout — wraps every authenticated screen with the persistent
 * floating BottomNav. The nav is absolutely positioned; individual screens
 * pad their content so it doesn't slip behind it (see BOTTOM_NAV_RESERVED_HEIGHT).
 */
export default function MainLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      <BottomNav />
    </View>
  );
}
