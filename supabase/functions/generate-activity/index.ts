// generate-activity — given the user's current mood, picked duration, hobby,
// and their recent feedback ratings, ask Gemini 2.5 Flash to compose a single
// fun, concrete pause activity. Returns a 4-field JSON object the Picker
// renders into the AI hint card preview and the active-pause screen.
//
// Architecture decisions:
//   • Side-effect-free: we don't write to `pauses` here. The client inserts
//     the pauses row after a successful generation and navigates to it.
//     Reason: a Gemini failure shouldn't leave orphan pause rows.
//   • thinkingBudget: 0 — Flash defaults to ~700 reasoning tokens per call
//     even for trivial creative tasks. Killing it saves latency + (on paid
//     tier) cost. See [2026-05-13][M1 S10a] Build Log entry.
//   • Structured output via responseMimeType + responseSchema — Gemini
//     guarantees the four fields back, no JSON-from-prose parsing fallout.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

const MODEL = "gemini-2.5-flash";

type Mood = "bad" | "ok" | "good" | "great" | null;
type Duration = 5 | 10 | 15;

type RecentFeedback = {
  rating: number;
  duration: number;
};

type RequestBody = {
  mood: Mood;
  duration: Duration;
  hobby: string;
  hobbyLabel: string;
  recentFeedback: RecentFeedback[];
};

type Activity = {
  emoji: string;
  title: string;
  sub: string;
  motivation: string;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }
  if (!GEMINI_API_KEY || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return json({ error: "Server misconfigured" }, 500);
  }

  // Auth — require a valid Supabase user JWT.
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "Unauthorized" }, 401);

  const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const {
    data: { user },
    error: authErr,
  } = await sb.auth.getUser();
  if (authErr || !user) return json({ error: "Unauthorized" }, 401);

  // Validate body.
  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  if (![5, 10, 15].includes(body.duration)) {
    return json({ error: "Invalid duration (must be 5, 10, or 15)" }, 400);
  }
  if (!body.hobby || typeof body.hobby !== "string") {
    return json({ error: "Missing hobby" }, 400);
  }
  if (!body.hobbyLabel || typeof body.hobbyLabel !== "string") {
    return json({ error: "Missing hobbyLabel" }, 400);
  }
  const recent = Array.isArray(body.recentFeedback)
    ? body.recentFeedback.slice(0, 5)
    : [];

  // Build prompt + call Gemini.
  const prompt = buildPrompt(body.mood, body.duration, body.hobbyLabel, recent);

  const geminiUrl =
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const geminiRes = await fetch(geminiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        thinkingConfig: { thinkingBudget: 0 },
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            emoji: { type: "string" },
            title: { type: "string" },
            sub: { type: "string" },
            motivation: { type: "string" },
          },
          required: ["emoji", "title", "sub", "motivation"],
        },
      },
    }),
  });

  if (!geminiRes.ok) {
    const errText = await geminiRes.text();
    console.error("Gemini failed", geminiRes.status, errText);
    return json({ error: "Generation failed", upstream: geminiRes.status }, 502);
  }

  const geminiBody = await geminiRes.json();
  const text: string | undefined =
    geminiBody?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    console.error("Gemini returned no text", JSON.stringify(geminiBody));
    return json({ error: "Empty response from model" }, 502);
  }

  let parsed: Activity;
  try {
    parsed = JSON.parse(text) as Activity;
  } catch {
    console.error("Gemini returned non-JSON despite schema", text);
    return json({ error: "Bad JSON from model" }, 502);
  }

  return json(parsed, 200);
});

function buildPrompt(
  mood: Mood,
  duration: Duration,
  hobbyLabel: string,
  recent: RecentFeedback[],
): string {
  const moodPhrase = {
    bad: "se siente mal hoy",
    ok: "está pasando un día ok",
    good: "se siente bien hoy",
    great: "se siente genial hoy",
  }[mood ?? "ok"] ?? "no ha indicado su mood";

  const feedbackBlock = recent.length === 0
    ? "Sin historial de feedback aún — primera o segunda pausa de esta persona."
    : recent
      .map(
        (f, i) =>
          `Pausa ${i + 1}: rating ${f.rating}/3, ${f.duration} min`,
      )
      .join("\n");

  return `Eres Breeze, un compañero amable que diseña micro-pausas para empleados de tech con muchas horas frente a la pantalla.

Genera UNA actividad de pausa específica, concreta y un poco inesperada — no plantillas genéricas.

Contexto del usuario:
- Hobby elegido para esta pausa: ${hobbyLabel}
- Duración disponible: ${duration} minutos
- Estado emocional: ${moodPhrase}
- Historial reciente de feedback (1=no le gustó, 2=ok, 3=excelente):
${feedbackBlock}

Output JSON (los 4 campos son obligatorios, en español neutro):
- emoji: 1 solo emoji que represente la actividad
- title: máximo 4 palabras, llamativo y específico al hobby (ej. "Acordes lentos en re menor", no "Toca guitarra")
- sub: 1 frase de máximo 12 palabras que diga QUÉ hacer físicamente, paso concreto (ej. "Toma tu guitarra y prueba 3 acordes con la mano izquierda solamente")
- motivation: 1 frase de máximo 15 palabras que conecte con el mood y reconozca el momento, cálido sin caer en clichés ni autoayuda

Reglas:
- Evita absolutamente: "respira profundo", "estírate", "tómate un momento", "sé amable contigo"
- Si el mood es "se siente mal", la actividad debe ser BAJA energía y reconfortante
- Si el mood es "se siente genial", la actividad puede ser más activa o creativa
- Si hay historial con ratings bajos (1), evita repetir el patrón de duración
- Sé concreto al hobby — no actividades genéricas que sirvan para cualquier hobby`;
}
