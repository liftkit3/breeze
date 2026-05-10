import { clsx, type ClassValue } from "clsx";

/**
 * Class name utility — merges conditional class strings.
 * Used by all primitives to combine CVA variants with optional className overrides.
 *
 * Note: We use `clsx` only (not `tailwind-merge`) because NativeWind's compiler
 * resolves Tailwind class conflicts at build time, not runtime.
 *
 * Usage:
 *   <View className={cn(buttonStyles({ variant }), props.className)} />
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
