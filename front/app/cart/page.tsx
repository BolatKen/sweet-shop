import { getCart } from '@/lib/actions/cart'
import Link from 'next/link'
import QuantitySelector from '@/components/QuantitySelector'
import Button from '@/components/Button'

export default async function CartPage() {
    const cart = await getCart();


    if (!Array.isArray(cart)) {
        return (
        <main className="min-h-screen flex flex-col items-center justify-center">
            <p className="text-gray-500 text-lg">Log in to chekc cart</p>
            <Link href="/auth/login" className="mt-4 bg-black text-white px-6 py-3 rounded-xl">
            Log in
            </Link>
        </main>
        )
    }

    if (cart.length === 0) {
        return (
      <main className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 text-lg">Cart is empty</p>
        <Link href="/products" className="mt-4 bg-black text-white px-6 py-3 rounded-xl">
          Catalog
        </Link>
      </main>
    )
    }

    return(
        <main className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Cart</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {cart.map(cartItem => (
                    <div key={cartItem.id}>
                        <Link href={`/products/${cartItem.variant.product.slug}`} >
                            <div className="border rounded-xl p-4 hover:shadow-md transition cursor-pointer">
                            <div className="bg-gray-100 h-48 rounded-lg mb-3" />
                            <h2 className="font-semibold text-lg">{cartItem.variant.product.name}</h2>
                            <p className="text-gray-500 text-sm">{cartItem.variant.size} / {cartItem.variant.color}</p>
                            <p className="font-bold mt-2">{(cartItem.variant.price / 100).toLocaleString()} ₸</p>
                            </div>
                        </Link>
                        <QuantitySelector
                                variantId = {cartItem.variant.id}
                                initialQuantity = {cartItem.quantity}
                                />
                    </div>
                    ))}
            </div>
            <Link href='/checkout'>
            <Button> Checkout </Button>
            </Link>
        </main>
    )
}