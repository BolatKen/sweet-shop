import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">

          {/* Products */}
          <div>
            <h3 className="font-bold text-sm mb-4">PRODUCTS</h3>
            <ul className="flex flex-col gap-3 text-sm text-gray-300">
              <li><Link href="/products?category=men" className="hover:text-white transition">Men</Link></li>
              <li><Link href="/products?category=women" className="hover:text-white transition">Women</Link></li>
              <li><Link href="/products?category=kids" className="hover:text-white transition">Kids</Link></li>
              <li><Link href="/products?category=accessories" className="hover:text-white transition">Accessories</Link></li>
              <li className="mt-4"><Link href="/products?sortBy=createdAt&order=desc" className="hover:text-white transition">New Arrivals</Link></li>
              <li><Link href="/products?category=sale" className="hover:text-white transition">Sale</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-sm mb-4">CATEGORIES</h3>
            <ul className="flex flex-col gap-3 text-sm text-gray-300">
              <li><Link href="/products?category=outerwear" className="hover:text-white transition">Outerwear</Link></li>
              <li><Link href="/products?category=hoodies" className="hover:text-white transition">Hoodies</Link></li>
              <li><Link href="/products?category=tshirts" className="hover:text-white transition">T-Shirts</Link></li>
              <li><Link href="/products?category=pants" className="hover:text-white transition">Pants</Link></li>
              <li><Link href="/products?category=shoes" className="hover:text-white transition">Shoes</Link></li>
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h3 className="font-bold text-sm mb-4">COLLECTIONS</h3>
            <ul className="flex flex-col gap-3 text-sm text-gray-300">
              <li><Link href="/products" className="hover:text-white transition">Summer 2026</Link></li>
              <li><Link href="/products" className="hover:text-white transition">Essentials</Link></li>
              <li><Link href="/products" className="hover:text-white transition">Streetwear</Link></li>
              <li><Link href="/products" className="hover:text-white transition">Sport</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-sm mb-4">SUPPORT</h3>
            <ul className="flex flex-col gap-3 text-sm text-gray-300">
              <li><Link href="/profile" className="hover:text-white transition">My Orders</Link></li>
              <li><span className="text-gray-500">Returns & Exchanges</span></li>
              <li><span className="text-gray-500">Shipping</span></li>
              <li><span className="text-gray-500">Size Guide</span></li>
              <li><span className="text-gray-500">Contact Us</span></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-sm mb-4">COMPANY</h3>
            <ul className="flex flex-col gap-3 text-sm text-gray-300">
              <li><span className="text-gray-500">About Us</span></li>
              <li><span className="text-gray-500">Careers</span></li>
              <li><span className="text-gray-500">Press</span></li>
              <li><span className="text-gray-500">Sustainability</span></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="font-bold text-sm mb-4">FOLLOW US</h3>
            <div className="flex flex-col gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.02-.06z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
          <p>© 2026 SweetShop</p>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer transition">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition">Terms and Conditions</span>
          </div>
        </div>
      </div>
    </footer>
  )
}