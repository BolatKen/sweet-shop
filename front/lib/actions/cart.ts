"use server"
import { apiFetch } from '@/lib/api'
import { CartItem } from '@/lib/types'

export async function addToCart(variantId: string, changeQuantity: number = 1) {
    const res = await apiFetch('/api/cart', {
        method: 'POST',
        body: JSON.stringify({variantId, quantity: changeQuantity})
    });
    return res;
}

export async function getCart() {
    return apiFetch<CartItem[]>(`/api/cart/`)
}

