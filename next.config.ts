import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true, layers: true };
    return config;
  },
  serverExternalPackages: ["@piplabs/cdr-sdk"],
  turbopack: {},
  async rewrites() {
    return [
      {
        source: "/api/story/:path*",
        // Proxy to the Story Protocol LCD REST endpoint to avoid browser CORS / Mixed Content blocks
        destination: "http://172.192.41.96:1317/:path*",
      },
    ];
  },
};

export default nextConfig;
