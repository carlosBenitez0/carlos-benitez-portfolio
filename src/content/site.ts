// Fuente única del contenido del portafolio. Solo datos (sin JSX ni APIs
// del navegador): la usa la app y también el plugin de Vite que genera en el
// build el HTML estático, el JSON-LD, /llms.txt, /index.md y el sitemap.
export { technologies } from "../utils/technologies";

export const SITE_URL = "https://carlos-benitez-portfolio.vercel.app/";

export const profile = {
  name: "Carlos Benítez",
  fullName: "Carlos Francisco Benítez Quintanilla",
  jobTitle: "Desarrollador Web",
  headline: "Ingeniero en Sistemas y Computación | Desarrollador Web",
  location: "El Salvador",
  photo: "/images/carlos-benitez.webp",
  summary:
    "Desarrollador web de El Salvador, especializado en aplicaciones web modernas y en desarrollo agéntico con IA: Claude Code, Codex, MCP y verificación con tests automáticos.",
  intro:
    "Construyo soluciones web robustas, fusionando código eficiente con diseño intuitivo y creativo. Creo que la programación va más allá de la lógica: es un espacio para innovar y resolver problemas con soluciones ingeniosas.",
};

export const links = {
  linkedin: "https://www.linkedin.com/in/carlos-benitez-profile/",
  github: "https://github.com/carlosBenitez0",
  cv: "/ES - Carlos Francisco Benítez Quintanilla - CV.pdf",
  repo: "https://github.com/carlosBenitez0/carlos-benitez-portfolio",
};

// Meses en formato "AAAA-MM", según el historial de commits del repo.
// `resumed`: cuándo se retomó tras una pausa larga.
export interface ProjectDate {
  start: string;
  end?: string;
  resumed?: string;
}

export interface Project {
  name: string;
  image: string;
  description: string;
  technologies: string[];
  state: "Terminado" | "En desarrollo";
  url: string;
  gitHub: string;
  date?: ProjectDate;
}

export const projects: Project[] = [
  {
    name: "TechZone",
    image: "/projects/techzone.webp",
    description:
      "Tienda en línea de tecnología con diseño moderno y panel de administración.",
    technologies: ["Next.js", "CSS", "GSAP", "TypeScript", "Zustand"],
    state: "En desarrollo",
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
    state: "Terminado",
    url: "https://ibg-arcade.vercel.app/",
    gitHub: "https://github.com/carlosBenitez0/IBGArcade",
    date: { start: "2025-06" },
  },
  {
    name: "To-Do con Firebase",
    image: "/projects/todo-firebase.webp",
    description:
      "Gestor de tareas con estilo neumórfico y almacenamiento en Firebase.",
    technologies: ["React", "Tailwind CSS", "TypeScript", "Motion", "Firebase"],
    state: "Terminado",
    url: "https://to-do-react-firebase-ten.vercel.app/",
    gitHub: "https://github.com/carlosBenitez0/to-do-react-firebase",
    date: { start: "2024-10" },
  },
  {
    name: "Clon de YouTube",
    image: "/projects/clon-youtube.webp",
    description:
      "Réplica de la página de inicio de YouTube; la versión responsive está en desarrollo.",
    technologies: ["HTML", "CSS"],
    state: "En desarrollo",
    url: "https://clon-yt-one.vercel.app/",
    gitHub: "https://github.com/carlosBenitez0/clon-yt",
    date: { start: "2024-09", end: "2024-10" },
  },
  {
    name: "Pokédex",
    image: "/projects/pokedex.webp",
    description: "Pokédex web que consume la PokeAPI.",
    technologies: ["React", "Tailwind CSS", "TypeScript", "Axios", "Pokeapi"],
    state: "En desarrollo",
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
    state: "Terminado",
    url: "https://rad-conkies-95b333.netlify.app/",
    gitHub: "",
  },
];

// Texto plano de "Sobre mí". En App.tsx el mismo texto lleva componentes
// intercalados (ShinyText, TechnologyLabel); App.test.tsx comprueba que no se
// desincronicen.
export const about = {
  paragraphs: [
    "Soy Carlos Benítez, desarrollador web con formación en Ingeniería de Sistemas y Computación. Me centro en construir aplicaciones web modernas que combinan un diseño cuidado con una arquitectura sólida.",
    "Mi experiencia abarca desde el desarrollo de interfaces dinámicas con React / Next.js hasta la construcción de APIs eficientes con Python / FastAPI. Me interesa especialmente la integración entre frontend y backend para ofrecer experiencias fluidas.",
    "Hoy gran parte de mi trabajo es desarrollo agéntico: programo junto a agentes de IA y elijo la herramienta adecuada para cada tarea. Con harness engineering les doy el contexto adecuado (reglas, memoria y skills), los conecto a herramientas con MCP y verifico cada cambio con tests automáticos. Así optimicé este portafolio, que hoy cuenta con más de 150 tests.",
  ],
  achievements: [
    "Motor de cálculo y validación de créditos automotrices, con análisis de riesgo apoyado en IA",
    "E-commerce con subastas en tiempo real: ofertas concurrentes, cierres automáticos y checkout con geolocalización",
    "Automatización de facturas y liquidaciones con Python, eliminando procesos manuales",
    "Conversión automática de imágenes a WebP y carga en AWS S3 para acelerar la carga del sitio",
    "Desarrollo agéntico con distintos agentes de IA, apoyado en MCP, subagentes y skills a medida",
    "Tutor de desarrollo web en la UNAB: JavaScript, C#, HTML/CSS y MySQL",
  ],
};

export const technologyCategories: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  learning: "Aprendiendo",
  tools: "Herramientas",
};

export const ai = {
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
