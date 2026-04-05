import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'tile.loc.gov', pathname: '/**' },
      { protocol: 'https', hostname: 'stacks.stanford.edu', pathname: '/**' },
    ],
  },
}

export default nextConfig
