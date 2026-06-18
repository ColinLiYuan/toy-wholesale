import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us — Direct from Dongguan Factory',
  description: 'Learn about Silvibe — your trusted wholesale adult toys partner based in Dongguan, China. Direct factory access, supply chain advantages, low MOQ from 20 pcs.',
  keywords: ['about Silvibe', 'dongguan adult toys supplier', 'adult toys distributor', 'direct factory wholesale', 'china wholesale adult toys'],
  openGraph: {
    title: 'About Us — Silvibe Wholesale',
    description: 'Your trusted wholesale partner with direct Dongguan factory access. Low MOQ, quality guaranteed.',
    type: 'website',
    images: [
      {
        url: 'https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/toy/home_product.jpg',
        width: 1200,
        height: 630,
        alt: 'Silvibe - About Us',
      },
    ],
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative py-20 px-6 bg-surface border-b border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-text-primary">About Silvibe</h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Your personal wholesale partner based in Dongguan, China. Direct factory access with supply chain advantages.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-text-primary mb-6">Our Story</h2>
              <div className="space-y-4 text-text-secondary text-lg leading-relaxed">
                <p>Based in Dongguan, the manufacturing heart of China, Silvibe was founded with a simple mission: to provide direct factory access to quality adult wellness products for retailers and e-commerce businesses worldwide.</p>
                <p>As a specialized wholesale supplier, we offer personalized service that large distributors can't match. We work directly with trusted factories in Dongguan and Shenzhen, ensuring competitive pricing, quality control, and flexible order quantities.</p>
                <p>Our location in Dongguan gives us unique supply chain advantages — quick factory visits, faster sample development, and better negotiation power. This means better prices and faster turnaround for your business.</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-brand/10 to-brand/5 rounded-2xl p-8 border border-brand/20">
              <div className="space-y-6">
                {[
                  { title: 'Dongguan Location', desc: 'Strategic position in China\'s manufacturing hub with direct factory access' },
                  { title: 'Supply Chain Advantage', desc: 'Quick factory visits, faster samples, better pricing through direct relationships' },
                  { title: 'Personal Service', desc: 'Dedicated account managers providing personalized attention to each partner\'s needs' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary mb-1">{item.title}</h3>
                      <p className="text-sm text-text-secondary">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">What We Offer</h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">Comprehensive wholesale solutions tailored for your business needs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Low MOQ', desc: 'Start small with minimum orders from just 20 pieces. Perfect for testing new products or growing businesses.' },
              { title: 'Competitive Pricing', desc: 'Direct factory partnerships mean better margins for your business. Transparent wholesale pricing with no hidden fees.' },
              { title: 'Dropshipping Friendly', desc: 'We support dropshipping with discreet packaging and direct-to-customer shipping options.' },
              { title: 'Quality Guarantee', desc: 'All products are body-safe, certified, and tested. We maintain strict quality control standards.' },
              { title: 'Fast Processing', desc: 'Efficient order handling and dispatch. Express shipping options available for urgent needs.' },
              { title: 'Dedicated Support', desc: 'Personal account managers and responsive customer service to help your business grow.' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-text-primary mb-3">{item.title}</h3>
                <p className="text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-brand to-brand-hover text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Partner With Us?</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">The Silvibe advantage: personalized service with factory-direct pricing</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div><div className="text-5xl font-bold mb-2">100+</div><div className="text-white/80">Trusted Factories</div></div>
            <div><div className="text-5xl font-bold mb-2">20 pcs</div><div className="text-white/80">Minimum Order</div></div>
            <div><div className="text-5xl font-bold mb-2">24h</div><div className="text-white/80">Response Time</div></div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">Ready to Grow Your Business?</h2>
          <p className="text-xl text-text-secondary mb-10">Join our wholesale network today and get access to premium products, competitive pricing, and dedicated support.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center px-10 py-5 rounded-lg bg-brand text-white font-bold text-lg hover:bg-brand-hover transition-all shadow-sm">Become a Partner<svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></Link>
            <Link href="/contact" className="inline-flex items-center justify-center px-10 py-5 rounded-lg border-2 border-text-primary text-text-primary font-bold text-lg hover:bg-text-primary hover:text-white transition-all">Contact Sales Team</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
