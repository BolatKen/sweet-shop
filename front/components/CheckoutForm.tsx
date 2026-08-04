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
    <div className="flex flex-col gap-6">
      {/* Order Items Breakdown */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 sm:p-8">
        <h2 className="text-lg font-black uppercase tracking-tight text-black mb-4 border-b border-neutral-200 pb-3">
          Order Summary ({items.length} items)
        </h2>
        <div className="flex flex-col gap-3">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center text-xs py-1">
              <div>
                <span className="font-bold text-black block">{item.variant?.product?.name || 'Product'}</span>
                <span className="text-neutral-500 font-medium">
                  Size: {item.variant?.size} / Color: {item.variant?.color} (Qty: {item.quantity})
                </span>
              </div>
              <span className="font-black text-black text-sm">
                {(((item.variant?.price || 0) * item.quantity) / 100).toLocaleString()} ₸
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-200 mt-4 pt-4 flex justify-between items-baseline font-black text-black">
          <span className="text-base uppercase tracking-tight">Total Amount</span>
          <span className="text-2xl font-black">{(total / 100).toLocaleString()} ₸</span>
        </div>
      </div>

      {/* Delivery Form */}
      <form action={formAction} className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 flex flex-col gap-4 shadow-sm">
        <h2 className="text-lg font-black uppercase tracking-tight text-black border-b border-neutral-100 pb-3">
          Delivery Address
        </h2>

        <div>
          <label className="text-xs font-extrabold uppercase tracking-wider text-black block mb-1.5">
            Full Street Address & City
          </label>
          <input
            type="text"
            name="deliveryAddress"
            placeholder="e.g. Abay Ave 150, Apt 45, Almaty"
            required
            className="w-full bg-neutral-50 border border-neutral-300 rounded-2xl px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-black text-black"
          />
        </div>

        <button
          type="submit"
          disabled={isPending || items.length === 0}
          className="mt-4 w-full bg-black text-white font-extrabold py-4 rounded-full text-xs uppercase tracking-wider hover:bg-neutral-800 transition active:scale-[0.99] shadow-lg disabled:opacity-50"
        >
          {isPending ? 'Processing Order...' : 'Continue to Payment'}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-2xl text-xs font-bold text-center">
            {error}
          </div>
        )}
      </form>
    </div>
  )
}