import { fileURLToPath } from 'url';
import withBundleAnalyzer from '@next/bundle-analyzer';
import _jiti from 'jiti';
import { withContentlayer } from 'next-contentlayer';

const jiti = _jiti(fileURLToPath(import.meta.url));

jiti('./src/env');

/** @type {import("next").NextConfig} */
const config = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  /**
   * @see https://github.com/contentlayerdev/contentlayer/issues/313#issuecomment-1279678289
   */
  webpack: (config) => {
    config.infrastructureLogging = {
      level: 'error',
    };
    return config;
  },
  experimental: {
    typedRoutes: true,
  },
  async rewrites() {
    return [
      {
        source: '/humans.txt',
        destination: '/humans',
      },
    ];
  },
};

// TODO: install with devDependencies and do not load in production environment
const bundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default bundleAnalyzerConfig(withContentlayer(config));
