import type { CSSProperties } from "react";

// Bandera de El Salvador en trazo neón (cian -> magenta) que ondea con el
// viento. Técnica de franjas: la bandera se dibuja una vez por franja vertical
// y cada franja sube y baja con un pequeño desfase, así la onda viaja del asta
// al extremo libre. Solo transform (la GPU compone cada franja, sin recalcular
// el SVG), con más amplitud hacia el extremo libre.

const STRIPS = 44; // franjas de 2px sobre 88px de ancho
const WAVE_SECONDS = 2.2;

// Desplazamiento máximo (px) de cada franja: casi nada junto al asta
const amplitude = (i: number) => 0.6 + 4.4 * Math.pow(i / (STRIPS - 1), 1.2);

// Retraso negativo decreciente: las franjas a la derecha van detrás, por eso
// la onda avanza hacia el extremo libre.
const delay = (i: number) => -WAVE_SECONDS * (1 - (0.85 * i) / (STRIPS - 1));

// Forma de reposo (sin animación): una onda congelada, como la imagen original.
const restOffset = (i: number) =>
  amplitude(i) * Math.sin((2 * Math.PI * i) / (STRIPS - 1) - Math.PI / 2);

const FlagArt = () => (
  <svg viewBox="0 0 200 130" className="flag-art">
    <g filter="url(#flag-neon-glow)" stroke="url(#flag-neon-gradient)">
      {/* Borde */}
      <rect
        x="6"
        y="6"
        width="188"
        height="118"
        rx="4"
        fill="none"
        strokeWidth="5"
      />
      {/* Franjas: se interrumpen en el escudo */}
      <path
        d="M6 46 H74 M126 46 H194 M6 84 H74 M126 84 H194"
        fill="none"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      {/* Escudo */}
      <circle cx="100" cy="65" r="31" fill="none" strokeWidth="4.5" />
      <path
        d="M100 45.6 L85.2 71.5 H114.8 Z"
        fill="none"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M82 71.5 H118 M85.8 71.5 A14.2 14.2 0 0 0 114.2 71.5 M85.2 54 Q78.7 62.4 82.6 71.5 M114.8 54 Q121.3 62.4 117.4 71.5"
        fill="none"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

export const WavingFlag = () => (
  <div className="waving-flag" role="img" aria-label="Bandera de El Salvador">
    {/* Degradado y brillo, definidos una vez para todas las franjas */}
    <svg width="0" height="0" className="absolute" aria-hidden="true">
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
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
        >
          <feGaussianBlur stdDeviation="2.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>

    {Array.from({ length: STRIPS }, (_, i) => (
      <div
        key={i}
        className="flag-strip"
        aria-hidden="true"
        style={
          {
            "--strip": i,
            "--strips": STRIPS,
            "--amp": amplitude(i),
            transform: `translateY(${restOffset(i).toFixed(2)}px)`,
            animationDuration: `${WAVE_SECONDS}s`,
            animationDelay: `${delay(i).toFixed(3)}s`,
          } as CSSProperties
        }
      >
        <FlagArt />
      </div>
    ))}
  </div>
);
