import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "../../../utils/visibility";

// Diagrama de flujo de la orquestación. Se lee en el mismo orden que los
// pasos del panel: Tarea → Orquestador → subagentes (con su herramienta) →
// Verificación → Cambio verificado. Cada fase ilumina su parte y lo ya hecho
// queda marcado, así se ve en qué punto va el proceso.
// Fases: 0 recibe · 1 planifica · 2 delega · 3 ejecuta · 4 verifica · 5 entrega

type Box = { cx: number; cy: number; w: number; h: number };
type Layout = {
  vertical: boolean;
  width: number;
  height: number;
  task: Box;
  orch: Box;
  agents: Box[];
  verify: Box;
  result: Box;
};

// Ancho: columnas de izquierda a derecha. Estrecho (móvil): de arriba abajo.
const WIDE: Layout = {
  vertical: false,
  width: 660,
  height: 330,
  task: { cx: 40, cy: 165, w: 64, h: 34 },
  orch: { cx: 165, cy: 165, w: 112, h: 96 },
  agents: [60, 165, 270].map((cy) => ({ cx: 332, cy, w: 128, h: 82 })),
  verify: { cx: 486, cy: 165, w: 106, h: 140 },
  result: { cx: 608, cy: 165, w: 96, h: 72 },
};

const NARROW: Layout = {
  vertical: true,
  width: 340,
  height: 498,
  task: { cx: 170, cy: 22, w: 96, h: 32 },
  orch: { cx: 170, cy: 102, w: 180, h: 80 },
  agents: [58, 170, 282].map((cx) => ({ cx, cy: 232, w: 104, h: 84 })),
  verify: { cx: 170, cy: 355, w: 230, h: 86 },
  result: { cx: 170, cy: 458, w: 210, h: 56 },
};

const AGENTS = [
  { name: "Frontend", tool: "Figma" },
  { name: "Backend", tool: "Base de datos" },
  { name: "QA", tool: "Navegador" },
];
const CHECKS = ["Tests", "Typecheck", "Lint", "Revisión"];

// Tiempos dentro de cada fase (segundos)
const PACKET_DURATION = 1.1;
const AGENT_STAGGER = 0.3;
// Cada subagente pasa a verde cuando su paquete llega a Verificación
const checkDelay = (index: number) =>
  PACKET_DURATION + 0.15 + index * AGENT_STAGGER;
// Los ✓ de Verificación se marcan uno a uno desde que llega el primer paquete
const checkMarkDelay = (index: number) => PACKET_DURATION + 0.3 + index * 0.25;

const left = (b: Box) => b.cx - b.w / 2;
const top = (b: Box) => b.cy - b.h / 2;

// Curva entre la salida de un nodo y la entrada del siguiente
const edgePath = (from: Box, to: Box, vertical: boolean) => {
  if (vertical) {
    const ax = from.cx;
    const ay = from.cy + from.h / 2;
    const bx = to.cx;
    const by = to.cy - to.h / 2;
    const dy = (by - ay) / 2;
    return `M${ax} ${ay} C${ax} ${ay + dy} ${bx} ${by - dy} ${bx} ${by}`;
  }
  const ax = from.cx + from.w / 2;
  const ay = from.cy;
  const bx = to.cx - to.w / 2;
  const by = to.cy;
  const dx = (bx - ax) / 2;
  return `M${ax} ${ay} C${ax + dx} ${ay} ${bx - dx} ${by} ${bx} ${by}`;
};

type State = "idle" | "active" | "done" | "ok";

