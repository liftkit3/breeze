import { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import { supabase } from "../../lib/supabase";

// Required so the in-app browser closes cleanly after the OAuth redirect.
WebBrowser.maybeCompleteAuthSession();

type SignInWithGoogleResult = "signed-in" | "canceled";

type AuthContextValue = {
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string) => Promise<void>;
  verifyOtp: (email: string, code: string) => Promise<void>;
  signInWithGoogle: () => Promise<SignInWithGoogleResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (error) throw error;
  };

  const verifyOtp = async (email: string, code: string) => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });
    if (error) throw error;
  };

  const signInWithGoogle = async (): Promise<SignInWithGoogleResult> => {
    // Resolves to `breeze://auth-callback` in dev/standalone builds and to
    // `exp://192.168.x.x:8081/--/auth-callback` in Expo Go. The explicit path
    // matters: Supabase silently rejects custom-scheme URLs without a path,
    // falling back to Site URL. Whichever URL this resolves to at runtime
    // must be in Supabase Dashboard → Auth → URL Configuration → Redirect URLs.
    const redirectTo = makeRedirectUri({ scheme: "breeze", path: "auth-callback" });
    if (__DEV__) console.log("[Breeze auth] OAuth redirect URL:", redirectTo);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: true,
        // Forces Google to show the account picker every time, even when the
        // browser already has an active session. Without this, Google auto-
        // signs the user in with their cached account.
        queryParams: { prompt: "select_account" },
      },
    });
    if (error) throw error;
    if (!data?.url) throw new Error("Supabase no devolvió la URL de OAuth.");

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

    if (result.type === "cancel" || result.type === "dismiss") return "canceled";
    if (result.type !== "success" || !result.url) {
      throw new Error(`Flujo OAuth terminó en estado: ${result.type}`);
    }

    // Supabase returns access + refresh tokens in the URL fragment.
    const fragment = result.url.split("#")[1] ?? "";
    const params = new URLSearchParams(fragment);
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (!access_token || !refresh_token) {
      throw new Error("OAuth no devolvió tokens válidos.");
    }

    const { error: setErr } = await supabase.auth.setSession({ access_token, refresh_token });
    if (setErr) throw setErr;
    return "signed-in";
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{ session, loading, signInWithEmail, verifyOtp, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
