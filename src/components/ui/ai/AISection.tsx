// Importación de componentes de interfaz de usuario personalizados
import { SectionTitle } from "../SectionTitle";
// Importación del componente de tarjeta de herramientas de IA
import { AIToolCard } from "./AIToolCard";
// Importación del componente de terminal interactivo
import { AITerminal } from "./AITerminal";
// Importación de iconos de la biblioteca react-icons
import { FaRobot, FaCode, FaBrain } from "react-icons/fa";
import { LuBot } from "react-icons/lu";
import { FaVialCircleCheck } from "react-icons/fa6";
import {
  AntigravityIcon,
  BoltIcon,
  ClaudeCodeIcon,
  ClaudeIcon,
  CodexIcon,
  DeepSeekIcon,
  GeminiIcon,
  GithubCopilotIcon,
  OpenAIIcon,
  OpenCodeIcon,
  WindsurfIcon,
} from "./brandIcons";

/**
 * Componente AISection
 *
 * Este componente muestra una sección que destaca las herramientas de IA que utilizo
 * en mi flujo de desarrollo. Incluye tarjetas de herramientas y un terminal interactivo
 * que muestra ejemplos de uso de IA.
 */
export const AISection = () => {
  // Datos de las herramientas de IA que se mostrarán en las tarjetas
  const herramientas = [
    // Orden por importancia: primero los agentes de programación (harness),
    // encabezados por Claude; después asistentes y herramientas puntuales.
    {
      nombre: "Claude Code",
      icono: <ClaudeCodeIcon className="text-2xl" />,
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
      icono: <ClaudeIcon className="text-2xl" />,
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
      icono: <CodexIcon className="text-2xl" />,
      descripcion:
        "Agente de programación de OpenAI, disponible en la terminal y en la nube, que implementa cambios y revisa código.",
      beneficios: [
        "Implementación de cambios de principio a fin",
        "Revisión de código con propuestas de mejora",
        "Trabajo en paralelo sobre varias tareas",
      ],
    },
    {
      nombre: "OpenCode",
      icono: <OpenCodeIcon className="text-2xl" />,
      descripcion:
        "Agente de programación de código abierto para la terminal, compatible con modelos de distintos proveedores.",
      beneficios: [
        "Código abierto y configurable",
        "Libertad para elegir el modelo",
        "Flujo de trabajo desde la terminal",
      ],
    },
    {
      nombre: "GitHub Copilot",
      icono: <GithubCopilotIcon className="text-2xl" />,
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
      icono: <OpenAIIcon className="text-2xl" />,
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
      icono: <GeminiIcon className="text-2xl" />,
      descripcion:
        "Modelo multimodal de Google que comprende y genera texto, código e imágenes.",
      beneficios: [
        "Capacidades multimodales",
        "Integración con el ecosistema de Google",
        "Amplia ventana de contexto",
      ],
    },
    {
      nombre: "Antigravity",
      icono: <AntigravityIcon className="text-2xl" />,
      descripcion:
        "Entorno de desarrollo de Google pensado para trabajar con agentes de IA en el editor, la terminal y el navegador.",
      beneficios: [
        "Agentes integrados en el flujo de desarrollo",
        "Seguimiento del trabajo de cada agente",
        "Varias tareas en paralelo",
      ],
    },
    {
      nombre: "Windsurf",
      icono: <WindsurfIcon className="text-2xl" />,
      descripcion:
        "Editor con IA que comprende el contexto del código y del flujo de trabajo.",
      beneficios: [
        "Asistencia contextual en tiempo real",
        "Agente integrado en el editor",
        "Soporte para múltiples lenguajes",
      ],
    },
    {
      nombre: "DeepSeek",
      icono: <DeepSeekIcon className="text-2xl" />,
      descripcion:
        "Familia de modelos de IA de pesos abiertos con buen desempeño en programación y razonamiento.",
      beneficios: [
        "Amplia capacidad de contexto",
        "Precisión en la generación de código",
        "Modelos de pesos abiertos",
      ],
    },
    {
      nombre: "Bolt.new",
      icono: <BoltIcon className="text-2xl" />,
      descripcion:
        "Plataforma que genera aplicaciones web completas a partir de instrucciones en lenguaje natural.",
      beneficios: [
        "Prototipos funcionales en poco tiempo",
        "Estructura de proyecto y código generados",
        "Vista previa y despliegue desde el navegador",
      ],
    },
  ];

  // Áreas de estudio actuales
  const areasDeEstudio = [
    {
      nombre: "Agentes de IA",
      icono: <LuBot />,
      descripcion:
        "Agentes que planifican, editan código y ejecutan tareas de varios pasos",
    },
    {
      nombre: "Context Engineering",
      icono: <FaCode />,
      descripcion:
        "Reglas, memoria y skills: el contexto adecuado para la IA en cada paso",
    },
    {
      nombre: "MCP",
      icono: <FaBrain />,
      descripcion:
        "Model Context Protocol: conectar modelos de IA con herramientas y datos",
    },
    {
      nombre: "Evals y verificación",
      icono: <FaVialCircleCheck />,
      descripcion:
        "Pruebas y evaluaciones que comprueban que el código generado funciona",
    },
  ];

  return (
    <section id="ai" data-pause-offscreen className="bg-cbpgray-900 py-8">
      <div className="container mx-auto px-8">
        {/* Título principal de la sección */}
        <SectionTitle title="Inteligencia artificial" icon={<FaRobot />} />

        {/* Descripción de la sección */}
        <p className="mb-12 text-cbpgray-300">
          La IA es parte central de mi forma de desarrollar: trabajo con agentes
          de programación que planifican, editan código y ejecutan tests, y con
          asistentes para investigar, diseñar y revisar. Estas son las
          herramientas que uso en mi día a día.
        </p>

        {/* Grid de herramientas de IA */}
        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2">
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
          <h3 className="mb-8 flex items-center justify-center text-2xl font-bold text-white">
            <span className="text-cbpgray-300">Áreas de estudio actuales</span>
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {areasDeEstudio.map((area) => (
              <div
                key={area.nombre}
                className="rounded-lg border border-cbpgray-700/50 bg-cbpgray-800/50 p-5 transition-colors hover:border-cbpviolet-500/30"
              >
                <div className="mb-3 flex items-center">
                  <div className="mr-3 rounded-lg bg-cbpviolet-500/10 p-2 text-cbpviolet-400">
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
