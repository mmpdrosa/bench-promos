/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'ae01.alicdn.com', 
      'm.media-amazon.com', 
      'media.discordapp.net',
      'images.kabum.com.br',
      'www.lenovo.com',
      'acerstore.vtexassets.com',
      'carrefourbr.vtexassets.com',
      'a-static.mlcdn.com.br',
      't17208.vtexassets.com',
      'imgs.casasbahia.com.br',
      'cdn.discordapp.com'
    ],
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
        source: '/promocoes',
        destination: '/sales',
      },
      {
        source: '/cupons',
        destination: '/coupons',
      },
      {
        source: '/recomendados',
        destination: '/recommended',
      },
    ]
  },
}

module.exports = nextConfig
