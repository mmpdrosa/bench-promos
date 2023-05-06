/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/busca',
        destination: '/search',
      },
      {
        source: '/alertas',
        destination: '/alerts',
      },
      {
        source: '/produto/:path*',
        destination: '/product/:path*',
      },
      {
        source: '/cupons',
        destination: '/coupons',
      },
      {
        source: '/recomendados',
        destination: '/recommended',
      },
      {
        source: '/politica-de-privacidade',
        destination: '/privacy-policy',
      },
    ]
  },
  output: 'standalone',
}

module.exports = nextConfig
