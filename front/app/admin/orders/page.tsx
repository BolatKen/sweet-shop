'use client'

import { useState, useEffect } from 'react'
import { getOrders, updateOrderStatus } from '@/lib/actions/admin'
import { Order } from '@/lib/types'

const STATUS_OPTIONS = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export default function AdminOrderPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('ALL')

  const reloadOrders = async () => {
    try {
      const data = await getOrders()
      setOrders(data || [])
    } catch {
      setError('Не удалось обновить заказы')
    }
  }

  useEffect(() => {
    let isMounted = true
    async function fetchOrders() {
      try {
        const data = await getOrders()
        if (isMounted) setOrders(data || [])
      } catch {
        if (isMounted) setError('Не удалось загрузить заказы')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchOrders()
    return () => { isMounted = false }
  }, [])

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateOrderStatus(id, status)
      await reloadOrders()
    } catch {
      setError('Не удалось обновить статус')
    }
  }

  const filteredOrders = filterStatus === 'ALL'
    ? orders
    : orders.filter(o => o.status === filterStatus)

  if (loading) {
    return (
      <div className="py-20 text-center text-neutral-500 font-bold uppercase tracking-wider text-xs">
        Загрузка списка заказов...
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-black">
            Управление Заказами ({orders.length})
          </h1>
          <p className="text-neutral-500 text-xs mt-0.5">
            Просмотр поступающих заказов и изменение статусов доставки
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition ${
              filterStatus === 'ALL' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Все ({orders.length})
          </button>
          {STATUS_OPTIONS.map(s => {
            const count = orders.filter(o => o.status === s).length
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                  filterStatus === s ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {s} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs font-bold">
          {error}
        </div>
      )}

      {/* Orders Table Card */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  <th className="px-6 py-4">ID Заказа</th>
                  <th className="px-6 py-4">Покупатель (Email)</th>
                  <th className="px-6 py-4">Адрес Доставки</th>
                  <th className="px-6 py-4">Сумма (₸)</th>
                  <th className="px-6 py-4">Дата</th>
                  <th className="px-6 py-4 text-right">Изменить Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {filteredOrders.map((order) => {
                  const statusBg = 
                    order.status === 'PAID' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    'bg-amber-100 text-amber-800'

                  return (
                    <tr key={order.id} className="hover:bg-neutral-50/80 transition">
                      <td className="px-6 py-4 font-mono font-bold text-neutral-500">
                        #{order.id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 font-bold text-black">
                        {order.user?.email || 'Гость'}
                      </td>
                      <td className="px-6 py-4 text-neutral-600 max-w-xs truncate">
                        {order.deliveryAddress}
                      </td>
                      <td className="px-6 py-4 font-black text-black text-sm">
                        {(order.total / 100).toLocaleString()} ₸
                      </td>
                      <td className="px-6 py-4 text-neutral-500 font-medium">
                        {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`border border-neutral-300 rounded-full px-3 py-1.5 text-xs font-extrabold uppercase outline-none cursor-pointer ${statusBg}`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s} className="bg-white text-black font-medium">
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-neutral-500 text-xs font-semibold">
            Заказы с выпранным статусом отсутствуют.
          </div>
        )}
      </div>
    </div>
  )
}