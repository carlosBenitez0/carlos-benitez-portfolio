// Geometría de la bandera de El Salvador (trazo neón) y su deformación por
// viento. Cada figura se muestrea en puntos sobre la bandera plana (viewBox
// 0..200 x 0..130); en cada cuadro se desplazan con una onda que viaja del
// asta (izquierda) al extremo libre y se vuelve a trazar como línea continua.

export type Point = readonly [number, number];

export interface FlagShape {
  id: "outline" | "stripes" | "circle" | "triangle" | "details";
  strokeWidth: number;
  // Cada figura puede tener varios trazos (p. ej. las 4 piezas de franjas)
  lines: { points: Point[]; closed: boolean }[];
}

const HOIST_X = 6;
const FLY_X = 194;
const STEP = 3; // separación de muestreo en unidades del viewBox

const segment = (a: Point, b: Point): Point[] => {
  const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / STEP));
  return Array.from(
    { length: n + 1 },
    (_, i) =>
      [a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n] as Point,
  );
};

const polyline = (...corners: Point[]): Point[] =>
  corners.slice(1).flatMap((c, i) => {
    const pts = segment(corners[i], c);
    return i === 0 ? pts : pts.slice(1);
  });

const arc = (
  cx: number,
  cy: number,
  r: number,
  from: number,
  to: number,
  n = 48,
): Point[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = from + ((to - from) * i) / n;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as Point;
  });

const quad = (a: Point, c: Point, b: Point, n = 12): Point[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const mt = 1 - t;
    return [
      mt * mt * a[0] + 2 * mt * t * c[0] + t * t * b[0],
      mt * mt * a[1] + 2 * mt * t * c[1] + t * t * b[1],
    ] as Point;
  });

const CX = 100;
const CY = 65;
const R = 31;

export const FLAG_SHAPES: FlagShape[] = [
  {
    id: "outline",
    strokeWidth: 5,
    lines: [
      {
        points: polyline([6, 6], [194, 6], [194, 124], [6, 124], [6, 6]),
        closed: true,
      },
    ],
  },
  {
    // Las franjas se interrumpen en el escudo
    id: "stripes",
    strokeWidth: 4.5,
    lines: [
      { points: polyline([6, 46], [74, 46]), closed: false },
      { points: polyline([126, 46], [194, 46]), closed: false },
      { points: polyline([6, 84], [74, 84]), closed: false },
      { points: polyline([126, 84], [194, 84]), closed: false },
    ],
  },
  {
    id: "circle",
    strokeWidth: 4.5,
    lines: [{ points: arc(CX, CY, R, 0, Math.PI * 2, 64), closed: true }],
  },
  {
    id: "triangle",
    strokeWidth: 4,
    lines: [
      {
        points: polyline([100, 45.6], [85.2, 71.5], [114.8, 71.5], [100, 45.6]),
        closed: true,
      },
    ],
  },
  {
    // Base, arco inferior y ramas del escudo
    id: "details",
    strokeWidth: 3.6,
    lines: [
      { points: polyline([82, 71.5], [118, 71.5]), closed: false },
      { points: arc(CX, 71.5, 14.2, Math.PI, 0, 24).reverse(), closed: false },
      { points: quad([85.2, 54], [78.7, 62.4], [82.6, 71.5]), closed: false },
      {
        points: quad([114.8, 54], [121.3, 62.4], [117.4, 71.5]),
        closed: false,
      },
    ],
  },
];

// Viento: amplitud (unidades del viewBox) y ondas a lo largo de la bandera
export const WAVE = {
  amplitude: 9,
  waves: 1.15,
  seconds: 2.4,
};

// Desplaza un punto de la bandera plana en el instante `phase` (0..1 del ciclo).
// Junto al asta casi no se mueve; la amplitud crece hacia el extremo libre.
// Una leve compresión horizontal acompaña a la onda, como la tela.
export const windDisplace = ([x, y]: Point, phase: number): Point => {
  const u = (x - HOIST_X) / (FLY_X - HOIST_X); // 0 en el asta, 1 en el extremo
  const reach = Math.pow(Math.max(0, u), 1.15);
  const angle = 2 * Math.PI * (phase - WAVE.waves * u);
  const dy = WAVE.amplitude * reach * Math.sin(angle);
  const dx = -WAVE.amplitude * 0.18 * reach * (1 - Math.cos(angle));
  return [x + dx, y + dy];
};

// Trazo SVG continuo de una línea deformada
export const toPathData = (
  points: readonly Point[],
  closed: boolean,
  phase: number,
): string => {
  let d = "";
  for (let i = 0; i < points.length; i++) {
    const [x, y] = windDisplace(points[i], phase);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return closed ? `${d}Z` : d;
};

export const shapePathData = (shape: FlagShape, phase: number) =>
  shape.lines.map((l) => toPathData(l.points, l.closed, phase)).join("");
