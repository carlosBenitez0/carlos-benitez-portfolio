import type { ReactNode } from "react";
interface HighlightTextProps {
  children: ReactNode;
  shadowOpacity?: number;
}

const HighlightText = ({ children, shadowOpacity }: HighlightTextProps) => (
  <span
    className={`text-cbpviolet-200 drop-shadow-[0_0_5px_rgba(157,78,221,${shadowOpacity})]`}
  >
    {children}
  </span>
);

export default HighlightText;
