import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
              className="bg-cbpviolet-500 rounded-full cursor-pointer shadow-[0_0_20px_rgba(139,92,246,1)]
                     border-2 border-cbpviolet-500 hover:bg-cbpviolet-600 hover:border-cbpviolet-600 transition-all duration-300
                     flex items-center justify-center"
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
            className="bg-cbpgray-800 rounded-xl shadow-2xl overflow-hidden border-2 border-cbpgray-600"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="p-5 max-w-xs relative">
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 cursor-pointer text-cbpgray-400 hover:text-white transition-colors"
                aria-label="Cerrar"
              >
                <FaTimes />
              </button>

              <div className="flex items-center mb-4">
                <div className="bg-cbpviolet-500/20 py-2 rounded-full mr-3">
                  <FaInfoCircle className="text-cbpviolet-300 text-xl rounded-full shadow-[0_0_20px_rgba(139,92,246,1)]" />
                </div>
                <h3 className="text-lg font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-cbpviolet-300 to-cbpviolet-500">
                  ¡Tecnologías Interactivas!
                </h3>
              </div>

              <p className="text-cbpgray-300 text-sm mb-4 text-center">
                Si desconoces alguna tecnología, puedes hacer clic en ella para
                ver su documentación oficial.
              </p>

              <div className="flex items-center justify-center flex-col text-cbpgray-200 text-sm gap-4">
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
  );
};
