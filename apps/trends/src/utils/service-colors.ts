/* Brand colors of the aggregated services; intentionally not mapped to the
   uchu palette. Shared by service-card.astro and source-toc.astro.
   dev.to's brand black vanishes on the dark background, so it flips to the
   inverted logo color there. */
export const SERVICE_COLORS: Record<string, string> = {
  hackernews: "#ff6600",
  lobsters: "#ac130d",
  github: "#8b5cf6",
  devto: "light-dark(#0f172a, #e2e8f0)",
  hatena: "#00a4de",
  zenn: "#3ea8ff",
  qiita: "#55c500",
};
