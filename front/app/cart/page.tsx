import { getCart } from '@/lib/actions/cart'
import Link from 'next/link'
import Image from 'next/image'
import QuantitySelector from '@/components/QuantitySelector'

export default async function CartPage() {
   let cart: any[] = []; 
    try {
        const res = await getCart();
        cart = Array.isArray(res) ? res : [];
    } catch {
        cart = [];
    }

    if (!Array.isArray(cart)) {
        return (
            <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
                <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-10 max-w-md w-full">
                    <span className="text-4xl mb-4 block">🛍️</span>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-black mb-2">Your Bag is Waiting</h1>
                    <p className="text-neutral-500 text-sm mb-6">Log in to view your saved items and checkout.</p>
                    <Link href="/auth/login" className="bg-black text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition inline-block">
                        Sign In
                    </Link>
                </div>
            </main>
        )
    }

    if (cart.length === 0) {
        return (
            <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
                <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-10 max-w-md w-full">
                    <span className="text-4xl mb-4 block">👟</span>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-black mb-2">Your Bag is Empty</h1>
                    <p className="text-neutral-500 text-sm mb-6">Explore our latest drops and fill your bag with fresh styles.</p>
                    <Link href="/products" className="bg-black text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition inline-block">
                        Explore Catalog
                    </Link>
                </div>
            </main>
        )
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.variant?.price || 0) * item.quantity, 0);
    const shipping = subtotal >= 2500000 ? 0 : 200000; // Free over 25,000 ₸
    const total = subtotal + shipping;

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black mb-8">
                Bag <span className="text-neutral-400 font-normal text-2xl">({cart.length} items)</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Cart Items List */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {cart.map(cartItem => {
                        const product = cartItem.variant?.product
                        const imageSrc = product?.images && product.images.length > 0 ? product.images[0] : null

                        return (
                            <div 
                                key={cartItem.id} 
                                className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-neutral-100 rounded-xl overflow-hidden shrink-0">
                                        {imageSrc ? (
                                            <Image
                                                src={imageSrc}
                                                alt={product?.name || 'Product'}
                                                fill
                                                className="object-cover"
                                                sizes="112px"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-neutral-400 text-[10px] uppercase font-bold">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <Link 
                                            href={`/products/${product?.slug}`}
                                            className="font-bold text-base text-black hover:text-neutral-600 transition"
                                        >
                                            {product?.name || 'Product'}
                                        </Link>
                                        <div className="flex items-center gap-3 text-xs text-neutral-500 font-semibold uppercase">
                                            <span>Size: <strong className="text-black">{cartItem.variant?.size}</strong></span>
                                            <span>•</span>
                                            <span>Color: <strong className="text-black">{cartItem.variant?.color}</strong></span>
                                        </div>
                                        <p className="font-black text-base text-black mt-2">
                                            {((cartItem.variant?.price || 0) / 100).toLocaleString()} ₸
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                                    <QuantitySelector
                                        variantId={cartItem.variant?.id}
                                        initialQuantity={cartItem.quantity}
                                    />
                                    <p className="font-black text-lg text-black sm:hidden">
                                        {(((cartItem.variant?.price || 0) * cartItem.quantity) / 100).toLocaleString()} ₸
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Summary Card Sidebar */}
                <div className="lg:col-span-4">
                    <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 sm:p-8 sticky top-28 flex flex-col gap-6">
                        <h2 className="text-xl font-black uppercase tracking-tight text-black border-b border-neutral-200 pb-4">
                            Summary
                        </h2>

                        <div className="flex flex-col gap-3 text-sm">
                            <div className="flex justify-between text-neutral-600">
                                <span>Subtotal</span>
                                <span className="font-bold text-black">{(subtotal / 100).toLocaleString()} ₸</span>
                            </div>
                            <div className="flex justify-between text-neutral-600">
                                <span>Estimated Shipping & Handling</span>
                                <span className="font-bold text-black">
                                    {shipping === 0 ? <strong className="text-emerald-600">FREE</strong> : `${(shipping / 100).toLocaleString()} ₸`}
                                </span>
                            </div>
                            <div className="border-t border-neutral-200 pt-3 flex justify-between items-baseline text-base font-black text-black">
                                <span>Total</span>
                                <span className="text-2xl">{(total / 100).toLocaleString()} ₸</span>
                            </div>
                        </div>

                        {/* Free Shipping Progress Indicator */}
                        {shipping > 0 && (
                            <div className="bg-neutral-100 p-3.5 rounded-2xl text-xs text-neutral-600">
                                Add <strong className="text-black font-bold">{(((2500000 - subtotal)) / 100).toLocaleString()} ₸</strong> more to qualify for Free Express Shipping!
                            </div>
                        )}

                        <Link href="/checkout" className="block w-full">
                            <button className="w-full bg-black text-white font-extrabold py-4 rounded-full text-xs uppercase tracking-wider hover:bg-neutral-800 transition active:scale-[0.99] shadow-lg">
                                Member Checkout
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}