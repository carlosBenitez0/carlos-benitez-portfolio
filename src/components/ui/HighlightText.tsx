import type { ReactNode } from "react";
interface HighlightTextProps {
  children: ReactNode;
  shadowOpacity?: number;
}

// El brillo va en `style`: una clase de Tailwind armada con ${shadowOpacity}
// no existe en el código fuente, así que Tailwind nunca la generaba.
const HighlightText = ({ children, shadowOpacity = 1 }: HighlightTextProps) => (
  <span
    className="text-cbpviolet-200"
    style={{
      filter: `drop-shadow(0 0 5px color-mix(in srgb, var(--highlight-glow) ${shadowOpacity * 100}%, transparent))`,
    }}
  >
    {children}
  </span>
);

export default HighlightText;
