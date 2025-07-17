interface TechnologyProps {
  name: string;
  logo: string;
  url: string;
  classNames?: string;
}

export const Technology = ({
  name,
  logo,
  url,
  classNames,
}: TechnologyProps) => {
  return (
    <a
      href={url}
      target="_blank"
      className={`flex flex-col items-center gap-2 ${classNames}`}
    >
      <img
        src={logo}
        alt={name}
        className="w-10 h-auto aspect-square object-contain "
      />
      <p>{name}</p>
    </a>
  );
};
