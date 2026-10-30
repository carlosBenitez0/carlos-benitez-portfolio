import { about } from "../../content/site";
import { t } from "../../i18n/ui";
import { RichText } from "./RichText";

// Texto de "Sobre mí", desde src/content (la misma fuente que el HTML
// estático, /llms.txt e /index.md).
export const AboutText = () => (
  <>
    {about.paragraphs.map((paragraph, index) => (
      <p key={index} className="anim-about-text">
        {index === 0 && `${t.about.greeting} `}
        <RichText text={paragraph} />
      </p>
    ))}
  </>
);
