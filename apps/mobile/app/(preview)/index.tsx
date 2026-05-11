import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Link, type Href } from "expo-router";
import { Stack } from "@/components/Stack";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/Icon";
import { Spacer } from "@/components/Spacer";
import { TaglineRotator } from "@/components/TaglineRotator";
import { TextInput } from "@/components/TextInput";
import { BackBar } from "@/components/BackBar";

/**
 * Preview catalog — renders every primitive in every variant.
 * This IS our Storybook-lite. Visual verification happens here.
 *
 * To approve a primitive: open this screen on the device, eyeball it,
 * confirm it matches the spec, then it's locked.
 */
export default function PreviewCatalog() {
  const [previewEmail, setPreviewEmail] = useState("");
  return (
    <ScrollView className="flex-1 bg-bg" contentContainerClassName="p-lg">
      <Stack gap="2xl">

        <Section title="Logo">
          <Stack gap="md" align="start">
            <Logo size={32} />
            <Logo size={32} withWordmark />
            <View className="bg-bg-inverse p-md rounded-md">
              <Logo size={28} withWordmark light />
            </View>
          </Stack>
        </Section>

        <Section title="Text — variants">
          <Stack gap="sm">
            <Text variant="display">Display 48</Text>
            <Text variant="h1">Heading 1</Text>
            <Text variant="h2">Heading 2</Text>
            <Text variant="h3">Heading 3</Text>
            <Text variant="bodyLg">Body Large 18</Text>
            <Text variant="body">Body 16 default</Text>
            <Text variant="bodySm">Body Small 14</Text>
            <Text variant="caption">Caption 12</Text>
            <Text variant="label">Label uppercase</Text>
          </Stack>
        </Section>

        <Section title="Text — colors">
          <Stack gap="sm">
            <Text variant="body" color="text">Default text color</Text>
            <Text variant="body" color="muted">Muted text color</Text>
            <Text variant="body" color="primary">Primary text color</Text>
            <Text variant="body" color="accent">Accent text color</Text>
            <View className="bg-bg-inverse p-md rounded-md">
              <Text variant="body" color="inverse">Inverse on dark bg</Text>
            </View>
          </Stack>
        </Section>

        <Section title="Button — variants">
          <Stack gap="sm">
            <Button variant="primary" onPress={() => {}}>Primary CTA</Button>
            <Button variant="secondary" onPress={() => {}}>Secondary</Button>
            <View className="bg-bg-inverse p-md rounded-md">
              <Stack gap="sm">
                <Button variant="oauth-light" fullWidth iconLeft={<Icon name="apple" />} onPress={() => {}}>
                  Continúa con Apple
                </Button>
                <Button variant="oauth-light" fullWidth iconLeft={<Icon name="google" />} onPress={() => {}}>
                  Continúa con Google
                </Button>
                <Button variant="oauth-outline" fullWidth iconLeft={<Icon name="mail" color="inverse" />} onPress={() => {}}>
                  Continúa con email
                </Button>
              </Stack>
            </View>
            <Button variant="primary" disabled onPress={() => {}}>Disabled</Button>
          </Stack>
        </Section>

        <Section title="Button — sizes">
          <Stack gap="sm">
            <Button variant="primary" size="sm" onPress={() => {}}>Small</Button>
            <Button variant="primary" size="md" onPress={() => {}}>Medium</Button>
            <Button variant="primary" size="lg" onPress={() => {}}>Large</Button>
            <Button variant="primary" fullWidth onPress={() => {}}>Full Width</Button>
          </Stack>
        </Section>

        <Section title="Icon — sizes">
          <View className="flex-row items-end gap-md">
            <Icon name="apple" size="xs" />
            <Icon name="apple" size="sm" />
            <Icon name="apple" size="md" />
            <Icon name="apple" size="lg" />
            <Icon name="apple" size="xl" />
            <Icon name="apple" size="2xl" />
          </View>
        </Section>

        <Section title="Icon — registry">
          <View className="flex-row flex-wrap gap-md">
            <Icon name="apple" size="lg" />
            <Icon name="google" size="lg" />
            <Icon name="mail" size="lg" />
            <Icon name="guitar" size="lg" />
            <Icon name="book" size="lg" />
            <Icon name="running" size="lg" />
            <Icon name="art" size="lg" />
            <Icon name="meditation" size="lg" />
            <Icon name="writing" size="lg" />
          </View>
        </Section>

        <Section title="Stack — gap variants (md / lg / xl)">
          <View className="bg-bg-muted p-md rounded-sm">
            <Text variant="caption" color="muted" className="mb-sm">gap=&quot;md&quot;</Text>
            <Stack gap="md">
              <View className="h-md bg-primary rounded-xs" />
              <View className="h-md bg-primary rounded-xs" />
              <View className="h-md bg-primary rounded-xs" />
            </Stack>
          </View>
          <Spacer size="md" />
          <View className="bg-bg-muted p-md rounded-sm">
            <Text variant="caption" color="muted" className="mb-sm">gap=&quot;lg&quot;</Text>
            <Stack gap="lg">
              <View className="h-md bg-accent rounded-xs" />
              <View className="h-md bg-accent rounded-xs" />
              <View className="h-md bg-accent rounded-xs" />
            </Stack>
          </View>
        </Section>

        <Section title="TaglineRotator">
          <View className="bg-bg-inverse p-lg rounded-md min-h-[80]">
            <TaglineRotator
              items={[
                "Pausas que recargan, no que distraen.",
                "5 minutos para ti. El resto, después.",
              ]}
              intervalMs={3000}
              textVariant="h3"
              textColor="inverse"
            />
          </View>
        </Section>

        <Section title="Compose: Login (small preview)">
          <View className="bg-bg-inverse p-lg rounded-md">
            <Stack gap="lg" align="center">
              <Logo size={24} withWordmark light />
              <Text variant="bodySm" color="inverse" align="center">
                &ldquo;Tengo tiempo, hice algo que disfruto.&rdquo;
              </Text>
              <Stack gap="sm" className="w-full">
                <Button variant="oauth-light" fullWidth iconLeft={<Icon name="apple" />} onPress={() => {}}>
                  Continúa con Apple
                </Button>
                <Button variant="oauth-outline" fullWidth iconLeft={<Icon name="mail" color="inverse" />} onPress={() => {}}>
                  Continúa con email
                </Button>
              </Stack>
            </Stack>
          </View>
        </Section>

        <Section title="BackBar (on dark)">
          <View className="bg-bg-inverse p-md rounded-md">
            <BackBar onPress={() => {}} />
          </View>
        </Section>

        <Section title="TextInput — glass-dark">
          <View className="bg-bg-inverse p-md rounded-md">
            <TextInput
              variant="glass-dark"
              leftIcon={<Icon name="mail" color="inverse" />}
              value={previewEmail}
              onChangeText={setPreviewEmail}
              placeholder="tu@empresa.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </Section>

        <Section title="Button — auth pills">
          <View className="bg-bg-inverse p-md rounded-md">
            <Stack gap="sm">
              <Button variant="primary-pill" fullWidth onPress={() => {}}>
                Continuar
              </Button>
              <Button variant="glass-disabled" fullWidth onPress={() => {}}>
                Continuar
              </Button>
              <Button variant="primary-pill" fullWidth loading onPress={() => {}}>
                Verificar
              </Button>
            </Stack>
          </View>
        </Section>

        <Section title="Button — onboarding pills (on cream)">
          <Stack gap="sm">
            <Button variant="primary-pill" fullWidth onPress={() => {}}>
              Continuar (3)
            </Button>
            <Button variant="neutral-pill" fullWidth onPress={() => {}}>
              Continuar
            </Button>
            <Button variant="secondary-pill" fullWidth onPress={() => {}}>
              Cancelar
            </Button>
          </Stack>
        </Section>

        <Spacer size="2xl" />

        <Section title="Auth flow — real screens">
          <Stack gap="sm">
            <Link href={"/(auth)/welcome" as Href} asChild>
              <Button variant="primary" fullWidth onPress={() => {}}>
                Welcome (Login) →
              </Button>
            </Link>
            <Link href={"/(auth)/email" as Href} asChild>
              <Button variant="secondary" fullWidth onPress={() => {}}>
                Email →
              </Button>
            </Link>
            <Link href={{ pathname: "/(auth)/otp", params: { email: "tu@empresa.com" } } as Href} asChild>
              <Button variant="secondary" fullWidth onPress={() => {}}>
                OTP →
              </Button>
            </Link>
            <Link href={"/(auth)/verified" as Href} asChild>
              <Button variant="secondary" fullWidth onPress={() => {}}>
                Verified →
              </Button>
            </Link>
          </Stack>
        </Section>

        <Section title="Onboarding flow — real screens">
          <Stack gap="sm">
            <Link href={"/(onboarding)/hobbies" as Href} asChild>
              <Button variant="primary" fullWidth onPress={() => {}}>
                Step 1 — Hobbies →
              </Button>
            </Link>
            <Link href={"/(onboarding)/trigger" as Href} asChild>
              <Button variant="secondary" fullWidth onPress={() => {}}>
                Step 2 — Trigger →
              </Button>
            </Link>
            <Link href={"/(onboarding)/notifications" as Href} asChild>
              <Button variant="secondary" fullWidth onPress={() => {}}>
                Step 3 — Notifications →
              </Button>
            </Link>
            <Link href={{ pathname: "/(main)", params: { notifBanner: "1" } } as Href} asChild>
              <Button variant="secondary" fullWidth onPress={() => {}}>
                Home with banner →
              </Button>
            </Link>
          </Stack>
        </Section>

      </Stack>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View>
      <Text variant="label" color="muted" className="mb-md">{title}</Text>
      {children}
    </View>
  );
}
