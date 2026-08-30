/**
 * Alt text for a figure whose caption is rendered as visible text. When the
 * caption repeats the alt, an empty alt keeps screen readers from hearing the
 * same words twice; a distinct alt still describes what the caption comments on.
 */
export const figureAlt = (alt: string, caption: string | null | undefined): string =>
  typeof caption === "string" && alt.trim() === caption.trim() ? "" : alt;
