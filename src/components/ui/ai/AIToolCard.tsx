// Importación de Framer Motion para animaciones
import { motion } from "framer-motion";
// Importación de iconos de react-icons
import { FaCheck } from "react-icons/fa6";

/**
 * Interfaz que define las propiedades que recibe el componente AIToolCard
 *
 * @property {string} nombre - Nombre de la herramienta de IA
 * @property {React.ReactNode} icono - Componente de icono de la herramienta
 * @property {string} descripcion - Descripción breve de la herramienta
 * @property {string[]} beneficios - Lista de beneficios de la herramienta
 * @property {number} [delay=0] - Retraso en milisegundos para la animación
 */
interface AIToolCardProps {
  nombre: string;
  icono: React.ReactNode;
  descripcion: string;
  beneficios: string[];
  delay?: number;
}

/**
 * Componente AIToolCard
 *
 * Muestra una tarjeta con información sobre una herramienta de IA, incluyendo
 * su nombre, descripción y beneficios principales.
 * Incluye animaciones al aparecer y efectos visuales al pasar el mouse.
 */
export const AIToolCard = ({
  nombre,
  icono,
  descripcion,
  beneficios,
  delay = 0, // Valor por defecto para el retraso de la animación
}: AIToolCardProps) => {
  return (
    // Contenedor principal de la tarjeta con animaciones
    <motion.div
      // Configuración de la animación inicial
      initial={{ opacity: 0, y: 20 }}
      // Configuración de la animación cuando el elemento entra en la vista
      whileInView={{ opacity: 1, y: 0 }}
      // La animación solo se ejecuta una vez
      viewport={{ once: true }}
      // Configuración de la transición con retraso personalizado
      transition={{ duration: 0.5, delay: delay / 1000 }}
      // Efecto al pasar el mouse sobre la tarjeta
      whileHover={{
        y: -5,
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        borderColor: "rgba(139, 92, 246, 0.5)",
        transition: {
          duration: 0.2,
          ease: "easeOut",
        },
      }}
      // Clases de Tailwind para el estilo de la tarjeta
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-700 bg-gray-800/80 p-6"
    >
      {/* Efecto de gradiente que aparece al pasar el mouse */}
      <div className="absolute inset-0 bg-gradient-to-br from-cbpviolet-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Contenido de la tarjeta */}
      <div className="relative z-10">
        {/* Encabezado con nombre de la herramienta */}
        <div className="flex items-center gap-3 mb-4">
          {/* Contenedor del icono con efecto hover */}
          <div className="p-2 rounded-lg bg-cbpviolet-900/50 text-cbpviolet-300 group-hover:bg-cbpviolet-800/70 transition-colors">
            {icono}
          </div>
          <h4 className="text-lg font-semibold text-cbpgray-100">{nombre}</h4>
        </div>

        {/* Descripción de la herramienta */}
        <p className="text-cbpgray-300 text-sm mb-4">{descripcion}</p>

        {/* Lista de beneficios (solo si hay beneficios) */}
        {beneficios.length > 0 && (
          <div className="mt-auto">
            <h5 className="text-xs font-medium text-cbpgray-400 mb-2">
              Beneficios:
            </h5>
            <ul className="space-y-1.5">
              {beneficios.map((beneficio, index) => (
                <li
                  key={index}
                  className="flex items-center text-sm text-cbpgray-200"
                >
                  <FaCheck className="w-3.5 h-3.5 mr-2 text-cbpviolet-400 flex-shrink-0" />
                  {beneficio}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};
