'use client';

import { useState } from 'react';
import Link from 'next/link';
import InquiryModal from '@/components/InquiryModal';
import { R2_BASE_URL } from '@/lib/r2-config';

export default function HomePageClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Precise & Professional */}
      <section className="relative min-h-screen flex items-center pt-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-[#1A1A1A]">
                  Certified Medical-Grade<br />Silicone Toys.
                </h1>
                
                <p className="text-xl md:text-2xl text-[#6C757D] leading-relaxed max-w-2xl">
                  Low MOQ for Global Retailers. FDA, CE, RoHS compliant products from Dongguan factory.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="group inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#0056B3] text-white font-semibold text-lg hover:bg-[#004494] transition-all duration-200 shadow-sm"
                >
                  Browse Bulk Orders
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold text-lg hover:bg-[#1A1A1A] hover:text-white transition-all duration-200"
                >
                  Get Catalog & Wholesale Pricing
                </button>
              </div>
            </div>

            {/* Right - Product Image */}
            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-square bg-[#F8F9FA] rounded-2xl overflow-hidden border border-gray-200">
                <img
                  src={`${R2_BASE_URL}/toy/home_product.jpg`}
                  alt="Medical-grade silicone adult toys"
                  className="w-full h-full object-cover"
                />
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

      {/* Compliance Certifications - Trust Signals */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
              Certified & Compliant
            </h2>
            <p className="text-lg text-[#6C757D] max-w-3xl mx-auto">
              All products meet international safety and quality standards
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'FDA', desc: 'Food Grade Silicone' },
              { name: 'CE', desc: 'European Conformity' },
              { name: 'RoHS', desc: 'Hazardous Substances' },
              { name: 'Phthalate-Free', desc: 'Body-Safe Materials' },
            ].map((cert, index) => (
              <div key={index} className="bg-[#F8F9FA] rounded-xl p-6 border border-gray-200 text-center hover:border-[#0056B3] transition-colors">
                <div className="w-16 h-16 rounded-full bg-[#0056B3]/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#0056B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{cert.name}</h3>
                <p className="text-sm text-[#6C757D]">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Material - Key Differentiator */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
              Browse by Material
            </h2>
            <p className="text-xl text-[#6C757D] max-w-3xl mx-auto">
              Professional-grade materials for every market segment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Liquid Silicone',
                grade: 'Medical Grade',
                features: ['Ultra-soft texture', 'Hypoallergenic', 'Easy to clean', 'Premium feel'],
                moq: 'MOQ: 50 pcs',
                bestFor: 'High-end retail brands',
              },
              {
                name: 'Solid Silicone',
                grade: 'Food Grade',
                features: ['Durable construction', 'Cost-effective', 'Good elasticity', 'Wide color range'],
                moq: 'MOQ: 100 pcs',
                bestFor: 'Mid-market retailers',
              },
              {
                name: 'TPE/TPR',
                grade: 'Standard Grade',
                features: ['Budget-friendly', 'Soft touch', 'Realistic feel', 'Entry-level pricing'],
                moq: 'MOQ: 200 pcs',
                bestFor: 'Price-sensitive markets',
              },
            ].map((material, index) => (
              <div key={index} className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-200">
                {/* Material Image Placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF] flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-20 h-20 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <p className="text-gray-400 text-xs">Material sample photo</p>
                  </div>
                </div>

                {/* Material Info */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-[#1A1A1A] mb-1">{material.name}</h3>
                    <span className="inline-block px-3 py-1 bg-[#0056B3]/10 text-[#0056B3] text-xs font-semibold rounded-full">
                      {material.grade}
                    </span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {material.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm">
                        <svg className="w-4 h-4 text-[#0056B3] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[#6C757D]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4 border-t border-gray-100 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[#6C757D]">Minimum Order:</span>
                      <span className="text-sm font-semibold text-[#0056B3]">{material.moq}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#6C757D]">Best For:</span>
                      <span className="text-sm font-medium text-[#1A1A1A]">{material.bestFor}</span>
                    </div>
                  </div>

                  <Link
                    href={`/products?material=${material.name.toLowerCase().replace('/', '-')}`}
                    className="block w-full py-3 rounded-lg bg-[#0056B3] text-white font-semibold text-center hover:bg-[#004494] transition-colors duration-200"
                  >
                    View Products
                  </Link>
                </div>
              </div>
            ))}
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
              Browse our premium collection of medical-grade silicone products
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
                  <div className="space-y-2 mb-4">
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

                  {/* OEM Badge */}
                  <div className="mb-4 p-3 bg-[#0056B3]/5 rounded-lg border border-[#0056B3]/20">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-[#0056B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="text-xs font-semibold text-[#0056B3]">Custom Branding (OEM) Available</span>
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

      {/* Privacy Packaging Promise */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#0056B3]/5 to-[#0056B3]/10 rounded-2xl p-8 md:p-12 border border-[#0056B3]/20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-[#0056B3]/10 rounded-full mb-6">
                  <svg className="w-5 h-5 text-[#0056B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-sm font-semibold text-[#0056B3]">Privacy Guaranteed</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
                  100% Discreet Packaging
                </h2>
                <p className="text-lg text-[#6C757D] mb-6">
                  Your customers' privacy is our priority. All orders ship in plain, unmarked boxes with no product descriptions or branding visible on the exterior.
                </p>
                <ul className="space-y-3">
                  {[
                    'Plain brown boxes or white mailers',
                    'No product names or images on packaging',
                    'Generic sender information',
                    'Secure inner wrapping for protection',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-[#0056B3] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-[#6C757D]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-xl p-8 border border-gray-200">
                <div className="aspect-square bg-[#F8F9FA] rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <svg className="w-32 h-32 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p className="text-gray-400 text-sm">Discreet packaging example</p>
                  </div>
                </div>
                <p className="text-center text-sm text-[#6C757D]">
                  Example: Plain box with shipping label only
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      <InquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
