import { locale, localePath, type Locale } from "../../../i18n/locale";
import { t } from "../../../i18n/ui";

const other: Locale = locale === "es" ? "en" : "es";

// Enlace a la misma página en el otro idioma. Conserva el #hash (la sección
// o el caso abierto) al momento del clic. Texto sin transparencia: a 13px
// necesita contraste 4.5:1 (los iconos vecinos no).
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
    className={`blur-text-git fx-trigger text-[13px] font-semibold tracking-wide text-cbpgray-300 uppercase transition-transform duration-300 hover:-translate-y-1 hover:text-cbpgray-300 ${className}`}
  >
    {other}
  </a>
);
