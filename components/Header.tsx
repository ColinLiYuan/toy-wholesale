'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { inquiryCartUtils } from '@/lib/inquiry-cart';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const [inquiryCount, setInquiryCount] = useState(0);

  useEffect(() => {
    const fetchInquiryCount = async () => {
      const count = await inquiryCartUtils.getItemCount();
      setInquiryCount(count);
    };

    fetchInquiryCount();

    const interval = setInterval(fetchInquiryCount, 30000);

    const handleInquiryCartUpdate = () => {
      fetchInquiryCount();
    };

    window.addEventListener('inquiryCartUpdated', handleInquiryCartUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('inquiryCartUpdated', handleInquiryCartUpdate);
    };
  }, [isAuthenticated]);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Bulk Orders' },
    { href: '/showroom', label: 'Showroom' },
    { href: '/oem-odm', label: 'OEM/ODM Service' },
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
            <div className="w-8 h-8 bg-brand rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-semibold text-gray-900 hidden sm:block">SinTone</span>
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
            {/* Inquiry Cart Icon - Inquiry Cart Entry */}
            <Link
              href="/inquiry-cart"
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Inquiry Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {inquiryCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {inquiryCount > 9 ? '9+' : inquiryCount}
                </span>
              )}
            </Link>

            {/* WhatsApp Quick Inquiry - 快速询盘 */}
            <a
              href="https://wa.me/8613824423871?text=Hi, I'm interested in your products. Can you provide more information?"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-green-600 hover:text-green-700 transition-colors"
              title="Quick Inquiry via WhatsApp"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </a>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="hidden xl:flex items-center gap-1">
                <span className="text-xs text-gray-500 whitespace-nowrap">Hi, {user?.name}</span>
                <Link href="/my-orders" className="px-2 py-1.5 text-xs font-medium text-brand hover:bg-gray-50 rounded whitespace-nowrap">My Orders</Link>
                <button onClick={logout} className="px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded whitespace-nowrap">Logout</button>
              </div>
            ) : (
              <div className="hidden xl:flex items-center gap-1">
                <Link href="/login" className="px-2 py-1.5 text-xs font-medium text-brand hover:bg-gray-50 rounded whitespace-nowrap">Login</Link>
                <Link href="/register" className="px-2 py-1.5 text-xs font-medium text-white bg-brand rounded hover:bg-brand-hover whitespace-nowrap">Register</Link>
              </div>
            )}

            {/* CTA Button */}
            <Link
              href="/contact"
              className="px-3 py-1.5 bg-brand text-white text-xs font-semibold rounded hover:bg-brand-hover whitespace-nowrap flex-shrink-0"
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
                      ? 'text-brand bg-gray-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Inquiry Cart */}
              <Link
                href="/inquiry-cart"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 text-sm font-medium text-brand hover:bg-gray-50 flex items-center justify-between"
              >
                <span>Inquiry Cart</span>
                {inquiryCount > 0 && (
                  <span className="bg-brand text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {inquiryCount > 9 ? '9+' : inquiryCount}
                  </span>
                )}
              </Link>

              {/* WhatsApp Quick Inquiry */}
              <a
                href="https://wa.me/8613824423871?text=Hi, I'm interested in your products. Can you provide more information?"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Quick Inquiry via WhatsApp
              </a>
              
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-500">Hi, {user?.name}</div>
                  <Link href="/my-orders" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-sm font-medium text-brand hover:bg-gray-50">My Orders</Link>
                  <button onClick={() => { logout(); setIsMenuOpen(false); }} className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 text-left">Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-sm font-medium text-brand hover:bg-gray-50">Login</Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-sm font-medium text-white bg-brand rounded">Register</Link>
                </>
              )}
              
              <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="mt-2 px-4 py-2 bg-brand text-white text-sm font-semibold rounded text-center">Get Price List</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
