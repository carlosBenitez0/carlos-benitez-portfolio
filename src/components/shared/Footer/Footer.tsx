import { IoIosArrowUp } from "react-icons/io";
import ShinyText from "../../ui/ShinyText";
import { technologies } from "../../../utils/technologies";

// Tecnologías con las que está hecha esta página, en el orden en que se muestran
const SITE_STACK = [
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Motion",
  "GSAP",
  "React Icons",
  "React Bits",
];

const siteTechnologies = SITE_STACK.flatMap((name) =>
  technologies.frontend.filter((technology) => technology.name === name),
);

const scrollToTop = () =>
  document.getElementById("start")?.scrollIntoView({ behavior: "smooth" });

export const Footer = () => (
  <footer
    data-pause-offscreen
    className="mt-8 border-t border-cbpgray-800 px-4 md:px-0"
  >
    <div className="grid gap-12 py-16 md:grid-cols-[1fr_1.1fr] md:gap-16">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          {/* Decorativo: el nombre ya aparece en texto justo al lado */}
          <img
            src="https://res.cloudinary.com/dc69f3e0o/image/upload/v1751309549/cb-logo2_kowmru.png"
            alt=""
            className="cb-logo w-14"
          />
          <div className="flex flex-col">
            <p className="text-lg font-semibold text-cbpviolet-100">
              Carlos Benítez
            </p>
            <span className="text-sm text-cbpgray-400">Desarrollador web</span>
          </div>
        </div>

        <blockquote className="max-w-md text-base leading-relaxed text-cbpgray-300 italic">
          “La innovación es el <ShinyText text="IDE" /> del progreso; la
          creatividad, su <ShinyText text="lenguaje de programación" />
          .”
        </blockquote>
      </div>

      <div>
        <p className="mb-6 text-sm text-cbpgray-400">
          Esta página está hecha con
        </p>
        <ul className="grid grid-cols-4 gap-x-3 gap-y-7">
          {siteTechnologies.map((technology) => (
            <li key={technology.name}>
              <a
                href={technology.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group fx-trigger flex flex-col items-center gap-2 text-center"
              >
                {/* Decorativo: el nombre va en texto debajo */}
                <img
                  src={technology.logo}
                  alt=""
                  className="fx-icon fx-lift aspect-square w-9 object-contain"
                />
                <span className="text-xs whitespace-nowrap text-cbpgray-300 transition-colors group-hover:text-white">
                  {technology.name}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div className="flex flex-col items-center justify-between gap-4 border-t border-cbpgray-800/60 py-6 text-xs text-cbpgray-400 sm:flex-row">
      <p>© {new Date().getFullYear()} Carlos Benítez · Hecho en El Salvador</p>
      <button
        type="button"
        onClick={scrollToTop}
        className="fx-trigger flex cursor-pointer items-center gap-1.5 rounded-full border border-cbpgray-800 px-3 py-1.5 transition-colors hover:border-cbpviolet-400 hover:text-cbpgray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cbpviolet-300"
      >
        <IoIosArrowUp aria-hidden="true" className="fx-icon fx-rise" />
        Volver arriba
      </button>
    </div>
  </footer>
);
