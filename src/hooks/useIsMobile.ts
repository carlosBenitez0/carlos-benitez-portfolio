import { useSyncExternalStore } from "react";

// Un único MediaQueryList compartido por todos los componentes: solo notifica
// al cruzar el breakpoint (no en cada píxel de resize) y da el valor correcto
// desde el primer render, sin re-renderizar después del montaje.
const mobileQuery =
  typeof window !== "undefined"
    ? window.matchMedia("(max-width: 767px)")
    : null;

const subscribe = (onChange: () => void) => {
  mobileQuery?.addEventListener("change", onChange);
  return () => mobileQuery?.removeEventListener("change", onChange);
};

const getSnapshot = () => mobileQuery?.matches ?? false;

export const useIsMobile = () => {
  //Verificar si la app se abre en mobile
  const isMobile = useSyncExternalStore(subscribe, getSnapshot, () => false);
  return { isMobile };
};
