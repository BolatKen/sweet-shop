import { getProducts } from '@/lib/api/products'
import { getCategories } from '@/lib/api/categories'
import Image from 'next/image'
import Link from 'next/link'
import ProductFilters from '@/components/ProductFilters'

export default async function ProductPage({
  searchParams
}: {
  searchParams: Promise<{ search?: string; category?: string; sortBy?: string; order?: string; page?: string }>
}) {
  const params = await searchParams
  let productsData = { products: [], total: 0, totalPages: 1, page: 1 }
  let categories = []

  try {
    productsData = await getProducts({
      search: params.search,
      category: params.category,
      sortBy: params.sortBy,
      order: params.order,
      page: Number(params.page) || 1,
      limit: 12
    })
  } catch {
    // Graceful fallback
  }

  try {
    categories = await getCategories()
  } catch {
    categories = []
  }

  const { products, total, totalPages, page } = productsData

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 min-h-screen">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
            {params.category ? `${params.category.toUpperCase()} Collection` : 'All Products'}
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Showing {products.length} of {total} items
          </p>
        </div>

        {/* Search Input Bar */}
        <form action="/products" method="GET" className="flex items-center gap-2 max-w-md w-full">
          {params.category && <input type="hidden" name="category" value={params.category} />}
          <div className="relative flex-1">
            <input
              type="text"
              name="search"
              defaultValue={params.search || ''}
              placeholder="Search by name, style, or tag..."
              className="w-full bg-neutral-100 border border-neutral-200 rounded-full px-5 py-2.5 text-xs text-black placeholder-neutral-500 outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <button 
            type="submit" 
            className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filter Component */}
      <ProductFilters categories={categories} />

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => {
            const minPrice = product.variants && product.variants.length > 0 
              ? Math.min(...product.variants.map(v => v.price))
              : 0;

            return (
              <Link href={`/products/${product.slug}`} key={product.id} className="group">
                <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 nike-card-hover flex flex-col h-full">
                  <div className="relative aspect-square w-full bg-neutral-100 rounded-xl overflow-hidden mb-4">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs font-semibold uppercase">
                        SweetShop Item
                      </div>
                    )}
                    {product.variants && product.variants.length > 0 && (
                      <div className="absolute bottom-2 left-2 flex gap-1 flex-wrap">
                        {product.variants.slice(0, 3).map(v => (
                          <span key={v.id} className="bg-white/90 backdrop-blur-xs text-[10px] font-extrabold px-1.5 py-0.5 rounded text-neutral-800">
                            {v.size}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="font-bold text-base text-black group-hover:text-neutral-600 transition">
                        {product.name}
                      </h2>
                      <p className="text-xs text-neutral-500 line-clamp-2 mt-1">
                        {product.description || "Premium athletic apparel"}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                      <p className="font-black text-lg text-black">
                        {(minPrice / 100).toLocaleString()} ₸
                      </p>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-black group-hover:translate-x-1 transition-transform">
                        View →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-neutral-200">
          <svg className="w-12 h-12 mx-auto text-neutral-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h2 className="text-xl font-black uppercase tracking-tight text-black mb-1">No products found</h2>
          <p className="text-neutral-500 text-sm max-w-md mx-auto mb-6">
            We couldn&apos;t find any products matching your current filters or search terms.
          </p>
          <Link href="/products" className="bg-black text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider">
            Clear All Filters
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 mt-12 justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <Link
              key={p}
              href={`/products?page=${p}${params.search ? `&search=${params.search}` : ''}${params.category ? `&category=${params.category}` : ''}`}
              className={`px-4 py-2 rounded-full font-bold text-xs ${
                p === page
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}