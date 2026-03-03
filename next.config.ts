import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for drag & drop deployment
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
  },
  
  // Trailing slashes for better static hosting compatibility
  trailingSlash: true,
};

export default nextConfig;