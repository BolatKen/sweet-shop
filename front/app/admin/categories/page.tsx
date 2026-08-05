'use client'

import { useState, useEffect } from 'react'
import { getCategories, createCategory, deleteCategory } from '@/lib/actions/admin'
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
      setError('Не удалось обновить категории')
    }
  }

  useEffect(() => {
    let isMounted = true
    async function fetchCategories() {
      try {
        const data = await getCategories()
        if (isMounted) setCategories(data || [])
      } catch {
        if (isMounted) setError('Не удалось загрузить категории')
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
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        parentId: formData.parentId || undefined
      })
      setFormData({ name: '', slug: '', parentId: '' })
      await reloadCategories()
    } catch {
      setError('Не удалось создать категорию')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить эту категорию?')) return
    try {
      await deleteCategory(id)
      await reloadCategories()
    } catch {
      setError('Не удалось удалить категорию')
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-neutral-500 font-bold uppercase tracking-wider text-xs">
        Загрузка категорий...
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs">
        <h1 className="text-2xl font-black uppercase tracking-tight text-black">
          Управление Категориями ({categories.length})
        </h1>
        <p className="text-neutral-500 text-xs mt-0.5">
          Создание и структурирование категорий каталога товаров
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs font-bold">
          {error}
        </div>
      )}

      {/* Create Category Form */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-black uppercase tracking-tight text-black mb-4 border-b border-neutral-100 pb-3">
          Создать новую категорию
        </h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-black block mb-1.5">
              Название Категории
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="например: Обувь & Снинеры"
              required
              className="w-full bg-neutral-50 border border-neutral-300 rounded-2xl px-4 py-3 text-xs text-black outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-black block mb-1.5">
              Slug (URL идентификатор)
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="например: shoes"
              required
              className="w-full bg-neutral-50 border border-neutral-300 rounded-2xl px-4 py-3 text-xs text-black outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-black block mb-1.5">
              Родительская категория
            </label>
            <select
              value={formData.parentId}
              onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-2xl px-4 py-3 text-xs text-black outline-none focus:ring-1 focus:ring-black cursor-pointer"
            >
              <option value="">Без родителя (Основная)</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 pt-2">
            <button
              type="submit"
              className="bg-black text-white font-extrabold px-8 py-3.5 rounded-full text-xs uppercase tracking-wider hover:bg-neutral-800 transition shadow-sm"
            >
              Создать категорию
            </button>
          </div>
        </form>
      </div>

      {/* Categories List Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
        {categories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  <th className="px-6 py-4">Название</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">Родительская категория</th>
                  <th className="px-6 py-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {categories.map(category => (
                  <tr key={category.id} className="hover:bg-neutral-50/80 transition">
                    <td className="px-6 py-4 font-bold text-black flex items-center gap-2">
                      <span>{category.name}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-neutral-500">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 text-neutral-600 font-medium">
                      {category.parentId ? (
                        <span className="bg-neutral-100 px-2.5 py-1 rounded-full text-[10px] font-bold">
                          {categories.find(c => c.id === category.parentId)?.name || category.parentId}
                        </span>
                      ) : (
                        <span className="text-neutral-400 font-normal">Основная</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-700 px-3.5 py-1.5 rounded-full text-xs font-bold transition"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-neutral-500 text-xs font-semibold">
            Категории отсутствуют.
          </div>
        )}
      </div>
    </div>
  )
}