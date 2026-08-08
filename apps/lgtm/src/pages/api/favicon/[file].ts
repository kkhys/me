import { createFaviconRoutes } from "@kkhys/og/handlers";

export const { getStaticPaths, GET } = createFaviconRoutes(
  "radial-gradient(circle at 35% 35%, #c8e6c9 0%, #81c784 40%, #4caf50 100%)",
);
