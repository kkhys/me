/* Brand colors of the aggregated services and of the products in the
   updates group; intentionally not mapped to the uchu palette. Shared by
   service-card.astro, update-card.astro and source-toc.astro.
   dev.to's brand black and Techmeme's dark teal vanish on the dark
   background, so they flip to lighter variants there; Hugging Face's
   yellow washes out on the light background, so it darkens to the
   orange from the same logo gradient. devto / hfpapers stay for the runs
   up to 2026-09-05, which still render them.
   OpenAI, Cursor and Devin brand in black on white, so all three take the
   same near-black / near-white pair; Slack's aubergine flips to the
   yellow of its logo on the dark background. */
export const SERVICE_COLORS: Record<string, string> = {
  hackernews: "#ff6600",
  lobsters: "#ac130d",
  reddit: "#ff4500",
  github: "#8b5cf6",
  devto: "light-dark(#0f172a, #e2e8f0)",
  techmeme: "light-dark(#1e4c63, #7fb0cb)",
  hfpapers: "light-dark(#ff9d00, #ffd21e)",
  hatena: "#00a4de",
  zenn: "#3ea8ff",
  qiita: "#55c500",
  claude: "#d97757",
  openai: "light-dark(#0f172a, #e2e8f0)",
  devin: "light-dark(#0f172a, #e2e8f0)",
  cursor: "light-dark(#0f172a, #e2e8f0)",
  github_changelog: "#8b5cf6",
  orca: "light-dark(#0f766e, #5eead4)",
  slack: "light-dark(#4a154b, #ecb22e)",
};
