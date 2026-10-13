// Rate limit en memoria, sin servicios externos. Vive en la instancia de la
// función: Vercel reutiliza instancias entre peticiones (Fluid compute), así
// que frena ráfagas, pero no es un contador global exacto. El tope absoluto
// de envíos lo da el rate limit configurado en el panel de EmailJS.

export interface LimitResult {
  success: boolean;
  /** Epoch en ms en que se libera el límite */
  reset: number;
}
export type Limiter = (key: string) => LimitResult;

// Ventana deslizante: guarda las marcas de tiempo de cada clave
export const createLimiter = (
  max: number,
  windowMs: number,
  now: () => number = Date.now,
): Limiter => {
  const hits = new Map<string, number[]>();
  let lastSweep = now();

  return (key) => {
    const time = now();
    // Limpieza periódica para que la memoria no crezca con claves viejas
    if (time - lastSweep > windowMs) {
      for (const [k, stamps] of hits) {
        if (stamps[stamps.length - 1] <= time - windowMs) hits.delete(k);
      }
      lastSweep = time;
    }

    const recent = (hits.get(key) ?? []).filter((t) => t > time - windowMs);
    if (recent.length >= max) {
      hits.set(key, recent);
      return { success: false, reset: recent[0] + windowMs };
    }
    recent.push(time);
    hits.set(key, recent);
    return { success: true, reset: recent[0] + windowMs };
  };
};
