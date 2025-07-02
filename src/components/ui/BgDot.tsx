interface BgDotProps {
  size?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "8xl"
    | "9xl"
    | "10xl";
  color?: "violet" | "gray" | "accent" | "white";
  blur?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "8xl"
    | "9xl"
    | "10xl";
  position?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  className?: string;
}

export const BgDot = ({
  size = "md",
  color = "violet",
  blur = "md",
  position,
  className = "",
}: BgDotProps) => {
  // Mapeo de tamaños a clases Tailwind
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-20 w-20",
    "2xl": "h-24 w-24",
    "3xl": "h-28 w-28",
    "4xl": "h-32 w-32",
    "5xl": "h-36 w-36",
    "6xl": "h-40 w-40",
    "7xl": "h-44 w-44",
    "8xl": "h-48 w-48",
    "9xl": "h-52 w-52",
    "10xl": "h-56 w-56",
  };

  // Mapeo de colores a clases Tailwind
  const colorClasses = {
    violet: "bg-cbpviolet-500",
    gray: "bg-cbpgray-500",
    accent: "bg-cbpaccent-500",
    white: "bg-white",
  };

  // Mapeo de blur a clases Tailwind
  const blurClasses = {
    xs: "blur-xs",
    sm: "blur-sm",
    md: "blur-md",
    lg: "blur-lg",
    xl: "blur-xl",
    "2xl": "blur-2xl",
    "3xl": "blur-3xl",
    "4xl": "blur-4xl",
    "5xl": "blur-5xl",
    "6xl": "blur-6xl",
    "7xl": "blur-7xl",
    "8xl": "blur-8xl",
    "9xl": "blur-9xl",
    "10xl": "blur-10xl",
  };

  return (
    <div
      className={`absolute z-[-1] rounded-full ${sizeClasses[size]} ${colorClasses[color]} ${blurClasses[blur]}${className}`}
      style={{
        top: position?.top ? `${position.top}px` : undefined,
        right: position?.right ? `${position.right}px` : undefined,
        bottom: position?.bottom ? `${position.bottom}px` : undefined,
        left: position?.left ? `${position.left}px` : undefined,
      }}
    />
  );
};
