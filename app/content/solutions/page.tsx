import Link from 'next/link';
import type { Metadata } from 'next';
import translations from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Wholesale Solutions - LuxeAdult Global Distribution',
  description: 'Tailored wholesale solutions for online stores, physical retailers, dropshippers, and distributors worldwide. Flexible MOQ and fast global shipping.',
  keywords: ['wholesale solutions', 'adult toys distribution', 'retail partnership', 'dropshipping program', 'bulk orders', 'global shipping'],
  openGraph: {
    title: 'Wholesale Solutions for Adult Toys - LuxeAdult',
    description: 'Tailored wholesale solutions for retailers, distributors, and e-commerce businesses worldwide',
    type: 'website',
  },
};

export default function SolutionsPage() {

  const solutions = [
    {
      title: translations.solutions.pharma.title,
      description: translations.solutions.pharma.description,
      icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
      gradient: 'from-blue-900/40 to-purple-900/40',
      features: ['Micro-text Encoding', 'UV Ink Integration', 'Serialization Compliance', 'Track & Trace Ready'],
      color: '#00F2FE',
    },
    {
      title: translations.solutions.beauty.title,
      description: translations.solutions.beauty.description,
      icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
      gradient: 'from-pink-900/40 to-rose-900/40',
      features: ['Premium Aesthetics', 'Custom Finishes', 'Luxury Brand Enhancement', 'Consumer Engagement'],
      color: '#FFD700',
    },
    {
      title: translations.solutions.liquor.title,
      description: translations.solutions.liquor.description,
      icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      gradient: 'from-red-900/40 to-orange-900/40',
      features: ['Tamper-Evident Seals', 'Destructive Labels', 'Brand Protection', 'Anti-Refill Technology'],
      color: '#EF4444',
    },
    {
      title: translations.solutions.documents.title,
      description: translations.solutions.documents.description,
      icon: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9',
      gradient: 'from-green-900/40 to-teal-900/40',
      features: ['HRI Overlay Technology', 'Multi-Spectral Features', 'Government-Grade Security', 'Biometric Integration'],
      color: '#10B981',
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505]" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(0, 242, 254, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 242, 254, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-[#00F2FE]/30 bg-[#00F2FE]/5 mb-6">
              <span className="text-sm text-[#00F2FE] font-medium tracking-wide">Industry Solutions</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#E5E5E5] mb-6">
              {translations.solutions.title}
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {translations.solutions.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <div key={index} className="group relative overflow-hidden rounded-2xl border border-white/10 hover:border-opacity-50 transition-all duration-500" style={{ borderColor: `${solution.color}30` }}>
                <div className={`absolute inset-0 bg-gradient-to-br ${solution.gradient} opacity-50`} />
                <div className="absolute inset-0 bg-[#0A0A0A]/70" />
                
                <div className="relative p-8 md:p-10">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center mb-6">
                    <svg className="w-8 h-8" style={{ color: solution.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={solution.icon} />
                    </svg>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-bold text-[#E5E5E5] mb-4">
                    {solution.title}
                  </h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {solution.description}
                  </p>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {solution.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: solution.color }} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    href="/contact"
                    className="inline-flex items-center font-medium hover:gap-2 transition-all"
                    style={{ color: solution.color }}
                  >
                    Request Solution Details
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00F2FE]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FFD700]/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#E5E5E5] mb-6">
            Need a Custom Solution?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Our security experts will design a tailored solution for your specific industry requirements.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-10 py-5 rounded-lg bg-gradient-to-r from-[#00F2FE] to-[#00C4CC] text-[#050505] font-bold text-lg hover:shadow-[0_0_40px_rgba(0,242,254,0.6)] transition-all duration-300 transform hover:-translate-y-1"
          >
            Contact Security Experts
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
