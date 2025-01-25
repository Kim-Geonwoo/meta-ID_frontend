/** @type {import('next').NextConfig} */

require('dotenv').config();

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
  };
  
  module.exports = {
    images: {
        domains: ['img-sv.geonwoo.dev']
    },
    reactStrictMode: true,
    ...nextConfig
  };