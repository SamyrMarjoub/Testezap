import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['storage.googleapis.com'],
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignora erros do ESLint no build
  },
  typescript: {
    ignoreBuildErrors: true, // Ignora erros de TypeScript no build
  },
};

export default nextConfig;
