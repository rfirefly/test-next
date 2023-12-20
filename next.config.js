const isProd = process.env.NODE_ENV === 'production'

const assetPrefix = isProd ? 'https://test-next-rfirefly.vercel.app' : ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: assetPrefix,
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
