import type { ProjectDate } from "../content/site";

// Sin Intl: el mismo texto en el navegador y en el build (seoContent).
const MONTHS = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

const parse = (value: string) => {
  const [year, month] = value.split("-");
  return { year, month: MONTHS[Number(month) - 1] };
};

const monthYear = (value: string) => {
  const { year, month } = parse(value);
  return `${month} ${year}`;
};

// "oct 2024", "sep – oct 2024", "sep 2024 – jul 2025" y, si se retomó tras
// una pausa larga, "sep – oct 2024 · retomado jul 2025".
export const formatProjectDate = ({ start, end, resumed }: ProjectDate) => {
  let label = monthYear(start);
  if (end && end !== start) {
    const from = parse(start);
    label =
      from.year === parse(end).year
        ? `${from.month} – ${monthYear(end)}`
        : `${label} – ${monthYear(end)}`;
  }
  return resumed ? `${label} · retomado ${monthYear(resumed)}` : label;
};
