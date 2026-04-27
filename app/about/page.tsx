import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us - Silvibe Wholesale | Direct from Dongguan Factory',
  description: 'Learn about Silvibe Wholesale - your trusted wholesale partner based in Dongguan, China. Direct factory access, supply chain advantages, low MOQ.',
  keywords: ['about us', 'Silvibe wholesale', 'dongguan supplier', 'adult toys distributor', 'direct factory', 'china wholesale'],
  openGraph: {
    title: 'About Us - Silvibe Wholesale',
    description: 'Your trusted wholesale partner with direct Dongguan factory access',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-[#F8F9FA] border-b border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#1A1A1A]">
            About Silvibe
          </h1>
          <p className="text-xl text-[#6C757D] max-w-3xl mx-auto">
            Your personal wholesale partner based in Dongguan, China. Direct factory access with supply chain advantages.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#1A1A1A] mb-6">Our Story</h2>
              <div className="space-y-4 text-[#6C757D] text-lg leading-relaxed">
                <p>
                  Based in Dongguan, the manufacturing heart of China, Silvibe was founded with a simple mission: to provide direct factory access to quality adult wellness products for retailers and e-commerce businesses worldwide.
                </p>
                <p>
                  As a specialized wholesale supplier, we offer personalized service that large distributors can't match. We work directly with trusted factories in Dongguan and Shenzhen, ensuring competitive pricing, quality control, and flexible order quantities.
                </p>
                <p>
                  Our location in Dongguan gives us unique supply chain advantages - quick factory visits, faster sample development, and better negotiation power. This means better prices and faster turnaround for your business.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#0056B3]/10 to-[#0056B3]/5 rounded-2xl p-8 border border-[#0056B3]/20">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0056B3]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#0056B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A1A] mb-1">Dongguan Location</h3>
                    <p className="text-sm text-[#6C757D]">Strategic position in China's manufacturing hub with direct factory access</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0056B3]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#0056B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A1A] mb-1">Supply Chain Advantage</h3>
                    <p className="text-sm text-[#6C757D]">Quick factory visits, faster samples, better pricing through direct relationships</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0056B3]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#0056B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A1A] mb-1">Personal Service</h3>
                    <p className="text-sm text-[#6C757D]">Dedicated account managers providing personalized attention to each partner's needs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 px-6 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1A1A1A] mb-4">What We Offer</h2>
            <p className="text-xl text-[#6C757D] max-w-3xl mx-auto">
              Comprehensive wholesale solutions tailored for your business needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-[#0056B3]/10 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#0056B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Low MOQ</h3>
              <p className="text-[#6C757D]">
                Start small with minimum orders from just 20 pieces. Perfect for testing new products or growing businesses.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-[#0056B3]/10 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#0056B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Competitive Pricing</h3>
              <p className="text-[#6C757D]">
                Direct factory partnerships mean better margins for your business. Transparent wholesale pricing with no hidden fees.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-[#0056B3]/10 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#0056B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Dropshipping Friendly</h3>
              <p className="text-[#6C757D]">
                We support dropshipping with discreet packaging and direct-to-customer shipping options.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-[#0056B3]/10 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#0056B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Quality Guarantee</h3>
              <p className="text-[#6C757D]">
                All products are body-safe, certified, and tested. We maintain strict quality control standards.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-[#0056B3]/10 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#0056B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Fast Processing</h3>
              <p className="text-[#6C757D]">
                Orders processed within 24-48 hours. Express shipping options available for urgent needs.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-[#0056B3]/10 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#0056B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Dedicated Support</h3>
              <p className="text-[#6C757D]">
                Personal account managers and responsive customer service to help your business grow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1A1A1A] mb-4">Our Product Range</h2>
            <p className="text-xl text-[#6C757D] max-w-3xl mx-auto">
              Curated selection of premium adult wellness products
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Silicone Vibrators', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
              { name: 'Male Pleasure Devices', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
              { name: 'BDSM & Bondage', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
              { name: 'Adult Lingerie', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
            ].map((category, index) => (
              <div key={index} className="bg-[#F8F9FA] rounded-xl p-6 text-center border border-gray-200 hover:border-[#0056B3] transition-colors">
                <div className="w-16 h-16 rounded-full bg-[#0056B3]/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#0056B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={category.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#1A1A1A]">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#0056B3] to-[#004494] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Partner With Us?</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              The Silvibe advantage: personalized service with factory-direct pricing
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">100+</div>
              <div className="text-white/80">Trusted Factories</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">20pcs</div>
              <div className="text-white/80">Minimum Order</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">24h</div>
              <div className="text-white/80">Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-6">
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl text-[#6C757D] mb-10">
            Join our wholesale network today and get access to premium products, competitive pricing, and dedicated support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-10 py-5 rounded-lg bg-[#0056B3] text-white font-bold text-lg hover:bg-[#004494] transition-all shadow-sm"
            >
              Become a Partner
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-5 rounded-lg border-2 border-[#1A1A1A] text-[#1A1A1A] font-bold text-lg hover:bg-[#1A1A1A] hover:text-white transition-all"
            >
              Contact Sales Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
