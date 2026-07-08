'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import InquiryModal from '@/components/InquiryModal';
import { R2_BASE_URL } from '@/lib/r2-config';
import type { Product } from '@/types';

export default function HomePageClient({
  initialFeaturedProducts = [],
  initialNewProducts = [],
}: {
  initialFeaturedProducts?: Product[];
  initialNewProducts?: Product[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(initialFeaturedProducts);
  const [newProducts, setNewProducts] = useState<Product[]>(initialNewProducts);
  const [loading, setLoading] = useState(initialFeaturedProducts.length === 0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9356';
        const [hotRes, newRes] = await Promise.all([
          fetch(`${apiBaseUrl}/api/v1/products/featured?tag=首页推荐&limit=8`, { headers: { 'X-Site-Id': 'toy' } }),
          fetch(`${apiBaseUrl}/api/v1/products/featured?tag=新品&limit=4`, { headers: { 'X-Site-Id': 'toy' } }),
        ]);
        if (hotRes.ok) {
          const data = await hotRes.json();
          if (data.code === 200 && data.data) setFeaturedProducts(data.data);
        }
        if (newRes.ok) {
          const data = await newRes.json();
          if (data.code === 200 && data.data) setNewProducts(data.data);
        }
      } catch (error) {
        console.error('获取产品失败:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const stats = [
    { value: '100+', label: 'Partner Factories', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { value: '50+', label: 'Countries Served', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { value: '20 pcs', label: 'Low MOQ', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { value: '24h', label: 'Quick Response', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  const categories = [
    { name: 'Silicone Vibrators', slug: 'silicone-vibrators', desc: 'Medical-grade silicone, waterproof, rechargeable, multiple stimulation modes.', gradient: 'from-brand to-blue-500' },
    { name: 'Male Pleasure Tech', slug: 'male-pleasure-tech', desc: 'Prostate massagers, automatic masturbators, vibrating rings with remote control.', gradient: 'from-brand-hover to-blue-600' },
    { name: 'BDSM & Bondage', slug: 'bdsm-bondage', desc: 'Soft restraints, blindfolds, impact play, and beginner-to-advanced bondage kits.', gradient: 'from-blue-900 to-brand' },
    { name: 'Lingerie & Apparel', slug: 'lingerie-apparel', desc: 'Lace bodysuits, role-play costumes, adjustable sizing for diverse markets.', gradient: 'from-blue-950 to-brand-hover' },
  ];

  const advantages = [
    { icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Factory-Direct Pricing', desc: 'Based in Dongguan, the manufacturing hub. No middlemen — you get genuine wholesale rates directly from source.' },
    { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Certified & Compliant', desc: 'FDA, CE, RoHS compliant. Medical-grade silicone. Every batch QC inspected before leaving the factory.' },
    { icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', title: 'OEM / ODM Ready', desc: 'Custom logos, packaging, colors, materials. Full product development from concept to production. Your brand, built here.' },
    { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', title: 'Global Logistics', desc: 'DHL, UPS, YunExpress partnerships. Air and sea freight options. Discreet plain packaging with no exterior branding.' },
    { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', title: 'Discreet Shipping', desc: 'Plain boxes, neutral sender info, secure inner wrapping. Your customers\' privacy is our top priority in every shipment.' },
    { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', title: 'Dedicated Support', desc: 'Personal account manager, multilingual team, WhatsApp communication. Real human support throughout your order journey.' },
  ];

  const steps = [
    { step: 1, title: 'Browse & Select', desc: 'Explore our catalog. Pick products that match your market and customer profile.' },
    { step: 2, title: 'Request a Quote', desc: 'Tell us quantities and destination. We respond with detailed wholesale pricing fast.' },
    { step: 3, title: 'Confirm & Pay', desc: 'Review proforma invoice. Secure payment via T/T, PayPal, or wire transfer.' },
    { step: 4, title: 'Production & Shipping', desc: 'We manufacture, QC, pack, and ship. Real-time tracking from factory to your door.' },
  ];

  function productImageUrl(product: Product) {
    if (!product.image) return '/placeholder-product.svg';
    return product.image.startsWith('http') ? product.image : `${R2_BASE_URL}/${product.image}`;
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ============================================
          1. Hero
      ============================================ */}
      <section className="relative min-h-[90vh] flex items-center pt-16 bg-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-brand/3 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-surface to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand/20 bg-brand/5">
                <span className="w-2 h-2 rounded-full bg-brand" />
                <span className="text-sm text-brand font-semibold tracking-wide">Dongguan Factory Direct</span>
              </div>
              <div className="space-y-5">
                <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.08] tracking-tight text-text-primary">
                  Premium Adult Toys<br />
                  Wholesale, Direct<br />
                  from Factory
                </h1>
                <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-lg">
                  Medical-grade silicone products for global retailers and distributors. Low MOQ, OEM/ODM branding, dedicated account support — all from Dongguan&apos;s manufacturing hub.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="/products" className="group inline-flex items-center justify-center px-8 py-4 rounded-xl bg-brand text-white font-semibold text-lg hover:bg-brand-hover transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5">
                  Browse Catalog
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-[#D1D5DB] text-text-primary font-semibold text-lg hover:border-brand hover:text-brand transition-all duration-200">
                  Request Pricing
                </button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-[4/5] bg-gradient-to-br from-surface via-white to-gray-200 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-gray-100">
                <img src={`${R2_BASE_URL}/toy/home_product.jpg`} alt="Medical-grade silicone product — wholesale supplier" className="w-full h-full object-contain p-6" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg border border-gray-100 px-5 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-text-primary">FDA / CE Certified</div>
                  <div className="text-xs text-text-secondary">Medical-grade quality</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          2. Hot Products
      ============================================ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4 tracking-tight">
              Hot Selling Products
            </h2>
            <p className="text-lg text-text-secondary max-w-xl mx-auto">
              Proven sellers across global markets. Medical-grade silicone, competitive wholesale pricing.
            </p>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-56 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="relative h-56 bg-surface flex items-center justify-center overflow-hidden">
                    <img
                      src={productImageUrl(product)}
                      alt={product.alt || product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.src = '/placeholder-product.svg'; }}
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-brand text-white text-xs font-semibold rounded-md shadow">
                      HOT
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm font-semibold text-text-primary mb-2 group-hover:text-brand transition-colors line-clamp-2 leading-snug">
                      {product.title || product.name}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-text-secondary mb-3">
                      {product.material && <span>{product.material}</span>}
                      {product.minOrder && product.minOrder > 0 && (
                        <span className="text-brand font-semibold">MOQ: {product.minOrder} pcs</span>
                      )}
                    </div>
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-text-muted">Wholesale</span>
                      <span className="text-sm font-bold text-brand group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Get Quote
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-text-secondary text-lg">No featured products yet</p>
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/products" className="inline-flex items-center gap-2 text-brand font-semibold hover:text-brand-hover transition-colors">
              View Full Catalog
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          3. New Arrivals
      ============================================ */}
      {newProducts.length > 0 && (
        <section className="py-20 lg:py-28 bg-surface">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4 tracking-tight">
                New Arrivals
              </h2>
              <p className="text-lg text-text-secondary max-w-xl mx-auto">
                Latest additions to our wholesale catalog. Be the first to offer these to your market.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="relative h-56 bg-white flex items-center justify-center overflow-hidden">
                    <img
                      src={productImageUrl(product)}
                      alt={product.alt || product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.src = '/placeholder-product.svg'; }}
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-accent-green text-white text-xs font-semibold rounded-md shadow">
                      NEW
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm font-semibold text-text-primary mb-2 group-hover:text-brand transition-colors line-clamp-2 leading-snug">
                      {product.title || product.name}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-text-secondary">
                      {product.material && <span>{product.material}</span>}
                      {product.minOrder && product.minOrder > 0 && (
                        <span className="text-accent-green font-semibold">MOQ: {product.minOrder} pcs</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================
          4. Stats
      ============================================ */}
      <section className="py-14 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center group">
                <div className="w-14 h-14 rounded-2xl bg-surface group-hover:bg-brand/10 flex items-center justify-center mx-auto mb-4 transition-colors">
                  <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon} />
                  </svg>
                </div>
                <div className="text-3xl md:text-4xl font-extrabold text-text-primary mb-1">{s.value}</div>
                <div className="text-sm text-text-secondary font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          5. Product Categories
      ============================================ */}
      <section className="py-20 lg:py-28 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4 tracking-tight">
              Product Categories
            </h2>
            <p className="text-lg text-text-secondary max-w-xl mx-auto">
              Full catalog organized by market segment. Every product available for OEM branding.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/products?category=${cat.slug}`} className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`h-1.5 w-full bg-gradient-to-r ${cat.gradient}`} />
                <div className="p-7">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center mb-5 shadow-sm`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-brand transition-colors">{cat.name}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-4">{cat.desc}</p>
                  <span className="inline-flex items-center text-sm font-semibold text-brand">
                    Browse
                    <svg className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          6. Why Partner With Us
      ============================================ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4 tracking-tight">
              Why Partner With SinTone
            </h2>
            <p className="text-lg text-text-secondary max-w-xl mx-auto">
              Dongguan factory access. No middlemen. Personalized wholesale service to grow your business.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {advantages.map((item, i) => (
              <div key={i} className="group relative bg-white border border-gray-100 rounded-2xl p-7 hover:border-brand/20 hover:shadow-lg transition-all duration-200">
                <div className="absolute left-0 top-6 bottom-6 w-0.5 bg-brand opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                <div className="w-11 h-11 rounded-xl bg-brand/8 flex items-center justify-center mb-5 group-hover:bg-brand/12 transition-colors">
                  <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          7. How to Order
      ============================================ */}
      <section className="py-20 lg:py-28 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4 tracking-tight">
              How to Order
            </h2>
            <p className="text-lg text-text-secondary max-w-xl mx-auto">
              Simple process from browsing to delivery. We handle the complexity.
            </p>
          </div>
          <div className="relative">
            <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gray-200" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((s, i) => (
                <div key={i} className="relative bg-white rounded-2xl border border-gray-100 p-7 hover:shadow-md transition-all duration-200 text-center">
                  <div className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center mx-auto mb-5 text-lg font-extrabold shadow-md relative z-10">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-2">{s.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          8. CTA
      ============================================ */}
      <section className="relative py-20 lg:py-28 bg-brand overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-white" />
        </div>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Ready to Stock Your Shelves?
          </h2>
          <p className="text-xl text-white/70 mb-10 max-w-xl mx-auto leading-relaxed">
            Join retailers in 50+ countries sourcing premium adult toys from Dongguan. Competitive pricing, OEM branding, global delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center justify-center px-10 py-4 rounded-xl bg-white text-brand font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Contact Sales
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/sample-kit" className="inline-flex items-center justify-center px-10 py-4 rounded-xl border-2 border-white/30 text-white font-bold text-lg hover:bg-white/10 transition-all">
              Request Sample Kit
            </Link>
          </div>
        </div>
      </section>

      <InquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
