/**
 * heroCopy — pure function: (mood, topHobby) → {title, sub, time}.
 *
 * Single source of truth for the Hero card's copy. Lives apart from the
 * component so we can swap variants A/B without touching JSX, and so unit
 * tests (when they exist) can pin behavior.
 *
 * Spec source: HOME_FLOW.md §3.3 mood→hero table + §3.4 hero composition.
 */

export type MoodKey = "low" | "tired" | "ok" | "anxious" | "bright";

export type HeroCopy = {
  title: string;
  sub: string;
  time: string;
};

const BY_MOOD: Record<MoodKey, HeroCopy> = {
  low: {
    title: "Respiración suave",
    sub: "Una caja sencilla: 4-4-4-4. Vuelve más liviana.",
    time: "5 min",
  },
  tired: {
    title: "Sonido sin pantalla",
    sub: "Cierra los ojos. Deja que el oído descanse.",
    time: "5 min",
  },
  ok: {
    title: "Una pausa con energía",
    sub: "Algo breve para volver más despierta.",
    time: "5 min",
  },
  anxious: {
    title: "4-7-8 respiración",
    sub: "Inhala 4. Sostén 7. Exhala 8. Tres rondas.",
    time: "4 min",
  },
  bright: {
    title: "Cuento narrado",
    sub: "Cortázar, antes de volver. Vas a sonreír.",
    time: "8 min",
  },
};

const DEFAULT_COPY: HeroCopy = {
  title: "Una pausa hecha para ti",
  sub: "Cuéntanos cómo llegas y te proponemos algo justo.",
  time: "5 min",
};

const HOBBY_TWEAK_SUB: Record<string, string> = {
  music: "Algo breve con sonido — te lo recomendamos.",
  reading: "Algo corto para leer en pantalla — tres minutos.",
  sports: "Una micro-rutina para soltar el cuerpo.",
  art: "Un gesto creativo — sketch rápido.",
  meditation: "Respiración consciente — tres rondas.",
  gaming: "Un mini-reto mental para resetear.",
};

export function getHeroCopy(
  mood: MoodKey | null,
  topHobby: string | null,
): HeroCopy {
  if (mood) return BY_MOOD[mood];
  if (topHobby && HOBBY_TWEAK_SUB[topHobby]) {
    return { ...DEFAULT_COPY, sub: HOBBY_TWEAK_SUB[topHobby] };
  }
  return DEFAULT_COPY;
}
