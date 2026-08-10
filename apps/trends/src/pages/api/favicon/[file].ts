import { createFaviconRoutes } from "@kkhys/og/handlers";

export const { getStaticPaths, GET } = createFaviconRoutes(
  "radial-gradient(circle at 35% 35%, #93c5fd 0%, #2563eb 45%, #1e3a8a 100%)",
);
