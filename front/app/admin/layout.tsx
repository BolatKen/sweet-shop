import { getMe } from '@/lib/actions/profile'
import { redirect } from 'next/navigation'
import Link from 'next/link';

export default async function AdminLayout({
    children,
} : {
    children: React.ReactNode
}) {
    const user = await getMe();
    if (!user || user.role != "ADMIN") {
        redirect('/');
    }

        return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
                    <h1 className="text-xl font-bold">Admin Page</h1>
                    <div className="flex gap-4">
                        <Link href="/admin" className="hover:text-gray-600">Dashboard</Link>
                        <Link href="/admin/products" className="hover:text-gray-600">Products</Link>
                        <Link href="/admin/orders" className="hover:text-gray-600">Orders</Link>
                        <Link href="/admin/users" className="hover:text-gray-600">Users</Link>
                    </div>
                </div>
            </nav>
            
            <main className="max-w-7xl mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    )
}