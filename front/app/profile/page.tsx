import { getMe } from '@/lib/actions/profile'
import { logoutUser } from '@/lib/actions/auth'
import Link from 'next/link'

export default async function ProfilePage() {
    let me = null;
    try {
        me = await getMe();
    } catch {
        me = null;
    }

    if (!me || !me.email) {
        return (
            <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
                <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-10 max-w-md w-full">
                    <span className="text-4xl mb-4 block">👤</span>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-black mb-2">Member Portal</h1>
                    <p className="text-neutral-500 text-sm mb-6">Log in to view your profile details, pass, and past orders.</p>
                    <Link href="/auth/login" className="bg-black text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition inline-block">
                        Sign In
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
            {/* Member Card Header */}
            <div className="bg-neutral-900 text-white rounded-3xl p-8 sm:p-10 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden shadow-xl">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full">
                            SWEETSHOP MEMBER
                        </span>
                        <span className="bg-white text-black text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                            {me.role}
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
                        {me.email}
                    </h1>
                    <p className="text-neutral-400 text-xs mt-1">
                        Member since {me.createdAt ? new Date(me.createdAt).getFullYear() : 2026}
                    </p>
                </div>

                <div className="relative z-10 flex flex-wrap items-center gap-3">
                    {me.role === 'ADMIN' && (
                        <Link href="/admin" className="bg-white text-black font-extrabold px-6 py-3 rounded-full text-xs uppercase tracking-wider hover:bg-neutral-200 transition shrink-0">
                            Admin Portal →
                        </Link>
                    )}
                    <form action={logoutUser}>
                        <button type="submit" className="border border-white/30 text-white hover:bg-white/10 font-extrabold px-6 py-3 rounded-full text-xs uppercase tracking-wider transition">
                            Log Out
                        </button>
                    </form>
                </div>
            </div>

            {/* Order History Section */}
            <div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-black mb-6">
                    Order History ({me.orders ? me.orders.length : 0})
                </h2>

                {!me.orders || me.orders.length === 0 ? (
                    <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-10 text-center">
                        <span className="text-3xl block mb-2">📦</span>
                        <h3 className="font-black text-lg uppercase text-black mb-1">No Orders Placed Yet</h3>
                        <p className="text-neutral-500 text-xs max-w-sm mx-auto mb-6">
                            Once you make a purchase, your order history and tracking details will appear right here.
                        </p>
                        <Link href="/products" className="bg-black text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
                            Shop Now
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {me.orders.map(order => {
                            const statusColor = 
                                order.status === 'PAID' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                                order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                order.status === 'DELIEVERED' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                                order.status === 'CANCELLED' ? 'bg-red-100 text-red-800 border-red-200' :
                                'bg-amber-100 text-amber-800 border-amber-200';

                            return (
                                <div key={order.id} className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-2">
                                        <div>
                                            <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider block">
                                                Order #{order.id.slice(-8)}
                                            </span>
                                            <span className="text-sm font-bold text-black">
                                                Placed on {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full border ${statusColor}`}>
                                                {order.status}
                                            </span>
                                            <span className="font-black text-lg text-black">
                                                {(order.total / 100).toLocaleString()} ₸
                                            </span>
                                        </div>
                                    </div>

                                    {/* Item List */}
                                    <div className="flex flex-col gap-2">
                                        {order.items.map(item => (
                                            <div key={item.id} className="flex justify-between items-center text-xs py-1">
                                                <div className="font-semibold text-neutral-800">
                                                    <span>{item.variant?.product?.name || 'Product'}</span>
                                                    <span className="text-neutral-400 font-normal ml-2">
                                                        ({item.variant?.size} / {item.variant?.color})
                                                    </span>
                                                </div>
                                                <div className="text-neutral-500 font-medium">
                                                    {item.quantity} × {((item.variant?.price || 0) / 100).toLocaleString()} ₸
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-3 border-t border-neutral-100 text-xs text-neutral-500 flex justify-between items-center">
                                        <span>Delivery Address: <strong className="text-black">{order.deliveryAddress}</strong></span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </main>
    )
}