/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'http',  hostname: 'localhost' },
      { protocol: 'http',  hostname: 'localhost', port: '3001', pathname: '/uploads/**' },
      { protocol: 'https', hostname: 'aliceblue-squirrel-974038.hostingersite.com', pathname: '/uploads/**' },
      { protocol: 'https', hostname: 'www.vaswaniindustries.com', pathname: '/uploads/**' },
      { protocol: 'https', hostname: 'vaswaniindustries.com', pathname: '/uploads/**' },
      { protocol: 'https', hostname: 'api.vaswaniindustries.com', pathname: '/uploads/**' },
    ],
  },

  serverExternalPackages: ['mongoose', 'bcryptjs', 'jsonwebtoken', 'slugify'],

  env: {
    NEXT_PUBLIC_API_URL:     process.env.NEXT_PUBLIC_API_URL     || '/api',
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || '',
    NEXT_PUBLIC_SITE_URL:    process.env.NEXT_PUBLIC_SITE_URL    || '',
  },

  async redirects() {
    return [
      // Redirect new. subdomain → main domain (301 permanent)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'new.vaswaniindustries.com' }],
        destination: 'https://vaswaniindustries.com/:path*',
        permanent: true,
      },
      // Redirect www. → non-www (301 permanent)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.vaswaniindustries.com' }],
        destination: 'https://vaswaniindustries.com/:path*',
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
