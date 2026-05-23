import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request Product Samples — Evaluate Quality First',
  description: 'Request product samples to evaluate our premium adult wellness products before placing bulk orders. Quality guaranteed with competitive wholesale pricing.',
  keywords: ['product samples', 'adult toys samples', 'quality testing', 'wholesale samples', 'bulk order evaluation'],
  openGraph: {
    title: 'Request Product Samples — Evaluate Quality First | Silvibe',
    description: 'Experience our premium adult wellness products with free samples',
    type: 'website',
  },
  alternates: {
    canonical: '/sample-kit',
  },
};

export default function SampleKitPage() {

  const kitContents = [
    {
      category: 'Silicone Vibrators',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      color: '#0056B3',
      items: [
        { name: 'Bullet Vibrator Classic', spec: 'Body-safe silicone, 10 vibration modes' },
        { name: 'Wand Massager Pro', spec: 'Premium silicone, USB rechargeable' },
        { name: 'Rabbit Vibrator Deluxe', spec: 'Dual motor, waterproof IPX7' },
        { name: 'G-Spot Vibrator Ergonomic', spec: 'Medical-grade silicone, flexible' },
        { name: 'Clitoral Stimulator Air Pulse', spec: 'Contactless stimulation, compact' },
      ],
    },
    {
      category: 'Male Pleasure Devices',
      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      color: '#0056B3',
      items: [
        { name: 'Prostate Massager Advanced', spec: 'Medical silicone, remote control' },
        { name: 'Cock Ring Vibrating', spec: 'Stretchable silicone, 3 modes' },
        { name: 'Male Masturbator Sleeve', spec: 'TPE material, realistic texture' },
        { name: 'Penis Pump Deluxe', spec: 'ABS + silicone, pressure gauge' },
        { name: 'Anal Plug Set (3 sizes)', spec: 'Body-safe silicone, flared base' },
      ],
    },
    {
      category: 'Couples & Accessories',
      icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      color: '#0056B3',
      items: [
        { name: 'Couple Ring Vibrator', spec: 'Wearable, app control' },
        { name: 'Remote Control Egg', spec: 'Discreet, long-distance play' },
        { name: 'Bondage Kit Starter', spec: 'Cuffs, blindfold, feather' },
        { name: 'Lingerie Set Premium', spec: 'Lace, adjustable, multiple sizes' },
        { name: 'Massage Oil & Lubricant Set', spec: 'Natural ingredients, skin-safe' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-[#F8F9FA] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-[#0056B3]/30 bg-[#0056B3]/5 mb-6">
              <span className="text-sm text-[#0056B3] font-medium tracking-wide">Free Samples for Qualified Buyers</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#1A1A1A] mb-6">
              Request Product Samples
            </h1>
            <p className="text-xl text-[#6C757D] max-w-3xl mx-auto">
              Evaluate our premium adult wellness products firsthand. Each sample kit contains carefully selected items to demonstrate our quality and variety.
            </p>
          </div>
        </div>
      </section>

      {/* Kit Contents */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Overview Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
              <div className="text-4xl font-bold text-[#0056B3] mb-2">15+</div>
              <div className="text-[#6C757D]">Product Samples</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
              <div className="text-4xl font-bold text-[#0056B3] mb-2">3</div>
              <div className="text-[#6C757D]">Product Categories</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
              <div className="text-4xl font-bold text-[#0056B3] mb-2">Free</div>
              <div className="text-[#6C757D]">Shipping Worldwide</div>
            </div>
          </div>

          {/* Detailed Contents */}
          <div className="space-y-12">
            {kitContents.map((category, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                {/* Category Header */}
                <div className="p-8 border-b border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0056B3]/10 flex items-center justify-center">
                      <svg className="w-6 h-6" style={{ color: category.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={category.icon} />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-[#1A1A1A]">{category.category}</h3>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-4">
                    {category.items.map((item, idx) => (
                      <div key={idx} className="flex items-start p-4 rounded-lg bg-[#F8F9FA] hover:bg-gray-100 transition-colors">
                        <div className="w-2 h-2 rounded-full mt-2 mr-4 flex-shrink-0" style={{ backgroundColor: category.color }} />
                        <div>
                          <div className="font-semibold text-[#1A1A1A] mb-1">{item.name}</div>
                          <div className="text-sm text-[#6C757D]">{item.spec}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Section */}
      <section className="py-20 bg-[#F8F9FA] border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-6">
            Ready to Evaluate Our Products?
          </h2>
          <p className="text-xl text-[#6C757D] mb-10">
            Request your free sample kit today. Our team will prepare a customized selection based on your business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-5 rounded-lg bg-[#0056B3] text-white font-bold text-lg hover:bg-[#004494] transition-all shadow-sm"
            >
              Request Sample Kit
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-10 py-5 rounded-lg border-2 border-[#1A1A1A] text-[#1A1A1A] font-bold text-lg hover:bg-[#1A1A1A] hover:text-white transition-all"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
