/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Configuration des images
  images: {
    domains: [
      'www.moviehunt.fr',
      'image.tmdb.org',
      'fjoxqvdilkbxivzskrmg.supabase.co', // Supabase storage
    ],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Variables d'environnement publiques
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  
  // Optimisations
  compress: true,
  
  // Rewrites pour proxy API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://moviehunt-blog-api.vercel.app/api/:path*',
      },
    ];
  },

  // Redirections
  async redirects() {
    return [
      {
        source: '/articles/:slug',
        destination: '/article/:slug',
        permanent: true,
      },
    ];
  },
  
  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
