'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import apiClient, { UnwrappedAxiosResponse } from '@/lib/api-client';

interface HeaderProps {
  translations: any;
}

export default function Header({ translations }: HeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  // 获取购物车数量
  useEffect(() => {
    if (isAuthenticated) {
      fetchCartCount();
    }
  }, [isAuthenticated]);

  const fetchCartCount = async () => {
    try {
      const response: UnwrappedAxiosResponse<any> = await apiClient.get('/v1/cart');
      if (response.code === 200 && response.data?.items) {
        const count = response.data.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setCartCount(count);
      }
    } catch (err) {
      console.error('Failed to fetch cart count:', err);
    }
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Shop Wholesale' },
    { href: '/about', label: 'About Us' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact Us' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-14 gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-[#0056B3] rounded flex items-center justify-center">
              <span className="text-white font-bold">L</span>
            </div>
            <span className="font-semibold text-gray-900 hidden sm:block">LuxeAdult</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap flex-shrink-0"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Cart Icon */}
            {isAuthenticated && (
              <Link
                href="/cart"
                data-cart-icon
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="hidden xl:flex items-center gap-1">
                <span className="text-xs text-gray-500 whitespace-nowrap">Hi, {user?.name}</span>
                <Link href="/my-orders" className="px-2 py-1.5 text-xs font-medium text-[#0056B3] hover:bg-gray-50 rounded whitespace-nowrap">My Orders</Link>
                <button onClick={logout} className="px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded whitespace-nowrap">Logout</button>
              </div>
            ) : (
              <div className="hidden xl:flex items-center gap-1">
                <Link href="/login" className="px-2 py-1.5 text-xs font-medium text-[#0056B3] hover:bg-gray-50 rounded whitespace-nowrap">Login</Link>
                <Link href="/register" className="px-2 py-1.5 text-xs font-medium text-white bg-[#0056B3] rounded hover:bg-[#004494] whitespace-nowrap">Register</Link>
              </div>
            )}

            {/* CTA Button */}
            <Link
              href="/contact"
              className="px-3 py-1.5 bg-[#0056B3] text-white text-xs font-semibold rounded hover:bg-[#004494] whitespace-nowrap flex-shrink-0"
            >
              Get Price List
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-200 mt-2 pt-4">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? 'text-[#0056B3] bg-gray-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-500">Hi, {user?.name}</div>
                  <Link href="/cart" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-sm font-medium text-[#0056B3] hover:bg-gray-50 flex items-center gap-2">
                    Shopping Cart
                    {cartCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </Link>
                  <Link href="/my-orders" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-sm font-medium text-[#0056B3] hover:bg-gray-50">My Orders</Link>
                  <button onClick={() => { logout(); setIsMenuOpen(false); }} className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 text-left">Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-sm font-medium text-[#0056B3] hover:bg-gray-50">Login</Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-sm font-medium text-white bg-[#0056B3] rounded">Register</Link>
                </>
              )}
              
              <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="mt-2 px-4 py-2 bg-[#0056B3] text-white text-sm font-semibold rounded text-center">Get Price List</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
