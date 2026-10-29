import { useEffect, useRef } from "react";
import { FaCheck, FaGithub } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import type { CaseStudy } from "../../../content/site";
import { useTechnologies } from "../../../utils/useTechnologies";
import { RichText } from "../RichText";
import { TechnologyLabel } from "../proyects/TechnologyLabel";

interface CaseStudyDialogProps {
  caseStudy: CaseStudy | null;
  onClose: () => void;
}

const BulletList = ({ title, items }: { title: string; items: string[] }) =>
  items.length > 0 && (
    <section className="mt-6">
      <h3 className="mb-3 font-semibold text-cbpviolet-300 light:text-cbpviolet-500">
        {title}
      </h3>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item} className="flex items-start">
            <FaCheck
              aria-hidden="true"
              className="mt-1 mr-2 shrink-0 text-cbpviolet-500"
            />
            <span>
              <RichText text={item} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );

// Caso completo en un <dialog> nativo: showModal() atrapa el foco, Esc lo
// cierra y el resto de la página queda inerte.
export const CaseStudyDialog = ({
  caseStudy,
  onClose,
}: CaseStudyDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const technologies = useTechnologies();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (caseStudy && !dialog.open) dialog.showModal();
    if (!caseStudy && dialog.open) dialog.close();
  }, [caseStudy]);

  const titleId = caseStudy ? `caso-${caseStudy.slug}-titulo` : undefined;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      // Clic en el fondo (fuera de la caja) también cierra
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      className="m-auto max-h-[85vh] w-[min(42rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-2xl border-2 border-cbpbg-400 bg-cbpbg-800 p-0 text-ink shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm light:bg-white"
    >
      {caseStudy && (
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <h2
              id={titleId}
              className="text-2xl font-bold text-cbpviolet-300 light:text-cbpviolet-500"
            >
              {caseStudy.title}
            </h2>
            <button
              type="button"
              aria-label="Cerrar"
              onClick={() => dialogRef.current?.close()}
              className="shrink-0 cursor-pointer rounded-md border border-cbpbg-400 p-1.5 text-xl text-cbpgray-200 transition-colors hover:border-cbpviolet-300 hover:text-ink focus-visible:outline-2 focus-visible:outline-cbpviolet-400"
            >
              <IoClose aria-hidden="true" />
            </button>
          </div>
          <p className="mt-1 text-sm font-medium text-cbpgray-300">
            {caseStudy.role}
          </p>
          <p className="mt-4 text-sm text-cbpgray-200">{caseStudy.context}</p>

          <section className="mt-6">
            <h3 className="mb-2 font-semibold text-cbpviolet-300 light:text-cbpviolet-500">
              El problema
            </h3>
            <p className="text-sm text-cbpgray-200">{caseStudy.problem}</p>
          </section>

          <section className="mt-6">
            <h3 className="mb-3 font-semibold text-cbpviolet-300 light:text-cbpviolet-500">
              Cómo funciona
            </h3>
            <ol className="flex flex-wrap items-center gap-2 text-xs">
              {caseStudy.flow.map((step, index) => (
                <li key={step} className="flex items-center gap-2">
                  {index > 0 && (
                    <span aria-hidden="true" className="text-cbpviolet-400">
                      →
                    </span>
                  )}
                  <span className="rounded-full border border-cbpviolet-500/40 bg-cbpviolet-500/10 px-3 py-1 font-medium">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <BulletList title="Qué construí" items={caseStudy.contributions} />
          <BulletList title="Decisiones técnicas" items={caseStudy.decisions} />
          <BulletList title="Resultados" items={caseStudy.results} />

          {caseStudy.technologies.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {technologies
                .filter((technology) =>
                  caseStudy.technologies.includes(technology.name),
                )
                .map((technology) => (
                  <TechnologyLabel
                    key={technology.name}
                    name={technology.name}
                    icon={technology.icon}
                    color={technology.color}
                    url={technology.url}
                  />
                ))}
            </div>
          )}

          {caseStudy.link && (
            <a
              href={caseStudy.link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="fx-trigger mt-6 inline-flex items-center gap-2 rounded-md border border-cbpbg-400 px-4 py-2 text-sm transition-colors hover:border-cbpviolet-300"
            >
              <FaGithub aria-hidden="true" className="fx-icon fx-spin" />
              {caseStudy.link.label}
            </a>
          )}
        </div>
      )}
    </dialog>
  );
};
