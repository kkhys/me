import { createFaviconRoutes } from "@kkhys/og/handlers";

export const { getStaticPaths, GET } = createFaviconRoutes(
  "linear-gradient(135deg, #f8bbd0 0%, #e53935 45%, #1a237e 100%)",
);
