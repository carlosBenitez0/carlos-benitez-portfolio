import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTechnologies } from "../../../utils/useTechnologies";
import AnimatedGradientText from "../AnimatedGradientText";
import ShinyText from "../ShinyText";
import { TechnologyLabel } from "./TechnologyLabel";
import type { Technology } from "../../../utils/useTechnologies";
import { FaGithub } from "react-icons/fa";
import { useIsMobile } from "../../../hooks/useIsMobile";

interface ProyectCardProps {
  name: string;
  image: string;
  description: string;
  technologies: string[];
  state: string;
  url: string;
  gitHub: string;
}

export const ProyectCard = ({
  name,
  image,
  description,
  technologies,
  state,
  url,
  gitHub,
}: ProyectCardProps) => {
  const technologiesList = useTechnologies();
  const cardTextRef = useRef<HTMLDivElement>(null);
  // const proyectCardRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useIsMobile();

  // Memoizar las tecnologías filtradas para evitar re-renderizados innecesarios
  const technologiesFiltered = useMemo(() => {
    return technologiesList.filter((technology: Technology) =>
      technologies.includes(technology.name),
    );
  }, [technologiesList, technologies]);

  const handleMouseMove = useCallback((e: MouseEvent, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  }, []);

  useEffect(() => {
    const card = cardTextRef.current;

    // Definimos los manejadores dentro del efecto
    const cardHandler = (e: MouseEvent) => card && handleMouseMove(e, card);

    if (card) {
      card.addEventListener("mousemove", cardHandler);
    }

    return () => {
      if (card) {
        card.removeEventListener("mousemove", cardHandler);
      }
    };
  }, [handleMouseMove, cardTextRef]);

  return (
    <div
      // ref={proyectCardRef}
      className={`proyect-card-anim grid-areas-[image_text] relative grid h-full border-cbpbg-400 bg-cbpbg-700 text-center ${isMobile ? "grid-rows-[110px_1fr] rounded-xl border-2" : "grid-rows-[150px_1fr] rounded-2xl rounded-t-2xl border-4"}`}
    >
      {/* after:content-[''] after:absolute after:-inset-2
     after:rounded-2xl after:z-[-1] after:blur-xs after:animate-gradient-rgb after:bg-cbpviolet-300/10 after:bg-[linear-gradient(45deg,#ff0000_0%,#00ff00_17%,#0000ff_33%,#ff00ff_50%,#00ffff_67%,#ffff00_83%,#ff0000_100%)] */}
      {/* linear-gradient(to bottom, rgb(17, 0, 32, 0.2) 0%,  rgba(17, 0, 32, 0.5) 70%, rgba(17, 0, 32, 1) 100%), */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Ver el proyecto ${name} (${state})`}
        className={`grid-area-image relative z-10 bg-center ${isMobile ? "rounded-t-[10px] bg-cover" : "rounded-t-xl bg-[length:100%_150%]"}`}
        style={{
          backgroundImage: `url(${image})`,
        }}
      >
        <span
          className={`absolute z-10 flex items-center justify-center rounded-bl-xl border-cbpbg-400 bg-cbpbg-900 ${isMobile ? "top-[-2px] right-[-2px] border-b-2 border-l-2 px-2 py-1 text-[10px]" : "top-[-4px] right-[-4px] border-b-4 border-l-4 px-3 py-2 text-sm"} before:absolute before:right-0 before:bottom-[-7px] before:h-[7px] before:w-[7px] before:rounded-tr-xl before:bg-transparent before:shadow-[2px_-2px_var(--color-cbpbg-900)] before:content-[''] after:absolute after:top-[0px] after:left-[-7px] after:h-[7px] after:w-[7px] after:rounded-tr-xl after:bg-transparent after:shadow-[2px_-2px_var(--color-cbpbg-900)] after:content-['']`}
        >
          <ShinyText
            text={state}
            disabled={false}
            speed={3}
            color={
              state === "Terminado" ? "var(--state-done)" : "var(--state-wip)"
            }
          />
        </span>
      </a>{" "}
      <div
        ref={cardTextRef}
        className={`grid-area-text relative z-10 flex flex-col rounded-b-xl text-left ${isMobile ? "p-3" : "p-4"} before:pointer-events-none before:absolute before:inset-0 before:rounded-b-xl before:bg-[radial-gradient(800px_circle_at_var(--mouse-x,100px)_var(--mouse-y,100px),var(--hover-glow)_0%,transparent_20%)] before:opacity-0 before:transition-opacity before:duration-300 before:content-[''] hover:before:opacity-[1]`}
      >
        <div
          className={`flex justify-between gap-2 ${isMobile ? "items-start" : "items-center"}`}
        >
          <div className={isMobile ? "line-clamp-2 min-w-0" : ""}>
            <AnimatedGradientText
              colors={[
                "var(--color-cbpviolet-400)",
                "var(--color-cbpviolet-200)",
                "var(--color-cbpviolet-400)",
              ]}
              classNames={
                isMobile
                  ? ["text-base", "font-bold", "leading-tight"]
                  : ["text-xl", "font-bold"]
              }
            >
              {name}
            </AnimatedGradientText>
          </div>
          <a
            href={gitHub}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Código de ${name} en GitHub`}
            className={`fx-trigger flex shrink-0 items-center gap-2 rounded-md border text-cbpgray-200/50 transition-colors hover:border-cbpviolet-300 hover:text-cbpgray-200/80 ${isMobile ? "p-1.5 text-sm" : "p-2"}`}
          >
            <FaGithub className="fx-icon fx-spin" />
          </a>
        </div>

        <p
          className={`mt-2 text-cbpgray-200 ${isMobile ? "line-clamp-3 text-xs leading-snug" : "text-sm"}`}
        >
          {description}
        </p>
        {/* En móvil, solo logos: con 2 columnas no caben las etiquetas */}
        <div
          className={`flex flex-wrap ${isMobile ? "mt-auto gap-1.5 pt-3" : "mt-4 gap-2"}`}
        >
          {technologiesFiltered.map((technology) => (
            <TechnologyLabel
              key={technology.name}
              name={technology.name}
              icon={technology.icon}
              color={technology.color}
              url={technology.url}
              compact={isMobile}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
