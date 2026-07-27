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
  const { products, total, totalPages, page } = await getProducts({
    search: params.search,
    category: params.category,
    sortBy: params.sortBy,
    order: params.order,
    page: Number(params.page) || 1,
    limit: 12
  })

  const categories = await getCategories()

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Catalog</h1>
        <p className="text-gray-500 text-sm">{total} products</p>
      </div>

      {/* Search */}
      <form className="mb-6 flex gap-2">
        <input
          name="search"
          defaultValue={params.search}
          placeholder="Search..."
          className="border rounded-xl px-4 py-2 flex-1 max-w-md"
        />
        <button type="submit" className="bg-black text-white px-4 py-2 rounded-xl">Search</button>
      </form>
      <ProductFilters categories={categories} />

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <Link href={`/products/${product.slug}`} key={product.id}>
            <div className="border rounded-xl p-4 hover:shadow-md transition cursor-pointer">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="h-48 w-full object-cover rounded-lg mb-3"
                />
              ) : (
                <div className="bg-gray-100 h-48 rounded-lg mb-3" />
              )}
              <h2 className="font-semibold text-lg">{product.name}</h2>
              <p className="text-gray-500 text-sm line-clamp-2">{product.description}</p>
              {product.variants.length > 0 && (
                <p className="font-bold mt-2">
                  {(Math.min(...product.variants.map(v => v.price)) / 100).toLocaleString()} ₸
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 mt-8 justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <Link
              key={p}
              href={`/products?page=${p}${params.search ? `&search=${params.search}` : ''}`}
              className={`px-3 py-1 rounded-lg border ${p === page ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}