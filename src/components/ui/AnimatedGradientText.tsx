import type { ReactNode } from "react";

interface AnimatedGradientTextProps {
  children: ReactNode;
  classNames?: string[];
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
}

export default function AnimatedGradientText({
  children,
  classNames = [],
  colors = ["#ffaa40", "#9c40ff", "#ffaa40"],
  animationSpeed = 8,
  showBorder = false,
}: AnimatedGradientTextProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    animationDuration: `${animationSpeed}s`,
  };

  return (
    <div
      className={`relative inline max-w-fit overflow-hidden transition-shadow duration-500 ${classNames.join(" ")}`}
    >
      {showBorder && (
        <div
          className="animate-gradient pointer-events-none absolute inset-0 z-0 bg-cover"
          style={{
            ...gradientStyle,
            backgroundSize: "300% 100%",
          }}
        >
          <div
            className="absolute inset-0 z-[-1] rounded-[1.25rem] bg-black"
            style={{
              width: "calc(100% - 2px)",
              height: "calc(100% - 2px)",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          ></div>
        </div>
      )}
      <div
        className="animate-gradient relative z-2 inline-block bg-cover text-transparent"
        style={{
          ...gradientStyle,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          backgroundSize: "300% 100%",
        }}
      >
        {children}
      </div>
    </div>
  );
}
