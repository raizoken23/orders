
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https'
        ,
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  outputFileTracingIncludes: {
    "/**/*": ["./pdfsys/**/*", "./public/satellite_base.pdf"]
  },
  serverExternalPackages: ["pypdf", "reportlab", "pymupdf", "undici", "stripe"],
  experimental: {
    // Kept for any future experimental flags, but the moved ones are now at the top level.
  }
};

export default nextConfig;
