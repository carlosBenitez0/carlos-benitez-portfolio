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
      {/* Halo oscuro: las manchas de colores pasan por detrás; con el halo el
          texto mantiene contraste AA esté donde esté la mancha. */}
      <p
        className={`[text-shadow:0_0_2px_#050010,0_0_2px_#050010,0_0_4px_#050010] ${isMobile ? "text-[12px]" : ""}`}
      >
        {name}
      </p>
    </a>
  );
};
