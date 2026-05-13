# Breeze — BACKLOG

Generated: 2026-05-03 · Updated: 2026-05-13
Based on: scope workplan + build decisions (Camino B híbrido B2C+B2B)
Total estimado: ~101h | Ship target: 20 junio 2026
Status legend: ○ pending · → in progress · ✓ done · ✗ blocked

---

## ⚡ Next up (pick from here)

Focus: get the manual end-to-end loop working (onboarding → home → pause → activity → feedback) before bolting on push triggers, multi-tenant routing, or compliance polish. Validate that the model is fun first; productionize after.

1. **M1 S10** — Pause Bottom Sheet + Claude API Edge Function (~4h, the "magic" of the product). Replaces the `/pause-coming-soon` stub Home currently routes to.
2. **M1 S11** — Pause timer screen + completion flow (~2h)
3. **M1 S12** — Post-pause feedback screen (~1h)
4. **M1 S8** — Push notification infra (~3h, after manual loop validates)
5. **M1.5 polish bundle** — Apple Sign-In + Resend prod sender + Google consent branding + Domain router (S18-S21, deferred from S3/S4 pending Apple Developer + `breeze.app` purchase)

---

## ══ MILESTONE 0.5: Design System Foundation — 11.5h ══

*Foundation that didn't exist in the original plan. Built after S3 iterated 8 times trying to fix Login visuals — root cause was structural (no tokens enforcement + no primitives), not visual taste. M0.5 builds the design system that makes every screen after Login a composition exercise instead of a re-design exercise.*

| # | Story | Acceptance criteria | Est. | Actual | Status |
|---|-------|---------------------|------|--------|--------|
| D1 | Brand brief + tokens MECE spec | brand-brief.md (7-question vibe input) + tokens.spec.md (full MECE: color/spacing/typography/radius/shadow/motion/z-index/sizing/breakpoints) committed in /Stopit/output | 1h | 1h | ✓ |
| D2 | Tokens canonical source (tokens.js) | packages/design-tokens/tokens.js: 14 color groups (raw palette + semantic), 8pt spacing, full radius/shadow/motion/z-index/sizing/textStyles tokens. tailwindTheme adapter consumed by apps/mobile/tailwind.config.js | 1h | 1h | ✓ |
| D3 | Primitive inventory for Login | primitive-inventory-login.md: 7 primitives MECE (Layout: ScreenFrame/Stack/Spacer · Atomic: Text/Button/Logo/Icon · Domain: TaglineRotator). Composition tree for Welcome documented | 0.5h | 0.5h | ✓ |
| D4 | 8 primitives built with CVA | apps/mobile/components/: Text/Stack/Spacer/Logo/Icon/Button/ScreenFrame/TaglineRotator. Plus icons/AppleIcon/GoogleIcon/MailIcon/HobbyIcons (6 hobby SVGs). lib/cn.ts utility. CVA enforces variant types via TypeScript | 4h | 4h | ✓ |
| D5 | ESLint anti-drift rules | apps/mobile/.eslintrc.js: blocks hex/rgb/hsl literals + scoped overrides for tokens + icon files. `npm run lint` integrated | 0.5h | 0.5h | ✓ |
| D11 | ESLint v9 flat config migration | Replaced legacy .eslintrc.js with eslint.config.js (ESLint v9 dropped support for legacy format). Same rules preserved, exemptions scoped to `**/icons/**`, `Logo.tsx`, `ScreenFrame.tsx` (legitimate gradient rgba). Fixed 2 pre-existing lint errors (unescaped quotes in preview, unused var rule). `npm run lint` now actually enforces (was failing silently since D5) | 0.5h | 0.5h | ✓ |
| D6 | Preview catalog (Storybook-lite) | apps/mobile/app/(preview)/index.tsx: renders all 8 primitives in all variants on device. Defers real Storybook web until 5+ screens (4-6h fricción with NativeWind v4 not worth it for v1) | 1h | 1h | ✓ |
| D7 | Welcome refactor — cosmic-pill | Welcome rebuilt as pure composition. External `breeze-design` skill → cosmic-pill output translated to RN production code: wordmark + 3-tagline rotator + 3 oauth-glass pill buttons + footer disclaimer. Tokens.tagline variant added. Button.oauth-glass variant added. ScreenFrame.dark-hero updated to minimal sage glow + stronger vignette. **Zero hex literals, zero inline styles** | 1.5h | 1.5h | ✓ |
| D8 | Husky pre-commit hook | .husky/pre-commit runs lint + ts:check; blocks commit if either fails. Lint-staged for incremental | 0.5h | 10min | ✓ |
| D9 | Plus Jakarta Sans loading | @expo-google-fonts/plus-jakarta-sans installed, 5 weights loaded in app/_layout.tsx via useFonts(), splash screen waits for fontsLoaded | 0.5h | 10min | ✓ |
| D10 | CLAUDE.md update with brand rules | Repo CLAUDE.md gets section: "DESIGN SYSTEM RULES (mandatory)" — never hardcode hex, always compose primitives, run ts:check + lint before commit, link to brand brief + token spec | 0.5h | 10min | ✓ |

