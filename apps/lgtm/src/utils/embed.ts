import { SITE_URL } from "#/config/constants";

/** HTML snippet copied to the clipboard for embedding an LGTM image in a PR. */
export const buildEmbedCode = (id: string, format: string): string =>
  `<a href="${SITE_URL}/${id}"><img src="${SITE_URL}/${id}.${format}" alt="LGTM!!" width="400" /></a>`;
