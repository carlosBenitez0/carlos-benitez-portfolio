import type { ReactNode } from "react";
import { parseRichText } from "../../utils/richText";
import { useTechnologies } from "../../utils/useTechnologies";
import ShinyText from "./ShinyText";
import { TechnologyLabel } from "./proyects/TechnologyLabel";

interface RichTextProps {
  text: string;
  // Cómo pintar un **resaltado**. Por defecto, ShinyText en línea (no
  // inline-block): un resaltado largo se parte con el resto del texto.
  renderHighlight?: (text: string) => ReactNode;
}

const defaultHighlight = (text: string) => (
  <ShinyText text={text} className="inline!" />
);

// Pinta las marcas de src/utils/richText: **resaltado** y [[Tecnología]].
export const RichText = ({
  text,
  renderHighlight = defaultHighlight,
}: RichTextProps) => {
  const technologies = useTechnologies();

  return (
    <>
      {parseRichText(text).map((part, index) => {
        if (part.type === "highlight") {
          return <span key={index}>{renderHighlight(part.value)}</span>;
        }
        if (part.type === "technology") {
          const technology = technologies.find((t) => t.name === part.value);
          return technology ? (
            <TechnologyLabel
              key={index}
              name={technology.name}
              icon={technology.icon}
              color={technology.color}
              url={technology.url}
              fitContent
            />
          ) : (
            part.value
          );
        }
        return part.value;
      })}
    </>
  );
};
