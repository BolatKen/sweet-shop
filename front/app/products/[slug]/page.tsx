import { getProductBySlug } from '@/lib/api/products'
import Link from 'next/link'
import ProductImages from '@/components/ProductImage'
import VariantSelector from '@/components/VariantSelector'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let product = null

  try {
    product = await getProductBySlug(slug)
  } catch {
    product = null
  }

  if (!product) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-10 max-w-md w-full">
          <h1 className="text-2xl font-black uppercase tracking-tight text-black mb-2">Product Not Found</h1>
          <p className="text-neutral-500 text-sm mb-6">
            The item you are looking for might be out of stock or moved to a new collection.
          </p>
          <Link href="/products" className="bg-black text-white px-6 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider hover:bg-neutral-800 transition inline-block">
            Return to Catalog
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-500 mb-8 uppercase tracking-wider">
        <Link href="/" className="hover:text-black transition">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-black transition">Catalog</Link>
        <span>/</span>
        <span className="text-black font-bold truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7">
          {product.images && product.images.length > 0 ? (
            <ProductImages images={product.images} name={product.name} />
          ) : (
            <div className="bg-neutral-100 rounded-2xl aspect-square flex items-center justify-center text-neutral-400 text-sm font-semibold uppercase">
              No Image Available
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Purchase Form */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-neutral-500 block mb-1">
              {product.category?.name || 'SweetShop Official'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
              {product.name}
            </h1>
          </div>

          <p className="text-neutral-600 text-sm leading-relaxed">
            {product.description || "Crafted for maximum performance and everyday durability. Features high-grade materials and iconic silhouette."}
          </p>

          {/* Variant Picker & Add To Bag */}
          {product.variants && product.variants.length > 0 ? (
            <VariantSelector variants={product.variants} />
          ) : (
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-xs font-bold text-neutral-500 text-center">
              Currently Unavailable
            </div>
          )}

          {/* Value Highlights */}
          <div className="border-t border-neutral-100 pt-6 mt-4 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-black">Free Standard Delivery</h4>
                <p className="text-xs text-neutral-500">Orders placed before 14:00 ship out same day.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-black">30-Day Free Return Policy</h4>
                <p className="text-xs text-neutral-500">Unused items can be returned within 30 days of purchase.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}