**M0.5 ship criteria:** any new screen built from here is **composition only** — primitives + tokens + composition tree. Drift mathematically impossible (TS rejects invalid variants, ESLint rejects hex literals, husky rejects bad commits).

**Deferred / known gaps:**
- breezeFloat animation on hobby icons (decoration drifts gently — saves 30min, looks fine static)
- expo-blur for glass buttons real backdrop blur (using rgba semi-transparent — ~80% of the look)
- Real Storybook web deploy (when 5+ screens exist)
- Chromatic visual regression in CI (when team grows)

---

## ══ MILESTONE 1: Mobile MVP Core — 35h ══

*El core loop. Un empleado de empresa-cliente puede recibir una notificación, hacer una pausa, y volver a trabajar. Shippeable internamente (TestFlight con primera empresa).*

| # | Story | Acceptance criteria | Est. | Actual | Status |
|---|-------|---------------------|------|--------|--------|
| 1 | Monorepo + Expo + NativeWind locked | Repo creado con apps/mobile + packages/, `npx expo start` corre, NativeWind aplica clases sin errors, design-tokens importable | 3h | 1.5h | ✓ |
| 2 | Supabase project + schema + RLS | 3 tablas (companies, profiles, pauses) creadas via migrations versionadas, RLS testeada para los 3 casos (own, company-mate, foreign) | 3h | 1h | ✓ |
| 3 | Auth: Email OTP + Google OAuth | Email OTP funciona end-to-end (Supabase + Resend SMTP, 6 dígitos, auto-verify a los 400ms, navigate a /verified). Google OAuth funciona end-to-end via `expo-web-browser` + `supabase.auth.signInWithOAuth` (in-app browser, `prompt=select_account`, deep-link `exp://…/--/auth-callback` o `breeze://auth-callback`, sesión persistida en AsyncStorage). Apple + Face ID **deferred a M1.5** (ambos requieren Apple Developer subscription $99/año). | 5h | ~10h | ✓ |
| 5 | Onboarding quiz: hobbies + contexto + push permission | Quiz tipo personalidad (no formulario), guarda hobbies array + default_context en profile, pide push permission con copy claro. **In M1 todos los usuarios van al mismo onboarding** — la diferenciación B2C vs B2B se hace en M1.5 S21 (Domain Router) antes del primer launch real. | 4h | 1h | ✓ |
| 6 | Profile screen (editable) | Usuario edita hobbies, contexto default, ve streak count, ve trial_ends_at si aplica | 2h | — | ○ |
| 7 | Google Calendar OAuth + token encryption + gap detection | Calendar conecta, refresh token cifrado con pgcrypto en profiles.calendar_token, Edge Function `detect-calendar-gaps` encuentra gaps de 30+ min | 5h | — | ○ |
| 8 | Push notification infra | Token Expo guardado en profile.push_token, Edge Function `send-pause-notification` lista (vacía pero deployada), permission flow OK | 3h | — | ○ |
| 9 | Home screen | Pause-first explorer (HOME_FLOW spec): header + StreakChip, MoodCheckIn 4 valence levels (mal/ok/bien/genial) with AsyncStorage + midnight expiry, PauseHero with copy reactive to (mood × top hobby), 3-cell HobbiesGrid, floating glass BottomNav + coral FAB. Hero CTA + FAB share `/pause-coming-soon` stub until S10. YouTube long-pause rail intentionally omitted (no YT API key yet). | 3h | — | ✓ |
| 10 | Pause Bottom Sheet + Claude API Edge Function | Edge Function `generate-activity` llama Claude API con prompt {hobbies, context, duration}, retorna `{emoji, title, motivation}`, bottom sheet renderiza | 4h | — | ○ |
| 11 | Pause timer screen + completion flow | Timer 5/10/15 min con countdown visible, completado actualiza pauses.completed_at + status='completed' | 2h | — | ○ |
| 12 | Post-pause feedback screen | "¿Cómo te sentiste?" (3 emoji buttons), guarda en pauses, muestra streak update animado | 1h | — | ○ |

