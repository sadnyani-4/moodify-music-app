import type { NextConfig } from "next";

const nextConfig = {
  output: 'export', // Keep this for static export, Render can also serve this
  images: {
    unoptimized: true,
  },
  // ... other configurations
};

export default nextConfig;