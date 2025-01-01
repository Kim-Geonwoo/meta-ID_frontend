/** @type {import('next').NextConfig} */

require('dotenv').config();

const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/graphql',
          destination: 'https://scaling-rotary-phone-r6xjpvgrpj7c5x69-8081.app.github.dev/graphql', // 백엔드 GraphQL 엔드포인트
        },
      ];
    },
    env: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_KEY,
    },
  };
  
  module.exports = nextConfig;