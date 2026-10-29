// Tipos del contenido. Los textos viven en es.ts y en.ts.

// Meses en formato "AAAA-MM", según el historial de commits del repo.
// `resumed`: cuándo se retomó tras una pausa larga. `current`: sigue en
// curso ("– actualidad").
export interface ProjectDate {
  start: string;
  end?: string;
  resumed?: string;
  current?: boolean;
}

export interface Project {
  name: string;
  image: string;
  description: string;
  technologies: string[];
  // done: terminado · wip: en desarrollo · paused: sin terminar y sin
  // trabajo activo. La etiqueta visible está en src/i18n/ui.ts.
  state: "done" | "wip" | "paused";
  url: string;
  gitHub: string;
  date?: ProjectDate;
}

// Trayectoria, de la más reciente a la más antigua. En `highlights`, el
// texto entre **dobles asteriscos** se resalta con ShinyText (RichText); el
// HTML estático, /llms.txt e /index.md lo usan sin los asteriscos.
export interface Experience {
  role: string;
  company: string;
  date?: ProjectDate;
  summary: string;
  highlights: string[];
  technologies: string[];
}

// Casos de estudio: el trabajo con más peso, contado como problema, aporte,
// decisiones y resultados. `flow` son los pasos del diagrama del caso. Los
// apartados vacíos no se muestran. Mismo formato **resaltado** que
// `experience`.
export interface CaseStudy {
  slug: string;
  title: string;
  summary: string;
  context: string;
  role: string;
  problem: string;
  contributions: string[];
  decisions: string[];
  results: string[];
  flow: string[];
  technologies: string[];
  link?: { label: string; url: string };
}
