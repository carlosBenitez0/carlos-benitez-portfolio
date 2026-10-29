import type { ProjectDate } from "../content/site";
import { locale, type Locale } from "../i18n/locale";
import { ui } from "../i18n/ui";

// Sin Intl: el mismo texto en el navegador y en el build (seoContent).
// "oct 2024", "sep – oct 2024", "sep 2024 – jul 2025", "jun 2025 – actualidad"
// y, si se retomó tras una pausa larga, "sep – oct 2024 · retomado jul 2025".
export const formatProjectDate = (
  { start, end, resumed, current }: ProjectDate,
  lang: Locale = locale,
) => {
  const { months, present, resumed: resumedLabel } = ui[lang].dates;
  const parse = (value: string) => {
    const [year, month] = value.split("-");
    return { year, month: months[Number(month) - 1] };
  };
  const monthYear = (value: string) => {
    const { year, month } = parse(value);
    return `${month} ${year}`;
  };

  let label = monthYear(start);
  if (current) {
    label = `${label} – ${present}`;
  } else if (end && end !== start) {
    const from = parse(start);
    label =
      from.year === parse(end).year
        ? `${from.month} – ${monthYear(end)}`
        : `${label} – ${monthYear(end)}`;
  }
  return resumed ? `${label} · ${resumedLabel} ${monthYear(resumed)}` : label;
};
