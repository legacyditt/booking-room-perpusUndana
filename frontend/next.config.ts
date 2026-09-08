import type { NextConfig } from "next";

const backendUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://booking-room-perpus-undana-api.vercel.app"
    : "http://localhost:3001");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Buka komen (uncomment) blok di bawah ini jika ingin langsung diarahkan ke halaman Admin saat development:
      // {
      //   source: "/",
      //   destination: "/admin/overview",
      //   permanent: false,
      // },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${backendUrl}/api/auth/:path*`,
      },
      {
        source: "/api/backend/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "t3.storage.dev",
      },
    ],
  },
};

export default nextConfig;
