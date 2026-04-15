'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface HeaderProps {
  translations: any;
}

export default function Header({ translations }: HeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Shop Wholesale' },
    { href: '/about', label: 'About Us' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact Us' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#0056B3] p-[2px]">
              <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                <span className="text-[#0056B3] font-bold text-2xl">L</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-wide text-[#1A1A1A] group-hover:text-[#0056B3] transition-colors">
                LuxeAdult
              </span>
              <span className="text-xs text-gray-500 tracking-wider uppercase">Global Distributor of Premium Adult Toys</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? 'text-[#0056B3] bg-[#F8F9FA]'
                    : 'text-[#6C757D] hover:text-[#1A1A1A] hover:bg-[#F8F9FA]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button & Mobile Menu Button */}
          <div className="flex items-center space-x-4">

            {/* CTA Button */}
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center px-5 py-2.5 rounded-lg bg-[#0056B3] text-white font-semibold text-sm hover:bg-[#004494] transition-all duration-200"
            >
              Get Price List
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-[#6C757D] hover:text-[#1A1A1A] hover:bg-[#F8F9FA] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="md:hidden pb-6 border-t border-gray-200 mt-4 pt-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-[#0056B3] bg-[#F8F9FA]'
                      : 'text-[#6C757D] hover:text-[#1A1A1A] hover:bg-[#F8F9FA]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="mt-4 inline-flex items-center justify-center px-5 py-3 rounded-lg bg-[#0056B3] text-white font-semibold text-sm"
              >
                Get Price List
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
