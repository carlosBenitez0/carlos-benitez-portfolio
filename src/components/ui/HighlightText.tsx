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
      filter: `drop-shadow(0 0 5px rgba(157, 78, 221, ${shadowOpacity}))`,
    }}
  >
    {children}
  </span>
);

export default HighlightText;
