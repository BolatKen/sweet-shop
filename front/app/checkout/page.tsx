import { getCart } from '@/lib/actions/cart'
import CheckoutForm from '@/components/CheckoutForm'

export default async function CheckoutPage() {
  const cart = await getCart()
  const items = Array.isArray(cart) ? cart : []
  const total = items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0)

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Making an order</h1>
      <CheckoutForm items={items} total={total} />
    </main>
  )
}