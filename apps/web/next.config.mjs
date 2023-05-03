/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    appDir: true,
    // typedRoutes: true,
  },
  transpilePackages: ['@kkhys/ui'],
};

export default nextConfig;
