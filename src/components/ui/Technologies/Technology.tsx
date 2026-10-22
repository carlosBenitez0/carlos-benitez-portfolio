import { useIsMobile } from "../../../hooks/useIsMobile";

interface TechnologyProps {
  name: string;
  logo: string;
  url: string;
  classNames?: string;
  // Para logos blancos, que desaparecen sobre el fondo claro
  invertInLight?: boolean;
}

export const Technology = ({
  name,
  logo,
  url,
  classNames,
  invertInLight,
}: TechnologyProps) => {
  const { isMobile } = useIsMobile();
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`fx-trigger flex flex-col items-center gap-2 ${isMobile ? "w-[28px]" : ""} ${classNames}`}
    >
      {/* Decorativo: el nombre ya va en texto debajo */}
      <img
        src={logo}
        alt=""
        className={`fx-icon fx-lift aspect-square w-10 object-contain ${invertInLight ? "light:invert" : ""}`}
      />
      {/* Halo del color del fondo: las manchas de colores pasan por detrás; con el halo el
          texto mantiene contraste AA esté donde esté la mancha. */}
      <p
        className={`[text-shadow:0_0_2px_var(--color-cbpbg-900),0_0_2px_var(--color-cbpbg-900),0_0_4px_var(--color-cbpbg-900)] ${isMobile ? "text-[12px]" : ""}`}
      >
        {name}
      </p>
    </a>
  );
};
