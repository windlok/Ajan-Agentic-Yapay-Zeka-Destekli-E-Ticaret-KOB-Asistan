/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: process.env.NODE_ENV === 'development',
  swcMinify: true,
  productionBrowserSourceMaps: false,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  },
  experimental: {
    optimizePackageImports: ['@google/generative-ai'],
  },
};

module.exports = nextConfig;
