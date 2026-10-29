import { useCallback, useEffect, useState } from "react";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { caseStudies } from "../../../content/site";
import { useTechnologies } from "../../../utils/useTechnologies";
import { TechnologyLabel } from "../proyects/TechnologyLabel";
import { CaseStudyDialog } from "./CaseStudyDialog";
import { t } from "../../../i18n/ui";

const HASH_PREFIX = "#caso-";

const slugFromHash = () =>
  window.location.hash.startsWith(HASH_PREFIX)
    ? window.location.hash.slice(HASH_PREFIX.length)
    : null;

// La URL refleja el caso abierto (#caso-<slug>) para poder compartirlo, sin
// añadir entradas al historial.
const setHash = (hash: string) =>
  history.replaceState(
    history.state,
    "",
    `${window.location.pathname}${window.location.search}${hash}`,
  );

export const CaseStudies = () => {
  const technologies = useTechnologies();
  const [openSlug, setOpenSlug] = useState<string | null>(() =>
    caseStudies.some((c) => c.slug === slugFromHash()) ? slugFromHash() : null,
  );

  const open = (slug: string) => {
    setHash(`${HASH_PREFIX}${slug}`);
    setOpenSlug(slug);
  };

  const close = useCallback(() => {
    if (slugFromHash()) setHash("");
    setOpenSlug(null);
  }, []);

  // Un enlace a #caso-<slug> desde otra parte de la página también lo abre
  useEffect(() => {
    const onHashChange = () => {
      const slug = slugFromHash();
      if (slug && caseStudies.some((c) => c.slug === slug)) setOpenSlug(slug);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <>
      <div className="grid gap-3 md:grid-cols-3 md:gap-6">
        {caseStudies.map((caseStudy) => (
          <article
            key={caseStudy.slug}
            className="proyect-card-anim project-card flex flex-col rounded-2xl border-2 border-cbpbg-400 bg-cbpbg-700 p-5"
          >
            <h4 className="text-lg leading-snug font-bold text-cbpviolet-300 light:text-cbpviolet-500">
              {caseStudy.title}
            </h4>
            <p className="mt-2 text-sm text-cbpgray-200">{caseStudy.summary}</p>
            {caseStudy.technologies.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
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
                      compact
                    />
                  ))}
              </div>
            )}
            {/* mt-auto: el botón queda abajo aunque los textos midan distinto */}
            <div className="mt-auto pt-5">
              <button
                type="button"
                onClick={() => open(caseStudy.slug)}
                aria-haspopup="dialog"
                className="fx-trigger flex cursor-pointer items-center gap-2 rounded-md border border-cbpviolet-500/50 px-3 py-1.5 text-sm font-medium text-cbpviolet-300 transition-colors hover:border-cbpviolet-300 hover:bg-cbpviolet-500/10 light:text-cbpviolet-500"
              >
                {t.cases.read}
                <span className="sr-only">: {caseStudy.title}</span>
                <HiOutlineArrowRight
                  aria-hidden="true"
                  className="fx-icon fx-nudge"
                />
              </button>
            </div>
          </article>
        ))}
      </div>
      <CaseStudyDialog
        caseStudy={caseStudies.find((c) => c.slug === openSlug) ?? null}
        onClose={close}
      />
    </>
  );
};
