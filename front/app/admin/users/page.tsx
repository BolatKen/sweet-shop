'use client'

import { useState, useEffect } from 'react'
import { getUsers, updateUserRole } from '@/lib/actions/admin'
import { User } from '@/lib/types'

const ROLE_OPTIONS = ['CUSTOMER', 'MANAGER', 'ADMIN']

export default function AdminuserPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const reloadUsers = async () => {
    try {
      const data = await getUsers()
      setUsers(data || [])
    } catch {
      setError('Не удалось загрузить пользователей')
    }
  }

  useEffect(() => {
    let isMounted = true
    async function fetchUsers() {
      try {
        const data = await getUsers()
        if (isMounted) setUsers(data || [])
      } catch {
        if (isMounted) setError('Не удалось загрузить пользователей')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchUsers()
    return () => { isMounted = false }
  }, [])

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await updateUserRole(id, role)
      await reloadUsers()
    } catch {
      setError('Не удалось обновить роль пользователя')
    }
  }

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="py-20 text-center text-neutral-500 font-bold uppercase tracking-wider text-xs">
        Загрузка списка пользователей...
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-black">
            Управление Пользователями ({users.length})
          </h1>
          <p className="text-neutral-500 text-xs mt-0.5">
            Просмотр пользователей и назначение ролей (CUSTOMER, MANAGER, ADMIN)
          </p>
        </div>

        <input
          type="text"
          placeholder="Поиск по email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-neutral-100 border border-neutral-200 rounded-full px-4 py-2 text-xs text-black outline-none focus:ring-1 focus:ring-black w-full sm:w-64"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs font-bold">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  <th className="px-6 py-4">Email Клиента</th>
                  <th className="px-6 py-4">Дата Регистрации</th>
                  <th className="px-6 py-4">Текущий Статус / Роль</th>
                  <th className="px-6 py-4 text-right">Назначить Роль</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {filteredUsers.map((user) => {
                  const roleBadge = 
                    user.role === 'ADMIN' ? 'bg-black text-white' :
                    user.role === 'MANAGER' ? 'bg-purple-100 text-purple-800' :
                    'bg-neutral-100 text-neutral-800'

                  return (
                    <tr key={user.id} className="hover:bg-neutral-50/80 transition">
                      <td className="px-6 py-4 font-bold text-black">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-neutral-500 font-medium">
                        {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${roleBadge}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="border border-neutral-300 rounded-full px-3 py-1.5 text-xs font-bold bg-white text-black outline-none cursor-pointer"
                        >
                          {ROLE_OPTIONS.map((r) => (
                            <option key={r} value={r}>
                              {r}
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
            Пользователи не найдены.
          </div>
        )}
      </div>
    </div>
  )
}