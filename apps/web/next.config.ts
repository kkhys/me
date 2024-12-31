import type { NextConfig } from "next";
import { withContentlayer } from "next-contentlayer2";
import "#/env";

const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  experimental: { typedRoutes: true },
  transpilePackages: [
    "@kkhys/db",
    "@kkhys/email",
    "@kkhys/ui",
    "@kkhys/validators",
  ],
  async rewrites() {
    return [
      {
        source: "/humans.txt",
        destination: "/humans",
      },
    ];
  },
} satisfies NextConfig;

export default withContentlayer(nextConfig);
