import { useEffect } from "react";
import { onVisibilityChange } from "../utils/visibility";

// Marca con `data-offscreen` cada bloque `[data-pause-offscreen]` que está
// fuera del viewport; el CSS pausa ahí las animaciones infinitas (brillos,
// gradientes) para que no repinten mientras nadie las ve.
export const usePauseOffscreenAnimations = () => {
  useEffect(() => {
    const blocks = document.querySelectorAll("[data-pause-offscreen]");
    const unsubscribers = Array.from(blocks, (block) =>
      onVisibilityChange(block, (visible) =>
        block.toggleAttribute("data-offscreen", !visible),
      ),
    );
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, []);
};
