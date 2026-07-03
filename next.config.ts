import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Reserved for low-memory webpack compilation options as Next exposes them.
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.net",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Cloudinary base domain
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Reduce webpack memory usage on Windows.
    void isServer;

    config.cache = false;
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: "all",
        maxInitialRequests: 10,
        maxAsyncRequests: 10,
        cacheGroups: {
          default: false,
          vendors: false,
        },
      },
    };

    return config;
  },
};

export default nextConfig;
