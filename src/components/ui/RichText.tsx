import { splitRichText } from "../../utils/richText";
import ShinyText from "./ShinyText";

// Pinta con ShinyText lo marcado entre **dobles asteriscos**. En línea (no
// inline-block): un resaltado largo se parte con el resto del texto.
export const RichText = ({ text }: { text: string }) => (
  <>
    {splitRichText(text).map((part, index) =>
      index % 2 ? (
        <ShinyText key={index} text={part} className="inline!" />
      ) : (
        part
      ),
    )}
  </>
);
