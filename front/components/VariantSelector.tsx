'use client'

import { useState } from 'react'
import { ProductVariant } from '@/lib/types'
import AddToCartButton from './AddToCartButton'

export default function VariantSelector({ variants }: { variants: ProductVariant[] }) {
  const [selected, setSelected] = useState<ProductVariant>(variants[0])
  const [showSizeGuide, setShowSizeGuide] = useState(false)

  if (!variants || variants.length === 0) {
    return (
      <div className="py-4 text-sm text-neutral-500">
        No variants currently available for this product.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Price & Stock Display */}
      <div className="flex items-baseline justify-between border-b border-neutral-100 pb-4">
        <div>
          <span className="text-3xl font-black text-black">
            {(selected.price / 100).toLocaleString()} ₸
          </span>
          <span className="text-xs text-neutral-500 block mt-0.5">VAT included</span>
        </div>
        <div>
          {selected.stock > 0 ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              In Stock ({selected.stock} available)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Size / Variant Picker */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-wider text-black">
            Select Size & Color:
          </label>
          <button 
            type="button" 
            onClick={() => setShowSizeGuide(true)}
            className="text-xs font-bold underline text-neutral-500 hover:text-black transition"
          >
            Size Guide
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {variants.map(variant => {
            const isSelected = selected.id === variant.id
            const isOutOfStock = variant.stock <= 0

            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelected(variant)}
                disabled={isOutOfStock}
                className={`py-3 px-2 rounded-xl text-xs font-bold uppercase transition flex flex-col items-center justify-center gap-0.5 border ${
                  isSelected
                    ? 'border-black bg-black text-white shadow-md'
                    : isOutOfStock
                    ? 'border-neutral-200 bg-neutral-100 text-neutral-400 line-through opacity-60'
                    : 'border-neutral-200 bg-white text-neutral-900 hover:border-black'
                }`}
              >
                <span>{variant.size}</span>
                <span className={`text-[10px] font-medium ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  {variant.color}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Add To Cart & Wishlist */}
      <div className="flex flex-col gap-3 pt-2">
        <AddToCartButton variantId={selected.id} />
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full animate-fade-in shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
              <h3 className="font-black text-lg uppercase tracking-tight">Size Guide (Clothing & Shoes)</h3>
              <button 
                onClick={() => setShowSizeGuide(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-black"
              >
                ✕
              </button>
            </div>
            <table className="w-full text-xs text-left border-collapse mb-6">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="p-2">Size</th>
                  <th className="p-2">Chest (cm)</th>
                  <th className="p-2">Waist (cm)</th>
                  <th className="p-2">EU Shoe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                <tr><td className="p-2 font-bold">S</td><td className="p-2">88 - 96</td><td className="p-2">73 - 81</td><td className="p-2">40 - 41</td></tr>
                <tr><td className="p-2 font-bold">M</td><td className="p-2">96 - 104</td><td className="p-2">81 - 89</td><td className="p-2">42 - 43</td></tr>
                <tr><td className="p-2 font-bold">L</td><td className="p-2">104 - 112</td><td className="p-2">89 - 97</td><td className="p-2">44 - 45</td></tr>
                <tr><td className="p-2 font-bold">XL</td><td className="p-2">112 - 124</td><td className="p-2">97 - 109</td><td className="p-2">46 - 47</td></tr>
              </tbody>
            </table>
            <button
              onClick={() => setShowSizeGuide(false)}
              className="w-full bg-black text-white font-bold py-3 rounded-full text-xs uppercase tracking-wider"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  )
}