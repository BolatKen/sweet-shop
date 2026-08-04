'use client'

import { useState, useEffect } from 'react'
import { getCategories, createCategory, deleteCategory } from '@/lib/actions/admin'
import Button from '@/components/Button'
import { Category } from '@/lib/types'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', slug: '', parentId: '' })

  const reloadCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data || [])
    } catch {
      setError('Failed to load categories')
    }
  }

  useEffect(() => {
    let isMounted = true
    async function fetchCategories() {
      try {
        const data = await getCategories()
        if (isMounted) setCategories(data || [])
      } catch {
        if (isMounted) setError('Failed to load categories')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchCategories()
    return () => { isMounted = false }
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createCategory({
        name: formData.name,
        slug: formData.slug,
        parentId: formData.parentId || undefined
      })
      setFormData({ name: '', slug: '', parentId: '' })
      await reloadCategories()
    } catch {
      setError('Failed to create category')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return
    try {
      await deleteCategory(id)
      await reloadCategories()
    } catch {
      setError('Failed to delete category')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}

      {/* Create form */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold mb-4">Create Category</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Parent Category</label>
            <select
              value={formData.parentId}
              onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">None</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Name</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Slug</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Parent</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{category.name}</td>
                <td className="px-6 py-4">{category.slug}</td>
                <td className="px-6 py-4">{category.parentId || '-'}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}