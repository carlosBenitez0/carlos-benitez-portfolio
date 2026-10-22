import { useEffect, useRef } from "react";
import * as THREE from "three";
import { onVisibilityChange } from "../../../utils/visibility";

export const PHASE_DURATION = 3.2; // segundos por fase

// Fases de la ilustración (las mismas que lista el panel):
// 0 recibe la tarea · 1 planifica · 2 delega · 3 ejecuta con herramientas
// 4 verifica · 5 integra y entrega
const VIOLET = 0x9d4edd;
const LILAC = 0xe0aaff;
const GREEN = 0x4ade80;
const BLUE = 0x60a5fa;

type Side = "left" | "right" | "above" | "below";

// Cada etiqueta va hacia afuera de su nodo para no encimarse con las demás
const AGENTS: { name: string; tool: string; angle: number; side: Side }[] = [
  { name: "Frontend", tool: "Figma", angle: Math.PI / 2, side: "right" },
  {
    name: "Backend",
    tool: "Base de datos",
    angle: Math.PI * (7 / 6),
    side: "left",
  },
  { name: "QA", tool: "Navegador", angle: Math.PI * (11 / 6), side: "right" },
];
const AGENT_RADIUS = 2.5;
const TOOL_RADIUS = 4.4;
// La tarea entra por la izquierda y el cambio verificado sale por la derecha
const TASK_POINT = new THREE.Vector3(-6, 0, 0);
const RESULT_POINT = new THREE.Vector3(6, 0, 0);
// Medio ancho y medio alto que siempre deben caber en cuadro
const HALF_WIDTH = 9;
const HALF_WIDTH_MOBILE = 7.6;
const HALF_HEIGHT = 4.9;

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
const ease = (t: number) => t * t * (3 - 2 * t);
// Va de 0 a 1 y vuelve, `times` veces
const pingPong = (t: number, times: number) => {
  const x = (t * times) % 1;
  return x < 0.5 ? x * 2 : 2 - x * 2;
};

// Halo radial dibujado en un canvas (sin imágenes externas ni data: URLs)
const createGlowTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.25, "rgba(255,255,255,0.45)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
};

const glowSprite = (
  texture: THREE.Texture,
  color: number,
  scale: number,
  opacity: number,
) => {
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      color,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  sprite.scale.setScalar(scale);
  return sprite;
};

const lineBetween = (color: number, opacity: number) =>
  new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
  );

const setLine = (line: THREE.Line, from: THREE.Vector3, to: THREE.Vector3) => {
  const positions = line.geometry.attributes.position as THREE.BufferAttribute;
  positions.setXYZ(0, from.x, from.y, from.z);
  positions.setXYZ(1, to.x, to.y, to.z);
  positions.needsUpdate = true;
};

const lineOpacity = (line: THREE.Line, opacity: number) => {
  (line.material as THREE.LineBasicMaterial).opacity = opacity;
};

const labelClass =
  "pointer-events-none absolute top-0 left-0 rounded-md border px-1.5 py-0.5 text-[10px] sm:px-2 sm:text-[11px] font-medium whitespace-nowrap backdrop-blur-sm transition-[color,border-color,opacity] duration-500 will-change-transform";

