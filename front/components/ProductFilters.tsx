'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Category } from '@/lib/types'

export default function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {/* Category filter */}
      <select
        defaultValue={searchParams.get('category') || ''}
        onChange={(e) => updateParam('category', e.target.value)}
        className="border rounded-xl px-4 py-2 text-sm"
      >
        <option value="">All categories</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      {/* Sort */}
      <select
        defaultValue={`${searchParams.get('sortBy') || 'createdAt'}-${searchParams.get('order') || 'desc'}`}
        onChange={(e) => {
          const [sortBy, order] = e.target.value.split('-')
          const params = new URLSearchParams(searchParams.toString())
          params.set('sortBy', sortBy)
          params.set('order', order)
          params.delete('page')
          router.push(`/products?${params.toString()}`)
        }}
        className="border rounded-xl px-4 py-2 text-sm"
      >
        <option value="createdAt-desc">Newest</option>
        <option value="createdAt-asc">Oldest</option>
      </select>
    </div>
  )
}