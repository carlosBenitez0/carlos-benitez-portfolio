import { FaCheck } from "react-icons/fa6";
import { experience } from "../../../content/site";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { formatProjectDate } from "../../../utils/projectDate";
import { useTechnologies } from "../../../utils/useTechnologies";
import { RichText } from "../RichText";
import { TechnologyLabel } from "../proyects/TechnologyLabel";

// Línea de tiempo vertical: un punto por puesto sobre la línea y, al lado,
// la tarjeta con rol, empresa, fechas, logros y tecnologías.
export const ExperienceTimeline = () => {
  const technologies = useTechnologies();
  const { isMobile } = useIsMobile();

  return (
    <ol className="relative ml-2 border-l-2 border-cbpviolet-500/30">
      {experience.map((job) => (
        <li
          key={`${job.role}-${job.company}`}
          className={`anim-about-text relative pl-6 not-last:mb-8 ${isMobile ? "" : "pl-8"}`}
        >
          <span
            aria-hidden="true"
            className="absolute top-6 -left-[9px] h-4 w-4 rounded-full border-2 border-cbpviolet-400 bg-cbpbg-900 shadow-[0_0_12px_var(--color-cbpviolet-500)]"
          />
          <article
            className={`project-card rounded-2xl border-2 border-cbpbg-400 bg-cbpbg-700 ${isMobile ? "p-4" : "p-6"}`}
          >
            <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-lg font-bold text-cbpviolet-300 light:text-cbpviolet-500">
                {job.role}
              </h3>
              {job.date && (
                <time
                  dateTime={job.date.start}
                  className="text-xs text-cbpgray-200/60"
                >
                  {formatProjectDate(job.date)}
                </time>
              )}
            </header>
            <p className="text-sm font-medium text-cbpgray-300">
              {job.company}
            </p>
            <p className="mt-3 text-sm text-cbpgray-200">{job.summary}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {job.highlights.map((highlight) => (
                <li key={highlight} className="fx-trigger flex items-start">
                  <FaCheck
                    aria-hidden="true"
                    className="fx-icon fx-check mt-1 mr-2 shrink-0 text-cbpviolet-500"
                  />
                  <span>
                    <RichText text={highlight} />
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {technologies
                .filter((technology) =>
                  job.technologies.includes(technology.name),
                )
                .map((technology) => (
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
          </article>
        </li>
      ))}
    </ol>
  );
};
