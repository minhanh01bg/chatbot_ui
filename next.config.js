/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
  // Disable source maps to prevent SourceMap errors
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig; 