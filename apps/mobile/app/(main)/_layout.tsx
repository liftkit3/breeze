import { View } from "react-native";
import { Stack } from "expo-router";
import { BottomNav } from "@/components/BottomNav";
import { PickerSheet } from "@/features/pause/PickerSheet";

/**
 * (main) layout — wraps every authenticated screen with the persistent
 * floating BottomNav and the global PickerSheet overlay. Both are absolutely
 * positioned / modal; individual screens pad their content so it doesn't
 * slip behind the nav (see BOTTOM_NAV_RESERVED_HEIGHT).
 */
export default function MainLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      <BottomNav />
      <PickerSheet />
    </View>
  );
}
