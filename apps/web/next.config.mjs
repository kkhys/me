/** @type { import("next").NextConfig } */

import './src/env.mjs';

const config = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default config;
