/** @type { import("next").NextConfig } */
import withBundleAnalyzer from '@next/bundle-analyzer';
import { withContentlayer } from 'next-contentlayer';

import './src/env.mjs';

const config = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

// TODO: install with devDependencies and do not load in production environment
const bundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default bundleAnalyzerConfig(withContentlayer(config));
