import { View, type ViewProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/**
 * Stack — vertical layout primitive with token-based gap.
 *
 * Children NEVER set their own margin. Spacing between children is the
 * Stack's responsibility. This guarantees consistent rhythm across screens.
 *
 * @example
 *   <Stack gap="md">
 *     <Text>One</Text>
 *     <Text>Two</Text>
 *   </Stack>
 */
const stackStyles = cva("flex-col", {
  variants: {
    gap: {
      none: "gap-0",
      xs:   "gap-xs",
      sm:   "gap-sm",
      md:   "gap-md",
      lg:   "gap-lg",
      xl:   "gap-xl",
      "2xl": "gap-2xl",
      "3xl": "gap-3xl",
    },
    align: {
      start:   "items-start",
      center:  "items-center",
      end:     "items-end",
      stretch: "items-stretch",
    },
    justify: {
      start:   "justify-start",
      center:  "justify-center",
      end:     "justify-end",
      between: "justify-between",
      around:  "justify-around",
    },
    flex: {
      true: "flex-1",
    },
  },
  defaultVariants: {
    gap: "md",
    align: "stretch",
    justify: "start",
  },
});

export type StackProps = VariantProps<typeof stackStyles> &
  Omit<ViewProps, "style"> & {
    children: React.ReactNode;
    className?: string;
  };

export function Stack({
  gap,
  align,
  justify,
  flex,
  className,
  children,
  ...rest
}: StackProps) {
  return (
    <View
      className={cn(stackStyles({ gap, align, justify, flex }), className)}
      {...rest}
    >
      {children}
    </View>
  );
}
