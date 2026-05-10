import { Redirect, type Href } from "expo-router";

/**
 * Root entry point — currently redirects to the welcome (login) screen.
 *
 * Once auth is wired (Stage 5+):
 *   if (session) return <Redirect href="/(main)" />;
 *   return <Redirect href="/(auth)/welcome" />;
 */
export default function Index() {
  return <Redirect href={"/(auth)/welcome" as Href} />;
}
