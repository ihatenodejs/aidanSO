import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'p0ntus.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'github-readme-stats.vercel.app',
        port: '',
        pathname: '/**'
      }
    ],
    dangerouslyAllowSVG: true
  }
}

export default nextConfig
