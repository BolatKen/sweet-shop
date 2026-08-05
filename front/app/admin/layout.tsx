import { getMe } from '@/lib/actions/profile'
import { redirect } from 'next/navigation'
import Link from 'next/link';

export default async function AdminLayout({
    children,
} : {
    children: React.ReactNode
}) {
    let user = null;
    try {
        user = await getMe();
    } catch {
        user = null;
    }

    if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
        redirect('/');
    }

    const navLinks = [
        { name: "Обзор (Dashboard)", href: "/admin", icon: "" },
        { name: "Товары (Products)", href: "/admin/products", icon: "" },
        { name: "Категории (Categories)", href: "/admin/categories", icon: "" },
        { name: "Заказы (Orders)", href: "/admin/orders", icon: "" },
        { name: "Пользователи (Users)", href: "/admin/users", icon: "" },
    ];

    return (
        <div className="min-h-screen bg-neutral-100 flex flex-col">
            {/* Top Admin Navigation Header */}
            <header className="bg-black text-white border-b border-neutral-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="bg-white text-black text-xs font-black uppercase px-2.5 py-1 rounded-md">
                            ADMIN PORTAL
                        </span>
                        <span className="text-neutral-400 text-xs font-medium">
                            {user.email} ({user.role})
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link 
                            href="/" 
                            className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold px-4 py-2 rounded-full transition flex items-center gap-1.5"
                        >
                            <span>←</span>
                            <span>Вернуться в магазин</span>
                        </Link>
                    </div>
                </div>

                {/* Sub-Navigation Bar */}
                <div className="bg-neutral-900 border-t border-neutral-800 overflow-x-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1">
                        {navLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white hover:bg-neutral-800 transition flex items-center gap-2 whitespace-nowrap border-b-2 border-transparent hover:border-white"
                            >
                                <span>{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </header>
            
            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full animate-fade-in">
                {children}
            </main>
        </div>
    )
}