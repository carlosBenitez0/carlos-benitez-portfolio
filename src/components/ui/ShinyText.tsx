import React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  color?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = "",
  color,
}) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`inline-block bg-clip-text ${disabled ? "" : "shiny-text"} ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(120deg, transparent 40%, var(--shiny-shine) 50%, transparent 60%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        animationDuration: animationDuration,
        color: color ? color : "var(--shiny-color)",
      }}
    >
      {text}
    </div>
  );
};

export default ShinyText;