**M1 ship criteria:** development build instalable en TestFlight interno, flujo completo funciona end-to-end con 1 empleado de prueba.

**S3 closed (2026-05-10):** Email OTP + Google OAuth shipped end-to-end on branch `feat/m1-s3-email-flow` (10 commits, merged via PR #4). Four follow-ups deferred to M1.5 — strategy is "validate the model works manually before adding multi-tenant routing or pre-launch polish":
- **S18** — Apple Sign-In + Face ID + Keychain re-login (needs Apple Developer $99/año subscription).
- **S19** — Resend production sender: currently sandbox-locked to `liftkit3@gmail.com`. Verifying `breeze.app` in Resend + swapping the Supabase SMTP sender unlocks OTP to any recipient.
- **S20** — Google OAuth consent screen: currently shows the supabase.co URL instead of "Breeze". App name + support email are set, but full branding requires App domain + privacy/terms URLs from S14.
- **S21** — Domain Router Edge Function: moved out of M1 to M1.5 (2026-05-10 decision). Without it, every signed-up user lands in the same generic onboarding. We validate the manual loop first (S5 → S9 → S10 → S11 → S12), then before launch we add the B2C/B2B fork.

**External prerequisites — confirma ANTES de arrancar cada story (regla pre-flight):**

| Story | Requires |
|-------|----------|
| S3 (shipped scope) | Google Cloud OAuth Web Client (Authorized redirect: `https://<project>.supabase.co/auth/v1/callback`) · Supabase Google provider habilitado · Resend custom SMTP en Supabase + ambos templates ("Confirm signup" + "Magic Link") con `{{ .Token }}` |
| S7 | Google Cloud Console: Calendar API habilitada · scope `calendar.readonly` añadido al OAuth client de S3 · cuenta Google con eventos reales para testing de gaps |
| S8 | EAS account (Expo) configurada · APN cert para iOS push (vía EAS, no se necesita Apple Developer extra) |
| S10 | CLAUDE_API_KEY (cuenta Anthropic con billing activo) · key seteada como secret en Supabase Edge Functions |

---

## ══ MILESTONE 1.5: Pre-launch infra + marketing + compliance — 20h ══

*Landing público + waitlist + Privacy/Terms + auth/infra completos antes del primer launch real (Apple Sign-In, Resend production sender, Google OAuth consent branding, Domain Router for B2C/B2B fork). Bloqueante para App Store review (URLs públicas obligatorias) y para multi-tenant real.*

| # | Story | Acceptance criteria | Est. | Actual | Status |
|---|-------|---------------------|------|--------|--------|
| 13 | Next.js landing scaffolding en monorepo | `apps/web` con Next.js 15 App Router, design-tokens importados, deploy a Vercel funciona, breeze.app domain configurado | 3h | — | ○ |
| 14 | Pages: /, /for-companies, /privacy, /terms, /waitlist | 5 pages live con copy real, /waitlist form escribe a Supabase tabla `waitlist_signups`, agrupado por dominio para outbound | 4h | — | ○ |
| 15 | SEO scaffolding | Meta tags + OG images dinámicas (generateMetadata) + sitemap.xml (next-sitemap) + robots.txt + JSON-LD SoftwareApplication | 2h | — | ○ |
| 16 | App Store Connect + Google Play setup | Apps creadas en ambos stores, 5+ screenshots por device size, ASO copy (title + subtitle + keywords), ATT prompt config, privacy nutrition labels | 3h | — | ○ |
| 17 | TestFlight + Play Internal submission | Build production sube a TestFlight + Internal Testing track, 1 tester invitado prueba flow completo | 2h | — | ○ |
| 18 | Auth: Apple Sign-In + Face ID re-login | Apple Sign-In via `expo-apple-authentication` + `supabase.auth.signInWithIdToken({provider:'apple'})` funciona en device real. Face ID re-login via `expo-local-authentication` + `expo-secure-store` (refresh token guardado bajo biometric flag). Welcome screen Apple button + Face ID prompt en cold-start si sesión existe. Deferred desde S3 (requiere Apple Developer $99/año). | 2h | — | ○ |
| 19 | Resend production: verify breeze.app domain + swap sender | Resend Dashboard → Domains → add `breeze.app` → DKIM/SPF/DMARC records added at registrar → all green. Supabase SMTP "Sender email" cambiado de `onboarding@resend.dev` (sandbox, solo entrega a `liftkit3@gmail.com`) a `noreply@breeze.app`. OTP emails llegan a cualquier recipient. Deferred from S3 (depends on S13 breeze.app registered). | 0.5h | — | ○ |
| 20 | Google OAuth consent screen: full production branding | OAuth consent screen completo en Google Cloud Console: App domain (`breeze.app`), Application home page, Privacy policy URL (from S14), Terms URL (from S14). Authorized domain `breeze.app` añadido. Branding muestra "Sign in to continue to **Breeze**" (no el supabase.co URL) para usuarios externos no-owner del project. Optional: submit for verification si el app sale del 100-user testing cap. Deferred from S3 (depends on S13 + S14 URLs públicos). | 0.5h | — | ○ |
| 21 | Domain Router Edge Function (B2C/B2B fork) | Edge Function `domain-router` recibe email → match con `companies.domain` → retorna `{ route: 'onboarding' \| 'waitlist' \| 'cap_full' }`. App routea post-verified según la respuesta. Sin esto todos los users entran al mismo onboarding (OK para M1 dev/test, no para launch real con empresas pagantes). Moved from M1 S4 a M1.5 (2026-05-10) — decision: validar primero que el core loop funcione manualmente. | 3h | — | ○ |

**M1.5 ship criteria:** breeze.app live, app instalable via TestFlight link, App Store review submission ready, Apple Sign-In funcional (App Store rule cuando hay Google sign-in), Resend entregando a cualquier recipient (no sandbox), Google consent screen mostrando "Breeze" para todos los usuarios, Domain Router routeando B2C vs B2B correctamente.

---

## ══ MILESTONE 2: Subscription + Mechanics — 25h ══

*Activa el modelo B2C híbrido. Free trial, individual paid, account merge, mecanismos rotativos. Aquí Breeze se vuelve un producto con revenue.*

| # | Story | Acceptance criteria | Est. | Actual | Status |
|---|-------|---------------------|------|--------|--------|
| 18 | RevenueCat setup + product config | Productos creados en App Store Connect ($9.99/mes + $79.99/año) y Play Console, RevenueCat SDK conectado, entitlement 'pro' configurado | 4h | — | ○ |
| 19 | Paywall screen + Restore Purchases | Paywall renderiza con copy compliant (precio, trial, auto-renewal, cancel), "Restore Purchases" button funciona, terms/privacy links visibles | 3h | — | ○ |
| 20 | Free trial 7 días sin tarjeta | Trial countdown visible en home + profile, expiración → paywall hard-gate, no permite continuar sin sub o company plan | 2h | — | ○ |
| 21 | Account merge individual → company | Edge Function `account-merge` detecta dominio post-signup-individual, prompt de merge funciona, RevenueCat cancel + Apple prorrateo | 3h | — | ○ |
| 22 | Pomodoro 90-min trigger fallback | Si no hay calendar conectado o no hay gaps, dispara cada 90 min de tiempo activo de app | 2h | — | ○ |
| 23 | 5 mecanismos rotativos en prompt Claude | 5 variaciones de prompt template (mystery, challenge, micro-skill, reflexión, energía) rotan por día/contexto | 3h | — | ○ |
| 24 | Streak calculation + animations | Cálculo correcto desde tabla pauses (días consecutivos con ≥1 completed), animación al subir streak, "broken streak" empático | 2h | — | ○ |
| 25 | Manual pause flow | Botón "necesito pausa ahora" en home dispara flow completo (bottom sheet → timer → post-pause), trigger_type='manual' en pauses | 2h | — | ○ |
| 26 | Sorpresa mensual mechanic | 1 vez/mes notificación premium con actividad especial (más larga, hobby-deep), trackeada como `surprise_monthly` | 2h | — | ○ |
| 27 | Sentry + PostHog instrumentation | Sentry capturando errors prod, 12 eventos PostHog tracked: signup_started, signup_completed, onboarding_started, onboarding_completed, pause_triggered, pause_started, pause_completed, pause_skipped, paywall_shown, trial_started, subscription_purchased, subscription_canceled | 2h | — | ○ |

**M2 ship criteria:** producto monetizable. Individual puede pagar, company puede activarse, account merge funciona, mecanismos varían.

---

## ══ MILESTONE 3: HR Dashboard + Production Launch — 13h ══

*Dashboard para empresas + lanzamiento producción.*

| # | Story | Acceptance criteria | Est. | Actual | Status |
|---|-------|---------------------|------|--------|--------|
| 28 | Dashboard scaffolding + HR auth | `apps/web/dashboard/*` con Supabase auth scope='hr_admin', RLS filtra por company_id del admin, login funciona | 3h | — | ○ |
| 29 | Métricas core (adopción, top hobbies, WAU) | 3 widgets: % empleados activos últimos 7 días, top 5 hobbies de la empresa, gráfica WAU últimos 30 días, todos filtrados por company | 3h | — | ○ |
| 30 | Reporte mensual automático por email | Edge Function `monthly-hr-report` corre cron primer día del mes, manda PDF/HTML via Resend al hr_admin_email de cada company activa | 3h | — | ○ |
| 31 | Stripe Invoicing flow + activate-company script | Script CLI `scripts/activate-company.ts`: input (name, domain, hr_email, employee_count, plan_status) → crea row companies + manda invitation emails a empleados | 2h | — | ○ |
| 32 | Final App Store production submission | Build production v1.0.0 sube a App Store + Play Store production, app review aprobado, app live públicamente | 2h | — | ○ |

**M3 ship criteria:** Breeze live público. Primera empresa cerrada vía Stripe Invoice. Dashboard HR usable.

---

## Build Log

<!-- /progress logs variations, risks, and decisions here as you build -->
<!-- Format: `[YYYY-MM-DD] [Milestone] [Decision/risk/learning]` -->

[2026-05-03] [M1 S1] npm workspaces chosen (no Yarn/PNPM). NativeWind preset path changed in 4.2.x: use `nativewind/dist/tailwind` (not `/tailwind/native`). react@18.3.2 doesn't exist — pinned to 18.3.1. @types/react-native deprecated (RN ships its own types). `npx expo start` runs clean from apps/mobile.

[2026-05-04] [M1 S2] Local supabase ports bumped +100 (api 54421, db 54422, studio 54423) to coexist with another project's stack on default ports. RLS recursion avoided via `auth_user_company_id()` / `auth_user_role()` SECURITY DEFINER helpers; named around the reserved `current_role` keyword. Schema status enums in the DB (`pauses.status` = pending/started/completed/skipped, `pauses.trigger_type` adds `surprise_monthly`, `subscription_status` adds `company`) drifted from the hand-written unions in `packages/shared-types/index.ts` — no consumers yet, deferred to whichever story first builds a screen that writes those columns. RLS tests live in `supabase/tests/rls.test.sql` and run with `psql -f`.

[2026-05-04] [M1 S2] Remote project `breeze` (ref xkzpehqgbrngkfyxaeju, region us-east-2 Ohio) provisioned in liftkit3@gmail.com. Migrations 0001-0003 pushed clean. Project was created with "Automatically expose new tables" UNCHECKED — that meant DML grants weren't auto-applied to authenticated, so REST returned 401/42501 even with valid RLS. Migration 0003 grants explicit privileges per role (anon: none; authenticated: select/update on companies, select/insert/update on profiles, full DML on pauses). Mobile `.env.local` written at `apps/mobile/.env.local` with EXPO_PUBLIC_SUPABASE_URL + publishable key (new sb_publishable_* format, replaces legacy anon JWT).

[2026-05-04 → 2026-05-09] [M1 S3] **Login redesign iterated 8 commits** trying to fix visual hierarchy and button rendering: Grok-aesthetic dark, prototype.html palette test, fake-door buttons, button bg solid #1F1F1F, +25% white border, +#3A3A3C contrast bump. **Pain identified:** drift across iterations had no enforcement — agent re-interpreted spacing/colors each session. Founder concluded this was structural (no design system + no tokens enforcement), not visual taste. Decision: pause S3 logic, build M0.5 (design system foundation) first.

[2026-05-09 → 2026-05-10] [M0.5 D1-D6] **Design system foundation built end-to-end.** Brand brief: 7-question vibe interview answered → tokens.json generated deterministically (sage primary #6DBF8A + coral accent #FF8474 + warm cream bg #F9F7F2 + warm dark text #2D2A26 + Plus Jakarta Sans). Token spec captures full MECE (color/spacing/typography/radius/shadow/motion/z-index/sizing). 8 primitives built with class-variance-authority — TypeScript locks variant unions, ESLint blocks hex literals at write time. lib/cn.ts utility for class merging. Preview catalog at /(preview) renders every primitive in every variant for visual approval. **Decision: deferred Storybook web** — 4-6h friction with NativeWind v4 + RN-web vs 1h Expo route preview, latter chosen until 5+ screens exist.

[2026-05-10] [M0.5 D7] **Welcome screen refactored to cosmic-pill** using external `breeze-design` Anthropic skill. Skill output (HTML reference + Tweaks panel + tokens) translated to RN production code: wordmark logo at 64px, 3-string rotating tagline (added "Pausa. Recarga. Vuelve."), 3 oauth-glass pill buttons (Google → Apple → email), footer disclaimer "Al continuar aceptas los Términos y la Política de privacidad." Added Text.tagline variant (16/500/0.02em letter-spacing). Added Button.oauth-glass variant (rgba white/10 bg + white/20 border, pill shape). All `oauth-*` Button variants now pill-shaped (rounded-full). ScreenFrame.dark-hero updated to minimal palette (single sage glow centered) with stronger vignette starting at 45%. **Zero hex literals, zero inline styles in welcome.tsx.** TS check + ESLint clean.

[2026-05-10] [M0.5 D7] **Decisions deferred** in cosmic-pill refactor: (1) breezeFloat keyframe animation on hobby icons — looks fine static, saves 30min of Animated API setup. (2) `expo-blur` for true glass backdrop-filter — using rgba semi-transparent (no blur) which is ~80% of the look without new dependency. Both documented as upgrade paths in ScreenFrame.tsx comments.

[2026-05-10] [M1 S3] **UI portion complete via M0.5 D7.** Welcome screen is locked. Auth LOGIC still pending: Apple Sign-In with Supabase provider, Google OAuth flow, Email OTP via Supabase auth.signInWithOtp, Face ID via expo-local-authentication + Keychain via expo-secure-store. Estimated remaining: ~3h of original 5h. Currently TODO comments in welcome.tsx route everything to /(main).

[2026-05-10] [process] **Mistake captured:** all M0.5 work was committed directly on `main` instead of a feature branch. No actual damage (working tree dirty, recoverable). Rule for future: every new milestone or major story starts with `git checkout -b feat/<scope>`. To be added to repo CLAUDE.md in M0.5 D10.

[2026-05-10] [M1 S3 Phase 1] **Cherry-picked auth backend** from abandoned branch `claude/zealous-jones-0b735a`. After diff vs main: that branch had 8 commits, mostly UI iterations on Login that we discarded (M0.5 D7 cosmic-pill is superior). Two backend files were standalone and adoptable as-is: `lib/supabase.ts` (Supabase client w/ AsyncStorage) + `features/auth/auth-context.tsx` (AuthProvider with signInWithEmail OTP, verifyOtp, signOut; signInWithGoogle is a stub). Root `_layout.tsx` wrapped with `<AuthProvider>`. `@react-native-async-storage/async-storage@2.1.2` added to deps. Did NOT adopt: their login.tsx, email.tsx, otp.tsx (UI uses hex literals — to be rewritten with primitives in Phase 3). Branch + worktree subsequently deleted (commit b9d3cbb).

[2026-05-10] [M0.5 D11] **ESLint v9 was failing silently since D5.** D5 created `.eslintrc.js` (legacy format) but ESLint v9 only reads `eslint.config.js` (flat config). `npm run lint` errored with "couldn't find eslint.config" but CI never blocked anything. Migrated to flat config using `eslint-config-expo/flat` baseline. Same anti-drift rules (no hex/rgb/hsl literals) preserved. Scoped exemptions: `**/icons/**` (SVG defaults), `Logo.tsx` (defensive), `ScreenFrame.tsx` (gradient rgba — TODO: tokenize as gradient token to remove this exemption). Fixed 2 pre-existing lint violations (`(preview)/index.tsx` unescaped quotes, `Icon.tsx` unused `_exhaustive` variable rule).

[2026-05-10] [process] **Repo cleanup:** deleted 4 stale local branches (claude/angry-williamson-1bb661, claude/interesting-wescoff-03000e, claude/zealous-jones-0b735a, feature/m1-s1-monorepo-setup), 1 remote branch (origin/claude/interesting-wescoff-03000e), and 2 orphaned worktrees in `.claude/worktrees/`. Only `main` remains. Commits not lost (recoverable via `git reflog` for 30 days if needed).

[2026-05-10] [M1 S2 follow-up] **`.env.local` recovered.** File was originally created in M1 S2 but lost between sessions (gitignored — never on remote, lives in working tree only). Recreated at `apps/mobile/.env.local` with EXPO_PUBLIC_SUPABASE_URL + EXPO_PUBLIC_SUPABASE_ANON_KEY (publishable key, sb_publishable_* format). Recommended: backup the publishable key in a password manager (1Password/Bitwarden) to avoid re-fetching from Supabase dashboard each time the file is lost.

[2026-05-10] [process] **S4 (Domain Router) moved from M1 to M1.5 as S21.** Founder decision: focus M1 on getting the core loop (signup → onboarding → home → pause → activity → feedback) working manually end-to-end before adding the B2C/B2B routing fork. Domain Router becomes pre-launch infra (M1.5) alongside Apple Sign-In, Resend production sender, and Google OAuth consent branding. M1 total estimate down from 38h → 35h. M1.5 up from 14h → 20h (the 6h delta = S18 Apple 2h + S19 Resend 0.5h + S20 Google consent 0.5h + S21 Domain Router 3h). Project total unchanged at ~101h since work is moving across milestones, not added. M1 ship criteria unchanged (TestFlight internal with 1 employee) since in M1 we can manually set `profile.company_id` for the test user. M1.5 ship criteria adds "Domain Router routing B2C vs B2B correctly" before any external launch.

[2026-05-10] [M1 S3] **S3 closed: Email OTP + Google OAuth shipped on `feat/m1-s3-email-flow` (10 commits).** Branch built (1) Email OTP flow: `email.tsx` → `otp.tsx` → `verified.tsx` screens + 3 new primitives (`BackBar`, `TextInput.glass-dark`, `OTPInput`) + 2 Button variants (`primary-pill`, `glass-disabled`) + 2 icons (`chevron-left`, `check`). Real OTP delivery via Resend custom SMTP after fixing two infra footguns: Supabase's "Confirm signup" template was missing `{{ .Token }}` and Resend was in sandbox mode (only delivers to account owner `liftkit3@gmail.com`). (2) Google OAuth via `expo-web-browser` + `supabase.auth.signInWithOAuth`. Three iterations to get the redirect right: bare `exp://192.168.x.x:8081` (Supabase silently rejected → fell back to Site URL = localhost), then with path `/--/auth-callback` (matched). `prompt=select_account` passed through queryParams. **Site URL changed from `http://localhost:3000` to `exp://192.168.40.89:8081/--/auth-callback`** as belt-and-suspenders fallback for dev — needs to change to `breeze://auth-callback` once we move to `expo run:ios` dev build. **Apple Sign-In + Face ID deferred to M1.5 story 18** (Apple Developer $99/año not purchased yet). Login screen wired: Welcome → Email button pushes `/email`, Google button calls `signInWithGoogle()` and replaces to `/verified` on success. (3) Dev-experience patches: filtered the "No native splash screen registered" error at `console.error` level (expo-router fires it on OAuth re-mount in Expo Go; harmless but noisy). Also fixed OTP keyboard not popping on box tap (replaced absolute-positioned opacity-0 input with off-screen `left:-9999` input + per-box `Pressable` that calls `inputRef.current.focus()`).

[2026-05-10] [M0.5 D8] **Husky pre-commit hook wired.** Root `package.json` adds `husky@9.1.7` + `lint-staged@17.0.3` as devDeps + `prepare` script. `.husky/pre-commit` runs `npx lint-staged` (which calls `npm run lint --workspace=apps/mobile` when `apps/mobile/**/*.{ts,tsx}` is staged) then `npm run ts:check --workspace=apps/mobile`. Implementation note: lint-staged with file-level `eslint` from repo root failed because ESLint v9 flat config walks up from cwd (root has no config) and `import/resolver` can't find apps/mobile's tsconfig for `@/*` aliases. Pragmatic fix: lint-staged delegates to the workspace npm script so eslint runs from `apps/mobile/` cwd. Trade-off: full lint runs even for one staged file, but at <30 source files it's <1s. Revisit if/when web app adds a second workspace.

[2026-05-10] [M0.5 D9] **Plus Jakarta Sans loading.** `@expo-google-fonts/plus-jakarta-sans@0.4.2` (exact, no caret per RN ecosystem rule) installed in `apps/mobile`. `app/_layout.tsx` calls `SplashScreen.preventAutoHideAsync()` before render, loads the 5 weights (400/500/600/700/800) via `useFonts`, hides splash inside an effect once `fontsLoaded`, returns `null` until ready. Bonus binding: `components/Text.tsx` adds a `VARIANT_TO_FONT_FAMILY` map and applies it via inline `style.fontFamily` per variant — without this, RN falls through to System font because expo-google-fonts registers each weight under its own canonical name (e.g. `PlusJakartaSans_500Medium`) and RN can't resolve weight within a single family. Without the binding, D9 would have shipped dead bytes.

[2026-05-10] [M0.5 D10] **Repo CLAUDE.md updated.** New `### Design System Rules (regla #3 — mandatory)` subsection in HARD RULES: forbids hex/rgb/hsl literals (ESLint enforces), mandates composing from `apps/mobile/components/` primitives, requires ts:check + lint before commit (Husky enforces), points at canonical token files + brand brief + token spec, and records the typography binding pattern (5 PJS weights + Text primitive variant→family map). Branching section also reinforced with the M0.5 lesson: "Cada milestone o story significativa abre su propia branch desde main. NUNCA acumular varias stories sobre main directo." With this, M0.5 ship criteria is met — drift is mathematically impossible: TS rejects invalid variants, ESLint rejects hex literals, Husky rejects bad commits.

[2026-05-11] [M1 S5] **Onboarding flow shipped** on PR #6 (merged 01:03 UTC, +1367/-55 across 16 files). Three screens between `/(auth)/verified` and `/(main)`: hobbies (predefined + custom via BottomSheet, max 3), trigger (Pomodoro vs Entre reuniones — second reveals GoogleConnectRow), notifications (real `expo-notifications` permission prompt). `OnboardingContext.save()` persists `hobbies[]` + `default_context` to `profiles` on the final step. 5 new components (OnboardingHeader, HobbyTile, TriggerCard, GoogleConnectRow, BottomSheet) + `weight` prop on Text + `secondary-pill` / `neutral-pill` Button variants — every screen is pure primitive composition. Home gains a dismissible honey-100 banner that re-prompts when notification permission was denied/deferred. **Deferred:** Google Calendar OAuth in GoogleConnectRow is a `setTimeout` stub marked `TODO(M1 S7)` — real handshake (Calendar API scope + pgcrypto-encrypted refresh token to `profiles.calendar_token`) lands with S7. `calendarConnected` is captured in onboarding state but not persisted; only the intent (`default_context = "calendar"`) is saved.

[2026-05-13] [M1 S9] **Home screen shipped** on PR #7 (merged 16:29 UTC; 4 commits — initial build + mood collapse + always-show streak + S5 backlog hygiene). +1.7k LOC across 31 files. Pause-first explorer per HOME_FLOW.md spec: Header → MoodCheckIn → PauseHero → HobbiesGrid → BottomNav. **Net-new primitives:** GlassSurface (expo-blur + tint + highlight border + tunable shadow), AmbientGlow (3 soft-tinted blobs outside the scroll), BottomNav (4 tabs + coral FAB, mounted in `(main)/_layout.tsx` so it persists across main routes). 9 new icons (flame, clock, play, arrow-right, pause + 4 nav). `glass` namespace added to `@breeze/design-tokens` (tint/border/shadow alphas) so primitives stay token-pure — ESLint stays strict, no scoped exemption needed. QueryClient wired at root `_layout.tsx`; first real `useQuery` usage via `useHomeData`. `useMood` hook persists selection in AsyncStorage `breeze.mood.today` with local-midnight expiry + runtime key validation. **Device QA decisions:** (1) Mood collapsed from spec's 5 emotion-typed buttons to 4 valence levels (mal · ok · bien · genial) because "cansada" wrapped to two lines on real screens. (2) StreakChip now always renders (spec §5 said hide at 0 días — empty top-right read as a layout bug on first launch). **Deferred / stubbed:** YouTube long-pause rail omitted entirely (needs `YOUTUBE_API_KEY` + `supabase/functions/yt-search/` Edge Function). Hero CTA + FAB both route to `/pause-coming-soon` placeholder screen until M1 S10 ships `generate-activity`. `nextPauseAt` pill hidden when null (S7/S8 territory). Hobby cell meta line is static "Explora" until pauses table grows a `hobby` column or content library lands. Blob blur is approximated via large soft circles (RN has no `filter: blur` for arbitrary views — react-native-skia is the upgrade path).

---

## Estimation notes

- 90h originales + ~9.5h M0.5 actuals + ~1.5h M0.5 pending = **~101h totales**
- M0.5 was unplanned but unavoidable — paying it down once enables ~50% faster screens after Login (composition only, zero re-design)
- Asumiendo trabajo continuo desde 2026-05-10 → ship 20 junio sigue realista
- Buffer real para App Store review delays: **+1 semana** (puede llegar a 28 junio)
- Si pace es 3h/día → ship se mueve a **5 julio**
- Tracking real: actualizar `Actual` column al cerrar cada story para calibrar futuras estimaciones
