import type { NextConfig } from "next";

const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  experimental: { typedRoutes: true },
} satisfies NextConfig;

export default nextConfig;
