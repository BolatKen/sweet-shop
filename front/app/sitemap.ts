import type { MetadataRoute } from 'next'
import { getProducts } from '@/lib/api/products'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sweet-shop-one-flame.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ]

  try {
    const data = await getProducts({ limit: 100 })
    const productRoutes: MetadataRoute.Sitemap = (data?.products ?? []).map((p) => ({
      url: `${SITE_URL}/products/${p.slug}`,
      lastModified: new Date(p.createdAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
    return [...staticRoutes, ...productRoutes]
  } catch {
    return staticRoutes
  }
}
