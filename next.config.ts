import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    optimizeCss: true,
    staleTimes: {
      dynamic: 0,
      static: 30,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'aptdzabspsytvbojlxbu.supabase.co',
      },
    ],
  },
};

export default nextConfig;
