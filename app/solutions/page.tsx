import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Wholesale Solutions for Adult Toy Retailers',
  description: 'Tailored wholesale solutions for online stores, physical retailers, dropshippers, and distributors worldwide. Flexible MOQ from 20 pcs, fast global shipping from Dongguan.',
  keywords: ['wholesale solutions', 'adult toys distribution', 'retail partnership', 'dropshipping program', 'bulk orders', 'global shipping'],
  openGraph: {
    title: 'Wholesale Solutions for Adult Toys | Silvibe',
    description: 'Tailored wholesale solutions for retailers, distributors, and e-commerce businesses worldwide',
    type: 'website',
  },
  alternates: {
    canonical: '/solutions',
  },
};

export default function SolutionsPage() {
  const solutions = [
    {
      title: 'Custom Branding (OEM)',
      description: 'Private labeling, logo printing, and custom packaging to build your brand identity. Laser engraving, silk screen, or embossed logos on any product.',
      features: ['Logo printing & engraving', 'Custom packaging design', 'Brand color matching', 'White-label ready'],
      color: '#0056B3',
    },
    {
      title: 'Product Customization (ODM)',
      description: 'Full product development from your specifications. Custom shapes, materials, colors, and features. Our engineering team handles everything from concept to delivery.',
      features: ['Custom product design', 'Material formulation', 'Electronics integration', '3D prototyping'],
      color: '#6B46C1',
    },
    {
      title: 'Volume Discounts',
      description: 'Tiered wholesale pricing that rewards larger orders. Starting from 20 pcs MOQ with escalating discounts at 100, 500, and 1000+ unit quantities.',
      features: ['Tiered pricing structure', 'Bulk order incentives', 'Long-term contract rates', 'Seasonal promotions'],
      color: '#0056B3',
    },
    {
      title: 'Dropshipping Program',
      description: 'Sell without holding inventory. We ship directly to your customers with discreet packaging, no branding on the exterior, and your store name on the label.',
      features: ['No inventory needed', 'Discreet shipping', 'Your brand on labels', 'Global fulfillment'],
      color: '#6B46C1',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="relative py-20 px-6 bg-[#F8F9FA] border-b border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-[#0056B3]/30 bg-[#0056B3]/5 mb-6">
            <span className="text-sm text-[#0056B3] font-medium tracking-wide">Tailored Wholesale Solutions</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#1A1A1A] mb-6">
            Wholesale Solutions
          </h1>
          <p className="text-xl text-[#6C757D] max-w-3xl mx-auto">
            Flexible B2B programs designed for online stores, physical retailers, dropshippers, and distributors worldwide
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <div key={index} className="group bg-white rounded-2xl border border-gray-200 hover:border-[#0056B3]/30 hover:shadow-lg transition-all duration-300 p-8 md:p-10">
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">{solution.title}</h3>
                <p className="text-[#6C757D] mb-6 leading-relaxed">{solution.description}</p>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {solution.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: solution.color }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[#6C757D]">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href="/contact" className="inline-flex items-center font-semibold text-[#0056B3] hover:text-[#004494] transition-colors">
                  Learn More
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#0056B3] text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Need a Custom Solution?</h2>
          <p className="text-xl text-white/80 mb-10">Our team will design a tailored wholesale program for your specific business needs.</p>
          <Link href="/contact" className="inline-flex items-center justify-center px-10 py-5 rounded-lg bg-white text-[#0056B3] font-bold text-lg hover:bg-gray-100 transition-all shadow-lg">
            Contact Our Team
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
