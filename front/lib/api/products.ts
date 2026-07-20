import { apiFetch } from '@/lib/api'
import { Product } from '@/lib/types'

export async function getProducts() {
  return apiFetch<Product[]>('/api/products')
}

export async function getProductBySlug(slug: string) {
  return apiFetch<Product>(`/api/products/${slug}`)
}

export async function createProduct(data: Partial<Product>) {
  return apiFetch('/api/products', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export async function updateProduct(slug: string, data: Partial<Product>) {
  return apiFetch(`/api/products${slug}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  })
}

export async function deleteProduct(slug: string) {
  return apiFetch(`api/products/${slug}`), {
    method: 'DELETE'
  }
}

