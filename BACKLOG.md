# Breeze — BACKLOG

Generated: 2026-05-03 · Updated: 2026-05-10
Based on: scope workplan + build decisions (Camino B híbrido B2C+B2B)
Total estimado: ~101h | Ship target: 20 junio 2026
Status legend: ○ pending · → in progress · ✓ done · ✗ blocked

---

## ⚡ Next up (pick from here)

1. **M1 S3 Phase 2** — TextInput primitive (~30 min, needed for email/otp screens)
2. **M1 S3 Phase 3** — Refactor email.tsx + otp.tsx using primitives (~45 min, logic from claude/zealous-jones-0b735a)
3. **M1 S3 Phase 4** — Wire welcome → email handoff (~5 min)
4. **M1 S3 remaining** — Apple Sign-In, Google OAuth, Face ID + Keychain (~2h after Email OTP works)

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
| D8 | Husky pre-commit hook | .husky/pre-commit runs lint + ts:check; blocks commit if either fails. Lint-staged for incremental | 0.5h | — | ✓ |
| D9 | Plus Jakarta Sans loading | @expo-google-fonts/plus-jakarta-sans installed, 5 weights loaded in app/_layout.tsx via useFonts(), splash screen waits for fontsLoaded | 0.5h | — | ✓ |
| D10 | CLAUDE.md update with brand rules | Repo CLAUDE.md gets section: "DESIGN SYSTEM RULES (mandatory)" — never hardcode hex, always compose primitives, run ts:check + lint before commit, link to brand brief + token spec | 0.5h | — | ✓ |

**M0.5 ship criteria:** any new screen built from here is **composition only** — primitives + tokens + composition tree. Drift mathematically impossible (TS rejects invalid variants, ESLint rejects hex literals, husky rejects bad commits).

**Deferred / known gaps:**
- breezeFloat animation on hobby icons (decoration drifts gently — saves 30min, looks fine static)
- expo-blur for glass buttons real backdrop blur (using rgba semi-transparent — ~80% of the look)
- Real Storybook web deploy (when 5+ screens exist)
- Chromatic visual regression in CI (when team grows)

---

## ══ MILESTONE 1: Mobile MVP Core — 38h ══

*El core loop. Un empleado de empresa-cliente puede recibir una notificación, hacer una pausa, y volver a trabajar. Shippeable internamente (TestFlight con primera empresa).*

| # | Story | Acceptance criteria | Est. | Actual | Status |
|---|-------|---------------------|------|--------|--------|
| 1 | Monorepo + Expo + NativeWind locked | Repo creado con apps/mobile + packages/, `npx expo start` corre, NativeWind aplica clases sin errors, design-tokens importable | 3h | 1.5h | ✓ |
| 2 | Supabase project + schema + RLS | 3 tablas (companies, profiles, pauses) creadas via migrations versionadas, RLS testeada para los 3 casos (own, company-mate, foreign) | 3h | 1h | ✓ |
| 3 | Auth: Google + Apple + Email OTP + Face ID | 4 métodos funcionan en device real, Face ID guarda token cifrado en Keychain, re-login funciona. **UI: locked vía M0.5 D7. Phase 1: Supabase client + AuthContext adopted (cherry-picked from claude/zealous-jones-0b735a).** Phase 2-4 pending: TextInput primitive, email/otp screens refactored with primitives, welcome→email wire. Apple/Google/Face ID still pending after Email OTP. | 5h | ~9h burned | → |
| 4 | Domain routing Edge Function | Edge Function `domain-router` recibe email → match con companies.domain → retorna `{route: 'onboarding' | 'waitlist' | 'cap_full'}` | 3h | — | ○ |
| 5 | Onboarding quiz: hobbies + contexto + push permission | Quiz tipo personalidad (no formulario), guarda hobbies array + default_context en profile, pide push permission con copy claro | 4h | — | ○ |
| 6 | Profile screen (editable) | Usuario edita hobbies, contexto default, ve streak count, ve trial_ends_at si aplica | 2h | — | ○ |
| 7 | Google Calendar OAuth + token encryption + gap detection | Calendar conecta, refresh token cifrado con pgcrypto en profiles.calendar_token, Edge Function `detect-calendar-gaps` encuentra gaps de 30+ min | 5h | — | ○ |
| 8 | Push notification infra | Token Expo guardado en profile.push_token, Edge Function `send-pause-notification` lista (vacía pero deployada), permission flow OK | 3h | — | ○ |
| 9 | Home screen | Renderiza streak count, última pausa completada, count de pausas hoy, CTA "pausa manual" | 3h | — | ○ |
| 10 | Pause Bottom Sheet + Claude API Edge Function | Edge Function `generate-activity` llama Claude API con prompt {hobbies, context, duration}, retorna `{emoji, title, motivation}`, bottom sheet renderiza | 4h | — | ○ |
| 11 | Pause timer screen + completion flow | Timer 5/10/15 min con countdown visible, completado actualiza pauses.completed_at + status='completed' | 2h | — | ○ |
| 12 | Post-pause feedback screen | "¿Cómo te sentiste?" (3 emoji buttons), guarda en pauses, muestra streak update animado | 1h | — | ○ |

**M1 ship criteria:** development build instalable en TestFlight interno, flujo completo funciona end-to-end con 1 empleado de prueba.

**S3 status note (2026-05-10):** UI shell is locked from M0.5 D7. **Phase 1 complete (2026-05-10):** Supabase client (`apps/mobile/lib/supabase.ts`) + AuthContext provider (`apps/mobile/features/auth/auth-context.tsx`) cherry-picked from abandoned `claude/zealous-jones-0b735a` branch (which iterated 8 commits without shipping). Root layout wraps `<AuthProvider>`. AsyncStorage installed for session persistence. Phase 2-4 plan: TextInput primitive (30min) → refactor email.tsx + otp.tsx (45min) → wire welcome→email (5min). Apple/Google/Face ID after Email OTP works (~2h).

