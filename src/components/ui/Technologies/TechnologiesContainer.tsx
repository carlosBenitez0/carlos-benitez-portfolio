import { useCallback, useEffect, useRef } from "react";
import { technologies } from "../../../utils/technologies";
import { Technology } from "./Technology";
import { BsBorderStyle } from "react-icons/bs"; //front
import { LuSquareDashedBottomCode } from "react-icons/lu"; //back
import { PiStudent } from "react-icons/pi"; //study
import { VscTools } from "react-icons/vsc"; //tools
import { useIsMobile } from "../../../hooks/useIsMobile";

interface TechnologiesContainerProps {
  title: string;
  technologies: typeof technologies.backend;
}

export const TechnologiesContainer = ({
  title,
  technologies,
}: TechnologiesContainerProps) => {
  const techContainerRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useIsMobile();

  // Efecto de iluminación con mouse
  const handleMouseMove = useCallback((e: MouseEvent, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  }, []);

  useEffect(() => {
    const techContainer = techContainerRef.current;

    // Definimos los manejadores dentro del efecto
    const techContainerHandler = (e: MouseEvent) =>
      techContainer && handleMouseMove(e, techContainer);

    if (techContainer) {
      techContainer.addEventListener("mousemove", techContainerHandler);
    }

    return () => {
      if (techContainer) {
        techContainer.removeEventListener("mousemove", techContainerHandler);
      }
    };
  }, [handleMouseMove]); // Dependencia del callback

  return (
    <div
      ref={techContainerRef}
      className={`${!isMobile ? (title === "tools" ? "col-span-2" : title === "learning" || title === "backend" ? "col-span-1" : "col-span-2") : ""} ${title === "frontend" && !isMobile ? "col-span-2" : ""} border-4 border-white/5 p-4 backdrop-blur-2xl before:pointer-events-none before:absolute before:inset-0 before:z-[-1] before:bg-[radial-gradient(800px_circle_at_var(--mouse-x,100px)_var(--mouse-y,100px),rgba(255,255,255,0.15)_0%,transparent_20%)] before:opacity-0 before:transition-opacity before:duration-300 before:content-[''] hover:before:opacity-[1] ${title === "tools" || title === "backend" ? "technologies-container-right" : "technologies-container-left"}`}
    >
      {title === "frontend" ? (
        <BsBorderStyle className="h-8 w-8 text-cbpviolet-200" />
      ) : title === "backend" ? (
        <LuSquareDashedBottomCode className="h-8 w-8 text-cbpviolet-200" />
      ) : title === "learning" ? (
        <PiStudent className="h-8 w-8 text-cbpviolet-200" />
      ) : (
        <VscTools className="h-8 w-8 text-cbpviolet-200" />
      )}
      <div>
        <h2 className="mb-8 bg-gradient-to-r from-cbpviolet-400 to-cbpviolet-100 bg-clip-text text-center text-2xl text-transparent">
          {title === "tools"
            ? "HERRAMIENTAS"
            : title === "learning"
              ? "FORMÁNDOME"
              : title.toUpperCase()}
        </h2>
      </div>

      <div
        className={`flex flex-wrap gap-8 ${isMobile ? "justify-around" : "justify-center"}`}
      >
        {technologies.map((technology) => {
          return (
            <Technology
              key={technology.name}
              name={technology.name}
              logo={technology.logo}
              url={technology.url}
            />
          );
        })}
      </div>
    </div>
  );
};
