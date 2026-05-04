# Breeze — Product CLAUDE.md

> Instruction sheet for Claude Code. Read this **completely** before any task.
> Updated: 2026-05-03 | Build philosophy: Balanceado | Ship target: 20 junio 2026

---

## What is Breeze

B2C + B2B mobile app (modelo híbrido tipo Granola) que envía notificaciones misteriosas a empleados de tech para pausas de 5/10/15 min con actividades personalizadas por hobby + contexto, generadas en tiempo real con Claude API.

**JTBD:** Cuando un empleado de tech lleva horas en ritmo frenético, necesita pausar y hacer algo que genuinamente disfruta — para recuperar energía antes de quemarse.

**Revenue model:**
- **Individual:** $9.99/mes via Apple/Google IAP (RevenueCat wrapper, 15% Small Business Program)
- **Company:** $8/empleado/mes anual via Stripe Invoicing (canal CEO directo)
- **Free trial:** 7 días sin tarjeta para individuals

---

## Story completion output (MANDATORY)

After completing every story, output a summary table before any other closing remarks:

| | |
|---|---|
| **What was done** | 1–3 lines, plain language, zero technical jargon. What exists now that didn't before. |
| **Why it matters** | 1–3 lines. How it moves us toward the north star: tech employees pausing, recovering energy, and Breeze earning revenue. |

No exceptions. Even tiny stories get the table.

---

## 🔴 HARD RULES — non-negotiable

These rules apply to EVERY task. If a task conflicts with these, pause and ask the user.

### Branching (regla #1)
- **NUNCA push directo a `main`** después del primer deploy a producción
- Cada feature/fix → nueva branch: `git checkout -b feature/[short-description]`
- Probar en preview (TestFlight + Vercel Preview URL) antes de merge
- Si algo rompe → `git checkout main && git branch -D feature/[name]`. Main nunca vio el código roto.

### Secrets management
- **NUNCA hardcodear API keys** en código
- **NUNCA commitear `.env*` files** (excepto `.env.example` con placeholders)
- Variables: `.env.local` (dev) | EAS Secrets (mobile build) | Vercel env vars (web) | Supabase Dashboard (Edge Functions)
- `SUPABASE_SERVICE_ROLE_KEY` y `CLAUDE_API_KEY` SOLO en Edge Functions, NUNCA en cliente

### Claude API
- App mobile y web **NUNCA** llaman directo a Claude API
- Toda llamada pasa por Edge Function `generate-activity`
- Razón: la key se filtra si va al cliente

### Auth methods (orden estricto)
1. **Continue with Google** — primary, también provee Calendar OAuth
2. **Continue with Apple** — OBLIGATORIO por App Store rules cuando hay Google sign-in
3. **Continue with Email** — OTP de 6 dígitos via Supabase Auth
4. **Face ID / Touch ID** — solo re-login después del primer signup, NO signup inicial
- **NUNCA** implementar password-based auth
- **NUNCA** crear pantalla de "registro" estilo B2B puro — el modelo es híbrido

### Database
- Cambios al schema = **nueva migration file** con número incremental
- **NUNCA** editar una migration ya aplicada en producción
- Test localmente con `supabase db reset` antes de aplicar
- RLS policies obligatorias en TODA tabla con datos de usuario

### NativeWind / Expo versioning
- Versiones **lockedas** en `package.json`. NO auto-update.
- Antes de cambiar versión: validar matriz de compatibilidad en https://www.nativewind.dev/getting-started/expo-router
- Versiones fijas:
  ```
  "expo": "~54.0.0"
  "nativewind": "^4.1.23"
  "tailwindcss": "^3.4.17"
  "react-native-reanimated": "~3.16.0"
  ```

### Subscription rules (Granola-style hybrid)
- **NUNCA** implementar IAP custom — siempre via RevenueCat SDK
- **NUNCA** mostrar paywall sin "Restore Purchases" button visible
- **NUNCA** mezclar Apple IAP con Stripe en el mismo plan: Individual = Apple IAP, Company = Stripe Invoicing, separados
- **NUNCA** borrar subscripciones desde código — solo cancel (audit trail)
- **NUNCA** permitir signup sin email validado (OTP/Google/Apple)

### When in doubt — ASK
- Better 5 min de aclaración que 2h de build wrong
- No asumas. No "future-proof." No premature abstractions.

---

## 🚫 NEVER BUILD (deferred features)

