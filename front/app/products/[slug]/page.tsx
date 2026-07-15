import { getProductBySlug } from '@/lib/api/products'
import Link from 'next/link'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug) 

  if (!product) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 text-lg">Product is not found</p>
        <Link href="/products" className="mt-4 text-white underline">Return to catalog</Link>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/products" className="text-gray-400 text-sm hover:text-white transition">← Catalog</Link>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-100 rounded-2xl h-96" />

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-500">{product.description}</p>

          <div>
            <p className="text-sm font-semibold mb-2">Variants:</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map(variant => (
                <div key={variant.id} className="border rounded-lg px-3 py-1 text-sm">
                  {variant.size} / {variant.color} — {(variant.price / 100).toLocaleString()} ₸
                </div>
              ))}
            </div>
          </div>

          <button className="mt-4 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition">
            Add to cart
          </button>
        </div>
      </div>
    </main>
  )
}