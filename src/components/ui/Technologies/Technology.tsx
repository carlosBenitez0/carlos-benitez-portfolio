import { useIsMobile } from "../../../hooks/useIsMobile";

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
  const { isMobile } = useIsMobile();
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex flex-col items-center gap-2  ${isMobile ? "w-[28px]" : ""} ${classNames}`}
    >
      <img
        src={logo}
        alt={name}
        className="w-10 aspect-square object-contain "
      />
      <p className={isMobile ? "text-[12px]" : ""}>{name}</p>
    </a>
  );
};
