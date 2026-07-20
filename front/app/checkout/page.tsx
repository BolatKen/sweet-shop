'use client'

import { useActionState } from 'react'
import { createOrder } from '@/lib/actions/order'

export default function CheckoutPage() {
  const [error, formAction, isPending] = useActionState(createOrder, undefined)

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Making an order</h1>
      <form action={formAction} className="flex flex-col gap-4">
        <input
          type="text"
          name="deliveryAddress"
          placeholder="Delievery address"
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
    </main>
  )
}