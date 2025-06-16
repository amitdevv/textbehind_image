/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'images.unsplash.com',
            },
            {
              protocol: 'https',
              hostname: 'res.cloudinary.com',
            },
            {
              protocol: 'https',
              hostname: 'img.icons8.com',
            },
          ],
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },

    // Performance optimizations
    experimental: {
        optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
    },

    // Compression
    compress: true,

    // Remove unused CSS in production
    swcMinify: true,

    async headers() {
      return [
        {
          source: "/app/:path*", 
          headers: [
            { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
            { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          ],
        },
        {
          source: "/(.*)",
          headers: [
            {
              key: "X-Content-Type-Options",
              value: "nosniff",
            },
            {
              key: "X-Frame-Options",
              value: "DENY",
            },
            {
              key: "X-XSS-Protection",
              value: "1; mode=block",
            },
          ],
        },
      ];
    },
};

export default nextConfig;
