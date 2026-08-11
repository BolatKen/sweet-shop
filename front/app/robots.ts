import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sweet-shop-one-flame.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/checkout', '/profile', '/cart'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
