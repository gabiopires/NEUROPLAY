import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  /* config options here */
  webpack: (config, { isServer }) => {
    // Se estiver compilando para o navegador (client-side), ignora o módulo 'fs'
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;