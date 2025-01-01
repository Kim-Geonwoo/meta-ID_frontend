/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/graphql',
          destination: 'https://scaling-rotary-phone-r6xjpvgrpj7c5x69-8081.app.github.dev/graphql', // 백엔드 GraphQL 엔드포인트
        },
      ];
    },
  };
  
  module.exports = nextConfig;