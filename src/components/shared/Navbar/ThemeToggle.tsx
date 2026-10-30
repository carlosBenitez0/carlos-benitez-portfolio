import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { useTheme } from "../../../hooks/useTheme";
import { t } from "../../../i18n/ui";

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle = ({ className = "" }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";
  const label = isLight ? t.nav.toDark : t.nav.toLight;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`blur-text-git fx-trigger flex cursor-pointer items-center text-cbpgray-300/70 transition-transform duration-300 hover:-translate-y-1 hover:text-cbpgray-300 ${className}`}
    >
      {/* Muestra el tema al que se cambia, como la mayoría de sitios */}
      {isLight ? (
        <IoMoonOutline className="fx-icon fx-spin" />
      ) : (
        <IoSunnyOutline className="fx-icon fx-spin" />
      )}
    </button>
  );
};
