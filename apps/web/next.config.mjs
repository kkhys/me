import withBundleAnalyzer from '@next/bundle-analyzer';
import { withContentlayer } from 'next-contentlayer';

import './src/env/index.mjs';

/** @type { import("next").NextConfig } */
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
};

// TODO: install with devDependencies and do not load in production environment
const bundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default bundleAnalyzerConfig(withContentlayer(config));
