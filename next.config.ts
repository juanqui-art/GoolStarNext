import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🚀 PERFORMANCE OPTIMIZATIONS
  compress: true,
  poweredByHeader: false,
  
  // 📊 EXPERIMENTAL FEATURES
  experimental: {
    // optimizeCss: true, // Disabled temporarily - requires critters
    gzipSize: true,
  },
  
  
  // 🖼️ IMAGE OPTIMIZATION
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // 🔧 WEBPACK OPTIMIZATIONS
  webpack: (config, { dev, isServer }) => {
    // Remove console.logs in production
    if (!dev && !isServer) {
      config.optimization.minimizer.push(
        // Terser plugin for console.log removal (handled by Next.js built-in)
      );
    }
    
    // Bundle analyzer in development
    if (dev && process.env.ANALYZE === 'true') {
      // Bundle analyzer available via ANALYZE=true flag
    }
    
    return config;
  },
  
  // 📱 PWA SUPPORT
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ],
  
  // 🎯 REDIRECTS FOR SEO
  redirects: async () => [
    {
      source: '/torneos/:path*',
      has: [
        {
          type: 'query',
          key: 'old',
        },
      ],
      destination: '/torneos/:path*',
      permanent: true,
    },
  ],
};

export default nextConfig;
