import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4">SweetShop</h1>
      <p className="text-gray-500 text-lg mb-8">Waredrobe 4u</p>
      <Link
        href="/products"
        className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
      >
        Catalog
      </Link>
    </main>
  )
}