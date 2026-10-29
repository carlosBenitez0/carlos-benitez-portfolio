import { useEffect, useRef } from "react";
import {
  onVisibilityChange,
  prefersReducedMotion,
} from "../../../utils/visibility";
import { FLAG_SHAPES, WAVE, shapePathData } from "./flagGeometry";
import { t } from "../../../i18n/ui";

// Bandera de El Salvador en trazo neón que ondea con el viento. Las líneas se
// recalculan en cada cuadro deformando la geometría real (flagGeometry.ts),
// así siempre son vectoriales y continuas. El bucle solo corre mientras la
// bandera está en pantalla; con "reducir movimiento" queda una onda fija.

// Fase de reposo: la forma ondulada de la imagen original
const REST_PHASE = 0.25;

export const WavingFlag = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const draw = (phase: number) => {
      FLAG_SHAPES.forEach((shape, i) => {
        pathRefs.current[i]?.setAttribute("d", shapePathData(shape, phase));
      });
    };

    draw(REST_PHASE);
    if (prefersReducedMotion()) return;

    let frame = 0;
    let phase = REST_PHASE;
    let last = 0;
    const tick = (now: number) => {
      // Avanza por tiempo transcurrido: al reanudar sigue donde quedó
      if (last) phase = (phase + (now - last) / (WAVE.seconds * 1000)) % 1;
      last = now;
      draw(phase);
      frame = requestAnimationFrame(tick);
    };

    const stopWatching = onVisibilityChange(root, (visible) => {
      cancelAnimationFrame(frame);
      last = 0;
      if (visible) frame = requestAnimationFrame(tick);
    });

    return () => {
      stopWatching();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="waving-flag"
      role="img"
      aria-label={t.contact.flag}
    >
      <svg viewBox="-8 -12 216 154" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient
            id="flag-neon-gradient"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="200"
            y2="130"
          >
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="45%" stopColor="#6d7cf5" />
            <stop offset="72%" stopColor="#b14ff0" />
            <stop offset="100%" stopColor="#f018e8" />
          </linearGradient>
          <filter
            id="flag-neon-glow"
            x="-15%"
            y="-15%"
            width="130%"
            height="130%"
          >
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g
          filter="url(#flag-neon-glow)"
          stroke="url(#flag-neon-gradient)"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {FLAG_SHAPES.map((shape, i) => (
            <path
              key={shape.id}
              ref={(el) => {
                pathRefs.current[i] = el;
              }}
              data-shape={shape.id}
              strokeWidth={shape.strokeWidth}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};
