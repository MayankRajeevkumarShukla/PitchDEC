// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignore canvas and other node-specific modules during build
  webpack: (config, { isServer }) => {
    // Ignore canvas module in client-side builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        stream: false,
        path: false,
      };
    }

    // Ignore binary files and native modules
    config.module.rules.push({
      test: /\.node$/,
      use: 'ignore-loader'
    });

    // Ignore canvas completely
    config.externals = config.externals || [];
    config.externals.push('canvas');

    return config;
  },
  
  // Additional optimizations
  experimental: {
    esmExternals: 'loose' as const
  },
  
  // Ignore build errors for these modules
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;