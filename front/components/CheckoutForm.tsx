'use client'

import { useActionState } from 'react'
import { createOrder } from '@/lib/actions/order'
import { CartItem } from '@/lib/types'

interface CheckoutFormProps {
  items: CartItem[]
  total: number
}

export default function CheckoutForm({ items, total }: CheckoutFormProps) {
  const [error, formAction, isPending] = useActionState(createOrder, undefined)

  return (
    <div>
      <div className="border rounded-xl p-4 mb-6">
        <h2 className="font-semibold mb-3">Your order:</h2>
        <div className="flex flex-col gap-2">
          {items.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.variant.product.name} — {item.variant.size} / {item.variant.color} × {item.quantity}</span>
              <span>{(item.variant.price * item.quantity / 100).toLocaleString()} ₸</span>
            </div>
          ))}
        </div>
        <div className="border-t mt-3 pt-3 flex justify-between font-bold">
          <span>Total:</span>
          <span>{(total / 100).toLocaleString()} ₸</span>
        </div>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <input
          type="text"
          name="deliveryAddress"
          placeholder="Delivery address"
          required
          className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
        >
          {isPending ? 'Placing your order...' : 'Place an order'}
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  )
}