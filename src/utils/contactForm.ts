// Las reglas puras (validación, saneado, honeypot) viven en contactRules,
// compartidas con el endpoint del servidor. Aquí queda lo del navegador.
export * from "./contactRules";

// Un envío cada 60 s por navegador. Se guarda en localStorage para que una
// recarga no lo reinicie; si el storage no está disponible, no bloquea.
export const COOLDOWN_MS = 60_000;
const LAST_SENT_KEY = "contact:lastSentAt";

export const getCooldownRemaining = (now = Date.now()) => {
  try {
    const lastSent = Number(localStorage.getItem(LAST_SENT_KEY));
    if (!lastSent) return 0;
    return Math.max(0, lastSent + COOLDOWN_MS - now);
  } catch {
    return 0;
  }
};

export const markContactSent = (now = Date.now()) => {
  try {
    localStorage.setItem(LAST_SENT_KEY, String(now));
  } catch {
    // Sin storage (modo privado estricto): el cooldown no persiste.
  }
};
