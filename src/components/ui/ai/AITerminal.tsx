import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaRedo, FaTerminal } from "react-icons/fa";
import { useRevealOnce } from "../../../hooks/useRevealOnce";
import { locale } from "../../../i18n/locale";
import { t } from "../../../i18n/ui";
import { terminalSessions, type Line, type LineKind } from "./terminalSessions";

const sessions = terminalSessions[locale];

// Pausa (ms) después de mostrar cada tipo de línea
const pauseAfter: Record<LineKind, number> = {
  user: 700,
  think: 750,
  tool: 900,
  out: 300,
  add: 110,
  todo: 220,
  ok: 650,
};
const TYPE_SPEED = 12;
const NEXT_SESSION_DELAY = 5000;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const LineView = ({ item, typed }: { item: Line; typed?: string }) => {
  const text = typed ?? item.text;
  switch (item.kind) {
    case "user":
      return (
        <div className="mb-3 rounded-md border border-cbpviolet-500/30 bg-cbpviolet-500/10 px-3 py-2 text-cbpgray-100">
          <span className="mr-2 text-cbpviolet-300">❯</span>
          {text}
        </div>
      );
    case "think":
      return (
        <div className="mt-2 text-cbpgray-200">
          <span className="mr-2 text-cbpviolet-300">●</span>
          {text}
        </div>
      );
    case "tool":
      return (
        <div className="mt-2 font-semibold text-cbpviolet-200">
          <span className="mr-2 text-cbpviolet-400">⏺</span>
          {text}
        </div>
      );
    case "out":
      return (
        <div className="pl-5 text-cbpgray-400">
          <span className="mr-2 text-cbpgray-600">⎿</span>
          {text}
        </div>
      );
    case "add":
      return (
        <div className="ml-5 bg-green-500/10 pl-2 text-green-300 light:text-green-800">
          <span className="mr-2 select-none">+</span>
          {text}
        </div>
      );
    case "todo":
      return (
        <div className="pl-5 text-cbpgray-300">
          <span className="mr-2 text-cbpgray-500">☐</span>
          {text}
        </div>
      );
    case "ok":
      return (
        <div className="mt-1 pl-5 text-green-400 light:text-green-700">
          <span className="mr-2">✓</span>
          {text}
        </div>
      );
  }
};

