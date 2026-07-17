'use client'

import Link from 'next/link'

interface OrderSuccessProps {
    orderId: string
    total: number
    address: string
    items: Array<{ name: string; quantity: number }>
}

export default function OrderSuccess({ 
    orderId, 
    total, 
    address,
    items 
}: OrderSuccessProps) {
    return (
        <div className="text-center py-12">
            <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    V
                </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">Спасибо за заказ!</h1>
            <p className="text-gray-500 mb-4">Номер заказа: #{orderId}</p>
            
            <div className="max-w-md mx-auto bg-gray-50 rounded-xl p-6 mb-6 text-left">
                <p className="font-semibold mb-2">Детали заказа:</p>
                <div className="space-y-1 text-sm text-gray-600">
                    {items.map((item, i) => (
                        <p key={i}>{item.name} × {item.quantity}</p>
                    ))}
                    <p className="border-t pt-2 mt-2 font-semibold text-black">
                        Итого: {total.toLocaleString()} ₸
                    </p>
                    <p className="text-sm">Адрес: {address}</p>
                </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link 
                    href="/"
                    className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
                >
                    Вернуться в каталог
                </Link>
                <Link 
                    href="/orders"
                    className="border border-black px-6 py-3 rounded-xl hover:bg-gray-50 transition"
                >
                    Мои заказы
                </Link>
            </div>
        </div>
    )
}