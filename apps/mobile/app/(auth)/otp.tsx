import { useEffect, useRef, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenFrame } from "@/components/ScreenFrame";
import { Stack } from "@/components/Stack";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { BackBar } from "@/components/BackBar";
import { OTPInput } from "@/components/OTPInput";
import { useAuth } from "@/features/auth/auth-context";

const RESEND_SECONDS = 30;
const AUTO_VERIFY_DELAY_MS = 400;

export default function OtpScreen() {
  const { verifyOtp, signInWithEmail } = useAuth();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = (params.email ?? "").toString();

  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const autoVerifyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Resend countdown
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  // Cancel pending auto-verify if user navigates away
  useEffect(() => {
    return () => {
      if (autoVerifyTimer.current) clearTimeout(autoVerifyTimer.current);
    };
  }, []);

  const isComplete = code.length === 6;

  const verify = async (codeToVerify: string) => {
    if (submitting || !email) return;
    setSubmitting(true);
    try {
      await verifyOtp(email, codeToVerify);
      router.replace("/(auth)/verified");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Código inválido. Intenta de nuevo.";
      Alert.alert("Error", msg);
      setCode("");
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = (digits: string) => {
    if (autoVerifyTimer.current) clearTimeout(autoVerifyTimer.current);
    autoVerifyTimer.current = setTimeout(() => verify(digits), AUTO_VERIFY_DELAY_MS);
  };

  const handleVerifyPress = () => {
    if (autoVerifyTimer.current) clearTimeout(autoVerifyTimer.current);
    if (isComplete) verify(code);
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || !email) return;
    try {
      await signInWithEmail(email);
      setSecondsLeft(RESEND_SECONDS);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No pudimos reenviar el código.";
      Alert.alert("Error", msg);
    }
  };

  return (
    <ScreenFrame variant="dark-hero">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <BackBar />

        <Spacer flex />

        <Stack gap="md">
          <Text variant="h1" color="inverse">
            Revisa tu correo
          </Text>
          <Text variant="body" color="inverse" className="opacity-60">
            Te enviamos un código de 6 dígitos a
          </Text>
          <Text variant="h3" color="inverse">
            {email}
          </Text>
          <Spacer size="md" />
          <OTPInput onComplete={handleComplete} onChange={setCode} />
          <Spacer size="sm" />
          <Pressable
            onPress={handleResend}
            disabled={secondsLeft > 0}
            accessibilityRole="button"
            accessibilityState={{ disabled: secondsLeft > 0 }}
            className="self-center"
            hitSlop={8}
          >
            {secondsLeft > 0 ? (
              <Text variant="bodySm" color="inverse" align="center" className="opacity-60">
                {`Reenviar código en ${secondsLeft}s`}
              </Text>
            ) : (
              <Text variant="bodySm" color="primary" align="center">
                Reenviar código
              </Text>
            )}
          </Pressable>
        </Stack>

        <Spacer flex />

        <Stack gap="md">
          <Button
            variant={isComplete ? "primary-pill" : "glass-disabled"}
            fullWidth
            loading={submitting}
            onPress={handleVerifyPress}
          >
            Verificar
          </Button>
          <Text variant="caption" color="inverse" align="center" className="opacity-40">
            ¿No lo encuentras? Revisa la carpeta de spam.
          </Text>
        </Stack>
      </KeyboardAvoidingView>
    </ScreenFrame>
  );
}
