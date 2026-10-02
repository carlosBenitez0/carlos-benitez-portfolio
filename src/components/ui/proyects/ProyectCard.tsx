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
      className={`proyect-card-anim relative grid h-full ${isMobile ? "grid-rows-[180px_1fr]" : "grid-rows-[150px_1fr]"} grid-areas-[image_text] rounded-2xl rounded-t-2xl border-4 border-cbpbg-400 bg-cbpbg-700 text-center`}
    >
      {/* after:content-[''] after:absolute after:-inset-2
     after:rounded-2xl after:z-[-1] after:blur-xs after:animate-gradient-rgb after:bg-cbpviolet-300/10 after:bg-[linear-gradient(45deg,#ff0000_0%,#00ff00_17%,#0000ff_33%,#ff00ff_50%,#00ffff_67%,#ffff00_83%,#ff0000_100%)] */}
      {/* linear-gradient(to bottom, rgb(17, 0, 32, 0.2) 0%,  rgba(17, 0, 32, 0.5) 70%, rgba(17, 0, 32, 1) 100%), */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Ver el proyecto ${name} (${state})`}
        className="grid-area-image relative z-10 rounded-t-xl bg-[length:100%_150%] bg-center"
        style={{
          backgroundImage: `url(${image})`,
        }}
      >
        <span className="absolute top-[-4px] right-[-4px] z-10 flex items-center justify-center rounded-bl-xl border-b-4 border-l-4 border-cbpbg-400 bg-cbpbg-900 px-3 py-2 text-sm before:absolute before:right-0 before:bottom-[-7px] before:h-[7px] before:w-[7px] before:rounded-tr-xl before:bg-transparent before:shadow-[2px_-2px_rgba(5,0,16,1)] before:content-[''] after:absolute after:top-[0px] after:left-[-7px] after:h-[7px] after:w-[7px] after:rounded-tr-xl after:bg-transparent after:shadow-[2px_-2px_rgba(5,0,16,1)] after:content-['']">
          <ShinyText
            text={state}
            disabled={false}
            speed={3}
            color={state === "Terminado" ? "#b5f2b5a5" : "#feb555a5"}
          />
        </span>
      </a>{" "}
      <div
        ref={cardTextRef}
        className="grid-area-text relative z-10 rounded-b-xl p-4 text-left before:pointer-events-none before:absolute before:inset-0 before:rounded-b-xl before:bg-[radial-gradient(800px_circle_at_var(--mouse-x,100px)_var(--mouse-y,100px),rgba(255,255,255,0.1)_0%,transparent_20%)] before:opacity-0 before:transition-opacity before:duration-300 before:content-[''] hover:before:opacity-[1]"
      >
        <div className="flex items-center justify-between gap-2">
          <AnimatedGradientText
            colors={["#9d4eddff", "#e0aaffff", "#9d4eddff"]}
            classNames={["text-xl", "font-bold"]}
          >
            {name}
          </AnimatedGradientText>
          <a
            href={gitHub}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Código de ${name} en GitHub`}
            className="flex items-center gap-2 rounded-md border p-2 text-cbpgray-200/50 transition-colors hover:text-cbpgray-200/80"
          >
            <FaGithub />
          </a>
        </div>

        <p className="mt-2 text-sm text-cbpgray-200">{description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {technologiesFiltered.map((technology) => (
            <TechnologyLabel
              key={technology.name}
              name={technology.name}
              icon={technology.icon}
              color={technology.color}
              url={technology.url}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
