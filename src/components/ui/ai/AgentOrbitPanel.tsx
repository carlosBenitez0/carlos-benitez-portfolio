import { useEffect, useState } from "react";
import { useRevealOnce } from "../../../hooks/useRevealOnce";
import { AgentFlow } from "./AgentFlow";

// Tiempo por paso: lo justo para leer el texto y ver la animación del diagrama
const PHASE_MS = 4500;

const steps = [
  {
    title: "Recibe la tarea",
    text: "El orquestador recibe el objetivo y el contexto del proyecto: reglas, memoria y skills.",
  },
  {
    title: "Planifica",
    text: "Divide el trabajo en subtareas independientes que pueden avanzar en paralelo.",
  },
  {
    title: "Delega",
    text: "Asigna cada subtarea a un subagente especializado: frontend, backend y QA.",
  },
  {
    title: "Ejecuta con herramientas",
    text: "Los subagentes trabajan a la vez y usan herramientas reales vía MCP: Figma, la base de datos y el navegador.",
  },
  {
    title: "Verifica",
    text: "Cada resultado pasa tests, typecheck, lint y revisión antes de darse por bueno.",
  },
  {
    title: "Integra y entrega",
    text: "Los resultados verificados se integran en un único cambio, listo para revisión.",
  },
];

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const AgentOrbitPanel = () => {
  const { ref, revealed } = useRevealOnce<HTMLDivElement>();
  const [phase, setPhase] = useState(0);
  const [autoplay] = useState(() => !prefersReducedMotion());

  // Avanza de fase sola; elegir un paso reinicia el temporizador desde ahí
  useEffect(() => {
    if (!revealed || !autoplay) return;
    const timer = setTimeout(
      () => setPhase((current) => (current + 1) % steps.length),
      PHASE_MS,
    );
    return () => clearTimeout(timer);
  }, [revealed, autoplay, phase]);

  const current = steps[phase];

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-xl border border-cbpgray-700/50 bg-cbpgray-900/80"
    >
      <div className="border-b border-cbpgray-700/50 bg-cbpgray-800/80 px-5 py-3">
        <h3 className="font-medium text-cbpgray-100">Cómo orquesto agentes</h3>
        <p className="text-sm text-cbpgray-400">
          Mi flujo de trabajo: un agente coordina, los subagentes ejecutan en
          paralelo y nada se entrega sin verificar.
        </p>
      </div>

      <div className="grid lg:grid-cols-[19rem_minmax(0,1fr)]">
        {/* Pasos: en pantallas grandes, lista completa */}
        <ol className="hidden flex-col gap-1 border-r border-cbpgray-700/50 p-3 lg:flex">
          {steps.map((step, index) => {
            const active = index === phase;
            return (
              <li key={step.title}>
                <button
                  type="button"
                  aria-current={active ? "step" : undefined}
                  onClick={() => setPhase(index)}
                  className={`relative w-full cursor-pointer overflow-hidden rounded-lg px-3 py-2.5 text-left transition-colors ${
                    active ? "bg-cbpviolet-500/15" : "hover:bg-cbpgray-800/60"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                        active
                          ? "bg-cbpviolet-400 text-cbpgray-950"
                          : index < phase
                            ? "bg-cbpviolet-500/30 text-cbpviolet-100"
                            : "bg-cbpgray-800 text-cbpgray-400"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={`text-sm font-medium ${active ? "text-cbpviolet-100" : "text-cbpgray-300"}`}
                    >
                      {step.title}
                    </span>
                  </span>
                  <span
                    className={`grid transition-[grid-template-rows] duration-300 ${active ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <span className="overflow-hidden pl-9 text-xs leading-relaxed text-cbpgray-400">
                      <span className="block pt-1">{step.text}</span>
                    </span>
                  </span>
                  {/* Progreso de la fase actual */}
                  {active && autoplay && revealed && (
                    <span
                      key={phase}
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 h-0.5 w-full origin-left animate-[phase-progress_linear_forwards] bg-cbpviolet-400"
                      style={{ animationDuration: `${PHASE_MS}ms` }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ol>

        {/* Pasos: en pantallas chicas, solo el actual */}
        <div className="border-b border-cbpgray-700/50 px-5 py-3 lg:hidden">
          <p className="text-sm font-medium text-cbpviolet-100">
            {phase + 1}. {current.title}
          </p>
          <p className="mt-1 min-h-10 text-xs leading-relaxed text-cbpgray-400">
            {current.text}
          </p>
          <div className="mt-2 flex gap-1.5">
            {steps.map((step, index) => (
              <button
                key={step.title}
                type="button"
                aria-label={`Paso ${index + 1}: ${step.title}`}
                aria-current={index === phase ? "step" : undefined}
                onClick={() => setPhase(index)}
                className={`h-1.5 flex-1 cursor-pointer rounded-full transition-colors ${index <= phase ? "bg-cbpviolet-400" : "bg-cbpgray-700"}`}
              />
            ))}
          </div>
        </div>

        <div className="relative flex items-center bg-[radial-gradient(circle_at_50%_50%,rgba(123,44,191,0.18),transparent_65%)] p-4 sm:p-6 lg:min-h-[26rem]">
          <AgentFlow
            phase={phase}
            label={`Diagrama de la orquestación, paso ${phase + 1} de ${steps.length}: ${current.title}. ${current.text}`}
          />
        </div>
      </div>
    </div>
  );
};
