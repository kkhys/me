import { createFaviconRoutes } from "@kkhys/og/handlers";

export const { getStaticPaths, GET } = createFaviconRoutes(
  "radial-gradient(circle at 35% 35%, #f5f5f5 0%, #bdbdbd 40%, #616161 100%)",
);
