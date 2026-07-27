import { apiFetch } from '@/lib/api'
import { Category } from '@/lib/types'

export async function getCategories() {
  return apiFetch<Category[]>('/api/categories')
}