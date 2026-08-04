"use client";
import Link from 'next/link';
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';

export default function Navbar({ authButton }: { authButton: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categoriesNav = [
    { name: "New & Featured", href: "/products?sortBy=createdAt&order=desc" },
    { name: "Men", href: "/products?category=men" },
    { name: "Women", href: "/products?category=women" },
    { name: "Kids", href: "/products?category=kids" },
    { name: "Catalog", href: "/products" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-neutral-100">
      {/* Top Announcement Bar */}
      <div className="bg-black text-white text-xs py-2 px-4 text-center font-medium tracking-wide">
        <span>Free Express Delivery on orders over 25,000 ₸ &nbsp;|&nbsp; </span>
        <Link href="/products?sortBy=createdAt&order=desc" className="underline hover:text-neutral-300 transition">
          Shop New Arrivals
        </Link>
      </div>

      {/* Main Navbar */}
      <nav className={`transition-all duration-200 ${isScrolled ? 'py-3 shadow-xs' : 'py-4'} px-4 sm:px-8 max-w-7xl mx-auto flex items-center justify-between`}>
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <svg className="w-8 h-8 text-black group-hover:scale-105 transition-transform" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          <span className="font-black text-2xl tracking-tighter uppercase text-black">
            SWEETSHOP
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide uppercase">
          {categoriesNav.map((item) => (
            <li key={item.name}>
              <Link 
                href={item.href} 
                className={`transition-colors border-b-2 py-1 ${
                  pathname === item.href 
                    ? 'border-black text-black' 
                    : 'border-transparent text-neutral-700 hover:text-black hover:border-black'
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Action Icons & Search */}
        <div className="flex items-center gap-4">
          {/* Quick Search Box */}
          <form action="/products" method="GET" className="hidden lg:flex items-center bg-neutral-100 rounded-full px-3.5 py-1.5 focus-within:ring-1 focus-within:ring-black">
            <svg className="w-4 h-4 text-neutral-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              name="search" 
              placeholder="Search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs w-28 focus:w-40 transition-all outline-none text-neutral-800 placeholder-neutral-500 font-medium"
            />
          </form>

          {/* Cart Icon */}
          <Link 
            href="/cart" 
            className="p-2 text-neutral-800 hover:text-black hover:bg-neutral-100 rounded-full transition relative"
            title="Cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </Link>

          {/* User Auth */}
          <div className="hidden sm:block">
            {authButton}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-neutral-800 hover:bg-neutral-100 rounded-lg transition"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-4/5 max-w-sm bg-white h-full p-6 flex flex-col justify-between shadow-2xl animate-fade-in">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                <span className="font-black text-xl tracking-tighter uppercase">SWEETSHOP</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-neutral-500 hover:text-black rounded-full"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile Search */}
              <form action="/products" method="GET" className="mt-4 flex items-center bg-neutral-100 rounded-full px-4 py-2">
                <svg className="w-4 h-4 text-neutral-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  name="search" 
                  placeholder="Search products..." 
                  className="bg-transparent text-sm w-full outline-none text-neutral-800"
                />
              </form>

              {/* Navigation Items */}
              <ul className="mt-6 flex flex-col gap-4 text-lg font-bold tracking-tight">
                {categoriesNav.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-neutral-800 hover:text-black transition py-1"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/cart"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-neutral-800 hover:text-black transition py-1"
                  >
                    Shopping Cart
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-neutral-800 hover:text-black transition py-1"
                  >
                    My Account & Orders
                  </Link>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-neutral-100">
              {authButton}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}