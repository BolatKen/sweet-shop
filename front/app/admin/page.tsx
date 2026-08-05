import { getStats } from '@/lib/actions/admin'
import Link from 'next/link'

export default async function AdminPage() {
  let stats = { products: 0, orders: 0, users: 0 }
  try {
    const res = await getStats()
    stats = res || stats
  } catch {
    stats = { products: 0, orders: 0, users: 0 }
  }

  const statCards = [
    {
      title: 'Всего товаров (Products)',
      value: stats.products,
      desc: '',
      icon: '',
      color: 'border-l-4 border-l-black',
    },
    {
      title: 'Всего заказов (Orders)',
      value: stats.orders,
      desc: '',
      icon: '',
      color: 'border-l-4 border-l-black',
    },
    {
      title: 'Пользователи (Users)',
      value: stats.users,
      desc: '',
      icon: '',
      color: 'border-l-4 border-l-black',
    },
  ]

  const quickActions = [
    { title: 'Добавить новый товар', desc: 'Загрузить название, фото, цены и размеры', href: '/admin/products', icon: '' },
    { title: 'Категории магазина', desc: 'Создать или изменить категории (Men, Women, Shoes)', href: '/admin/categories', icon: '' },
    { title: 'Статусы заказов', desc: 'Просмотр и смена статусов (PAID, SHIPPED, DELIVERED)', href: '/admin/orders', icon: '' },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
            Панель Управления SweetShop
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Мониторинг заказов, каталога товаров и прав доступа пользователей.
          </p>
        </div>
        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          Система работае в штатном режиме
        </span>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className={`bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs flex flex-col justify-between ${card.color}`}>
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">
                  {card.title}
                </span>
                <span className="text-2xl">{card.icon}</span>
              </div>
              <p className="text-4xl font-black text-black tracking-tight mb-2">
                {card.value}
              </p>
              <p className="text-xs text-neutral-500 mb-6">
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Tiles */}
      <div>
        <h2 className="text-lg font-black uppercase tracking-tight text-black mb-4">
          Быстрые действия
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action, idx) => (
            <Link
              key={idx}
              href={action.href}
              className="bg-white border border-neutral-200 rounded-2xl p-5 hover:border-black transition shadow-xs group flex items-start gap-4"
            >
              <span className="text-2xl bg-neutral-100 p-3 rounded-xl group-hover:scale-110 transition-transform">
                {action.icon}
              </span>
              <div>
                <h3 className="font-bold text-sm text-black group-hover:underline">
                  {action.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  {action.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}