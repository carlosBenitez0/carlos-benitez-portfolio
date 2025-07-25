// Importación de componentes de interfaz de usuario personalizados
import { SectionTitle } from "../SectionTitle";
// Importación del componente de tarjeta de herramientas de IA
import { AIToolCard } from "./AIToolCard";
// Importación del componente de terminal interactivo
import { AITerminal } from "./AITerminal";
// Importación de iconos de la biblioteca react-icons
import { FaRobot, FaTerminal, FaCode, FaBrain } from "react-icons/fa";
import { SiGithub, SiOpenai, SiGoogle } from "react-icons/si";
import { BiLogoVisualStudio } from "react-icons/bi";
import { FaBolt } from "react-icons/fa6";
// Importación de hooks de React
import { useEffect, useRef } from "react";

/**
 * Componente AISection
 *
 * Este componente muestra una sección que destaca las herramientas de IA que utilizo
 * en mi flujo de desarrollo. Incluye tarjetas de herramientas y un terminal interactivo
 * que muestra ejemplos de uso de IA.
 */
export const AISection = () => {
  // Referencia para el Intersection Observer
  const sectionRef = useRef<HTMLElement>(null);

  // Efecto para el Intersection Observer
  useEffect(() => {
    const currentRef = sectionRef.current;
    const observer = new IntersectionObserver(
      () => {
        // Aquí puedes agregar lógica cuando la sección entre/salga de la vista
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      },
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Datos de las herramientas de IA que se mostrarán en las tarjetas
  const herramientas = [
    {
      nombre: "ChatGPT",
      icono: <SiOpenai className="text-2xl" />,
      descripcion:
        "Modelo de lenguaje avanzado para generación de código, resolución de problemas y asistencia en programación.",
      beneficios: [
        "Respuestas detalladas y contextuales",
        "Soporte para múltiples lenguajes de programación",
        "Útil para depuración y explicación de conceptos",
      ],
    },
    {
      nombre: "Gemini",
      icono: <SiGoogle className="text-2xl" />,
      descripcion:
        "Modelo multimodal de Google capaz de entender y generar texto, código e imágenes de manera integrada.",
      beneficios: [
        "Capacidades multimodales avanzadas",
        "Integración con herramientas de Google",
        "Buen rendimiento en tareas de programación",
      ],
    },
    {
      nombre: "Bolt.new",
      icono: <FaBolt className="text-2xl" />,
      descripcion:
        "Plataforma para generar proyectos completos usando indicaciones en lenguaje natural.",
      beneficios: [
        "Creación de proyectos desde cero con prompts",
        "Asistencia con IA para estructurar código y archivos",
        "Compatible con varios lenguajes de programación",
      ],
    },
    {
      nombre: "DeepSeek",
      icono: <BiLogoVisualStudio className="text-2xl" />,
      descripcion:
        "Modelo de IA avanzado para comprensión y generación de código con gran contexto.",
      experiencia: "6+ meses",
      beneficios: [
        "Gran capacidad de contexto",
        "Precisión en generación de código",
        "Soporte para múltiples lenguajes",
      ],
    },
    {
      nombre: "GitHub Copilot",
      icono: <SiGithub className="text-2xl" />,
      descripcion:
        "Asistente de programación en pares impulsado por IA para sugerencias de código en tiempo real.",
      beneficios: [
        "Sugerencias de código en tiempo real",
        "Integración con editores populares",
        "Aprendizaje automático contextual",
      ],
    },
    {
      nombre: "Windsurf",
      icono: <SiOpenai className="text-2xl" />,
      descripcion:
        "Asistente de desarrollo de IA que entiende el contexto de tu código y flujo de trabajo.",
      experiencia: "1+ año",
      beneficios: [
        "Análisis de código en tiempo real",
        "Soporte para múltiples lenguajes",
        "Integración con el flujo de desarrollo",
      ],
    },

    {
      nombre: "Editores de Código",
      icono: <BiLogoVisualStudio className="text-2xl" />,
      descripcion:
        "Herramientas esenciales potenciadas con IA para desarrollo de software.",
      experiencia: "3+ años",
      beneficios: [
        "Soporte para extensiones de IA",
        "Autocompletado inteligente",
        "Depuración asistida",
      ],
    },
  ];

  // Áreas de estudio actuales
  const areasDeEstudio = [
    {
      nombre: "Prompt Engineering",
      icono: <FaTerminal className="text-cbpviolet" />,
      descripcion: "Diseño de prompts efectivos para modelos de IA",
    },
    {
      nombre: "Context Engineering",
      icono: <FaCode className="text-cbpviolet" />,
      descripcion: "Optimización del contexto para mejorar respuestas de IA",
    },
    {
      nombre: "Vibecoding",
      icono: <FaRobot className="text-cbpviolet" />,
      descripcion: "Técnicas de programación guiadas por IA",
    },
    {
      nombre: "MCP",
      icono: <FaBrain className="text-cbpviolet" />,
      descripcion: "Modelos de Comportamiento Predictivo en desarrollo",
    },
  ];

  return (
    <section id="ai" className="py-8 bg-cbpgray-900" ref={sectionRef}>
      <div className="container mx-auto px-8">
        {/* Título principal de la sección */}
        <SectionTitle title="Inteligencia Artificial" icon={<FaRobot />} />

        {/* Descripción de la sección */}
        <p className="text-cbpgray-300  mb-12">
          Utilizo herramientas de IA avanzadas para mejorar la calidad y
          eficiencia del desarrollo de software. Estas son algunas de las
          tecnologías que integro en mi flujo de trabajo diario.
        </p>

        {/* Grid de herramientas de IA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {herramientas.map((herramienta, index) => (
            <AIToolCard
              key={herramienta.nombre}
              nombre={herramienta.nombre}
              icono={herramienta.icono}
              descripcion={herramienta.descripcion}
              beneficios={herramienta.beneficios}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Terminal interactiva */}
        <div className="mb-16">
          <AITerminal />
        </div>

        {/* Sección de estudios actuales */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center justify-center">
            <span className="text-cbpgray-300">Áreas de Estudio Actuales</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {areasDeEstudio.map((area) => (
              <div
                key={area.nombre}
                className="bg-cbpgray-800/50 rounded-lg p-5 border border-cbpgray-700/50 hover:border-cbpviolet/30 transition-colors"
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-lg bg-cbpviolet/10 mr-3 text-cbpviolet-400">
                    {area.icono}
                  </div>
                  <h4 className="text-lg font-semibold text-white">
                    {area.nombre}
                  </h4>
                </div>
                <p className="text-sm text-cbpgray-300">{area.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
