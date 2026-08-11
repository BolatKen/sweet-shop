import Link from 'next/link'
import Image from 'next/image'
import { getProducts } from '@/lib/api/products'

export const revalidate = 60

export default async function Home() {
  let products: any[] = [];
  try {
    const res = await getProducts({ limit: 4, sortBy: 'createdAt', order: 'desc' })
    products = res?.products || []
  } catch {
    products = []
  }

  const categorySpotlights = [
    { title: "Men's Streetwear", label: "Shop Men", href: "/products?category=men", bg: "from-neutral-900 to-neutral-800", badge: "POPULAR" },
    { title: "Women's Collection", label: "Shop Women", href: "/products?category=women", bg: "from-neutral-800 to-neutral-900", badge: "NEW" },
    { title: "Outerwear & Jackets", label: "Explore Tops", href: "/products?category=outerwear", bg: "from-neutral-900 to-neutral-700", badge: "TRENDING" },
    { title: "Footwear & Accessories", label: "Shop Accessories", href: "/products?category=accessories", bg: "from-neutral-800 to-black", badge: "HOT" },
  ]

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-neutral-950 text-white overflow-hidden py-24 sm:py-32 px-6">
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10 animate-fade-in">
          <span className="text-xs font-extrabold uppercase tracking-widest bg-white text-black px-3.5 py-1 rounded-full mb-6">
            SweetShop Season 2026
          </span>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter max-w-5xl leading-[0.95] mb-6">
            DON&apos;T STOP. <br className="hidden sm:block" />
            <span className="text-neutral-400">JUST WEAR IT.</span>
          </h1>
          <p className="text-neutral-400 text-base sm:text-xl max-w-2xl mb-10 font-normal leading-relaxed">
            Elevate your rotation with high-performance sportswear, heavy-weight hoodies, and clean athletic apparel engineered for everyday hustle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/products?sortBy=createdAt&order=desc"
              className="bg-white text-black font-extrabold px-8 py-4 rounded-full hover:bg-neutral-200 transition text-sm tracking-wide uppercase text-center"
            >
              Shop New Arrivals
            </Link>
            <Link
              href="/products"
              className="border border-white/30 text-white font-extrabold px-8 py-4 rounded-full hover:bg-white/10 transition text-sm tracking-wide uppercase text-center"
            >
              Explore Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Perks / Value Propositions */}
      <section className="border-b border-neutral-100 bg-neutral-50 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <h4 className="font-bold text-xs uppercase tracking-wider text-black">Free Express Shipping</h4>
            <p className="text-xs text-neutral-500">On orders over 25,000 ₸</p>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="font-bold text-xs uppercase tracking-wider text-black">SweetClub Member Drops</h4>
            <p className="text-xs text-neutral-500">Early access to limited gear</p>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="font-bold text-xs uppercase tracking-wider text-black">30-Day Easy Returns</h4>
            <p className="text-xs text-neutral-500">Hassle-free size exchanges</p>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="font-bold text-xs uppercase tracking-wider text-black">100% Authentic Guaranteed</h4>
            <p className="text-xs text-neutral-500">Verified premium quality</p>
          </div>
        </div>
      </section>

      {/* Category Spotlights Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
              Featured Categories
            </h2>
            <p className="text-neutral-500 text-sm mt-1">Explore gear tailored for every movement</p>
          </div>
          <Link href="/products" className="font-bold text-xs uppercase tracking-wider hover:underline text-black">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categorySpotlights.map((cat, idx) => (
            <Link key={idx} href={cat.href} className="group relative overflow-hidden rounded-2xl h-80 bg-neutral-900 p-6 flex flex-col justify-between nike-card-hover">
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.bg} opacity-90 transition-transform duration-500 group-hover:scale-105`} />
              <div className="relative z-10 flex justify-between items-start">
                <span className="text-[10px] font-extrabold uppercase bg-white/20 backdrop-blur-md text-white px-2.5 py-1 rounded-full">
                  {cat.badge}
                </span>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase text-white tracking-tight mb-2">
                  {cat.title}
                </h3>
                <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-neutral-300 group-hover:text-white transition">
                  {cat.label} <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Drops Carousel / Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
              Trending Drops
            </h2>
            <p className="text-neutral-500 text-sm mt-1">Fresh styles updated daily</p>
          </div>
          <Link href="/products" className="font-bold text-xs uppercase tracking-wider hover:underline text-black">
            Shop All Products →
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
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
                        SweetShop Drop
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                      NEW
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-base text-black group-hover:text-neutral-600 transition">
                        {product.name}
                      </h3>
                      <p className="text-xs text-neutral-500 line-clamp-1 mt-1">
                        {product.description || "Essential athletic sportswear"}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                      {product.variants && product.variants.length > 0 ? (
                        <p className="font-black text-lg text-black">
                          {(Math.min(...product.variants.map((v:any) => v.price)) / 100).toLocaleString()} ₸
                        </p>
                      ) : (
                        <p className="font-black text-lg text-black">15,000 ₸</p>
                      )}
                      <span className="text-xs font-extrabold uppercase tracking-wider text-black group-hover:translate-x-1 transition-transform">
                        Buy →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-neutral-50 rounded-2xl border border-neutral-200">
            <h3 className="font-bold text-lg text-black mb-2">New Season Coming Soon</h3>
            <p className="text-neutral-500 text-sm max-w-md mx-auto mb-6">
              Our catalog is updating with fresh drops. Check back shortly or browse our full selection.
            </p>
            <Link href="/products" className="bg-black text-white px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider">
              Browse Catalog
            </Link>
          </div>
        )}
      </section>

      {/* SweetClub Member Card Banner */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-neutral-900 text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative z-10 max-w-xl">
            <span className="text-xs font-black tracking-widest uppercase text-neutral-400 mb-2 block">
              Member Perks
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mb-4 leading-tight">
              JOIN THE SWEETSHOP CLUB
            </h2>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6">
              Unlock exclusive rewards, first access to limited sneakers & clothing releases, and free express shipping on every purchase.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/auth/register" className="bg-white text-black font-extrabold px-8 py-3.5 rounded-full hover:bg-neutral-200 transition text-xs uppercase tracking-wider">
                Sign Up For Free
              </Link>
              <Link href="/auth/login" className="border border-white/40 text-white font-extrabold px-8 py-3.5 rounded-full hover:bg-white/10 transition text-xs uppercase tracking-wider">
                Sign In
              </Link>
            </div>
          </div>
          <div className="relative z-10 font-black text-9xl text-white/5 uppercase select-none tracking-tighter hidden md:block">
            SWEET
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="border-t border-neutral-100 py-16 px-4 bg-neutral-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mb-3">
            STAY AHEAD OF THE DROP
          </h2>
          <p className="text-neutral-600 text-sm mb-6">
            Subscribe to receive secret discount codes, drop announcements, and style guides.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="bg-white border border-neutral-200 rounded-full px-5 py-3 text-sm flex-1 outline-none focus:ring-2 focus:ring-black text-black"
            />
            <button
              type="submit"
              className="bg-black text-white font-bold px-8 py-3 rounded-full hover:bg-neutral-800 transition text-xs uppercase tracking-wider"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}