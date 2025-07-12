interface TechnologyLabelProps {
  name: string;
  icon: string | React.ReactNode;
  color: string;
  url: string;
}

export const TechnologyLabel = ({
  name,
  icon,
  color,
  url,
}: TechnologyLabelProps) => {
  return (
    <a
      href={url}
      target="_blank"
      className={`flex items-center gap-2 backdrop-blur-2xl px-2 py-[2px] rounded-full text-sm
      `}
      style={{
        backgroundColor: color + (color != "#dddddd" ? "10" : "1d"),
        boxShadow: `0px 0px 2px ${color}`,
        color: color,
      }}
    >
      {icon}
      {name}
    </a>
  );
};
