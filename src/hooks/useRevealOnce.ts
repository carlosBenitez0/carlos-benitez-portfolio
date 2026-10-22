import { useEffect, useRef, useState } from "react";

// true la primera vez que el elemento entra en pantalla, y se queda así.
// Sustituye al whileInView + viewport.once de framer-motion.
export const useRevealOnce = <T extends Element>() => {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || revealed) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [revealed]);

  return { ref, revealed };
};
