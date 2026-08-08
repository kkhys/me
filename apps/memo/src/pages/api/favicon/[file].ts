import { createFaviconRoutes } from "@kkhys/og/handlers";

export const { getStaticPaths, GET } = createFaviconRoutes(
  "radial-gradient(circle at 35% 35%, #ffffff 0%, #d0d0d0 40%, #808080 100%)",
);
