interface NavbarLinkProps {
  href: string;
  optionSelected: string;
  setOptionSelected: (option: string) => void;
  icon: React.ReactNode;
  text: string;
  label: string;
}

export const NavbarLink = ({
  href,
  optionSelected,
  setOptionSelected,
  icon,
  text,
  label,
}: NavbarLinkProps) => {
  return (
    /*======================================
    Pendiente: 
    usar el tooltip para mostrar una pantalla por ejemplo de la seccion de proyectos,
    al hacer hover, y al hacer click en una opcion, que esta se agrande hasta llegar al tamanio de la pantalla 
    y que en ese momento se redirija a la pantalla de proyectos
    ======================================*/
    <a
      href={href}
      className={`blur-text text-cbpgray-300/50 hover:text-cbpgray-300 after:bg-cbpgray-300 hover:translate-y-1 relative flex items-center gap-2 pr-3 transition-colors transition-transform duration-300 after:absolute after:top-[50%] after:right-[0] after:h-[0px] after:w-[0px] after:translate-y-[-50%] after:rounded-full after:content-[''] ${optionSelected === label ? "text-cbpgray-300/100 after:ml-6 after:h-[5px] after:w-[5px] after:animate-pulse" : ""}`}
      onClick={() => setOptionSelected(label)}
      title={text}
      aria-label={text}
    >
      {icon}
      {text}
    </a>
  );
};

{
  /* <div className="group relative">
      <a
        href={href}
        className={`after:bg-cbpviolet-300 hover:text-cbpviolet-300 relative flex items-center gap-2 pr-3 transition-colors transition-transform duration-300 after:absolute after:top-[50%] after:right-[0] after:h-[0px] after:w-[0px] after:translate-y-[-50%] after:rounded-full after:content-[''] ${
          optionSelected === label
            ? "text-cbpviolet-300 after:ml-6 after:h-[5px] after:w-[5px]"
            : ""
        }`}
        onClick={() => setOptionSelected(label)}
        aria-label={text}
        // title se removió para evitar tooltips nativos dobles
      >
        {icon}
        {text}
      </a>

      
      <span
        className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded-md bg-gray-800 px-3 py-1.5 text-sm whitespace-nowrap text-white transition-opacity duration-200 group-focus-within:block group-hover:block"
        role="tooltip"
      >
        {text}
        
        <span className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-t-4 border-r-4 border-b-0 border-l-4 border-t-gray-800 border-r-transparent border-l-transparent"></span>
      </span>
    </div> */
}