export default function AgentOrbit({ phase }: { phase: number }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const coreLabelRef = useRef<HTMLSpanElement>(null);
  const taskLabelRef = useRef<HTMLSpanElement>(null);
  const resultLabelRef = useRef<HTMLSpanElement>(null);
  const agentLabelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const toolLabelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  // La fase llega por props; el bucle de animación la lee de estas refs
  const phaseRef = useRef(phase);
  const phaseStartRef = useRef(0);
  const elapsedRef = useRef(0);
  const drawRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    phaseRef.current = phase;
    phaseStartRef.current = elapsedRef.current;
    // Sin bucle (movimiento reducido o pausado) se redibuja una vez
    drawRef.current?.();
  }, [phase]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      return; // Sin WebGL: el panel sigue explicando las fases con texto
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.style.display = "block";
    mount.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    const root = new THREE.Group();
    scene.add(root);
    const glowTexture = createGlowTexture();

    // Orquestador
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1, 1),
      new THREE.MeshBasicMaterial({
        color: VIOLET,
        wireframe: true,
        transparent: true,
        opacity: 0.9,
      }),
    );
    const innerCore = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.5, 0),
      new THREE.MeshBasicMaterial({ color: LILAC, wireframe: true }),
    );
    const coreGlow = glowSprite(glowTexture, VIOLET, 4, 0.5);
    root.add(
      core,
      innerCore,
      coreGlow,
      glowSprite(glowTexture, LILAC, 1.6, 0.6),
    );

    // Órbita de los subagentes
    const ringPoints = Array.from({ length: 129 }, (_, i) => {
      const angle = (i / 128) * Math.PI * 2;
      return new THREE.Vector3(
        Math.cos(angle) * AGENT_RADIUS,
        Math.sin(angle) * AGENT_RADIUS,
        0,
      );
    });
    root.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(ringPoints),
        new THREE.LineBasicMaterial({
          color: LILAC,
          transparent: true,
          opacity: 0.15,
        }),
      ),
    );

    // Subagentes, sus herramientas MCP y los pulsos de trabajo
    const agents = AGENTS.map(() => {
      const nodeMaterial = new THREE.MeshBasicMaterial({ color: LILAC });
      const node = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.26, 0),
        nodeMaterial,
      );
      const nodeGlow = glowSprite(glowTexture, LILAC, 1.4, 0.7);
      const toolMaterial = new THREE.MeshBasicMaterial({
        color: BLUE,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      });
      const tool = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.42, 0.42),
        toolMaterial,
      );
      const coreLink = lineBetween(LILAC, 0.2);
      const toolLink = lineBetween(BLUE, 0.1);
      const pulse = glowSprite(glowTexture, LILAC, 0.6, 1);
      root.add(node, nodeGlow, tool, coreLink, toolLink, pulse);
      return {
        node,
        nodeMaterial,
        nodeGlow,
        tool,
        toolMaterial,
        coreLink,
        toolLink,
        pulse,
        position: new THREE.Vector3(),
        toolPosition: new THREE.Vector3(),
      };
    });

    // Entrada de la tarea y salida del resultado
    const origin = new THREE.Vector3();
    const taskLink = lineBetween(LILAC, 0);
    const resultLink = lineBetween(GREEN, 0);
    setLine(taskLink, TASK_POINT, origin);
    setLine(resultLink, origin, RESULT_POINT);
    const flowPulse = glowSprite(glowTexture, LILAC, 0.8, 1);
    root.add(taskLink, resultLink, flowPulse);

    // Partículas de fondo
    const particleCount = 500;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const point = new THREE.Vector3()
        .randomDirection()
        .multiplyScalar(5.5 + Math.random() * 3);
      positions.set([point.x, point.y, point.z], i * 3);
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    const particles = new THREE.Points(
      particlesGeometry,
      new THREE.PointsMaterial({
        color: LILAC,
        size: 0.03,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      }),
    );
    scene.add(particles);

    // Inclinación suave hacia el puntero
    const pointer = { x: 0, y: 0 };
    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let width = 0;
    let height = 0;

    // Coloca una etiqueta HTML sobre un punto 3D
    const projected = new THREE.Vector3();
    const placeLabel = (
      label: HTMLElement | null | undefined,
      point: THREE.Vector3,
      side: Side,
    ) => {
      if (!label || !width) return;
      projected.copy(point);
      root.localToWorld(projected);
      projected.project(camera);
      const x = ((projected.x + 1) / 2) * width;
      const y = ((1 - projected.y) / 2) * height;
      const gap = 16;
      label.style.transform =
        side === "right"
          ? `translate(${x + gap}px, ${y}px) translate(0, -50%)`
          : side === "left"
            ? `translate(${x - gap}px, ${y}px) translate(-100%, -50%)`
            : side === "above"
              ? `translate(${x}px, ${y - gap}px) translate(-50%, -100%)`
              : `translate(${x}px, ${y + gap}px) translate(-50%, 0)`;
    };

    const lilac = new THREE.Color(LILAC);
    const green = new THREE.Color(GREEN);

    const update = (time: number) => {
      const currentPhase = phaseRef.current;
      const progress = clamp01((time - phaseStartRef.current) / PHASE_DURATION);

      // Rotación tranquila: la escena debe leerse, no marear
      root.rotation.y +=
        (Math.sin(time * 0.25) * 0.25 + pointer.x * 0.2 - root.rotation.y) *
        0.05;
      root.rotation.x += (pointer.y * 0.15 - root.rotation.x) * 0.05;
      root.updateMatrixWorld();
      particles.rotation.y = time * 0.02;

      // El núcleo gira más rápido mientras planifica
      const spin = currentPhase === 1 ? 1.4 : 0.35;
      core.rotation.set(time * 0.3 * spin, time * 0.6 * spin, 0);
      innerCore.rotation.set(0, -time * 0.8 * spin, 0);
      const coreBoost =
        currentPhase === 0
          ? ease(progress)
          : currentPhase === 1
            ? 1
            : currentPhase === 5
              ? pingPong(progress, 1)
              : 0;
      coreGlow.material.opacity = 0.45 + coreBoost * 0.45;
      core.scale.setScalar(1 + coreBoost * 0.12);

      agents.forEach((agent, index) => {
        const orbitAngle = AGENTS[index].angle + Math.sin(time * 0.2) * 0.12;
        agent.position.set(
          Math.cos(orbitAngle) * AGENT_RADIUS,
          Math.sin(orbitAngle) * AGENT_RADIUS,
          Math.sin(time * 0.6 + index) * 0.3,
        );
        agent.toolPosition
          .copy(agent.position)
          .setZ(0)
          .normalize()
          .multiplyScalar(TOOL_RADIUS);
        agent.node.position.copy(agent.position);
        agent.node.rotation.y = time * 1.2 + index;
        agent.nodeGlow.position.copy(agent.position);
        agent.tool.position.copy(agent.toolPosition);
        agent.tool.rotation.set(time * 0.4, time * 0.6, 0);
        setLine(agent.coreLink, origin, agent.position);
        setLine(agent.toolLink, agent.position, agent.toolPosition);

        // Verde cuando su trabajo queda verificado (escalonado en la fase 4)
        const verified =
          currentPhase === 5 ||
          (currentPhase === 4 && progress > (index + 1) / (AGENTS.length + 1));
        const active = currentPhase >= 2;
        const color = verified ? green : lilac;
        agent.nodeMaterial.color.copy(color);
        agent.nodeGlow.material.color.copy(color);
        agent.pulse.material.color.copy(color);
        agent.nodeGlow.material.opacity = active ? 0.85 : 0.35;
        lineOpacity(
          agent.coreLink,
          currentPhase === 2 || currentPhase === 5 ? 0.55 : 0.18,
        );
        lineOpacity(agent.toolLink, currentPhase === 3 ? 0.6 : 0.08);
        agent.toolMaterial.opacity = currentPhase === 3 ? 0.95 : 0.3;

        // Pulsos: delega → usa herramientas → devuelve el resultado
        agent.pulse.visible = true;
        if (currentPhase === 2) {
          agent.pulse.position.lerpVectors(
            origin,
            agent.position,
            ease(progress),
          );
        } else if (currentPhase === 3) {
          agent.pulse.position.lerpVectors(
            agent.position,
            agent.toolPosition,
            pingPong(progress + index * 0.15, 2),
          );
        } else if (currentPhase === 5) {
          agent.pulse.position.lerpVectors(
            agent.position,
            origin,
            ease(clamp01(progress * 1.6)),
          );
        } else {
          agent.pulse.visible = false;
        }

        const label = agentLabelRefs.current[index];
        placeLabel(label, agent.position, AGENTS[index].side);
        if (label)
          label.dataset.state = verified ? "ok" : active ? "on" : "off";
        const toolLabel = toolLabelRefs.current[index];
        placeLabel(toolLabel, agent.toolPosition, AGENTS[index].side);
        if (toolLabel)
          toolLabel.style.opacity = currentPhase === 3 ? "1" : "0.45";
      });

      // La tarea entra al principio y el resultado sale al final
      lineOpacity(taskLink, currentPhase === 0 ? 0.5 : 0.1);
      lineOpacity(resultLink, currentPhase === 5 ? 0.6 : 0.1);
      flowPulse.visible = false;
      if (currentPhase === 0) {
        flowPulse.visible = true;
        flowPulse.material.color.copy(lilac);
        flowPulse.position.lerpVectors(TASK_POINT, origin, ease(progress));
      } else if (currentPhase === 5 && progress > 0.55) {
        flowPulse.visible = true;
        flowPulse.material.color.copy(green);
        flowPulse.position.lerpVectors(
          origin,
          RESULT_POINT,
          ease(clamp01((progress - 0.55) / 0.45)),
        );
      }

      placeLabel(coreLabelRef.current, origin, "below");
      placeLabel(taskLabelRef.current, TASK_POINT, "above");
      placeLabel(resultLabelRef.current, RESULT_POINT, "above");
      if (taskLabelRef.current)
        taskLabelRef.current.style.opacity = currentPhase === 0 ? "1" : "0.45";
      if (resultLabelRef.current)
        resultLabelRef.current.style.opacity =
          currentPhase === 5 ? "1" : "0.45";

      renderer.render(scene, camera);
    };

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let last = 0;
    let frame = 0;
    let running = false;

    // Dibujo puntual, con la fase ya avanzada (sin animación)
    drawRef.current = () => {
      if (running) return;
      phaseStartRef.current = elapsedRef.current - PHASE_DURATION * 0.6;
      update(elapsedRef.current);
    };

    const resize = () => {
      width = mount.clientWidth;
      height = mount.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      // Encuadre: aleja la cámara lo justo para que todo quepa
      const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      camera.position.z = Math.max(
        HALF_HEIGHT / tanHalfFov,
        // En móvil las etiquetas de herramientas se ocultan: cabe más justo
        (width < 640 ? HALF_WIDTH_MOBILE : HALF_WIDTH) /
          (tanHalfFov * camera.aspect),
      );
      camera.updateProjectionMatrix();
      drawRef.current?.();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const loop = (now: number) => {
      elapsedRef.current += Math.min((now - last) / 1000, 0.1);
      last = now;
      update(elapsedRef.current);
      frame = requestAnimationFrame(loop);
    };

    // Solo anima mientras la ilustración está en pantalla
    const stopWatching = onVisibilityChange(mount, (visible) => {
      if (reducedMotion) return;
      if (visible && !running) {
        running = true;
        last = performance.now();
        frame = requestAnimationFrame(loop);
      } else if (!visible && running) {
        running = false;
        cancelAnimationFrame(frame);
      }
    });

    return () => {
      cancelAnimationFrame(frame);
      drawRef.current = null;
      stopWatching();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      scene.traverse((object) => {
        if (
          object instanceof THREE.Mesh ||
          object instanceof THREE.Line ||
          object instanceof THREE.Points ||
          object instanceof THREE.Sprite
        ) {
          object.geometry.dispose();
          (object.material as THREE.Material).dispose();
        }
      });
      glowTexture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div ref={mountRef} className="relative h-full w-full overflow-hidden">
      {/* Etiquetas HTML que siguen a los nodos 3D (posicionadas por frame) */}
      <div aria-hidden="true">
        <span
          ref={taskLabelRef}
          className={`${labelClass} border-cbpviolet-300/40 bg-cbpgray-900/70 text-cbpviolet-100`}
        >
          Tarea
        </span>
        <span
          ref={coreLabelRef}
          className={`${labelClass} border-cbpviolet-400/60 bg-cbpviolet-600/40 text-white`}
        >
          Orquestador
        </span>
        {AGENTS.map((agent, index) => (
          <span
            key={agent.name}
            ref={(element) => {
              agentLabelRefs.current[index] = element;
            }}
            data-state="off"
            className={`${labelClass} border-cbpviolet-300/30 bg-cbpgray-900/70 text-cbpgray-300 data-[state=ok]:border-green-400/60 data-[state=ok]:text-green-300 data-[state=on]:border-cbpviolet-300/60 data-[state=on]:text-cbpviolet-100`}
          >
            <span className="hidden sm:inline">Subagente · </span>
            {agent.name}
          </span>
        ))}
        {AGENTS.map((agent, index) => (
          <span
            key={agent.tool}
            ref={(element) => {
              toolLabelRefs.current[index] = element;
            }}
            // En móvil no caben: el paso 4 ya las nombra
            className={`${labelClass} hidden border-blue-400/40 bg-cbpgray-900/70 text-blue-200 sm:block`}
          >
            <span className="hidden sm:inline">MCP · </span>
            {agent.tool}
          </span>
        ))}
        <span
          ref={resultLabelRef}
          className={`${labelClass} border-green-400/50 bg-cbpgray-900/70 text-green-300`}
        >
          <span className="hidden sm:inline">Cambio verificado</span>
          <span className="sm:hidden">Resultado</span>
        </span>
      </div>
    </div>
  );
}
