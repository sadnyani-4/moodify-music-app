import type { NextConfig } from "next";

const nextConfig = {
  output: 'export', // Keep this for static export
  // basePath: '/moodify-music-app', // Comment this out or remove it for local development
  images: {
    unoptimized: true,
  },
  // ... other configurations
};

export default nextConfig;