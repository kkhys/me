/**
 * Normalize an `Astro.url.pathname` to the URL the site is actually served
 * under. Every app builds with `build.format: "file"`, so Astro reports
 * `/index.html` and `/privacy.html` — emitting those verbatim in canonical /
 * og:url tags contradicts the extensionless URLs the sitemap advertises.
 */
export const normalizePathname = (pathname: string): string => {
  const withoutHtml = pathname.replace(/\/index\.html$/u, "/").replace(/\.html$/u, "");
  const withoutTrailingSlash = withoutHtml.replace(/(?<=.)\/$/u, "");
  return withoutTrailingSlash === "" ? "/" : withoutTrailingSlash;
};