```
- Team challenges / leaderboards          → v2
- Slack/Teams notifications               → v2
- Video coaching / live sessions          → fuera de scope
- Biblioteca pre-armada de actividades    → IA genera en runtime, ese es el diferenciador
- Apple Watch / wearables                 → v3+
- Tablet/iPad optimization                → mobile phone-first
- Web app para empleados                  → solo mobile + dashboard HR
- Offline mode completo                   → solo durante pausa activa
- Social features (share streak, follow)  → v2
- Mood tracking / journaling              → fuera del JTBD
- Meditation/breathing library            → no eres Calm
- Multi-language v1                       → solo ES + EN
- Gamification compleja                   → solo streaks v1
- Email digests / newsletters             → v2
- Calendar write-back                     → solo READ
- Integraciones HRIS                      → v3 enterprise
- Dark mode                               → v2 cuando producto valide
- i18n framework                          → strings hardcodeados español v1
- Admin panel custom                      → tu admin es Supabase Dashboard
- Feature flags propios                   → usar PostHog
- Custom auth                             → solo Supabase Auth
- Otro CSS framework                      → solo NativeWind + Tailwind + shadcn/ui
- State management libs                   → solo React Query + Zustand mínimo
- Testing framework v1                    → manual via preview deploys
- AI chat con usuario                     → no es el JTBD
- Modo familia / multi-usuario por cuenta → v3+
- Notificaciones SMS                      → push es free, SMS cuesta
```

---

## Stack

### Mobile (`apps/mobile`)
- **Framework:** React Native + Expo SDK 54 + Expo Router (file-based routing)
- **Language:** TypeScript strict mode
- **Styles:** NativeWind 4.1+ (importa `design-tokens` de packages)
- **State:** React Query (server state) + Zustand minimal (1 store: current pause session, ~30 lines)
- **Backend client:** `@supabase/supabase-js` directo + Edge Functions para lógica sensible
- **Subscriptions:** RevenueCat React Native SDK
- **Auth re-login:** `expo-local-authentication` (Face ID/Touch ID) + `expo-secure-store`
- **Push:** Expo Push Notifications (free, ilimitado)
- **Crash reporting:** Sentry React Native
- **Analytics:** PostHog React Native SDK

### Web (`apps/web`) — desde M1.5
- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styles:** Tailwind + shadcn/ui (importa `design-tokens`)
- **Hosting:** Vercel (auto-deploy main + previews por branch)
- **Pages M1.5:** `/`, `/for-companies`, `/privacy`, `/terms`, `/waitlist`
- **Pages M3:** `/dashboard/*` (HR admin auth via Supabase)

### Backend (`supabase/`)
- **DB:** Postgres + Row-Level Security en TODA tabla
- **Auth:** Supabase Auth (Google OAuth + Apple OAuth + Email OTP)
- **Edge Functions:** Deno serverless. SOLO lógica sensible o calls a APIs con secrets
- **Storage:** no en MVP (skip hasta que justifique)
- **Migrations:** versionadas en `supabase/migrations/NNNN_description.sql`
- **Encryption:** `pgcrypto` para `profiles.calendar_token`

### Shared (`packages/`)
- `packages/shared-types/` — tipos TS compartidos (Profile, Pause, Company, Activity)
- `packages/design-tokens/` — colors, spacing, type scale (mobile + web consumen)

---

## Repo structure

```
~/breeze/
├── apps/
│   ├── mobile/                   ← Expo app
│   │   ├── app/                  ← Expo Router
│   │   │   ├── (auth)/           ← login, otp, oauth callbacks
│   │   │   ├── (onboarding)/     ← quiz hobbies + context + push permission
│   │   │   ├── (main)/           ← home, profile, pause flow
│   │   │   └── _layout.tsx
│   │   ├── features/             ← lógica por feature
│   │   │   ├── auth/
│   │   │   ├── pause/            ← core del producto
│   │   │   ├── streak/
│   │   │   └── subscription/     ← RevenueCat
│   │   ├── components/           ← UI compartida (Button, BottomSheet, Card)
│   │   ├── lib/                  ← supabase client, posthog, utils
│   │   └── package.json
│   └── web/                      ← Next.js (M1.5: marketing | M3: dashboard)
├── packages/
│   ├── shared-types/
│   └── design-tokens/
├── supabase/
│   ├── migrations/
│   └── functions/
│       ├── domain-router/        ← email → company match
│       ├── generate-activity/    ← Claude API call
│       ├── send-pause-notification/
│       ├── detect-calendar-gaps/
│       ├── account-merge/
│       └── monthly-hr-report/
├── BACKLOG.md                    ← source of truth para qué construir
├── CLAUDE.md                     ← este archivo
└── .claude/skills/progress/      ← /progress skill
```

