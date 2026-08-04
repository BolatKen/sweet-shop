'use server'
import { apiFetch } from '@/lib/api'
import { Category, Order, User } from '@/lib/types'

export async function getStats() {
  return apiFetch<{ products: number, orders: number, users: number }>('/api/admin/stats')
}

export async function getOrders() {
  return apiFetch<Order[]>('/api/admin/orders')
}

export async function updateOrderStatus(id: string, status: string) {
  return apiFetch(`/api/admin/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })
}

export async function getUsers() {
    return apiFetch<User[]>('/api/admin/users')
}

export async function updateUserRole(id: string, role: string) {
  const res = await apiFetch(`/api/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ role })
  })
  return res
}

export async function getCategories() {
  return apiFetch<Category[]>('/api/categories')
}

export async function updateCategory(id: string, data: Partial<Category>) {
  const res = await apiFetch<Category>(`/api/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  })
  return res
}

export async function createCategory(data: { name: string; slug: string; parentId?: string }) {
  return apiFetch('/api/categories', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export async function deleteCategory(id: string) {
  return apiFetch(`/api/categories/${id}`, {
    method: 'DELETE'
  })
}