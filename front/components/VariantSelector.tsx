'use client'

import { useState } from 'react'
import { ProductVariant } from '@/lib/types'
import AddToCartButton from './AddToCartButton'

export default function VariantSelector({ variants }: { variants: ProductVariant[] }) {
  const [selected, setSelected] = useState<ProductVariant>(variants[0])

  return (
    <div>
      <p className="text-sm font-semibold mb-2">Size / Color:</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {variants.map(variant => (
          <button
            key={variant.id}
            onClick={() => setSelected(variant)}
            className={`border rounded-lg px-3 py-1 text-sm transition ${
              selected.id === variant.id
                ? 'bg-black text-white border-black'
                : 'hover:border-black'
            }`}
          >
            {variant.size} / {variant.color}
          </button>
        ))}
      </div>

      <p className="font-bold text-xl mb-4">
        {(selected.price / 100).toLocaleString()} ₸
      </p>

      <p className="text-sm text-gray-500 mb-4">
        {selected.stock > 0 ? `In stock: ${selected.stock}` : 'Out of stock'}
      </p>

      <AddToCartButton variantId={selected.id} />
    </div>
  )
}