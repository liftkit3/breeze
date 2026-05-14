import { Redirect, type Href } from "expo-router";

/**
 * Root entry point.
 *
 * TODO(dev): currently jumps straight to /(main) so reloads skip the
 * auth + onboarding flow during S10 build. Restore the real gate before
 * any preview/TestFlight build:
 *   if (session) return <Redirect href="/(main)" />;
 *   return <Redirect href="/(auth)/welcome" />;
 */
export default function Index() {
  return <Redirect href={"/(main)" as Href} />;
}