export const AgentFlow = ({
  phase,
  label,
}: {
  phase: number;
  label: string;
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [layout, setLayout] = useState<Layout>(WIDE);

  // Diseño según el ancho disponible, no el de la ventana
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      setLayout(entry.contentRect.width < 480 ? NARROW : WIDE);
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // Paquetes que viajan por las conexiones activas de la fase
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || prefersReducedMotion()) return;
    const routes: { edge: string; packet: string; delay: number }[] =
      phase === 0
        ? [{ edge: "task", packet: "task", delay: 0.2 }]
        : phase === 2
          ? AGENTS.map((_, i) => ({
              edge: `delegate-${i}`,
              packet: `delegate-${i}`,
              delay: 0.2 + i * AGENT_STAGGER,
            }))
          : phase === 4
            ? AGENTS.map((_, i) => ({
                edge: `report-${i}`,
                packet: `report-${i}`,
                delay: 0.15 + i * AGENT_STAGGER,
              }))
            : phase === 5
              ? [{ edge: "deliver", packet: "deliver", delay: 0.2 }]
              : [];

    const tweens = routes.flatMap(({ edge, packet, delay }) => {
      const path = svg.querySelector<SVGPathElement>(`[data-edge="${edge}"]`);
      const dot = svg.querySelector<SVGGElement>(`[data-packet="${packet}"]`);
      if (!path || !dot || typeof path.getTotalLength !== "function") {
        return [];
      }
      const length = path.getTotalLength();
      const progress = { t: 0 };
      return gsap.to(progress, {
        t: 1,
        duration: PACKET_DURATION,
        delay,
        ease: "power2.inOut",
        onStart: () => {
          dot.style.opacity = "1";
        },
        onUpdate: () => {
          const point = path.getPointAtLength(progress.t * length);
          dot.setAttribute("transform", `translate(${point.x} ${point.y})`);
        },
        // Al llegar, el paquete se funde con el nodo
        onComplete: () => {
          gsap.to(dot, { opacity: 0, duration: 0.25 });
        },
      });
    });

    return () => {
      tweens.forEach((tween) => tween.kill());
      svg.querySelectorAll<SVGGElement>("[data-packet]").forEach((dot) => {
        gsap.killTweensOf(dot);
        dot.style.opacity = "0";
      });
    };
  }, [phase, layout]);

  const { vertical, task, orch, agents, verify, result } = layout;

  const taskState: State = phase === 0 ? "active" : "done";
  const orchState: State =
    phase === 0 ? "idle" : phase <= 2 ? "active" : "done";
  const agentState: State = phase < 2 ? "idle" : phase < 4 ? "active" : "ok";
  const verifyState: State = phase < 4 ? "idle" : phase === 4 ? "active" : "ok";
  const resultState: State = phase < 5 ? "idle" : "ok";

  // En la fase 4 cada subagente pasa a verde cuando su paquete llega
  const agentDelay = (index: number) =>
    phase === 4 ? `${checkDelay(index)}s` : "0s";

  return (
    <div ref={rootRef} className="agent-flow w-full">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        role="img"
        aria-label={label}
        className="mx-auto block h-auto w-full"
        style={{ maxWidth: vertical ? 380 : 760 }}
      >
        {/* Conexiones */}
        <path
          data-edge="task"
          data-state={phase === 0 ? "active" : "done"}
          className="flow-edge"
          d={edgePath(task, orch, vertical)}
        />
        {agents.map((agent, i) => (
          <path
            key={`delegate-${i}`}
            data-edge={`delegate-${i}`}
            data-state={phase < 2 ? "idle" : phase === 2 ? "active" : "done"}
            className="flow-edge"
            d={edgePath(orch, agent, vertical)}
          />
        ))}
        {agents.map((agent, i) => (
          <path
            key={`report-${i}`}
            data-edge={`report-${i}`}
            data-state={phase < 4 ? "idle" : phase === 4 ? "active" : "ok"}
            className="flow-edge"
            d={edgePath(agent, verify, vertical)}
          />
        ))}
        <path
          data-edge="deliver"
          data-state={phase < 5 ? "idle" : "ok"}
          className="flow-edge"
          d={edgePath(verify, result, vertical)}
        />

        {/* Tarea */}
        <g className="flow-node" data-state={taskState}>
          <rect
            className="card"
            x={left(task)}
            y={top(task)}
            width={task.w}
            height={task.h}
            rx={task.h / 2}
          />
          <text
            className="title"
            x={task.cx}
            y={task.cy + 4}
            textAnchor="middle"
          >
            Tarea
          </text>
        </g>

        {/* Orquestador: al planificar aparecen las subtareas 1, 2 y 3 */}
        <g className="flow-node" data-state={orchState}>
          <rect
            className="card"
            x={left(orch)}
            y={top(orch)}
            width={orch.w}
            height={orch.h}
            rx={14}
          />
          <text
            className="title"
            x={orch.cx}
            y={top(orch) + (vertical ? 24 : 26)}
            textAnchor="middle"
          >
            Orquestador
          </text>
          {!vertical && (
            <text
              className="caption"
              x={orch.cx}
              y={top(orch) + 42}
              textAnchor="middle"
            >
              Planifica y reparte
            </text>
          )}
          {AGENTS.map((_, i) => (
            <g
              key={i}
              className="flow-subtask"
              data-visible={phase >= 1}
              style={{
                transitionDelay: phase === 1 ? `${0.3 + i * 0.25}s` : "0s",
              }}
              transform={`translate(${orch.cx + (i - 1) * 26} ${top(orch) + orch.h - (vertical ? 22 : 24)})`}
            >
              <circle r={9} />
              <text y={3.5} textAnchor="middle">
                {i + 1}
              </text>
            </g>
          ))}
        </g>

        {/* Subagentes con su herramienta (vía MCP) */}
        {agents.map((agent, i) => {
          const x = left(agent);
          const y = top(agent);
          return (
            <g
              key={AGENTS[i].name}
              className="flow-node"
              data-state={agentState}
              style={{ transitionDelay: agentDelay(i) }}
            >
              <rect
                className="card"
                x={x}
                y={y}
                width={agent.w}
                height={agent.h}
                rx={12}
                style={{ transitionDelay: agentDelay(i) }}
              />
              <g
                className="flow-subtask"
                data-visible={phase >= 2}
                style={{
                  transitionDelay:
                    phase === 2
                      ? `${0.2 + i * AGENT_STAGGER + PACKET_DURATION}s`
                      : "0s",
                }}
                transform={`translate(${x + 16} ${y + 18})`}
              >
                <circle r={8} />
                <text y={3.5} textAnchor="middle">
                  {i + 1}
                </text>
              </g>
              <text className="title" x={x + 30} y={y + 22}>
                {AGENTS[i].name}
              </text>
              {/* Herramienta */}
              <g
                className="flow-tool"
                data-state={
                  phase < 3 ? "idle" : phase === 3 ? "active" : "done"
                }
              >
                <rect
                  x={x + 8}
                  y={y + 32}
                  width={agent.w - 16}
                  height={20}
                  rx={10}
                />
                <text x={agent.cx} y={y + 45.5} textAnchor="middle">
                  {AGENTS[i].tool}
                </text>
              </g>
              {/* Estado: progreso mientras trabaja, ✓ cuando se verifica */}
              <rect
                className="flow-track"
                x={x + 10}
                y={y + agent.h - 18}
                width={agent.w - 20}
                height={4}
                rx={2}
                data-hidden={phase >= 4}
                style={{ transitionDelay: agentDelay(i) }}
              />
              {phase === 3 && (
                <rect
                  key={`progress-${phase}`}
                  className="flow-progress"
                  x={x + 10}
                  y={y + agent.h - 18}
                  width={agent.w - 20}
                  height={4}
                  rx={2}
                  style={{ animationDuration: `${2.2 + i * 0.4}s` }}
                />
              )}
              <text
                className="flow-verified"
                data-visible={phase >= 4}
                x={agent.cx}
                y={y + agent.h - 12}
                textAnchor="middle"
                style={{ transitionDelay: agentDelay(i) }}
              >
                ✓ Verificado
              </text>
            </g>
          );
        })}

        {/* Verificación: tests, lint y revisión */}
        <g className="flow-node" data-state={verifyState}>
          <rect
            className="card"
            x={left(verify)}
            y={top(verify)}
            width={verify.w}
            height={verify.h}
            rx={14}
          />
          <text
            className="title"
            x={verify.cx}
            y={top(verify) + 22}
            textAnchor="middle"
          >
            Verificación
          </text>
          {CHECKS.map((check, i) => {
            // Ancho: una columna. Estrecho: cuadrícula de 2 × 2
            const cx = vertical
              ? left(verify) + 42 + (i % 2) * 110
              : left(verify) + 20;
            const cy = vertical
              ? top(verify) + 46 + Math.floor(i / 2) * 24
              : top(verify) + 46 + i * 24;
            return (
              <g key={check}>
                <circle
                  className="flow-check"
                  data-visible={phase >= 4}
                  cx={cx}
                  cy={cy}
                  r={7}
                  style={{
                    transitionDelay:
                      phase === 4 ? `${checkMarkDelay(i)}s` : "0s",
                  }}
                />
                <path
                  className="flow-check-mark"
                  data-visible={phase >= 4}
                  d={`M${cx - 3.2} ${cy} l2.2 2.3 l4.2 -4.6`}
                  style={{
                    transitionDelay:
                      phase === 4 ? `${checkMarkDelay(i)}s` : "0s",
                  }}
                />
                <text className="caption" x={cx + 13} y={cy + 4}>
                  {check}
                </text>
              </g>
            );
          })}
        </g>

        {/* Resultado */}
        <g
          className="flow-node"
          data-state={resultState}
          style={{ transitionDelay: phase === 5 ? "1.2s" : "0s" }}
        >
          <rect
            className="card"
            x={left(result)}
            y={top(result)}
            width={result.w}
            height={result.h}
            rx={14}
            style={{ transitionDelay: phase === 5 ? "1.2s" : "0s" }}
          />
          {vertical ? (
            <>
              <text
                className="title"
                x={result.cx}
                y={result.cy - 2}
                textAnchor="middle"
              >
                Cambio verificado
              </text>
              <text
                className="caption"
                x={result.cx}
                y={result.cy + 15}
                textAnchor="middle"
              >
                Listo para revisión
              </text>
            </>
          ) : (
            <>
              <text
                className="title"
                x={result.cx}
                y={result.cy - 4}
                textAnchor="middle"
              >
                Cambio
              </text>
              <text
                className="title"
                x={result.cx}
                y={result.cy + 12}
                textAnchor="middle"
              >
                verificado
              </text>
            </>
          )}
        </g>

        {/* Paquetes (los mueve GSAP por su conexión) */}
        <g data-packet="task" className="flow-packet" style={{ opacity: 0 }}>
          <circle r={5} />
        </g>
        {AGENTS.map((_, i) => (
          <g
            key={`dp-${i}`}
            data-packet={`delegate-${i}`}
            className="flow-packet"
            style={{ opacity: 0 }}
          >
            <circle r={8} />
            <text y={3.5} textAnchor="middle">
              {i + 1}
            </text>
          </g>
        ))}
        {AGENTS.map((_, i) => (
          <g
            key={`rp-${i}`}
            data-packet={`report-${i}`}
            className="flow-packet"
            style={{ opacity: 0 }}
          >
            <circle r={5} />
          </g>
        ))}
        <g
          data-packet="deliver"
          className="flow-packet flow-packet--ok"
          style={{ opacity: 0 }}
        >
          <circle r={5} />
        </g>
      </svg>
    </div>
  );
};
