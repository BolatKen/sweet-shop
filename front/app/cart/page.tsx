import { getCart } from '@/lib/actions/cart'
import Link from 'next/link'

export default async function CartPage() {
    const cart = await getCart();
    return(
        <main className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Cart</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {cart.map(cartItem => (
                    <Link href={`/products/${cartItem.variant.product.slug}`} key={cartItem.id}>
                        <div className="border rounded-xl p-4 hover:shadow-md transition cursor-pointer">
                        <div className="bg-gray-100 h-48 rounded-lg mb-3" />
                        <h2 className="font-semibold text-lg">{cartItem.variant.product.name}</h2>
                        <p className="text-gray-500 text-sm">{cartItem.variant.size} / {cartItem.variant.color}</p>
                        <p className="font-bold mt-2">{(cartItem.variant.price / 100).toLocaleString()} ₸</p>
                        <p className="text-sm text-gray-400">Количество: {cartItem.quantity}</p>
                        </div>
                    </Link>
                    ))}
            </div>
        </main>
    )
}