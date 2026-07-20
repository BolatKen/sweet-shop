import { getStats } from '@/lib/actions/admin'

export default async function AdminPage() {
  const stats = await getStats()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <p className="text-gray-500 text-sm">Products</p>
        <p className="text-3xl font-bold mt-1">{stats.products}</p>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <p className="text-gray-500 text-sm">Orders</p>
        <p className="text-3xl font-bold mt-1">{stats.orders}</p>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <p className="text-gray-500 text-sm">Users</p>
        <p className="text-3xl font-bold mt-1">{stats.users}</p>
      </div>
    </div>
  )
}