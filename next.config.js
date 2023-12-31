const isProd = process.env.NODE_ENV === 'production'

const assetPrefix = isProd ? 'https://test-next-rfirefly.vercel.app' : 'https://9f18-1-33-209-34.ngrok-free.app'

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: assetPrefix,
  trailingSlash: true,
  env: {
    ASSET_PREFIX: assetPrefix,
  },
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
