import type { NextConfig } from "next";

const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  experimental: { typedRoutes: true },
  transpilePackages: ["@kkhys/ui"],
} satisfies NextConfig;

export default nextConfig;
