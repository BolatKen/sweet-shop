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
    
    try {
        const order = await getOrderById(orderId)
        
        return (
            <main className="max-w-4xl mx-auto px-4 py-8">
                <OrderSuccess
                    orderId={order.id}
                    total={order.total}
                    address={order.deliveryAddress}
                    items={order.items.map(item => ({
                        name: item.id,
                        quantity: item.quantity
                    }))}
                />
            </main>
        )
    } catch {
        return (
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-red-600">Error</h1>
                    <p className="text-gray-500 mt-2">Couldn't load your order</p>
                    <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
                        Back to catalog
                    </Link>
                </div>
            </main>
        )
    }
}