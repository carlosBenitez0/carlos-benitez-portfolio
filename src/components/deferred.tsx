import { lazy } from "react";
import { loadTechTooltip } from "../utils/preloadDeferred";

// El tooltip flotante es el único componente con framer-motion (~110 KB):
// carga aparte y, al ser fixed, no mueve el resto de la página.
export const TechTooltip = lazy(() =>
  loadTechTooltip().then((m) => ({ default: m.TechTooltip })),
);
