import { getOrderById } from '@/lib/actions/order'
import OrderSuccess from '@/components/OrderSuccess'
import Link from 'next/link'

export default async function SuccessPage({
    searchParams
}: {
    searchParams: Promise<{ orderId?: string }>
}) {
    const { orderId } = await searchParams 
    
    if (!orderId) {
        return (
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold">Order is not found</h1>
                    <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
                        Back to catalog
                    </Link>
                </div>
            </main>
        )
    }
    
    let order = null;
    try {
        order = await getOrderById(orderId)
    } catch {
        order = null
    }

    if (!order) {
        return (
            <main className="max-w-4xl mx-auto px-4 py-16">
                <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-neutral-200">
                    <h1 className="text-2xl font-bold text-neutral-900">Order not found</h1>
                    <p className="text-neutral-500 mt-2">We couldn't retrieve the details for this order.</p>
                    <Link href="/products" className="mt-6 inline-block bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-neutral-800 transition">
                        Back to Catalog
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
            <OrderSuccess
                orderId={order.id}
                total={order.total}
                address={order.deliveryAddress}
                items={order.items.map(item => ({
                    name: item.variant?.product?.name ? `${item.variant.product.name} (${item.variant.size} / ${item.variant.color})` : 'Product item',
                    quantity: item.quantity
                }))}
            />
        </main>
    )
}