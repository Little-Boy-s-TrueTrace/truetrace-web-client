import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; frame-ancestors 'none';",
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), usb=(), payment=()',
          },
        ],
      },
    ];
  },
  async rewrites() {
    const beBackendUrl = process.env.BE_BACKEND_URL || 'http://localhost:8080';
    const dashboardBackendUrl = process.env.DASHBOARD_BACKEND_URL || 'http://localhost:8082';
    const dashboardFrontendUrl = process.env.DASHBOARD_FRONTEND_URL || 'http://localhost:3001';

    return [
      {
        source: '/soc/:path*',
        destination: `${dashboardFrontendUrl}/soc/:path*`,
      },
      {
        source: '/api-bank/:path*',
        destination: `${beBackendUrl}/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${dashboardBackendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
