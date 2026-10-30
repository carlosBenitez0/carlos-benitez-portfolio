// Fuente única del contenido del portafolio. Solo datos (sin JSX ni APIs
// del navegador): la usa la app y también el plugin de Vite que genera en el
// build el HTML estático, el JSON-LD, /llms.txt, /index.md y el sitemap.
// Los textos están en es.ts y en.ts; aquí se elige el del idioma de la página.
import { locale, type Locale } from "../i18n/locale";
import { en } from "./en";
import { es, type Content } from "./es";

export { technologies } from "../utils/technologies";
export type * from "./types";
export type { Content };

export const SITE_URL = "https://carlos-benitez-portfolio.vercel.app/";

export const links = {
  linkedin: "https://www.linkedin.com/in/carlos-benitez-profile/",
  github: "https://github.com/carlosBenitez0",
  cv: "/ES - Carlos Francisco Benítez Quintanilla - CV.pdf",
  repo: "https://github.com/carlosBenitez0/carlos-benitez-portfolio",
};

export const content: Record<Locale, Content> = { es, en };

export const {
  profile,
  projects,
  caseStudies,
  about,
  experience,
  technologyCategories,
  ai,
} = content[locale];
