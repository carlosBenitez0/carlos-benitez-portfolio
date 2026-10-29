import { IoLanguageOutline } from "react-icons/io5";
import { locale, localePath, type Locale } from "../../../i18n/locale";
import { t } from "../../../i18n/ui";

const other: Locale = locale === "es" ? "en" : "es";

// Enlace a la misma página en el otro idioma. Conserva el #hash (la sección
// o el caso abierto) al momento del clic. Icono de idioma + código: el
// código solo no se entiende. En teléfonos (<640px) solo el icono: no cabe. Mismo tono apagado que los iconos vecinos; el
// texto, un poco más fuerte (/80) para llegar al contraste 4.5:1 a 11px.
export const LanguageSwitch = ({ className = "" }: { className?: string }) => (
  <a
    href={localePath[other]}
    hrefLang={other}
    lang={other}
    aria-label={t.meta.switchLabel}
    title={t.meta.switchLabel}
    onClick={(e) => {
      e.currentTarget.href = `${localePath[other]}${window.location.hash}`;
    }}
    className={`blur-text-git fx-trigger flex items-center gap-0.5 text-cbpgray-300/70 transition-transform duration-300 hover:-translate-y-1 hover:text-cbpgray-300 ${className}`}
  >
    <IoLanguageOutline
      aria-hidden="true"
      className="fx-icon fx-swing text-[19px]"
    />
    <span className="hidden text-[11px] font-medium text-cbpgray-300/80 uppercase sm:inline">
      {other}
    </span>
  </a>
);
