'use server'
import { apiFetch } from '@/lib/api'
import { Order, User } from '@/lib/types'

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
  console.log('updateUserRole response:', res)
  return res
}