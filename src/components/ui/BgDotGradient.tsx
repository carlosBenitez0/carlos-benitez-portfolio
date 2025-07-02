interface BgDotGradientProps {
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
  colors?: (
    | "violet"
    | "violet-light"
    | "gray"
    | "accent"
    | "white"
    | "black"
    | "red"
    | "green"
    | "blue"
    | "brown"
    | "yellow"
    | "orange"
    | "pink"
    | "purple"
    | "gray-light"
    | "gray-dark"
  )[];
  direction?: "right" | "left" | "top" | "bottom";
  blur?:
    | "none"
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
  opacity?: number;
  className?: string;
}

export const BgDotGradient = ({
  size = "md",
  colors = ["violet", "accent"],
  direction = "right",
  blur = "md",
  position,
  opacity = 0.8,
  className = "",
}: BgDotGradientProps) => {
  // Mapeo de tamaños
  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-24 w-24",
    xl: "h-32 w-32",
    "2xl": "h-40 w-40",
    "3xl": "h-48 w-48",
    "4xl": "h-56 w-56",
    "5xl": "h-64 w-64",
    "6xl": "h-72 w-72",
    "7xl": "h-80 w-80",
    "8xl": "h-88 w-88",
    "9xl": "h-96 w-96",
    "10xl": "h-104 w-104",
  };

  // Mapeo de colores
  const colorValues = {
    violet: "#7b2cbfff",
    "violet-light": "#e0aaffff",
    gray: "#4a505c",
    accent: "#00ff9d",
    white: "#ffffff",
    black: "#000000",
    red: "#ff0000",
    green: "#00ff00",
    blue: "#0000ff",
    brown: "#a52a2a",
    yellow: "#ffff00",
    orange: "#ffa500",
    pink: "#ff00ff",
    purple: "#800080",
    "gray-light": "#4a505c",
    "gray-dark": "#4a505c",
  };

  // Mapeo de blur
  const blurValues = {
    none: "0",
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    "2xl": "24px",
    "3xl": "32px",
    "4xl": "48px",
    "5xl": "64px",
    "6xl": "72px",
    "7xl": "80px",
    "8xl": "88px",
    "9xl": "96px",
    "10xl": "104px",
  };

  // Generar gradiente CSS
  const gradientColors = colors.map((color) => colorValues[color]).join(", ");
  const gradientStyle = {
    backgroundImage: `linear-gradient(to ${direction}, ${gradientColors})`,
    filter: `blur(${blurValues[blur]})`,
    opacity,
  };

  return (
    <div
      className={`absolute z-[-1] rounded-full ${sizeClasses[size]} ${className}`}
      style={{
        ...gradientStyle,
        top: position?.top ? `${position.top}px` : undefined,
        right: position?.right ? `${position.right}px` : undefined,
        bottom: position?.bottom ? `${position.bottom}px` : undefined,
        left: position?.left ? `${position.left}px` : undefined,
      }}
    />
  );
};
