import Link from 'next/link'
import { getProducts } from '@/lib/api/products'

export default async function ProductCart() {
    const products = await getProducts();

    return(
        <main className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Каталог</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => (
                <Link href={`/products/${product.slug}`} key={product.id}>
                    <div className="border rounded-xl p-4 hover:shadow-md transition cursor-pointer">
                    <div className="bg-gray-100 h-48 rounded-lg mb-3" />
                    <h2 className="font-semibold text-lg">{product.name}</h2>
                    <p className="text-gray-500 text-sm line-clamp-2">{product.description}</p>
                    </div>
                </Link>
                ))}
            </div>
        </main>
    )
}