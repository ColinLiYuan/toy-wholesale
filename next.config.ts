import type { NextConfig } from "next";

// 后端 API 地址（从环境变量读取，用于 Next.js 代理配置）
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9356';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '47.82.116.234',
        port: '9900',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-e5d14c6d386c4d90979458082617517a.r2.dev',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      // API 代理 - 将 /api/* 请求转发到后端（仅 Client Component 使用）
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;
