import { createFaviconRoutes } from "@kkhys/og/handlers";

export const { getStaticPaths, GET } = createFaviconRoutes(
  "linear-gradient(to bottom right, #dbe7f0 0%, #527ce0 50%, #03077c 100%)",
);
