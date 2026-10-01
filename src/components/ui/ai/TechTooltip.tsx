import { useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { FaInfoCircle, FaTimes } from "react-icons/fa";
import { TechnologyLabel } from "../proyects/TechnologyLabel";
import { useTechnologies } from "../../../utils/useTechnologies";
import { Technology } from "../Technologies/Technology";
import { technologies as technologiesData } from "../../../utils/technologies";

export const TechTooltip = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const technologies = useTechnologies();

  const handleButtonClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
    setIsVisible(false);
  };

  return (
    // Respeta "reducir movimiento" del sistema (antes lo hacía main.tsx)
    <MotionConfig reducedMotion="user">
      <div
        style={{
          position: "fixed",
          bottom: "32px",
          right: "32px",
          zIndex: 1000,
        }}
      >
        <AnimatePresence>
          {/* Tras cerrar el panel no queda nada: antes el botón seguía ahí,
              invisible pero clicable y enfocable. */}
          {!isExpanded ? (
            isVisible && (
              <motion.button
                onClick={handleButtonClick}
                className="flex cursor-pointer items-center justify-center rounded-full border-2 border-cbpviolet-500 bg-cbpviolet-500 shadow-[0_0_20px_rgba(139,92,246,1)] transition-all duration-300 hover:border-cbpviolet-600 hover:bg-cbpviolet-600"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Mostrar información"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <FaInfoCircle className="text-2xl" />
              </motion.button>
            )
          ) : (
            <motion.div
              className="overflow-hidden rounded-xl border-2 border-cbpgray-600 bg-cbpgray-800 shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="relative max-w-xs p-5">
                <button
                  onClick={handleClose}
                  className="absolute top-3 right-3 cursor-pointer text-cbpgray-400 transition-colors hover:text-white"
                  aria-label="Cerrar"
                >
                  <FaTimes />
                </button>

                <div className="mb-4 flex items-center">
                  <div className="mr-3 rounded-full bg-cbpviolet-500/20 py-2">
                    <FaInfoCircle className="rounded-full text-xl text-cbpviolet-300 shadow-[0_0_20px_rgba(139,92,246,1)]" />
                  </div>
                  <h3 className="bg-gradient-to-r from-cbpviolet-300 to-cbpviolet-400 bg-clip-text text-center text-lg font-semibold text-transparent">
                    ¡Tecnologías Interactivas!
                  </h3>
                </div>

                <p className="mb-4 text-center text-sm text-cbpgray-300">
                  Si desconoces alguna tecnología, puedes hacer clic en ella
                  para ver su documentación oficial.
                </p>

                <div className="flex flex-col items-center justify-center gap-4 text-sm text-cbpgray-200">
                  <span>
                    Ejemplos de tecnologías en las que puedes hacer clic:
                  </span>
                  <div className="flex items-center gap-8">
                    <TechnologyLabel
                      name={technologies[0].name}
                      icon={technologies[0].icon}
                      color={technologies[0].color}
                      url={technologies[0].url}
                      fitContent={true}
                    />
                    <Technology
                      name={technologiesData.frontend[2].name}
                      logo={technologiesData.frontend[2].logo}
                      url={technologiesData.frontend[2].url}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
};
