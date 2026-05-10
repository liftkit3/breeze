import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { AuthProvider } from "@/features/auth/auth-context";
import "../global.css";

// expo-router also calls SplashScreen methods internally on re-mount (e.g.
// after the OAuth deep link returns), and those calls don't have .catch
// wrappers. Filter the specific "No native splash screen registered" error
// at the console.error level so it stops showing in Metro logs. Harmless
// either way — in a real dev build the splash is properly registered.
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  const first = args[0];
  const msg = first instanceof Error ? first.message : String(first ?? "");
  if (msg.includes("No native splash screen registered")) return;
  originalConsoleError.apply(console, args);
};

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
