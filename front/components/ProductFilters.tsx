'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Category } from '@/lib/types'

export default function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category') || ''
  const currentSort = `${searchParams.get('sortBy') || 'createdAt'}-${searchParams.get('order') || 'desc'}`

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

  const clearAllFilters = () => {
    router.push('/products')
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-100">
      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => updateParam('category', '')}
          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
            activeCategory === ''
              ? 'bg-black text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          All Items
        </button>

        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => updateParam('category', cat.slug || cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
              activeCategory === cat.slug || activeCategory === cat.id
                ? 'bg-black text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            {cat.name}
          </button>
        ))}

        {activeCategory && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-neutral-500 hover:text-black underline font-semibold ml-2"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Sort Selector */}
      <div className="flex items-center gap-2 self-end md:self-auto">
        <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Sort By:</span>
        <select
          value={currentSort}
          onChange={(e) => {
            const [sortBy, order] = e.target.value.split('-')
            const params = new URLSearchParams(searchParams.toString())
            params.set('sortBy', sortBy)
            params.set('order', order)
            params.delete('page')
            router.push(`/products?${params.toString()}`)
          }}
          className="bg-neutral-100 border border-neutral-200 rounded-full px-4 py-2 text-xs font-bold text-neutral-800 outline-none focus:ring-1 focus:ring-black cursor-pointer"
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  )
}