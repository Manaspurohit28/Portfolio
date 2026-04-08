// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',   // devicon skill logos
      },
    ],
  },
  // Strict mode for catching bugs early
  reactStrictMode: true,
};

module.exports = nextConfig;