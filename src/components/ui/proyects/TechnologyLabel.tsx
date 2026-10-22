interface TechnologyLabelProps {
  name: string;
  icon: string | React.ReactNode;
  color: string;
  url: string;
  fitContent?: boolean;
  // Solo el logo, en un círculo (cards de proyecto en móvil); el nombre queda
  // en aria-label y title
  compact?: boolean;
}

export const TechnologyLabel = ({
  name,
  icon,
  color,
  url,
  fitContent,
  compact,
}: TechnologyLabelProps) => {
  if (compact) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={name}
        title={name}
        className="fx-trigger inline-flex h-7 w-7 items-center justify-center rounded-full text-sm transition-[translate,filter] duration-300 hover:-translate-y-0.5 hover:brightness-125 motion-reduce:hover:translate-y-0"
        style={{
          backgroundColor: color + (color != "#dddddd" ? "14" : "1d"),
          boxShadow: `0px 0px 2px ${color}`,
          color: color,
        }}
      >
        <span aria-hidden="true" className="fx-icon fx-pop">
          {icon}
        </span>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`fx-trigger inline-flex items-center gap-2 rounded-full px-2 py-[2px] text-sm transition-[translate,filter] duration-300 hover:-translate-y-0.5 hover:brightness-125 motion-reduce:hover:translate-y-0 ${fitContent ? "w-fit" : "w-max"}`}
      style={{
        backgroundColor: color + (color != "#dddddd" ? "10" : "1d"),
        boxShadow: `0px 0px 2px ${color}`,
        color: color,
      }}
    >
      {/* Decorativo: el nombre ya está en texto */}
      <span aria-hidden="true" className="fx-icon fx-pop">
        {icon}
      </span>
      {name}
    </a>
  );
};
