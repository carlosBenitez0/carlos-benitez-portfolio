import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { IoLocationOutline, IoSyncOutline } from "react-icons/io5";
import { PiChalkboardTeacher, PiStudent } from "react-icons/pi";
import { FaRobot } from "react-icons/fa";
import { prefersReducedMotion } from "../../utils/visibility";

const PHOTO =
  "https://res.cloudinary.com/dc69f3e0o/image/upload/v1752513118/320_1x_shots_so_sf9nou.png";

const STACK = ["React", "Next.js", "Python", "FastAPI"];

// Inclinación máxima en grados cuando el puntero está en un borde
const MAX_TILT = 14;

interface HoloPhotoCardProps {
  className?: string;
}

/**
 * Foto de "Sobre mí" como carta coleccionable holográfica: se revela al
 * entrar en pantalla, se inclina en 3D siguiendo el puntero con un brillo
 * tornasol y, al pulsarla, se voltea para mostrar una ficha técnica.
 */
export const HoloPhotoCard = ({ className = "" }: HoloPhotoCardProps) => {
  const [flipped, setFlipped] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const tilt = tiltRef.current;
    if (!scene || !tilt) return;
    // Solo con ratón: en táctil no hay puntero que seguir
    const finePointer = window.matchMedia?.("(pointer: fine)").matches;
    if (!finePointer || prefersReducedMotion()) return;

    const rotateX = gsap.quickTo(tilt, "rotationX", {
      duration: 0.6,
      ease: "power3.out",
    });
    const rotateY = gsap.quickTo(tilt, "rotationY", {
      duration: 0.6,
      ease: "power3.out",
    });

    const onMove = (event: PointerEvent) => {
      // Se mide la escena (que no rota), no la tarjeta inclinada
      const rect = scene.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      rotateY((x - 0.5) * 2 * MAX_TILT);
      rotateX((0.5 - y) * 2 * MAX_TILT);
      scene.style.setProperty("--holo-x", `${(x * 100).toFixed(1)}%`);
      scene.style.setProperty("--holo-y", `${(y * 100).toFixed(1)}%`);
    };
    const onLeave = () => {
      rotateX(0);
      rotateY(0);
    };

    scene.addEventListener("pointermove", onMove);
    scene.addEventListener("pointerleave", onLeave);
    return () => {
      scene.removeEventListener("pointermove", onMove);
      scene.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(tilt);
    };
  }, []);

  return (
    <div className={`holo-float relative ${className}`}>
      <div ref={sceneRef} className="holo-card relative aspect-square w-full">
        <div ref={tiltRef} className="holo-tilt h-full w-full">
          <div
            className={`holo-flipper h-full w-full ${flipped ? "is-flipped" : ""}`}
          >
            {/* Anverso: la foto */}
            <div className="holo-face" aria-hidden={flipped}>
              <img
                src={PHOTO}
                alt="Foto de Carlos Benítez"
                className="holo-develop h-full w-full scale-110 object-cover"
              />
              <span className="holo-sweep" />
              <span className="holo-shine" />
              <span className="holo-glare" />
            </div>

            {/* Reverso: ficha técnica */}
            <div
              className="holo-face holo-face--back flex flex-col p-4 text-left lg:p-5"
              aria-hidden={!flipped}
            >
              <div className="flex items-center justify-between text-[10px] tracking-[0.25em] text-cbpviolet-200/70 uppercase">
                <span>Ficha técnica</span>
                <span className="rounded-full border border-cbpviolet-300/30 px-2 py-0.5 tracking-[0.15em]">
                  Full stack
                </span>
              </div>
              <p className="mt-2 text-xl font-bold text-cbpviolet-100">
                Carlos Benítez
              </p>
              <p className="text-xs text-cbpgray-300">Desarrollador web</p>

              <ul className="mt-3 space-y-1.5 text-[12px] text-cbpgray-200 lg:text-[13px]">
                <li className="flex items-center gap-2">
                  <IoLocationOutline className="shrink-0 text-cbpviolet-300" />
                  El Salvador
                </li>
                <li className="flex items-center gap-2">
                  <PiStudent className="shrink-0 text-cbpviolet-300" />
                  Ing. en Sistemas y Computación
                </li>
                <li className="flex items-center gap-2">
                  <FaRobot className="shrink-0 text-cbpviolet-300" />
                  Desarrollo agéntico
                </li>
                <li className="flex items-center gap-2">
                  <PiChalkboardTeacher className="shrink-0 text-cbpviolet-300" />
                  Tutor de desarrollo web
                </li>
              </ul>

              <div className="mt-auto flex flex-wrap gap-1.5">
                {STACK.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-cbpviolet-300/30 bg-cbpviolet-500/15 px-2 py-0.5 text-[10px] text-cbpviolet-100 lg:text-[11px]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <span className="holo-shine" />
              <span className="holo-glare" />
            </div>
          </div>
        </div>

        {/* Capa pulsable por encima del 3D: voltea la tarjeta */}
        <button
          type="button"
          onClick={() => setFlipped((value) => !value)}
          aria-pressed={flipped}
          aria-label={
            flipped
              ? "Volver a la foto"
              : "Voltear la tarjeta y ver la ficha técnica"
          }
          className="absolute inset-0 z-10 cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cbpviolet-300"
        />
      </div>

      <p
        aria-hidden="true"
        className="holo-hint mt-5 flex items-center justify-center gap-1.5 text-xs text-cbpgray-400"
      >
        <IoSyncOutline
          className={`transition-transform duration-700 ${flipped ? "rotate-180" : ""}`}
        />
        {flipped ? "Toca para volver" : "Toca para voltear"}
      </p>
    </div>
  );
};
