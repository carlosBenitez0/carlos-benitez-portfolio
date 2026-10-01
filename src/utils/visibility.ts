import gsap from "gsap";

type Listener = (visible: boolean) => void;

// Un único IntersectionObserver compartido para toda la página: cada sección
// avisa cuándo entra o sale del viewport (con 200px de margen para que las
// animaciones ya estén corriendo cuando el usuario llega a ellas).
const listeners = new Map<Element, Set<Listener>>();
const lastState = new Map<Element, boolean>();
let observer: IntersectionObserver | null = null;

const getObserver = () => {
  observer ??= new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        lastState.set(entry.target, entry.isIntersecting);
        listeners
          .get(entry.target)
          ?.forEach((listener) => listener(entry.isIntersecting));
      });
    },
    { rootMargin: "200px 0px" },
  );
  return observer;
};

export const onVisibilityChange = (element: Element, listener: Listener) => {
  let set = listeners.get(element);
  if (!set) {
    set = new Set();
    listeners.set(element, set);
    getObserver().observe(element);
  }
  set.add(listener);

  const known = lastState.get(element);
  if (known !== undefined) listener(known);

  return () => {
    set.delete(listener);
    if (set.size === 0) {
      listeners.delete(element);
      lastState.delete(element);
      observer?.unobserve(element);
    }
  };
};

// Pausa los tweens de GSAP de `targets` mientras `container` no se ve.
export const pauseTweensWhileOffscreen = (
  container: Element,
  targets: gsap.TweenTarget,
) =>
  onVisibilityChange(container, (visible) => {
    gsap.getTweensOf(targets).forEach((tween) => tween.paused(!visible));
  });

// Preferencia del sistema "reducir movimiento": sin bucles decorativos.
export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
