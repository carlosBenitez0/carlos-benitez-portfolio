// Texto con resaltados marcados entre **dobles asteriscos** (ver RichText).

// Partes en orden; las de índice impar son las resaltadas.
export const splitRichText = (text: string) => text.split("**");

export const plainText = (text: string) => text.replaceAll("**", "");