---

## Patterns

### Component architecture
- **Feature-based folders:** cada feature self-contained (componentes + hooks + logic en `features/[name]/`)
- Si un componente solo se usa en 1 feature → vive ahí. Si se usa en 2+ → sube a `components/`
- Pantallas en `app/` son thin: importan de `features/`

### Data fetching
- **React Query** para todo lo que viene de Supabase
- Cache keys consistentes: `['profile', userId]`, `['pauses', userId, 'today']`, `['streak', userId]`
- Mutations invalidan queries específicas, no toda la cache

### State management
- Server state → React Query
- Local UI (modal abierto, tab activo) → `useState`
- Global UI (current pause session activa) → Zustand, 1 archivo, ~30 líneas

### Naming conventions
- Files: `kebab-case.tsx` (`pause-bottom-sheet.tsx`)
- Components: `PascalCase`
- Functions/hooks: `camelCase` (`usePauseSession`)
- SQL tables: `snake_case` plural (`pauses`, `profiles`)
- Env vars: `SCREAMING_SNAKE_CASE`

### Error handling (3 layers)
1. React Query muestra toast en error de fetch
2. Error Boundary por cada `(group)` de Expo Router → no se cae toda la app
3. Sentry captura errors en producción

### TypeScript
- `strict: true` obligatorio
- Tipos de Supabase **auto-generados**: `npx supabase gen types typescript --local > packages/shared-types/database.ts`
- Re-generar después de cada migration

### Patterns específicos a Breeze
- **Pausa offline-first:** timer corre sin internet, pausa se sincroniza al volver (queue en AsyncStorage)
- **Push noti → deep link:** abre directo `/pause/[id]`, no pasa por home
- **RevenueCat entitlement check:** hook `useEntitlement('pro')` envuelve pantallas premium

---

## App Store / Play Store compliance checklist

🔴 **NINGUNO ES OPCIONAL** antes de submission:

```
□ Privacy Policy URL live (breeze.app/privacy)
□ Terms of Service URL live (breeze.app/terms)
□ Sign in with Apple implementado (obligatorio si hay Google sign-in)
□ App Tracking Transparency prompt (iOS 14.5+)
□ "Restore Purchases" button en /perfil
□ Subscription terms claros: precio, trial 7 días, auto-renewal, cancel
□ "Cancel anytime" copy visible en paywall
□ Screenshots: 5 mínimo por device size
□ App description: hook en primeras 3 líneas
□ Permissions copy claro (calendar, notifications, biometric)
□ Apple Developer account activo ($99/año)
□ Google Play Console activo ($25 una vez)
□ Build production probado en device físico (no simulator)
□ Test subscripción end-to-end con Sandbox account
□ Sentry recibiendo errors de production build
□ PostHog tracking events en production build
□ Universal Links validados (con app + sin app)
□ Backup Supabase verificado (restore funciona)
```

---

## Build order

Trabajar **secuencialmente** por BACKLOG.md:
- M1 → M1.5 → M2 → M3
- Cada story se completa con su acceptance criteria antes de pasar al siguiente
- Marcar status `→` al empezar, `✓` al completar, log de hours actuales

---

## Comandos esenciales

```bash
# Mobile dev
cd apps/mobile && npx expo start

# iOS local (tienes Xcode)
cd apps/mobile && npx expo run:ios

# Web dev
cd apps/web && npm run dev

# Supabase local
supabase start
supabase db reset
supabase db push        # aplica migrations a remote
supabase functions deploy [function-name]

# Generar tipos TS desde schema
supabase gen types typescript --local > packages/shared-types/database.ts

# EAS builds
eas build --profile preview --platform ios
eas build --profile production --platform all
eas update --channel production
```

---

## Respuesta a "¿cómo aseguramos pixel-perfect?"

1. `packages/design-tokens/` es **single source of truth** — colors, spacing, radii, type scale
2. Mobile (NativeWind) y Web (Tailwind) consumen el mismo token file
3. Después del primer build de cada pantalla → **visual QA pass:** screenshot real vs intención del prototipo, lista deltas pixel a pixel, iterar 2-3 rondas
4. Pixel-perfect ocurre en código real, NO en el prototipo HTML

---

## When this file is wrong

Si encuentras una contradicción entre CLAUDE.md y la realidad del codebase:
1. **Pausa la tarea actual**
2. Reporta la contradicción al usuario
3. Espera decisión: actualizar CLAUDE.md o ajustar código
4. NO sigas asumiendo

CLAUDE.md es la verdad. Si está mal, se corrige antes de continuar.
