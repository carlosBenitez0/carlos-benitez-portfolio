interface SectionTitleProps {
  title: string;
  icon?: React.ReactNode;
}

export const SectionTitle = ({ title, icon }: SectionTitleProps) => {
  return (
    <div className="animate-section relative w-fit">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-2 z-[1] bg-clip-text text-transparent bg-gradient-to-r from-cbpviolet-500 to-cbpviolet-700 select-none">
        <span
          className="z-[1] text-cbpviolet-300 relative
         before:content-[''] before:absolute before:inset-[-5px] before:rounded-full before:bg-cbpviolet-200 before:blur-2xl
         "
        >
          {icon}
        </span>
        {title}
      </h2>
    </div>
  );
};
