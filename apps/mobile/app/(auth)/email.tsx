import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { ScreenFrame } from "@/components/ScreenFrame";
import { Stack } from "@/components/Stack";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { BackBar } from "@/components/BackBar";
import { TextInput } from "@/components/TextInput";
import { useAuth } from "@/features/auth/auth-context";

const EMAIL_PATTERN = /.+@.+\..+/;

export default function EmailScreen() {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isValid = EMAIL_PATTERN.test(email.trim());

  const handleContinue = async () => {
    if (!isValid || submitting) return;
    const trimmed = email.trim().toLowerCase();
    setSubmitting(true);
    try {
      await signInWithEmail(trimmed);
      router.push({ pathname: "/(auth)/otp", params: { email: trimmed } });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No pudimos enviar el código. Intenta de nuevo.";
      Alert.alert("Error", msg);
    } finally {
      setSubmitting(false);
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
            ¿Cuál es tu email?
          </Text>
          <Text variant="body" color="inverse" className="opacity-60">
            Te enviaremos un código de 6 dígitos para entrar.
          </Text>
          <Spacer size="md" />
          <TextInput
            variant="glass-dark"
            leftIcon={<Icon name="mail" color="inverse" />}
            value={email}
            onChangeText={setEmail}
            placeholder="tu@empresa.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            returnKeyType="go"
            onSubmitEditing={handleContinue}
          />
        </Stack>

        <Spacer flex />

        <Stack gap="md">
          <Button
            variant={isValid ? "primary-pill" : "glass-disabled"}
            fullWidth
            loading={submitting}
            onPress={handleContinue}
          >
            Continuar
          </Button>
          <Text variant="caption" color="inverse" align="center" className="opacity-40">
            Te enviaremos un código por correo.
          </Text>
        </Stack>
      </KeyboardAvoidingView>
    </ScreenFrame>
  );
}