export const AITerminal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  // Líneas ya mostradas y caracteres escritos de la línea actual
  const [step, setStep] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  // Rota sola entre sesiones hasta que el usuario elige una
  const [autoAdvance, setAutoAdvance] = useState(true);
  const { ref: containerRef, revealed } = useRevealOnce<HTMLDivElement>();
  const bodyRef = useRef<HTMLDivElement>(null);

  const session = sessions[activeTab];
  const finished = step >= session.lines.length;

  // Con "reducir movimiento" la sesión se muestra completa, sin animación
  useEffect(() => {
    if (prefersReducedMotion()) setStep(session.lines.length);
  }, [session]);

  useEffect(() => {
    if (!revealed || !isOpen || prefersReducedMotion()) return;

    if (finished) {
      if (!autoAdvance) return;
      const timer = setTimeout(() => {
        setActiveTab((tab) => (tab + 1) % sessions.length);
        setStep(0);
        setTypedChars(0);
      }, NEXT_SESSION_DELAY);
      return () => clearTimeout(timer);
    }

    const current = session.lines[step];
    // El prompt del usuario se escribe letra a letra
    if (current.kind === "user" && typedChars < current.text.length) {
      const timer = setTimeout(() => setTypedChars((n) => n + 1), TYPE_SPEED);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(
      () => {
        setStep((n) => n + 1);
        setTypedChars(0);
      },
      step === 0 ? 400 : pauseAfter[session.lines[step - 1].kind],
    );
    return () => clearTimeout(timer);
  }, [revealed, isOpen, step, typedChars, finished, autoAdvance, session]);

  // Sigue el final de la sesión, solo dentro de la terminal (no mueve la página)
  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [step, typedChars]);

  const selectTab = (index: number) => {
    setAutoAdvance(false);
    setActiveTab(index);
    setStep(prefersReducedMotion() ? sessions[index].lines.length : 0);
    setTypedChars(0);
  };

  const replay = () => {
    setAutoAdvance(false);
    setStep(prefersReducedMotion() ? session.lines.length : 0);
    setTypedChars(0);
  };

  const current = session.lines[step];
  const typing = current?.kind === "user" && typedChars > 0;

  return (
    <div
      ref={containerRef}
      className="overflow-hidden rounded-xl border border-cbpgray-700/50 bg-cbpgray-900/80 shadow-[0_0_60px_-20px] shadow-cbpviolet-500/40 light:shadow-[0_4px_16px_-8px] light:shadow-cbpviolet-200/15"
    >
      {/* Barra de la ventana */}
      <div
        className="flex cursor-pointer items-center justify-between gap-3 border-b border-cbpgray-700/50 bg-cbpgray-800/80 px-4 py-2.5"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="hidden gap-1.5 sm:flex" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <FaTerminal className="shrink-0 text-cbpviolet-400" />
          <span className="truncate text-sm font-medium text-cbpgray-200">
            <span className="sm:hidden">Sesión en vivo</span>
            <span className="hidden sm:inline">{t.ai.terminalTitle}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              replay();
            }}
            aria-label={t.ai.replay}
            className="fx-trigger flex cursor-pointer items-center gap-1.5 text-xs text-cbpgray-400 transition-colors hover:text-cbpviolet-300"
          >
            <FaRedo className="fx-icon fx-spin h-3 w-3" />
            {/* En móvil solo el icono: la barra no daba para todo */}
            <span className="hidden sm:inline">{t.ai.replay}</span>
          </button>
          {/* Botón real para teclado y lectores; el clic en toda la barra
                sigue funcionando con el mouse */}
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls="ai-terminal-body"
            aria-label={isOpen ? t.ai.hideTerminal : t.ai.showTerminal}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="cursor-pointer"
          >
            <FaChevronDown
              className={`text-cbpgray-400 transition-transform duration-200 ${isOpen ? "" : "-rotate-90"}`}
            />
          </button>
        </div>
      </div>

      {/* Abrir/cerrar con CSS: la fila del grid pasa de 1fr a 0fr. Cerrado,
            el contenido queda inerte (fuera del foco y de los lectores). */}
      <div
        id="ai-terminal-body"
        inert={!isOpen}
        className={`grid transition-[grid-template-rows,opacity] duration-200 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          {/* Sesiones. En móvil, un degradado a la derecha avisa que hay más */}
          <div className="relative after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-8 after:bg-gradient-to-l after:from-cbpgray-900 after:to-transparent sm:after:hidden">
            <div
              role="tablist"
              aria-label={t.ai.sessions}
              className="cbp-scrollbar flex gap-1 overflow-x-auto border-b border-cbpgray-700/50 px-2 pt-2"
            >
              {sessions.map((item, index) => (
                <button
                  key={item.label}
                  type="button"
                  role="tab"
                  id={`ai-session-tab-${index}`}
                  aria-selected={activeTab === index}
                  aria-controls="ai-session-panel"
                  aria-label={item.label}
                  onClick={() => selectTab(index)}
                  className={`shrink-0 cursor-pointer border-b-2 px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                    activeTab === index
                      ? "border-cbpviolet-400 bg-cbpviolet-500/10 text-cbpviolet-200"
                      : "border-transparent text-cbpgray-400 hover:text-cbpgray-200"
                  }`}
                >
                  <span className="sm:hidden">{item.short}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div
            ref={bodyRef}
            id="ai-session-panel"
            // Región con scroll: alcanzable y desplazable con el teclado
            tabIndex={0}
            role="tabpanel"
            aria-labelledby={`ai-session-tab-${activeTab}`}
            className="cbp-scrollbar h-[26rem] overflow-y-auto p-4 font-mono text-xs leading-relaxed break-words whitespace-pre-wrap sm:text-sm"
          >
            {session.lines.slice(0, step).map((item, index) => (
              <LineView key={`${activeTab}-${index}`} item={item} />
            ))}
            {typing && (
              <LineView
                item={current}
                typed={current.text.slice(0, typedChars)}
              />
            )}
            {!finished && (
              <span
                aria-hidden="true"
                className="ml-5 inline-block h-4 w-2 animate-pulse bg-cbpviolet-400 align-middle"
              />
            )}
          </div>

          {/* Barra de estado */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-cbpgray-700/50 bg-cbpgray-800/60 px-4 py-2 text-xs text-cbpgray-400">
            <span className="flex items-center gap-1.5">
              <span
                className={`h-2 w-2 rounded-full ${finished ? "bg-green-400" : "animate-pulse bg-cbpviolet-400"}`}
              />
              {finished ? "Completado" : "Trabajando…"}
            </span>
            {finished &&
              session.stats.map((stat) => <span key={stat}>{stat}</span>)}
            <span className="ml-auto hidden text-cbpgray-400 sm:inline">
              {t.ai.recreation}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
