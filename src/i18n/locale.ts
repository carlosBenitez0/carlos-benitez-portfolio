// Idioma de la página: "/" es español y "/en/" inglés. Cada idioma es su
// propio HTML (el build genera en/index.html), así que se decide una sola vez
// al cargar. Sin window (plugin de Vite, tests de node) es español.
export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const localeFromPath = (path: string): Locale =>
  /^\/en(\/|$)/.test(path) ? "en" : "es";

// globalThis: este módulo también compila con el tsconfig del plugin (sin DOM)
const path = (globalThis as { location?: { pathname: string } }).location
  ?.pathname;

export const locale: Locale = path ? localeFromPath(path) : "es";

// Ruta base de cada idioma
export const localePath: Record<Locale, string> = { es: "/", en: "/en/" };
