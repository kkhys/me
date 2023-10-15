/** @type { import("next").NextConfig } */
import { withContentlayer } from 'next-contentlayer';

import './src/env.mjs';

const config = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default withContentlayer(config);
