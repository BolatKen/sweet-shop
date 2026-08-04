import { getCart } from '@/lib/actions/cart'
import CheckoutForm from '@/components/CheckoutForm'
import Link from 'next/link'

export default async function CheckoutPage() {
  let cart = []
  try {
    const res = await getCart()
    cart = Array.isArray(res) ? res : []
  } catch {
    cart = []
  }

  const items = cart
  const subtotal = items.reduce((sum, item) => sum + (item.variant?.price || 0) * item.quantity, 0)
  const shipping = subtotal >= 2500000 ? 0 : 200000
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-10 max-w-md w-full">
          <span className="text-4xl mb-4 block">🛒</span>
          <h1 className="text-2xl font-black uppercase tracking-tight text-black mb-2">No Items To Checkout</h1>
          <p className="text-neutral-500 text-sm mb-6">Your bag is empty. Add items from our catalog before checking out.</p>
          <Link href="/products" className="bg-black text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
            Browse Catalog
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black mb-8 text-center">
        Express Checkout
      </h1>
      <CheckoutForm items={items} total={total} />
    </main>
  )
}