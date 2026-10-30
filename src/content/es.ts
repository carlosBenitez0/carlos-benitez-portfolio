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
  intro:
    "Construyo **soluciones web** robustas, fusionando **código eficiente** con **diseño intuitivo** y **creativo.** Creo que la programación va más allá de la lógica: es un espacio para **innovar** y resolver problemas con **soluciones ingeniosas.**",
};

const projects: Project[] = [
  {
    name: "Yamgurumi",
    image: "/projects/yamgurumi.webp",
    description:
      "Tienda de amigurumis en producción, con asistente de IA propio, pedidos por WhatsApp y panel de administración.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "PostgreSQL",
      "Prisma",
      "Gemini",
    ],
    state: "wip",
    url: "https://yamgurumi.com/",
    gitHub: "",
    date: { start: "2026-07", current: true },
  },
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
    date: { start: "2025-05", end: "2025-07" },
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
    slug: "yamgurumi",
    title: "Yamgurumi: tienda con asistente de IA",
    summary:
      "Tienda de amigurumis hechos a mano, en producción con dominio propio: catálogo, pedidos por WhatsApp, cuentas de cliente, un panel de administración completo y un asistente de IA propio que recomienda productos.",
    context:
      "Desarrollada de punta a punta para un taller artesanal de El Salvador, con Next.js 16, React 19, PostgreSQL y Prisma sobre Vercel. Está en producción y en desarrollo activo.",
    role: "Diseño, desarrollo y despliegue",
    problem:
      "Una artesana que trabaja sola necesitaba vender en línea sin pasarela de pagos ni equipo de soporte: mostrar el catálogo, recibir pedidos y encargos, responder dudas a cualquier hora y administrar todo desde un solo lugar.",
    contributions: [
      "**Asistente de IA propio:** chat en streaming con **Gemini 3.5 Flash-Lite** que responde con el catálogo y las políticas reales de la tienda, recomienda productos con tarjetas y pasa la conversación a WhatsApp cuando hace falta una persona",
      "**Panel de administración:** productos, categorías, pedidos, encargos personalizados, cupones, reseñas, usuarios, newsletter, reportes exportables a CSV, auditoría y revisión de las conversaciones del chat",
      "**Compra sin pasarela:** bolsa, precios y cupones calculados en el servidor, y pedido confirmado por WhatsApp con pago por transferencia",
      "**Cuenta de cliente:** registro con verificación por correo, recuperación de contraseña, favoritos, notificaciones, seguimiento de pedidos y niveles de cliente",
      "**Portada en 3D** con React Three Fiber y animaciones con GSAP",
    ],
    decisions: [
      "**La IA solo conoce lo público:** el servidor arma el contexto con el catálogo y los datos públicos de la tienda; el modelo no tiene herramientas ni acceso a la base de datos",
      "**Proveedor intercambiable:** el chat usa la API compatible con OpenAI, así que se cambia de modelo (Gemini, Groq, Claude…) solo con variables de entorno",
      "**IA con límites:** límites por visitante, en ráfaga y diarios para toda la tienda, comprobación de origen y tiempo máximo de respuesta",
      "**Privacidad:** se avisa antes de guardar la conversación y se borra sola a los 90 días",
      "**El servidor decide:** precios en centavos, stock y cupones canjeados de forma atómica, y sesiones validadas contra la base de datos en cada petición",
      "**Imágenes seguras:** validadas por su contenido y re-codificadas sin metadatos EXIF",
    ],
    results: [
      "**En producción** con dominio propio: yamgurumi.com",
      "Más de **260 tests unitarios** y pruebas **E2E** con Playwright en CI",
      "Atención a cualquier hora, con traspaso a una persona por WhatsApp",
    ],
    flow: [
      "Cliente",
      "Chat con IA",
      "Recomendación",
      "Bolsa",
      "Pedido por WhatsApp",
      "Panel de administración",
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "PostgreSQL",
      "Prisma",
      "Gemini",
      "Three.js",
      "GSAP",
      "Zustand",
      "Vitest",
      "Playwright",
      "Vercel",
    ],
    link: {
      label: "Visitar yamgurumi.com",
      url: "https://yamgurumi.com/",
    },
  },
  {
    slug: "financiamiento-automotriz",
    title: "Calculadora de préstamos automotrices con IA",
    summary:
      "Financiamiento automotriz: calcula la oferta y el préstamo de cada solicitud a partir del valor de mercado del vehículo y las tasas permitidas, y redacta con IA un perfil del cliente.",
    context:
      "Plataforma de financiamiento de vehículos desarrollada con CodeIgniter 4 (PHP) y MySQL.",
    role: "Desarrollador Full Stack",
    problem:
      "Cada solicitud llega con documentos y cada prestamista tiene sus propias condiciones. Había que convertir todo eso en una oferta y un préstamo consistentes, dentro de los límites legales, y resumir el perfil del cliente para quien decide.",
    contributions: [
      "**Calculadora de préstamos:** oferta según el valor de mercado del vehículo, monto a financiar con sus costos asociados y cuota mensual con la fórmula de amortización",
      "**Tasas legales configurables** según el año del vehículo, con actualización automática",
      "**Configuración por prestamista** en las vistas de prestamista y de administración",
      "**Narrativa del cliente con IA** a partir de sus documentos, con prompt editable y descarga en PDF",
      "**Análisis de documentos con IA** (OpenAI y Gemini) con OCR de respaldo",
      "**Interfaz por pestañas** con validaciones, estados de aprobación y ayudas contextuales para subir cada documento",
    ],
    decisions: [
      "**Reglas configurables, no fijas en el código:** tasas, condiciones y prompts se ajustan desde la administración",
      "**La calculadora no adivina:** si falta información, indica qué falta en lugar de calcular con datos incompletos",
      "**Más de una forma de leer un documento:** si un método falla, entra otro",
    ],
    results: [
      "De la solicitud a la decisión en un solo flujo: **documentos, valuación, préstamo y narrativa en PDF**",
    ],
    flow: [
      "Documentos",
      "Lectura con IA",
      "Valor de mercado",
      "Tasa permitida",
      "Oferta y cuota",
      "Narrativa en PDF",
    ],
    technologies: ["PHP", "CodeIgniter", "MySQL", "JavaScript", "Tailwind CSS"],
  },
  {
    slug: "marketplace-subastas",
    title: "Marketplace con subastas",
    summary:
      "Marketplace de compra y venta con subastas: ofertas concurrentes seguras, cierre automático, pago con tarjeta y entrega marcada en el mapa.",
    context:
      "Marketplace con frontend en Next.js y API en FastAPI sobre MySQL.",
    role: "Desarrollador Full Stack",
    problem:
      "Varias personas pueden ofertar por el mismo artículo a la vez: cada oferta debe validarse sin pisarse con otra, la subasta debe abrir y cerrar sola, y el ganador debe poder pagar sin cobros duplicados y recibir la compra donde la pidió.",
    contributions: [
      "**Ofertas concurrentes** con bloqueo de fila en la base de datos, validadas dentro de una transacción",
      "**Tareas programadas** que abren y cierran las subastas, eligen al ganador y mantienen las órdenes al día",
      "**Pago con tarjeta** integrado con una pasarela de pagos, con registro de auditoría",
      "**Checkout con mapa:** el comprador marca el punto de entrega y la dirección se completa sola",
      "Correos transaccionales, notificaciones, inicio de sesión con JWT y Google, calificaciones y panel de administración",
    ],
    decisions: [
      "**La base de datos ordena las ofertas:** el bloqueo de fila resuelve la concurrencia sin servicios extra",
      "**El cierre no depende de las visitas:** ocurre a tiempo aunque nadie esté en la página",
      "**Pagos idempotentes:** un reintento no genera un segundo cobro",
    ],
    results: [
      "Flujo completo en una sola plataforma: **publicar, ofertar, ganar, pagar y recibir**",
    ],
    flow: [
      "Oferta",
      "Cierre automático",
      "Ganador y correo",
      "Pago con tarjeta",
      "Entrega en el mapa",
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Zustand",
      "Python",
      "FastAPI",
      "MySQL",
    ],
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
    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "GSAP",
      "Motion",
      "Three.js",
      "Vitest",
      "Playwright",
      "Vercel",
    ],
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
    role: "Desarrollador Web Full Stack",
    company: "Uassist.me",
    date: { start: "2026-07", current: true },
    summary:
      "Desarrollo y mantenimiento de aplicaciones y sitios web: nuevas funcionalidades, integraciones y automatización de procesos con IA.",
    highlights: [
      "**Automatización de procesos** con flujos de **n8n** y modelos de IA",
      "Integración de formularios con **CRM** y **analítica**",
      "Optimización **SEO** y de **rendimiento** web",
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Flutter",
      "Dart",
      "PostgreSQL",
      "Prisma",
      "n8n",
      "OpenAI",
      "Docker",
      "AWS",
    ],
  },
  {
    role: "Desarrollador Web Full Stack",
    company: "Web Informática S.A. de C.V.",
    date: { start: "2025-08", end: "2026-04" },
    summary:
      "Desarrollo full stack de plataformas para clientes: interfaces, APIs, pagos e integración de servicios de IA.",
    highlights: [
      "**Calculadora de préstamos automotrices:** oferta y cuota a partir del valor de mercado del vehículo, análisis de documentos con IA y narrativa del cliente en PDF",
      "**Marketplace con subastas:** ofertas concurrentes seguras, cierre automático, pago con tarjeta y entrega marcada en el mapa",
      "**Interfaces para datos financieros complejos:** flujos por pestañas, estados de aprobación y tooltips que guían la carga de documentos",
      "Traducción de las **reglas de negocio** de los clientes en herramientas administrativas claras",
    ],
    technologies: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Zustand",
      "Python",
      "FastAPI",
      "PHP",
      "CodeIgniter",
      "MySQL",
    ],
  },
  {
    role: "Desarrollador Web Full Stack (pasantía)",
    company: "DYGAV · Digitalización y Gestión de Alquileres Vacacionales",
    date: { start: "2024-11", end: "2025-02" },
    summary:
      "Automatización de procesos y frontend para una plataforma de alquileres vacacionales.",
    highlights: [
      "**Automatización** de facturas y liquidaciones con scripts en Python a partir de datos en bruto, eliminando procesos manuales",
      "Conversión automática de imágenes a **WebP** y carga en **AWS S3** para aligerar el sitio",
      "Prototipos de **Figma** convertidos en interfaces con Next.js y TypeScript",
      "Automatización de **mensajería** mediante APIs",
    ],
    technologies: ["Next.js", "TypeScript", "Python", "AWS", "Figma"],
  },
  {
    role: "Desarrollador Frontend (freelance)",
    company: "La Nevería",
    date: { start: "2023-11", end: "2023-12" },
    summary: "Sistema de gestión de inventario y ventas.",
    highlights: [
      "Diseño **UX/UI** de la interfaz de inventario y ventas, pensada para registrar cada transacción rápido",
    ],
    technologies: [],
  },
  {
    role: "Tutor de desarrollo web",
    company: "Programa Estudiante Tutor · UNAB",
    date: { start: "2022-01", end: "2022-12" },
    summary: "Mentoría a estudiantes de la Universidad Doctor Andrés Bello.",
    highlights: [
      "Tutorías de **JavaScript, C#, HTML/CSS y MySQL**: lógica de programación, maquetación y diseño de bases de datos relacionales",
    ],
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
