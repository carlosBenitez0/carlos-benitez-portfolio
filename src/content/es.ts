// Contenido en español (idioma por defecto). en.ts traduce estos textos y
// reutiliza todo lo demás (imágenes, URLs, fechas, tecnologías).
import type { CaseStudy, Experience, Project } from "./types";

const profile = {
  name: "Carlos Benítez",
  fullName: "Carlos Francisco Benítez Quintanilla",
  jobTitle: "Desarrollador Web",
  headline: "Ingeniero en Sistemas y Computación | Desarrollador Web",
  location: "El Salvador",
  photo: "/images/carlos-benitez.webp",
  summary:
    "Desarrollador web de El Salvador, especializado en aplicaciones web modernas y en desarrollo agéntico con IA: Claude Code, Codex, MCP y verificación con tests automáticos.",
  // Insignia del hero
  availability: "Abierto a nuevas oportunidades",
  intro:
    "Construyo **soluciones web** robustas, fusionando **código eficiente** con **diseño intuitivo** y **creativo.** Creo que la programación va más allá de la lógica: es un espacio para **innovar** y resolver problemas con **soluciones ingeniosas.**",
};

const projects: Project[] = [
  {
    name: "TechZone",
    image: "/projects/techzone.webp",
    description:
      "Tienda en línea de tecnología con diseño moderno y panel de administración.",
    technologies: ["Next.js", "CSS", "GSAP", "TypeScript", "Zustand"],
    state: "paused",
    url: "https://techzone-zeta.vercel.app/",
    gitHub: "https://github.com/carlosBenitez0/techzone",
    date: { start: "2025-06", end: "2025-08" },
  },
  {
    name: "IBG Arcade",
    image: "/projects/ibg-arcade.webp",
    description:
      "Sitio web cristiano con tres juegos: el clásico tres en raya y dos juegos de preguntas.",
    technologies: ["React", "CSS", "TypeScript", "Motion", "bolt.new"],
    state: "done",
    url: "https://ibg-arcade.vercel.app/",
    gitHub: "https://github.com/carlosBenitez0/IBGArcade",
    date: { start: "2025-06" },
  },
  {
    name: "Pokédex",
    image: "/projects/pokedex.webp",
    description: "Pokédex web que consume la PokeAPI.",
    technologies: ["React", "Tailwind CSS", "TypeScript", "Axios", "Pokeapi"],
    state: "paused",
    url: "https://pok-dex-yx1k.vercel.app/",
    gitHub: "https://github.com/carlosBenitez0/pok-dex",
    date: { start: "2024-09", end: "2024-10", resumed: "2025-07" },
  },
  {
    name: "Portafolio Académico",
    image: "/projects/portafolio-academico.webp",
    description:
      "Proyecto académico que sintetiza once semanas de contenido sobre la administración estratégica de recursos empresariales y tecnológicos.",
    technologies: ["HTML", "CSS", "JavaScript"],
    state: "done",
    url: "https://rad-conkies-95b333.netlify.app/",
    gitHub: "",
  },
];

