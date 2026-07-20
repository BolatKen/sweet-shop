'use client'

import { useState, useEffect } from 'react'
import { getUsers, updateUserRole } from '@/lib/actions/admin'

const ROLE_OPTIONS = ['CUSTOMER', 'MANAGER', 'ADMIN']

export default function AdminuserPage() {
  const [Users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await getUsers()
      setUsers(data)
    } catch {
      setError('Failed to load Users')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (id: string, Role: string) => {
    try {
      await updateUserRole(id, Role)
      await loadUsers()
    } catch {
      setError('Failed to update Role')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 buser-b">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Customer</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Date</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Role</th>
            </tr>
          </thead>
          <tbody>
            {Users.map((user) => (
              <tr key={user.id} className="buser-b hover:bg-gray-50">
                <td className="px-6 py-4">{user.email || '-'}</td>
                <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">  
                  
                  {user.role === 'ADMIN' ? (
                        <span className="text-sm  px-2 py-1 rounded-full">ADMIN</span>
                    ) : (
                    <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="buser rounded-lg px-3 py-1 text-sm"
                    >
                        {ROLE_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}