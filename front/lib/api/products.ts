import { apiFetch } from '@/lib/api'
import { Product } from '@/lib/types'

interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  totalPages: number
}

interface ProductsParams {
  search?: string
  category?: string
  sortBy?: string
  order?: string
  page?: number
  limit?: number
}

export async function getProducts(params: ProductsParams = {}) {
  const query = new URLSearchParams()
  if (params.search) query.set('search', params.search)
  if (params.category) query.set('category', params.category)
  if (params.sortBy) query.set('sortBy', params.sortBy)
  if (params.order) query.set('order', params.order)
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))

  return apiFetch<ProductsResponse>(`/api/products?${query.toString()}`)
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

export async function updateProduct(id: string, data: Partial<Product>) {
  return apiFetch(`/api/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  })
}

export async function deleteProduct(id: string) {
  return apiFetch(`/api/products/${id}`, {
    method: 'DELETE'
  })
}

