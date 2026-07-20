import { getMe } from '@/lib/actions/profile'

import Link from 'next/link'

export default async function ProfilePage() {
    const me = await getMe();


     if (!me || !me.email) {
        return (
        <main className="min-h-screen flex flex-col items-center justify-center">
            <p className="text-gray-500">Войдите чтобы просмотреть профиль</p>
            <Link href="/auth/login" className="mt-4 bg-black text-white px-6 py-3 rounded-xl">
            Войти
            </Link>
        </main>
        )
    }
    

    return (
    <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Профиль */}
        <div className="border rounded-xl p-6 mb-8">
        <h1 className="text-2xl font-bold mb-2">Профиль</h1>
        <p className="text-gray-500">{me.email}</p>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full mt-1 inline-block">
            {me.role}
        </span>
        </div>

        {/* Заказы */}
        <h2 className="text-xl font-bold mb-4">История заказов</h2>
        {me.orders.length === 0 ? (
        <p className="text-gray-500">У вас пока нет заказов</p>
        ) : (
        <div className="flex flex-col gap-4">
            {me.orders.map(order => (
            <div key={order.id} className="border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString('ru-RU')}</p>
                <p className="text-gray-500 text-sm">{order.deliveryAddress}</p>
                </div>
                <div className="flex items-center gap-4">

                    <div className="mt-2 flex flex-col gap-1">
                    {order.items.map(item => (
                        <div key={item.id} className="text-sm text-gray-600 flex justify-between">
                        <span>{item.variant.product.name} — {item.variant.size} / {item.variant.color}</span>
                        <span>{item.quantity} шт. × {(item.variant.price / 100).toLocaleString()} ₸</span>
                        </div>
                    ))}
                    </div>
                <p className="font-bold">{(order.total / 100).toLocaleString()} ₸</p>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                    {order.status}
                </span>
                </div>
            </div>
            ))}
        </div>
        )}
    </main>
    )
}