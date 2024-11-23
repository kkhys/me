import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";
import type { NextConfig } from "next";

createJiti(fileURLToPath(import.meta.url))("./src/env");

const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  experimental: { typedRoutes: true },
  transpilePackages: ["@kkhys/ui"],
} satisfies NextConfig;

export default nextConfig;
