import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaRedo, FaTerminal } from "react-icons/fa";
import { useRevealOnce } from "../../../hooks/useRevealOnce";

type LineKind = "user" | "think" | "tool" | "out" | "add" | "todo" | "ok";

type Line = { kind: LineKind; text: string };

type Session = {
  label: string;
  // Etiqueta visible en móvil (el nombre completo queda en aria-label)
  short: string;
  lines: Line[];
  stats: string[];
};

const line =
  (kind: LineKind) =>
  (text: string): Line => ({ kind, text });
const user = line("user");
const think = line("think");
const tool = line("tool");
const out = line("out");
const add = line("add");
const todo = line("todo");
const ok = line("ok");

// Recreaciones de sesiones reales con agentes: no son prompts de chat, sino
// trabajo completo de principio a fin (plan, código, pruebas y commit).
const sessions: Session[] = [
  {
    label: "Feature con TDD",
    short: "TDD",
    lines: [
      user(
        [
          "Tarea: cierre automático de subastas vencidas.",
          "Criterios de aceptación:",
          "- Al vencer el plazo, cerrar la subasta y notificar al ganador por correo.",
          "- Sin ofertas, registrarla como «no vendida».",
          "Enfoque: TDD. La suite completa debe permanecer en verde.",
        ].join("\n"),
      ),
      think("Reviso el modelo de subastas y el servicio de notificaciones."),
      tool("Read(app/auctions/models.py, app/notifications/service.py)"),
      out("2 archivos · 214 líneas"),
      think("Plan:"),
      todo("Tests de los criterios de aceptación"),
      todo("Scheduler de subastas vencidas"),
      todo("Cierre, notificación y caso sin ofertas"),
      tool("Write(tests/auctions/test_close_expired.py)"),
      add("def test_notifies_winner_when_auction_expires(): ..."),
      add("def test_marks_unsold_when_there_are_no_bids(): ..."),
      add("def test_ignores_auctions_still_open(): ..."),
      tool("Bash(pytest tests/auctions -q)"),
      out("3 failed: los tests definen el comportamiento antes del código"),
      tool("Write(app/auctions/scheduler.py)"),
      add("@scheduler.every(seconds=30)"),
      add("async def close_expired_auctions(db: Session):"),
      add("    for auction in expired_auctions(db):"),
      add("        if not auction.bids:"),
      add("            mark_unsold(auction)"),
      add("            continue"),
      add("        await close_and_notify(auction, auction.highest_bid())"),
      tool("Bash(pytest -q)"),
      ok("48 passed: los 3 nuevos y toda la suite existente"),
      tool('Bash(git commit -m "feat(auctions): close expired auctions")'),
      ok("Criterios cumplidos y cubiertos por tests."),
    ],
    stats: ["2 archivos", "3 tests nuevos", "48 tests ✓"],
  },
  {
    label: "Subagentes en paralelo",
    short: "Subagentes",
    lines: [
      user(
        [
          "Tarea: revisión previa al release del módulo de pagos.",
          "Alcance: rendimiento, accesibilidad (WCAG 2.2 AA) y seguridad (OWASP Top 10).",
          "Entregable: reporte con hallazgos priorizados por severidad.",
        ].join("\n"),
      ),
      think("Son revisiones independientes: asigno un subagente a cada área."),
      tool("Agent(rendimiento) · Agent(accesibilidad) · Agent(seguridad)"),
      out("rendimiento    ▰▰▰▰▰▰▰▰▰▰  listo"),
      out("accesibilidad  ▰▰▰▰▰▰▰▰▰▰  listo"),
      out("seguridad      ▰▰▰▰▰▰▰▰▰▰  listo"),
      think("Consolido los resultados:"),
      ok("Rendimiento: consultas indexadas y respuestas paginadas"),
      ok(
        "Accesibilidad: formularios con etiquetas, foco visible y errores anunciados",
      ),
      ok("Seguridad: validación de entrada, rate limiting y cabeceras seguras"),
      think("Sin bloqueantes. Documento el reporte y dos mejoras opcionales."),
      tool("Write(docs/release-review.md)"),
      add("## Estado: listo para release"),
      add("- Opcional: caché de tasas de cambio (TTL 5 min)"),
      add("- Opcional: prueba de carga del checkout en staging"),
      ok("Reporte entregado al equipo."),
    ],
    stats: ["3 subagentes", "0 bloqueantes", "Reporte listo"],
  },
  {
    label: "MCP: Figma y base de datos",
    short: "MCP",
    lines: [
      user(
        [
          "Tarea: implementar la vista «Solicitud de crédito».",
          "Fuentes: frame de Figma y esquema de la tabla solicitudes.",
          "Requisito: la validación del cliente debe replicar las reglas de la API.",
        ].join("\n"),
      ),
      think("Obtengo el diseño y el esquema directamente de sus fuentes."),
      tool('figma · get_design("Solicitud de crédito")'),
      out("12 componentes · 3 estados: vacío, validando, aprobado"),
      tool("mysql · describe_table(solicitudes)"),
      out("monto DECIMAL · plazo_meses INT · ingresos DECIMAL · estado ENUM"),
      think(
        "Tipo el formulario a partir del esquema y reutilizo las reglas de la API.",
      ),
      tool("Write(CreditForm.tsx, useCreditValidation.ts)"),
      add("const cuota = calcularCuota(monto, tasa, plazoMeses);"),
      add(
        'if (cuota > ingresos * 0.4) return error("La cuota supera el 40 % de tus ingresos");',
      ),
      tool('playwright · screenshot("/credito")'),
      ok("La pantalla coincide con el diseño en escritorio y móvil"),
      tool("Bash(npm test)"),
      ok("Validaciones cubiertas: monto, plazo y capacidad de pago"),
    ],
    stats: ["3 servidores MCP", "Figma → código", "Esquema real"],
  },
  {
    label: "Harness engineering",
    short: "Harness",
    lines: [
      user(
        [
          "Tarea: configurar el repositorio para desarrollo agéntico.",
          "Entregables:",
          "- Reglas del proyecto en CLAUDE.md",
          "- Skill para el flujo de tareas",
          "- Hook de pre-commit con lint y tests",
        ].join("\n"),
      ),
      think("Parto de las convenciones, los scripts y la CI que ya existen."),
      tool("Read(package.json, .github/workflows/ci.yml, README.md)"),
      out("Vitest · Playwright · ESLint · commits convencionales"),
      tool("Write(CLAUDE.md)"),
      add("- Commits convencionales, uno por tarea"),
      add("- Todo cambio pasa lint y tests antes del commit"),
      add("- Verificar en el navegador los cambios de interfaz"),
      tool("Write(.claude/skills/start-task/SKILL.md)"),
      out("Flujo: planear → rama nueva → commit por tarea → guía de prueba"),
      tool("Write(.husky/pre-commit)"),
      add("npm run lint && npm test"),
      tool('Bash(git commit -m "chore: agent workflow setup")'),
      out("pre-commit: lint ✓ · tests ✓"),
      ok("Reglas, skill y hook activos para todo el equipo."),
    ],
    stats: ["Contexto", "Skills", "Hooks", "Verificación"],
  },
];

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
        <div className="ml-5 bg-green-500/10 pl-2 text-green-300">
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
        <div className="mt-1 pl-5 text-green-400">
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
      className="overflow-hidden rounded-xl border border-cbpgray-700/50 bg-cbpgray-900/80 shadow-[0_0_60px_-20px] shadow-cbpviolet-500/40"
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
            <span className="hidden sm:inline">
              Agente de IA · sesión en vivo
            </span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              replay();
            }}
            aria-label="Repetir"
            className="fx-trigger flex cursor-pointer items-center gap-1.5 text-xs text-cbpgray-400 transition-colors hover:text-cbpviolet-300"
          >
            <FaRedo className="fx-icon fx-spin h-3 w-3" />
            {/* En móvil solo el icono: la barra no daba para todo */}
            <span className="hidden sm:inline">Repetir</span>
          </button>
          {/* Botón real para teclado y lectores; el clic en toda la barra
                sigue funcionando con el mouse */}
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls="ai-terminal-body"
            aria-label={isOpen ? "Ocultar terminal" : "Mostrar terminal"}
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
              aria-label="Sesiones de ejemplo con agentes de IA"
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
              Recreación de flujos reales
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
