import { FaCheck } from "react-icons/fa6";
import ShinyText from "./ShinyText";
import { TechnologyLabel } from "./proyects/TechnologyLabel";
import { useTechnologies } from "../../utils/useTechnologies";

// Texto de "Sobre mí". La versión en texto plano (para el HTML estático,
// /llms.txt e /index.md) está en src/content/site.ts; AboutText.test.tsx
// comprueba que ambas digan lo mismo.
export const AboutText = () => {
  const technologies = useTechnologies();

  return (
    <>
      <p className="anim-about-text">
        ¡Hola de nuevo! 👋 Soy Carlos Benítez,{" "}
        <ShinyText text="desarrollador web" /> con formación en{" "}
        <ShinyText text="Ingeniería de Sistemas y Computación." /> Me centro en
        construir <ShinyText text="aplicaciones web modernas" /> que combinan un{" "}
        <ShinyText text="diseño cuidado" /> con una{" "}
        <ShinyText text="arquitectura sólida." />
      </p>
      <p className="anim-about-text">
        Mi experiencia abarca desde el desarrollo de{" "}
        <ShinyText text="interfaces dinámicas" /> con{" "}
        <TechnologyLabel
          name={technologies[0].name}
          icon={technologies[0].icon}
          color={technologies[0].color}
          url={technologies[0].url}
          fitContent={true}
        />{" "}
        /{" "}
        <TechnologyLabel
          name={technologies[1].name}
          icon={technologies[1].icon}
          color={technologies[1].color}
          url={technologies[1].url}
          fitContent={true}
        />{" "}
        hasta la construcción de APIs eficientes con{" "}
        <TechnologyLabel
          name={technologies[10].name}
          icon={technologies[10].icon}
          color={technologies[10].color}
          url={technologies[10].url}
          fitContent={true}
        />{" "}
        /{" "}
        <span className="whitespace-nowrap">
          <TechnologyLabel
            name={technologies[11].name}
            icon={technologies[11].icon}
            color={technologies[11].color}
            url={technologies[11].url}
            fitContent={true}
          />
          .
        </span>{" "}
        Me interesa especialmente la integración entre{" "}
        <ShinyText text="frontend" /> y <ShinyText text="backend" /> para
        ofrecer experiencias fluidas.
      </p>
      <p className="anim-about-text">
        Hoy gran parte de mi trabajo es{" "}
        <ShinyText text="desarrollo agéntico:" /> programo junto a{" "}
        <ShinyText text="agentes de IA" /> y elijo la herramienta adecuada para
        cada tarea. Con <ShinyText text="harness engineering" /> les doy el{" "}
        <ShinyText text="contexto adecuado" /> (reglas, memoria y skills), los
        conecto a herramientas con <ShinyText text="MCP" /> y verifico cada
        cambio con <ShinyText text="tests automáticos." /> Así optimicé este
        portafolio, que hoy cuenta con más de 200 tests.
      </p>
      <div className="anim-about-text space-y-3">
        <p className="font-medium">Logros destacados</p>
        <ul className="list-none space-y-2">
          <li className="anim-achievement-text fx-trigger flex items-start">
            <FaCheck className="fx-icon fx-check mt-1 mr-2 text-cbpviolet-500" />
            <span>
              Motor de cálculo y validación de{" "}
              <ShinyText text="créditos automotrices," /> con análisis de riesgo
              apoyado en IA
            </span>
          </li>
          <li className="anim-achievement-text fx-trigger flex items-start">
            <FaCheck className="fx-icon fx-check mt-1 mr-2 text-cbpviolet-500" />
            <span>
              <ShinyText text="E-commerce con subastas en tiempo real:" />{" "}
              ofertas concurrentes, cierres automáticos y checkout con
              geolocalización
            </span>
          </li>
          <li className="anim-achievement-text fx-trigger flex items-start">
            <FaCheck className="fx-icon fx-check mt-1 mr-2 text-cbpviolet-500" />
            <span>
              <ShinyText text="Automatización" /> de facturas y liquidaciones
              con Python, eliminando procesos manuales
            </span>
          </li>
          <li className="anim-achievement-text fx-trigger flex items-start">
            <FaCheck className="fx-icon fx-check mt-1 mr-2 text-cbpviolet-500" />
            <span>
              Conversión automática de imágenes a WebP y carga en{" "}
              <ShinyText text="AWS S3" /> para acelerar la carga del sitio
            </span>
          </li>
          <li className="anim-achievement-text fx-trigger flex items-start">
            <FaCheck className="fx-icon fx-check mt-1 mr-2 text-cbpviolet-500" />
            <span>
              <ShinyText text="Desarrollo agéntico" /> con distintos agentes de
              IA, apoyado en MCP, subagentes y skills a medida
            </span>
          </li>
          <li className="anim-achievement-text fx-trigger flex items-start">
            <FaCheck className="fx-icon fx-check mt-1 mr-2 text-cbpviolet-500" />
            <span>
              <ShinyText text="Tutor de desarrollo web" /> en la UNAB:
              JavaScript, C#, HTML/CSS y MySQL
            </span>
          </li>
        </ul>
      </div>
    </>
  );
};
