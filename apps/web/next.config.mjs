/** @type { import('next').NextConfig } */

import nextMDX from '@next/mdx';

const nextConfig = {
  experimental: {
    appDir: true,
    mdxRs: true,
  },
  transpilePackages: ['@kkhys/ui'],
};

const withMDX = nextMDX();

export default withMDX(nextConfig);
