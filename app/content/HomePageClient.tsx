'use client';

import { useState } from 'react';
import Link from 'next/link';
import InquiryModal from '@/components/InquiryModal';
import messages from '@/lib/i18n';

export default function HomePageClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Clean & Professional */}
      <section className="relative min-h-screen flex items-center pt-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-[#1A1A1A]">
                  Premium Adult Toys<br />at Wholesale Prices.
                </h1>
                
                <p className="text-xl md:text-2xl text-[#6C757D] leading-relaxed max-w-2xl">
                  Sourcing the best brands and unbranded adult wellness products. Low MOQ, fast global shipping, ready for your retail store or e-commerce business.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="group inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#0056B3] text-white font-semibold text-lg hover:bg-[#004494] transition-all duration-200 shadow-sm"
                >
                  Shop Wholesale
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold text-lg hover:bg-[#1A1A1A] hover:text-white transition-all duration-200"
                >
                  Download Price List
                </button>
              </div>
            </div>

            {/* Right - Product Image Placeholder */}
            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-square bg-[#F8F9FA] rounded-2xl overflow-hidden border border-gray-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <svg className="w-32 h-32 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-400 text-sm">High-quality product rendering</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar - Core Capabilities */}
      <section className="py-12 bg-[#F8F9FA] border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[#0056B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-[#1A1A1A]">Low MOQ</div>
                <div className="text-xs text-[#6C757D]">From 20 pcs</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[#0056B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-[#1A1A1A]">Fast Shipping</div>
                <div className="text-xs text-[#6C757D]">Global Delivery</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[#0056B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-[#1A1A1A]">Drop-shipping</div>
                <div className="text-xs text-[#6C757D]">Friendly</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[#0056B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-[#1A1A1A]">Premium Quality</div>
                <div className="text-xs text-[#6C757D]">Selection</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products - Clean Grid Layout */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
              Hot Selling Products
            </h2>
            <p className="text-xl text-[#6C757D] max-w-3xl mx-auto">
              Browse our premium collection of adult wellness products
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Pro Prostate Massager Model X',
                material: 'Liquid Silicone + ABS',
                feature: 'Dual Motor, App Control',
                moq: '50 pcs',
              },
              {
                name: 'Rechargeable Wand Vibrator',
                material: 'Medical Grade Silicone',
                feature: '10 Vibration Modes, IPX7',
                moq: '50 pcs',
              },
              {
                name: 'Luxury Bondage Kit Premium',
                material: 'Genuine Leather',
                feature: '7 Pieces, Adjustable',
                moq: '100 sets',
              },
            ].map((product, index) => (
              <div key={index} className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200">
                {/* Product Image */}
                <div className="relative h-64 bg-[#F8F9FA] flex items-center justify-center">
                  <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">
                    {product.name}
                  </h3>

                  {/* Technical Specs */}
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6C757D]">Material:</span>
                      <span className="text-[#1A1A1A] font-medium">{product.material}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6C757D]">Feature:</span>
                      <span className="text-[#1A1A1A] font-medium">{product.feature}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                      <span className="text-[#6C757D]">MOQ:</span>
                      <span className="text-[#0056B3] font-semibold">{product.moq}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-3 rounded-lg bg-[#0056B3] text-white font-semibold hover:bg-[#004494] transition-colors duration-200"
                  >
                    Request Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Logistics Section */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
              Global Trade Assurance
            </h2>
            <p className="text-xl text-[#6C757D]">
              Certified quality with secure worldwide shipping
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Factory/Packaging Image */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="aspect-video bg-[#F8F9FA] rounded-xl flex items-center justify-center mb-6">
                <div className="text-center">
                  <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p className="text-gray-400 text-sm">Factory / Packaging Sample Photo</p>
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Premium Custom Packaging</h3>
              <p className="text-[#6C757D] text-sm">
                Black-gold gift boxes, white-label options, and fully customizable packaging to match your brand identity.
              </p>
            </div>

            {/* Right - Logistics Partners */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-bold text-[#1A1A1A] mb-4">Shipping Partners</h4>
                <div className="grid grid-cols-3 gap-4">
                  {['DHL', 'UPS', 'YunExpress'].map((partner, idx) => (
                    <div key={idx} className="h-16 bg-[#F8F9FA] rounded-lg flex items-center justify-center border border-gray-200">
                      <span className="text-sm font-semibold text-[#6C757D]">{partner}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-bold text-[#1A1A1A] mb-4">Key Benefits</h4>
                <ul className="space-y-3">
                  {[
                    'Discreet packaging guaranteed',
                    'Global fast shipping (3-7 days)',
                    'Real-time order tracking',
                    'Insurance options available',
                  ].map((benefit, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-[#0056B3] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-[#6C757D]">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      <InquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} translations={messages} />
    </div>
  );
}
