'use server'

import { apiFetch } from '@/lib/api'
import { getCart } from '@/lib/actions/cart'
import { redirect } from 'next/navigation'
import { Order } from '@/lib/types'

export async function createOrder(prevState: string | undefined, formData: FormData) {
  const deliveryAddress = formData.get('deliveryAddress') as string
  let stripeUrl: string

  try {
    const cartItems = await getCart() as any[]
    if (!Array.isArray(cartItems) || cartItems.length === 0) return 'Cart is empty'

    const total = cartItems.reduce((sum, item) => sum + item.variant.price * item.quantity, 0)

    const order = await apiFetch<{ id: string }>('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ deliveryAddress, total, items: cartItems })
    })

    const session = await apiFetch<{ url: string }>('/api/payments/checkout', {
      method: 'POST',
      body: JSON.stringify({ orderId: order.id })
    })

    stripeUrl = session.url
  } catch {
    return 'Error creating order'
  }

  redirect(stripeUrl)
}

export async function getOrders() {
  return apiFetch<Order[]>('/api/orders')
}

export async function getOrderById(orderId:string) {
     return apiFetch<Order>(`/api/orders/${orderId}`)
}

export async function createCheckoutSession(orderId: string) {
  return apiFetch<{ url: string }>('/api/payments/checkout', {
    method: 'POST',
    body: JSON.stringify({ orderId })
  })
}