**External prerequisites — confirma ANTES de arrancar cada story (regla pre-flight):**

| Story | Requires |
|-------|----------|
| S3 | Apple Developer account ($99/año, ~24h activación) · Google Cloud OAuth Client (Web + iOS bundle ID) · Apple Sign-In Service ID + Key (.p8) + Team ID + Key ID · Supabase Auth providers configurados (Google + Apple) en dashboard · iOS device físico para Face ID |
| S4 | Ninguna externa (Edge Functions auto-enabled con el proyecto Supabase) |
| S7 | Google Cloud Console: Calendar API habilitada · scope `calendar.readonly` añadido al OAuth client de S3 · cuenta Google con eventos reales para testing de gaps |
| S8 | EAS account (Expo) configurada · APN cert para iOS push (vía EAS, no se necesita Apple Developer extra) |
| S10 | CLAUDE_API_KEY (cuenta Anthropic con billing activo) · key seteada como secret en Supabase Edge Functions |

---

## ══ MILESTONE 1.5: Marketing Web + App Store Compliance — 14h ══

*Landing público + waitlist + Privacy/Terms. Bloqueante para App Store review (URLs públicas obligatorias).*

| # | Story | Acceptance criteria | Est. | Actual | Status |
|---|-------|---------------------|------|--------|--------|
| 13 | Next.js landing scaffolding en monorepo | `apps/web` con Next.js 15 App Router, design-tokens importados, deploy a Vercel funciona, breeze.app domain configurado | 3h | — | ○ |
| 14 | Pages: /, /for-companies, /privacy, /terms, /waitlist | 5 pages live con copy real, /waitlist form escribe a Supabase tabla `waitlist_signups`, agrupado por dominio para outbound | 4h | — | ○ |
| 15 | SEO scaffolding | Meta tags + OG images dinámicas (generateMetadata) + sitemap.xml (next-sitemap) + robots.txt + JSON-LD SoftwareApplication | 2h | — | ○ |
| 16 | App Store Connect + Google Play setup | Apps creadas en ambos stores, 5+ screenshots por device size, ASO copy (title + subtitle + keywords), ATT prompt config, privacy nutrition labels | 3h | — | ○ |
| 17 | TestFlight + Play Internal submission | Build production sube a TestFlight + Internal Testing track, 1 tester invitado prueba flow completo | 2h | — | ○ |

**M1.5 ship criteria:** breeze.app live, app instalable via TestFlight link, App Store review submission ready.

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

[2026-05-10] [M0.5 D8] **Husky pre-commit hook wired.** Root `package.json` adds `husky@9.1.7` + `lint-staged@17.0.3` as devDeps + `prepare` script. `.husky/pre-commit` runs `npx lint-staged` (which calls `npm run lint --workspace=apps/mobile` when `apps/mobile/**/*.{ts,tsx}` is staged) then `npm run ts:check --workspace=apps/mobile`. Implementation note: lint-staged with file-level `eslint` from repo root failed because ESLint v9 flat config walks up from cwd (root has no config) and `import/resolver` can't find apps/mobile's tsconfig for `@/*` aliases. Pragmatic fix: lint-staged delegates to the workspace npm script so eslint runs from `apps/mobile/` cwd. Trade-off: full lint runs even for one staged file, but at <30 source files it's <1s. Revisit if/when web app adds a second workspace.

[2026-05-10] [M0.5 D9] **Plus Jakarta Sans loading.** `@expo-google-fonts/plus-jakarta-sans@0.4.2` (exact, no caret per RN ecosystem rule) installed in `apps/mobile`. `app/_layout.tsx` calls `SplashScreen.preventAutoHideAsync()` before render, loads the 5 weights (400/500/600/700/800) via `useFonts`, hides splash inside an effect once `fontsLoaded`, returns `null` until ready. Bonus binding: `components/Text.tsx` adds a `VARIANT_TO_FONT_FAMILY` map and applies it via inline `style.fontFamily` per variant — without this, RN falls through to System font because expo-google-fonts registers each weight under its own canonical name (e.g. `PlusJakartaSans_500Medium`) and RN can't resolve weight within a single family. Without the binding, D9 would have shipped dead bytes.

[2026-05-10] [M0.5 D10] **Repo CLAUDE.md updated.** New `### Design System Rules (regla #3 — mandatory)` subsection in HARD RULES: forbids hex/rgb/hsl literals (ESLint enforces), mandates composing from `apps/mobile/components/` primitives, requires ts:check + lint before commit (Husky enforces), points at canonical token files + brand brief + token spec, and records the typography binding pattern (5 PJS weights + Text primitive variant→family map). Branching section also reinforced with the M0.5 lesson: "Cada milestone o story significativa abre su propia branch desde main. NUNCA acumular varias stories sobre main directo." With this, M0.5 ship criteria is met — drift is mathematically impossible: TS rejects invalid variants, ESLint rejects hex literals, Husky rejects bad commits.

---

## Estimation notes

- 90h originales + ~9.5h M0.5 actuals + ~1.5h M0.5 pending = **~101h totales**
- M0.5 was unplanned but unavoidable — paying it down once enables ~50% faster screens after Login (composition only, zero re-design)
- Asumiendo trabajo continuo desde 2026-05-10 → ship 20 junio sigue realista
- Buffer real para App Store review delays: **+1 semana** (puede llegar a 28 junio)
- Si pace es 3h/día → ship se mueve a **5 julio**
- Tracking real: actualizar `Actual` column al cerrar cada story para calibrar futuras estimaciones
