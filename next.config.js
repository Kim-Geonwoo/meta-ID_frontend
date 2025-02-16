/** @type {import('next').NextConfig} */

require('dotenv').config();

const withPWA = require('next-pwa')({
  dest: 'public',
});

const nextConfig = {
    async rewrites() {
      return [
        
      ];
    },
    env: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_KEY,
    },
    reactStrictMode: true,
    images: {
        domains: ['img-sv.geonwoo.dev']
    },
};

module.exports = withPWA(nextConfig);