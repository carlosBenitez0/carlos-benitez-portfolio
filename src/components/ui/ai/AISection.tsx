// Importación de componentes de interfaz de usuario personalizados
import { SectionTitle } from "../SectionTitle";
// Importación del componente de tarjeta de herramientas de IA
import { AIToolCard } from "./AIToolCard";
// Importación del componente de terminal interactivo
import { AITerminal } from "./AITerminal";
import { AgentOrbitPanel } from "./AgentOrbitPanel";
// Importación de iconos de la biblioteca react-icons
import { FaRobot, FaCode, FaBrain } from "react-icons/fa";
import { LuBot } from "react-icons/lu";
import { FaVialCircleCheck } from "react-icons/fa6";
import {
  ClaudeCodeIcon,
  ClaudeIcon,
  CodexIcon,
  GeminiIcon,
  GithubCopilotIcon,
  OpenAIIcon,
} from "./brandIcons";
import type { ReactNode } from "react";
import { ai } from "../../../content/site";

const toolIcons: Record<string, ReactNode> = {
  "Claude Code": <ClaudeCodeIcon className="text-2xl" />,
  Claude: <ClaudeIcon className="text-2xl" />,
  Codex: <CodexIcon className="text-2xl" />,
  "GitHub Copilot": <GithubCopilotIcon className="text-2xl" />,
  ChatGPT: <OpenAIIcon className="text-2xl" />,
  Gemini: <GeminiIcon className="text-2xl" />,
};

const studyAreaIcons: Record<string, ReactNode> = {
  "Agentes de IA": <LuBot />,
  "Context Engineering": <FaCode />,
  MCP: <FaBrain />,
  "Evals y verificación": <FaVialCircleCheck />,
};

/**
 * Componente AISection
 *
 * Este componente muestra una sección que destaca las herramientas de IA que utilizo
 * en mi flujo de desarrollo. Incluye tarjetas de herramientas y un terminal interactivo
 * que muestra ejemplos de uso de IA.
 */
export const AISection = () => {
  // Los textos viven en src/content/site.ts; aquí solo se les pone el icono
  const herramientas = ai.tools.map((tool) => ({
    ...tool,
    icono: toolIcons[tool.nombre],
  }));
  const areasDeEstudio = ai.studyAreas.map((area) => ({
    ...area,
    icono: studyAreaIcons[area.nombre],
  }));

  return (
    <section id="ai" data-pause-offscreen className="bg-cbpgray-900 py-8">
      <div className="container mx-auto px-4 md:px-8">
        {/* Título principal de la sección */}
        <SectionTitle
          title="Inteligencia artificial"
          icon={<FaRobot className="fx-icon fx-beep" />}
          // Las tarjetas aparecen con su propia animación al entrar en
          // pantalla: el encabezado va sin revelado para no desfasarse
          revealOnScroll={false}
        />

        {/* Descripción de la sección */}
        <p className="mb-12 text-cbpgray-300">{ai.intro}</p>

        {/* Grid de herramientas de IA */}
        <div className="mb-16 grid grid-cols-2 gap-3 md:gap-6">
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
        <div className="mb-16 space-y-6">
          <AITerminal />
          <AgentOrbitPanel />
        </div>

        {/* Sección de estudios actuales */}
        <div className="mt-20">
          <h3 className="mb-8 flex items-center justify-center text-2xl font-bold text-ink">
            <span className="text-cbpgray-300">Áreas de estudio actuales</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {areasDeEstudio.map((area) => (
              <div
                key={area.nombre}
                className="fx-trigger rounded-lg border border-cbpgray-700/50 bg-cbpgray-800/50 p-4 transition-[border-color,translate] duration-300 hover:-translate-y-1 hover:border-cbpviolet-500/30 motion-reduce:hover:translate-y-0 md:p-5"
              >
                <div className="mb-3 flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-0">
                  <div className="fx-icon fx-tilt rounded-lg bg-cbpviolet-500/10 p-2 text-cbpviolet-400 md:mr-3">
                    {area.icono}
                  </div>
                  <h4 className="text-sm leading-tight font-semibold text-ink md:text-lg">
                    {area.nombre}
                  </h4>
                </div>
                <p className="text-xs text-cbpgray-300 md:text-sm">
                  {area.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
