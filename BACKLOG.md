# Breeze — BACKLOG

Generated: 2026-05-03
Based on: scope workplan + build decisions (Camino B híbrido B2C+B2B)
Total estimado: ~90h | Ship target: 20 junio 2026
Status legend: ○ pending · → in progress · ✓ done · ✗ blocked

---

## ══ MILESTONE 1: Mobile MVP Core — 38h ══

*El core loop. Un empleado de empresa-cliente puede recibir una notificación, hacer una pausa, y volver a trabajar. Shippeable internamente (TestFlight con primera empresa).*

| # | Story | Acceptance criteria | Est. | Actual | Status |
|---|-------|---------------------|------|--------|--------|
| 1 | Monorepo + Expo + NativeWind locked | Repo creado con apps/mobile + packages/, `npx expo start` corre, NativeWind aplica clases sin errors, design-tokens importable | 3h | — | ○ |
| 2 | Supabase project + schema + RLS | 3 tablas (companies, profiles, pauses) creadas via migrations versionadas, RLS testeada para los 3 casos (own, company-mate, foreign) | 3h | — | ○ |
| 3 | Auth: Google + Apple + Email OTP + Face ID | 4 métodos funcionan en device real, Face ID guarda token cifrado en Keychain, re-login funciona | 5h | — | ○ |
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

---

## Estimation notes

- 90h totales / ~5h día efectivo = **18 días hábiles**
- Asumiendo trabajo continuo desde 2026-05-04 → ship 20 junio realista
- Buffer real para App Store review delays: **+1 semana** (puede llegar a 28 junio)
- Si pace es 3h/día → ship se mueve a **5 julio**
- Tracking real: actualizar `Actual` column al cerrar cada story para calibrar futuras estimaciones
