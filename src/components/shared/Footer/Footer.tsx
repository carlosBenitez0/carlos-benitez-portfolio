import ShinyText from "../../ui/ShinyText";
import { technologies } from "../../../utils/technologies";
import { Technology } from "../../ui/Technologies/Technology";
import { useIsMobile } from "../../../hooks/useIsMobile";

export const Footer = () => {
  const { isMobile } = useIsMobile();
  const technologiesList = technologies;

  const technologiesFilter = technologiesList.frontend.filter(
    (technology) =>
      technology.name === "React" ||
      technology.name === "TypeScript" ||
      technology.name === "Tailwind CSS" ||
      technology.name === "GSAP" ||
      technology.name === "Motion" ||
      technology.name === "React Icons" ||
      technology.name === "React Bits",
  );

  return (
    <div
      data-pause-offscreen
      className={`mt-8 grid grid-cols-2 border-t border-cbpgray-800 ${isMobile ? "px-4 py-15 gap-8" : "gap-20 py-18 pb-28"}`}
    >
      <div className="flex flex-col gap-4">
        <div
          className={`flex ${isMobile ? " flex-col" : " items-center"} gap-4`}
        >
          <figure>
            {/* Decorativo: el nombre ya aparece en texto justo al lado */}
            <img
              src="https://res.cloudinary.com/dc69f3e0o/image/upload/v1751309549/cb-logo2_kowmru.png"
              alt=""
              className="cb-logo w-14"
            />
          </figure>
          <div className="flex flex-col">
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-cbpviolet-400 via-cbpviolet-100 to-cbpviolet-200">
              Carlos Benítez
            </p>
            <span className="text-cbpgray-400 text-sm">Desarrollador web</span>
          </div>
        </div>
        <p className="italic text-gray-700 dark:text-gray-300 mb-2 p-2 border border-cbpgray-800 rounded-md">
          "La innovación es el <ShinyText text="IDE" /> del progreso; la
          creatividad, su <ShinyText text='lenguaje de programación".' />
        </p>
      </div>
      <div>
        <p className={`mb-4 ${isMobile ? "text-sm" : ""} text-cbpgray-400`}>
          Tecnologías utilizadas en el desarrollo de esta página:
        </p>
        <ul
          className={`flex flex-wrap ${isMobile ? "justify-start gap-8 gap-y-12" : "gap-8 gap-y-14"}`}
        >
          {technologies &&
            technologiesFilter &&
            technologiesFilter.map((technology) => (
              <li key={technology.name}>
                <Technology
                  name={technology.name}
                  logo={technology.logo}
                  url={technology.url}
                  classNames="w-10 h-10 text-[12px]"
                />
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
