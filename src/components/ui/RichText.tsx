import { splitRichText } from "../../utils/richText";
import ShinyText from "./ShinyText";

// Pinta con ShinyText lo marcado entre **dobles asteriscos**.
export const RichText = ({ text }: { text: string }) => (
  <>
    {splitRichText(text).map((part, index) =>
      index % 2 ? <ShinyText key={index} text={part} /> : part,
    )}
  </>
);
