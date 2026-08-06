import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Buka komen (uncomment) blok di bawah ini jika ingin langsung diarahkan ke halaman Admin saat development:
      //{
      //   source: "/",
      //   destination: "/admin/overview",
      //   permanent: false,
      // },
    ];
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
