import type { NextConfig } from "next";

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '10.0.0.103',
                port: '9000',
                pathname: '/itemsimage/**',
            },
            {
                protocol: 'http',
                hostname: '10.0.0.103',
                port: '9000',
                pathname: '/profimage/**',
            },
        ],
    },
};

export default nextConfig;
