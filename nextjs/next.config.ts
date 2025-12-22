import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },

  // Environment variables that should be available on the client side
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050',
  },

  // Output configuration for Vercel
  output: 'standalone',

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    styledComponents: true,
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
