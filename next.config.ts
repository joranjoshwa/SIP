import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.1.3",
        port: "9000",
        pathname: "/**", // Permite qualquer caminho de imagem
      },
    ],
  },
};

export default nextConfig;
