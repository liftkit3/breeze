import { Pressable, Text as RNText, View } from "react-native";
import { cn } from "../lib/cn";
import { Text } from "./Text";

/**
 * HobbyTile — square-ish (aspectRatio 1.4) tile used in the hobby grid.
 *
 * Three kinds, modelled as a discriminated union so the consumer can't ship
 * an invalid combination (e.g. `selected` on an `add` tile):
 *
 *   "predefined"  the 6 stock hobbies (music / reading / sports / gaming /
 *                 art / meditation). Toggles selection on press; dims (not
 *                 hides) when the 3-cap is reached.
 *   "custom"      a user-added hobby. Always renders selected + × badge.
 *                 Tapping anywhere on the tile *removes* it (destructive —
 *                 there's no off-then-on toggle).
 *   "add"         the trailing "+ Otro" call-to-action that opens the sheet.
 *
 * Emojis are placeholders per spec. When the team ships SVG icons for the
 * remaining hobbies (gaming, custom ✨), swap them in at the same ~32px size.
 */

type BaseProps = {
  className?: string;
};

type PredefinedProps = BaseProps & {
  kind: "predefined";
  emoji: string;
  label: string;
  selected: boolean;
  /** When true, the cap (3 hobbies) is reached and this tile is non-toggleable. */
  dimmed?: boolean;
  onPress: () => void;
};

type CustomProps = BaseProps & {
  kind: "custom";
  emoji: "✨";
  label: string;
  /** Tapping the tile OR the × badge removes it. */
  onRemove: () => void;
};

type AddProps = BaseProps & {
  kind: "add";
  label: string;
  disabled?: boolean;
  onPress: () => void;
};

export type HobbyTileProps = PredefinedProps | CustomProps | AddProps;

const TILE_BASE =
  "rounded-lg p-md flex-col items-start justify-between";

// Emoji renders via plain RNText so we can hit the spec's exact font-size (32)
// without colliding with the Text primitive's variant-bundled size. Emoji
// glyphs don't depend on the Plus Jakarta family — system emoji is rendered.
function TileEmoji({ children }: { children: string }) {
  return <RNText style={{ fontSize: 32 }}>{children}</RNText>;
}

export function HobbyTile(props: HobbyTileProps) {
  if (props.kind === "add") return <AddTile {...props} />;
  if (props.kind === "custom") return <CustomTile {...props} />;
  return <PredefinedTile {...props} />;
}

function PredefinedTile({
  emoji,
  label,
  selected,
  dimmed,
  onPress,
  className,
}: PredefinedProps) {
  const interactionDisabled = dimmed && !selected;

  return (
    <Pressable
      onPress={interactionDisabled ? undefined : onPress}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled: interactionDisabled }}
      accessibilityLabel={label}
      className={cn(
        TILE_BASE,
        "border-2",
        selected ? "bg-sage-100 border-sage-500" : "bg-white border-stone-200",
        interactionDisabled && "opacity-40",
        className,
      )}
      style={{ aspectRatio: 1.4, width: "48%" }}
    >
      <TileEmoji>{emoji}</TileEmoji>
      <Text
        variant="body"
        weight="bold"
        className={selected ? "text-sage-700" : ""}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function CustomTile({ emoji, label, onRemove, className }: CustomProps) {
  return (
    <Pressable
      onPress={onRemove}
      accessibilityRole="button"
      accessibilityLabel={`Quitar ${label}`}
      className={cn(
        TILE_BASE,
        "border-2 bg-sage-100 border-sage-500",
        className,
      )}
      // overflow:visible so the × badge can sit outside the rounded corner
      style={{ aspectRatio: 1.4, width: "48%", overflow: "visible" }}
    >
      <TileEmoji>{emoji}</TileEmoji>
      <Text variant="body" weight="bold" className="text-sage-700">
        {label}
      </Text>

      {/* × badge — 20×20 stone-200 chip, top-right */}
      <View
        pointerEvents="none"
        className="absolute w-5 h-5 rounded-full bg-stone-200 items-center justify-center"
        style={{ top: 8, right: 8 }}
      >
        <Text variant="caption" weight="semibold" className="text-stone-700">
          ×
        </Text>
      </View>
    </Pressable>
  );
}

function AddTile({ label, disabled, onPress, className }: AddProps) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      className={cn(
        TILE_BASE,
        "border-2 border-dashed border-stone-300 bg-transparent",
        disabled && "opacity-40",
        className,
      )}
      style={{ aspectRatio: 1.4, width: "48%" }}
    >
      {/* Empty top spacer so the label baseline aligns with the predefined tiles */}
      <View />
      <Text variant="body" weight="semibold" color="muted">
        {label}
      </Text>
    </Pressable>
  );
}
