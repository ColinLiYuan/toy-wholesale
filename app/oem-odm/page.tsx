import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OEM/ODM Services - Custom Branding | Silvibe',
  description: 'Professional OEM/ODM services for adult toys. Custom branding, packaging design, and product customization from Dongguan factory.',
  keywords: ['OEM adult toys', 'ODM services', 'custom branding', 'private label', 'product customization'],
};

export default function OemOdmPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-[#1A1A1A] mb-6">
            OEM/ODM Services
          </h1>
          <p className="text-xl text-[#6C757D] max-w-3xl mx-auto">
            Professional custom branding and product development services from our Dongguan factory
          </p>
        </div>

        {/* Content Placeholder */}
        <div className="bg-[#F8F9FA] rounded-2xl p-12 border border-gray-200 text-center">
          <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">Custom Branding Solutions</h2>
          <p className="text-[#6C757D] mb-8 max-w-2xl mx-auto">
            From logo printing to complete product customization, we offer comprehensive OEM/ODM services to help you build your brand.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-[#1A1A1A] mb-2">Logo Printing</h3>
              <p className="text-sm text-[#6C757D]">Laser engraving, silk screen, or embossed logos</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-[#1A1A1A] mb-2">Custom Packaging</h3>
              <p className="text-sm text-[#6C757D]">Design and produce packaging that matches your brand</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-[#1A1A1A] mb-2">Product Development</h3>
              <p className="text-sm text-[#6C757D]">Create unique products based on your specifications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
