import { Text, View } from "react-native";
import { colors } from "@breeze/design-tokens";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-4xl mb-2">🌬️</Text>
      <Text className="text-3xl font-bold text-primary-600">Breeze</Text>
      <Text className="text-base text-gray-500 mt-2">
        Pausa. Recarga. Vuelve.
      </Text>

      {/* Token import check */}
      <View
        className="mt-8 px-6 py-3 rounded-xl"
        style={{ backgroundColor: colors.primary[600] }}
      >
        <Text className="text-white font-semibold text-sm">
          NativeWind + design-tokens ✓
        </Text>
      </View>
    </View>
  );
}
