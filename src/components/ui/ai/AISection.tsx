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
import { VscVscode } from "react-icons/vsc";
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
        "Agente de programación de Anthropic que trabaja en la terminal: entiende el repositorio, edita código, ejecuta tests y prepara commits.",
      beneficios: [
        "Tareas completas de varios pasos sobre el proyecto",
        "Reglas, memoria y skills por proyecto",
        "Integración con MCP, git y GitHub",
      ],
    },
    {
      nombre: "ClaudeAI",
      icono: <ClaudeIcon className="text-2xl" />,
      descripcion:
        "Asistente de IA enfocado en razonamiento, análisis y generación de soluciones de código con alto contexto.",
      beneficios: [
        "Excelente análisis y explicación de código",
        "Respuestas estructuradas para tareas complejas",
        "Buen soporte para arquitectura y refactorización",
      ],
    },
    {
      nombre: "Codex",
      icono: <CodexIcon className="text-2xl" />,
      descripcion:
        "Agente de programación de OpenAI para la terminal y la nube que implementa cambios y revisa código sobre el repositorio.",
      beneficios: [
        "Implementación de cambios de punta a punta",
        "Revisión de código y propuestas de mejora",
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
        "Elección libre del modelo de IA",
        "Flujo de trabajo desde la terminal",
      ],
    },
    {
      nombre: "GitHub Copilot",
      icono: <GithubCopilotIcon className="text-2xl" />,
      descripcion:
        "Asistente de programación en pares impulsado por IA para sugerencias de código en tiempo real.",
      beneficios: [
        "Sugerencias de código en tiempo real",
        "Integración con editores populares",
        "Aprendizaje automático contextual",
      ],
    },
    {
      nombre: "ChatGPT",
      icono: <OpenAIIcon className="text-2xl" />,
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
      icono: <GeminiIcon className="text-2xl" />,
      descripcion:
        "Modelo multimodal de Google capaz de entender y generar texto, código e imágenes de manera integrada.",
      beneficios: [
        "Capacidades multimodales avanzadas",
        "Integración con herramientas de Google",
        "Buen rendimiento en tareas de programación",
      ],
    },
    {
      nombre: "Antigravity",
      icono: <AntigravityIcon className="text-2xl" />,
      descripcion:
        "Asistente de IA orientado a productividad para acelerar tareas repetitivas y flujo de desarrollo.",
      beneficios: [
        "Automatización de tareas frecuentes",
        "Mejora de productividad en el ciclo de desarrollo",
        "Soporte para trabajo asistido con IA",
      ],
    },
    {
      nombre: "Windsurf",
      icono: <WindsurfIcon className="text-2xl" />,
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
      nombre: "DeepSeek",
      icono: <DeepSeekIcon className="text-2xl" />,
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
      nombre: "Bolt.new",
      icono: <BoltIcon className="text-2xl" />,
      descripcion:
        "Plataforma para generar proyectos completos usando indicaciones en lenguaje natural.",
      beneficios: [
        "Creación de proyectos desde cero con prompts",
        "Asistencia con IA para estructurar código y archivos",
        "Compatible con varios lenguajes de programación",
      ],
    },
    {
      nombre: "Editores de Código",
      icono: <VscVscode className="text-2xl" />,
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
      nombre: "Agentes de IA",
      icono: <LuBot />,
      descripcion:
        "Agentes que planifican, editan código y ejecutan tareas de varios pasos",
    },
    {
      nombre: "Context Engineering",
      icono: <FaCode />,
      descripcion:
        "Reglas, memoria y skills: darle a la IA el contexto correcto en cada paso",
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
        "Tests y evaluaciones para comprobar que el código generado funciona",
    },
  ];

  return (
    <section id="ai" data-pause-offscreen className="bg-cbpgray-900 py-8">
      <div className="container mx-auto px-8">
        {/* Título principal de la sección */}
        <SectionTitle title="Inteligencia Artificial" icon={<FaRobot />} />

        {/* Descripción de la sección */}
        <p className="mb-12 text-cbpgray-300">
          Utilizo herramientas de IA avanzadas para mejorar la calidad y
          eficiencia del desarrollo de software. Estas son algunas de las
          tecnologías que integro en mi flujo de trabajo diario.
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
            <span className="text-cbpgray-300">Áreas de Estudio Actuales</span>
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
