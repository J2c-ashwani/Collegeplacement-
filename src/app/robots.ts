import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://collegeplacement-one.vercel.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/institution/',
          '/employer/',
          '/student/',
          '/_next/',
          '/auth/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/institution/',
          '/employer/',
          '/student/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
