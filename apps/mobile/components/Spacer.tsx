import { View } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Spacer — explicit gap when a single Stack child needs more space,
 * or when content needs to be pushed apart with `flex`.
 *
 * @example
 *   <Stack flex>
 *     <Header />
 *     <Spacer flex />        // pushes Footer to bottom
 *     <Footer />
 *   </Stack>
 */
const spacerStyles = cva("", {
  variants: {
    size: {
      xs:  "h-xs w-xs",
      sm:  "h-sm w-sm",
      md:  "h-md w-md",
      lg:  "h-lg w-lg",
      xl:  "h-xl w-xl",
      "2xl": "h-2xl w-2xl",
      "3xl": "h-3xl w-3xl",
    },
    flex: {
      true: "flex-1",
    },
  },
});

export type SpacerProps = VariantProps<typeof spacerStyles>;

export function Spacer({ size, flex }: SpacerProps) {
  return <View className={spacerStyles({ size, flex })} />;
}
