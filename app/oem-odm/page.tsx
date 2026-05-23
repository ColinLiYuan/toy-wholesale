import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OEM/ODM Services — Custom Adult Toy Branding',
  description: 'Professional OEM/ODM services for adult toys. Custom branding, logo printing, packaging design, and product development from our Dongguan factory. Low MOQ, fast turnaround.',
  keywords: ['OEM adult toys', 'ODM services', 'custom branding', 'private label adult toys', 'product customization', 'custom packaging'],
  alternates: {
    canonical: '/oem-odm',
  },
};

export default function OemOdmPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-[#0056B3] to-[#004494] text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            OEM/ODM Custom Manufacturing
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Transform your brand vision into reality with our comprehensive custom manufacturing services in Dongguan, China's manufacturing hub.
          </p>
        </div>
      </section>

      {/* Service Overview */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl font-bold text-[#1A1A1A] mb-6">Your Brand, Your Product, Your Market</h2>
              <p className="text-lg text-[#6C757D] leading-relaxed mb-6">
                With 100+ trusted factory partnerships across Dongguan and Shenzhen, we offer end-to-end OEM/ODM solutions that let you launch your own branded adult toy line without the complexity of managing factories yourself.
              </p>
              <p className="text-lg text-[#6C757D] leading-relaxed mb-6">
                From concept to delivery, our team handles everything — material sourcing, mold development, production, quality control, packaging, and logistics. You focus on sales and marketing.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F8F9FA] rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-[#0056B3]">100+</div>
                  <div className="text-sm text-[#6C757D]">Partner Factories</div>
                </div>
                <div className="bg-[#F8F9FA] rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-[#0056B3]">7-15</div>
                  <div className="text-sm text-[#6C757D]">Day Sample Turnaround</div>
                </div>
                <div className="bg-[#F8F9FA] rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-[#0056B3]">50+</div>
                  <div className="text-sm text-[#6C757D]">Countries Served</div>
                </div>
                <div className="bg-[#F8F9FA] rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-[#0056B3]">500+</div>
                  <div className="text-sm text-[#6C757D]">Custom SKUs Delivered</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF] rounded-2xl p-8 border border-gray-200">
              <div className="aspect-video bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <div className="text-center p-8">
                  <svg className="w-24 h-24 mx-auto text-[#0056B3]/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  <p className="text-gray-400 text-sm">Custom product design process</p>
                </div>
              </div>
              <p className="text-center text-sm text-[#6C757D]">
                From concept sketch to finished product — we manage the entire process
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OEM Service Details */}
      <section className="py-20 px-6 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1A1A1A] mb-4">OEM Services</h2>
            <p className="text-xl text-[#6C757D] max-w-3xl mx-auto">
              Original Equipment Manufacturing — use our existing product designs with your branding
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Logo Printing',
                desc: 'Laser engraving, silk screen printing, UV printing, or embossed logos on any product surface. High-precision placement with durable, wear-resistant finishes.',
                features: ['Laser engraving', 'Silk screen printing', 'UV digital printing', 'Embossed/debossed logos'],
              },
              {
                title: 'Custom Packaging',
                desc: 'Full packaging design and production matching your brand identity. Choose from luxury gift boxes, retail-ready packaging, or minimalist eco-friendly options.',
                features: ['Luxury gift boxes', 'Retail blister packs', 'White-label boxes', 'Eco-friendly options'],
              },
              {
                title: 'Color Customization',
                desc: 'Match your brand palette exactly. Custom Pantone color matching for silicone products, packaging, and accessories across all product lines.',
                features: ['Pantone color matching', 'Custom color blends', 'Multi-color molding', 'Consistent batch colors'],
              },
            ].map((service, idx) => (
              <div key={idx} className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">{service.title}</h3>
                <p className="text-[#6C757D] text-sm leading-relaxed mb-6">{service.desc}</p>
                <ul className="space-y-2">
                  {service.features.map((f, i) => (
                    <li key={i} className="flex items-center text-sm text-[#6C757D]">
                      <svg className="w-4 h-4 text-[#0056B3] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ODM Service Details */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1A1A1A] mb-4">ODM Services</h2>
            <p className="text-xl text-[#6C757D] max-w-3xl mx-auto">
              Original Design Manufacturing — create entirely new products from your specifications or ideas
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Product Development',
                desc: 'Bring your product concept to life. Our engineering team handles industrial design, 3D modeling, prototyping, and testing to create unique products that stand out in the market.',
                steps: ['Concept review', '3D modeling & CAD', 'Prototype fabrication', 'Testing & refinement'],
              },
              {
                title: 'Material Engineering',
                desc: 'Access our materials science expertise. We help you select the right silicone formulations, TPE blends, and material combinations for optimal feel, durability, and safety compliance.',
                steps: ['Material consultation', 'Formulation testing', 'Safety certification', 'Batch consistency QC'],
              },
              {
                title: 'Electronics Integration',
                desc: 'For motorized products, our EE team designs custom PCB boards, battery solutions, and charging systems. USB-C rechargeable, app-controlled, or remote-operated — we build it.',
                steps: ['Circuit design', 'Battery selection', 'Waterproofing (IPX7)', 'Firmware development'],
              },
            ].map((service, idx) => (
              <div key={idx} className="bg-[#F8F9FA] rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">{service.title}</h3>
                <p className="text-[#6C757D] text-sm leading-relaxed mb-6">{service.desc}</p>
                <div className="space-y-3">
                  {service.steps.map((step, i) => (
                    <div key={i} className="flex items-center text-sm">
                      <span className="w-6 h-6 rounded-full bg-[#0056B3] text-white text-xs flex items-center justify-center mr-3 flex-shrink-0">{i + 1}</span>
                      <span className="text-[#6C757D]">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-20 px-6 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1A1A1A] mb-4">Our OEM/ODM Process</h2>
            <p className="text-xl text-[#6C757D] max-w-3xl mx-auto">
              A streamlined 5-step process from inquiry to delivery
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            {[
              { step: 1, title: 'Consultation', desc: 'Share your requirements, brand guidelines, target market, and budget. We analyze feasibility and provide recommendations.' },
              { step: 2, title: 'Design & Sampling', desc: 'Our team creates design mockups, 3D renders, and physical samples. Iterate until perfect. We move at your pace.' },
              { step: 3, title: 'Production', desc: 'Once samples are approved, we begin mass production with strict QC checkpoints at every stage. MOQ starts from 50-200 pcs depending on complexity.' },
              { step: 4, title: 'Quality Inspection', desc: 'Multi-point QC inspection including material testing, functionality testing, waterproof testing, and packaging verification.' },
              { step: 5, title: 'Shipping & Delivery', desc: 'Secure packaging with your branding. Express courier (DHL/UPS) or sea freight — flexible options based on your timeline and budget.' },
            ].map((phase) => (
              <div key={phase.step} className="flex gap-6 mb-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#0056B3] text-white font-bold text-lg flex items-center justify-center flex-shrink-0">
                    {phase.step}
                  </div>
                  {phase.step < 5 && <div className="w-0.5 h-full bg-[#0056B3]/20 mt-2" />}
                </div>
                <div className="pb-8">
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{phase.title}</h3>
                  <p className="text-[#6C757D] leading-relaxed">{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#0056B3] to-[#004494] text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Ready to Build Your Brand?</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Share your vision with our OEM/ODM team. We'll provide a detailed proposal with pricing, timeline, and sample specifications.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-10 py-5 rounded-lg bg-white text-[#0056B3] font-bold text-lg hover:bg-gray-100 transition-all shadow-lg"
          >
            Start Your OEM/ODM Project
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
