// El tooltip de tecnologías (framer-motion) carga en un chunk aparte. Se
// precarga cuando el navegador queda libre para que aparezca enseguida.
export const loadTechTooltip = () => import("../components/ui/ai/TechTooltip");

export const preloadDeferredComponents = () => {
  const preload = () => void loadTechTooltip();
  if ("requestIdleCallback" in window) {
    const id = requestIdleCallback(preload, { timeout: 2000 });
    return () => cancelIdleCallback(id);
  }
  const timer = setTimeout(preload, 1000);
  return () => clearTimeout(timer);
};
