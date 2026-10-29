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
    </>
  );
};
