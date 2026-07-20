'use server'

import { apiFetch } from '@/lib/api'
import { Product, Category } from '@/lib/types'

export async function getProducts() {
  return apiFetch<Product[]>('/api/products')
}

export async function getCategories() {
    return apiFetch<Category[]>('/api/categories')
}

export async function createProduct(data: Partial<Product>) {
  return apiFetch('/api/products', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export async function createVariant(productId: string, data: {
  size: string
  color: string
  price: number
  stock: number
}) {
  return apiFetch(`/api/products/${productId}/variants`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export async function deleteVariant(productId: string, variantId: string) {
  return apiFetch(`/api/products/${productId}/variants/${variantId}`, {
    method: 'DELETE'
  })
}

export async function updateProduct(slug: string, data: Partial<Product>) {
  return apiFetch(`/api/products/${slug}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  })
}

export async function deleteProduct(slug: string) {
  return apiFetch(`/api/products/${slug}`, {
    method: 'DELETE'
  })
}