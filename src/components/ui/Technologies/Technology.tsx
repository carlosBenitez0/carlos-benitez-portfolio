interface TechnologyProps {
  name: string;
  logo: string;
  url: string;
}

export const Technology = ({ name, logo, url }: TechnologyProps) => {
  return (
    <a href={url} target="_blank" className="flex flex-col items-center gap-2 ">
      <img
        src={logo}
        alt={name}
        className="w-10 h-auto aspect-square object-contain "
      />
      <p>{name}</p>
    </a>
  );
};
