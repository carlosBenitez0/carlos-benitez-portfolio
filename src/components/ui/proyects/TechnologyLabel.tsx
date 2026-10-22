interface TechnologyLabelProps {
  name: string;
  icon: string | React.ReactNode;
  color: string;
  url: string;
  fitContent?: boolean;
}

export const TechnologyLabel = ({
  name,
  icon,
  color,
  url,
  fitContent,
}: TechnologyLabelProps) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={` inline-flex items-center gap-2 px-2 py-[2px] rounded-full text-sm
      ${fitContent ? "w-fit " : "w-max"}`}
      style={{
        backgroundColor: color + (color != "#dddddd" ? "10" : "1d"),
        boxShadow: `0px 0px 2px ${color}`,
        color: color,
      }}
    >
      {/* Decorativo: el nombre ya está en texto */}
      <span aria-hidden="true" className="contents">
        {icon}
      </span>
      {name}
    </a>
  );
};
