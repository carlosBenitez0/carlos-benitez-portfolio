import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

// Misma clave y colores que public/theme-init.js, que fija el tema antes de
// que cargue React.
export const THEME_STORAGE_KEY = "theme";
export const THEME_COLORS: Record<Theme, string> = {
  dark: "#050010",
  light: "#f4effc",
};

const systemLightQuery =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-color-scheme: light)")
    : null;

const listeners = new Set<() => void>();

const readSaved = (): Theme | null => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : null;
  } catch {
    return null;
  }
};

const systemTheme = (): Theme => (systemLightQuery?.matches ? "light" : "dark");

const apply = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
  // Con una preferencia elegida, la barra del navegador sigue al tema y no al
  // sistema.
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((meta) => {
      meta.removeAttribute("media");
      meta.content = THEME_COLORS[theme];
    });
  listeners.forEach((listener) => listener());
};

// Mientras no haya preferencia guardada, el tema sigue al del sistema.
systemLightQuery?.addEventListener("change", () => {
  if (!readSaved()) apply(systemTheme());
});

export const getTheme = (): Theme => {
  if (typeof document === "undefined") return "dark";
  const current = document.documentElement.dataset.theme;
  if (current === "light" || current === "dark") return current;
  return readSaved() ?? systemTheme();
};

export const setTheme = (theme: Theme) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Sin almacenamiento (modo privado estricto): el cambio dura la sesión.
  }
  apply(theme);
};

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
};

export const useTheme = () => {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark");
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  return { theme, setTheme, toggleTheme };
};
