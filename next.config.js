/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   typedRoutes: true,
  // },
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: [
      'localhost',
      'avatars.githubusercontent.com',
      'cloudflare-ipfs.com',
    ],
  },
};

module.exports = nextConfig;
