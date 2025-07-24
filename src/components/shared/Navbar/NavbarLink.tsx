import { useIsMobile } from "../../../hooks/useIsMobile";

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
  /* const scrollHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOptionSelected(label);
    window.scrollTo({
      top: document.getElementById(label)?.offsetTop || 0,
      behavior: "smooth",
    });
  }; */

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOptionSelected(label);

    // Let the browser handle the scrolling with the CSS smooth behavior
    const targetId = href.startsWith("#") ? href.substring(1) : href;
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      // This will use the CSS smooth scrolling with our 100px offset
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const { isMobile } = useIsMobile();
  const isActive = optionSelected === label.toLowerCase();

  return (
    <a
      href={href}
      className={`blur-text text-cbpgray-300/50 hover:text-cbpgray-300 after:bg-cbpgray-300 hover:translate-y-1 relative flex items-center gap-2 transition-transform duration-300 after:absolute after:top-[50%] after:right-[0] after:h-[0px] after:w-[0px] after:translate-y-[-50%] after:rounded-full after:content-[''] 
        ${isActive ? "text-cbpgray-300/100 after:ml-6 after:h-[5px] after:w-[5px] after:animate-pulse" : ""}
        ${isMobile ? "after:hidden gap-1 pr-0 text-[18px]" : "pr-3 text-[14px]"}`}
      title={text}
      aria-label={text}
      onClick={handleClick}
    >
      {icon}
      {!isMobile && text}
    </a>
  );
};