const caseStudies: CaseStudy[] = [
  {
    slug: "creditos-automotrices",
    title: "Motor de créditos automotrices",
    summary:
      "Cálculo y validación de créditos automotrices, con análisis de riesgo apoyado en IA.",
    context:
      "Proyecto desarrollado en una empresa de desarrollo de software para el financiamiento de vehículos.",
    role: "Desarrollador Full Stack",
    problem:
      "Cada solicitud de crédito debía calcularse y validarse de forma consistente, y la evaluación de riesgo necesitaba apoyo para decidir con más información.",
    contributions: [
      "Motor de **cálculo** de créditos automotrices",
      "**Validación** de las solicitudes antes de evaluarlas",
      "**Análisis de riesgo apoyado en IA** como parte de la evaluación",
    ],
    decisions: [],
    results: [],
    flow: [
      "Solicitud",
      "Validación",
      "Cálculo",
      "Análisis de riesgo (IA)",
      "Resultado",
    ],
    technologies: [],
  },
  {
    slug: "subastas-tiempo-real",
    title: "E-commerce con subastas en tiempo real",
    summary:
      "Tienda en línea con subastas: ofertas concurrentes, cierres automáticos y checkout con geolocalización.",
    context: "Proyecto desarrollado en una empresa de desarrollo de software.",
    role: "Desarrollador Full Stack",
    problem:
      "Varias personas pueden ofertar por el mismo artículo a la vez: cada oferta debe registrarse en orden, la subasta debe cerrarse sola al vencer y el ganador debe poder pagar y recibir su compra.",
    contributions: [
      "Manejo de **ofertas concurrentes** en tiempo real",
      "**Cierre automático** de las subastas",
      "**Checkout con geolocalización** para la entrega",
    ],
    decisions: [],
    results: [],
    flow: [
      "Ofertas en tiempo real",
      "Cierre automático",
      "Ganador",
      "Checkout con geolocalización",
    ],
    technologies: [],
  },
  {
    slug: "portafolio-agentico",
    title: "Este portafolio, con desarrollo agéntico",
    summary:
      "Un sitio con mucha animación que sigue siendo rápido, accesible e indexable, construido junto a agentes de IA y verificado en cada cambio.",
    context:
      "Mi portafolio personal: React, TypeScript, Vite, Tailwind CSS v4, GSAP y Three.js, desplegado en Vercel.",
    role: "Diseño, desarrollo y mantenimiento",
    problem:
      "Programar con agentes de IA es rápido, pero sin contexto ni verificación los cambios rompen cosas sin que nadie lo note. Además, un sitio tan animado corre el riesgo de ser lento, inaccesible o invisible para buscadores.",
    contributions: [
      "Trabajo con **Claude Code** guiado por reglas, memoria y **skills propias**: planificar, una rama por tarea, commits convencionales y una guía de prueba manual",
      "Conexión del agente a herramientas con **MCP**",
      "Una sola fuente de contenido que en el build genera el **HTML estático**, el JSON-LD, **/llms.txt**, /index.md y el sitemap",
    ],
    decisions: [
      "**Tests como red de seguridad del agente:** cada cambio pasa por Vitest y Playwright antes del commit y otra vez en CI",
      "**Accesibilidad medida, no supuesta:** auditorías con axe dentro de los tests E2E",
      "**Animaciones que no cuestan:** se pausan fuera de pantalla y respetan reducir movimiento",
      "**Seguridad por defecto:** Content Security Policy estricta y cabeceras HTTP de seguridad",
    ],
    results: [
      "Más de **200 tests** automáticos en cada commit",
      "Contenido completo **indexable sin JavaScript**, también para modelos de IA",
      "**Modo claro y oscuro**, y accesibilidad verificada con axe",
    ],
    flow: [
      "Plan",
      "Agente + skills y MCP",
      "Código",
      "Tests (Vitest, Playwright, axe)",
      "CI",
      "Vercel",
    ],
    technologies: ["React", "TypeScript", "Tailwind CSS", "GSAP", "Vercel"],
    link: {
      label: "Ver el código en GitHub",
      url: "https://github.com/carlosBenitez0/carlos-benitez-portfolio",
    },
  },
];

// "Sobre mí". RichText pinta **resaltados** y [[Tecnología]] como etiqueta.
const about = {
  paragraphs: [
    "Soy Carlos Benítez, **desarrollador web** con formación en **Ingeniería de Sistemas y Computación.** Me centro en construir **aplicaciones web modernas** que combinan un **diseño cuidado** con una **arquitectura sólida.**",
    "Mi experiencia abarca desde el desarrollo de **interfaces dinámicas** con [[React]] / [[Next.js]] hasta la construcción de APIs eficientes con [[Python]] / [[FastAPI]]. Me interesa especialmente la integración entre **frontend** y **backend** para ofrecer experiencias fluidas.",
    "Hoy gran parte de mi trabajo es **desarrollo agéntico:** programo junto a **agentes de IA** y elijo la herramienta adecuada para cada tarea. Con **harness engineering** les doy el **contexto adecuado** (reglas, memoria y skills), los conecto a herramientas con **MCP** y verifico cada cambio con **tests automáticos.** Así optimicé este portafolio, que hoy cuenta con más de 200 tests.",
  ],
};

