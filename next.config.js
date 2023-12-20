const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: isProd ? 'https://test-next-rfirefly.vercel.app' : '',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'test-next-rfirefly.vercel.app',
      },
    ],
  },
}

module.exports = nextConfig
