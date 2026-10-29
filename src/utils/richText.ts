// Texto con marcas: **resaltado** (ShinyText) y [[Tecnología]] (etiqueta con
// su logo). Ver RichText; el HTML estático y /llms.txt usan plainText.

export type RichPart =
  | { type: "text"; value: string }
  | { type: "highlight"; value: string }
  | { type: "technology"; value: string };

const TOKEN = /\*\*(.+?)\*\*|\[\[(.+?)\]\]/g;

export const parseRichText = (text: string): RichPart[] => {
  const parts: RichPart[] = [];
  let last = 0;
  for (const match of text.matchAll(TOKEN)) {
    if (match.index > last) {
      parts.push({ type: "text", value: text.slice(last, match.index) });
    }
    parts.push(
      match[1] !== undefined
        ? { type: "highlight", value: match[1] }
        : { type: "technology", value: match[2] },
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ type: "text", value: text.slice(last) });
  return parts;
};

export const plainText = (text: string) =>
  parseRichText(text)
    .map((part) => part.value)
    .join("");
