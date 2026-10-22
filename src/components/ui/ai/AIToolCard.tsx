// Importación de iconos de react-icons
import { FaCheck } from "react-icons/fa6";
import { useRevealOnce } from "../../../hooks/useRevealOnce";

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
 *
 * Las animaciones son CSS (antes framer-motion): así la tarjeta se renderiza
 * con la página, sin cargar una librería aparte ni mover el contenido.
 */
export const AIToolCard = ({
  nombre,
  icono,
  descripcion,
  beneficios,
  delay = 0, // Valor por defecto para el retraso de la animación
}: AIToolCardProps) => {
  const { ref, revealed } = useRevealOnce<HTMLDivElement>();

  return (
    // Aparición al entrar en pantalla (una sola vez, con retraso escalonado)
    <div
      ref={ref}
      style={{ transitionDelay: revealed ? `${delay}ms` : "0ms" }}
      className={`h-full transition-[opacity,translate] duration-500 ease-out motion-reduce:translate-y-0 ${revealed ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
    >
      {/* Efecto al pasar el mouse: sube 5px, sombra y borde violeta */}
      <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-700 bg-gray-800/80 p-6 transition-[translate,box-shadow,border-color] duration-200 ease-out hover:-translate-y-[5px] hover:border-[rgba(139,92,246,0.5)] hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] motion-reduce:hover:translate-y-0">
        {/* Efecto de gradiente que aparece al pasar el mouse */}
        <div className="absolute inset-0 bg-gradient-to-br from-cbpviolet-900/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Contenido de la tarjeta */}
        <div className="relative z-10">
          {/* Encabezado con nombre de la herramienta */}
          <div className="mb-4 flex items-center gap-3">
            {/* Contenedor del icono con efecto hover */}
            <div
              aria-hidden="true"
              className="rounded-lg bg-cbpviolet-900/50 p-2 text-cbpviolet-300 transition-colors group-hover:bg-cbpviolet-800/70"
            >
              {icono}
            </div>
            <h4 className="text-lg font-semibold text-cbpgray-100">{nombre}</h4>
          </div>

          {/* Descripción de la herramienta */}
          <p className="mb-4 text-sm text-cbpgray-300">{descripcion}</p>

          {/* Lista de beneficios (solo si hay beneficios) */}
          {beneficios.length > 0 && (
            <div className="mt-auto">
              <h5 className="mb-2 text-xs font-medium text-cbpgray-400">
                Beneficios:
              </h5>
              <ul className="space-y-1.5">
                {beneficios.map((beneficio, index) => (
                  <li
                    key={index}
                    className="flex items-center text-sm text-cbpgray-200"
                  >
                    <FaCheck className="mr-2 h-3.5 w-3.5 flex-shrink-0 text-cbpviolet-400" />
                    {beneficio}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
