interface SectionTitleProps {
  title: string;
  icon?: React.ReactNode;
  // Revelado con desenfoque al hacer scroll. Se desactiva donde el contenido
  // de la sección aparece con su propia animación y no irían sincronizados.
  revealOnScroll?: boolean;
}

export const SectionTitle = ({
  title,
  icon,
  revealOnScroll = true,
}: SectionTitleProps) => {
  return (
    <div
      className={`${revealOnScroll ? "anim-about-text" : ""} fx-trigger relative w-fit`}
    >
      <h2 className="z-[1] mb-8 flex items-center gap-2 bg-gradient-to-r from-cbpviolet-300 to-cbpviolet-400 bg-clip-text text-3xl font-bold text-transparent select-none">
        <span className="relative z-[1] text-cbpviolet-300 before:absolute before:inset-[-5px] before:rounded-full before:bg-cbpviolet-200 before:blur-2xl before:content-['']">
          {icon}
        </span>
        {title}
      </h2>
    </div>
  );
};
