// Sesiones de ejemplo de la terminal de IA, en cada idioma.
import type { Locale } from "../../../i18n/locale";

export type LineKind = "user" | "think" | "tool" | "out" | "add" | "todo" | "ok";

export type Line = { kind: LineKind; text: string };

export type Session = {
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
const es: Session[] = [
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

const en: Session[] = [
  {
    label: "TDD feature",
    short: "TDD",
    lines: [
      user(
        [
          "Task: automatically close expired auctions.",
          "Acceptance criteria:",
          "- When the deadline passes, close the auction and email the winner.",
          "- With no bids, record it as “unsold”.",
          "Approach: TDD. The full suite must stay green.",
        ].join("\n"),
      ),
      think("Reviewing the auction model and the notification service."),
      tool("Read(app/auctions/models.py, app/notifications/service.py)"),
      out("2 files · 214 lines"),
      think("Plan:"),
      todo("Tests for the acceptance criteria"),
      todo("Scheduler for expired auctions"),
      todo("Closing, notification and the no-bids case"),
      tool("Write(tests/auctions/test_close_expired.py)"),
      add("def test_notifies_winner_when_auction_expires(): ..."),
      add("def test_marks_unsold_when_there_are_no_bids(): ..."),
      add("def test_ignores_auctions_still_open(): ..."),
      tool("Bash(pytest tests/auctions -q)"),
      out("3 failed: the tests define the behavior before the code"),
      tool("Write(app/auctions/scheduler.py)"),
      add("@scheduler.every(seconds=30)"),
      add("async def close_expired_auctions(db: Session):"),
      add("    for auction in expired_auctions(db):"),
      add("        if not auction.bids:"),
      add("            mark_unsold(auction)"),
      add("            continue"),
      add("        await close_and_notify(auction, auction.highest_bid())"),
      tool("Bash(pytest -q)"),
      ok("48 passed: the 3 new ones and the whole existing suite"),
      tool('Bash(git commit -m "feat(auctions): close expired auctions")'),
      ok("Criteria met and covered by tests."),
    ],
    stats: ["2 files", "3 new tests", "48 tests ✓"],
  },
  {
    label: "Parallel subagents",
    short: "Subagents",
    lines: [
      user(
        [
          "Task: pre-release review of the payments module.",
          "Scope: performance, accessibility (WCAG 2.2 AA) and security (OWASP Top 10).",
          "Deliverable: report with findings ranked by severity.",
        ].join("\n"),
      ),
      think("These reviews are independent: one subagent per area."),
      tool("Agent(performance) · Agent(accessibility) · Agent(security)"),
      out("performance    ▰▰▰▰▰▰▰▰▰▰  done"),
      out("accessibility  ▰▰▰▰▰▰▰▰▰▰  done"),
      out("security       ▰▰▰▰▰▰▰▰▰▰  done"),
      think("Consolidating the results:"),
      ok("Performance: indexed queries and paginated responses"),
      ok("Accessibility: labelled forms, visible focus and announced errors"),
      ok("Security: input validation, rate limiting and secure headers"),
      think("No blockers. Writing the report and two optional improvements."),
      tool("Write(docs/release-review.md)"),
      add("## Status: ready for release"),
      add("- Optional: exchange-rate cache (5 min TTL)"),
      add("- Optional: checkout load test on staging"),
      ok("Report delivered to the team."),
    ],
    stats: ["3 subagents", "0 blockers", "Report ready"],
  },
  {
    label: "MCP: Figma and database",
    short: "MCP",
    lines: [
      user(
        [
          "Task: build the “Credit application” view.",
          "Sources: Figma frame and the applications table schema.",
          "Requirement: client validation must mirror the API rules.",
        ].join("\n"),
      ),
      think("Pulling the design and the schema straight from their sources."),
      tool('figma · get_design("Credit application")'),
      out("12 components · 3 states: empty, validating, approved"),
      tool("mysql · describe_table(applications)"),
      out("amount DECIMAL · term_months INT · income DECIMAL · status ENUM"),
      think("Typing the form from the schema and reusing the API rules."),
      tool("Write(CreditForm.tsx, useCreditValidation.ts)"),
      add("const payment = monthlyPayment(amount, rate, termMonths);"),
      add(
        'if (payment > income * 0.4) return error("The payment exceeds 40% of your income");',
      ),
      tool('playwright · screenshot("/credit")'),
      ok("The screen matches the design on desktop and mobile"),
      tool("Bash(npm test)"),
      ok("Validations covered: amount, term and ability to pay"),
    ],
    stats: ["3 MCP servers", "Figma → code", "Real schema"],
  },
  {
    label: "Harness engineering",
    short: "Harness",
    lines: [
      user(
        [
          "Task: set up the repository for agentic development.",
          "Deliverables:",
          "- Project rules in CLAUDE.md",
          "- A skill for the task workflow",
          "- Pre-commit hook with lint and tests",
        ].join("\n"),
      ),
      think("Starting from the existing conventions, scripts and CI."),
      tool("Read(package.json, .github/workflows/ci.yml, README.md)"),
      out("Vitest · Playwright · ESLint · conventional commits"),
      tool("Write(CLAUDE.md)"),
      add("- Conventional commits, one per task"),
      add("- Every change passes lint and tests before the commit"),
      add("- Check UI changes in the browser"),
      tool("Write(.claude/skills/start-task/SKILL.md)"),
      out("Flow: plan → new branch → commit per task → test guide"),
      tool("Write(.husky/pre-commit)"),
      add("npm run lint && npm test"),
      tool('Bash(git commit -m "chore: agent workflow setup")'),
      out("pre-commit: lint ✓ · tests ✓"),
      ok("Rules, skill and hook active for the whole team."),
    ],
    stats: ["Context", "Skills", "Hooks", "Verification"],
  },
];

export const terminalSessions: Record<Locale, Session[]> = { es, en };
