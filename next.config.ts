import type { NextConfig } from "next";

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: process.env.NEXT_PUBLIC_BUCKET_HOSTNAME,
                port: process.env.NEXT_PUBLIC_BUCKET_PORT,
                pathname: '/itemsimage/**',
            },
            {
                protocol: 'http',
                hostname: process.env.NEXT_PUBLIC_BUCKET_HOSTNAME,
                port: process.env.NEXT_PUBLIC_BUCKET_PORT,
                pathname: '/profimage/**',
            },
        ],
    },
};

export default nextConfig;