const experience: Experience[] = [
  {
    role: "Desarrollador Full Stack",
    company: "Empresa de desarrollo de software",
    summary:
      "Desarrollo de aplicaciones web de principio a fin: interfaces, APIs, integraciones y automatización de procesos.",
    highlights: [
      "Motor de cálculo y validación de **créditos automotrices,** con análisis de riesgo apoyado en IA",
      "**E-commerce con subastas en tiempo real:** ofertas concurrentes, cierres automáticos y checkout con geolocalización",
      "**Automatización** de facturas y liquidaciones con Python, eliminando procesos manuales",
      "Conversión automática de imágenes a WebP y carga en **AWS S3** para acelerar la carga del sitio",
    ],
    technologies: [
      "React",
      "Next.js",
      "TypeScript",
      "Python",
      "FastAPI",
      "AWS",
    ],
  },
  {
    role: "Tutor de desarrollo web",
    company: "UNAB",
    summary:
      "Acompañamiento a estudiantes en sus primeros pasos con la programación y el desarrollo web.",
    highlights: ["Tutorías de **JavaScript, C#, HTML/CSS y MySQL**"],
    technologies: ["JavaScript", "HTML", "CSS", "MySQL"],
  },
];

const technologyCategories: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  learning: "Aprendiendo",
  tools: "Herramientas",
};

const ai = {
  intro:
    "La IA es parte central de mi forma de desarrollar: trabajo con agentes de programación que planifican, editan código y ejecutan tests, y con asistentes para investigar, diseñar y revisar. Estas son las herramientas que uso en mi día a día.",
  // Solo las de más peso en el mercado. Orden por importancia: primero los
  // agentes de programación, encabezados por Claude; después asistentes.
  tools: [
    {
      nombre: "Claude Code",
      descripcion:
        "Agente de programación de Anthropic que trabaja desde la terminal: comprende el repositorio, edita código, ejecuta pruebas y prepara commits.",
      beneficios: [
        "Tareas de varios pasos sobre todo el proyecto",
        "Reglas, memoria y skills por proyecto",
        "Integración con MCP, Git y GitHub",
      ],
    },
    {
      nombre: "Claude",
      descripcion:
        "Asistente de IA de Anthropic orientado al razonamiento y al análisis de problemas complejos.",
      beneficios: [
        "Análisis y explicación de código",
        "Respuestas estructuradas para tareas complejas",
        "Apoyo en arquitectura y refactorización",
      ],
    },
    {
      nombre: "Codex",
      descripcion:
        "Agente de programación de OpenAI, disponible en la terminal y en la nube, que implementa cambios y revisa código.",
      beneficios: [
        "Implementación de cambios de principio a fin",
        "Revisión de código con propuestas de mejora",
        "Trabajo en paralelo sobre varias tareas",
      ],
    },
    {
      nombre: "GitHub Copilot",
      descripcion:
        "Asistente de programación integrado en el editor, con sugerencias de código en tiempo real.",
      beneficios: [
        "Autocompletado de código según el contexto",
        "Integración con los editores más usados",
        "Chat y modo agente dentro del editor",
      ],
    },
    {
      nombre: "ChatGPT",
      descripcion:
        "Asistente de IA de OpenAI para generar código, resolver problemas y explicar conceptos.",
      beneficios: [
        "Respuestas detalladas y contextuales",
        "Soporte para múltiples lenguajes de programación",
        "Apoyo en depuración y aprendizaje",
      ],
    },
    {
      nombre: "Gemini",
      descripcion:
        "Modelo multimodal de Google que comprende y genera texto, código e imágenes.",
      beneficios: [
        "Capacidades multimodales",
        "Integración con el ecosistema de Google",
        "Amplia ventana de contexto",
      ],
    },
  ],
  studyAreas: [
    {
      nombre: "Agentes de IA",
      descripcion:
        "Agentes que planifican, editan código y ejecutan tareas de varios pasos",
    },
    {
      nombre: "Context Engineering",
      descripcion:
        "Reglas, memoria y skills: el contexto adecuado para la IA en cada paso",
    },
    {
      nombre: "MCP",
      descripcion:
        "Model Context Protocol: conectar modelos de IA con herramientas y datos",
    },
    {
      nombre: "Evals y verificación",
      descripcion:
        "Pruebas y evaluaciones que comprueban que el código generado funciona",
    },
  ],
};

export const es = {
  profile,
  projects,
  caseStudies,
  about,
  experience,
  technologyCategories,
  ai,
};

export type Content = typeof es;
