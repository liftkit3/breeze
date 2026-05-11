import { Pressable, Text as RNText, View } from "react-native";
import { cn } from "../lib/cn";
import { Icon } from "./Icon";
import { Text } from "./Text";

/**
 * TriggerCard — wide horizontal selection card used on the trigger screen.
 *
 * Slots (left → right): emoji • body (title + subtitle) • radio.
 * Selected swaps bg/border + tints the title sage; the radio fills with a
 * white check on top of sage-500.
 *
 * The card itself is the radio's tap target — no separate radio handler.
 */
export type TriggerCardProps = {
  emoji: string;
  title: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
};

export function TriggerCard({
  emoji,
  title,
  subtitle,
  selected,
  onPress,
}: TriggerCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={title}
      className={cn(
        "flex-row items-center rounded-[20px] border-2",
        selected ? "bg-sage-100 border-sage-500" : "bg-white border-stone-200",
      )}
      style={{ paddingVertical: 18, paddingHorizontal: 16, columnGap: 14 }}
    >
      {/* Emoji — sized in RN Text so it matches the spec exactly */}
      <RNText style={{ fontSize: 28 }}>{emoji}</RNText>

      {/* Body — title + subtitle stacked, takes the remaining width */}
      <View className="flex-1">
        <Text
          variant="body"
          weight="bold"
          className={selected ? "text-sage-700" : ""}
        >
          {title}
        </Text>
        <Text variant="bodySm" color="muted" className="mt-0.5">
          {subtitle}
        </Text>
      </View>

      {/* Radio circle */}
      <View
        className={cn(
          "rounded-full border-2 items-center justify-center",
          selected ? "bg-sage-500 border-sage-500" : "border-stone-300",
        )}
        style={{ width: 22, height: 22 }}
      >
        {selected ? <Icon name="check" size={12} color="inverse" /> : null}
      </View>
    </Pressable>
  );
}
