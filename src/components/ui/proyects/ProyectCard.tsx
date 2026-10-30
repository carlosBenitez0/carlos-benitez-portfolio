import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTechnologies } from "../../../utils/useTechnologies";
import AnimatedGradientText from "../AnimatedGradientText";
import { TechnologyLabel } from "./TechnologyLabel";
import type { Technology } from "../../../utils/useTechnologies";
import { FaGithub } from "react-icons/fa";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useImagePalette } from "../../../hooks/useImagePalette";
import type { Project, ProjectDate } from "../../../content/site";
import { formatProjectDate } from "../../../utils/projectDate";
import { t } from "../../../i18n/ui";

interface ProyectCardProps {
  name: string;
  image: string;
  description: string;
  technologies: string[];
  state: Project["state"];
  url: string;
  gitHub: string;
  date?: ProjectDate;
}

export const ProyectCard = ({
  name,
  image,
  description,
  technologies,
  state,
  url,
  gitHub,
  date,
}: ProyectCardProps) => {
  const technologiesList = useTechnologies();
  const stateLabel = t.projects.state[state];
  const cardTextRef = useRef<HTMLDivElement>(null);
  // const proyectCardRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useIsMobile();
  const { palette, onLoad: onImageLoad } = useImagePalette(image);

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
      className={`proyect-card-anim project-card grid-areas-[image_text] relative grid h-full grid-rows-[auto_1fr] border-cbpbg-400 bg-cbpbg-700 text-center ${isMobile ? "rounded-xl border-2" : "rounded-2xl border-4"}`}
    >
      {/* Marco: borde con degradado animado en los colores de la captura
          (.project-frame), vidrio esmerilado encima y la captura con sombra */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.projects.open(name, stateLabel)}
        className={`grid-area-image project-frame relative z-10 block ${isMobile ? "m-1.5 rounded-[10px] p-[3px]" : "m-3 rounded-2xl p-[5px]"}`}
        style={
          {
            "--frame-c1": palette[0],
            "--frame-c2": palette[1],
            "--frame-c3": palette[2],
          } as React.CSSProperties
        }
      >
        <span
          className={`project-frame-glass block ${isMobile ? "rounded-[7px] p-1" : "rounded-[11px] p-2"}`}
        >
          <span
            className={`project-frame-shot relative block overflow-hidden ${isMobile ? "rounded-[5px]" : "rounded-lg"}`}
          >
            {/* Decorativa: el enlace ya tiene nombre (aria-label) */}
            <img
              src={image}
              alt=""
              width={800}
              height={500}
              loading="lazy"
              decoding="async"
              onLoad={onImageLoad}
              className="block aspect-[16/10] w-full object-cover object-top"
            />
            <span
              className={`project-state absolute flex items-center gap-1.5 rounded-full font-medium ${isMobile ? "top-1 right-1 px-1.5 py-0.5 text-[9px]" : "top-2 right-2 px-2.5 py-1 text-xs"}`}
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full"
                // --state-done, --state-wip o --state-paused (index.css)
                style={{ backgroundColor: `var(--state-${state})` }}
              />
              {stateLabel}
            </span>
          </span>
        </span>
      </a>
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
          {/* Sin repo público (gitHub vacío) no hay botón */}
          {gitHub && (
            <a
              href={gitHub}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.projects.code(name)}
              className={`fx-trigger flex shrink-0 items-center gap-2 rounded-md border text-cbpgray-200/50 transition-colors hover:border-cbpviolet-300 hover:text-cbpgray-200/80 ${isMobile ? "p-1.5 text-sm" : "p-2"}`}
            >
              <FaGithub className="fx-icon fx-spin" />
            </a>
          )}
        </div>
        {date && (
          <time
            dateTime={date.start}
            className={`mt-1 block text-cbpgray-200/60 ${isMobile ? "text-[10px]" : "text-xs"}`}
          >
            {formatProjectDate(date)}
          </time>
        )}

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
