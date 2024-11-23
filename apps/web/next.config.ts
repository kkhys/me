import type { NextConfig } from "next";
import "#/env";

const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  experimental: { typedRoutes: true },
  transpilePackages: ["@kkhys/ui"],
} satisfies NextConfig;

export default nextConfig;
