import { apiFetch } from '@/lib/api'
import { Product } from '@/lib/types'

export async function getProducts() {
  return apiFetch<Product[]>('/api/products')
}

export async function getProductBySlug(slug: string) {
  return apiFetch<Product>(`/api/products/${slug}`)
}