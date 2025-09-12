import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: process.env.NEXT_PUBLIC_IMAGE_HOST!,
        port: process.env.NEXT_PUBLIC_IMAGE_PORT,
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
